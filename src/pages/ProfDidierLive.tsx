import { useNavigate } from "react-router-dom";
import ProfessorLiveOverlay, { type OverlayLesson } from "@/features/profDidierLive/ProfessorLiveOverlay";
import { SCRUM_CLASS } from "@/features/profDidierLive/scrumClass";

// Standalone route (/portal/prof-didier-live) — "open office hours" with the
// static Scrum Foundations class. The embedded, lesson-scoped version lives in
// ChapterView using the same overlay with real Supabase lesson data.
export default function ProfDidierLive() {
  const navigate = useNavigate();
  const lessons: OverlayLesson[] = SCRUM_CLASS.lessons.map((l) => ({
    id: l.id,
    title: l.title,
    focus: l.focus,
    board: l.board,
    suggestions: l.suggestions,
  }));

  return (
    <ProfessorLiveOverlay
      programTitle={SCRUM_CLASS.program}
      moduleTitle={SCRUM_CLASS.module}
      lessons={lessons}
      initialLessonId={lessons[0]?.id}
      onClose={() => navigate("/portal/mentor")}
    />
  );
}
