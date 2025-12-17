import React, { useState, useEffect } from 'react';
import { COMPONENT_MAP } from '../preview-components';
import './LivePreview.scss';

// Extend window interface for component loading
declare global {
  interface Window {
    DOCSPARK_COMPONENTS?: Record<string, any>;
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

  // Render the actual component
  try {
    return (
      <div className="live-preview-wrapper">
        <Component {...processedProps} />
      </div>
    );
  } catch (err) {
    return (
      <div className="live-preview-error">
        <span className="error-icon">⚠️</span>
        <span className="error-message">
          Render error: {err instanceof Error ? err.message : 'Unknown error'}
        </span>
      </div>
    );
  }
};

export default LivePreview;
