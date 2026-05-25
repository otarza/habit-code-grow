import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COURSE_COMMENTS_API_URL =
  import.meta.env.VITE_COURSE_COMMENTS_API_URL ||
  'https://us-central1-bitcamp-flitt.cloudfunctions.net/course-comments-api';

type LessonComment = {
  id: string;
  text: string;
  authorEmailMasked: string;
  createdAt?: string;
};

interface LessonCommentsProps {
  courseSlug: string;
  topicSlug: string;
  lessonSlug: string;
  lessonTitle?: string;
  courseTitle?: string;
  viewerEmail?: string;
}

export function LessonComments({
  courseSlug,
  topicSlug,
  lessonSlug,
  lessonTitle,
  courseTitle,
  viewerEmail,
}: LessonCommentsProps) {
  const [approvedComments, setApprovedComments] = useState<LessonComment[]>([]);
  const [ownComments, setOwnComments] = useState<LessonComment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          courseSlug,
          topicSlug,
          lessonSlug,
        });
        if (viewerEmail) {
          params.set('authorEmail', viewerEmail);
        }

        const response = await fetch(`${COURSE_COMMENTS_API_URL}?${params.toString()}`);
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.error || 'comments_load_failed');
        }

        if (!cancelled) {
          setApprovedComments(Array.isArray(data.approvedComments) ? data.approvedComments : []);
          setOwnComments(Array.isArray(data.ownComments) ? data.ownComments : []);
        }
      } catch {
        if (!cancelled) {
          setError('კომენტარები დროებით ვერ ჩაიტვირთა.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadComments();

    return () => {
      cancelled = true;
    };
  }, [courseSlug, topicSlug, lessonSlug, viewerEmail]);

  const comments = useMemo(() => {
    const byId = new Map<string, LessonComment>();
    approvedComments.forEach((comment) => byId.set(comment.id, comment));
    ownComments.forEach((comment) => byId.set(comment.id, comment));

    return [...byId.values()].sort((a, b) => {
      const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
      const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
      return aTime - bTime;
    });
  }, [approvedComments, ownComments]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = text.trim();

    if (!viewerEmail) {
      setError('კომენტარის დასამატებლად კურსში Magic Link-ით უნდა იყო შესული.');
      return;
    }

    if (trimmed.length < 2) {
      setError('კომენტარი ძალიან მოკლეა.');
      return;
    }

    if (trimmed.length > 2000) {
      setError('კომენტარი მაქსიმუმ 2000 სიმბოლო უნდა იყოს.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(COURSE_COMMENTS_API_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          courseSlug,
          topicSlug,
          lessonSlug,
          lessonTitle,
          courseTitle,
          authorEmail: viewerEmail,
          text: trimmed,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok || !data.comment) {
        throw new Error(data.error || 'comment_submit_failed');
      }

      setOwnComments((current) => [...current, data.comment]);
      setText('');
      setSuccess('კომენტარი დაემატა.');
    } catch {
      setError('კომენტარი ვერ დაემატა. სცადე ცოტა ხანში.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t pt-8" aria-labelledby="lesson-comments-title">
      <div className="mb-5 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="lesson-comments-title" className="text-xl font-semibold">
          კომენტარები
        </h2>
      </div>

      {loading ? (
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          კომენტარები იტვირთება...
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{comment.authorEmailMasked || 'სტუდენტი'}</span>
                {comment.createdAt ? <span>{formatDate(comment.createdAt)}</span> : null}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/85">{comment.text}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          ამ გაკვეთილზე კომენტარი ჯერ არ არის.
        </div>
      )}

      {viewerEmail ? (
        <form onSubmit={submitComment} className="mt-5 space-y-3">
          <label htmlFor="lesson-comment-text" className="sr-only">
            კომენტარი
          </label>
          <textarea
            id="lesson-comment-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              if (error) setError('');
              if (success) setSuccess('');
            }}
            rows={4}
            maxLength={2000}
            placeholder="დაწერე კითხვა, იდეა ან გამოცდილება ამ გაკვეთილთან დაკავშირებით..."
            className="min-h-28 w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">{text.length}/2000</p>
            <Button type="submit" disabled={submitting || text.trim().length < 2}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  იგზავნება...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  კომენტარის დამატება
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          კომენტარის დასამატებლად კურსში Magic Link-ით შედი.
        </p>
      )}

      {success ? <p className="mt-3 text-sm text-emerald-400">{success}</p> : null}
      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ka-GE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
