<img src="public/docspark-logo.png" alt="DocSpark Logo" width="150" />

# DocSpark (Alpha Build)

**Simple, automatic component documentation for React built off your Typescript Definitions**

DocSpark automatically generates beautiful, interactive, documentation for your React components. Just add a simple config file and a few JSDoc tags, then generate a complete documentation site—no story files, no complex setup required.

![DocSpark Screenshot](public/docspark-screen1.jpg)

**NOTE: This is an alpha release as we work through support across a wide-range of projects. Live Preview of components is a work in progress**

## Current Limitations
Live Previews: Only work when the React website successfully builds from source. When falling back to the template, live previews show "Live preview not available" because:
- The template contains a pre-built static bundle
- User components copied to docs/preview-components/ can't be loaded by the static bundle
- All other documentation features (props tables, variants, code examples, CSS variables) work perfectly

🚀 **Simpler than Storybook** • 📦 **Works with existing components** • ⚡ **Minimal configuration**

---

## Features

✨ **Automatic Variant Generation** - Generates all component variants from TypeScript types

📝 **JSDoc Integration** - Uses your existing comments and type definitions

🎨 **Theme Token Support** - Extracts and documents CSS variables

🔍 **Live Component Previews** - Interactive component showcase

📊 **Test Coverage** - Optional Jest coverage integration

🎯 **Static Site Output** - Deploy anywhere (GitHub Pages, Netlify, Vercel)

⚡ **Fast** - Pre-built templates mean instant builds

---

## Quick Start

### 1. Create Configuration

Create `docspark.config.json` in your project root:

```json
{
  "name": "My Component Library",
  "description": "Beautiful React components",
  "version": "1.0.0",
  "source": {
    "include": ["src/components/**/*.{tsx,jsx}"]
  },
  "output": {
    "directory": "./docs"
  }
}
```

### 2. Add JSDoc Tags

Add the `@renderVariants` JSDoc tag to props you want to document:

```typescript
export interface ButtonProps {
  /**
   * Visual style of the button
   * @renderVariants true
   * @displayTemplate {variant} Button
   */
  variant?: 'primary' | 'secondary' | 'outline';
}
```

### 3. Generate Documentation

```bash
npx docspark@latest build
```

DocSpark will:
1. Parse your TypeScript components and JSDoc tags
2. Generate all component variants automatically
3. Create a complete static website in `./docs`
4. Ready to deploy or preview locally

### Preview Locally

```bash
npx docspark serve
```

Open http://localhost:8080 to view your documentation.

---

## Configuration

Create `docspark.config.json` in your project root:

```json
{
  "name": "My Component Library",
  "description": "Beautiful React components",
  "version": "1.0.0",

  "source": {
    "include": ["src/components/**/*.{tsx,jsx}"]
  },

  "output": {
    "directory": "./docs"
  }
}
```

### Full Configuration Options

For a comprehensive guide to all configuration options, including detailed explanations, types, defaults, and examples, see the **[Configuration Documentation](./CONFIGURATION.md)** for a detailed reference of all options.

Quick overview of available configuration sections:
- **Basic** - Project name, description, version
- **Source** - Component file patterns, exclusions, style files
- **Output** - Build directory, base URL, static assets
- **Server** - Port, auto-open browser
- **Variants** - Auto-generation settings, default values
- **Theme** - Multi-theme support, colors, logo, favicon
- **Coverage** - Test coverage tracking and thresholds (requires test runner setup)
- **Features** - Enable/disable search, dark mode, playground, etc.

---

## Writing Documentable Components

For a comprehensive guide on writing components that work with DocSpark, including JSDoc tags, prop documentation, and CSS variables, see:

**[JSDoc Tag Documentation](./DOCUMENTING.md)** - Complete component documentation guide

Quick overview of JSDoc tags:
- `@renderVariants true` - Generate examples for each prop value
- `@displayTemplate {prop} Text` - Customize variant titles
- `@hideInDocs` - Hide internal props from documentation
- `@example "value"` - Provide example values for props
- Standard tags: `@deprecated`, `@default`

### Quick Example

```typescript
export interface ButtonProps {
  /**
   * Visual style variant
   * @renderVariants true
   * @displayTemplate {variant} Button
   */
  variant?: 'primary' | 'secondary' | 'outline';

  /**
   * Button label text
   * @example "Click Me"
   */
  children: React.ReactNode;
}
```

---

## CLI Commands

### `build`

Generate static documentation site:

```bash
npx docspark build [options]
```

**Options:**
- `-c, --config <path>` - Config file path (default: `./docspark.config.json`)
- `--base-url <url>` - Base URL for deployment (default: `/`)
- `--clean` - Clean output directory first
- `--verbose` - Detailed build output

**Examples:**
```bash
# Basic build
npx docspark build

# Custom config and base URL
npx docspark build --config ./config/docs.json --base-url /components/

# Verbose output with clean
npx docspark build --verbose --clean
```

**Output:**
```
./docs/
├── index.html                 # Documentation website
├── static/
│   ├── js/                    # React app bundle
│   └── css/                   # Styles
├── metadata/
│   ├── index.json             # Component index
│   ├── Button.json            # Component metadata
│   └── InputField.json        # More components
└── themes/
    ├── light.css              # Theme tokens
    └── dark.css
```

### `serve`

Preview documentation locally:

```bash
npx docspark serve [options]
```

**Options:**
- `-p, --port <port>` - Server port (default: `8080`)
- `-d, --dir <directory>` - Docs directory (default: `./docs`)

**Example:**
```bash
# Serve on default port
npx docspark serve

# Custom port
npx docspark serve --port 3000
```

### `dev`

Development mode with file watching:

```bash
npx docspark dev [options]
```

**Options:**
- `-p, --port <port>` - Server port (default: `6006`)
- `-c, --config <path>` - Config file path

Watches source files and rebuilds on changes.

---

## Test Coverage Integration

DocSpark can automatically display Jest test coverage metrics alongside your component documentation.

### How It Works

When you enable coverage in your config, DocSpark will:
1. **Automatically run your tests** with the `--coverage` flag
2. **Generate coverage data** via Jest
3. **Include coverage metrics** in your documentation

No manual steps required - just enable it in your config!

### Setup

First, ensure your `package.json` has Jest configured with coverage reporters:

```json
{
  "jest": {
    "coverageReporters": ["json-summary", "text", "lcov"]
  }
}
```

Then enable coverage in your `docspark.config.json`:

```json
{
  "coverage": {
    "enabled": true
  }
}
```

### Usage

Simply run the build command - coverage happens automatically:

```bash
npx docspark build
```

DocSpark will:
1. Run `npm test -- --coverage` automatically
2. Generate `coverage/coverage-summary.json`
3. Include coverage metrics in the documentation

Coverage metrics appear as:
- Coverage badges on component cards
- Detailed coverage metrics per component
- Visual indicators for test status

### Configuration

Coverage is **disabled by default**. To enable it, add to your config:

```json
{
  "coverage": {
    "enabled": true
  }
}
```

You can also configure coverage thresholds (for display purposes):

```json
{
  "coverage": {
    "enabled": true,
    "thresholds": {
      "statements": 80,
      "branches": 80,
      "functions": 80,
      "lines": 80
    }
  }
}
```

### Notes

- Coverage is only included when `coverage.enabled` is explicitly set to `true`
- If tests fail, the build will continue with a warning
- Without coverage enabled, no test-related UI will appear in the docs

---

## Deployment

DocSpark generates a static site that can be deployed anywhere:

### GitHub Pages

```yaml
# .github/workflows/deploy-docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build documentation
        run: npx docspark build --base-url /my-repo/

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npx docspark build"
  publish = "docs"
```

### Vercel

```json
{
  "buildCommand": "npx docspark build",
  "outputDirectory": "docs"
}
```

---

## Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "docs:build": "docspark build --verbose",
    "docs:serve": "docspark serve",
    "docs:dev": "docspark dev"
  }
}
```

Then run:
```bash
npm run docs:build
npm run docs:serve
```

---

## Example Output

Running `npx docspark build`:

```
📦 Building documentation...

✅ Configuration validated successfully

📖 Project: My Component Library
📂 Source: src/components/**/*.{tsx,jsx}
📁 Output: ./docs
🔗 Base URL: /

🎨 Loading 2 theme(s)...
  ✓ Loaded "Light" theme with 40 tokens (bg: #FFFFFF)
  ✓ Loaded "Dark" theme with 4 tokens (bg: #000000)

🔍 Scanning for components...
📄 Found 5 files

📝 Parsing src/components/Button.tsx...
  🎨 Found 14 CSS variables
  ✨ Generated 3 variants
  📊 Coverage: 95.2%

📝 Parsing src/components/Input.tsx...
  🎨 Found 18 CSS variables
  ✨ Generated 12 variants
  📊 Coverage: 87.4%

📋 Copying website template...

✅ Build complete!
📄 Generated 5 component pages
📊 Total variants: 27
🎨 CSS variables: 65

📂 Output: /path/to/your/project/docs
💡 Run "docspark serve" to preview your documentation
```

---

## Why DocSpark?

### vs Storybook

| Feature | DocSpark | Storybook |
|---------|-----------|-----------|
| Setup time | 2-5 minutes (simple config) | 15-30 minutes |
| Story files | Not needed | Required for every component |
| Build time | ~2 seconds | ~30+ seconds |
| Output | Static HTML (deploy anywhere) | Requires server |
| Variant generation | Automatic from types + JSDoc tags | Manual stories |
| Theme tokens | Built-in support | Requires addons |
| Learning curve | Minimal (JSDoc tags) | Steep |

### vs React Docgen

| Feature | DocSpark | React Docgen |
|---------|-----------|--------------|
| Complete site | ✅ Ready to deploy | ❌ Just JSON |
| UI | ✅ Beautiful React app | ❌ DIY |
| Variants | ✅ Auto-generated | ❌ Manual |
| CSS variables | ✅ Extracted | ❌ Not supported |
| Live preview | ✅ Built-in | ❌ DIY |

---

## Requirements

- Node.js 16+
- TypeScript project with React components
- Components using TypeScript interfaces for props

---

## Troubleshooting

### Components not found

**Problem**: "No components found" error

**Solution**:
- Verify components are in paths matching `source.include` patterns
- Ensure components export a `ComponentNameProps` interface
- Check that files use `.tsx` or `.jsx` extension

### CSS variables not extracted

**Problem**: CSS variables not showing in docs

**Solution**:
- Document variables in comments: `* --var-name: Description`
- Use `var(--var-name, fallback)` syntax for defaults
- Ensure style files match `styleFiles` extensions in config

### Build fails with TypeScript errors

**Problem**: TypeScript compilation errors

**Solution**:
- Ensure TypeScript 5.x is installed
- Check `tsconfig.json` is present in project root
- Verify component prop interfaces are properly typed

---

## Contributing

Contributions welcome! See the [GitHub repository](https://github.com/yourusername/docspark) for details.

---

## License

MIT © 2024

---

## Support

- 📖 [Documentation](https://github.com/inkorange/docspark)
- 🐛 [Report Issues](https://github.com/inkorange/docspark/issues)
- 💬 [Discussions](https://github.com/inkorange/docspark/discussions)
