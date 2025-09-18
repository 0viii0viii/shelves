import { toast } from "sonner";

import { TODO_MESSAGES, TODO_TOAST_DURATION } from "@/routes/todo/constants";
import type { Todo } from "@/services/todoService";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: TODO_TOAST_DURATION.SUCCESS,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: TODO_TOAST_DURATION.ERROR,
  });
};

export const validateTodoInput = (value: string): boolean => {
  if (!value.trim()) {
    showErrorToast(TODO_MESSAGES.EMPTY_INPUT);
    return false;
  }
  return true;
};

export const getIncompleteTodos = (todos: Todo[]): Todo[] => {
  return todos.filter((todo) => !todo.completed);
};

export const getCompletedTodos = (todos: Todo[]): Todo[] => {
  return todos.filter((todo) => todo.completed);
};

export const hasCompletedTodos = (todos: Todo[]): boolean => {
  return getCompletedTodos(todos).length > 0;
};
