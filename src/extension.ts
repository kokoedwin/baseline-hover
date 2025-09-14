import * as vscode from "vscode";

// Define a minimal Feature type based on what we use from web-features
interface Feature {
  id?: string;
  name?: string;
  description?: string;
  mdn_url?: string;
  status?: {
    baseline?: string;
  };
}

let features: Feature[] = [];

// Manual mappings for tricky API names → Baseline feature IDs
const apiMappings: Record<string, string> = {
  startviewtransition: "view-transitions",
  clipboard: "async-clipboard",
  fetch: "abortable-fetch",
};

export async function activate(context: vscode.ExtensionContext) {
  try {
    // Dynamically import the ESM-only web-features package
    const module: any = await import("web-features");
    features = Object.values(module.features) as Feature[];
  } catch (err) {
    console.error("Failed to load web-features:", err);
    return;
  }

  const provider = vscode.languages.registerHoverProvider(
    ["javascript", "typescript", "javascriptreact", "typescriptreact"],
    {
      provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        if (!word) return;

        const wordLower = word.toLowerCase();
        let feature: Feature | undefined;

        // Check manual mapping first
        const mappedId = apiMappings[wordLower];
        if (mappedId) {
          feature = features.find((f) => f.id?.toLowerCase() === mappedId);
        }

        // If no mapped feature, fall back to fuzzy matching
        if (!feature) {
          feature = features.find(
            (f) =>
              f.name?.toLowerCase() === wordLower ||
              f.id?.toLowerCase() === wordLower ||
              f.description?.toLowerCase().includes(wordLower)
          );
        }

        if (feature) {
          const baseline = feature.status?.baseline ?? "unknown";
          const message = new vscode.MarkdownString(
            `**${feature.name}**  
            Baseline: **${baseline}**  
            ${feature.mdn_url ? `[MDN Docs](${feature.mdn_url})` : ""}`
          );
          message.isTrusted = true;
          return new vscode.Hover(message);
        } else {
          // Fallback if not found at all
          return new vscode.Hover(
            new vscode.MarkdownString(
              `ℹ️ No Baseline data found for **${word}**`
            )
          );
        }
      },
    }
  );

  context.subscriptions.push(provider);
}

export function deactivate() {}
