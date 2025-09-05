# 🧩 Relative to Alias Import Path Converter (CLI)

A **zero-dependency [Node.js](https://nodejs.org/)** script that automatically converts **relative import paths**  
(e.g., `../../utils/helpers`) to **alias-based imports** (e.g., `@/utils/helpers`) in **any JavaScript/TypeScript project**.

Now supports **CLI options**, **dry-run mode**, and **`require()` calls** in addition to ES module imports.

---

## ✨ Features

- 🔍 Recursively scans your project directory
- 🛠 Rewrites all relative imports (`./`, `../`) to use custom aliases
- 🎛️ Configurable via CLI arguments (`--projectRoot`, `--alias`, `--dry-run`)
- 🧾 Supports both `import` and `require()` syntax
- ✅ No external dependencies (no need to `npm install`)
- 🧼 Can be run outside the target project
- 🐢 Designed for one-time migrations (but reusable if needed)

---

## Why Use This Script?

When projects use path aliases (`@/*`, `~/*`, etc.), manually updating long relative imports (`../../utils`)  
to cleaner alias imports can be tedious. This script automates that process across your codebase.

---

## 📁 Example

### Before (`src/components/Button.tsx`)

```ts
import { doSomething } from '../../utils/helpers'
const config = require('../../config/settings')
```

### After

```ts
import { doSomething } from '@/utils/helpers'
const config = require('@/config/settings')
```

---

## ⚙️ Setup Aliases in Your Project

Before running the script, make sure your project is configured to understand aliases:

### Example `tsconfig.json`

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "~types/*": ["src/types/*"]
    }
  }
}
```

### Example (Vite) `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~types': path.resolve(__dirname, './src/types')
    }
  }
})
```

_(Works with Webpack, Next.js, TS, or plain Node.js configs too.)_

---

## 🚀 How to Use

### 1. Clone or Download This Script

Put the script anywhere outside your target project (or inside, if you prefer).

### 2. Run with CLI Options

```bash
# Basic usage (defaults to current folder and built-in aliases)
node convert-imports.js

# Specify project root
node convert-imports.js --projectRoot ../my-app

# Add aliases
node convert-imports.js --alias @=src --alias ~types=src/types

# Dry-run mode (no files changed, only shows what would update)
node convert-imports.js --projectRoot ../my-app --dry-run
```

---

## ⚡ Quick Install (via npm CLI)

You can use this tool directly with `npx` (no install required) or install it globally.

### Run via `npx` (recommended)

```bash
npx convert-imports --projectRoot ../my-app --alias @=src --dry-run
```

### Global install

```bash
npm install -g convert-imports
```

Then simply run:

```bash
convert-imports --projectRoot ../my-app
```

---

## 🛡️ Safety Notes

- ⚠️ Always **backup or commit** your code before running.
- 🚫 Does not handle dynamic imports (`import(someVar)`).
- 🎯 Only scans files with extensions: `.ts`, `.tsx`, `.js`, `.jsx`.
- 🧠 Regex-based (not a full AST parser), so handle with care.

---

## 🧠 How It Works

1. Walks through all `.ts`, `.tsx`, `.js`, `.jsx` files under `--projectRoot`
2. Finds relative imports (`./`, `../`) in both `import` and `require()` calls
3. Resolves them against configured aliases
4. Rewrites and overwrites files (unless in `--dry-run` mode)

---

## 🧪 Tested With

- React, Next.js, Node.js, TypeScript projects
- Windows, macOS, Linux (Node.js v16+)
- Large and deeply nested folder structures

---

## 📄 License

[MIT](LICENSE) — free to use, modify, and distribute.  
This software is provided "as is", without warranty of any kind.

---

## 🤝 Contributions

PRs and suggestions are welcome! Feel free to open issues or submit improvements.

---

Happy importing! 🚀
