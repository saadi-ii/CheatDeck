import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

interface PlaygroundTemplate {
  template: SandpackPredefinedTemplate;
  /** The file Sandpack runs; the block's code is placed here. */
  entry: string;
  /** Vanilla templates print to the console, React ones render a preview. */
  showConsole: boolean;
}

// Only languages the in-browser bundler can execute. Anything else is display-only.
const templates: Record<string, PlaygroundTemplate> = {
  tsx: { template: "react-ts", entry: "/App.tsx", showConsole: false },
  jsx: { template: "react", entry: "/App.js", showConsole: false },
  ts: { template: "vanilla-ts", entry: "/index.ts", showConsole: true },
  js: { template: "vanilla", entry: "/index.js", showConsole: true },
};

export function getTemplate(language: string | undefined) {
  return language ? templates[language] : undefined;
}

export const isRunnableLanguage = (language: string | undefined) => getTemplate(language) !== undefined;
