import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, PlayCircle } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';
import { CourseManifest, findAdjacentLessons } from './CourseManifest';
import { parseFrontmatter, LessonMeta } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LessonViewProps {
  courseSlug: string;
  topicSlug: string;
  lessonSlug: string;
  manifest: CourseManifest;
}

export function LessonView({ courseSlug, topicSlug, lessonSlug, manifest }: LessonViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonMeta, setLessonMeta] = useState<LessonMeta | null>(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/courses/${courseSlug}/${topicSlug}/${lessonSlug}.md`);

        if (!response.ok) {
          throw new Error('გაკვეთილი ვერ მოიძებნა');
        }

        const text = await response.text();
        const { frontmatter, content: mdContent } = parseFrontmatter<LessonMeta>(text);

        setLessonMeta({
          title: frontmatter.title || 'გაკვეთილი',
          order: Number(frontmatter.order) || 0,
          videoUrl: frontmatter.videoUrl,
          videoDuration: frontmatter.videoDuration,
        });
        setContent(mdContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'შეცდომა გაკვეთილის ჩატვირთვისას');
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [courseSlug, topicSlug, lessonSlug]);

  const { prev, next } = findAdjacentLessons(manifest, topicSlug, lessonSlug);

  // Find current topic title
  const currentTopic = manifest.topics.find(t => t.slug === topicSlug);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">იტვირთება...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button asChild variant="outline">
          <Link to={`/courses/${courseSlug}`}>დაბრუნება კურსზე</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link to={`/courses/${courseSlug}`} className="hover:text-foreground transition-colors">
              {manifest.title}
            </Link>
          </li>
          <li>/</li>
          <li>{currentTopic?.title}</li>
        </ol>
      </nav>

      {/* Lesson header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{lessonMeta?.title}</h1>

        {lessonMeta?.videoDuration && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {lessonMeta.videoDuration}
            </span>
            {lessonMeta.videoUrl && (
              <span className="flex items-center gap-1">
                <PlayCircle className="h-4 w-4" />
                ვიდეო გაკვეთილი
              </span>
            )}
          </div>
        )}
      </header>

      {/* Video embed if available */}
      {lessonMeta?.videoUrl && (
        <div className="aspect-video mb-8 rounded-lg overflow-hidden bg-slate-900">
          <VideoEmbed url={lessonMeta.videoUrl} />
        </div>
      )}

      {/* Lesson content */}
      <MarkdownContent content={content} />

      {/* Navigation */}
      <nav className="flex items-center justify-between mt-12 pt-8 border-t">
        {prev ? (
          <Link
            to={`/courses/${courseSlug}/${prev.topicSlug}/${prev.lessonSlug}`}
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">წინა:</span>
            <span className="truncate max-w-[200px]">{prev.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            to={`/courses/${courseSlug}/${next.topicSlug}/${next.lessonSlug}`}
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              "text-muted-foreground hover:text-foreground transition-colors"
            )}
          >
            <span className="truncate max-w-[200px]">{next.title}</span>
            <span className="hidden sm:inline">:შემდეგი</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}

function VideoEmbed({ url }: { url: string }) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (ytMatch) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Self-hosted video
  return <video src={url} controls className="w-full h-full" />;
}
