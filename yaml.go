package main

import (
	"os"

	"gopkg.in/yaml.v2"
)

// ReadYamlFile returns a Yaml Decoder ready to decode a file
func ReadYamlFile(filePath string, out interface{}) error {
	// Open file
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Init new YAML decode
	d := yaml.NewDecoder(file)

	// Start YAML decoding from file
	if err := d.Decode(out); err != nil {
		return err
	}

	return nil
}
