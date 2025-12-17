import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const HeadingId = Extension.create({
  name: 'headingId',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('headingId'),
        props: {
          decorations: (state) => {
            const decorations: Decoration[] = [];
            const doc = state.doc;

            // Track heading occurrences to ensure unique IDs
            const idCounts = new Map<string, number>();
            
            doc.descendants((node, pos) => {
              if (node.type.name === 'heading') {
                const text = node.textContent;
                // Keep alphanumeric characters (including Korean), spaces become hyphens
                const baseId = text.toLowerCase()
                  .replace(/\s+/g, '-')  // Replace spaces with hyphens
                  .replace(/[^a-z0-9\u3131-\u3163\uac00-\ud7a3-]+/g, '')  // Keep only letters, numbers, Korean chars, and hyphens
                  .replace(/-+/g, '-')  // Replace multiple hyphens with single hyphen
                  .replace(/^-|-$/g, '');  // Remove leading/trailing hyphens
                
                // Ensure unique IDs by adding a counter suffix if duplicates exist
                const count = idCounts.get(baseId) || 0;
                idCounts.set(baseId, count + 1);
                const id = count === 0 ? baseId : `${baseId}-${count}`;
                
                decorations.push(
                  Decoration.node(pos, pos + node.nodeSize, {
                    'data-heading-id': id,
                  })
                );
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

