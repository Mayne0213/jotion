'use client'

import { TodoPanel } from '@/widgets/todo'
import { TodoCreateForm, TodoFilter } from '@/features/todo-management'

export default function TodosPage() {
  return (
    <div className="h-full flex flex-col">
      <TodoPanel
        CreateForm={<TodoCreateForm />}
        Filter={<TodoFilter />}
      />
    </div>
  )
}

