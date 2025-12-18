import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { COMPONENT_MAP } from '../preview-components';
import { useCSSVariablesVersion } from '../contexts/CSSVariablesContext';
import './LivePreview.scss';

// Extend window interface for component loading
declare global {
  interface Window {
    DOCSPARK_COMPONENTS?: Record<string, any>;
  }
}

// Error Boundary to catch component rendering errors
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ComponentErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="live-preview-error">
          <span className="error-icon">⚠️</span>
          <span className="error-message">
            Render error: {this.state.error?.message || 'Component failed to render'}
          </span>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get component map from window (runtime loaded) or fallback to build-time map
function getComponentMap(): Record<string, any> {
  // Prefer runtime-loaded components from window global
  if (typeof window !== 'undefined' && window.DOCSPARK_COMPONENTS) {
    return window.DOCSPARK_COMPONENTS;
  }
  // Fallback to build-time component map
  return COMPONENT_MAP;
}

interface LivePreviewProps {
  componentName: string;
  props: Record<string, any>;
  fallback?: React.ReactNode;
}

/**
 * LivePreview Component
 *
 * Renders a live preview of a component with the given props.
 * Falls back to a placeholder if the component is not registered.
 */
const LivePreview: React.FC<LivePreviewProps> = ({
  componentName,
  props,
  fallback,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [mounted, setMounted] = useState(true);
  const { version, customCSSVariables } = useCSSVariablesVersion();

  // Force unmount and remount when version changes to recalculate CSS variables
  useEffect(() => {
    setMounted(false);
    // Use requestAnimationFrame to ensure DOM update before remounting
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, [version]);

  // Process props to convert HTML strings to React elements
  // Must be called before any conditional returns (Rules of Hooks)
  const processedProps = React.useMemo(() => {
    const processed: Record<string, any> = {};

    for (const [key, value] of Object.entries(props)) {
      // Check if the value is an HTML/JSX string (starts with < and ends with >)
      if (typeof value === 'string' && value.trim().startsWith('<') && value.trim().endsWith('>')) {
        // Use dangerouslySetInnerHTML pattern by creating a div wrapper
        processed[key] = <div dangerouslySetInnerHTML={{ __html: value }} />;
      } else {
        processed[key] = value;
      }
    }

    return processed;
  }, [props]);

  useEffect(() => {
    setError(null);

    const componentMap = getComponentMap();

    // Check if component exists in the component map
    if (!componentMap[componentName]) {
      setComponent(null);
      return;
    }

    try {
      const comp = componentMap[componentName];
      setComponent(() => comp);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load component');
      setComponent(null);
    }
  }, [componentName]);

  // Show error state
  if (error) {
    return (
      <div className="live-preview-error">
        <span className="error-icon">⚠️</span>
        <span className="error-message">Error: {error}</span>
      </div>
    );
  }

  // Component not registered - show fallback or placeholder
  if (!Component) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="live-preview-placeholder">
        <span className="component-tag">&lt;{componentName} /&gt;</span>
        <span className="preview-note">
          Live preview not available
        </span>
        <span className="preview-hint">
          Live previews require the React website to build successfully from source.
          All documentation features (props, variants, code examples) remain fully functional.
        </span>
      </div>
    );
  }

  // Don't render component if we're in the process of remounting
  if (!mounted) {
    return null;
  }

  // Create inline style object with custom CSS variables
  const customStyles = Object.entries(customCSSVariables).reduce((acc, [varName, value]) => {
    acc[varName] = value;
    return acc;
  }, {} as Record<string, string>);

  // Render the actual component wrapped in error boundary
  // Include version in key to force re-render when CSS variables change
  // Apply custom CSS variables as inline styles to override CSS Module scoping
  return (
    <ComponentErrorBoundary key={`error-boundary-${version}`}>
      <div
        className="live-preview-wrapper"
        data-version={version}
        style={customStyles as React.CSSProperties}
      >
        <Component {...processedProps} key={`component-${version}`} />
      </div>
    </ComponentErrorBoundary>
  );
};

export default LivePreview;
