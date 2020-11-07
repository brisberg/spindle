/**
 * TwineBuilderConfig describes all configuration options for TwineBuilder.
 * config.yml must conform to this structure.
 */
export interface TwineBuilderConfig {
  /**
   * Project slug used for urls and directories.
   * Only use [a-Z][0-9]- characters.
   */
  id: string;
  /** Current version of the project. E.x. 'v1.1.0' */
  version: string;
  /** Story Title. Should match the title in StoryData. */
  title: string;
  /** Short description of the goal and theme of the game. (1-3 sentences) */
  description: string;
  /** Storyformat used to compile this game. */
  format: 'harlowe-3.0.2'|'harlowe-3.1.0'|'snowman-2.0.2'|'sugarcube-2.31.1';
  /**
   * Set of glob paths to include in the <head> tag of the final game. JS files
   * will be wrapped in <script> tags.
   */
  header: string|string[];
  /** Set of glob paths to include as source files for the Tweego compiler */
  deps: string|string[];
}

const defaultConfig: TwineBuilderConfig = {
  id: 'my-game',
  version: '0.1.0',
  title: 'My Game',
  description: 'Game built in Twine!',
  format: 'sugarcube-2.31.1',
  header: [],
  deps: [],
}

/**
 * Parses raw json data from a config.yaml file and returns a validated config.
 */
export function parseConfig(data: any) {
  if (!data) {
    console.warn(`Config data missing... using default config.`);
    return defaultConfig;
  }

  return {
    id: data.id || defaultConfig.id,
    version: data.version || defaultConfig.version,
    title: data.title || defaultConfig.title,
    description: data.description || defaultConfig.description,
    format: data.format || defaultConfig.format,
    header: data.header || defaultConfig.header,
    deps: data.deps || defaultConfig.deps,
  };
};

// Default constants
export const DEFAULT_OUT_DIR = './output';
export const DEFAULT_CONFIG_PATH = './example-game/config.yml';
