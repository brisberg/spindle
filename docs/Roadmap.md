# Roadmap

Combine this repo with the cruft-spindle repo and the cruft-typescript-pkg repo.

Add tests for the existing CLI features.

Add a test that keeps schema.json and the validation in src/config.ts in sync: the same set of keys, the same required keys, and the same accepted types. Today they are maintained by hand and can drift apart.

Hook up CI, so we can be sure we don't break things.

## Future ideas

### A testing library for Twine games

Extract a reusable library for testing compiled Twine stories in a real browser. [cellar-crawl](https://github.com/brisberg/cellar-crawl) is the inspiration. Its `tests/` directory and [docs/Testing.md](https://github.com/brisberg/cellar-crawl/blob/main/docs/Testing.md) already contain a working version for Harlowe, built on Playwright:

- a `game` fixture that clicks links, enchantments and dialog buttons by their exact text;
- a wait for passage transitions to finish;
- a test-only passage that exposes story variables to tests;
- static checks that every passage reference resolves;
- checks after every test: no story-format errors, no JavaScript errors, no redirect loops, and no network requests.

Split it into a **core** and one **adapter per story format**:

- **Core** (format-agnostic): the Playwright fixture and test lifecycle, the invariants above, building a test version of the story (the real source plus fixture passages, with a test start passage), the static link-graph checks over `tw-passagedata`, and the layout helpers for phone width.
- **Adapters** (one each for Harlowe, SugarCube, Chapbook and Snowman): the format-specific pieces. These are the DOM selectors for links and dialogs, how to detect that a transition has settled, how errors are rendered, and how to read story state. SugarCube exposes `SugarCube.State.variables` directly. Harlowe has no state API, so its adapter needs a probe passage that prints variables with `(source:)`. Each adapter also supplies the reference patterns the link checker should follow, such as `(goto:)`, `<<goto>>` or `[[...]]` variants.

Spindle could grow a `spindle test` command, or a `test` config section, that does the test build and runs the suite.

This might not be worth it until Twine and story-format tooling matures. Today each format has its own undocumented DOM and no stable test hooks, so an adapter would be coupled to one format version's internals. cellar-crawl's helpers, for example, depend on Harlowe 3.3's internal `<tw-transition-container>`, `<tw-error>` and `<tw-dialog>` elements, none of which is a documented interface. A shared library would chase those changes for little gain while there is one Harlowe game using it. Revisit once a second game needs tests, or if a story format ships a supported state and testing API.
