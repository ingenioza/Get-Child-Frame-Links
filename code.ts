// This plugin extracts top-most sub-frame links from a selected frame or frame link

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

figma.showUI(__html__, { width: 400, height: 600 });

// Extract node ID from Figma URL
function extractNodeIdFromUrl(url: string): string | null {
  try {
    // Manual URL parsing since URL API is not available in plugin context
    const match = url.match(/[?&]node-id=([^&]+)/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

// Generate Figma link for a node
function generateFigmaLink(node: SceneNode): string {
  const fileKey = figma.fileKey || '';
  const fileName = encodeURIComponent(figma.root.name || 'Untitled');
  const nodeId = node.id.replace(/[:;]/g, '-');
  return `https://www.figma.com/file/${fileKey}/${fileName}?node-id=${nodeId}`;
}

// Find all direct child frames (top-most sub-frames)
function findTopMostSubFrames(parent: SceneNode): SceneNode[] {
  const subFrames: SceneNode[] = [];
  
  if ('children' in parent) {
    for (const child of parent.children) {
      // Check if child is a frame or frame-like component
      if (child.type === 'FRAME' || child.type === 'COMPONENT' || child.type === 'COMPONENT_SET') {
        subFrames.push(child);
      }
    }
  }
  
  return subFrames;
}

// Get frame by node ID
function getFrameById(nodeId: string): SceneNode | null {
  // Convert URL format node-id (with dashes) to Figma internal format (with colons/semicolons)
  const figmaNodeId = nodeId.replace(/-/g, ':');
  
  function findNode(node: SceneNode | PageNode): SceneNode | null {
    if (node.id === figmaNodeId || node.id === nodeId) {
      // Only return if it's a SceneNode (not a PageNode)
      if (node.type !== 'PAGE') {
        return node as SceneNode;
      }
    }
    
    if ('children' in node) {
      for (const child of node.children) {
        const found = findNode(child);
        if (found) return found;
      }
    }
    
    return null;
  }
  
  // Search through all pages
  for (const page of figma.root.children) {
    const found = findNode(page);
    if (found) return found;
  }
  
  return null;
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'get-sub-frames') {
    let targetFrame: SceneNode | null = null;
    
    if (msg.frameLink) {
      // Extract node ID from provided link
      const nodeId = extractNodeIdFromUrl(msg.frameLink);
      if (!nodeId) {
        figma.ui.postMessage({
          type: 'error',
          message: 'Invalid frame link. Please provide a valid Figma frame URL.'
        });
        return;
      }
      
      targetFrame = getFrameById(nodeId);
      if (!targetFrame) {
        figma.ui.postMessage({
          type: 'error',
          message: 'Frame not found. Make sure the frame exists in the current file.'
        });
        return;
      }
    } else {
      // Use currently selected frame
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        figma.ui.postMessage({
          type: 'error',
          message: 'No frame selected. Please select a frame or provide a frame link.'
        });
        return;
      }
      
      const selected = selection[0];
      if (selected.type !== 'FRAME' && selected.type !== 'COMPONENT' && selected.type !== 'COMPONENT_SET') {
        figma.ui.postMessage({
          type: 'error',
          message: 'Selected element is not a frame. Please select a frame or provide a frame link.'
        });
        return;
      }
      
      targetFrame = selected;
    }
    
    // Find all top-most sub-frames
    const subFrames = findTopMostSubFrames(targetFrame);
    
    if (subFrames.length === 0) {
      figma.ui.postMessage({
        type: 'result',
        links: [],
        message: 'No sub-frames found in the selected frame.'
      });
      return;
    }
    
    // Generate links for each sub-frame
    const links = subFrames.map(frame => ({
      name: frame.name,
      link: generateFigmaLink(frame),
      id: frame.id
    }));
    
    figma.ui.postMessage({
      type: 'result',
      links: links,
      parentName: targetFrame.name
    });
  }
  
  if (msg.type === 'get-selection') {
    // Send current selection info
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const selected = selection[0];
      figma.ui.postMessage({
        type: 'selection-info',
        name: selected.name,
        nodeType: selected.type,
        isFrame: selected.type === 'FRAME' || selected.type === 'COMPONENT' || selected.type === 'COMPONENT_SET'
      });
    } else {
      figma.ui.postMessage({
        type: 'selection-info',
        name: null,
        nodeType: null,
        isFrame: false
      });
    }
  }
};

// Monitor selection changes
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    const selected = selection[0];
    figma.ui.postMessage({
      type: 'selection-changed',
      name: selected.name,
      nodeType: selected.type,
      isFrame: selected.type === 'FRAME' || selected.type === 'COMPONENT' || selected.type === 'COMPONENT_SET'
    });
  } else {
    figma.ui.postMessage({
      type: 'selection-changed',
      name: null,
      nodeType: null,
      isFrame: false
    });
  }
});
