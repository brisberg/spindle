# Spindle

Opinionated build tool for [Twine](https://twinery.org/) games. Add one dev dependency to your game repo and build it into a single HTML file with `npx spindle`.

Powered by [Tweego](https://github.com/tmedwards/tweego).

## Spindle builds your story; it doesn't describe it

Spindle's config covers only **how to build** the game: which source files to compile, what to put in the `<head>`, and where to write the output.

Everything about the **story itself** stays in your Twee source, where Twine and Tweego expect it:

| What | Where |
|---|---|
| Title | `StoryTitle` passage |
| IFID, story format, format version, start passage | `StoryData` passage |
| Passages, scripts, styles | Your `.tw` / `.twee` / `.js` / `.css` files |

Your source stays a complete, standard Twine story that you can import into the Twine editor or compile with `tweego` directly, without Spindle.

```
:: StoryTitle
My Game

:: StoryData
{
	"ifid": "F546AE48-0F22-44DB-8A69-D78C7F6897D5",
	"format": "SugarCube",
	"format-version": "2.31.1",
	"start": "Start"
}
```

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

## Configuration

Put the config in **either** a `spindle.json` file in your repo root:

```json
{
  "src": ["src"],
  "head": ["header/**/*"],
  "out": "output/my-game.html"
}
```

**or** a `"spindle"` key in your `package.json`:

```json
{
  "name": "my-game",
  "scripts": {
    "build": "spindle"
  },
  "devDependencies": {
    "@brisberg/spindle": "^0.4.0"
  },
  "spindle": {
    "src": ["src"],
    "head": ["header/**/*"]
  }
}
```

Using both at once is an error, so there's never any doubt about which one is in effect.

| Key | Required | Description |
|---|---|---|
| `src` | Yes | Files or directories of Twee source, passed to Tweego. Tweego also bundles `.js` and `.css` files it finds here into your Story JavaScript and Story Stylesheet. |
| `head` | No | Globs of `.html` and `.js` files to insert into the page `<head>`. `.js` files are wrapped in `<script>` tags; other file types are ignored. Useful for analytics snippets, meta tags or external libraries. |
| `out` | No | Path of the compiled HTML file. Defaults to `output/<package name>.html`, or `output/index.html` if there is no package name. |

A string may be used in place of a single-item array. Unknown keys are an error, so typos don't go unnoticed.

To use a config file somewhere else, pass `-c <path>`. This skips the search in `spindle.json` and `package.json`.

### Story formats

Spindle bundles Harlowe 3.0.2 and 3.1.0, SugarCube 2.31.1, and Snowman 2.0.2. Tweego picks the format named in your `StoryData` passage. To use other formats or versions, install them anywhere Tweego searches (see the [Tweego docs](https://www.motoslave.net/tweego/docs/)), for example a `storyformats/` folder in your repo or a folder listed in `TWEEGO_PATH`. Spindle adds its bundled formats to `TWEEGO_PATH` rather than replacing it.

## Usage

```bash
npx spindle
# or
yarn spindle
```

Spindle deletes the previous output file, then compiles the game. If the build fails, Spindle exits with a non-zero code, so it's safe to use in CI.

## Upgrading from 0.3 (`spindle.yml`)

`spindle.yml` is no longer read. Move your config to `spindle.json` or `package.json`:

| 0.3 `spindle.yml` | 0.4 |
|---|---|
| `deps` | `src` |
| `header` | `head` |
| `id` | `out` (full output path, e.g. `output/<id>.html`) |
| `format` | Set `format` and `format-version` in your `StoryData` passage |
| `title` | Set your `StoryTitle` passage |
| `version`, `description` | Removed |

Spindle reports any of the old keys it finds, along with what to use instead.
