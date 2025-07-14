import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Todo } from '../services/todoService';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <Card className={`transition-all duration-200 ${todo.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.title}
              </h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {todo.description && (
              <p className={`text-sm text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                {todo.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {todo.priority && (
                  <Badge className={priorityColors[todo.priority]}>
                    {todo.priority}
                  </Badge>
                )}
                {todo.dueDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(todo.dueDate), 'MMM dd, yyyy')}
                  </div>
                )}
              </div>
              
              <span className="text-xs text-gray-400">
                {format(new Date(todo.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}