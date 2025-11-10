#!/usr/bin/env bash

set -e

# Get the real host path by checking the mount source
# The devcontainer mounts the host workspace to /workspaces
MOUNT_INFO=$(findmnt -n -o SOURCE /workspaces 2>/dev/null | head -1)

if [ -n "$MOUNT_INFO" ]; then
    # Extract the path from the bracket notation: /dev/disk/by-uuid/xxx[/actual/path] -> /actual/path
    if [[ "$MOUNT_INFO" =~ \[([^]]+)\] ]]; then
        HOST_PROJECT_PATH="${BASH_REMATCH[1]}"
    else
        HOST_PROJECT_PATH="$MOUNT_INFO"
    fi
else
    echo "Could not determine host workspace path from findmnt"
    echo "Trying alternative approach..."
    # Fallback: try to extract from /proc/mounts
    HOST_PROJECT_PATH=$(awk '/\/workspaces/ {print $1; exit}' /proc/mounts)
fi

if [ -z "$HOST_PROJECT_PATH" ]; then
    echo "Error: Could not determine host workspace path"
    exit 1
fi

echo "Host project path: $HOST_PROJECT_PATH"

FONT_DIR="assets/fonts"
OUTPUT_DIR="static/fonts"
CSS_OUTPUT="static/fonts/fonts.css"
UNICODE_RANGES="U+0020-00FF,U+0100-017F,U+0180-024F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF"

rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

sudo docker run --rm -v "$HOST_PROJECT_PATH:/app" -w /app node:24 bash -c "

npm install -g glyphhanger
apt-get update && apt-get install -y fontforge python3-fontforge fonttools --no-install-recommends
rm -rf /var/lib/apt/lists/*

echo \"/* Subsetted fonts generated on $(date) */\" > $CSS_OUTPUT
echo '' >> $CSS_OUTPUT

# Process fonts and generate CSS
process_font() {
  local font=\$1
  local ext=\$2
  local basename=\$(basename \"\$font\" .\$ext)
  
  echo \"Processing \$basename.\$ext...\"
  
  # Extract font info for CSS
  local font_family=\$(fontforge -lang=ff -c 'import fontforge; font=fontforge.open(\"'\$font'\"); print(font.familyname); font.close()')
  local font_weight=\$(fontforge -lang=ff -c 'import fontforge; font=fontforge.open(\"'\$font'\"); print(font.weight); font.close()' | grep -o '[0-9]\+' || echo '400')
  local font_style=\$(fontforge -lang=ff -c 'import fontforge; font=fontforge.open(\"'\$font'\"); print(\"italic\" if font.italicangle != 0 else \"normal\"); font.close()')
  
    # Fix weight handling for various formats FontForge might return
    if [[ \"$font_weight\" == \"Regular\" ]] || [[ -z \"$font_weight\" ]]; then
        font_weight="400"
    elif [[ \"$font_weight\" == \"Bold\" ]]; then
        font_weight="700"
    elif [[ \"$font_weight\" == \"Light\" ]]; then
        font_weight="300"
    elif [[ \"$font_weight\" == \"Medium\" ]]; then
        font_weight="500"
    elif [[ \"$font_weight\" =~ ^[0-9]+$ ]]; then
        # Already a number, keep it
        :
    else
        # Default to 400 if we can't determine
        font_weight="400"
    fi
  
  # Create subsets in multiple formats
  glyphhanger --whitelist=\"$UNICODE_RANGES\" --subset=\"\$font\" --formats=woff2,woff,ttf --output=\"$OUTPUT_DIR\"
  
  # Generate CSS
  echo \"/* \$basename */\" >> $CSS_OUTPUT
  echo \"@font-face {\" >> $CSS_OUTPUT
  echo \"  font-family: \$font_family;\" >> $CSS_OUTPUT
  echo \"  font-style: \$font_style;\" >> $CSS_OUTPUT
  echo \"  font-weight: \$font_weight;\" >> $CSS_OUTPUT
  echo \"  font-display: swap;\" >> $CSS_OUTPUT
  echo \"  src: url('/fonts/\$basename-subset.woff2') format('woff2'),\" >> $CSS_OUTPUT
  echo \"       url('/fonts/\$basename-subset.woff') format('woff'),\" >> $CSS_OUTPUT
  echo \"       url('/fonts/\$basename-subset.ttf') format('truetype');\" >> $CSS_OUTPUT
  echo \"  unicode-range: $UNICODE_RANGES;\" >> $CSS_OUTPUT
  echo \"}\" >> $CSS_OUTPUT
  echo \"\" >> $CSS_OUTPUT
}

# Process woff2 files
echo 'Processing WOFF2 files...'
shopt -s nullglob
for font in $FONT_DIR/*.woff2; do
  if [ -f \"\$font\" ]; then
    process_font \"\$font\" \"woff2\"
  fi
done

# Process ttf files
echo 'Processing TTF files...'
for font in $FONT_DIR/*.ttf; do
  if [ -f \"\$font\" ]; then
    process_font \"\$font\" \"ttf\"
  fi
done

echo \"Generated font CSS at $CSS_OUTPUT\"
"

echo "Font subsetting complete!"
echo "Subsetted fonts are in $OUTPUT_DIR"
echo "CSS for the fonts is available at $CSS_OUTPUT"