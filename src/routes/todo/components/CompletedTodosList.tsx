import { ChevronsUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Todo } from "@/services/todoService";

interface CompletedTodosListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const CompletedTodosList = ({
  todos,
  onToggle,
  onDelete,
}: CompletedTodosListProps) => {
  const [isOpen, setIsOpen] = useState(true);

  if (todos.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between gap-4 px-4 py-2 border mb-2 cursor-pointer hover:bg-muted/50 transition-colors">
          <h4 className="text-sm font-semibold text-muted-foreground">
            완료 ({todos.length}개)
          </h4>
          <ChevronsUpDown className="h-4 w-4" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        {todos.map((todo) => (
          <Card key={todo.id} className="opacity-75">
            <CardContent className="p-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  className="cursor-pointer"
                  checked={!!todo.completed}
                  onCheckedChange={() => onToggle(todo.id)}
                />
                <span className="text-muted-foreground line-through flex-1 truncate">
                  {todo.content}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onDelete(todo.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
