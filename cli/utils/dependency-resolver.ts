import * as fs from 'fs';
import * as path from 'path';

export interface ResolvedDependency {
  sourcePath: string;  // Original file path
  relativePath: string; // Path relative to base directory
  isComponent: boolean; // Whether this is a component file (tsx/jsx)
}

/**
 * Analyze imports in a file and resolve them to actual file paths
 */
export function analyzeImports(filePath: string, baseDir: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileDir = path.dirname(filePath);
  const imports: string[] = [];

  // Match various import patterns:
  // import X from './path'
  // import { X } from '../path'
  // import * as X from '@/path'
  // import './styles.css'
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Skip node_modules imports (react, lodash, etc.)
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
      continue;
    }

    // Resolve relative import to absolute path
    const resolvedPath = resolveImportPath(importPath, fileDir, baseDir);
    if (resolvedPath) {
      imports.push(resolvedPath);
    }
  }

  return imports;
}

/**
 * Resolve an import path to an actual file path
 * Handles:
 * - Relative imports (./Component, ../utils/helper)
 * - Extension inference (.tsx, .ts, .jsx, .js, .scss, .css)
 * - Index file resolution (./Button -> ./Button/index.tsx)
 */
function resolveImportPath(importPath: string, fileDir: string, baseDir: string): string | null {
  // Start with the absolute path
  let absolutePath = path.resolve(fileDir, importPath);

  // Try direct match first
  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile()) {
    return absolutePath;
  }

  // Try with common extensions
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.scss', '.css', '.module.scss', '.module.css'];
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

/**
 * Recursively resolve all dependencies for a list of component files
 * Returns a set of all files needed (including transitive dependencies)
 */
export function resolveAllDependencies(
  componentFiles: string[],
  baseDir: string,
  verbose: boolean = false
): Set<string> {
  const allDependencies = new Set<string>();
  const visited = new Set<string>();
  const queue = [...componentFiles];

  if (verbose) {
    console.log(`  🔍 Starting dependency resolution for ${componentFiles.length} files...`);
  }

  while (queue.length > 0) {
    const currentFile = queue.shift()!;

    // Skip if already visited
    if (visited.has(currentFile)) {
      continue;
    }
    visited.add(currentFile);

    // Verify file exists before processing
    if (!fs.existsSync(currentFile)) {
      if (verbose) {
        console.warn(`  ⚠️  File not found: ${currentFile}`);
      }
      continue;
    }

    // Add current file to dependencies
    allDependencies.add(currentFile);

    // Analyze imports in this file
    try {
      const imports = analyzeImports(currentFile, baseDir);

      if (verbose && imports.length > 0) {
        console.log(`  📦 ${path.relative(process.cwd(), currentFile)} imports ${imports.length} files`);
      }

      // Add unvisited imports to queue
      for (const importedFile of imports) {
        if (!visited.has(importedFile)) {
          queue.push(importedFile);
        }
      }
    } catch (error) {
      // If we can't read the file, skip it
      if (verbose) {
        console.warn(`  ⚠️  Could not analyze imports in ${currentFile}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  if (verbose) {
    console.log(`  ✅ Dependency resolution complete: ${allDependencies.size} total files`);
  }

  return allDependencies;
}

/**
 * Categorize resolved dependencies by type
 */
export function categorizeDependencies(dependencies: Set<string>): {
  components: string[];
  styles: string[];
  utilities: string[];
  types: string[];
  other: string[];
} {
  const result = {
    components: [] as string[],
    styles: [] as string[],
    utilities: [] as string[],
    types: [] as string[],
    other: [] as string[]
  };

  for (const file of dependencies) {
    const ext = path.extname(file);
    const basename = path.basename(file);

    if (ext === '.scss' || ext === '.css' || basename.includes('.module.')) {
      result.styles.push(file);
    } else if (ext === '.tsx' || ext === '.jsx') {
      result.components.push(file);
    } else if (ext === '.ts' && file.includes('/types/')) {
      result.types.push(file);
    } else if (ext === '.ts' || ext === '.js') {
      result.utilities.push(file);
    } else {
      result.other.push(file);
    }
  }

  return result;
}
