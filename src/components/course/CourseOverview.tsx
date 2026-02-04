import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';
import { CourseManifest } from './CourseManifest';
import { MarkdownContent } from './MarkdownContent';
import { parseFrontmatter } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CourseOverviewProps {
  manifest: CourseManifest;
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
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\\d+)/);
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

export function CourseOverview({ manifest }: CourseOverviewProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const response = await fetch(`/courses/${manifest.slug}/index.md`);
        if (response.ok) {
          const text = await response.text();
          const { content } = parseFrontmatter(text);
          setDescription(content);
        }
      } catch {
        // Ignore errors, description is optional
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, [manifest.slug]);

  const totalLessons = manifest.topics.reduce((acc, t) => acc + t.lessons.length, 0);
  const totalVideos = manifest.topics.reduce(
    (acc, t) => acc + t.lessons.filter((l) => l.videoUrl).length,
    0
  );

  // Get the first lesson for the "Start Course" button and video intro
  const firstLesson = manifest.topics[0]?.lessons[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Course header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{manifest.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {manifest.topics.length} თავი
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalLessons} გაკვეთილი
          </span>
          {totalVideos > 0 && (
            <span className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              {totalVideos} ვიდეო
            </span>
          )}
        </div>

        {firstLesson && (
          <Button asChild size="lg">
            <Link to={`/courses/${manifest.slug}/${manifest.topics[0].slug}/${firstLesson.slug}`}>
              დაიწყე სწავლა
            </Link>
          </Button>
        )}
      </header>

      {/* Course description */}
      {!loading && description && (
        <section className="mb-12">
          <MarkdownContent content={description} />
        </section>
      )}

      {/* Video Intro */}
      {firstLesson?.videoUrl && (
        <section className="mb-12">
          <h3 className="text-xl font-semibold mb-4">{firstLesson.title}</h3>
          <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
            <VideoEmbed url={firstLesson.videoUrl} />
          </div>
        </section>
      )}

      {/* Course curriculum */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">კურსის შინაარსი</h2>

        <div className="space-y-4">
          {manifest.topics.map((topic, topicIndex) => {
            // Filter out the first lesson from the first topic (it's displayed as video intro)
            const displayLessons = topicIndex === 0 ? topic.lessons.slice(1) : topic.lessons;

            return (
              <Card key={topic.slug}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-sm">
                      {String(topicIndex + 1).padStart(2, '0')}
                    </span>
                    {topic.title}
                  </CardTitle>
                  <CardDescription>
                    {displayLessons.length} გაკვეთილი
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {displayLessons.map((lesson, lessonIndex) => (
                      <li key={lesson.slug}>
                        <Link
                          to={`/courses/${manifest.slug}/${topic.slug}/${lesson.slug}`}
                          className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <span className="text-xs text-muted-foreground font-mono w-8">
                            {topicIndex + 1}.{lessonIndex + 1}
                          </span>
                          {lesson.videoUrl ? (
                            <PlayCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className="flex-1">{lesson.title}</span>
                          {lesson.videoDuration && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.videoDuration}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
