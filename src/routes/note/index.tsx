import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Note } from "@/services/noteService";

import { MemoModal } from "./components/MemoModal";
import { NoteList } from "./components/NoteList";

export const Route = createFileRoute("/note/")({
  component: NotePage,
});

function NotePage() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);

  const handleOpenNote = (note: Note) => {
    setSelectedNote({
      id: note.id,
      title: note.title,
      isLocked: note.isLocked,
      password: note.password,
      sortOrder: note.sortOrder,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
    setIsMemoModalOpen(true);
  };

  const handleCloseMemoModal = () => {
    setIsMemoModalOpen(false);
    setSelectedNote(null);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex h-full flex-col space-y-6 p-6">
        <div>
          <h1>노트</h1>
        </div>

        <NoteList onOpenNote={handleOpenNote} />

        <MemoModal
          note={selectedNote}
          isOpen={isMemoModalOpen}
          onClose={handleCloseMemoModal}
        />
      </div>
    </div>
  );
}
