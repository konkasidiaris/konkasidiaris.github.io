package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

const sizeTemplate = `{{- $size := "size-5" -}}
{{- if reflect.IsMap . -}}
  {{- with .size -}}
    {{- $size = . -}}
  {{- end -}}
{{- end -}}
`

func main() {
	svgDir := "layouts/_partials/svg"

	files, err := filepath.Glob(filepath.Join(svgDir, "*.html"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading SVG directory: %v\n", err)
		os.Exit(1)
	}

	for _, file := range files {
		if err := processSVGFile(file); err != nil {
			fmt.Fprintf(os.Stderr, "Error processing %s: %v\n", file, err)
			continue
		}
		fmt.Printf("Updated %s\n", file)
	}

	fmt.Println("Done! All SVG partials updated.")
}

func processSVGFile(filename string) error {
	var template string
	content, err := os.ReadFile(filename)
	if err != nil {
		return err
	}

	contentStr := string(content)

	if strings.Contains(contentStr, "{{- $size :=") {
		template = ""
	} else {
		template = sizeTemplate
	}

	classRe := regexp.MustCompile(`class"[a-zA-Z0-9\-]"`)
	contentStr = classRe.ReplaceAllString(contentStr, `class="{{ $size }}"`)

	newContent := template + contentStr

	return os.WriteFile(filename, []byte(newContent), 0644)
}
