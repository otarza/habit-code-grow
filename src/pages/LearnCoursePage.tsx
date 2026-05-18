import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, LockKeyhole, LogOut, MailCheck, ShieldCheck } from 'lucide-react';
import { CourseSidebar } from '@/components/course/CourseSidebar';
import { CourseOverview } from '@/components/course/CourseOverview';
import { LessonView } from '@/components/course/LessonView';
import { CourseManifest, loadCourseManifest } from '@/components/course/CourseManifest';
import { Button } from '@/components/ui/button';

const LEARN_CONTENT_BASE_URL = '/learn-content';

const courseAccess = {
  'ai-bootcamp': {
    storageKey: 'bitcamp_soft_access_ai_bootcamp',
    emailStorageKey: 'bitcamp_soft_access_ai_bootcamp_email',
    title: 'AI Prompt Engineering Bootcamp',
    buyPath: '/ai-bootcamp',
  },
} as const;

type LearnCourseSlug = keyof typeof courseAccess;

function getAccessConfig(courseSlug?: string) {
  if (!courseSlug) return null;
  return courseAccess[courseSlug as LearnCourseSlug] ?? null;
}

function hasStoredAccess(storageKey: string) {
  return window.localStorage.getItem(storageKey) === 'true';
}

function getStoredEmail(storageKey: string) {
  return window.localStorage.getItem(storageKey) || '';
}

function decodeAccessEmail(value: string) {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = decodeURIComponent(
      Array.from(atob(padded))
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );

    return decoded.includes('@') ? decoded : '';
  } catch {
    return '';
  }
}

function AccessGate({ title, buyPath }: { title: string; buyPath: string }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-2xl">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
          <LockKeyhole className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-red-300">Magic Link Access</p>
        <h1 className="mt-3 text-2xl sm:text-3xl font-bold leading-tight">
          {title}-ზე წვდომისთვის შეამოწმე ელფოსტა.
        </h1>
        <p className="mt-4 text-base leading-7 text-white/70">
          თუ კურსი უკვე შეიძინე, ელფოსტაში მოძებნე BitCamp-ის Magic Link და გახსენი ამავე
          ბრაუზერში. წვდომა ავტომატურად გააქტიურდება.
        </p>
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex gap-3">
            <MailCheck className="mt-1 h-5 w-5 flex-shrink-0 text-red-300" aria-hidden="true" />
            <p className="text-sm leading-6 text-white/65">
              ახალი ხარ? ჯერ შეიძინე კურსი და გადახდის შემდეგ მიიღებ Magic Link-ს ელფოსტაზე.
            </p>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="w-full min-w-0 bg-white text-slate-950 hover:bg-white/90">
            <Link to={buyPath}>შეიძინე AI Bootcamp — ₾99</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full min-w-0 whitespace-normal border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link to="/">მთავარზე დაბრუნება</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function LearnCoursePage() {
  const { courseSlug, topicSlug, lessonSlug } = useParams<{
    courseSlug: string;
    topicSlug?: string;
    lessonSlug?: string;
  }>();
  const location = useLocation();
  const navigate = useNavigate();

  const config = getAccessConfig(courseSlug);
  const routeBasePath = `/learn/${courseSlug}`;
  const [hasAccess, setHasAccess] = useState(() => (config ? hasStoredAccess(config.storageKey) : false));
  const [profileEmail, setProfileEmail] = useState(() => (config ? getStoredEmail(config.emailStorageKey) : ''));
  const [manifest, setManifest] = useState<CourseManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('access') || params.get('token') || params.get('magic');
  }, [location.search]);

  useEffect(() => {
    if (!config || !accessToken) return;

    const decodedEmail = decodeAccessEmail(accessToken);
    if (!decodedEmail) {
      return;
    }

    window.localStorage.setItem(config.storageKey, 'true');
    window.localStorage.setItem(config.emailStorageKey, decodedEmail);
    setProfileEmail(decodedEmail);
    setHasAccess(true);
    navigate(location.pathname, { replace: true });
  }, [accessToken, config, location.pathname, navigate]);

  function logout() {
    if (!config) return;

    window.localStorage.removeItem(config.storageKey);
    window.localStorage.removeItem(config.emailStorageKey);
    setHasAccess(false);
    setProfileEmail('');
    setManifest(null);
    navigate(routeBasePath, { replace: true });
  }

  useEffect(() => {
    async function loadCourse() {
      if (!courseSlug || !config || !hasAccess) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const loadedManifest = await loadCourseManifest(courseSlug, LEARN_CONTENT_BASE_URL);
      if (!loadedManifest) {
        setError('კურსი ვერ მოიძებნა');
      } else {
        setManifest(loadedManifest);
      }

      setLoading(false);
    }

    loadCourse();
  }, [config, courseSlug, hasAccess]);

  if (!config) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">კურსი ვერ მოიძებნა</h1>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            მთავარ გვერდზე დაბრუნება
          </Link>
        </Button>
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessGate title={config.title} buyPath={config.buyPath} />;
  }

  if (loading) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">კურსი იტვირთება...</div>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="dark min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">კურსი ვერ მოიძებნა</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild variant="outline">
          <Link to={config.buyPath}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            კურსის გვერდზე დაბრუნება
          </Link>
        </Button>
      </div>
    );
  }

  const isViewingLesson = topicSlug && lessonSlug;

  return (
    <div className="dark min-h-screen flex bg-background text-foreground">
      <CourseSidebar manifest={manifest} routeBasePath={routeBasePath} />

      <main className="flex-1 min-w-0">
        <div className="p-6 pt-20 lg:p-12">
          <div className="fixed right-4 top-4 z-50 flex items-center gap-2 lg:hidden">
            <div className="max-w-[160px] truncate rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 shadow-sm">
              {profileEmail || 'Magic Link'}
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
              aria-label="გასვლა"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-6 hidden lg:flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              მთავარ გვერდზე
            </Link>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{profileEmail || 'Magic Link-ით შესული ხარ'}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                გასვლა
              </button>
            </div>
          </div>

          {isViewingLesson ? (
            <LessonView
              courseSlug={courseSlug!}
              topicSlug={topicSlug}
              lessonSlug={lessonSlug}
              manifest={manifest}
              routeBasePath={routeBasePath}
              contentBaseUrl={LEARN_CONTENT_BASE_URL}
            />
          ) : (
            <CourseOverview
              manifest={manifest}
              routeBasePath={routeBasePath}
              contentBaseUrl={LEARN_CONTENT_BASE_URL}
            />
          )}
        </div>
      </main>
    </div>
  );
}
