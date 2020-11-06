package main

import (
	"log"
	"os"
)

var gamesFile = "games/games.yml"

func main() {
	targets, err := ReadTargetsListFromFile(gamesFile)
	if err != nil {
		log.Fatalf("Failed reading targets list: %v", err)
	}

	// Create all output directories
	// Public directory for markdown files
	os.MkdirAll("genfiles/public", os.ModePerm)
	// Games directory for compiled game html files
	os.MkdirAll("genfiles/games", os.ModePerm)
	// Header directory for combined header html files
	os.MkdirAll("genfiles/header", os.ModePerm)

	mdfile, err := os.Create("genfiles/public/README.md")
	if err != nil {
		log.Fatalf("Failed to open README output file: %v", err)
	}
	defer mdfile.Close()

	// Load index markdown template
	mdtmpl, err := loadStoryTemplate("public/README.md")
	if err != nil {
		log.Fatalf("Failed load README template: %v", err)
	}

	for _, g := range *&targets.Games {
		story, err := ReadStoryFromFile(g + "/build.yml")
		if err != nil {
			log.Printf("Failed to parse story definition %v. Error: %v", g, err)
			continue
		}

		if err = BuildTwineStory(story); err != nil {
			log.Println(err)
		}

		if err = appendToLandingMarkdown(mdfile, mdtmpl, story); err != nil {
			log.Println(err)
		}
	}
}
