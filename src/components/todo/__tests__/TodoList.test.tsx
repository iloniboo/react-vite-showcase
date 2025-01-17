import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect, vi } from 'vitest';
import { TodoList } from '../TodoList';
import todoReducer from '@/lib/redux/slices/todoSlice';

// Mock the toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      todos: todoReducer
    },
    preloadedState: {
      todos: {
        todos: [],
        loading: false,
        error: null,
        ...initialState
      }
    }
  });
};

describe('TodoList', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      dueDate: '2024-03-25',
      userId: 'user1',
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z'
    }
  ];

  test('renders loading state', () => {
    const store = createMockStore({ loading: true });
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('renders empty state message when no todos', async () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/No todos yet/i)).toBeInTheDocument();
    });
  });

  test('handles todo completion toggle', async () => {
  
    const store = createMockStore({ 
      todos: mockTodos,
      loading: false 
    });
  
    // Mock the dispatch function to directly return the expected action
    const mockDispatch = vi.fn().mockResolvedValue({
      type: 'todos/updateTodo',
      payload: {
        id: '1',
        todo: { completed: true }
      }
    });
    store.dispatch = mockDispatch;
  
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
  
    const checkbox = screen.getByRole('checkbox', { name: /Test Todo/i });
    await fireEvent.click(checkbox);
  
    // Verify the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.any(Function)
    );

    // Verify it was called only once
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  test('handles search functionality', async () => {
    const store = createMockStore({ 
      todos: [
        ...mockTodos,
        { 
          ...mockTodos[0], 
          id: '2', 
          title: 'Another Todo',
          description: 'Another Description'
        }
      ] 
    });
    
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search todos/i);
      expect(searchInput).toBeInTheDocument();
      fireEvent.change(searchInput, { target: { value: 'Test' } });
    });

    // Wait for the filtered results
    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.queryByText('Another Todo')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('handles sorting', async () => {
    const store = createMockStore({
      todos: [
        { ...mockTodos[0] },
        { ...mockTodos[0], id: '2', title: 'A Todo' }
      ]
    });
    
    render(
      <Provider store={store}>
        <TodoList />
      </Provider>
    );
    
    await waitFor(() => {
      const sortButton = screen.getByRole('button', { name: /sort by title/i });
      expect(sortButton).toBeInTheDocument();
      fireEvent.click(sortButton);
      const todos = screen.getAllByRole('heading');
      expect(todos[0]).toHaveTextContent('A Todo');
    });
  });

});