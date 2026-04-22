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
  class PluginSettingTab {
    containerEl = {
      empty: () => {},
      createDiv: () => ({
        createEl: () => ({}),
        setText: () => {},
      }),
    } as unknown as HTMLElement;

    constructor(_app?: unknown, _plugin?: unknown) {}
  }
  class Setting {
    constructor(_containerEl?: unknown) {}
    setHeading() {
      return this;
    }
    setName(_name?: string) {
      return this;
    }
    setDesc(_desc?: string) {
      return this;
    }
    addButton(_cb: (button: any) => any) {
      return this;
    }
    addDropdown(_cb: (dropdown: any) => any) {
      return this;
    }
    addText(_cb: (text: any) => any) {
      return this;
    }
    addTextArea(_cb: (text: any) => any) {
      return this;
    }
  }

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
    PluginSettingTab,
    Setting,
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
