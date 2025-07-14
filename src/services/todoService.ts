import { todoApi } from './api';

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

interface TodoResponse {
  message: string;
  todo: Todo;
}

interface TodosResponse {
  todos: Todo[];
}

export const todoService = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await todoApi.get<TodosResponse>('/api/todos');
    return response.data.todos || response.data;
  },

  createTodo: async (todo: CreateTodoRequest): Promise<Todo> => {
    const response = await todoApi.post<TodoResponse>('/api/todos', todo);
    return response.data.todo || response.data;
  },

  updateTodo: async (id: number, todo: UpdateTodoRequest): Promise<Todo> => {
    const response = await todoApi.put<TodoResponse>(`/api/todos/${id}`, todo);
    return response.data.todo || response.data;
  },

  deleteTodo: async (id: number): Promise<void> => {
    await todoApi.delete(`/api/todos/${id}`);
  },

  toggleTodo: async (id: number, completed: boolean): Promise<Todo> => {
    const response = await todoApi.put<TodoResponse>(`/api/todos/${id}`, { completed });
    return response.data.todo || response.data;
  },
};