# Roadmap

Combine this repo with the cruft-spindle repo and the cruft-typescript-pkg repo.

Add tests for the existing CLI features.

Add a test that keeps schema.json and the validation in src/config.ts in sync: the same set of keys, the same required keys, and the same accepted types. Today they are maintained by hand and can drift apart.

Hook up CI, so we can be sure we don't break things.
