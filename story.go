package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
)

// Story is the full build definition for a Twine game.
type Story struct {
	// ID (used for file paths, analytic keys, etc)
	ID string

	// Version is a semvar string representing the story version
	Version string

	// Human readable Title of the story
	Title string

	// Description, displayed in index list
	Description string

	// List of directories containing twee files to compile
	Deps []string

	// List of .html files to concatinate into the <head> tag
	Head []string
}

// ReadStoryFromFile returns a new decoded Story struct
func ReadStoryFromFile(filePath string) (*Story, error) {
	// Create Story structure
	story := &Story{}

	// Init new YAML decode
	if err := ReadYamlFile(filePath, &story); err != nil {
		return nil, err
	}

	return story, nil
}

// BuildTwineStory builds the given Story definition using Tweego
//
// This library calls out to github.com/tmedwards/tweego through os/exec.
// It assumes that the tweego binary has already been fetched (through `go get`) and added to the path.
//
// Example Tweego call:
// tweego --log-files -l \
// 				--head=analytics.html \
// 				-o dist/$game.html
// 				shared/ \
// 				games/$game
func BuildTwineStory(story *Story) error {
	headfile, err := compileHeadHTML(story)
	if err != nil {
		return fmt.Errorf("Failed to compile header file: %v", err)
	}

	output := "genfiles/games/" + story.ID + ".html"
	args := []string{
		"--log-files", "-l",
		"--head=" + headfile,
		"-o", output,
	}
	args = append(args, story.Deps...)

	cmd := exec.Command("tweego", args...)
	// fmt.Printf("cmd: %v\n", cmd)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("Failed to build '%s': %s", story.ID, err)
	}

	fmt.Printf("%s\n", out)
	fmt.Printf("Built '%s' as %s\n", story.ID, output)

	return err
}

func compileHeadHTML(story *Story) (string, error) {
	outpath := "genfiles/header/" + story.ID + ".head.html"

	// open the out file for writing
	outfile, err := os.Create(outpath)
	if err != nil {
		return "", err
	}
	defer outfile.Close()

	cmd := exec.Command("cat", story.Head...)
	// Output the combined html to a file
	cmd.Stdout = outfile

	// Read Stderr in case 'cat' command fails
	stderr, err := cmd.StderrPipe()
	if err != nil {
		log.Fatal(err)
	}

	// Start command
	if err := cmd.Start(); err != nil {
		log.Println(err)
	}

	// Dump error to console
	slurp, _ := ioutil.ReadAll(stderr)
	fmt.Printf("%s\n", slurp)

	// Wait for command to finish
	if err := cmd.Wait(); err != nil {
		return "", err
	}

	return outpath, err
}
