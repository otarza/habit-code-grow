import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, BookOpen, PlayCircle, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CourseManifest, TopicInfo } from './CourseManifest';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import bitcampLogo from '@/assets/bitcamp-logo.png';

interface CourseSidebarProps {
  manifest: CourseManifest;
  className?: string;
}

function TopicSection({ topic, courseSlug, currentTopicSlug, currentLessonSlug }: {
  topic: TopicInfo;
  courseSlug: string;
  currentTopicSlug?: string;
  currentLessonSlug?: string;
}) {
  const isCurrentTopic = topic.slug === currentTopicSlug;
  const [isExpanded, setIsExpanded] = useState(isCurrentTopic);

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isCurrentTopic && "bg-accent/50"
        )}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
        )}
        <span className="text-left truncate">{topic.title}</span>
      </button>

      {isExpanded && (
        <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
          {topic.lessons.map((lesson) => {
            const isCurrentLesson = isCurrentTopic && lesson.slug === currentLessonSlug;

            return (
              <li key={lesson.slug}>
                <Link
                  to={`/courses/${courseSlug}/${topic.slug}/${lesson.slug}`}
                  className={cn(
                    "flex items-center px-3 py-1.5 text-sm rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isCurrentLesson
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {lesson.videoUrl ? (
                    <PlayCircle className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate">{lesson.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function CourseSidebar({ manifest, className }: CourseSidebarProps) {
  const { topicSlug, lessonSlug } = useParams<{ topicSlug: string; lessonSlug: string }>();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-5 border-b flex justify-center">
        <Link to="/">
          <img src={bitcampLogo} alt="BitCamp" className="h-10" />
        </Link>
      </div>

      {/* Course title */}
      <div className="p-4 border-b">
        <Link to={`/courses/${manifest.slug}`} className="block">
          <h2 className="font-semibold text-lg leading-tight hover:text-primary transition-colors">
            {manifest.title}
          </h2>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          {manifest.topics.length} თავი, {manifest.topics.reduce((acc, t) => acc + t.lessons.length, 0)} გაკვეთილი
        </p>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <nav className="p-4">
          {manifest.topics.map((topic) => (
            <TopicSection
              key={topic.slug}
              topic={topic}
              courseSlug={manifest.slug}
              currentTopicSlug={topicSlug}
              currentLessonSlug={lessonSlug}
            />
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-background border-r flex flex-col",
          "transform transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {sidebarContent}
      </aside>

      {/* Spacer for fixed sidebar on desktop */}
      <div className="hidden lg:block lg:w-72 lg:flex-shrink-0" />
    </>
  );
}
