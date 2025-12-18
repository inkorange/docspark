import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { spawn } from 'child_process';
import { resolveAllDependencies } from './dependency-resolver';

/**
 * Build the documentation website with user's components
 * This copies the user's components into the website source and builds it
 */
export async function buildWebsiteWithComponents(
  config: any,
  outputDir: string,
  verbose: boolean,
  skipTypeCheck: boolean = false
): Promise<void> {
  // Find website source directory
  const websiteSourceDir = findWebsiteSource();

  if (!websiteSourceDir) {
    throw new Error('Website source directory not found (no package.json or src/ directory)');
  }

  const websitePreviewDir = path.join(websiteSourceDir, 'src', 'preview-components');

  // Clear preview-components directory
  if (fs.existsSync(websitePreviewDir)) {
    fs.rmSync(websitePreviewDir, { recursive: true });
  }
  fs.mkdirSync(websitePreviewDir, { recursive: true });

  // Extract base directory from the first pattern
  const firstPattern = config.source.include[0];
  let baseDir = firstPattern.replace(/\/\*\*\/.*$/, '').replace(/\/$/, '');

  const componentMap: Array<{ name: string; path: string; isNamed: boolean }> = [];

  // After resolving dependencies, find the common parent directory
  // This ensures we can include files like icons that are siblings to components
  let commonParent = baseDir;

  // Step 1: Find all component files matching patterns
  const componentFiles: string[] = [];
  for (const pattern of config.source.include) {
    const files = await glob(pattern, {
      ignore: config.source.exclude || [],
      cwd: process.cwd(),
    });
    componentFiles.push(...files.map(f => path.resolve(process.cwd(), f)));
  }

  if (verbose) {
    console.log(`  📦 Found ${componentFiles.length} component files`);
    console.log('  🔍 Analyzing dependencies...');
  }

  // Step 2: Automatically resolve all dependencies (imports)
  const allFilesToCopy = resolveAllDependencies(componentFiles, baseDir, verbose, config.source.importAliases);

  if (verbose) {
    console.log(`  ✓ Resolved ${allFilesToCopy.size} total files (including dependencies)`);
  }

  // Step 2.5: Find common parent directory of all files to copy
  // This handles cases where dependencies are in sibling directories (e.g., icons/)
  if (allFilesToCopy.size > 0) {
    const allPaths = Array.from(allFilesToCopy);
    commonParent = findCommonParent(allPaths, baseDir);
    if (verbose && commonParent !== baseDir) {
      console.log(`  ℹ Expanded base directory to: ${commonParent}`);
    }
  }

  // Step 3: Copy all files (components + dependencies)
  for (const sourcePath of allFilesToCopy) {
    // Calculate relative path from common parent directory
    const relativePath = path.relative(path.resolve(process.cwd(), commonParent), sourcePath);

    // Skip files outside the common parent directory (e.g., node_modules)
    if (relativePath.startsWith('..')) {
      continue;
    }

    const targetPath = path.join(websitePreviewDir, relativePath);

    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Read and process content
    let content = fs.readFileSync(sourcePath, 'utf-8');

    // Only strip 'use client' from component files
    if (sourcePath.endsWith('.tsx') || sourcePath.endsWith('.jsx')) {
      content = content.replace(/^['"]use client['"];?\s*\n/m, '');
    }

    // Rewrite import aliases to relative paths
    if (sourcePath.endsWith('.tsx') || sourcePath.endsWith('.jsx') || sourcePath.endsWith('.ts') || sourcePath.endsWith('.js')) {
      content = rewriteImports(content, sourcePath, targetPath, commonParent, config.source.importAliases);
    }

    fs.writeFileSync(targetPath, content, 'utf-8');

    // Build component map only for originally requested components (not dependencies)
    const isOriginalComponent = componentFiles.some(cf =>
      path.resolve(process.cwd(), cf) === sourcePath
    );

    if (isOriginalComponent && (sourcePath.endsWith('.tsx') || sourcePath.endsWith('.jsx'))) {
      const fileName = path.basename(sourcePath, path.extname(sourcePath));

      // Try to find the actual export name from the file content
      let componentName = fileName;
      let isNamed = false;

      // Check for named exports: export const ComponentName or export function ComponentName
      // Look for all named exports, prioritizing ones that match the filename
      const namedExportRegex = /export\s+(?:const|function)\s+(\w+)/g;
      const allNamedExports: string[] = [];
      let match;
      while ((match = namedExportRegex.exec(content)) !== null) {
        allNamedExports.push(match[1]);
      }

      if (allNamedExports.length > 0) {
        // Prefer export that matches the filename
        const fileNameMatch = allNamedExports.find(name => name === fileName);
        componentName = fileNameMatch || allNamedExports[0];
        isNamed = true;
      }

      // Check for default export
      const hasDefaultExport = content.includes('export default');
      if (hasDefaultExport && !allNamedExports.find(name => name === fileName)) {
        // Default export - use filename as component name if no matching named export
        isNamed = false;
      }

      componentMap.push({
        name: componentName,
        path: './' + relativePath.replace(/\.(tsx|jsx|ts|js)$/, ''),
        isNamed: isNamed
      });
    }
  }

  // Step 4: Filter barrel export files (index.ts/index.js) to only include exported files that exist
  filterBarrelExports(websitePreviewDir, verbose);

  // Generate index.ts
  const imports = componentMap.map(({ name, path, isNamed }) =>
    isNamed ? `import { ${name} } from '${path}';` : `import ${name} from '${path}';`
  ).join('\n');

  const exports = componentMap.map(({ name }) => `export { ${name} };`).join('\n');

  const componentMapCode = componentMap.map(({ name }) => `  '${name}': ${name},`).join('\n');

  const indexContent = `// Auto-generated file - do not edit manually
// This file is generated by DocSpark during the build process

${imports}

${exports}

// Component registry for dynamic imports
export const COMPONENT_MAP: Record<string, any> = {
${componentMapCode}
};

// Prevent tree-shaking: ensure all components in the map are kept in the bundle
// This is critical for dynamic component loading in LivePreview
if (typeof window !== 'undefined') {
  (window as any).COMPONENT_MAP_KEYS = Object.keys(COMPONENT_MAP);
}
`;

  fs.writeFileSync(path.join(websitePreviewDir, 'index.ts'), indexContent, 'utf-8');

  if (verbose) {
    console.log(`  ✓ Copied ${componentMap.length} components to website source`);
  }

  // Install website dependencies if node_modules doesn't exist
  const websiteNodeModules = path.join(websiteSourceDir, 'node_modules');
  if (!fs.existsSync(websiteNodeModules)) {
    if (verbose) {
      console.log('  📦 Installing website dependencies...');
    }
    await installWebsiteDependencies(websiteSourceDir, verbose);
  }

  // Build the React website
  if (verbose) {
    console.log('  🔨 Building React website...');
  }

  // Preserve metadata and themes directories before React build (which overwrites outputDir)
  const metadataDir = path.join(outputDir, 'metadata');
  const themesDir = path.join(outputDir, 'themes');
  const tempDir = path.join(outputDir, '..', '.docspark-temp');

  // Save metadata and themes to temp location
  if (fs.existsSync(metadataDir) || fs.existsSync(themesDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    if (fs.existsSync(metadataDir)) {
      fs.cpSync(metadataDir, path.join(tempDir, 'metadata'), { recursive: true });
    }
    if (fs.existsSync(themesDir)) {
      fs.cpSync(themesDir, path.join(tempDir, 'themes'), { recursive: true });
    }
  }

  await buildReactWebsite(websiteSourceDir, outputDir, verbose, skipTypeCheck);

  // Restore metadata and themes after React build
  if (fs.existsSync(tempDir)) {
    if (fs.existsSync(path.join(tempDir, 'metadata'))) {
      fs.cpSync(path.join(tempDir, 'metadata'), metadataDir, { recursive: true });
    }
    if (fs.existsSync(path.join(tempDir, 'themes'))) {
      fs.cpSync(path.join(tempDir, 'themes'), themesDir, { recursive: true });
    }
    // Clean up temp directory
    fs.rmSync(tempDir, { recursive: true });
  }
}

/**
 * Rewrite import statements to convert package aliases to relative paths
 * This handles imports like '@ua-web-components/providers/X' and converts them to relative paths
 */
function rewriteImports(
  content: string,
  sourcePath: string,
  targetPath: string,
  commonParent: string,
  importAliases?: Record<string, string>
): string {
  if (!importAliases || Object.keys(importAliases).length === 0) {
    return content;
  }

  let modifiedContent = content;
  const sourceDir = path.dirname(sourcePath);
  const targetDir = path.dirname(targetPath);

  // For each alias, rewrite imports that match
  for (const [alias, aliasPath] of Object.entries(importAliases)) {
    // Match imports like: import X from '@ua-web-components/providers/UIComponentsProvider'
    // Also match: import { X } from '@ua-web-components/providers/UIComponentsProvider'
    const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const importRegex = new RegExp(
      `(from\\s+['"])${escapedAlias}([^'"]+)(['"])`,
      'g'
    );

    modifiedContent = modifiedContent.replace(importRegex, (match, prefix, importPath, suffix) => {
      // Resolve the alias to an actual path in the SOURCE project
      // aliasPath is relative to project root (e.g., "packages/core/")
      // importPath is the rest after the alias (e.g., "providers/UIComponentsProvider")
      const resolvedAlias = aliasPath.replace(/\/$/, ''); // Remove trailing slash
      const absoluteSourceImport = path.join(process.cwd(), resolvedAlias, importPath);

      // Get relative paths from common parent for both files
      const sourceFileRelative = path.relative(path.resolve(process.cwd(), commonParent), sourcePath);
      const importFileRelative = path.relative(path.resolve(process.cwd(), commonParent), absoluteSourceImport);

      // Calculate relative path between the two files (they maintain same structure in target)
      const sourceFileDir = path.dirname(sourceFileRelative);
      const relativeImport = path.relative(sourceFileDir, importFileRelative);

      // Ensure relative path starts with ./ or ../
      const normalizedRelative = relativeImport.startsWith('.') ? relativeImport : './' + relativeImport;

      // Convert Windows paths to Unix-style
      const unixPath = normalizedRelative.replace(/\\/g, '/');

      return `${prefix}${unixPath}${suffix}`;
    });
  }

  return modifiedContent;
}

/**
 * Find the common parent directory of all file paths
 * This is used to expand the base directory to include sibling directories (like icons/)
 */
function findCommonParent(paths: string[], fallback: string): string {
  if (paths.length === 0) return fallback;

  const resolved = paths.map(p => path.resolve(process.cwd(), p));
  const parts = resolved.map(p => p.split(path.sep));

  let commonParts: string[] = [];
  for (let i = 0; i < parts[0].length; i++) {
    const part = parts[0][i];
    if (parts.every(p => p[i] === part)) {
      commonParts.push(part);
    } else {
      break;
    }
  }

  return commonParts.join(path.sep) || fallback;
}

/**
 * Find the website source directory
 * Returns the directory only if it contains source files (package.json and src/)
 */
function findWebsiteSource(): string | null {
  // Try local website directory first (development)
  const localWebsite = path.join(process.cwd(), 'website');
  if (isWebsiteSourceDir(localWebsite)) {
    return localWebsite;
  }

  // Try package website directory (production - npm installed)
  const packageWebsite = path.join(__dirname, '../../../website');
  if (isWebsiteSourceDir(packageWebsite)) {
    return packageWebsite;
  }

  return null;
}

/**
 * Check if a directory contains website source files (not just build output)
 */
function isWebsiteSourceDir(dir: string): boolean {
  if (!fs.existsSync(dir)) {
    return false;
  }

  // Must have both package.json and src/ to be a valid source directory
  const hasPackageJson = fs.existsSync(path.join(dir, 'package.json'));
  const hasSrcDir = fs.existsSync(path.join(dir, 'src'));

  return hasPackageJson && hasSrcDir;
}

/**
 * Install website dependencies using npm
 */
function installWebsiteDependencies(websiteDir: string, verbose: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    const installProcess = spawn(
      npmCommand,
      ['install', '--legacy-peer-deps'],
      {
        cwd: websiteDir,
        stdio: verbose ? 'inherit' : 'pipe',
        shell: true,
      }
    );

    let output = '';

    if (!verbose) {
      installProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });
      installProcess.stderr?.on('data', (data) => {
        output += data.toString();
      });
    }

    installProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        if (!verbose) {
          console.error(output);
        }
        reject(new Error(`npm install failed with code ${code}`));
      }
    });

    installProcess.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Build the React website using react-scripts
 */
function buildReactWebsite(websiteDir: string, outputDir: string, verbose: boolean, skipTypeCheck: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

    // Ensure outputDir is absolute
    const absoluteOutputDir = path.isAbsolute(outputDir) ? outputDir : path.resolve(process.cwd(), outputDir);

    const buildProcess = spawn(
      npxCommand,
      ['react-scripts', 'build'],
      {
        cwd: websiteDir,
        env: {
          ...process.env,
          BUILD_PATH: absoluteOutputDir,
          CI: 'true', // Treat warnings as warnings, not errors
          DISABLE_ESLINT_PLUGIN: 'true', // Disable ESLint during build
          ...(skipTypeCheck ? {
            TSC_COMPILE_ON_ERROR: 'true',  // Allow compilation despite TypeScript errors
            SKIP_PREFLIGHT_CHECK: 'true'    // Skip preflight checks
          } : {})
        },
        stdio: verbose ? 'inherit' : 'pipe',
        shell: true,
      }
    );

    let output = '';

    if (!verbose) {
      buildProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });
      buildProcess.stderr?.on('data', (data) => {
        output += data.toString();
      });
    }

    buildProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        // Parse output for useful error information
        let errorSummary = `Website build failed with code ${code}`;

        // Look for module resolution errors
        const moduleNotFoundMatch = output.match(/Module not found:.*?Error: Can't resolve '([^']+)'/);
        if (moduleNotFoundMatch) {
          errorSummary = `Cannot find module "${moduleNotFoundMatch[1]}"`;
        }

        // Look for TypeScript errors
        const tsErrorMatch = output.match(/TypeScript error in ([^:]+):\s*(.+)/);
        if (tsErrorMatch) {
          errorSummary = `TypeScript error in ${tsErrorMatch[1]}: ${tsErrorMatch[2]}`;
        }

        // Look for compilation errors
        const compileErrorMatch = output.match(/Failed to compile\.\s*\n\s*(.+)/);
        if (compileErrorMatch) {
          errorSummary = compileErrorMatch[1].trim();
        }

        if (!verbose) {
          console.error(output);
        }
        reject(new Error(errorSummary));
      }
    });

    buildProcess.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Filter barrel export files (index.ts/index.js) to only include exports for files that exist
 * This prevents import errors when a barrel file re-exports modules that weren't copied
 */
function filterBarrelExports(previewDir: string, verbose: boolean): void {
  // Find all index.ts and index.js files
  const indexFiles = findIndexFiles(previewDir);

  for (const indexFile of indexFiles) {
    try {
      const content = fs.readFileSync(indexFile, 'utf-8');
      const indexDir = path.dirname(indexFile);

      // Match export statements like:
      // export { default as ComponentName } from './ComponentName'
      // export { ComponentName } from './path'
      // export * from './path'
      const exportRegex = /^export\s+(?:\{[^}]+\}\s+from\s+|(?:\*|type\s+\{[^}]+\})\s+from\s+)['"]([^'"]+)['"]/gm;

      const lines = content.split('\n');
      const filteredLines: string[] = [];

      for (const line of lines) {
        const match = exportRegex.exec(line);
        exportRegex.lastIndex = 0; // Reset regex state

        if (match) {
          const exportPath = match[1];
          // Resolve the export path to see if the file exists
          const resolvedPath = resolveExportPath(exportPath, indexDir);

          if (resolvedPath && fs.existsSync(resolvedPath)) {
            // File exists, keep the export
            filteredLines.push(line);
          } else if (verbose) {
            console.log(`  ℹ Filtered out missing export: ${exportPath} from ${path.relative(previewDir, indexFile)}`);
          }
        } else {
          // Not an export statement, keep it
          filteredLines.push(line);
        }
      }

      // Only write if we filtered something out
      const filteredContent = filteredLines.join('\n');
      if (filteredContent !== content) {
        fs.writeFileSync(indexFile, filteredContent, 'utf-8');
        if (verbose) {
          console.log(`  ✓ Filtered barrel exports in ${path.relative(previewDir, indexFile)}`);
        }
      }
    } catch (error) {
      // If we can't read/write the file, skip it
      if (verbose) {
        console.warn(`  ⚠️  Could not filter ${indexFile}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }
}

/**
 * Recursively find all index.ts and index.js files in a directory
 */
function findIndexFiles(dir: string): string[] {
  const results: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules
        if (entry.name !== 'node_modules') {
          walk(fullPath);
        }
      } else if (entry.isFile()) {
        // Check if this is an index file
        const basename = path.basename(entry.name, path.extname(entry.name));
        if (basename === 'index' && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(dir);
  return results;
}

/**
 * Resolve an export path to an actual file path (handles extensions and index files)
 */
function resolveExportPath(exportPath: string, baseDir: string): string | null {
  const absolutePath = path.resolve(baseDir, exportPath);

  // Try direct match
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  // Try with extensions
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  for (const ext of extensions) {
    const withExt = absolutePath + ext;
    if (fs.existsSync(withExt)) {
      return withExt;
    }
  }

  // Try as directory with index file
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    for (const ext of extensions) {
      const indexFile = path.join(absolutePath, 'index' + ext);
      if (fs.existsSync(indexFile)) {
        return indexFile;
      }
    }
  }

  return null;
}
