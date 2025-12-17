'use client'

import { TodoItem } from './TodoItem'
import { useTodoStore, useFilteredTodos } from '../model/store'
import { Spinner } from '@/shared/ui/spinner'

export function TodoList() {
  const { updateTodo, deleteTodo, toggleTodo, isLoading, error } = useTodoStore()
  const filteredTodos = useFilteredTodos()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        {error}
      </div>
    )
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        할 일이 없습니다
      </div>
    )
  }

  const handleUpdate = async (id: string, title: string, description?: string) => {
    await updateTodo(id, { title, description })
  }

  return (
    <div className="flex flex-col gap-2">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}

