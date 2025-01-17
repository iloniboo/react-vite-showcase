import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Todo, TodoFormData } from '@/types/todo';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { getState }) => {
  const { auth } = getState() as { auth: { token: string } };
  const response = await fetch(`${API_URL}/api/v1/todo`, {
    method:"GET",
    headers: {
      Authorization: `${auth.token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  
  return response.json();
});

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo: TodoFormData, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await fetch(`${API_URL}/api/v1/todo/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${auth.token}`,
      },
      body: JSON.stringify(todo),
    });
    
    if (!response.ok) {
      toast.error('Failed to add todo');
      throw new Error('Failed to add todo');
    }
    
    return response.json();
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todo }: { id: string; todo: any }, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await fetch(`${API_URL}/api/v1/todo/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${auth.token}`,
      },
      body: JSON.stringify(todo),
    });
    
    if (!response.ok) {
      toast.error('Failed to update todo');
      throw new Error('Failed to update todo');
    }
    
    return response.json();
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { getState }) => {
    const { auth } = getState() as { auth: { token: string } };
    const response = await fetch(`${API_URL}/api/v1/todo/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `${auth.token}`,
      },
    });
    
    if (!response.ok) {
      toast.error('Failed to update todo');
      throw new Error('Failed to delete todo');
    }
    
    return id;
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;