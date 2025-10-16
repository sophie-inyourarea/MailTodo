import { TodoItem } from '@/types';

interface TodoListProps {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-gray-500">暂无待办事项</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`
            flex items-start space-x-3 p-3 rounded-lg border transition-colors
            ${todo.completed 
              ? 'bg-gray-50 border-gray-200' 
              : 'bg-white border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <button
            onClick={() => onToggle(todo.id)}
            className={`
              flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              ${todo.completed
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 hover:border-blue-500'
              }
            `}
          >
            {todo.completed && (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className={`
              text-sm leading-5
              ${todo.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
              }
            `}>
              {todo.text}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(todo.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
          
          <button
            onClick={() => onDelete(todo.id)}
            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            title="删除"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}


