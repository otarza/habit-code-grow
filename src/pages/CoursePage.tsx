import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { CourseOverview } from '@/components/course/CourseOverview';
import { LessonView } from '@/components/course/LessonView';
import { CourseManifest, loadCourseManifest } from '@/components/course/CourseManifest';
import { Button } from '@/components/ui/button';

export default function CoursePage() {
  const { courseSlug, topicSlug, lessonSlug } = useParams<{
    courseSlug: string;
    topicSlug?: string;
    lessonSlug?: string;
  }>();

  const [manifest, setManifest] = useState<CourseManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      if (!courseSlug) {
        setError('კურსი არ არის მითითებული');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const loadedManifest = await loadCourseManifest(courseSlug);

      if (!loadedManifest) {
        setError('კურსი ვერ მოიძებნა');
      } else {
        setManifest(loadedManifest);
      }

      setLoading(false);
    }

    loadCourse();
  }, [courseSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">კურსი იტვირთება...</div>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">კურსი ვერ მოიძებნა</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            მთავარ გვერდზე დაბრუნება
          </Link>
        </Button>
      </div>
    );
  }

  const isViewingLesson = topicSlug && lessonSlug;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <CourseSidebar manifest={manifest} />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-6 lg:p-12">
          {/* Back to home link */}
          <div className="mb-6 lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              მთავარ გვერდზე
            </Link>
          </div>

          {isViewingLesson ? (
            <LessonView
              courseSlug={courseSlug!}
              topicSlug={topicSlug}
              lessonSlug={lessonSlug}
              manifest={manifest}
            />
          ) : (
            <CourseOverview manifest={manifest} />
          )}
        </div>
      </main>
    </div>
  );
}
