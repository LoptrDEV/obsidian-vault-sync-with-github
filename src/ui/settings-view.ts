import { PluginSettingTab, Setting, type App } from "obsidian";
import { GitHubAuthManager } from "../auth/github-auth-manager";
import { SHARED_GITHUB_APP } from "../config/shared-github-app";
import type GitHubApiSyncPlugin from "../main";
import type { GitHubAppAuthState, GitHubAppRepository } from "../types/auth-types";
import { normalizeMaxFileSizeMB, normalizeSyncIntervalMinutes } from "../types/plugin-settings";
import { GitHubAppAuthModal } from "./github-app-auth-modal";
import { buildHealthSummary } from "./sync-status-copy";

type RepositoryLoadResult = {
  repositories: GitHubAppRepository[];
  errorMessage: string | null;
};

export const describeRepositoryLoadIssue = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes("reconnected") ||
    normalized.includes("authentication") ||
    normalized.includes("reauth")
  ) {
    return "The stored GitHub App login is no longer usable. Reconnect the shared app and refresh the repository list.";
  }

  return "GitHub did not return the repository list. Refresh the list and try again.";
};

export class SettingsView extends PluginSettingTab {
  private plugin: GitHubApiSyncPlugin;

  constructor(app: App, plugin: GitHubApiSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    void this.render();
  }

  private async render(): Promise<void> {
    const { containerEl } = this;
    containerEl.empty();
    const authManager = new GitHubAuthManager(this.plugin);
    const authState = await authManager.loadGitHubAppAuthState();
    const repositoryLoadResult = authState
      ? await this.loadAvailableRepositories(authManager)
      : { repositories: [], errorMessage: null };
    const availableRepositories = repositoryLoadResult.repositories;
    const selectedRepository = await this.resolveSelectedRepository(
      authManager,
      availableRepositories
    );
    const storedPreview = await this.plugin.loadSyncPreview();
    const storedHealth = await this.plugin.loadSyncHealth();

    new Setting(containerEl).setHeading().setName("GitHub API sync");

    if (storedHealth) {
      new Setting(containerEl)
        .setName("Current sync status")
        .setDesc(`${storedHealth.lastMessage} Updated ${new Date(storedHealth.updatedAt).toLocaleString()}.`);
      const summary = containerEl.createEl("ul", { cls: "github-api-sync-preview-list" });
      for (const line of buildHealthSummary(storedHealth)) {
        summary.createEl("li", { text: line });
      }
    }

    new Setting(containerEl)
      .setName("Shared GitHub app")
      .setDesc(
        `Uses the built-in public GitHub app ${SHARED_GITHUB_APP.name} for a device-flow login that works on desktop and mobile.`
      )
      .addButton((button) =>
        button.setButtonText("View app").onClick(() => {
          activeWindow.open(SHARED_GITHUB_APP.publicUrl, "_blank", "noopener");
        })
      )
      .addButton((button) =>
        button.setButtonText("Install app").onClick(() => {
          activeWindow.open(SHARED_GITHUB_APP.installUrl, "_blank", "noopener");
        })
      );

    new Setting(containerEl)
      .setName("GitHub app connection")
      .setDesc(this.describeGitHubAppStatus(authState))
      .addButton((button) =>
        button
          .setButtonText(authState ? "Reconnect" : "Connect")
          .onClick(() => {
            new GitHubAppAuthModal(this.plugin, {
              onConnected: () => this.display(),
            }).open();
          })
      )
      .addButton((button) =>
        button
          .setButtonText("Disconnect")
          .setDisabled(!authState)
          .onClick(() => {
            void (async () => {
              await authManager.disconnectGitHubApp();
              this.display();
            })();
          })
      );

    this.renderActionButtons(containerEl, Boolean(storedPreview?.approval.required));

    if (repositoryLoadResult.errorMessage) {
      new Setting(containerEl)
        .setName("Repository access")
        .setDesc(repositoryLoadResult.errorMessage)
        .addButton((button) =>
          button.setButtonText("Refresh list").onClick(() => {
            this.display();
          })
        )
        .addButton((button) =>
          button.setButtonText("Reconnect").onClick(() => {
            new GitHubAppAuthModal(this.plugin, {
              onConnected: () => this.display(),
            }).open();
          })
        );
    }

    if (authState && availableRepositories.length === 0) {
      new Setting(containerEl)
        .setName("Repository access")
        .setDesc(
          repositoryLoadResult.errorMessage
            ? "No repository list is currently available because the shared GitHub app lookup failed."
            : "No repositories are visible through the shared GitHub app yet. Install the app on a repository or refresh the repository list."
        )
        .addButton((button) =>
          button.setButtonText("Refresh list").onClick(() => {
            this.display();
          })
        );
    }

    if (availableRepositories.length > 0) {
      const repositoryDropdownValue =
        selectedRepository?.fullName ??
        (availableRepositories.length === 1 ? availableRepositories[0]?.fullName ?? "" : "");

      new Setting(containerEl)
        .setName("Repository")
        .setDesc(
          selectedRepository
            ? `Syncing ${selectedRepository.fullName} via ${selectedRepository.accountLogin}. ${
                availableRepositories.length === 1
                  ? "Only one repository is available and it was selected automatically."
                  : "Choose from repositories available through the installed shared GitHub app."
              }`
            : "Choose a repository from the installed shared GitHub app to fill owner and repo automatically."
        )
        .addDropdown((dropdown) => {
          if (availableRepositories.length > 1 && !selectedRepository) {
            dropdown.addOption("", "Select a repository");
          }

          for (const repository of availableRepositories) {
            dropdown.addOption(
              repository.fullName,
              this.describeRepositoryOption(repository)
            );
          }

          return dropdown
            .setValue(repositoryDropdownValue)
            .onChange((value) => {
              const repository = availableRepositories.find((entry) => entry.fullName === value);
              if (!repository) {
                return;
              }

              void this.applySelectedRepository(authManager, repository);
            });
        })
        .addButton((button) =>
          button.setButtonText("Refresh list").onClick(() => {
            this.display();
          })
        );
    }

    if (availableRepositories.length === 0) {
      new Setting(containerEl)
        .setName("Owner")
        .addText((text) =>
          text
            .setPlaceholder("Owner")
            .setValue(this.plugin.settings.owner)
            .onChange((value) => {
              void (async () => {
                this.plugin.settings.owner = value.trim();
                await this.plugin.saveSettings();
              })();
            })
        );

      new Setting(containerEl)
        .setName("Repository")
        .addText((text) =>
          text
            .setPlaceholder("Repo")
            .setValue(this.plugin.settings.repo)
            .onChange((value) => {
              void (async () => {
                this.plugin.settings.repo = value.trim();
                await this.plugin.saveSettings();
              })();
            })
        );
    }

    new Setting(containerEl)
      .setName("Branch")
      .addText((text) =>
        text
          .setPlaceholder("Main")
          .setValue(this.plugin.settings.branch)
          .onChange((value) => {
            void (async () => {
              this.plugin.settings.branch = value.trim();
              await this.plugin.saveSettings();
            })();
          })
      );

    new Setting(containerEl)
      .setName("Remote sync root")
      .setDesc("Choose whether the plugin syncs to the repository root or to a dedicated remote subfolder.")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("fullRepo", "Full repository")
          .addOption("subfolder", "Subfolder only")
          .setValue(this.plugin.settings.repoScopeMode)
          .onChange((value) => {
            void (async () => {
              this.plugin.settings.repoScopeMode = value as typeof this.plugin.settings.repoScopeMode;
              await this.plugin.saveSettings();
              this.display();
            })();
          })
      );

    if (this.plugin.settings.repoScopeMode === "subfolder") {
      new Setting(containerEl)
        .setName("Remote sync root path")
        .setDesc("Used when syncing into a dedicated remote subfolder (for example vault).")
        .addText((text) =>
          text
            .setPlaceholder("Vault")
            .setValue(this.plugin.settings.repoSubfolder)
            .onChange((value) => {
              void (async () => {
                this.plugin.settings.repoSubfolder = value.trim();
                await this.plugin.saveSettings();
              })();
            })
        );
    }

    new Setting(containerEl)
      .setName("Local sync root (optional)")
      .setDesc("Vault-relative folder to sync locally. Leave empty to include the entire vault.")
      .addText((text) =>
        text
          .setPlaceholder("Journal")
          .setValue(this.plugin.settings.rootPath)
          .onChange((value) => {
            void (async () => {
              this.plugin.settings.rootPath = value.trim();
              await this.plugin.saveSettings();
            })();
          })
      );

    new Setting(containerEl)
      .setName("Ignore patterns")
      .setDesc("Comma-separated list of ignore patterns.")
        .addTextArea((text) =>
          text
            .setPlaceholder(".git")
            .setValue(this.plugin.settings.ignorePatterns.join(", "))
            .onChange((value) => {
              void (async () => {
              this.plugin.settings.ignorePatterns = value
                .split(",")
                .map((entry) => entry.trim())
                .filter((entry) => entry.length > 0);
              await this.plugin.saveSettings();
            })();
          })
      );

    new Setting(containerEl)
      .setName("Conflict policy")
      .addDropdown((dropdown) =>
        dropdown
          .addOption("keepBoth", "Keep both")
          .addOption("preferLocal", "Prefer local")
          .addOption("preferRemote", "Prefer remote")
          .addOption("manual", "Manual")
          .setValue(this.plugin.settings.conflictPolicy)
          .onChange((value) => {
            void (async () => {
              this.plugin.settings.conflictPolicy = value as typeof this.plugin.settings.conflictPolicy;
              await this.plugin.saveSettings();
            })();
          })
      );

    new Setting(containerEl)
      .setName("Sync interval (minutes)")
      .setDesc("Leave empty to disable scheduled sync. When enabled, local edits also debounce into an earlier sync attempt instead of waiting only for the next timer tick.")
      .addText((text) =>
        text
          .setPlaceholder("15")
          .setValue(
            this.plugin.settings.syncIntervalMinutes === null
              ? ""
              : String(this.plugin.settings.syncIntervalMinutes)
          )
          .onChange((value) => {
            void (async () => {
              const trimmed = value.trim();
              this.plugin.settings.syncIntervalMinutes =
                trimmed.length === 0 ? null : normalizeSyncIntervalMinutes(Number(trimmed));
              await this.plugin.saveSettings();
            })();
          })
      );

    new Setting(containerEl)
      .setName("Maximum file size (mb)")
      .setDesc("Files larger than this are deferred locally before sync planning. They remain blocked until the size limit or the file changes.")
      .addText((text) =>
        text
          .setPlaceholder("50")
          .setValue(String(this.plugin.settings.maxFileSizeMB))
          .onChange((value) => {
            void (async () => {
              this.plugin.settings.maxFileSizeMB = normalizeMaxFileSizeMB(Number(value.trim()));
              await this.plugin.saveSettings();
            })();
          })
      );

    if (storedPreview?.diagnostics.some((entry) => entry.code === "local_scan_blocked")) {
      containerEl
        .createDiv({ cls: "github-api-sync-inline-note" })
        .setText(
          "The last preview deferred one or more blocked local files. Increase the file-size limit or reduce the file size if those paths should participate in sync."
        );
    }
  }

  private async loadAvailableRepositories(
    authManager: GitHubAuthManager
  ): Promise<RepositoryLoadResult> {
    try {
      return {
        repositories: await authManager.listAvailableRepositories(),
        errorMessage: null,
      };
    } catch (error) {
      return {
        repositories: [],
        errorMessage: describeRepositoryLoadIssue(error),
      };
    }
  }

  private async applySelectedRepository(
    authManager: GitHubAuthManager,
    repository: GitHubAppRepository
  ): Promise<void> {
    this.plugin.settings.owner = repository.owner;
    this.plugin.settings.repo = repository.repo;
    await authManager.rememberSelectedRepository(repository);
    await this.plugin.saveSettings();
    this.display();
  }

  private async resolveSelectedRepository(
    authManager: GitHubAuthManager,
    availableRepositories: GitHubAppRepository[]
  ): Promise<GitHubAppRepository | null> {
    const preferred = await authManager.pickPreferredRepository(availableRepositories, {
      owner: this.plugin.settings.owner,
      repo: this.plugin.settings.repo,
    });

    if (!preferred) {
      return null;
    }

    const currentFullName = `${this.plugin.settings.owner}/${this.plugin.settings.repo}`.trim();
    if (currentFullName !== preferred.fullName) {
      this.plugin.settings.owner = preferred.owner;
      this.plugin.settings.repo = preferred.repo;
      await authManager.rememberSelectedRepository(preferred);
      await this.plugin.saveSettings();
    }

    return preferred;
  }

  private renderActionButtons(containerEl: HTMLElement, hasApprovalPreview: boolean): void {
    new Setting(containerEl).setName("Quick actions").setDesc(
      "Run sync, preview, health, logs, conflicts, and baseline repair without leaving settings."
    );

    const grid = containerEl.createDiv({ cls: "github-api-sync-action-grid" });
    this.createActionButton(grid, "Sync now", async () => {
      await this.plugin.triggerSyncNow();
    });
    this.createActionButton(grid, "Preview plan", async () => {
      await this.plugin.triggerSyncPreview();
    });
    this.createActionButton(grid, "Show health", () => {
      this.plugin.openSyncHealth();
    });
    this.createActionButton(grid, "Show log", () => {
      this.plugin.openSyncLog();
    });
    this.createActionButton(grid, "Conflicts", () => {
      this.plugin.openSyncConflicts();
    });
    this.createActionButton(grid, "Repair baseline", async () => {
      await this.plugin.triggerRepairBaseline();
    });

    if (hasApprovalPreview) {
      const warning = containerEl.createDiv({ cls: "github-api-sync-inline-note" });
      warning.setText(
        "A stored preview currently requires approval before a destructive sync can continue."
      );
      const approvalGrid = containerEl.createDiv({ cls: "github-api-sync-action-grid github-api-sync-action-grid-approval" });
      this.createActionButton(approvalGrid, "Approve and run", async () => {
        await this.plugin.triggerApprovedSync();
      });
      this.createActionButton(approvalGrid, "Open preview", () => {
        this.plugin.openSyncPreview();
      });
    }
  }

  private createActionButton(
    parent: HTMLElement,
    label: string,
    action: () => void | Promise<void>
  ): void {
    const button = parent.createEl("button", {
      text: label,
      cls: "github-api-sync-action-button",
    });
    button.onclick = () => {
      void action();
    };
  }

  private describeRepositoryOption(repository: GitHubAppRepository): string {
    const visibility = repository.private ? "private" : "public";
    return `${repository.fullName} (${visibility}, via ${repository.accountLogin})`;
  }

  private describeGitHubAppStatus(authState: GitHubAppAuthState | null): string {
    if (!authState) {
      return `No GitHub app login is stored on this device yet. The plugin uses ${SHARED_GITHUB_APP.name} by default.`;
    }

    const accessExpiry = authState.accessTokenExpiresAt
      ? new Date(authState.accessTokenExpiresAt).toLocaleString()
      : "no expiry returned";

    switch (authState.status) {
      case "connected":
        return `Connected as ${authState.githubUserLogin || "GitHub user"}. Access token refreshes automatically and is currently valid until ${accessExpiry}.`;
      case "refreshing":
        return `Refreshing GitHub app login for ${authState.githubUserLogin || "GitHub user"}...`;
      case "reauth_required":
        return "Stored GitHub app tokens can no longer be refreshed. Reconnect to continue syncing.";
      case "disconnected":
      default:
        return "No GitHub App login is active.";
    }
  }
}
