package main

// TargetsList is the yaml definition a list of game definitions
type TargetsList struct {
	Games []string
}

// ReadTargetsListFromFile returns a new decoded Targets struct
func ReadTargetsListFromFile(filePath string) (*TargetsList, error) {
	// Create Target structure
	targets := &TargetsList{}

	// Init new YAML decode
	if err := ReadYamlFile(filePath, &targets); err != nil {
		return nil, err
	}

	return targets, nil
}
