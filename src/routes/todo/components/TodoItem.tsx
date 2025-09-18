import { Edit2, Save, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { Todo } from "@/services/todoService";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  editValue: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEdit: (id: number, content: string) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  className?: string;
}

export const TodoItem = ({
  todo,
  isEditing,
  editValue,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditValueChange,
  className = "",
}: TodoItemProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSaveEdit(todo.id);
    } else if (e.key === "Escape") {
      onCancelEdit();
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-2">
        <div className="flex items-center space-x-3">
          <Checkbox
            className="cursor-pointer"
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo.id)}
          />
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={editValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSaveEdit(todo.id)}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span className="flex-1">{todo.content}</span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onStartEdit(todo.id, todo.content)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
