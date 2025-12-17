'use client'

import { Button } from '@/shared/ui/button'
import { useTodoStore } from '@/entities/todo'
import { TodoFilter as TodoFilterType } from '@/entities/todo'

export function TodoFilter() {
  const { filter, setFilter, clearCompleted, todos } = useTodoStore()

  const completedCount = todos.filter(t => t.completed).length
  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'ghost'}
          onClick={() => setFilter('all')}
        >
          전체 ({todos.length})
        </Button>
        <Button
          size="sm"
          variant={filter === 'active' ? 'default' : 'ghost'}
          onClick={() => setFilter('active')}
        >
          진행중 ({activeCount})
        </Button>
        <Button
          size="sm"
          variant={filter === 'completed' ? 'default' : 'ghost'}
          onClick={() => setFilter('completed')}
        >
          완료 ({completedCount})
        </Button>
      </div>

      {completedCount > 0 && (
        <Button
          size="sm"
          variant="ghost"
          onClick={clearCompleted}
          className="text-muted-foreground hover:text-destructive"
        >
          완료된 항목 삭제
        </Button>
      )}
    </div>
  )
}

