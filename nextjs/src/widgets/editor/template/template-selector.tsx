"use client"

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { FileText, FolderOpen } from 'lucide-react'
import { TemplateBrowser } from './template-browser'
import type { Template, DatabaseTemplate, TemplateSelectorProps } from '@/shared/types'


export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [showBrowser, setShowBrowser] = useState(false)

  const handleSelectDatabaseTemplate = (template: DatabaseTemplate) => {
    // Convert database template to the expected format
    const convertedTemplate: Template = {
      id: template.id,
      name: template.name,
      description: template.description || '',
      icon: <FileText className="h-5 w-5" />,
      content: template.content
    }
    onSelectTemplate(convertedTemplate)
  }

  return (
    <>
      <Button
        onClick={() => setShowBrowser(true)}
        variant="outline"
        className="w-full justify-start"
      >
        <FolderOpen className="h-4 w-4 mr-2" />
        Select Template
      </Button>

      <TemplateBrowser
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
        onSelectTemplate={handleSelectDatabaseTemplate}
      />
    </>
  )
}
