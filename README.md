# Spindle

Opinionated Build Tool for building [Twine Games](https://twinery.org/). Spindle's purpose is to wrap all all boilerplate for interacting with Twine and provide a "single install" for any game repo.

Powered by [Gulp](https://gulpjs.com/) and [Tweego](https://github.com/tmedwards/tweego).

## Install

```bash
npm install -D @brisberg/spindle
# or
yarn add -D @brisberg/spindle
```

Also requires that Tweego be installed:
- Install [golang](https://golang.org)
- Install Tweego - `go get github.com/tmedwards/tweego`

## Usage

If your repo is formatted correctly, add a `spindle.yml` file to your repo root. See [config.yml](https://github.com/brisberg/spindle/blob/main/config.yml) for an example.

Build with a simple command:

```bash
npx spindle
# or
yarn run spindle
```
