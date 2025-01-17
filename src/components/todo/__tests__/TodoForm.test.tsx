import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { expect, vi } from 'vitest';
import { TodoForm } from '../TodoForm';
import todoReducer from '@/lib/redux/slices/todoSlice';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      todos: todoReducer
    }
  });
};

describe('TodoForm', () => {
  test('renders form fields correctly', () => {
    render(
      <Provider store={createMockStore()}>
        <TodoForm />
      </Provider>
    );
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    const store = createMockStore();
    const mockDispatch = vi.fn().mockResolvedValue({
      type: 'todos/addTodo/fulfilled'
    });
    store.dispatch = mockDispatch;

    render(
      <Provider store={store}>
        <TodoForm />
      </Provider>
    );
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const dueDateInput = screen.getByLabelText(/due date/i);

    fireEvent.change(titleInput, {
      target: { value: 'New Todo' }
    });
    fireEvent.change(descriptionInput, {
      target: { value: 'New Description' }
    });
    fireEvent.change(dueDateInput, {
      target: { value: '2024-03-25' }
    });
    
    fireEvent.submit(screen.getByRole('button', { name: /add todo/i }));
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(titleInput).toHaveValue('New Todo');
      expect(descriptionInput).toHaveValue('New Description'); 
      expect(dueDateInput).toHaveValue('2024-03-25');
    });
  });

  test('validates required fields', async () => {
    render(
      <Provider store={createMockStore()}>
        <TodoForm />
      </Provider>
    );
    
    fireEvent.submit(screen.getByRole('button', { name: /add todo/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/title/i)).toBeInvalid();
      expect(screen.getByLabelText(/description/i)).toBeInvalid();
      expect(screen.getByLabelText(/due date/i)).toBeInvalid();
    });
  });
}); 