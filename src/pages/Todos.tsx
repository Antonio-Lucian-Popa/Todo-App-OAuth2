import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Filter, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { TodoCard } from '../components/TodoCard';
import { todoService, type Todo } from '../services/todoService';
import { useToast } from '@/hooks/use-toast';

export function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    completed: false,
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, searchTerm, filterStatus, filterPriority]);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTodos = () => {
    let filtered = todos;

    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(todo =>
        filterStatus === 'completed' ? todo.completed : !todo.completed
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filterPriority);
    }

    setFilteredTodos(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTodo) {
        await todoService.updateTodo(editingTodo.id, {
          ...formData,
          priority: formData.priority as "MEDIUM" | "LOW" | "HIGH",
        });
        toast({
          title: "Success",
          description: "Todo updated successfully",
        });
      } else {
        await todoService.createTodo({
          ...formData,
          priority: formData.priority as "LOW" | "MEDIUM" | "HIGH",
        });
        toast({
          title: "Success",
          description: "Todo created successfully",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTodos();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to save todo',
        variant: "destructive",
      });
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title ?? '',
      description: todo.description ?? '',
      priority: todo.priority ?? 'MEDIUM',
      dueDate: todo.dueDate ?? '',
      completed: todo.completed ?? false,
    });

    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    try {
      await todoService.deleteTodo(id);
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
      fetchTodos();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to delete todo',
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    try {
      await todoService.toggleTodo(id, completed);
      fetchTodos();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to update todo',
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      completed: false,
    });
    setEditingTodo(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const highPriorityCount = todos.filter(todo => todo.priority === 'HIGH' && !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My <span className="text-blue-600">Tasks</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay organized and boost your productivity with our beautiful task management system
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{todos.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative group">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search your todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36 border-gray-200 focus:border-blue-400 rounded-lg">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-36 border-gray-200 focus:border-blue-400 rounded-lg">
                    <AlertCircle className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Todo Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Task
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {editingTodo ? 'Edit Task' : 'Create New Task'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingTodo ? 'Update your task details below' : 'Add a new task to your todo list'}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Task Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                      placeholder="Enter task title..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg resize-none"
                      placeholder="Add task description..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-400 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">🟢 Low</SelectItem>
                          <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                          <SelectItem value="HIGH">🔴 High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="text-sm font-semibold text-gray-700">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                      className="px-6 py-2 border-gray-200 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {editingTodo ? 'Update Task' : 'Create Task'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 bg-red-50 border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Todo Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm font-medium rounded-md transition-all"
                >
                  All ({todos.length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm font-medium rounded-md transition-all"
                >
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm font-medium rounded-md transition-all"
                >
                  Completed ({completedCount})
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="all" className="space-y-4 mt-0">
                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your tasks...</p>
                  </div>
                ) : filteredTodos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                        ? 'No matching tasks found'
                        : 'No tasks yet'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Create your first task to get started!'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredTodos.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggle}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4 mt-0">
                <div className="grid gap-4">
                  {filteredTodos.filter(todo => !todo.completed).map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-0">
                <div className="grid gap-4">
                  {filteredTodos.filter(todo => todo.completed).map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}