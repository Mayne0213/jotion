export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateTodoData {
  title: string
  description?: string
}

export interface UpdateTodoData {
  title?: string
  description?: string
  completed?: boolean
}

export type TodoFilter = 'all' | 'active' | 'completed'

// Store types
export interface TodoState {
  todos: Todo[]
  filter: TodoFilter
  isLoading: boolean
  error: string | null
}

export interface TodoActions {
  addTodo: (data: CreateTodoData) => Promise<void>
  updateTodo: (id: string, data: UpdateTodoData) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  loadTodos: () => Promise<void>
  setFilter: (filter: TodoFilter) => void
  clearCompleted: () => Promise<void>
}

export type TodoStore = TodoState & TodoActions

