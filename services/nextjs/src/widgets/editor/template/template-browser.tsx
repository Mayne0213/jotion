"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { FileText, Search, Loader2, Calendar } from 'lucide-react'
import { useAuth } from '@/src/app/providers/auth-provider'
import type { DatabaseTemplate, TemplateBrowserProps } from '@/shared/types'
import { apiGet } from '@/shared/lib/api-client'

export function TemplateBrowser({ isOpen, onClose, onSelectTemplate }: TemplateBrowserProps) {
  const { user } = useAuth()
  const [templates, setTemplates] = useState<DatabaseTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<DatabaseTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [error, setError] = useState('')

  const categories = ['All', 'General', 'Meeting Notes', 'Project Plan', 'Research', 'Blog Post', 'Report', 'Presentation', 'Personal']

  // Fetch templates from database
  const fetchTemplates = async () => {
    if (!user) return

    setIsLoading(true)
    setError('')

    try {
      const data = await apiGet<{ templates: DatabaseTemplate[] }>('/api/templates')
      setTemplates(data.templates || [])
      setFilteredTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching templates:', error)
      setError('Failed to load templates')
    } finally {
      setIsLoading(false)
    }
  }

  // Filter templates based on search and category
  useEffect(() => {
    let filtered = templates

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    setFilteredTemplates(filtered)
  }, [templates, searchQuery, selectedCategory])

  // Fetch templates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTemplates()
    }
  }, [isOpen, user])

  const handleSelectTemplate = (template: DatabaseTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Templates
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600">Loading templates...</span>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'No templates found matching your search criteria.' 
                    : 'No templates created yet.'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Edit a document and create a template using the "Create Template" button.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description || 'No description'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(template.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 truncate">
                      Title: {template.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
