import * as vscode from "vscode";

let features: { [key: string]: any } = {};

export async function activate(context: vscode.ExtensionContext) {
  // Dynamically import web-features (ESM)
  const webFeatures = await import("web-features");
  features = webFeatures.features;

  // Register hover provider for JavaScript and TypeScript
  const provider = vscode.languages.registerHoverProvider(
    ["javascript", "typescript", "javascriptreact", "typescriptreact"],
    {
      provideHover(document, position) {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
          return;
        }

        const word = document.getText(range);

        // Look up the feature by key
        const feature = features[word];

        if (feature) {
          const baselineStatus = feature.status?.baseline
            ? `✅ Part of Baseline (${feature.status.baseline})`
            : "❌ Not in Baseline";

          const md = new vscode.MarkdownString();
          md.appendMarkdown(`**${feature.name}**\n\n`);
          md.appendMarkdown(`${baselineStatus}\n\n`);
          if (feature.mdn?.spec) {
            md.appendMarkdown(`[MDN Docs](${feature.mdn.spec})\n`);
          }

          return new vscode.Hover(md, range);
        }
      },
    }
  );

  context.subscriptions.push(provider);
}

export function deactivate() {}
