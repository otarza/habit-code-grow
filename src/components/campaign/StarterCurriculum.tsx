import { useState } from "react";
import { ArrowRight, ChevronDown, Clock3, PlayCircle, Video, type LucideIcon } from "lucide-react";
import { aiStarterCurriculum as curriculum } from "@/data/aiStarterCurriculum";

// Free sample lessons that can be watched right on the landing page.
const PREVIEW_LESSONS = new Set(["intro", "what-is-prompting", "framework-step1"]);

export type CurriculumModule = {
  n: string;
  title: string;
  subtitle: string;
  goal: string;
  icon: LucideIcon;
};

const formatClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const formatTotal = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h ? `${h} სთ ${m} წთ` : `${m} წთ`;
};
const sum = (lessons: { seconds: number }[]) => lessons.reduce((total, l) => total + l.seconds, 0);

const allLessons = curriculum.topics.flatMap(t => t.lessons);

export function StarterCurriculum({ modules, ctaLabel, onCta, onPreview }: {
  modules: CurriculumModule[];
  ctaLabel: string;
  onCta: () => void;
  onPreview?: (lessonSlug: string) => void;
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [playing, setPlaying] = useState<string | null>(null);
  const allOpen = open.size === curriculum.topics.length;

  const toggle = (index: number) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    return next;
  });

  return (
    <div className="starter-curriculum">
      <div className="starter-curriculum__summary">
        <span><Video aria-hidden="true" size={16} />{curriculum.topics.length} მოდული · {allLessons.length} გაკვეთილი</span>
        <span><Clock3 aria-hidden="true" size={16} />{formatTotal(sum(allLessons))} ვიდეო</span>
        <span><PlayCircle aria-hidden="true" size={16} />{PREVIEW_LESSONS.size} უფასო პრევიუ</span>
        <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(curriculum.topics.map((_, i) => i)))}>
          {allOpen ? "ყველას აკეცვა" : "ყველას გაშლა"}
        </button>
      </div>

      <div className="starter-curriculum__modules">
        {curriculum.topics.map((topic, index) => {
          const meta = modules[index];
          const Icon = meta?.icon;
          const isOpen = open.has(index);
          const panelId = `starter-curriculum-${topic.slug}`;
          return (
            <section className={`starter-curriculum__module${isOpen ? " is-open" : ""}`} key={topic.slug}>
              <button type="button" className="starter-curriculum__header" aria-expanded={isOpen} aria-controls={panelId}
                onClick={() => toggle(index)}>
                {Icon && <span className="campaign-card-icon"><Icon aria-hidden="true" size={20} /></span>}
                <span className="starter-curriculum__heading">
                  <small>მოდული {meta?.n ?? index + 1} · {topic.lessons.length} გაკვეთილი · {formatTotal(sum(topic.lessons))}</small>
                  <strong>{meta?.title ?? topic.title}</strong>
                  {meta?.goal && <span>{meta.goal}</span>}
                </span>
                <ChevronDown className="starter-curriculum__chevron" aria-hidden="true" size={20} />
              </button>
              <ol id={panelId} className="starter-curriculum__lessons" hidden={!isOpen}>
                {topic.lessons.map((lesson, i) => {
                  const preview = PREVIEW_LESSONS.has(lesson.slug);
                  const isPlaying = playing === lesson.slug;
                  return (
                    <li key={lesson.slug} className={preview ? "is-preview" : undefined}>
                      <div className="starter-curriculum__lesson">
                        <span className="starter-curriculum__index">{i + 1}</span>
                        <span className="starter-curriculum__title">{lesson.title}</span>
                        {preview && (
                          <button type="button" className="starter-curriculum__preview" aria-expanded={isPlaying}
                            onClick={() => {
                              setPlaying(isPlaying ? null : lesson.slug);
                              if (!isPlaying) onPreview?.(lesson.slug);
                            }}>
                            <PlayCircle aria-hidden="true" size={15} />{isPlaying ? "დახურვა" : "უფასო პრევიუ"}
                          </button>
                        )}
                        <span className="starter-curriculum__duration">{formatClock(lesson.seconds)}</span>
                      </div>
                      {isPlaying && (
                        <div className="starter-curriculum__player">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?autoplay=1&rel=0&modestbranding=1`}
                            title={lesson.title}
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      <div className="starter-curriculum__cta">
        <p>ყველა {allLessons.length} გაკვეთილი, უვადო წვდომით.</p>
        <button type="button" className="campaign-cta" onClick={onCta}>
          <span>{ctaLabel}</span><ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>
    </div>
  );
}
