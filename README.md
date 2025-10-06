# 🧭 Baseline Hover — VS Code Extension

Instant web compatibility insights — right where you code.  
Baseline Hover integrates Baseline data directly into VS Code, showing you the support status and adoption timeline of modern web APIs at a glance.

## ✨ Features
- **🧠 Smart Hovers**: Hover any web API (like `fetch`, `navigator.clipboard`, or `startViewTransition`) to see:  
  - Baseline status — ✅ Widely available / ⚠️ Newly available / ❌ Limited availability  
  - Browser support (Chrome, Firefox, Safari, Edge)  
  - MDN and Can I Use references  
- **⚡ Zero Context Switching**: Stay focused — no need to open docs or compatibility tables.  
- **🧩 Powered by Official Baseline Data**: Uses the `web-features` npm package maintained by the Chrome team.  
- **💡 Works Out-of-the-Box**: Instantly functional for JavaScript and TypeScript.

## 🧰 Built With

| Technology              | Purpose                  |
|-------------------------|--------------------------|
| VS Code API            | Extension framework      |
| TypeScript             | Language for static typing |
| web-features           | Baseline dataset         |
| Node.js                | Development runtime      |
| MDN browser-compat-data| Browser support info     |

## 🚀 Getting Started

### 1️⃣ Prerequisites
Make sure you have the following installed:  
- Node.js 18+  
- VS Code  
- Git  

### 2️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/baseline-hover.git
cd baseline-hover
```

### 3️⃣ Install dependencies
```bash
npm install
```

### 4️⃣ Run the extension
- Open the folder in VS Code  
- Press `F5` or select “Run Extension” in the Debug panel  
- A new Extension Development Host window will open  

### 5️⃣ Try it out
Create a new `.js` or `.ts` file and hover over modern APIs like:  
```javascript
fetch("https://example.com");
navigator.clipboard.writeText("Hello!");
document.startViewTransition(() => console.log("Testing"));

You’ll instantly see their Baseline status, support info, and MDN links.
🧪 Example Hover Output
Abortable fetch
Baseline: ✅ high (Baseline Widely available)
📅 Added to Baseline: 2024-06
📖 If you construct a fetch request with an AbortSignal, you can cancel the request.
🌐 Support:
✅ Chrome 66+
✅ Firefox 57+
✅ Safari 12.1+
✅ Edge 16+
MDN Docs
Can I Use?
🧩 How It Works

* Maps API names (like fetch, navigator.clipboard) to their Baseline feature IDs.
* Fetches metadata from the web-features dataset:

Baseline level (false, low, high)
Added-to-Baseline date (e.g., 2024-06)
Browser version support


* Displays results in a hover popup within the editor.

🧠 Motivation
When developing for the web, I was constantly switching between MDN, Can I Use, and spec docs just to see if a feature was safe to use.
That friction inspired me to build Baseline Hover, so developers could stay in flow while still writing compatible, future-proof code.
🏆 Hackathon Entry — Baseline Tooling Hackathon
This project was created for the Baseline Tooling Hackathon, to showcase how Baseline can empower developers directly in their workflows — helping everyone write safer, more modern web code.
💡 Future Enhancements

* 🩵 Publish on the VS Code Marketplace
* 💬 Add inline diagnostics (e.g., “This feature is not baseline yet”)
* 🧩 Add fallback or polyfill recommendations
* 📈 Integrate with CI or GitHub Actions for compatibility checks

🧑‍💻 Author
Jonathan Edwin
Created for the Baseline Tooling Hackathon 🧠
GitHub: @kokoedwin
🪪 License
This project is licensed under the MIT License.

🤝 Contributing
Contributions are welcome!
If you'd like to enhance Baseline Hover or improve its accuracy:

* Fork the repo
* Create a feature branch (git checkout -b feature/awesome-idea)
* Commit your changes (git commit -m "Add new feature")
* Push to the branch (git push origin feature/awesome-idea)
* Open a Pull Request 🚀

⭐ Support
If you found this project useful, please give it a ⭐ on GitHub!