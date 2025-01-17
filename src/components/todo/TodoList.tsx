import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, deleteTodo, updateTodo } from '@/lib/redux/slices/todoSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { format } from 'date-fns';
import { Pencil, Trash2, X, Check, Search, SortAsc, Filter } from 'lucide-react';
import type { Todo } from '@/types/todo';
import { toast } from 'sonner';

export function TodoList() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading } = useSelector((state: RootState) => state.todos);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Todo>>({});

  // Sorting and filtering state
  const [sortField, setSortField] = useState<'title' | 'dueDate' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await dispatch(updateTodo({ id, todo: { completed } })).unwrap();
      toast.success(completed ? 'Todo marked as complete' : 'Todo marked as incomplete');
    } catch (error) {
      toast.error('Failed to update todo status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteTodo(id)).unwrap();
      toast.success('Todo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete todo');
    }
  };


  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate.split('T')[0],
    });
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditForm({});
  };

  const handleUpdate = (id: string) => {
    try {
      dispatch(updateTodo({ id, todo: editForm }));
      setEditingTodo(null);
      setEditForm({});
      toast.success("Updated todo successfully!");
    } catch (error) {
      toast.error('Failed to update todo.');
    }
    
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = [...todos];
    if (filterStatus !== 'all') {
      filtered = filtered.filter(todo => 
        filterStatus === 'completed' ? todo.completed : !todo.completed
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description?.toLowerCase().includes(query) || false)
      );
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [todos, sortField, sortOrder, filterStatus, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
          data-testid="loading-spinner"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">No todos yet. Add one to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search todos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-auto pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('title')}
              className={sortField === 'title' ? 'bg-accent' : ''}
              aria-label="Sort by title"
            >
              <SortAsc className="w-4 h-4 mr-2" />
              Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('dueDate')}
              className={sortField === 'dueDate' ? 'bg-accent' : ''}
            >
              <SortAsc className="w-4 h-4 mr-2" />
              Due Date {sortField === 'dueDate' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            <Filter className="w-4 h-4 mr-2" />
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredAndSortedTodos.map((todo) => (
          <Card key={todo.id} className="group hover:shadow-md transition-shadow">
            {editingTodo === todo.id ? (
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div>
                    <Input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Todo title"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Todo description"
                      className="w-full min-h-[100px]"
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={editForm.dueDate}
                      onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleUpdate(todo.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </form>
              </CardContent>
            ) : (
              <>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`todo-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={async (checked) => {
                          await handleToggleComplete(todo.id, checked as boolean);
                        }}
                        aria-label={todo.title}
                      />
                      <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                        {todo.title}
                      </span>
                    </div>
                  </CardTitle>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(todo)}
                      aria-label={`Edit ${todo.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(todo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{todo.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Due: {todo.dueDate ? format(new Date(todo.dueDate), 'PPP') : 'No due date'}
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}