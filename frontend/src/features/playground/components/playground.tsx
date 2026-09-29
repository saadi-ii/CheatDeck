"use client";

import { Sandpack } from "@codesandbox/sandpack-react";
import { getTemplate } from "../lib/templates";

interface PlaygroundProps {
  code: string;
  language: string;
}

// Default export so next/dynamic can lazy-load it. Only ever rendered in the browser,
// after the reader clicks Run, so reading `document` here is safe.
export default function Playground({ code, language }: PlaygroundProps) {
  const config = getTemplate(language);
  if (!config) return null;

  const dark = document.documentElement.classList.contains("dark");

  return (
    <Sandpack
      template={config.template}
      theme={dark ? "dark" : "light"}
      files={{ [config.entry]: { code, active: true } }}
      options={{
        showConsole: config.showConsole,
        showConsoleButton: true,
        editorHeight: 320,
        resizablePanels: true,
      }}
    />
  );
}
