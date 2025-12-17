import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AudioComponent } from './audio-component';

export interface AudioOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    audio: {
      setAudio: () => ReturnType;
    };
  }
}

export const AudioExtension = Node.create<AudioOptions>({
  name: 'audio',

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
      loading: {
        default: true,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'audio-block',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['audio-block', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AudioComponent);
  },

  addCommands() {
    return {
      setAudio:
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

