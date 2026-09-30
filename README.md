# Spindle

Opinionated Build Tool for building [Twine Games](https://twinery.org/). Spindle's purpose is to wrap all boilerplate for interacting with Twine and provide a "single install" for any game repo.

Powered by [Gulp](https://gulpjs.com/) and [Tweego](https://github.com/tmedwards/tweego).

## Install

```bash
npm install -D @brisberg/spindle
# or
yarn add -D @brisberg/spindle
```

Also requires that the `tweego` binary be installed and on your `PATH`. Either:
- Download a prebuilt binary from the [Tweego releases](https://github.com/tmedwards/tweego/releases) and add it to your `PATH`, or
- With [Go](https://go.dev) installed: `go install github.com/tmedwards/tweego@latest` (ensure `$(go env GOPATH)/bin` is on your `PATH`)

Verify with `tweego --version`.

## Usage

Add a `spindle.yml` file to your repo root. See [spindle.yml](https://github.com/brisberg/spindle/blob/main/spindle.yml) for an example. Use `-c <path>` to point at a config file elsewhere.

Build with a simple command:

```bash
npx spindle
# or
yarn run spindle
```
