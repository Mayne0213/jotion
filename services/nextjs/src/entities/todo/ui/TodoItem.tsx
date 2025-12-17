'use client'

import { Todo } from '../model/types'
import { Checkbox } from '@/shared/ui/checkbox'
import { Button } from '@/shared/ui/button'
import { Trash2, Edit2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useState } from 'react'
import { Input } from '@/shared/ui/input'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, title: string, description?: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDescription, setEditDescription] = useState(todo.description || '')

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, editTitle, editDescription)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 p-3 border rounded-lg bg-background">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Todo 제목"
          className="font-medium"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
        />
        <Input
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="설명 (선택사항)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
        />
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            취소
          </Button>
          <Button size="sm" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border bg-background",
        "hover:bg-accent/50 transition-colors group"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-0.5"
      />
      
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "font-medium text-sm",
            todo.completed && "line-through text-muted-foreground"
          )}
        >
          {todo.title}
        </div>
        {todo.description && (
          <div className="text-xs text-muted-foreground mt-1">
            {todo.description}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(todo.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

