import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { CourseOverview } from '@/components/course/CourseOverview';
import { LessonView } from '@/components/course/LessonView';
import { CourseManifest, loadCourseManifest } from '@/components/course/CourseManifest';
import { Button } from '@/components/ui/button';

interface CoursePageProps {
  manifest: CourseManifest | null;
  courseSlug: string;
  topicSlug: string | null;
  lessonSlug: string | null;
}

export default function CoursePage({ manifest, courseSlug, topicSlug, lessonSlug }: CoursePageProps) {
  // We no longer need useParams since we get slugs as props from Astro
  // We also don't need useEffect to fetch the manifest since Astro passes it


  if (!manifest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">კურსი ვერ მოიძებნა</h1>
        <p className="text-muted-foreground mb-6">კურსი არ არის მითითებული ან ვერ მოიძებნა</p>
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
        <div className="p-6 pt-20 lg:p-12">
          {/* Back to home link - hidden on mobile to avoid conflict with menu button */}
          <div className="mb-6 hidden lg:block">
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
