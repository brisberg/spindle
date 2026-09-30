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
```

Requires Node.js 22.17 or later. Spindle has no runtime dependencies.

Also requires that the `tweego` binary be installed and on your `PATH`. Download a prebuilt binary from the [Tweego releases](https://github.com/tmedwards/tweego/releases) and put it in a directory on your `PATH` (e.g. `~/.local/bin`).

On macOS, you may need to clear the quarantine flag: `xattr -d com.apple.quarantine ~/.local/bin/tweego`.

> **Note:** As of 2026, Tweego has a packaging problem and can't be installed with `go install github.com/tmedwards/tweego@latest`. The repo lives on GitHub, but its internal imports still use the old `bitbucket.org/tmedwards/tweego` module path, so Go resolves an ancient pre-modules tag and the build fails. Use the prebuilt binary instead.

Verify with `tweego --version`.

## Configuration

Put the config in **either** a `spindle.json` file in your repo root:

```json
{
  "$schema": "./node_modules/@brisberg/spindle/schema.json",
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
    "@brisberg/spindle": "^0.5.0"
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

#### Editor support

Spindle ships a JSON Schema for its config. Add a `$schema` line to `spindle.json`, as in the example above, and editors such as VS Code will offer autocomplete, show descriptions when you hover over a key, and flag invalid config as you type. The path points to the copy in your installed Spindle package, so it always matches the version you have and works offline. It resolves once you've run `npm install`.

The `$schema` key is only for your editor; Spindle ignores it. Editors don't apply it to the `"spindle"` key in `package.json`, which is validated by the schema for `package.json` itself.

To use a config file somewhere else, pass `-c <path>`. This skips the search in `spindle.json` and `package.json`.

### Story formats

Spindle doesn't include any story formats. Tweego uses the format and version named in your `StoryData` passage, and looks for it in these places:

1. **A `storyformats/` directory in your project (recommended).** Tweego looks in the directory Spindle runs from, which is your project root when you use `npm run`. Commit the format there, so every contributor and your CI build with the same format version:

   ```
   my-game/
   ├── .gitattributes
   ├── package.json
   ├── src/
   └── storyformats/
       └── sugarcube-2.37.3/
           └── format.js
   ```

   Formats are large third-party JavaScript files, so GitHub would otherwise report your repo as mostly JavaScript. Mark them as vendored in a `.gitattributes` file at your project root:

   ```gitattributes
   storyformats/** linguist-vendored
   ```

   Get `format.js` from the format's release page (e.g. SugarCube's "Twine 2 local" download), or copy it from the `storyformats/` directory included in the [Tweego release zip](https://github.com/tmedwards/tweego/releases).

2. **Next to the `tweego` binary.** The Tweego release zip already includes common formats (SugarCube, Harlowe, Snowman, Chapbook), so installing from the zip works without extra setup. Installing with `go install` doesn't include any formats.

3. **Any directory listed in `TWEEGO_PATH`.** Spindle passes your environment through unchanged.

See the [Tweego docs](https://www.motoslave.net/tweego/docs/) for the full search order. If no matching format is found, Spindle fails and points you here.

## Usage

```bash
npx spindle
```

Spindle deletes the previous output file, then compiles the game. If the build fails, Spindle exits with a non-zero code, so it's safe to use in CI.

| Option | Description |
|---|---|
| `-c`, `--config <path>` | Read the config from this file instead of `spindle.json` or `package.json`. |
| `-o`, `--out <path>` | Write the compiled HTML here, overriding `out` from the config. |

`--out` lets a CI job decide where the game is written without reading your config. Arguments after `--` are appended to your npm script, so this works whatever your `build` script passes to Spindle:

```bash
npm run build -- --out "$RUNNER_TEMP/site/index.html"
```

## Upgrading from 0.4

Spindle no longer includes story formats. If your game used a bundled format (Harlowe 3.0.2 or 3.1.0, SugarCube 2.31.1, Snowman 2.0.2), add it to a `storyformats/` directory in your project as described in [Story formats](#story-formats). You can also take this chance to move to a newer format version by updating your `StoryData` passage.

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
