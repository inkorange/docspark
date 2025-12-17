import * as fs from 'fs';
import * as path from 'path';
import postcss from 'postcss';
import postcssScss from 'postcss-scss';

export interface CSSVariable {
  name: string;
  description: string;
  default?: string;
}

export interface StyleMetadata {
  cssVariables: CSSVariable[];
  filePath: string;
}

export class StyleParser {
  /**
   * Parse a CSS/SCSS file and extract CSS variables
   */
  async parseStyleFile(filePath: string): Promise<StyleMetadata> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const cssVariables = this.extractCSSVariables(content);

      return {
        cssVariables,
        filePath,
      };
    } catch (error) {
      console.error(`Error parsing style file ${filePath}:`, error);
      return {
        cssVariables: [],
        filePath,
      };
    }
  }

  /**
   * Extract CSS variables from file content
   * Only extracts variables explicitly documented in JSDoc comments
   */
  private extractCSSVariables(content: string): CSSVariable[] {
    const variableMap = new Map<string, CSSVariable>();

    // Extract ONLY from comment documentation
    const commentVars = this.extractFromComments(content);
    commentVars.forEach(v => variableMap.set(v.name, v));

    // Optionally enrich with default values from declarations, but ONLY for documented vars
    const declaredVars = this.extractFromDeclarations(content);
    declaredVars.forEach(v => {
      const existing = variableMap.get(v.name);
      if (existing && v.default) {
        // Only add default value to already documented variables
        variableMap.set(v.name, { ...existing, default: v.default });
      }
      // Do NOT add undocumented variables
    });

    return Array.from(variableMap.values());
  }

  /**
   * Extract CSS variables documented in comments
   * Supports two formats:
   * 1. --variable-name: Description
   * 2. --variable-name (just the name)
   */
  private extractFromComments(content: string): CSSVariable[] {
    const variables: CSSVariable[] = [];

    // Match comment blocks with CSS variable documentation
    const commentRegex = /\/\*\*[\s\S]*?\*\//g;
    const matches = content.match(commentRegex);

    if (!matches) return variables;

    for (const comment of matches) {
      // Look for lines with CSS variables in two formats:
      // Format 1: * --primary-background-color: Primary button background color
      const varWithDescRegex = /\*?\s*(--[\w-]+):\s*(.+)/g;
      // Format 2: --variable-name (just the name on its own line)
      const varOnlyRegex = /\*?\s*(--[\w-]+)\s*$/gm;

      let match;

      // First, try to match variables with descriptions
      while ((match = varWithDescRegex.exec(comment)) !== null) {
        const name = match[1].trim();
        const description = match[2].trim();

        variables.push({
          name,
          description,
        });
      }

      // Then, match variables without descriptions (if not already found)
      const foundNames = new Set(variables.map(v => v.name));
      varWithDescRegex.lastIndex = 0; // Reset regex

      while ((match = varOnlyRegex.exec(comment)) !== null) {
        const name = match[1].trim();
        if (!foundNames.has(name)) {
          variables.push({
            name,
            description: '', // No description provided
          });
          foundNames.add(name);
        }
      }
    }

    return variables;
  }

  /**
   * Extract CSS variables from var() usage and their fallback values
   */
  private extractFromDeclarations(content: string): CSSVariable[] {
    const variables: CSSVariable[] = [];
    const variableMap = new Map<string, string>();

    // Match var() usage with fallbacks
    // e.g., var(--primary-color, #0066cc)
    const varRegex = /var\((--[\w-]+)(?:,\s*([^)]+))?\)/g;
    let match;

    while ((match = varRegex.exec(content)) !== null) {
      const name = match[1];
      const fallback = match[2]?.trim();

      if (!variableMap.has(name)) {
        variableMap.set(name, fallback || '');
      }
    }

    // Convert map to array
    variableMap.forEach((defaultValue, name) => {
      variables.push({
        name,
        description: '', // Will be filled from comments if available
        default: defaultValue || undefined,
      });
    });

    return variables;
  }

  /**
   * Resolve a style file path relative to a component file
   */
  resolveStylePath(componentPath: string, styleImport: string): string {
    const componentDir = path.dirname(componentPath);
    return path.resolve(componentDir, styleImport);
  }
}
