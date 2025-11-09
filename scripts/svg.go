package main

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

const classTemplate = `{{- $class := "size-5" -}}
{{- if reflect.IsMap . -}}
  {{- with .class -}}
    {{- $class = . -}}
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

	if strings.Contains(contentStr, "{{- $class :=") {
		template = ""
	} else {
		template = classTemplate
	}

	svgTagRe := regexp.MustCompile(`<svg\s+([^>]*)>`)

	contentStr = svgTagRe.ReplaceAllStringFunc(contentStr, func(match string) string {
		svgTagRe := regexp.MustCompile(`<svg\s+([^>]*)>`)
		attrs := svgTagRe.FindStringSubmatch(match)[1]

		classRe := regexp.MustCompile(`class=".*?"`)

		classAttr := `class="{{ $class }}"`

		if classRe.MatchString(attrs) {
			attrs = classRe.ReplaceAllLiteralString(attrs, classAttr)
		} else {
			attrs = classAttr + " " + attrs
		}

		return "<svg " + attrs + ">"
	})

	newContent := template + contentStr

	return os.WriteFile(filename, []byte(newContent), 0644)
}
