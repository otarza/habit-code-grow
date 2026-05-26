import fs from 'node:fs';
import path from 'node:path';

export interface LessonInfo {
  slug: string;
  title: string;
  order?: number;
  videoUrl?: string;
  videoDuration?: string;
  isPreview?: boolean;
}

export interface TopicInfo {
  slug: string;
  title: string;
  order?: number;
  lessons: LessonInfo[];
}

export interface CourseManifest {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  exportedAt?: string;
  topics: TopicInfo[];
}

export type Collection = 'learn' | 'courses';

const ROOT = process.cwd();

function manifestPath(collection: Collection, courseSlug: string): string {
  return path.join(ROOT, 'src/content', collection, courseSlug, 'manifest.json');
}

/** Load a course manifest at build time. Returns null if missing/invalid. */
export function loadManifest(collection: Collection, courseSlug: string): CourseManifest | null {
  const p = manifestPath(collection, courseSlug);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8')) as CourseManifest;
  } catch (err) {
    console.error(`[course-manifest] Failed to parse ${p}:`, err);
    return null;
  }
}

/** Flatten manifest topics + lessons into a single ordered list. */
export function flattenLessons(m: CourseManifest): Array<{
  topicSlug: string;
  lessonSlug: string;
  title: string;
}> {
  const out: Array<{ topicSlug: string; lessonSlug: string; title: string }> = [];
  for (const topic of m.topics) {
    for (const lesson of topic.lessons) {
      out.push({ topicSlug: topic.slug, lessonSlug: lesson.slug, title: lesson.title });
    }
  }
  return out;
}

/** Find prev/next lessons relative to a given lesson position. */
export function findAdjacent(m: CourseManifest, topicSlug: string, lessonSlug: string) {
  const all = flattenLessons(m);
  const i = all.findIndex((l) => l.topicSlug === topicSlug && l.lessonSlug === lessonSlug);
  return {
    prev: i > 0 ? all[i - 1] : null,
    next: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
  };
}

/** List every course manifest under a collection at build time. */
export function listCourses(collection: Collection): CourseManifest[] {
  const dir = path.join(ROOT, 'src/content', collection);
  if (!fs.existsSync(dir)) return [];
  const slugs = fs.readdirSync(dir).filter((s) => {
    try {
      return fs.statSync(path.join(dir, s)).isDirectory();
    } catch {
      return false;
    }
  });
  return slugs
    .map((slug) => loadManifest(collection, slug))
    .filter((m): m is CourseManifest => m !== null);
}
