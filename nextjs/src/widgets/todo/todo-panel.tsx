'use client'

import { useEffect, ReactNode } from 'react'
import { TodoList } from '@/entities/todo/ui'
import { useTodoStore } from '@/entities/todo'

interface TodoPanelProps {
  /** Slot for the create form component */
  CreateForm?: ReactNode;
  /** Slot for the filter component */
  Filter?: ReactNode;
}

export function TodoPanel({ CreateForm, Filter }: TodoPanelProps) {
  const { loadTodos } = useTodoStore()

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">할 일 목록</h2>
        {CreateForm}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <TodoList />
      </div>

      <div className="p-4 border-t">
        {Filter}
      </div>
    </div>
  )
}

