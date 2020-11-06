package main

import (
	"os"
	"text/template"
)

// loadStoryTemplate reads the template from the given file
func loadStoryTemplate(filepath string) (*template.Template, error) {
	return template.New("story-template").ParseFiles(filepath)
}

func appendToLandingMarkdown(outfile *os.File, tmpl *template.Template, story *Story) error {
	return tmpl.ExecuteTemplate(outfile, "README.md", story)
}
