import {
  Edit2,
  GripVertical,
  Lock,
  Save,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Note } from "@/services/noteService";

import { LockNoteDialog } from "./LockNoteDialog";

interface NoteCardProps {
  note: Note;
  onUpdate: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  onOpen: (note: Note) => void;
  onLockChange: (id: number, isLocked: boolean, password?: string) => void;
  dragHandleProps?: {
    [key: string]: any;
  };
}

export function NoteCard({
  note,
  onUpdate,
  onDelete,
  onOpen,
  onLockChange,
  dragHandleProps,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== note.title) {
      onUpdate(note.id, editTitle.trim());
    } else {
      setEditTitle(note.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setIsEditing(false);
  };

  const handleLockChange = (isLocked: boolean, password?: string) => {
    onLockChange(note.id, isLocked, password);
    setIsLockDialogOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-2">
        <div className="flex items-center space-x-3">
          {/* 드래그 핸들 */}
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>

          {/* 잠금 아이콘 */}
          {note.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}

          {/* 제목 또는 편집 입력 */}
          {isEditing ? (
            <div className="flex items-center space-x-2 flex-1">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
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
            <>
              <span className="flex-1">{note.title}</span>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onOpen(note)}>
                  메모
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLockDialogOpen(true)}
                >
                  {note.isLocked ? (
                    <Unlock className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(note.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>

      <LockNoteDialog
        isOpen={isLockDialogOpen}
        onClose={() => setIsLockDialogOpen(false)}
        onConfirm={handleLockChange}
        noteTitle={note.title}
        currentIsLocked={!!note.isLocked}
      />
    </Card>
  );
}
