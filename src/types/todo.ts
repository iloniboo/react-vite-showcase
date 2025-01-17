export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TodoFormData {
  title: string;
  description: string;
  dueDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}