import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Memo } from "@/services/noteService";

interface SortableMemoItemProps {
  memo: Memo;
  onUpdate: (id: number, content: string) => void;
  onDelete: (id: number) => void;
}

export function SortableMemoItem({
  memo,
  onUpdate,
  onDelete,
}: SortableMemoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(memo.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: memo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editContent.trim() && editContent !== memo.content) {
      onUpdate(memo.id, editContent.trim());
    } else {
      setEditContent(memo.content);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(memo.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="p-2 border bg-card group">
      {isEditing ? (
        <div className="flex items-center space-x-2 flex-1">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            autoFocus
          />
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          {/* 드래그 핸들 */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* 메모 내용 */}
          <span className="flex-1">{memo.content}</span>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(memo.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
