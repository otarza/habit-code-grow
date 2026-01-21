/**
 * Markdown utilities for loading and parsing course content
 */

export interface CourseMeta {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  exportedAt: string;
}

export interface LessonMeta {
  title: string;
  order: number;
  videoUrl?: string;
  videoDuration?: string;
}

export interface TopicMeta {
  title: string;
  order: number;
}

export interface CourseStructure {
  meta: CourseMeta;
  topics: {
    slug: string;
    meta: TopicMeta;
    lessons: {
      slug: string;
      meta: LessonMeta;
    }[];
  }[];
}

/**
 * Parse frontmatter from markdown content
 */
export function parseFrontmatter<T = Record<string, string>>(
  content: string
): { frontmatter: T; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {} as T, content };
  }

  const frontmatterStr = match[1];
  const frontmatter: Record<string, string> = {};

  frontmatterStr.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      frontmatter[key] = value;
    }
  });

  return {
    frontmatter: frontmatter as T,
    content: content.slice(match[0].length),
  };
}

/**
 * Load course structure from public directory
 */
export async function loadCourseStructure(courseSlug: string): Promise<CourseStructure | null> {
  try {
    // Load course metadata
    const metaResponse = await fetch(`/courses/${courseSlug}/course.json`);
    if (!metaResponse.ok) return null;
    const meta = await metaResponse.json();

    // Load course index to get structure
    const indexResponse = await fetch(`/courses/${courseSlug}/index.md`);
    if (!indexResponse.ok) return null;

    // For now, return basic structure - you'll need to build this from the filesystem
    // In a real setup, you'd generate a manifest.json during the export
    return {
      meta,
      topics: [], // Will be populated from manifest
    };
  } catch {
    return null;
  }
}

/**
 * Load markdown content for a lesson
 */
export async function loadLesson(
  courseSlug: string,
  topicSlug: string,
  lessonSlug: string
): Promise<{ meta: LessonMeta; content: string } | null> {
  try {
    const response = await fetch(`/courses/${courseSlug}/${topicSlug}/${lessonSlug}.md`);
    if (!response.ok) return null;

    const text = await response.text();
    const { frontmatter, content } = parseFrontmatter<LessonMeta>(text);

    return {
      meta: {
        title: frontmatter.title || 'Untitled',
        order: Number(frontmatter.order) || 0,
        videoUrl: frontmatter.videoUrl,
        videoDuration: frontmatter.videoDuration,
      },
      content,
    };
  } catch {
    return null;
  }
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Extract Vimeo video ID from URL
 */
export function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}
