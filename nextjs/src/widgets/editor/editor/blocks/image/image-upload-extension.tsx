import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { ImageUploadComponent } from './image-upload-component';

export interface ImageUploadOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      setImageUpload: () => ReturnType;
    };
  }
}

export const ImageUploadExtension = Node.create<ImageUploadOptions>({
  name: 'imageUpload',

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
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      caption: {
        default: null,
      },
      loading: {
        default: true,
      },
      width: {
        default: null,
        parseHTML: element => element.getAttribute('data-width'),
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            'data-width': attributes.width,
          };
        },
      },
      path: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'image-upload',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['image-upload', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageUploadComponent);
  },

  addCommands() {
    return {
      setImageUpload:
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

