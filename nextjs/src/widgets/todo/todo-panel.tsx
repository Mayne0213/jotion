'use client'

import { useEffect } from 'react'
import { TodoList } from '@/entities/todo/ui'
import { TodoCreateForm, TodoFilter } from '@/features/todo-management'
import { useTodoStore } from '@/entities/todo'

export function TodoPanel() {
  const { loadTodos } = useTodoStore()

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">할 일 목록</h2>
        <TodoCreateForm />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <TodoList />
      </div>

      <div className="p-4 border-t">
        <TodoFilter />
      </div>
    </div>
  )
}

