# twine-builder
WIP Project porting my opinionated twine builder to a modular system.

Reimplementing as a Gulp Task

Possible ideas for name of this project:

  - `entwine`: The verb of wrapping something in twine, meshing things together
  - `spindle`: Metal spike used to pull loose wool in to yarn or twine


Update:

So this actually is possible. You can invoke gulp from outside the package and use it's gulp file. I will need to provide the transpiled sources, running the gulpfile.ts really isn't going to work.

I need to add something to make sure Tweego is on the path. Maybe a test command.
For some reason this was different in my two shells.

When you invoke gulp, you can pass it `--cwd .` which will force it to treat your project directory (not the node_module directory) as the root.

Clean appears to be remove the output directory for some reason. Tweego fails if the output directory doesn't exist, as I suppose it can't perform those actions on it's own. This wasn't required before, when generateHeader would create the output dir.

Still need to make sure that the headerfile is being created.
