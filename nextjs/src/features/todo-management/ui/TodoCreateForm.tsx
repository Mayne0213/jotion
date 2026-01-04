'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Plus } from 'lucide-react'
import { useTodoStore } from '@/entities/todo'

export function TodoCreateForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const { addTodo } = useTodoStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    await addTodo({
      title: title.trim(),
      description: description.trim() || undefined,
    })

    setTitle('')
    setDescription('')
    setIsExpanded(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      setIsExpanded(false)
      setTitle('')
      setDescription('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="새로운 할 일 추가..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!title.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {isExpanded && (
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="설명 (선택사항)"
        />
      )}
    </form>
  )
}

