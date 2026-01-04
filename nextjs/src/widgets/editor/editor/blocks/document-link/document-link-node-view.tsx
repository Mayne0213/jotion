import { NodeViewWrapper } from '@tiptap/react'
import { NodeViewProps } from '@tiptap/core'
import { FileText, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const DocumentLinkNodeView = ({ node, updateAttributes }: NodeViewProps) => {
  const router = useRouter()
  const { documentId, documentTitle } = node.attrs

  const handleClick = () => {
    if (documentId) {
      router.push(`/documents/${documentId}`)
    }
  }

  return (
    <NodeViewWrapper as="span" className="document-link-wrapper">
      <span
        className="document-link-block cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        onClick={handleClick}
        contentEditable={false}
      >
        <FileText className="h-4 w-4 text-blue-600" />
        <span className="text-blue-800 font-medium">
          {documentTitle || 'Untitled Document'}
        </span>
        <ExternalLink className="h-3 w-3 text-blue-500" />
      </span>
    </NodeViewWrapper>
  )
}

