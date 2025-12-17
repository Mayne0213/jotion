import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { BookmarkComponent } from './bookmark-component';

export interface BookmarkAttributes {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  author?: string;
  loading?: boolean;
  error?: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bookmark: {
      setBookmark: (attributes: BookmarkAttributes) => ReturnType;
    };
  }
}

export const BookmarkExtension = Node.create({
  name: 'bookmark',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      url: {
        default: null,
        parseHTML: element => element.getAttribute('data-url'),
        renderHTML: attributes => {
          if (!attributes.url) {
            return {};
          }
          return {
            'data-url': attributes.url,
          };
        },
      },
      title: {
        default: null,
        parseHTML: element => element.getAttribute('data-title'),
        renderHTML: attributes => {
          if (!attributes.title) {
            return {};
          }
          return {
            'data-title': attributes.title,
          };
        },
      },
      description: {
        default: null,
        parseHTML: element => element.getAttribute('data-description'),
        renderHTML: attributes => {
          if (!attributes.description) {
            return {};
          }
          return {
            'data-description': attributes.description,
          };
        },
      },
      image: {
        default: null,
        parseHTML: element => element.getAttribute('data-image'),
        renderHTML: attributes => {
          if (!attributes.image) {
            return {};
          }
          return {
            'data-image': attributes.image,
          };
        },
      },
      domain: {
        default: null,
        parseHTML: element => element.getAttribute('data-domain'),
        renderHTML: attributes => {
          if (!attributes.domain) {
            return {};
          }
          return {
            'data-domain': attributes.domain,
          };
        },
      },
      author: {
        default: null,
        parseHTML: element => element.getAttribute('data-author'),
        renderHTML: attributes => {
          if (!attributes.author) {
            return {};
          }
          return {
            'data-author': attributes.author,
          };
        },
      },
      loading: {
        default: false,
        parseHTML: element => element.getAttribute('data-loading') === 'true',
        renderHTML: attributes => {
          if (!attributes.loading) {
            return {};
          }
          return {
            'data-loading': attributes.loading,
          };
        },
      },
      error: {
        default: null,
        parseHTML: element => element.getAttribute('data-error'),
        renderHTML: attributes => {
          if (!attributes.error) {
            return {};
          }
          return {
            'data-error': attributes.error,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="bookmark"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-type': 'bookmark' },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BookmarkComponent);
  },

  addCommands() {
    return {
      setBookmark:
        (attributes: BookmarkAttributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});

