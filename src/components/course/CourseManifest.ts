/**
 * Course manifest type definitions and loader
 *
 * The manifest.json file is generated during the export process
 * and contains the full course structure for navigation
 */

export interface LessonInfo {
  slug: string;
  title: string;
  order: number;
  videoUrl?: string;
  videoDuration?: string;
}

export interface TopicInfo {
  slug: string;
  title: string;
  order: number;
  lessons: LessonInfo[];
}

export interface CourseManifest {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  exportedAt: string;
  topics: TopicInfo[];
}

/**
 * Load course manifest from public directory
 */
export async function loadCourseManifest(courseSlug: string): Promise<CourseManifest | null> {
  try {
    const response = await fetch(`/courses/${courseSlug}/manifest.json`);
    if (!response.ok) {
      console.error(`Failed to load manifest for ${courseSlug}: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading course manifest:`, error);
    return null;
  }
}

/**
 * Find the next and previous lessons in the course
 */
export function findAdjacentLessons(
  manifest: CourseManifest,
  currentTopicSlug: string,
  currentLessonSlug: string
): { prev: { topicSlug: string; lessonSlug: string; title: string } | null; next: { topicSlug: string; lessonSlug: string; title: string } | null } {
  const allLessons: { topicSlug: string; lessonSlug: string; title: string }[] = [];

  for (const topic of manifest.topics) {
    for (const lesson of topic.lessons) {
      allLessons.push({
        topicSlug: topic.slug,
        lessonSlug: lesson.slug,
        title: lesson.title,
      });
    }
  }

  const currentIndex = allLessons.findIndex(
    (l) => l.topicSlug === currentTopicSlug && l.lessonSlug === currentLessonSlug
  );

  return {
    prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
    next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
  };
}
