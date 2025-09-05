#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

// --- CLI ARGS ---
const args = process.argv.slice(2)

let projectRoot = process.cwd() // default: current dir
let aliases = {}
let dryRun = false

for (let i = 0; i < args.length; i++) {
  const arg = args[i]

  if (arg === '--projectRoot' && args[i + 1]) {
    projectRoot = path.resolve(args[i + 1])
    i++
  } else if (arg === '--alias' && args[i + 1]) {
    // e.g. --alias @=src --alias ~types=src/types
    const [key, value] = args[i + 1].split('=')
    if (key && value) {
      aliases[key] = path.join(projectRoot, value)
    }
    i++
  } else if (arg === '--dry-run') {
    dryRun = true
  }
}

// fallback example if no aliases passed
if (Object.keys(aliases).length === 0) {
  aliases = {
    '@': path.join(projectRoot, 'src'),
    '~types': path.join(projectRoot, 'src/types')
  }
}

// --- CONFIG ---
const extensions = /\.(ts|tsx|js|jsx)$/

// --- UTILS ---
const isRelativeImport = (importPath) =>
  importPath.startsWith('./') || importPath.startsWith('../')

const convertToAlias = (fromFile, importPath) => {
  const absoluteImportPath = path.resolve(path.dirname(fromFile), importPath)

  for (const [alias, targetDir] of Object.entries(aliases)) {
    if (absoluteImportPath.startsWith(targetDir)) {
      const relativePath = path.relative(targetDir, absoluteImportPath)
      return `${alias}/${relativePath}`.replace(/\\/g, '/') // fix for Windows
    }
  }

  return null
}

// --- CORE ---
const processFile = (filePath) => {
  let code = fs.readFileSync(filePath, 'utf8')

  // Support both import and require
  const importRegex =
    /(?:import\s+(?:[^'"]+\s+from\s+)?['"]([^'"]+)['"])|(?:require\(['"]([^'"]+)['"]\))/g

  let modified = false

  code = code.replace(importRegex, (match, importPath1, importPath2) => {
    const importPath = importPath1 || importPath2
    if (!isRelativeImport(importPath)) return match

    const aliasPath = convertToAlias(filePath, importPath)
    if (!aliasPath) return match

    modified = true
    return match.replace(importPath, aliasPath)
  })

  if (modified) {
    if (dryRun) {
      console.log(
        `📝 [dry-run] Would update: ${path.relative(projectRoot, filePath)}`
      )
    } else {
      fs.writeFileSync(filePath, code, 'utf8')
      console.log(`✅ Updated: ${path.relative(projectRoot, filePath)}`)
    }
  }
}

const walkDir = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (extensions.test(entry.name) && fs.statSync(fullPath).isFile()) {
      processFile(fullPath)
    }
  }
}

// --- RUN ---
console.log(`🚀 Starting conversion in: ${projectRoot}`)
console.log(`🔗 Aliases:`, aliases)
if (dryRun)
  console.log(`⚠️ Running in dry-run mode (no files will be changed).`)

walkDir(projectRoot)

console.log('🎉 Done.')
