# Roadmap

Cleanup all the path calculations so that we don't get bitten by '/dist/'

Revisit whether we should bundle story formats at all. Possibly move the Storyformat definitions to another repo? It bloats this package. from 40kb to 1.6mb.

Add config options for out directory.

Combine this repo with the cruft-spindle repo and the cruft-typescript-pkg repo.

Move the example game into a self-contained directory with its own spindle.json, instead of using the spindle.json at the repo root.

Add tests for the existing CLI features.

Hook up CI, so we can be sure we don't break things.
