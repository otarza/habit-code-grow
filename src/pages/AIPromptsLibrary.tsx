import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Check, Copy, Languages, Search, Sparkles, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import {
  AI_PROMPTS,
  PROMPT_CATEGORIES,
  type AIPrompt,
  type PromptCategory,
  type PromptCategoryId,
} from "@/data/aiPrompts";
import bitcampLogo from "@/assets/bitcamp-logo.png";

const SHELL = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const CATEGORY_MAP = Object.fromEntries(
  PROMPT_CATEGORIES.map((category) => [category.id, category]),
) as Record<PromptCategoryId, PromptCategory>;

type Lang = "ka" | "en";
type Filter = "all" | PromptCategoryId;

function PromptCard({ prompt, lang }: { prompt: AIPrompt; lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORY_MAP[prompt.category];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt[lang]);
      setCopied(true);
      toast.success("პრომპტი დაკოპირდა", {
        description: "ჩასვი ChatGPT-ში, Claude-ში ან Gemini-ში.",
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("კოპირება ვერ მოხერხდა — მონიშნე ტექსტი ხელით.");
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
      <div className="mb-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${category.badgeClass}`}
        >
          <span aria-hidden="true">{category.emoji}</span>
          {category.label}
        </span>
      </div>

      <h3
        className="text-[17px] font-bold normal-case leading-snug text-white"
        style={{ fontFeatureSettings: "normal" }}
      >
        {prompt.title}
      </h3>
      <p className="mt-1.5 text-sm leading-6 text-white/55">{prompt.description}</p>

      <pre
        className={`mt-4 max-h-72 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/40 p-3.5 text-[13px] leading-6 text-white/80 ${
          lang === "en" ? "font-mono" : "font-body"
        }`}
      >
        {prompt.prompt[lang]}
      </pre>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/40"
            >
              #{tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`„${prompt.title}“ პრომპტის კოპირება`}
          className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
            copied
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white text-slate-950 hover:bg-white/90"
          }`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "დაკოპირდა" : "კოპირება"}
        </button>
      </div>
    </article>
  );
}

export default function AIPromptsLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [lang, setLang] = useState<Lang>("ka");

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const prompt of AI_PROMPTS) {
      map[prompt.category] = (map[prompt.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return AI_PROMPTS.filter((prompt) => {
      if (filter !== "all" && prompt.category !== filter) return false;
      if (!q) return true;
      const haystack = [
        prompt.title,
        prompt.description,
        prompt.tags.join(" "),
        prompt.prompt.ka,
        prompt.prompt.en,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, filter]);

  const resetFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <SEO
        title={`AI პრომპტების ბიბლიოთეკა — ${AI_PROMPTS.length}+ მზა პრომპტი | BitCamp`}
        description={`${AI_PROMPTS.length} მზა, ტესტირებული AI პრომპტი ChatGPT-სთვის, Claude-სა და Gemini-სთვის — კოდი, წერა, ბიზნესი, კარიერა, სწავლა. დააკოპირე და გამოიყენე უფასოდ.`}
        url="https://www.bitcamp.ge/resources/ai-prompts-library"
      />

      {/* Top bar */}
      <header className="border-b border-white/10">
        <div className={`${SHELL} flex h-16 items-center justify-between`}>
          <Link to="/" className="flex items-center gap-2" aria-label="BitCamp — მთავარი">
            <img src={bitcampLogo} alt="BitCamp" className="h-7 w-auto invert" />
          </Link>
          <Link
            to="/ai-bootcamp"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            AI კურსი
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(244,63,94,0.14),transparent_72%)]"
          aria-hidden="true"
        />
        <div className={`${SHELL} relative pb-10 pt-14 text-center`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-rose-300" aria-hidden="true" />
            უფასო რესურსი BitCamp-ისგან
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            AI პრომპტების ბიბლიოთეკა
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
            {AI_PROMPTS.length} მზა, ტესტირებული პრომპტი ChatGPT-სთვის, Claude-სა და
            Gemini-სთვის. აირჩიე, დააკოპირე და გამოიყენე — დღესვე.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-sm text-white/45">
            <span>{AI_PROMPTS.length} პრომპტი</span>
            <span aria-hidden="true">·</span>
            <span>{PROMPT_CATEGORIES.length} კატეგორია</span>
            <span aria-hidden="true">·</span>
            <span>ქართული და English</span>
          </div>
        </div>
      </section>

      {/* Sticky controls */}
      <div className="sticky top-0 z-30 border-y border-white/10 bg-background/95 backdrop-blur-md">
        <div className={`${SHELL} space-y-3 py-4`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="მოძებნე პრომპტი — მაგ. „კოდი“, „ელ. ფოსტა“, „SQL“…"
                aria-label="პრომპტების ძიება"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-10 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-white/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="ძიების გასუფთავება"
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-white/45 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <Languages className="h-4 w-4 text-white/35" aria-hidden="true" />
              <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
                {(["ka", "en"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLang(option)}
                    aria-pressed={lang === option}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      lang === option
                        ? "bg-white text-slate-950"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    {option === "ka" ? "ქართული" : "English"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <FilterPill
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label="ყველა"
              count={AI_PROMPTS.length}
            />
            {PROMPT_CATEGORIES.map((category) => (
              <FilterPill
                key={category.id}
                active={filter === category.id}
                onClick={() => setFilter(category.id)}
                emoji={category.emoji}
                label={category.label}
                count={counts[category.id] ?? 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <section className={`${SHELL} py-8`}>
        <p className="mb-5 text-sm text-white/40">
          ნაჩვენებია{" "}
          <span className="font-medium text-white/70">{filtered.length}</span> პრომპტი
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-16 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
              <Search className="h-6 w-6 text-white/40" aria-hidden="true" />
            </div>
            <p className="font-medium text-white/75">ვერაფერი მოიძებნა</p>
            <p className="mt-1 text-sm text-white/45">
              სცადე სხვა საძიებო სიტყვა ან აირჩიე სხვა კატეგორია.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              ფილტრის გასუფთავება
            </button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filtered.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} lang={lang} />
            ))}
          </div>
        )}
      </section>

      {/* Conversion banner */}
      <section className={`${SHELL} pb-16`}>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose-500/[0.13] via-white/[0.02] to-sky-500/[0.1] p-8 text-center sm:p-12">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            გინდა AI პროფესიონალურად ისწავლო?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/65">
            ეს ბიბლიოთეკა მხოლოდ დასაწყისია. BitCamp-ის AI კურსზე ისწავლი, როგორ ააწყო
            შენი პრომპტები ნულიდან, ჩართო AI ყოველდღიურ საქმეში და რამდენჯერმე დააჩქარო
            შენი მუშაობა.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/ai-bootcamp"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-white/90 sm:w-auto"
            >
              გაიცანი AI Bootcamp
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/ai"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:text-white sm:w-auto"
            >
              მენტორობით სწავლა
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div
          className={`${SHELL} flex flex-col items-center justify-between gap-4 py-8 sm:flex-row`}
        >
          <div className="flex items-center gap-3">
            <img src={bitcampLogo} alt="BitCamp" className="h-6 w-auto invert" />
            <span className="text-sm text-white/40">
              © {new Date().getFullYear()} BitCamp
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm text-white/55">
            <Link to="/" className="transition-colors hover:text-white">
              მთავარი
            </Link>
            <Link to="/ai-bootcamp" className="transition-colors hover:text-white">
              AI კურსი
            </Link>
            <Link to="/terms" className="transition-colors hover:text-white">
              წესები
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  emoji,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  emoji?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex flex-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        active
          ? "border-white bg-white text-slate-950"
          : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/25 hover:text-white"
      }`}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
      <span className={active ? "text-slate-500" : "text-white/35"}>{count}</span>
    </button>
  );
}
