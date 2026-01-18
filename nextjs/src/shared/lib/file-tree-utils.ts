// File tree utility functions

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  language?: string;
  size?: number;
  children?: FileNode[];
}

/**
 * Build a hierarchical tree structure from a flat list of files
 */
export const buildFileTree = (files: FileNode[]): FileNode[] => {
  const tree: FileNode[] = [];
  const pathMap = new Map<string, FileNode>();

  // Sort files by path
  const sortedFiles = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sortedFiles) {
    const pathParts = file.path.split("/");
    let currentPath = "";
    let parentNode: FileNode | undefined;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (i === pathParts.length - 1) {
        // This is the file itself - preserve the original ID
        if (parentNode) {
          if (!parentNode.children) parentNode.children = [];
          parentNode.children.push(file);
        } else {
          tree.push(file);
        }
        pathMap.set(currentPath, file);
      } else {
        // This is a folder
        let folderNode = pathMap.get(currentPath);
        if (!folderNode) {
          folderNode = {
            id: currentPath,
            name: part,
            path: currentPath,
            type: "folder",
            children: [],
          };
          if (parentNode) {
            if (!parentNode.children) parentNode.children = [];
            parentNode.children.push(folderNode);
          } else {
            tree.push(folderNode);
          }
          pathMap.set(currentPath, folderNode);
        }
        parentNode = folderNode;
      }
    }
  }

  return tree;
};
