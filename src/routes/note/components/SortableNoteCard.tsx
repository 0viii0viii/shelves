import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Note } from "@/services/noteService";

import { NoteCard } from "./NoteCard";

interface SortableNoteCardProps {
  note: Note;
  onUpdate: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  onOpen: (note: Note) => void;
  onLockChange: (id: number, isLocked: boolean, password?: string) => void;
}

export function SortableNoteCard({
  note,
  onUpdate,
  onDelete,
  onOpen,
  onLockChange,
}: SortableNoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <NoteCard
        note={note}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onOpen={onOpen}
        onLockChange={onLockChange}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
