import { useEffect, useState } from 'react';
import { LessonComments } from '@/components/course/LessonComments';

/**
 * Thin React wrapper around LessonComments that resolves the viewer's email
 * from localStorage on mount. Hosted as an Astro island (`client:visible`)
 * so it only hydrates when the comments section scrolls into view.
 *
 * The localStorage key matches the AccessGate's storage key per course
 * (`bitcamp_soft_access_{courseSlug}_email`). Until Phase 6 hardens the
 * AccessGate, comments only post for users who *already* have a stored
 * email — anonymous visitors see the read-only thread + a "log in to
 * comment" message rendered by LessonComments itself.
 */
interface Props {
  courseSlug: string;
  topicSlug: string;
  lessonSlug: string;
  lessonTitle?: string;
  courseTitle?: string;
}

export function LessonCommentsBoundary({
  courseSlug,
  topicSlug,
  lessonSlug,
  lessonTitle,
  courseTitle,
}: Props) {
  const [viewerEmail, setViewerEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(
        `bitcamp_soft_access_${courseSlug}_email`,
      );
      if (stored) setViewerEmail(stored);
    } catch {
      // localStorage may throw in private browsing — treat as no access
    }
  }, [courseSlug]);

  return (
    <LessonComments
      courseSlug={courseSlug}
      topicSlug={topicSlug}
      lessonSlug={lessonSlug}
      lessonTitle={lessonTitle}
      courseTitle={courseTitle}
      viewerEmail={viewerEmail}
    />
  );
}
