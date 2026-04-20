import { vi } from "vitest";

const mockActiveWindow = {
  setTimeout: (handler: (...args: any[]) => void, timeout?: number, ...args: any[]) =>
    setTimeout(() => handler(...args), timeout),
  clearTimeout: (handle: number) => clearTimeout(handle),
  setInterval: (handler: (...args: any[]) => void, timeout?: number, ...args: any[]) =>
    setInterval(() => handler(...args), timeout),
  clearInterval: (handle: number) => clearInterval(handle),
  navigator: {
    clipboard: {
      writeText: async (_text: string) => {},
    },
  },
  open: (_url?: string | URL, _target?: string, _features?: string) => null,
} as unknown as Window;

vi.mock("obsidian", () => {
  class TFile {}
  class TFolder {}
  class Notice {
    constructor(_message?: string) {}
  }
  class Modal {}
  class Plugin {}
  class App {}

  return {
    activeWindow: mockActiveWindow,
    activeDocument: {} as Document,
    normalizePath: (value: string) => value.replace(/\\/g, "/"),
    TFile,
    TFolder,
    Notice,
    Modal,
    Plugin,
    App,
  };
});

Object.defineProperty(globalThis, "activeWindow", {
  value: mockActiveWindow,
  writable: true,
});

Object.defineProperty(globalThis, "window", {
  value: {
    setTimeout: (handler: (...args: any[]) => void, timeout?: number, ...args: any[]) =>
      setTimeout(() => handler(...args), timeout),
    clearTimeout: (handle: number) => clearTimeout(handle),
    activeWindow: mockActiveWindow,
  } as unknown as Window,
  writable: true,
});
