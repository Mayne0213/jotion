import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { DocumentLinkNodeView } from './document-link-node-view'

export interface DocumentLinkOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    documentLink: {
      setDocumentLink: (attributes: { documentId: string; documentTitle: string }) => ReturnType
    }
  }
}

export const DocumentLink = Node.create<DocumentLinkOptions>({
  name: 'documentLink',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      documentId: {
        default: null,
        parseHTML: element => element.getAttribute('data-document-id'),
        renderHTML: attributes => {
          if (!attributes.documentId) {
            return {}
          }
          return {
            'data-document-id': attributes.documentId,
          }
        },
      },
      documentTitle: {
        default: null,
        parseHTML: element => element.getAttribute('data-document-title'),
        renderHTML: attributes => {
          if (!attributes.documentTitle) {
            return {}
          }
          return {
            'data-document-title': attributes.documentTitle,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="document-link"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      'data-type': 'document-link',
      class: 'document-link-block',
    }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DocumentLinkNodeView)
  },

  addCommands() {
    return {
      setDocumentLink: (attributes) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attributes,
        })
      },
    }
  },
})

