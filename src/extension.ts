import * as vscode from "vscode";

// Define a minimal Feature type based on what we use from web-features
interface Feature {
  id?: string;
  name?: string;
  description?: string;
  mdn_url?: string;
  status?: {
    baseline?: string;
    support?: Record<string, string | boolean>; // new: browser support
  };
}

let features: Feature[] = [];

// Manual mappings for tricky API names → Baseline feature IDs
const apiMappings: Record<string, string> = {
  startviewtransition: "view-transitions",
  clipboard: "async-clipboard",
  fetch: "abortable-fetch",
};

// Emoji map for baseline levels
const baselineIcons: Record<string, string> = {
  high: "✅",
  low: "⚠️",
  unknown: "❌",
};

// Emoji map for browser support
const supportIcons: Record<string, string> = {
  yes: "✅",
  no: "❌",
  partial: "⚠️",
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
        if (!word) {return;}

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

        const baselineLabels: Record<string, string> = {
          high: "Baseline Widely available",
          low: "Baseline Newly available",
          false: "Limited availability",
          unknown: "Unknown status",
        };

        if (feature) {
          const baseline = feature.status?.baseline ?? "unknown";
          const baselineIcon = baselineIcons[baseline] ?? "❌";
          const baselineLabel = baselineLabels[baseline] ?? baseline;

          // Format browser support
          const support = feature.status?.support ?? {};
          const browserMap: Record<string, string> = {
            chrome: "Chrome",
            firefox: "Firefox",
            safari: "Safari",
            edge: "Edge",
          };

          const supportLines: string[] = [];
          for (const [browser, label] of Object.entries(browserMap)) {
            const supportValue = support[browser];
            if (typeof supportValue === "string") {
              // Example: "111", "17.4", etc.
              supportLines.push(
                `- ${supportIcons.yes} ${label} ${supportValue}+`
              );
            } else if (supportValue === true) {
              supportLines.push(`- ${supportIcons.yes} ${label}`);
            } else if (supportValue === false) {
              supportLines.push(`- ${supportIcons.no} ${label}`);
            } else {
              supportLines.push(`- ${supportIcons.partial} ${label}`);
            }
          }

          const message = new vscode.MarkdownString(
            `**${feature.name}**  
Baseline: ${baselineIcon} **${baselineLabel}**  

📖 ${feature.description ?? ""}  

🌐 Support:  
${supportLines.join("\n")}  

${feature.mdn_url ? `[MDN Docs](${feature.mdn_url})` : ""}  
[Can I Use?](https://caniuse.com/?search=${encodeURIComponent(
              feature.name ?? feature.id ?? ""
            )})`
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