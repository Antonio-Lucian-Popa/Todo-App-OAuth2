import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import type { Todo } from '../services/todoService';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoCard({ todo, onToggle, onEdit, onDelete }: TodoCardProps) {
  const priorityConfig = {
    LOW: { 
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: '🟢',
      label: 'Low Priority'
    },
    MEDIUM: { 
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: '🟡',
      label: 'Medium Priority'
    },
    HIGH: { 
      color: 'bg-rose-100 text-rose-700 border-rose-200',
      icon: '🔴',
      label: 'High Priority'
    },
  };

  const getDueDateStatus = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) return { text: 'Due Today', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (isTomorrow(date)) return { text: 'Due Tomorrow', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (isPast(date)) return { text: 'Overdue', color: 'text-red-600', bg: 'bg-red-50' };
    return { text: format(date, 'MMM dd, yyyy'), color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const dueDateStatus = todo.dueDate ? getDueDateStatus(todo.dueDate) : null;
  const priorityInfo = todo.priority ? priorityConfig[todo.priority] : null;

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 border-0 bg-white/80 backdrop-blur-sm ${
      todo.completed 
        ? 'opacity-75 bg-gray-50/80' 
        : 'hover:scale-[1.02] hover:bg-white/90'
    }`}>
      {/* Priority indicator bar */}
      {priorityInfo && !todo.completed && (
        <div className={`absolute top-0 left-0 w-1 h-full ${
          todo.priority === 'HIGH' ? 'bg-rose-400' :
          todo.priority === 'MEDIUM' ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Custom Checkbox */}
          <div className="relative flex-shrink-0 mt-1">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
              className="h-5 w-5 rounded-full border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 transition-all duration-200"
            />
            {todo.completed && (
              <CheckCircle2 className="absolute -top-0.5 -left-0.5 h-6 w-6 text-green-500 animate-in zoom-in duration-200" />
            )}
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-3">
              <h3 className={`font-semibold text-lg leading-tight transition-all duration-200 ${
                todo.completed 
                  ? 'line-through text-gray-500' 
                  : 'text-gray-900 group-hover:text-blue-700'
              }`}>
                {todo.title || '(No title)'}
              </h3>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-all duration-200"
                  title="Edit task"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700 rounded-full transition-all duration-200"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Description */}
            {todo.description && (
              <p className={`text-sm leading-relaxed transition-all duration-200 ${
                todo.completed 
                  ? 'line-through text-gray-400' 
                  : 'text-gray-600'
              }`}>
                {todo.description || ''}
              </p>
            )}
            
            {/* Metadata Row */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Priority Badge */}
                {priorityInfo && (
                  <Badge 
                    variant="secondary" 
                    className={`${priorityInfo.color} border font-medium px-3 py-1 text-xs rounded-full transition-all duration-200 hover:scale-105`}
                  >
                    <span className="mr-1">{priorityInfo.icon}</span>
                    {priorityInfo.label}
                  </Badge>
                )}
                
                {/* Due Date */}
                {todo.dueDate && dueDateStatus && (
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${dueDateStatus.bg} ${dueDateStatus.color}`}>
                    <Calendar className="h-3 w-3" />
                    <span>{dueDateStatus.text}</span>
                  </div>
                )}
              </div>
              
              {/* Created Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Clock className="h-3 w-3" />
                <span>Created {format(new Date(todo.createdAt), 'MMM dd')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Completion Status Overlay */}
        {todo.completed && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-emerald-50/50 pointer-events-none" />
        )}
      </CardContent>
    </Card>
  );
}