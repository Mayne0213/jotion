"use client";

import {
  File,
  Code,
  FileCode,
  FileImage,
  FileJson,
  FileText,
  FileArchive,
} from "lucide-react";

export interface FileIconProps {
  fileName: string;
  language?: string;
  className?: string;
}

export const FileIcon = ({
  fileName,
  language,
  className = "h-4 w-4",
}: FileIconProps) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (language) {
    switch (language.toLowerCase()) {
      case "javascript":
      case "typescript":
        return <Code className={`${className} text-yellow-600`} />;
      case "python":
        return <FileCode className={`${className} text-blue-600`} />;
      case "java":
        return <FileCode className={`${className} text-orange-600`} />;
      case "html":
        return <FileCode className={`${className} text-red-600`} />;
      case "css":
        return <FileCode className={`${className} text-blue-500`} />;
      case "json":
        return <FileJson className={`${className} text-yellow-500`} />;
      default:
        return <FileCode className={`${className} text-gray-600`} />;
    }
  }

  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return <Code className={`${className} text-yellow-600`} />;
    case "py":
      return <FileCode className={`${className} text-blue-600`} />;
    case "java":
      return <FileCode className={`${className} text-orange-600`} />;
    case "html":
    case "htm":
      return <FileCode className={`${className} text-red-600`} />;
    case "css":
    case "scss":
    case "sass":
      return <FileCode className={`${className} text-blue-500`} />;
    case "json":
      return <FileJson className={`${className} text-yellow-500`} />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
      return <FileImage className={`${className} text-green-600`} />;
    case "md":
    case "txt":
      return <FileText className={`${className} text-gray-600`} />;
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className={`${className} text-purple-600`} />;
    default:
      return <File className={`${className} text-gray-600`} />;
  }
};
