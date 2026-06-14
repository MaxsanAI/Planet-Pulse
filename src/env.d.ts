/// <reference types="astro/client" />

type AIBinding = {
  run: (
    model: string,
    options: Record<string, any>
  ) => Promise<any>;
};

interface RuntimeEnv {
  AI: AIBinding;
}

interface Runtime {
  env: RuntimeEnv;
}

declare namespace App {
  interface Locals {
    runtime: Runtime;
  }
}
