import * as fs from 'fs';
import * as path from 'path';

/**
 * SpindleConfig describes how to build a game. Story metadata (title, IFID,
 * story format, start passage) belongs in the game's StoryTitle and StoryData
 * passages, not here.
 *
 * Read from `spindle.json` or the "spindle" key of `package.json`.
 */
export interface SpindleConfig {
  /** Files or directories of Twee source, passed to Tweego. */
  src: string[];
  /**
   * Globs of .html and .js files to include in the <head> of the final game.
   * JS files will be wrapped in <script> tags.
   */
  head: string[];
  /** Path of the compiled HTML file. */
  out: string;
}

export const CONFIG_FILE = 'spindle.json';
export const PACKAGE_FILE = 'package.json';
export const PACKAGE_KEY = 'spindle';
export const DEFAULT_OUT_DIR = 'output';

/** Keys from the pre-0.4 spindle.yml format, and what replaced them. */
const REMOVED_KEYS: Record<string, string> = {
  deps: 'renamed to "src"',
  header: 'renamed to "head"',
  id: 'replaced by "out"',
  format: 'set the format in your StoryData passage instead',
  title: 'set the title in your StoryTitle passage instead',
  version: 'removed',
  description: 'removed',
};

/**
 * Locates and validates the Spindle config. An explicit path skips discovery;
 * otherwise exactly one of spindle.json or package.json "spindle" must exist.
 */
export function loadConfig(explicitPath?: string): SpindleConfig {
  const pkg = readJson(PACKAGE_FILE);

  if (explicitPath) {
    const data = readJson(explicitPath);
    if (data === undefined) {
      throw new Error(`Config file '${explicitPath}' not found.`);
    }
    return parseConfig(data, explicitPath, pkg);
  }

  const file = readJson(CONFIG_FILE);
  const embedded = pkg?.[PACKAGE_KEY];

  if (file !== undefined && embedded !== undefined) {
    throw new Error(
        `Config found in both ${CONFIG_FILE} and ${PACKAGE_FILE} ` +
        `"${PACKAGE_KEY}". Remove one of them.`);
  }
  if (file !== undefined) {
    return parseConfig(file, CONFIG_FILE, pkg);
  }
  if (embedded !== undefined) {
    return parseConfig(embedded, `${PACKAGE_FILE} "${PACKAGE_KEY}"`, pkg);
  }
  if (fs.existsSync('spindle.yml')) {
    throw new Error(
        `spindle.yml is no longer supported. Move your config to ` +
        `${CONFIG_FILE} (see README).`);
  }
  throw new Error(
      `No config found. Add ${CONFIG_FILE} or a "${PACKAGE_KEY}" key ` +
      `to ${PACKAGE_FILE}.`);
}

/** Validates raw config data. `source` names where it came from for errors. */
export function parseConfig(
    data: any, source: string, pkg?: any): SpindleConfig {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error(`${source}: config must be an object.`);
  }

  const errors: string[] = [];
  for (const key of Object.keys(data)) {
    if (key === '$schema' || key === 'src' || key === 'head' || key === 'out') {
      continue;
    }
    errors.push(
        REMOVED_KEYS[key] ? `"${key}" is no longer supported: ${REMOVED_KEYS[key]}.` :
                            `unknown key "${key}".`);
  }

  const src = toStringArray(data.src, 'src', errors);
  const head = toStringArray(data.head ?? [], 'head', errors);
  if (data.src === undefined || (src && src.length === 0)) {
    errors.push('"src" is required and must list at least one path.');
  }
  if (data.out !== undefined && typeof data.out !== 'string') {
    errors.push('"out" must be a string.');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid config in ${source}:\n  - ${errors.join('\n  - ')}`);
  }

  return {
    src,
    head,
    out: data.out ?? defaultOut(pkg),
  };
}

/** output/<package name>.html, or output/index.html without a package name. */
function defaultOut(pkg?: any): string {
  const name = typeof pkg?.name === 'string' ?
      pkg.name.replace(/^@[^/]+\//, '') :
      'index';
  return path.join(DEFAULT_OUT_DIR, `${name}.html`);
}

function toStringArray(value: any, key: string, errors: string[]): string[] {
  if (value === undefined) return [];
  const list = typeof value === 'string' ? [value] : value;
  if (!Array.isArray(list) || !list.every((v) => typeof v === 'string')) {
    errors.push(`"${key}" must be a string or an array of strings.`);
    return [];
  }
  return list;
}

/** Parses a JSON file, or returns undefined if it does not exist. */
function readJson(file: string): any {
  let text: string;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return undefined;
    throw e;
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`${file} is not valid JSON: ${e.message}`);
  }
}
