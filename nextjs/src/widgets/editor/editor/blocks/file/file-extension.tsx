import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { FileComponent } from './file-component';

export interface FileOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    file: {
      setFile: () => ReturnType;
    };
  }
}

export const FileExtension = Node.create<FileOptions>({
  name: 'file',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      fileName: {
        default: null,
      },
      fileSize: {
        default: null,
      },
      fileType: {
        default: null,
      },
      loading: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'file-block',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['file-block', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileComponent);
  },

  addCommands() {
    return {
      setFile:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              loading: true,
            },
          });
        },
    };
  },
});

