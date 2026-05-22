/**
 * AI Prompts Library — content data
 * Rendered at /resources/ai-prompts-library
 *
 * HOW TO EDIT:
 * - Add a prompt: append an object to AI_PROMPTS with a unique `id`.
 * - `title` and `description` are Georgian (shown in the UI).
 * - `prompt.ka` / `prompt.en` are the copyable prompt text in each language.
 * - `tags` power search — keep them short, lowercase-ish keywords.
 * - `category` must be one of the PromptCategoryId values below.
 * - Placeholders the user fills in use [square brackets].
 */

export type PromptCategoryId =
  | "basics"
  | "coding"
  | "writing"
  | "learning"
  | "business"
  | "career"
  | "productivity"
  | "data";

export type PromptCategory = {
  id: PromptCategoryId;
  /** Short Georgian label, used in filter pills and card badges. */
  label: string;
  emoji: string;
  /** Tailwind classes for the badge chip on the dark theme. */
  badgeClass: string;
};

export type AIPrompt = {
  id: string;
  category: PromptCategoryId;
  /** Georgian — shown as the card heading. */
  title: string;
  /** Georgian — one line on when/why to use it. */
  description: string;
  /** Search keywords. */
  tags: string[];
  /** The copyable prompt, in both languages. */
  prompt: {
    ka: string;
    en: string;
  };
};

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    id: "basics",
    label: "საფუძვლები",
    emoji: "🎯",
    badgeClass: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  },
  {
    id: "coding",
    label: "კოდი",
    emoji: "💻",
    badgeClass: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  },
  {
    id: "writing",
    label: "წერა",
    emoji: "✍️",
    badgeClass: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  },
  {
    id: "learning",
    label: "სწავლა",
    emoji: "📚",
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  {
    id: "business",
    label: "ბიზნესი",
    emoji: "📈",
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  {
    id: "career",
    label: "კარიერა",
    emoji: "💼",
    badgeClass: "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300",
  },
  {
    id: "productivity",
    label: "პროდუქტიულობა",
    emoji: "⚡",
    badgeClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
  },
  {
    id: "data",
    label: "ანალიზი",
    emoji: "📊",
    badgeClass: "border-orange-500/20 bg-orange-500/10 text-orange-300",
  },
];

export const AI_PROMPTS: AIPrompt[] = [
  // ── საფუძვლები / basics ───────────────────────────────────────────────
  {
    id: "improve-prompt",
    category: "basics",
    title: "პრომპტის გაუმჯობესება",
    description: "აქცევ სუსტ პრომპტს ძლიერად — როლით, კონტექსტითა და ფორმატით.",
    tags: ["პრომპტი", "გაუმჯობესება"],
    prompt: {
      ka: `შენ ხარ პრომპტ-ინჟინერიის წამყვანი ექსპერტი. შენი ამოცანაა გააუმჯობესე ქვემოთ მოცემული პრომპტი ისე, რომ მან სხვადასხვა LLM-ებში (მაგ. ChatGPT-ში, Claude-ში, Gemini-სთვის) გაცილებით უფრო ზუსტი, თანმიმდევრული და სასარგებლო შედეგი გამოიღოს.

ჩემი პრომპტი: „[ჩასვი შენი პრომპტი აქ]“

წესები და ფორმატი:
1. დეტალურად გააანალიზე და პუნქტებად ჩამოწერე ამჟამინდელი პრომპტის სუსტი მხარეები, ორაზროვანი ადგილები და ნაკლოვანებები.
2. შეადგინე სრულიად ახალი, გაუმჯობესებული და ოპტიმიზებული ვერსია (გამოიყენე TCRF ჩარჩო: მკაფიოდ განსაზღვრე ექსპერტის როლი, მიეცი საჭირო კონტექსტი, ჩამოაყალიბე კონკრეტული დავალება, დააწესე მკაფიო შეზღუდვები და განსაზღვრე პასუხის იდეალური ფორმატი).
3. მოკლედ, ეტაპობრივად ახსენი, თუ რა ძირითადი ცვლილებები განახორციელე და რატომ გააუმჯობესებს ეს ახალი სტრუქტურა პასუხის ხარისხს.`,
      en: `You are a prompt engineering expert. Your task is to analyze and optimize the user-provided prompt to ensure it generates highly accurate, consistent, and useful results across modern LLMs (such as ChatGPT, Claude, and Gemini).

My prompt: "[paste your prompt here]"

Do the following:
1. Point out the weaknesses of the current prompt.
2. Rewrite it as an improved version (add role, context, output format, and constraints).
3. Briefly explain what you changed and why.`,
    },
  },
  {
    id: "assign-role",
    category: "basics",
    title: "ექსპერტის როლის მინიჭება",
    description: "აიძულებ AI-ს იპასუხოს კონკრეტული პროფესიონალის პერსპექტივიდან.",
    tags: ["როლი", "ექსპერტი", "პერსონა"],
    prompt: {
      ka: `იმოქმედე როგორც [პროფესია / ექსპერტის როლი, მაგ. Senior ფინანსური ანალიტიკოსი] [რიცხვი] წლიანი გამოცდილებით. შენი ამოცანაა დამეხმარო შემდეგი გამოწვევის გადაჭრაში:

დავალება: [აღწერე შესასრულებელი დავალება]

წესები და ფორმატი:
1. მიპასუხე ექსკლუზიურად ამ ექსპერტის პერსპექტივიდან: გამოიყენე შესაბამისი პროფესიული ტერმინოლოგია, მეთოდოლოგია და დარგობრივი სტანდარტები.
2. ნათლად მიუთითე ის ფარული რისკები, შეზღუდვები ან ნიუანსები, რომლებსაც მხოლოდ ამ დარგის გამოცდილი სპეციალისტი შეამჩნევდა.
3. მომეცი პრაქტიკული, ნაბიჯ-ნაბიჯ განხორციელებადი რეკომენდაციები და საუკეთესო პრაქტიკა.`,
      en: `Act as a [profession / expert role, e.g. senior financial analyst] with [number] years of active experience in this field. Your task is to help me solve the following challenge:

Task: [describe your task]

Rules & Format:
1. Respond exclusively from the perspective of this expert: utilize professional industry jargon, established methodologies, and standards.
2. Clearly highlight any hidden risks, edge cases, constraints, or nuances that only an experienced specialist in your field would identify.
3. Provide highly actionable, step-by-step recommendations and best practices.`,
    },
  },
  {
    id: "step-by-step",
    category: "basics",
    title: "ნაბიჯ-ნაბიჯ აზროვნება",
    description: "აჩვენებინებ AI-ს მსჯელობას — ზუსტ პასუხებს რთულ ამოცანებზე.",
    tags: ["აზროვნება", "ნაბიჯები", "ლოგიკა"],
    prompt: {
      ka: `შენ ხარ ლოგიკისა და ანალიტიკური აზროვნების წამყვანი ექსპერტი. შენი ამოცანაა სიღრმისეულად ამოხსნა ქვემოთ მოცემული რთული ამოცანა.

ამოცანა: [აღწერე პრობლემა ან კითხვა]

წესები და ფორმატი:
1. სანამ საბოლოო პასუხს ჩამოაყალიბებდე, ეტაპობრივად ჩამოაყალიბე შენი მსჯელობის პროცესი. თითოეული ლოგიკური ნაბიჯი წარადგინე ცალკე, დანომრილი პუნქტის სახით.
2. დეტალურად გააანალიზე შესაძლო ალტერნატივები ან დაშვებები ყოველ ეტაპზე.
3. ბოლოს, ცალკე სექციად გამოყავი „საბოლოო პასუხი“, რომელიც იქნება მაქსიმალურად კონკრეტული, ლაკონური და მკაფიო (მაქსიმუმ ერთი მოკლე აბზაცი).`,
      en: `Solve the problem below step by step. Before giving the final answer, show your reasoning out loud.

Problem: [describe the problem or question]

Format:
- Reasoning: numbered steps
- Final answer: one short paragraph`,
    },
  },
  {
    id: "output-format",
    category: "basics",
    title: "პასუხის ფორმატის განსაზღვრა",
    description: "მართავ ზუსტად, როგორ უნდა გამოიყურებოდეს AI-ს პასუხი.",
    tags: ["ფორმატი", "სტრუქტურა"],
    prompt: {
      ka: `შენ ხარ მონაცემთა სტრუქტურირებისა და ფორმატირების წამყვანი ექსპერტი. შენი ამოცანაა შეასრულო ქვემოთ მოცემული დავალება და პასუხი მოამზადო მკაცრად განსაზღვრული ფორმატით.

დავალება: [აღწერე შენი მოთხოვნა]

სასურველი ფორმატი:
- [მაგ. ცხრილი კონკრეტული სვეტებით: სახელი | აღწერა | პრიორიტეტი]
- [ან: პუნქტებიანი (მარკირებული) სია მაქსიმუმ 5 პუნქტით]
- [ან: ვალიდური JSON ველებით: ...]

წესები და შეზღუდვები:
1. პასუხი უნდა შეესაბამებოდეს მხოლოდ და მხოლოდ მითითებულ ფორმატს.
2. არ დაამატო შესავალი, დასკვნითი სიტყვა, თავაზიანი ფრაზები ან ნებისმიერი სხვა ზედმეტი ტექსტი ამ ფორმატის გარეთ.`,
      en: `[Describe your request].

Return the answer strictly in this format:
- [e.g. a table with columns: Name | Description | Priority]
- [or: a bulleted list of max 5 items]
- [or: valid JSON with the fields ...]

Do not add any text outside this format.`,
    },
  },
  {
    id: "give-context",
    category: "basics",
    title: "კონტექსტის სწორად მიწოდება",
    description: "მისცემ AI-ს ყველა საჭირო ფონს, სანამ დავალებას დაუსვამ.",
    tags: ["კონტექსტი"],
    prompt: {
      ka: `შენ ხარ მაღალი კლასის კონსულტანტი. შენი ამოცანაა შეასრულო ქვემოთ მოცემული დავალება, მასზე მიბმული სრული კონტექსტისა და შეზღუდვების გათვალისწინებით.

კონტექსტი:
- ჩემი როლი / გამოცდილება: [შენი როლი / გამოცდილება]
- საბოლოო მიზანი: [რისი მიღწევა გსურს]
- სამიზნე აუდიტორია: [ვისთვის არის განკუთვნილი შედეგი]
- შეზღუდვები: [ბიუჯეტი, დროის ლიმიტი, ტონი, სიგრძე და ა.შ.]

დავალება: [რა უნდა გააკეთოს AI-მ]

წესები და ფორმატი:
1. სრულად გაითვალისწინე თითოეული მოცემული კონტექსტუალური დეტალი პასუხის მომზადებისას.
2. თუ მიიჩნევ, რომ საუკეთესო შედეგის მისაღებად რაიმე მნიშვნელოვანი ინფორმაცია ან დეტალი გაკლია, პასუხის გაცემამდე დამისვი დამაზუსტებელი კითხვები.`,
      en: `Context:
- Who I am: [your role / background]
- Goal: [what you want to achieve]
- Audience: [who the result is for]
- Constraints: [budget, time, tone, length, etc.]

Task: [what you want the AI to do]

Use all the context above. If something important is missing, ask me before answering.`,
    },
  },
  {
    id: "ask-questions",
    category: "basics",
    title: "დამაზუსტებელი კითხვები",
    description: "აიძულებ AI-ს ჯერ გკითხოს — შემდეგ უკეთეს პასუხს მიიღებ.",
    tags: ["კითხვები", "დაზუსტება"],
    prompt: {
      ka: `შენ ხარ კვალიფიციური მრჩეველი და სტრატეგი. მე მჭირდება შენი დახმარება კონკრეტული ამოცანის შესასრულებლად, თუმცა მინდა, რომ ჯერ სრულყოფილი ინფორმაცია მიიღო საუკეთესო შედეგისთვის.

ჩემი ამოცანა: [აღწერე დავალება]

წესები და ფორმატი:
1. ჯერ არ დაიწყო დავალების შესრულება.
2. დამისვი 3–5 ყველაზე კრიტიკული დამაზუსტებელი კითხვა, რომლებიც დაგეხმარება ჩემი საჭიროებების, კონტექსტისა და მოთხოვნების სიღრმისეულად გაგებაში.
3. კითხვები ჩამოაყალიბე პუნქტებად, მარტივად და გასაგებად.
4. დაელოდე ჩემს პასუხებს და მხოლოდ ამის შემდეგ მოამზადე საბოლოო სრულყოფილი გადაწყვეტა.`,
      en: `I want you to help me with: [describe the task].

Before you start, ask me 3–5 clarifying questions that would help you give a much better answer. Wait for my answers, then complete the task.`,
    },
  },

  // ── კოდი / coding ─────────────────────────────────────────────────────
  {
    id: "explain-code",
    category: "coding",
    title: "კოდის ახსნა",
    description: "გასაგებად ახსნი უცხო კოდს — სტრიქონ-სტრიქონ.",
    tags: ["კოდი", "ახსნა"],
    prompt: {
      ka: `შენ ხარ პროგრამირების გამოცდილი მენტორი. შენი ამოცანაა დეტალურად და გასაგებად ახსნა ქვემოთ მოცემული კოდი ისე, თითქოს ესაუბრები დამწყებ პროგრამისტს, რომელიც ამ ენას ახლა სწავლობს.

კოდი:
[ჩასვი შენი კოდი]

წესები და ფორმატი:
1. შესავალში 1–2 წინადადებით მარტივად ახსენი, თუ რას აკეთებს ეს კოდი გლობალურად.
2. წარმოადგინე კოდის დეტალური განხილვა ლოგიკური ბლოკების ან სტრიქონების მიხედვით. ახსენი რთული კონსტრუქციები, ალგორითმები ან გამოყენებული ბიბლიოთეკები.
3. აღნიშნე ნებისმიერი შესაძლო ბაგი, სუსტი წერტილი ან წარმადობის პრობლემა, რომლებსაც კოდში შეამჩნევ.`,
      en: `Explain the code below as if to a developer who is new to this language.

[paste your code]

Cover:
1. What the code does overall (1–2 sentences).
2. A line-by-line / block-by-block breakdown.
3. Any potential bugs or weak spots you notice.`,
    },
  },
  {
    id: "debug",
    category: "coding",
    title: "ბაგის პოვნა და გასწორება",
    description: "პოულობ შეცდომის მიზეზს და იღებ გასწორებულ კოდს.",
    tags: ["ბაგი", "შეცდომა", "debug"],
    prompt: {
      ka: `შენ ხარ Senior დეველოპერი და დებაგინგის (Debugging) წამყვანი ექსპერტი. შენი ამოცანაა იპოვო და გაასწორო შეცდომა (ბაგი) ქვემოთ მოცემულ კოდში.

კოდი:
[ჩასვი შენი კოდი]

მოსალოდნელი ქცევა: [აღწერე, რა უნდა მოხდეს]
რეალური ქცევა / შეცდომა: [აღწერე, რა ხდება სინამდვილეში, ან ჩასვი შეცდომის ტექსტი/ლოგი]

წესები და ფორმატი:
1. დეტალურად აგვიხსენი შეცდომის გამომწვევი ძირითადი მიზეზი (Root Cause).
2. წარმოადგინე სრულად გასწორებული, ოპტიმიზებული და ტესტირებული კოდი.
3. მოკლედ ჩამოაყალიბე რეკომენდაციები, თუ როგორ ავიცილოთ თავიდან მსგავსი ტიპის შეცდომები მომავალში.`,
      en: `This code is not working as expected. Help me find and fix the bug.

Code:
[paste your code]

Expected behavior: [what should happen]
Actual behavior / error: [what happens instead — paste the error message]

Explain the cause of the bug, then give the corrected code.`,
    },
  },
  {
    id: "code-review",
    category: "coding",
    title: "კოდის რევიუ",
    description: "იღებ პროფესიული code review-ის დონის უკუკავშირს.",
    tags: ["რევიუ", "code review", "ხარისხი"],
    prompt: {
      ka: `შენ ხარ Senior ინჟინერი და სისტემური არქიტექტორი. ჩაატარე ქვემოთ მოცემული კოდის პროფესიონალური რევიუ (Code Review) ისე, თითქოს ამოწმებ pull request-ს პროდუქციაში გასაშვებად.

კოდი:
[ჩასვი შენი კოდი]

წესები და ფორმატი:
1. შეაფასე კოდის ხარისხი შემდეგი პარამეტრების მიხედვით: წაკითხვადობა და სტილი, ცვლადებისა და ფუნქციების დასახელებები, წარმადობა და მეხსიერების მართვა, უსაფრთხოების რისკები, სასაზღვრო შემთხვევები (edge cases).
2. თითოეულ აღმოჩენილ ხარვეზზე ან გასაუმჯობესებელ ადგილზე მიუთითე კრიტიკულობის დონე (დაბალი / საშუალო / მაღალი) და შესთავაზე კონკრეტული კოდის ალტერნატივა მის გამოსასწორებლად.
3. პასუხის ბოლოს შეაფასე კოდი ზოგადად და მიეცი რეკომენდაცია: Approve (დასაშვებია), Request Changes (საჭიროებს ცვლილებებს) ან Comment (შენიშვნა).`,
      en: `Review the code below like a senior engineer doing a pull request review.

[paste your code]

Comment on: readability, naming, performance, security, and edge cases. For each issue, give the severity (low / medium / high) and a concrete suggestion.`,
    },
  },
  {
    id: "write-function",
    category: "coding",
    title: "ფუნქციის დაწერა აღწერით",
    description: "აგენერირებ სუფთა ფუნქციას მკაფიო სპეციფიკაციიდან.",
    tags: ["ფუნქცია", "კოდი"],
    prompt: {
      ka: `შენ ხარ პროგრამული უზრუნველყოფის წამყვანი ინჟინერი. შენი ამოცანაა დაწერო სუფთა, ოპტიმალური და კარგად დოკუმენტირებული ფუნქცია მოცემული სპეციფიკაციის მიხედვით.

- პროგრამირების ენა: [მიუთითე ენა, მაგ. TypeScript, Python]
- შემავალი პარამეტრები (Input): [აღწერე შემავალი მონაცემები]
- გამომავალი მონაცემები (Output): [აღწერე რას უნდა აბრუნებდეს]
- ფუნქციონალი: [აღწერე რას უნდა აკეთებდეს ფუნქცია]
- წესები და შეზღუდვები: [სპეციალური მოთხოვნები, სასაზღვრო შემთხვევები]

წესები და ფორმატი:
1. დაწერე სუფთა და იდიომატური კოდი მითითებულ ენაზე.
2. კოდის მნიშვნელოვან ან რთულ ხაზებს დაურთე მოკლე განმარტებითი კომენტარები.
3. მოიყვანე ფუნქციის გამოყენების 2-3 მკაფიო მაგალითი სხვადასხვა შემავალი მონაცემებით (მათ შორის სასაზღვრო შემთხვევების გათვალისწინებით).`,
      en: `Write a function in [language] that does the following:

- Input: [describe the input]
- Output: [describe the output]
- Rules: [edge cases, constraints]

Requirements: clean readable code, comments on the key lines, and 2–3 usage examples.`,
    },
  },
  {
    id: "write-tests",
    category: "coding",
    title: "ტესტების დაწერა",
    description: "ფარავ კოდს იუნიტ-ტესტებით — ჩვეულებრივი და სასაზღვრო შემთხვევები.",
    tags: ["ტესტები", "unit test"],
    prompt: {
      ka: `შენ ხარ ხარისხის უზრუნველყოფის (QA) წამყვანი ინჟინერი და ავტომატიზაციის ექსპერტი. შენი ამოცანაა დაწერო სრული და საიმედო იუნიტ-ტესტები (Unit Tests) ქვემოთ მოცემული ფუნქციისთვის.

ფუნქციის კოდი:
[ჩასვი შენი კოდი]

ტესტირების ბიბლიოთეკა/ფრეიმვორკი: [მაგ. Jest, pytest]

წესები და ფორმატი:
1. დაწერე ტესტები, რომლებიც დაფარავს:
   - პოზიტიურ სცენარებს (სტანდარტული შემავალი მონაცემები)
   - ნეგატიურ სცენარებს (არასწორი/ცარიელი შემავალი მონაცემები)
   - სასაზღვრო შემთხვევებს (edge cases, მაგ. უკიდურესი მნიშვნელობები)
2. თითოეულ ტესტს დაარქვი მკაფიო, აღწერითი სახელი, რომელიც ნათლად გამოხატავს მოსალოდნელ ქცევას.
3. კოდი დაწერე საუკეთესო პრაქტიკის მიხედვით (მაგ. AAA - Arrange, Act, Assert სტრუქტურით).`,
      en: `Write unit tests for the function below using [test framework, e.g. Jest / pytest].

[paste your function]

Cover: normal cases, edge cases, and invalid input. Give each test a clear, descriptive name.`,
    },
  },
  {
    id: "refactor",
    category: "coding",
    title: "კოდის რეფაქტორინგი",
    description: "ხდი კოდს უფრო სუფთად, ქცევის შეცვლის გარეშე.",
    tags: ["რეფაქტორინგი", "კოდი"],
    prompt: {
      ka: `შენ ხარ კოდის ხარისხისა და პროგრამული არქიტექტურის წამყვანი ექსპერტი. შენი ამოცანაა მოახდინო ქვემოთ მოცემული კოდის რეფაქტორინგი, რათა ის გახდეს უფრო სუფთა, წაკითხვადი, წარმადობის კუთხით ეფექტური და მარტივად შესანახი (maintainable) — კოდის ფუნქციონალურობისა და ქცევის შეცვლის გარეშე.

კოდი:
[ჩასვი შენი კოდი]

წესები და შეზღუდვები:
1. კოდის ფუნქციონალური ქცევა და გარე ინტერფეისი უნდა დარჩეს აბსოლუტურად უცვლელი.
2. გააუმჯობესე კოდის არქიტექტურა: წაშალე დუბლირებები (DRY), დაიცავი ერთი პასუხისმგებლობის პრინციპი (Single Responsibility), გაამარტივე რთული პირობითი კონსტრუქციები და დახვეწე ცვლადების სახელები.
3. წარმოადგინე რეფაქტორირებული კოდი და მის ქვემოთ პუნქტებად ჩამოწერე კონკრეტული სტრუქტურული გაუმჯობესებები, რომლებიც განახორციელე (და მიზეზები მათ უკან).`,
      en: `Refactor the code below to make it cleaner and easier to maintain — without changing its behavior.

[paste your code]

Show the refactored version, then list the improvements you made as bullet points.`,
    },
  },
  {
    id: "regex",
    category: "coding",
    title: "რეგულარული გამოსახულება (regex)",
    description: "აშენებ და იგებ regex-ს მაგალითებზე დაყრდნობით.",
    tags: ["regex", "რეგექსი"],
    prompt: {
      ka: `შენ ხარ რეგულარული გამოსახულებების (Regex) წამყვანი ექსპერტი და პროგრამისტი. შენი ამოცანაა შექმნა ოპტიმალური, ზუსტი და უსაფრთხო რეგულარული გამოსახულება მოცემული მოთხოვნების მიხედვით.

- ამოცანა: [აღწერე რა უნდა მოიძებნოს / ამოიღოს კოდიდან, მაგ. ელ. ფოსტის მისამართები, თარიღები]
- უნდა დაემთხვეს (Matches):
  - [მაგალითი 1]
  - [მაგალითი 2]
- არ უნდა დაემთხვეს (Non-matches):
  - [მაგალითი 1]
  - [მაგალითი 2]
- გამოყენებული ენა/გარემო: [მაგ. JavaScript, Python, PostgreSQL, PCRE]

წესები და ფორმატი:
1. მოგვეცი მზა რეგულარული გამოსახულება (Regex).
2. დეტალურად, ნაბიჯ-ნაბიჯ ახსენი თითოეული სიმბოლოსა და ჯგუფის (capturing group) დანიშნულება.
3. მიუთითე, თუ რომელი დროშები (flags, მაგ. /g, /i, /m) უნდა იქნას გამოყენებული.
4. მოიყვანე კოდის მცირე მაგალითი [მითითებული ენა]-ზე, რომელიც აჩვენებს ამ regex-ის გამოყენებას პრაქტიკაში.`,
      en: `You are a regular expressions (Regex) expert and senior developer. Your task is to write an optimal, precise, and secure regular expression based on the following requirements:

- Task: [describe what pattern to find/extract, e.g., email addresses, date format]
- Matches:
  - [example 1]
  - [example 2]
- Non-matches:
  - [example 1]
  - [example 2]
- Target environment/language: [e.g. JavaScript, Python, PCRE, PostgreSQL]

Rules & Format:
1. Provide the complete regular expression.
2. Explain the pattern step-by-step, explaining the function of each group, anchor, character class, or token.
3. Specify which flags (e.g. /g, /i, /m) should be enabled.
4. Provide a brief code snippet in [specified language] demonstrating how to apply this regex.`,
    },
  },

  // ── წერა და კონტენტი / writing ─────────────────────────────────────────
  {
    id: "shorten-text",
    category: "writing",
    title: "ტექსტის შემოკლება",
    description: "ამოჭრი ზედმეტ და წყალწყალა ფრაზებს — ინარჩუნებ მხოლოდ ძირითად სათქმელს.",
    tags: ["შემოკლება", "რედაქტირება", "ლაკონურობა"],
    prompt: {
      ka: `შენ ხარ ტექსტის პროფესიონალი რედაქტორი და ლაკონური კომუნიკაციის წამყვანი ექსპერტი. შენი ამოცანაა შეამცირო და გაამარტივო მოცემული ტექსტი ისე, რომ ის გახდეს უფრო ნათელი, პირდაპირი და ადვილად წასაკითხი, თუმცა სრულად შეინარჩუნოს ძირითადი სათქმელი და ფაქტობრივი სიზუსტე.

ტექსტი: „[ჩასვი შენი ტექსტი აქ]“

წესები და შეზღუდვები:
1. ამოჭერი ყველა ზედმეტი სიტყვა, წყალწყალა ფრაზა, გამეორება და კლიშე (მაგ. „როგორც მოგეხსენებათ“, „თავის მხრივ“ და ა.შ.).
2. შეამცირე ტექსტის მოცულობა მინიმუმ [პროცენტი, მაგ. 30%-ით ან 50%-ით] ან მოაქციე ის [სიტყვების მაქსიმალური რაოდენობა, მაგ. 100] სიტყვაში.
3. შეინარჩუნე ორიგინალი ტექსტის ტონი (მაგ. საქმიანი, მეგობრული) და მთავარი აზრი.
4. პასუხის ბოლოს პუნქტებიანი (მარკირებული) სიის სახით მოკლედ ჩამოწერე ძირითადი ცვლილებები (რა ტიპის ფრაზები ამოიღე და რატომ).`,
      en: `You are a professional editor and concise communication expert. Your task is to condense and simplify the provided text to make it clearer, more direct, and highly readable, while fully preserving its core message and factual accuracy.

Text: "[paste your text here]"

Rules & Constraints:
1. Eliminate all redundant words, fluff, unnecessary repetitions, and empty clichés (e.g. "it goes without saying", "at the end of the day").
2. Reduce the text length by approximately [percent, e.g. 30% or 50%] or target a maximum word count of [number, e.g. 100 words].
3. Preserve the original tone (e.g. professional, warm, casual) and the primary argument/message.
4. At the end, list the key editing adjustments you made as bullet points, explaining what was removed and why.`,
    },
  },
  {
    id: "headline-generator",
    category: "writing",
    title: "სათაურების გენერატორი",
    description: "ადგენ ყურადღების მიმქცევ სათაურებს სხვადასხვა კუთხით.",
    tags: ["სათაური", "კრეატივი", "marketing"],
    prompt: {
      ka: `შენ ხარ კრეატიული ქოფირაითერი და კონტენტ-მარკეტინგის წამყვანი ექსპერტი. შენი ამოცანაა შეადგინო 10 ძლიერი და ყურადღების მიმქცევი სათაური მოცემული მასალისთვის.

- კონტენტის ტიპი: [მაგ. ბლოგ-პოსტი, YouTube ვიდეო, Facebook რეკლამა, ელ. საინფორმაციო ბიულეტენი]
- თემა / მოკლე აღწერა: [აღწერე რაზეა კონტენტი]
- სამიზნე აუდიტორია: [ვინ უნდა წაიკითხოს / ნახოს, მაგ. ფრილანსერები, დამწყები მეწარმეები]
- მთავარი მიზანი: [მაგ. მაღალი Click-Through Rate (CTR) / ნდობის მოპოვება / მომხმარებლის დაინტერესება]

წესები და ფორმატი:
1. თითოეული სათაური არ უნდა აღემატებოდეს [რიცხვი, მაგ. 10] სიტყვას.
2. სათაურები უნდა იყოს მრავალფეროვანი და მოიცავდეს სხვადასხვა ფსიქოლოგიურ კუთხეს:
   - კითხვაზე დაფუძნებული
   - პრაქტიკული / „როგორ...“ ტიპის
   - ციფრებისა და სტატისტიკის შემცველი
   - ცნობისმოყვარეობის აღმძვრელი
   - თამამი, პროვოკაციული მტკიცება
3. წარმოადგინე პუნქტებიანი (მარკირებული) სია, სადაც თითოეულ სათაურს ფრჩხილებში მოკლედ მიუწერ, თუ რა არის მისი ფსიქოლოგიური ტრიგერი (კუთხე).`,
      en: `You are a creative copywriter and content marketing expert. Your task is to brainstorm and generate 10 powerful and attention-grabbing headlines for the provided topic or content.

- Content Type: [e.g., blog post, YouTube video, Facebook ad, email newsletter]
- Topic / Brief Description: [describe what the content is about]
- Target Audience: [who should read/watch this, e.g., freelancers, aspiring entrepreneurs]
- Main Goal: [e.g., high Click-Through Rate (CTR) / building trust / sparking curiosity]

Rules & Format:
1. Keep each headline under [number, e.g., 10] words.
2. Mix different psychological angles to ensure diversity:
   - Question-based
   - Practical / "How-to" style
   - Number/Data-driven
   - Curiosity-inducing
   - Bold, provocative statement
3. Present a bulleted list, briefly noting the psychological trigger or angle next to each headline in parentheses.`,
    },
  },
  {
    id: "email",
    category: "writing",
    title: "პროფესიული ელ. წერილი",
    description: "წერ ეფექტურ, მკაფიო და საქმიან წერილებს მოცემული დეტალებით.",
    tags: ["ელ. ფოსტა", "წერილი", "კომუნიკაცია"],
    prompt: {
      ka: `შენ ხარ პროფესიული კომუნიკაციისა და ქოფირაითინგის წამყვანი ექსპერტი. შენი ამოცანაა დაწერო ეფექტური, მკაფიო და ლაკონური ელ. წერილი მოცემული დეტალების საფუძველზე:

- მიმღები: [მიმღები და მისი როლი, მაგ. პოტენციური პარტნიორი, გუნდის წევრი]
- მიზანი: [რისი მიღწევა გსურს ამ წერილით, მაგ. შეხვედრის ჩანიშვნა, პროდუქტის შეთავაზება]
- მთავარი სათქმელი / პუნქტები: [ჩამოწერე ძირითადი საკითხები]
- ტონი: [ფორმალური / მეგობრული / დიპლომატიური / მკაცრი]

წესები და ფორმატი:
1. შემომთავარე სათაურის (Subject Line) 3 განსხვავებული ვარიანტი (ჩამთრევი, ნათელი და მოკლე).
2. წერილი უნდა იყოს კარგად სტრუქტურირებული: მისალმება, შესავალი, მთავარი ნაწილი, კონკრეტული მოწოდება მოქმედებისკენ (CTA) და თავაზიანი დასასრული.
3. ტექსტი უნდა იყოს მაქსიმალურად ლაკონური, აზრობრივად მკაფიო და თავისუფალი წყალწყალა, კლიშე ფრაზებისგან (მაგ. „იმედი მაქვს კარგად ხართ“ და ა.შ.).
4. ყოველი პუნქტი და აბზაცი უნდა ემსახურებოდეს დასახულ მიზანს.`,
      en: `You are a professional business communication and copywriting expert. Your task is to write an effective, clear, and concise email based on the following details:

- Recipient: [recipient and their role, e.g. potential partner, team member]
- Goal: [what you want to achieve with this email, e.g. schedule a meeting, pitch a product]
- Key points: [list the main points]
- Tone: [formal / friendly / diplomatic / firm]

Rules & Format:
1. Suggest 3 different subject lines (engaging, clear, and brief).
2. The email must be well-structured: appropriate greeting, concise intro, core message, specific call to action (CTA), and professional sign-off.
3. Keep the content highly concise, direct, and free of fluff or generic clichés (e.g. "I hope this email finds you well").
4. Ensure every sentence contributes directly to the email's primary goal.`,
    },
  },
  {
    id: "change-tone",
    category: "writing",
    title: "ტექსტის ტონის შეცვლა",
    description: "ცვლი ტექსტის სტილსა და ატმოსფეროს აუდიტორიის მიხედვით.",
    tags: ["ტონი", "სტილი", "რედაქტირება"],
    prompt: {
      ka: `შენ ხარ ტექსტის რედაქტირებისა და სტილისტიკის წამყვანი ექსპერტი. შენი ამოცანაა გადაწერო მოცემული ტექსტი სასურველ სტილსა და ტონზე ისე, რომ სრულად შეინარჩუნო მისი პირვანდელი აზრი და ფაქტობრივი ინფორმაცია.

- ორიგინალი ტექსტი: „[ჩასვი ტექსტი აქ]“
- სასურველი ტონი: [მაგ. საქმიანი / მხიარული / ემპათიური / დამარწმუნებელი / მეგობრული]
- სამიზნე აუდიტორია: [ვინ არის მკითხველი, მაგ. სტუდენტები, გუნდის წევრები, ინვესტორები]

წესები და ფორმატი:
1. შეინარჩუნე ყველა ფაქტი, ციფრი, თარიღი და ძირითადი არგუმენტი, რომლებიც მოცემულია ორიგინალ ტექსტში.
2. არ დაამატო ახალი ინფორმაცია, სპეკულაციები ან ვარაუდები, რომლებიც არ იყო თავდაპირველ ტექსტში.
3. შეცვალე წინადადებების სტრუქტურა, ლექსიკა და გამოთქმები ისე, რომ ისინი იდეალურად შეესაბამებოდეს სასურველ ტონსა და სამიზნე აუდიტორიის ინტერესებს.
4. წარმოადგინე ტექსტის 2 განსხვავებული ვარიაცია, რათა მქონდეს არჩევანის შესაძლებლობა.
5. ბოლოს მოკლედ ჩამოწერე, თუ რა ძირითადი სტილისტური ცვლილებები განახორციელე (მაგ. სიტყვების შეერჩევა, წინადადების ტიპები) სასურველი ატმოსფეროს შესაქმნელად.`,
      en: `You are a professional editor and writing style expert. Your task is to rewrite the provided text into the specified tone and style, while fully preserving its original meaning and factual accuracy.

- Original Text: "[paste your text here]"
- Desired Tone: [e.g., professional / playful / empathetic / persuasive / casual]
- Target Audience: [who is reading this, e.g., students, team members, investors]

Rules & Format:
1. Retain all facts, figures, dates, and core arguments from the original text.
2. Do not add any new information, assumptions, or speculations that were not present in the original.
3. Adjust the sentence structures, vocabulary, and phrasing to align perfectly with the target tone and the audience's expectations.
4. Provide 2 distinct stylistic variations so I can choose the best one.
5. At the end, briefly list the main stylistic adjustments you made (e.g., word choice, sentence length/style) to achieve the desired tone.`,
    },
  },
  {
    id: "social-post",
    category: "writing",
    title: "სოციალური მედიის პოსტი",
    description: "ქმნი ჩამთრევ პოსტებს Facebook, Instagram ან LinkedIn პლატფორმისთვის.",
    tags: ["სოც. ქსელი", "პოსტი", "SMM"],
    prompt: {
      ka: `შენ ხარ სოციალური მედიის მარკეტინგის (SMM) წამყვანი ექსპერტი და ვირუსული ქოფირაითინგის ოსტატი. შენი ამოცანაა შექმნა ჩამთრევი და მაღალკონვერტირებადი სოციალური მედიის პოსტი მოცემული დეტალების მიხედვით:

- თემა / მთავარი ამბავი: [აღწერე მოკლედ რაზეა პოსტი, ან ჩასვი უხეში მონახაზი]
- პლატფორმა: [Facebook / LinkedIn / Instagram / Telegram]
- სამიზნე აუდიტორია: [ვინ არიან, მაგ. ახალგაზრდა მეწარმეები, პროგრამისტები]
- მთავარი მიზანი: [მაგ. ბმულზე გადასვლა / კომენტარების დაწერა / პროდუქტის რეგისტრაცია]

წესები და ფორმატი:
1. პოსტი დაიწყე ყურადღების მიმქცევი ძლიერი პირველი წინადადებით (Hook), რომელიც მკითხველს ეკრანის სკროლინგს შეაჩერებინებს.
2. ტექსტი უნდა იყოს მაქსიმალურად წაკითხვადი — გამოიყენე მოკლე აბზაცები, თვალსაჩინო გამოყოფები და პუნქტებიანი (მარკირებული) სიები.
3. შეარჩიე თემის შესაბამისი emoji-ები, რომლებიც ტექსტს ვიზუალურ დინამიკას შესძენს, თუმცა არ გადატვირთო (გამოიყენე ზომიერად).
4. დაასრულე მკაფიო, მარტივი და კონკრეტული მოწოდებით მოქმედებისკენ (CTA), რომელიც უბიძგებს მომხმარებელს სასურველი აქტივობისკენ.
5. პოსტის ბოლოს დაურთე 3-5 ყველაზე აქტუალური და მიზანმიმართული ჰეშთეგი (#).`,
      en: `You are a social media marketing (SMM) expert and viral copywriting master. Your task is to write an engaging, high-performing social media post based on the following details:

- Topic / Core Message: [briefly describe the post topic, or paste a rough draft]
- Platform: [Facebook / LinkedIn / Instagram / Telegram]
- Target Audience: [who they are, e.g., young entrepreneurs, software developers]
- Main Goal: [e.g., clicking a link / sparking comments / registering for an event]

Rules & Format:
1. Start with a powerful attention-grabbing hook in the first sentence to stop users from scrolling past.
2. Ensure high scannability — use short paragraphs, visual spacing, and bulleted lists.
3. Incorporate relevant emojis to add visual appeal and tone, but use them selectively and without cluttering.
4. End with a single, highly clear, and actionable Call to Action (CTA) that guides users to the next step.
5. Include 3-5 highly relevant and targeted hashtags at the very end.`,
    },
  },
  {
    id: "blog-outline",
    category: "writing",
    title: "ბლოგის სტრუქტურა/კონსპექტი",
    description: "აშენებ SEO-ოპტიმიზებულ სტრუქტურას საინტერესო ბლოგ-პოსტისთვის.",
    tags: ["ბლოგი", "SEO", "კონტენტი"],
    prompt: {
      ka: `შენ ხარ SEO კონტენტ-სტრატეგიისა და ბლოგინგის წამყვანი ექსპერტი. შენი ამოცანაა შექმნა დეტალური, SEO-ზე ოპტიმიზებული და სტრუქტურირებული ბლოგ-პოსტის სქემა (Blog Post Outline) მოცემული თემის საფუძველზე:

- ბლოგის თემა: [აღწერე ბლოგის თემა ან მთავარი კითხვა, რომელსაც ის პასუხობს]
- სამიზნე აუდიტორია: [მაგ. დამწყები მეწარმეები, ფიტნესის მოყვარულები]
- ძირითადი საკვანძო სიტყვები: [საკვანძო სიტყვა 1, საკვანძო სიტყვა 2]
- მთავარი მიზანი: [მაგ. მკითხველის განათლება / პროდუქტის რეკომენდაცია / ნდობის მოპოვება]

წესები და ფორმატი:
1. ჩამოაყალიბე ბლოგის სტრუქტურა სათაურების მკაფიო იერარქიით (H1, H2, H3).
2. თითოეული სექციისთვის (მაგ. H2 სათაურისთვის) მოკლედ, 2-3 პუნქტის სახით მიუთითე, თუ რა კონკრეტული არგუმენტები, ფაქტები ან იდეები უნდა გაიშალოს მასში.
3. შესთავაზე შესავლის (Introduction) შექმნის კრეატიული მიდგომა (მაგ. პრობლემის დასმა ან საინტერესო სტატისტიკით დაწყება).
4. დასკვნაში (Conclusion) გაითვალისწინე მკაფიო მოწოდება მოქმედებისკენ (CTA), რომელიც ბლოგის მიზანს პასუხობს.
5. ცალკე სექციად წარმოადგინე SEO ოპტიმიზაციის რეკომენდაციები:
   - SEO სათაური (Meta Title) — მაქსიმუმ 60 სიმბოლო, საკვანძო სიტყვის გამოყენებით.
   - მეტა-აღწერა (Meta Description) — მაქსიმუმ 155 სიმბოლო, რომელიც აღძრავს Click-Through-ს (CTR).`,
      en: `You are an SEO content strategist and blog outline expert. Your task is to design a highly structured, SEO-optimized blog post outline based on the following details:

- Blog Topic: [describe the topic or the main question it answers]
- Target Audience: [e.g., aspiring entrepreneurs, fitness enthusiasts]
- Target Keywords: [keyword 1, keyword 2]
- Primary Goal: [e.g., educating the reader / recommending a product / building trust]

Rules & Format:
1. Organize the outline using a clear heading hierarchy (H1, H2, H3).
2. For each section, list 2-3 bullet points detailing the specific facts, arguments, or ideas to be covered.
3. Suggest a compelling hook or approach for the Introduction (e.g. starting with a provocative question or statistic).
4. In the Conclusion, integrate a clear Call to Action (CTA) matching the primary goal.
5. Provide a separate section for SEO suggestions:
   - SEO Title (Meta Title): max 60 characters, utilizing the primary keyword.
   - Meta Description: max 155 characters, written to maximize click-through rate (CTR).`,
    },
  },
  {
    id: "announcement",
    category: "writing",
    title: "განცხადება / პრესრელიზი",
    description: "აცხადებ მნიშვნელოვან სიახლეს მკაფიოდ და სტრუქტურირებულად.",
    tags: ["განცხადება", "პრესრელიზი", "სიახლე"],
    prompt: {
      ka: `შენ ხარ საზოგადოებასთან ურთიერთობის (PR) და კორპორაციული კომუნიკაციების წამყვანი ექსპერტი. შენი ამოცანაა დაწერო მკაფიო, საინტერესო და პროფესიონალური განცხადება (ან პრესრელიზი) მოცემული სიახლის შესახებ.

- სიახლე / თემა: [რა არის მთავარი სათქმელი]
- სამიზნე აუდიტორია: [მაგ. არსებული მომხმარებლები, კომპანიის თანამშრომლები, ფართო საზოგადოება]
- ძირითადი ფაქტები: [რა მოხდა, როდის, სად და რატომ არის ეს მნიშვნელოვანი]
- სასურველი ტონი: [მაგ. საზეიმო და ენერგიული / ფორმალური და ოფიციალური / თბილი და მადლიერი]
- მოცულობა: [მაგ. მაქსიმუმ 250 სიტყვა / 3 მოკლე აბზაცი]

წესები და სტრუქტურა:
1. დაიწყე ძლიერი, ინფორმაციული და ყურადღების მიმქცევი სათაურით.
2. პირველივე აბზაცში (Lead Paragraph) მკაფიოდ გასეცი პასუხი 5 ძირითად კითხვას: ვინ, რა, როდის, სად და რატომ (5 Ws).
3. თუ შესაბამისია, მოამზადე კომპანიის სპიკერის / წარმომადგენლის მოკლე, შთამაგონებელი ციტატის (Quote) მონახაზი, რომელიც განცხადებას ადამიანურ განზომილებას შესძენს.
4. ტექსტი უნდა იყოს აბსოლუტურად დაცლილი ორთოგრაფიული ან სტილისტური შეცდომებისგან, ადვილად წასაკითხი და ემსახურებოდეს დადებითი იმიჯის ფორმირებას.`,
      en: `You are a public relations (PR) and corporate communications expert. Your task is to write a clear, engaging, and professional press release or announcement based on the specified news.

- The News / Core Message: [what is the main announcement]
- Target Audience: [e.g. existing customers, team members, the general public]
- Key Facts: [what happened, when, where, and why it is important]
- Desired Tone: [e.g., celebratory / formal / warm and appreciative]
- Length Constraint: [e.g., max 250 words / 3 short paragraphs]

Rules & Structure:
1. Start with a powerful, informative, and attention-grabbing headline.
2. In the opening paragraph (the lead), clearly answer the 5 Ws: Who, What, When, Where, and Why.
3. If applicable, draft a brief, inspiring quote from a company spokesperson to add a human touch to the announcement.
4. Ensure the copy is completely free of spelling or stylistic errors, highly readable, and structured to shape a positive brand perception.`,
    },
  },

  // ── სწავლა / learning ──────────────────────────────────────────────────
  {
    id: "explain-simply",
    category: "learning",
    title: "ახსენი მარტივად",
    description: "გადმოსცემ რთულ კონცეფციას მარტივი ანალოგიებითა და მაგალითებით.",
    tags: ["სწავლა", "ახსნა", "მარტივად"],
    prompt: {
      ka: `შენ ხარ გამოცდილი პედაგოგი და სამეცნიერო კომუნიკაციის წამყვანი ექსპერტი. შენი ამოცანაა რთული თემა ან კონცეფცია ახსნა მაქსიმალურად მარტივი, გასაგები და საინტერესო ენით.

- თემა: [რთული კონცეფცია, მაგ. კვანტური ფიზიკა, ბლოკჩეინი, ინფლაცია]
- სამიზნე აუდიტორია: [მაგ. 10 წლის ბავშვი, სრულიად დამწყები სტუდენტი, არატექნიკური მენეჯერი]

წესები და ფორმატი:
1. ახსნისას გამოიყენე ყოველდღიური ცხოვრებიდან აღებული ნათელი მეტაფორები, ანალოგიები და თვალსაჩინო მაგალითები.
2. სრულად აარიდე თავი სპეციფიკურ დარგობრივ ჟარგონებს, ან თუ რომელიმე ტერმინის გამოყენება აუცილებელია, ჯერ მარტივად განმარტე მისი აზრი.
3. პასუხი დაყავი 3 ნაწილად:
   - მოკლე ინტუიციური შეჯამება (1 წინადადება).
   - დეტალური, მარტივი ენით გაწერილი ახსნა ანალოგიებით.
   - ერთი პრაქტიკული მაგალითი ან სავარჯიშო, რომელიც აჩვენებს ამ კონცეფციის მოქმედებას.`,
      en: `You are an experienced educator and science communicator. Your task is to explain a complex topic or concept in highly simple, engaging, and accessible language.

- Concept: [e.g. quantum computing, blockchain, inflation]
- Target Audience: [e.g. a 10-year-old child, a complete beginner, a non-technical manager]

Rules & Format:
1. Use vivid analogies, everyday metaphors, and real-life examples to explain the concept.
2. Avoid all field-specific jargon and acronyms, or clearly define them using simple terms if their usage is unavoidable.
3. Structure the explanation into 3 parts:
   - A one-sentence intuitive summary.
   - A detailed, simple explanation using your chosen analogy.
   - A practical, hands-on example illustrating how this concept works.`,
    },
  },
  {
    id: "study-plan",
    category: "learning",
    title: "სასწავლო გეგმა",
    description: "ადგენ ნაბიჯ-ნაბიჯ საათობრივ გეგმას ნებისმიერი უნარისთვის.",
    tags: ["სწავლა", "გეგმა", "განათლება"],
    prompt: {
      ka: `შენ ხარ პერსონალური განვითარებისა და სწავლის მეთოდოლოგიების წამყვანი ექსპერტი (Learning Architect). შენი ამოცანაა შეადგინო დეტალური, პრაქტიკული და ეფექტური სასწავლო გეგმა (Study Plan) მოცემული მიზნის მისაღწევად.

- თემა, რომლის შესწავლაც მსურს: [მაგ. React.js, ესპანური ენა, ფინანსური მოდელირება]
- ჩემი ამჟამინდელი დონე: [დამწყები / საშუალო / მაღალი]
- დროის ლიმიტი: [მაგ. კვირაში 5 საათი, სულ 1 თვე]
- სწავლის სასურველი ფორმატი: [ვიდეოები, წიგნები, პრაქტიკული პროექტები, სტატიები]

წესები და ფორმატი:
1. სასწავლო გეგმა დაყავი ეტაპებად (მაგ. კვირების ან მოდულების მიხედვით).
2. თითოეული ეტაპისთვის ჩამოწერე:
   - კონკრეტული სასწავლო მიზნები (რა უნდა ვიცოდე ამ ეტაპის ბოლოს).
   - შესასწავლი თემების ჩამონათვალი.
   - რეკომენდებული პრაქტიკული დავალება ან მცირე პროექტი მიღებული ცოდნის გასამყარებლად.
3. ბოლოს მომეცი 3 ოქროს წესი/რეკომენდაცია, რომლებიც დამეხმარება მოტივაციის შენარჩუნებასა და მასალის ეფექტურად ათვისებაში.`,
      en: `You are a learning architect and instructional designer. Your task is to design a detailed, structured, and highly effective study plan to achieve the specified learning goal.

- Subject/Skill to learn: [e.g. React.js, Spanish, financial modeling]
- Current Skill Level: [beginner / intermediate / advanced]
- Time Commitment: [e.g. 5 hours per week, for 1 month]
- Preferred Resources: [videos, books, hands-on projects, articles]

Rules & Format:
1. Break down the study plan into logical phases (e.g., weeks or modules).
2. For each phase, list:
   - Learning objectives (what I will be able to do by the end of this phase).
   - Key topics to study.
   - A recommended practical exercise or mini-project to reinforce the concepts.
3. At the end, provide 3 golden rules or study tips to maximize retention and keep my learning consistent.`,
    },
  },
  {
    id: "compare-concepts",
    category: "learning",
    title: "ცნებების შედარება",
    description: "სათანადოდ ადარებ 2 მსგავს ცნებას ცხრილითა და მაგალითებით.",
    tags: ["შედარება", "ცნებები", "სწავლა"],
    prompt: {
      ka: `შენ ხარ ანალიტიკური აზროვნებისა და შემეცნების მენტორი. შენი ამოცანაა შეადარო ორი მსგავსი ან ხშირად აღრეული კონცეფცია და ნათლად აჩვენო მათ შორის არსებული განსხვავებები.

- კონცეფციები: [კონცეფცია A] და [კონცეფცია B] (მაგ. REST API vs GraphQL, SQL vs NoSQL, აქციები vs ობლიგაციები)

წესები და ფორმატი:
1. შექმენი მარტივი შედარების Markdown ცხრილი კონკრეტული კრიტერიუმებით (მაგ. სიჩქარე, სტრუქტურა, გამოყენების სფერო).
2. თითოეული კონცეფციისთვის ჩამოაყალიბე 1-წინადადებიანი მარტივი დეფინიცია (იდეალურ შემთხვევაში, ანალოგიების გამოყენებით).
3. ნათლად აღწერე ძირითადი განსხვავებები და ის შემთხვევები, თუ როდის ჯობია კონცეფცია A-ს გამოყენება და როდის — კონცეფცია B-სი.
4. გამოიყენე მაქსიმალურად მკაფიო, ადვილად წასაკითხი სტრუქტურა.`,
      en: `You are an analytical educator and conceptual strategist. Your task is to compare two closely related or frequently confused concepts and clearly explain their differences.

- Concepts to Compare: [Concept A] vs [Concept B] (e.g. REST API vs GraphQL, SQL vs NoSQL, Stocks vs Bonds)

Rules & Format:
1. Create a clear markdown comparison table across key dimensions (e.g. performance, flexibility, primary use case).
2. Provide a 1-sentence intuitive definition for each concept, using analogies if possible.
3. Detail the key differences and outline specific scenarios for when to choose Concept A and when to choose Concept B.
4. Keep the output highly scannable and direct.`,
    },
  },
  {
    id: "quiz",
    category: "learning",
    title: "ქვიზის შექმნა",
    description: "ამოწმებ საკუთარ თავს ინტერაქციული ტესტითა და შეფასებით.",
    tags: ["ქვიზი", "ტესტი", "ცოდნა"],
    prompt: {
      ka: `შენ ხარ შემფასებელი და საგამომცდელო ტესტების წამყვანი დიზაინერი. შენი ამოცანაა შექმნა ინტერაქციული ქვიზი (ტესტი) ჩემი ცოდნის შესამოწმებლად.

- თემა: [თემა, რომლის შემოწმებაც გსურს]
- სირთულე: [დამწყები / საშუალო / პროფესიონალი]
- კითხვების რაოდენობა: [რიცხვი, მაგ. 5]
- ტესტის ტიპი: [მაგ. არჩევითი პასუხებით (Multiple Choice) / ღია კითხვები]

წესები და ფორმატი:
1. შეადგინე კითხვები მითითებულ თემასა და სირთულეზე.
2. პასუხის გაცემისას წარმოადგინე მხოლოდ კითხვები. არ აჩვენო სწორი პასუხები ან ახსნა-განმარტებები წინასწარ.
3. დაელოდე ჩემს პასუხებს.
4. მას შემდეგ, რაც მე პასუხებს გამოგიგზავნი, შეაფასე თითოეული მათგანი, მიუთითე სწორი პასუხები, დეტალურად და მარტივად ახსენი დაშვებული შეცდომები და დამიწერე საბოლოო ქულა (მაგ. 4/5).`,
      en: `You are an educational assessment designer. Your task is to create an interactive quiz to test my knowledge on a specific subject.

- Topic: [subject area to test]
- Difficulty: [beginner / intermediate / advanced]
- Number of Questions: [number, e.g. 5]
- Format: [e.g. Multiple Choice / Open-ended questions]

Rules & Format:
1. Generate the questions based on the topic and difficulty level.
2. Present only the questions initially. Do not show the correct answers or explanations upfront.
3. Wait for my response containing my answers.
4. Once I submit my answers, grade each of them, provide the correct answers, explain any mistakes in detail, and output my final score (e.g. 4/5).`,
    },
  },
  {
    id: "summarize",
    category: "learning",
    title: "ტექსტის შეჯამება",
    description: "გამოყოფ მთავარ იდეებსა და საკვანძო პუნქტებს ნებისმიერი გრძელი ტექსტიდან.",
    tags: ["შეჯამება", "კონსპექტი", "ანალიზი"],
    prompt: {
      ka: `შენ ხარ ინფორმაციის ანალიზისა და კონდენსაციის წამყვანი ექსპერტი. შენი ამოცანაა შეაჯამო ქვემოთ მოცემული ტექსტი.

ტექსტი: „[ჩასვი შენი ტექსტი აქ]“

წესები და ფორმატი:
1. შექმენი ტექსტის მოკლე შეჯამება (მაქსიმუმ 2-3 წინადადება), რომელიც გადმოსცემს მთავარ სათქმელს.
2. ჩამოწერე 5 ყველაზე მნიშვნელოვანი საკვანძო პუნქტი/იდეა პუნქტებიანი (მარკირებული) სიის სახით.
3. იყავი აბსოლუტურად ობიექტური და ფაქტობრივი — არ დაამატო საკუთარი ინტერპრეტაციები ან ფაქტები, რომლებიც ტექსტში არ არის მოცემული.`,
      en: `You are an information analysis and condensation expert. Summarize the text below.

Text: "[paste your text here]"

Rules & Format:
1. Write a brief executive summary (max 2-3 sentences) capturing the core message.
2. Extract the 5 most important key takeaways as a bulleted list.
3. Remain strictly objective and factual — do not add any outside information or personal interpretations.`,
    },
  },
  {
    id: "feynman",
    category: "learning",
    title: "ფეინმანის ტექნიკა",
    description: "ამოწმებ შენს გაგებას: ხსნი თემას შენი სიტყვებით, AI კი პოულობს და გისწორებს ხარვეზებს.",
    tags: ["ფეინმანი", "აზროვნება", "მენტორი"],
    prompt: {
      ka: `შენ ხარ აზროვნებისა და შემეცნების მენტორი (Feynman-ის მეთოდის ფასილიტატორი). მე შევეცდები ჩემი სიტყვებით მარტივად ავხსნა კონკრეტული თემა, შენი ამოცანაა ჩემს ახსნაში არსებული ხარვეზების, შეუსაბამობებისა და ბუნდოვანი ადგილების პოვნა.

თემა: [რა თემას ხსნი]
ჩემი ახსნა: „[დაწერე შენი ახსნა აქ]“

წესები და ფორმატი:
1. გააანალიზე ჩემი ახსნა და შეაფასე, რამდენად სწორად და სრულყოფილად მესმის თემა.
2. მიუთითე ნებისმიერ შეცდომაზე, ზედაპირულ მსჯელობაზე ან გამოტოვებულ საკვანძო დეტალზე.
3. დამისვი 2-3 დამაზუსტებელი კითხვა, რომლებიც დამეხმარება ჩემი ცოდნის სიღრმისეულად შემოწმებაში და აზროვნების პროგრესირებაში.
4. გამოიყენე მხარდამჭერი, პოზიტიური და წამახალისებელი ტონი.`,
      en: `You are a cognitive mentor and Feynman technique facilitator. I will try to explain a concept in my own simple words, and your task is to identify gaps, inaccuracies, and blind spots in my understanding.

Topic: [concept you are explaining]
My explanation: "[write your explanation here]"

Rules & Format:
1. Analyze my explanation and assess how accurately and thoroughly I grasp the topic.
2. Point out any errors, superficial logic, or omitted key details.
3. Ask me 2-3 thought-provoking questions that will help me test my knowledge and deepen my understanding.
4. Maintain a highly supportive, positive, and encouraging tone.`,
    },
  },

  // ── ბიზნესი და მარკეტინგი / business ──────────────────────────────────
  {
    id: "customer-persona",
    category: "business",
    title: "სამიზნე აუდიტორიის პორტრეტი",
    description: "ხატავ დეტალურ მომხმარებლის პერსონას.",
    tags: ["აუდიტორია", "პერსონა"],
    prompt: {
      ka: `შენ ხარ მომხმარებელთა ქცევის მკვლევარი და მარკეტინგული სტრატეგიის წამყვანი ექსპერტი. შენი ამოცანაა შექმნა სამიზნე მომხმარებლის დეტალური და რეალისტური პორტრეტი (Customer Persona) მოცემული ბიზნესისთვის.

- პროდუქტი / სერვისი: [პროდუქტი / სერვისი]
- სამიზნე ნიშა: [მოკლე აღწერა, ვისთვის არის განკუთვნილი]

წესები და ფორმატი:
1. შექმენი ერთი კონკრეტული პერსონა, მიანიჭე მას სახელი და აღწერე შემდეგი სტრუქტურით:
   - დემოგრაფიული მონაცემები: ასაკი, პროფესია, შემოსავალი, საცხოვრებელი ადგილი, ოჯახური მდგომარეობა.
   - ფსიქოგრაფია: ღირებულებები, ინტერესები, ჰობი და ყოველდღიური ჩვევები.
   - მიზნები და მოტივაცია: რის მიღწევას ცდილობს, რა ამოძრავებს და რაზე ოცნებობს.
   - ტკივილის წერტილები (Pain Points): რა ძირითადი პრობლემები ან სირთულეები აქვს, რომლებიც ჩვენს პროდუქტს მოუგვარებს.
   - ყიდვის წინააღმდეგობები (Objections): რა ეჭვები ან მიზეზები შეიძლება ჰქონდეს, რომლებიც ყიდვაში ხელს შეუშლის.
   - ონლაინ ქცევა: სად ატარებს დროს ონლაინ (პლატფორმები, საიტები) და როგორ მოიხმარს ინფორმაციას.
2. ჩამოაყალიბე 3 კონკრეტული სარეკლამო გზავნილი (Marketing Messages), რომლებიც ყველაზე მეტად დააინტერესებს ამ პერსონას.`,
      en: `You are a customer research and marketing strategy expert. Your task is to build a highly detailed and realistic customer persona (buyer persona) for the specified business.

- Product / Service: [product / service]
- Target Niche: [brief description of the market]

Rules & Format:
1. Create one concrete persona with a fictional name, structured as follows:
   - Demographics: Age, occupation, income level, location, family status.
   - Psychographics: Values, interests, hobbies, lifestyle, and daily habits.
   - Goals & Motivations: What they want to achieve, what drives them, and their aspirations.
   - Pain Points: The core frustrations, challenges, or obstacles they face that our product can solve.
   - Objections to Buying: The primary doubts, hesitations, or friction points preventing them from purchasing.
   - Online Behavior: Where they spend their time online (platforms, websites) and how they consume information.
2. Formulate 3 tailored marketing messages that would resonate deeply with this persona.`,
    },
  },
  {
    id: "ad-copy",
    category: "business",
    title: "სარეკლამო ტექსტი",
    description: "წერ მაკონვერტირებელ რეკლამას სხვადასხვა კუთხით.",
    tags: ["რეკლამა", "copy", "მარკეტინგი"],
    prompt: {
      ka: `შენ ხარ უმაღლესი კლასის ქოფირაითერი და კონვერსიული მარკეტინგის წამყვანი ექსპერტი. შენი ამოცანაა დაწერო მაღალკონვერტირებადი სარეკლამო ტექსტი მოცემული დეტალების საფუძველზე.

- პროდუქტი / სერვისი: [პროდუქტი / სერვისი]
- სამიზნე აუდიტორია: [ვის მიმართავ, მაგ. მშობლები, პროგრამისტები]
- მთავარი სარგებელი / უპირატესობა: [ყიდვის №1 მიზეზი]
- შეთავაზება: [ფასი, ფასდაკლება, ბონუსი]
- პლატფორმა: [Facebook / Google / Instagram / LinkedIn]

წესები და ფორმატი:
1. შექმენი სარეკლამო ტექსტის 3 სრულიად განსხვავებული ვარიაცია, სხვადასხვა ფსიქოლოგიური კუთხით (მაგ. პრობლემაზე ორიენტირებული, სარგებელზე ორიენტირებული, ისტორიაზე დაფუძნებული).
2. თითოეულ ვარიაციაში მკაფიოდ გამოყავი:
   - ყურადღების მიმქცევი სათაური / კაუჭი (Hook).
   - ძირითადი ტექსტი (Body), სადაც აქცენტი გაკეთებულია სარგებელზე და არა უბრალო მახასიათებლებზე.
   - ნათელი და მარტივი მოწოდება მოქმედებისკენ (Call to Action - CTA).
3. ტექსტი მოარგე მითითებული პლატფორმის საუკეთესო პრაქტიკას (მაგ. სიგრძის შეზღუდვები, emoji-ების გამოყენება).`,
      en: `You are a premium direct-response copywriter and conversion marketing expert. Your task is to write high-converting ad copy based on the details below.

- Product / Service: [product / service]
- Target Audience: [who you are targeting, e.g. working parents, developers]
- Core Value Proposition: [the #1 reason to buy]
- Offer: [price, discount, free trial, bonus]
- Platform: [Facebook / Google / Instagram / LinkedIn]

Rules & Format:
1. Create 3 distinct variations of the ad copy using different psychological angles (e.g. pain-point focused, benefit-led, storytelling-driven).
2. For each variation, clearly structure:
   - A scroll-stopping hook or headline.
   - Body copy that translates features into clear customer benefits.
   - A single, compelling Call to Action (CTA).
3. Optimize the layout and style specifically for the guidelines of the target platform (e.g., character limits, emoji usage).`,
    },
  },
  {
    id: "swot",
    category: "business",
    title: "SWOT ანალიზი",
    description: "აფასებ ძლიერ მხარეებს, სისუსტეებსა და შესაძლებლობებს.",
    tags: ["SWOT", "ბიზნესი", "ანალიზი"],
    prompt: {
      ka: `შენ ხარ ბიზნეს-სტრატეგიისა და კომპანიების დიაგნოსტიკის წამყვანი ექსპერტი. ჩაატარე დეტალური SWOT ანალიზი ქვემოთ მოცემული ბიზნესისთვის (ან პროექტისთვის).

- ბიზნესის / პროექტის სახელი და აღწერა: [სახელი, მაგ. ონლაინ მაღაზია, ყავის მაღაზია]
- ინდუსტრია და ნიშა: [აღწერე ბაზარი და კონკურენცია]
- ამჟამინდელი გამოწვევები: [რაზე ნერვიულობ]

წესები და ფორმატი:
1. შექმენი მკაფიოდ სტრუქტურირებული SWOT ანალიზი და დაყავი ის 4 ძირითად სექციად:
   - ძლიერი მხარეები (Strengths) — შიდა უპირატესობები და რესურსები.
   - სუსტი მხარეები (Weaknesses) — შიდა ხარვეზები და ლიმიტები.
   - შესაძლებლობები (Opportunities) — გარე ტენდენციები და ბაზრის ხარვეზები, რომლებიც შეგვიძლია გამოვიყენოთ.
   - საფრთხეები (Threats) — გარე რისკები და გამოწვევები (კონკურენცია, რეგულაციები), რომლებსაც უნდა ვუპასუხოთ.
2. თითოეულ სექციაში წარმოადგინე 3–5 ყველაზე კრიტიკული პუნქტი.
3. ბოლოს, ჩამოაყალიბე 3 კონკრეტული, დასაბუთებული სტრატეგიული რეკომენდაცია: როგორ გამოვიყენოთ ძლიერი მხარეები შესაძლებლობების ასათვისებლად და როგორ დავიცვათ თავი საფრთხეებისგან სისუსტეების აღმოფხვრით.`,
      en: `You are a strategic management consultant and business analyst. Conduct a comprehensive SWOT analysis for the specified business or project.

- Business / Project Description: [name and brief description of the company]
- Industry & Market Niche: [describe the market dynamics and context]
- Core Challenges: [e.g. slow user acquisition, strong local competitors, lack of funding]

Rules & Format:
1. Provide a detailed SWOT analysis structured into 4 distinct lists:
   - Strengths (internal advantages, resources, unique assets).
   - Weaknesses (internal limitations, inefficiencies, gaps).
   - Opportunities (external market gaps, technology shifts, customer trends).
   - Threats (external risks, regulatory challenges, competition).
2. For each of the 4 areas, list 3–5 highly specific and objective points.
3. Deliver 3 actionable strategic recommendations outlining how to leverage strengths to capture opportunities and how to mitigate weaknesses to guard against threats.`,
    },
  },
  {
    id: "product-description",
    category: "business",
    title: "პროდუქტის აღწერა",
    description: "აქცევ მახასიათებლებს სარგებლად, რომელიც ყიდის.",
    tags: ["პროდუქტი", "აღწერა"],
    prompt: {
      ka: `შენ ხარ ელექტრონული კომერციის (E-commerce) ქოფირაითერი და პროდუქტის მარკეტინგის წამყვანი ექსპერტი. შენი ამოცანაა დაწერო პროდუქტის შთამბეჭდავი, მაკონვერტირებელი და ადვილად წასაკითხი აღწერა.

- პროდუქტი / სერვისი: [პროდუქტი]
- სამიზნე მომხმარებელი: [სამიზნე მომხმარებელი, მაგ. ახალგაზრდა დედები, მოყვარული მორბენლები]
- პროდუქტის ძირითადი მახასიათებლები: [ჩამოწერე ძირითადი ტექნიკური დეტალები / მონაცემები]
- ბრენდის ხმა / სასურველი ტონი: [მაგ. თამამი და ენერგიული / მდიდრული და დახვეწილი / სანდო და საქმიანი]

წესები და ფორმატი:
1. დაიწყე ჩამთრევი, ემოციური შესავლით (1-2 წინადადება), რომელიც მომხმარებლის პრობლემას / სურვილს პასუხობს.
2. ტექნიკური მახასიათებლები აქციე მომხმარებლისთვის კონკრეტულ სარგებლად (Benefits) — აჩვენე, თუ რატომ არის ეს მისთვის მნიშვნელოვანი.
3. გამოიყენე პუნქტებიანი (მარკირებული) სია ადვილი წაკითხვისთვის.
4. დაასრულე მკაფიო მოწოდებით მოქმედებისკენ (CTA) და ერთი ძლიერი არგუმენტით, თუ რატომ უნდა შეიძინოს მან ეს პროდუქტი ახლავე.`,
      en: `You are an e-commerce copywriter and product marketing specialist. Your task is to write a compelling, high-converting product description based on the provided details.

- Product Name / Category: [product name]
- Target Customer: [who is buying this, e.g. fitness enthusiasts, remote workers]
- Key Features: [list technical specs, materials, or features]
- Brand Voice / Tone: [e.g. bold and adventurous / clean and minimalist / warm and caring]

Rules & Format:
1. Hook the reader with a benefit-driven introduction (1-2 sentences) addressing a specific desire or challenge.
2. Translate each technical feature into a clear, emotional benefit for the end user.
3. Ensure the structure is highly scannable using a bulleted list of benefits.
4. End with a strong sense of urgency or unique buying reason, followed by a clear Call to Action (CTA).`,
    },
  },
  {
    id: "email-campaign",
    category: "business",
    title: "ელ. ფოსტის კამპანია",
    description: "გეგმავ წერილების თანმიმდევრობას ერთი მიზნისთვის.",
    tags: ["ელ. ფოსტა", "კამპანია"],
    prompt: {
      ka: `შენ ხარ იმეილ-მარკეტინგის წამყვანი სტრატეგი და კონვერსიული ქოფირაითინგის ექსპერტი. შენი ამოცანაა შეადგინო ელ. წერილების თანმიმდევრული კამპანია (Email Sequence) კონკრეტული ბიზნეს მიზნის მისაღწევად.

- კამპანიის მიზანი: [მაგ. ახალი გამომწერების მისალმება / პროდუქტის გაშვების პრომოცია / მიტოვებული კალათის აღდგენა]
- წერილების რაოდენობა (N): [რიცხვი, მაგ. 3 ან 5]
- სამიზნე აუდიტორია: [ვინ არიან მიმღებები]
- მთავარი შეთავაზება: [რისი პრომოციაც გსურს, მაგ. 20%-იანი ფასდაკლება, უფასო საცდელი პერიოდი]

წესები და ფორმატი:
1. თითოეული წერილისთვის მოგვაწოდე:
   - წერილის გაგზავნის დრო (მაგ. დღე 1, რეგისტრაციიდან 2 დღის შემდეგ).
   - წერილის კონკრეტული მიზანი (Goal).
   - სათაურის (Subject Line) 3 განსხვავებული, ჩამთრევი ვარიანტი.
   - წერილის სრული ტექსტი (Body) — პერსონალიზებული, ჩამთრევი და კარგად სტრუქტურირებული.
2. ააწყე წერილების თანმიმდევრობა ისე, რომ ის ნაბიჯ-ნაბიჯ აშენებდეს ნდობას და ბუნებრივად მიდიოდეს საბოლოო მოწოდებისკენ (CTA).`,
      en: `You are an email marketing strategist and conversion copywriter. Your task is to design a high-converting, automated email sequence of [number] emails to achieve the specified goal.

- Campaign Goal: [e.g. welcoming new subscribers / promoting a webinar / abandoned cart recovery]
- Number of Emails (N): [number, e.g. 3 or 5]
- Target Audience: [who they are]
- Key Offer / Promo: [what you are promoting, e.g. a 20% discount, free trial]

Rules & Format:
1. For each email in the sequence, deliver:
   - Send Timing (e.g. Day 1: immediately upon sign-up, Day 3: 48 hours later).
   - Core Objective (e.g., build authority, handle friction).
   - 3 engaging, click-worthy subject lines.
   - The complete, professionally written email body.
2. Ensure the sequence builds a logical relationship flow, educating and delivering value before driving hard toward the Call to Action (CTA).`,
    },
  },
  {
    id: "pricing",
    category: "business",
    title: "ფასწარმოქმნის იდეები",
    description: "აზროვნებ ფასის ვარიანტებსა და პაკეტებზე.",
    tags: ["ფასი", "სტრატეგია", "პაკეტები"],
    prompt: {
      ka: `შენ ხარ ფასწარმოქმნის სტრატეგიებისა (Pricing Strategy) და ბიზნეს-მოდელების წამყვანი ექსპერტი. შენი ამოცანაა შემომთავაზო ოპტიმალური ფასების სტრუქტურა ჩემი პროდუქტისთვის/სერვისისთვის.

- პროდუქტი / სერვისი: [პროდუქტი / სერვისი]
- ბიზნესის ტიპი: [მაგ. SaaS B2B, ადგილობრივი ფიტნეს დარბაზი, ფრილანს-დიზაინი]
- კონტექსტი: [შენი ხარჯები, მიახლოებითი თვითღირებულება, სამიზნე მომხმარებლის მსყიდველუნარიანობა და კონკურენტების ფასები, თუ ცნობილია]

წესები და ფორმატი:
1. შემომთავარე ფასწარმოქმნის 3 განსხვავებული მოდელი/მიდგომა (მაგ. ღირებულებაზე დაფუძნებული, საფეხურებრივი პაკეტები (Tiered pricing), გამომუშავებაზე დაფუძნებული) თითოეულის დადებითი და უარყოფითი მხარეებით.
2. შექმენი საფეხურებრივი პაკეტების (მაგ. Basic, Pro, Enterprise) კონკრეტული სტრუქტურა — განსაზღვრე, თუ რა სარგებელი და ფუნქციები შევა თითოეულ პაკეტში და რა იქნება მათი ფასთა სხვაობა.
3. მოგვეცი პრაქტიკული გეგმა, თუ როგორ შევამოწმოთ (A/B ტესტირება, გამოკითხვები) შერჩეული ფასი არსებული მომხმარებლების დაკარგვის გარეშე.
4. გაითვალისწინე: ეს არის მხოლოდ იდეების გაზიარება და არ წარმოადგენს ოფიციალურ ფინანსურ ან იურიდიულ რჩევას.`,
      en: `You are a pricing strategy and business model expert. Your task is to design an optimal pricing structure for the specified product or service.

- Product / Service: [product / service]
- Business Model: [e.g. B2B SaaS, local gym, freelance design]
- Context: [costs, target audience purchasing power, and competitor pricing if any]

Rules & Format:
1. Suggest 3 distinct pricing approaches (e.g. value-based, tiered subscription, freemium) with pros and cons for each.
2. Outline a recommended tiered package structure (e.g., Basic, Pro, Premium) defining the features, limits, and pricing ratios for each tier.
3. Provide a practical methodology on how to test these price points (e.g. pre-sales, customer surveys, A/B testing) without losing existing users.
4. Context reminder: This brainstorm is for educational and strategic ideation and does not constitute formal financial advice.`,
    },
  },
  {
    id: "competitor-analysis",
    category: "business",
    title: "კონკურენტების ანალიზი",
    description: "პოულობ ბაზრის ხარვეზს, რომელიც შეგიძლია დაიკავო.",
    tags: ["კონკურენტები", "ანალიზი"],
    prompt: {
      ka: `შენ ხარ ბაზრის კვლევისა და კონკურენტული ანალიზის წამყვანი ექსპერტი. შენი ამოცანაა დამეხმარო ჩემი მთავარი კონკურენტების გაანალიზებაში და ბაზარზე იმ თავისუფალი ნიშის ( Gap) პოვნაში, რომლის დაკავებასაც შევძლებ.

- ჩემი ბიზნესი: [მოკლე აღწერა, რას აკეთებ]
- ძირითადი კონკურენტები: [ჩამოწერე 2-3 მთავარი კონკურენტი, ან მთხოვე დაგეხმარო მათ პოვნაში]
- ინდუსტრია / ნიშა: [სფერო]

წესები და ფორმატი:
1. თითოეული კონკურენტისთვის მოამზადე მოკლე პროფილი:
   - ძირითადი სიძლიერე: რაში არიან საუკეთესოები და რატომ ირჩევენ მათ მომხმარებლები.
   - თვალსაჩინო სისუსტე: მომხმარებელთა ჩივილები, სერვისის ლიმიტები, მაღალი ფასი, მოძველებული ტექნოლოგია ან პროცესები.
2. მოძებნე და აღწერე ბაზარზე არსებული 2 კონკრეტული ხარვეზი — მომხმარებელთა ისეთი დაუკმაყოფილებელი საჭიროებები ან პრობლემები, რომლებსაც ეს კონკურენტები სათანადოდ ვერ პასუხობენ.
3. შეადგინე 3 პრაქტიკული რეკომენდაცია ჩემი დიფერენციაციის სტრატეგიისთვის (Differentiation Strategy) — როგორ გამოვირჩე ბაზარზე და როგორ დავიკავო ნაპოვნი ხარვეზები.`,
      en: `You are a market intelligence and competitive strategy expert. Your task is to analyze my core competitors and identify a market gap I can uniquely own and defend.

- My Business: [brief description of what you do]
- Target Competitors: [list 2-3 main competitors or ask me to name them]
- Industry / Niche: [industry]

Rules & Format:
1. Provide a competitive profile for each competitor highlighting:
   - Core Strengths: What they excel at and why customers choose them.
   - Visible Weaknesses: Common customer complaints, service limitations, high pricing, or outdated tech/processes.
2. Identify 2 concrete market gaps — underserved needs or customer pain points that these competitors are failing to address.
3. Formulate 3 practical recommendations for my differentiation strategy to help my business stand out and capture these gaps.`,
    },
  },
  {
    id: "sales-objections",
    category: "business",
    title: "პასუხი გაყიდვის წინააღმდეგობებზე",
    description: "ამზადებ გულწრფელ პასუხებს მომხმარებლის ეჭვებზე.",
    tags: ["გაყიდვები", "წინააღმდეგობა"],
    prompt: {
      ka: `შენ ხარ გაყიდვების ფსიქოლოგიის, მომხმარებელთან ურთიერთობისა და მოლაპარაკებების წამყვანი ექსპერტი. დამეხმარე შევიმუშაო გულწრფელი, თანამგრძნობი და მაკონვერტირებელი პასუხები გაყიდვების დროს წამოჭრილ წინააღმდეგობებზე.

- პროდუქტი / სერვისი: [პროდუქტი / სერვისი]
- გავრცელებული წინააღმდეგობები: [მაგ. „ძალიან ძვირია“, „ამისთვის დრო არ მაქვს“, „მჭირდება პარტნიორთან შეთანხმება“, „ჯერ არ ვარ მზად“]

წესები და ფორმატი:
1. თითოეული წინააღმდეგობისთვის შექმენი პასუხი შემდეგი 3-ნაბიჯიანი მეთოდით:
   - ემპათია და ვალიდაცია: აჩვენე მომხმარებელს, რომ გესმის მისი და მისი წუხილი აბსოლუტურად ლოგიკურია (ემოციური კავშირის შექმნა).
   - პერსპექტივის შეცვლა / ღირებულების დანახვა: ნაზად დაანახვე პროდუქტის რეალური ღირებულება ან შესთავაზე ალტერნატიული ხედვა (მაგ. ფასის აღქმა როგორც ინვესტიცია და არა ხარჯი).
   - ღია კითხვა: დაასრულე დიალოგის გამგრძელებელი კითხვით, რომელიც აიძულებს მომხმარებელს დაფიქრდეს და გააგრძელოს საუბარი ყოველგვარი იძულების გარეშე.
2. ტონი უნდა იყოს უკიდურესად დამხმარე, პროფესიონალური და გულწრფელი. მოერიდე აგრესიულ მარკეტინგულ კლიშეებს და მომხმარებელზე ზეწოლას.`,
      en: `You are a sales psychology, negotiation, and customer relationship expert. Help me craft empathetic, honest, and high-converting responses to common sales objections.

- Product / Service: [product / service]
- Common Objections: [e.g., "it's too expensive", "I don't have time", "I need to discuss this with my partner", "I'm not ready yet"]

Rules & Format:
1. For each objection, construct a response using a 3-step relationship-building methodology:
   - Empathy & Validation: Acknowledge and validate their concern, showing you sincerely understand their perspective.
   - Reframing / Value Highlight: Gently shift their perspective to focus on the long-term value, ROI, or alternative angles (e.g., viewing price as an investment rather than an expense).
   - Open-Ended Question: End with a low-friction question that encourages dialogue and self-reflection without pressure.
2. The tone must be supportive, collaborative, and professional. Avoid aggressive closing tactics, manipulative copy, or high-pressure pitches.`,
    },
  },

  // ── კარიერა / career ──────────────────────────────────────────────────
  {
    id: "resume-bullets",
    category: "career",
    title: "CV-ს პუნქტების გაუმჯობესება",
    description: "აქცევ სუსტ პუნქტებს გაზომვადი შედეგების ჩვენებად.",
    tags: ["CV", "რეზიუმე"],
    prompt: {
      ka: `შენ ხარ კარიერული ქოუჩი და HR კონსულტანტი. შენი ამოცანაა გააუმჯობესო ქვემოთ მოცემული CV-ს პუნქტები (Resume Bullet Points) ისე, რომ ისინი შთამბეჭდავად წარმოაჩენდნენ ჩემს მიღწევებსა და შედეგებს.

ამჟამინდელი პუნქტები:
[ჩასვი შენი პუნქტები]

სამიზნე ვაკანსია / თანამდებობა: [თანამდებობა]

წესები და ფორმატი:
1. გადაწერე თითოეული პუნქტი ისე, რომ ის იწყებოდეს ძლიერი სამოქმედო ზმნით (მაგ. „დავნერგე“, „გავზარდე“, „ოპტიმიზაცია მოვახდინე“).
2. გამოიყენე Google-ის XYZ მეთოდოლოგია (მივაღწიე [X]-ს, რაც გაიზომა [Y]-ით, [Z] აქტივობის განხორციელებით) — აჩვენე გაზომვადი შედეგები და გავლენა ბიზნესზე.
3. მოარგე პუნქტები სამიზნე პოზიციის ძირითად მოთხოვნებს.
4. თუ რომელიმე პუნქტს აკლია გაზომვადი დეტალები, პასუხის ბოლოს მონიშნე ისინი და მიუთითე, თუ რა ტიპის ციფრები/მონაცემები უნდა ჩაემატოს იქ რეალისტურობისთვის.`,
      en: `You are an expert resume writer and career coach. Your task is to rewrite the provided resume bullet points to showcase accomplishments and business impact in a powerful way.

Current Bullet Points:
[paste your bullet points]

Role I'm applying for: [job title]

Rewrite each to start with a strong action verb, show measurable impact, and match the target role. Tell me which ones need numbers I should add.`,
    },
  },
  {
    id: "cover-letter",
    category: "career",
    title: "სამოტივაციო წერილი",
    description: "წერ კონკრეტულ, გულწრფელ წერილს — არა ზოგადს.",
    tags: ["სამოტივაციო", "წერილი"],
    prompt: {
      ka: `შენ ხარ პროფესიონალი რეკრუტერი და კარიერული კონსულტანტი. შენი ამოცანაა დაწერო პერსონალიზებული, დამარწმუნებელი და გულწრფელი სამოტივაციო წერილი მოცემული დეტალების საფუძველზე.

- ვაკანსია: [თანამდებობა] კომპანიაში [კომპანია]
- ჩემი გამოცდილება და უნარები: [მოკლე აღწერა ან ჩასვი CV-ს მონახაზი]
- რატომ მინდა ამ კომპანიაში მუშაობა: [რა გიზიდავს მათ კულტურაში, მისიაში ან პროდუქტში]
- ვაკანსიის ძირითადი მოთხოვნები: [ჩასვი 2-3 მთავარი მოთხოვნა]

წესები და ფორმატი:
1. წერილი უნდა იყოს კარგად სტრუქტურირებული (მისალმება, ძლიერი შესავალი, გამოცდილების კავშირი კომპანიის საჭიროებებთან, დასკვნა და CTA) და მისი მოცულობა არ უნდა აღემატებოდეს ერთ გვერდს.
2. აარიდე თავი შაბლონურ, ზოგად და ბანალურ ფრაზებს (მაგ. „მოტივირებული პროფესიონალი“).
3. წერილის ტონი უნდა იყოს ენერგიული, გულწრფელი და თავდაჯერებული. აჩვენე კომპანიის ღრმა ცოდნა და ინტერესი.`,
      en: `Write a cover letter for the [job title] position at [company].

- My background: [key experience and skills]
- Why this company: [what attracts you]
- Job requirements: [paste the key requirements]

Keep it to one page, specific, and genuine — not generic. Connect my experience to their needs.`,
    },
  },
  {
    id: "interview-prep",
    category: "career",
    title: "გასაუბრებისთვის მომზადება",
    description: "ვარჯიშობ სავარაუდო კითხვებსა და ძლიერ პასუხებზე.",
    tags: ["გასაუბრება", "ინტერვიუ"],
    prompt: {
      ka: `შენ ხარ ტექნიკური რეკრუტერი და გამოცდილი ინტერვიუერი. შენი ამოცანაა მოამზადო კანდიდატი გასაუბრებისთვის მითითებულ როლზე.

- თანამდებობა: [თანამდებობა]
- კომპანიის პროფილი / სფერო: [მაგ. EdTech სტარტაპი, SaaS B2B]

წესები და ფორმატი:
1. ჩამოწერე 10 ყველაზე სავარაუდო და აქტუალური კითხვა (მათ შორის ქცევითი/სიტუაციური კითხვები), რომლებიც ამ გასაუბრებაზე შეიძლება დაგისვან.
2. თითოეულ კითხვაზე მოკლედ განმარტე, თუ რას ეძებს/ამოწმებს რეალურად ინტერვიუერი ამ შეკითხვით (Behind the Question).
3. მოგვეცი მკაფიო სტრუქტურული ჩარჩო (მაგ. STAR მეთოდი) თითოეულ ტიპის კითხვაზე ძლიერი პასუხის ასაგებად.
4. ბოლოს შემომთავაზე საცდელი, იმიტირებული გასაუბრების (Mock Interview) ჩატარება ინტერაქციულ რეჟიმში.`,
      en: `Help me prepare for a job interview for [job title].

Give me: 10 likely interview questions for this role, what the interviewer is really looking for in each, and a framework for structuring strong answers. Then offer to run a mock interview.`,
    },
  },
  {
    id: "linkedin-about",
    category: "career",
    title: "LinkedIn-ის „About“ სექცია",
    description: "წერ ჩამთრევ პროფილს, რომელიც კაუჭით იწყება.",
    tags: ["LinkedIn", "პროფილი"],
    prompt: {
      ka: `შენ ხარ პერსონალური ბრენდინგისა და კარიერული მარკეტინგის წამყვანი ექსპერტი. შენი ამოცანაა დაწერო ჩამთრევი და ოპტიმიზებული LinkedIn-ის „About“ სექცია.

- ჩემი როლი / სფერო: [რას აკეთებ]
- გამოცდილება და ძლიერი მხარეები: [ძირითადი პუნქტები, უნარები, მიღწევები]
- კარიერული მიზანი / რა მინდა შემდეგ: [კარიერული მიზანი, მაგ. ახალი გამოწვევები, პარტნიორობა]
- ტონი: [მაგ. პროფესიული, მაგრამ ცოცხალი და ადამიანური]

წესები და ფორმატი:
1. დაწერე პირველ პირში (First Person), რათა შეიქმნას პირადი საუბრის ეფექტი.
2. დაიწყე ძალიან ძლიერი ყურადღების მიმქცევი წინადადებით (Hook), რომელიც მკითხველს ღილაკზე „See more“ დააჭერინებს (მოერიდე მშრალი თანამდებობის პირდაპირ დასახელებას).
3. ტექსტი უნდა იყოს მაქსიმალურად მარტივად წასაკითხი და სკანირებადი: გამოიყენე მოკლე აბზაცები და პუნქტებიანი (მარკირებული) სიები.
4. ბოლოში დაამატე მკაფიო მოწოდება მოქმედებისკენ (CTA, მაგ. „დამიკავშირდით ელ. ფოსტაზე ან მომწერეთ აქ“).`,
      en: `Write a LinkedIn "About" section for me.

- My role / field: [what you do]
- Experience and strengths: [key points]
- What I want next: [career goal]
- Tone: [professional but human]

Make it first-person, engaging, and easy to skim. Start with a hook, not a job title.`,
    },
  },
  {
    id: "salary-negotiation",
    category: "career",
    title: "ხელფასზე მოლაპარაკება",
    description: "ამზადებ სტრატეგიასა და ზუსტ ფრაზებს მოლაპარაკებისთვის.",
    tags: ["ხელფასი", "მოლაპარაკება"],
    prompt: {
      ka: `შენ ხარ მოლაპარაკებების წამყვანი ექსპერტი და კარიერული კონსულტანტი. შენი ამოცანაა შეიმუშაო ხელფასზე მოლაპარაკების ინდივიდუალური სტრატეგია და ზუსტი ფრაზები სასურველი შედეგის მისაღებად.

- პოზიცია: [თანამდებობა]
- ამჟამინდელი / შემოთავაზებული ხელფასი: [თანხა]
- ჩემი სამიზნე ხელფასი: [თანხა]
- ჩემი უპირატესობა / არგუმენტები: [მიღწევები, გამოცდილება, სხვა სამუშაო შემოთავაზებები]

წესები და ფორმატი:
1. შეიმუშავე ნაბიჯ-ნაბიჯ მოლაპარაკების სტრატეგია, დაფუძნებული ორმხრივად მომგებიან (Win-Win) პრინციპზე.
2. მომეცი ზუსტი, პროფესიონალური და დიპლომატიური ფრაზები/სკრიპტები საუბრის დასაწყებად და ჩემი მოთხოვნის დასასაბუთებლად.
3. მოამზადე სამოქმედო გეგმა და პასუხები იმ შემთხვევისთვის, თუ დამსაქმებელი უარს მეტყვის სასურველ ხელფასზე (ალტერნატიული კომპენსაციები: ბონუსები, წილი, დამატებითი დასვენების დღეები).`,
      en: `Help me prepare to negotiate my salary.

- Role: [job title]
- Current / offered salary: [amount]
- My target: [amount]
- My leverage: [achievements, other offers, skills in demand]

Give me a negotiation strategy, the exact phrasing to open with, and how to respond if they say no.`,
    },
  },
  {
    id: "professional-bio",
    category: "career",
    title: "პროფესიული ბიო",
    description: "იღებ ბიოს 3 ვერსიად — წინადადებიდან სრულ აბზაცამდე.",
    tags: ["ბიო", "bio"],
    prompt: {
      ka: `შენ ხარ პიარისა და პროფესიული მარკეტინგის ექსპერტი. შენი ამოცანაა დაწერო პროფესიული ბიოგრაფია (Bio) მესამე პირში.

- სახელი და როლი: [შენი სახელი, რას აკეთებ]
- მთავარი მიღწევები / გამოცდილება: [მიღწევები, კარიერული გზა, განათლება]
- გამოყენების ადგილი: [მაგ. პირადი საიტი, კონფერენციის სპიკერის პანელი, კომპანიის გვერდი]

წესები და ფორმატი:
1. დაწერე ბიოგრაფია მესამე პირში (Third Person).
2. წარმოადგინე 3 განსხვავებული ვერსია სხვადასხვა გამოყენებისთვის:
   - ერთწინადადებიანი (Micro Bio) — სოციალური ქსელებისთვის.
   - მოკლე ვერსია (1 მოკლე აბზაცი) — სპიკერად წარდგენისთვის.
   - სრული ვერსია (2-3 აბზაცი) — კომპანიის ვებსაიტისთვის ან პორტფოლიოსთვის.
3. ტონი უნდა იყოს ავტორიტეტული, დამარწმუნებელი, მაგრამ ამავე დროს თავმდაბალი და პროფესიონალური.`,
      en: `Write a short professional bio for me.

- Name and role: [your name, what you do]
- Highlights: [key achievements, experience]
- Use it for: [website / speaker intro / social profile]

Give me 3 versions: one-sentence, short paragraph, and full paragraph. Write it in third person.`,
    },
  },

  // ── პროდუქტიულობა / productivity ──────────────────────────────────────
  {
    id: "plan-day",
    category: "productivity",
    title: "დღის დაგეგმვა",
    description: "იღებ რეალისტურ, დროში გაწერილ გრაფიკს.",
    tags: ["დაგეგმვა", "დღე"],
    prompt: {
      ka: `შენ ხარ დროის მენეჯმენტისა და პერსონალური პროდუქტიულობის წამყვანი ექსპერტი. შენი ამოცანაა დამეხმარო დღის ეფექტურად და რეალისტურად დაგეგმვაში.

- შესასრულებელი დავალებები: [ჩამოწერე დავალებები, სასურველია ვადებითა და სავარაუდო ხანგრძლივობით]
- ხელმისაწვდომი დრო: [საათების რაოდენობა, მაგ. 8 საათი]
- დღევანდელი მთავარი პრიორიტეტი: [ერთი რამ, რაც ყველაზე მნიშვნელოვანია დღეს]

წესები და ფორმატი:
1. შექმენი დროში გაწერილი დღის გრაფიკი (Time-Blocking) — დაყავი დღე კონკრეტულ საათობრივ ბლოკებად.
2. გამოყავი დრო ენერგიის აღსადგენად (მცირე შესვენებები, ლანჩი) და დაგეგმე ყველაზე რთული საქმეები იმ დროს, როდესაც პროდუქტიულობა პიკშია.
3. მონიშნე „სარეზერვო დრო“ გაუთვალისწინებელი შემთხვევებისთვის.
4. მოგვეცი რეკომენდაცია, თუ რა დავალება შეგვიძლია გადავიტანოთ ხვალისთვის ან საერთოდ გამოვტოვოთ, თუ დრო არ გვეყოფა.`,
      en: `Help me plan my day.

Tasks I need to do: [list them, with deadlines if any]
Time available: [hours]
My top priority today: [the one thing that matters most]

Give me a realistic time-blocked schedule, mark what to do first, and tell me what to drop if I run out of time.`,
    },
  },
  {
    id: "meeting-notes",
    category: "productivity",
    title: "შეხვედრის ჩანაწერების შეჯამება",
    description: "აქცევ არეულ ჩანაწერებს მკაფიო ქმედებებად.",
    tags: ["შეხვედრა", "ჩანაწერები"],
    prompt: {
      ka: `შენ ხარ ბიზნეს-ანალიზისა და კორპორაციული პროდუქტიულობის ექსპერტი. შენი ამოცანაა აქციო არასტრუქტურირებული და არეული შეხვედრის ჩანაწერები მკაფიო, ორგანიზებულ და სამოქმედო დოკუმენტად.

შეხვედრის ჩანაწერები:
[ჩასვი შენი ჩანაწერები]

წესები და ფორმატი:
1. მოამზადე შეხვედრის მოკლე შეჯამება (Executive Summary) — მაქსიმუმ 2-3 წინადადება.
2. ჩამოაყალიბე შეხვედრაზე მიღებული ძირითადი გადაწყვეტილებები (Key Decisions).
3. შექმენი სამოქმედო პუნქტების (Action Items) ცხრილი სვეტებით: დავალება | პასუხისმგებელი პირი | შესრულების ვადა.
4. ცალკე მონიშნე საკითხები, რომლებიც დარჩა ბუნდოვანი ან საჭიროებს დამატებით დაზუსტებას/განხილვას მომდევნო შეხვედრაზე.`,
      en: `Turn the messy meeting notes below into a clean summary.

[paste your notes]

Give: a short summary, key decisions, and action items in a table (Task | Owner | Deadline). Flag anything that was left unclear.`,
    },
  },
  {
    id: "decision-matrix",
    category: "productivity",
    title: "გადაწყვეტილების მატრიცა",
    description: "აწონ-დაწონავ ვარიანტებს მკაფიო კრიტერიუმებით.",
    tags: ["გადაწყვეტილება"],
    prompt: {
      ka: `შენ ხარ სტრატეგიული აზროვნებისა და გადაწყვეტილებების ანალიზის წამყვანი ექსპერტი. შენი ამოცანაა დამეხმარო რთული გადაწყვეტილების მიღებაში ობიექტური კრიტერიუმების აწონ-დაწონვის საფუძველზე.

- გადაწყვეტილება, რომელიც უნდა მივიღო: [აღწერე გადაწყვეტილება]
- ჩემი ალტერნატივები / ვარიანტები: [ჩამოწერე ვარიანტები]
- ჩემთვის მნიშვნელოვანი ფაქტორები (კრიტერიუმები): [მაგ. ფასი, შესრულების დრო, რისკები, გრძელვადიანი პოტენციალი]

წესები და ფორმატი:
1. შექმენი გადაწყვეტილების მიღების Markdown მატრიცა/ცხრილი: შეაფასე თითოეული ვარიანტი თითოეულ კრიტერიუმთან მიმართებაში 1-დან 5-მდე შკალით (სადაც 5 საუკეთესოა).
2. დეტალურად აღწერე თითოეული ვარიანტის ძირითადი დადებითი და უარყოფითი მხარეები (Trade-offs).
3. პასუხის ბოლოს მოგვეცი შენი დასაბუთებული რეკომენდაცია, თუ რომელი ვარიანტია ოპტიმალური ამ მონაცემების საფუძველზე და რატომ.`,
      en: `Help me make a decision: [describe the decision].

My options: [list them]
What matters to me: [criteria, e.g. cost, time, risk, long-term value]

Compare the options against my criteria in a table, weigh the trade-offs, and give a recommendation with the reasoning.`,
    },
  },
  {
    id: "brainstorm",
    category: "productivity",
    title: "იდეების შტურმი",
    description: "იღებ 15 იდეას — უსაფრთხოს და თამამს ერთად.",
    tags: ["იდეები", "brainstorm"],
    prompt: {
      ka: `შენ ხარ კრეატიული აზროვნებისა და ინოვაციების წამყვანი ფასილიტატორი. შენი ამოცანაა მომაწოდო მრავალფეროვანი და არასტანდარტული იდეების ნაკრები ჩემი გამოწვევისთვის.

- გამოწვევა / მიზანი: [აღწერე რისთვის გჭირდება იდეები]
- კონტექსტი და შეზღუდვები: [ბიუჯეტი, ფორმატი, აუდიტორია და ა.შ.]

წესები და ფორმატი:
1. მოგვაწოდე 15 სრულიად განსხვავებული იდეა.
2. იდეები დაყავი 3 კატეგორიად:
   - უსაფრთხო და მარტივად განხორციელებადი (Safe & Easy)
   - საშუალო სირთულის, მაგრამ მაღალი გავლენის მქონე (High-Impact)
   - თამამი, არასტანდარტული და კრეატიული (Bold & Wild)
3. პასუხის ბოლოს აირჩიე 3 საუკეთესო იდეა და მოკლედ დაასაბუთე, თუ რატომ აქვთ მათ ყველაზე დიდი პოტენციალი.`,
      en: `Brainstorm ideas for: [your challenge or goal].

Context: [any relevant constraints or details].

Give me 15 ideas — mix safe, practical ones with a few bold, unconventional ones. Then pick the 3 you think are strongest and explain why.`,
    },
  },
  {
    id: "break-down-task",
    category: "productivity",
    title: "რთული დავალების დაშლა",
    description: "ანაწევრებ დიდ პროექტს მართვად ნაბიჯებად.",
    tags: ["დავალება", "დაგეგმვა"],
    prompt: {
      ka: `შენ ხარ პროექტების მართვისა და სამუშაო პროცესების (Workflows) ოპტიმიზაციის წამყვანი ექსპერტი. შენი ამოცანაა დაშალო დიდი, რთული დავალება მარტივად შესასრულებელ ნაბიჯებად.

- რთული დავალება / პროექტი: [აღწერე დავალება]
- ვადა (Deadline): [ვადა, მაგ. 2 კვირა]
- რესურსები / ინსტრუმენტები: [თუ არის]

წესები და ფორმატი:
1. დაყავი პროექტი ეტაპებად (Phases) და თითოეული ეტაპის შიგნით ჩამოაყალიბე კონკრეტული, მცირე დავალებები (Subtasks).
2. თითოეულ დავალებას მიანიჭე სირთულის დონე (დაბალი / საშუალო / მაღალი) და სავარაუდო დრო.
3. ნათლად განსაზღვრე დამოკიდებულებები (Dependencies) დავალებებს შორის (რა უნდა დასრულდეს, სანამ მეორე დაიწყებოდეს).
4. გამოყავი პირველი, ყველაზე მარტივი და მაღალი პრიორიტეტის მქონე ნაბიჯი (Quick Win), რომელიც დღესვე შემიძლია გავაკეთო დასაწყებად.`,
      en: `Break the following big task into smaller, manageable steps.

Task: [describe the project or goal]
Deadline: [when it's due]

Give an ordered list of steps, estimate the effort for each, mark dependencies, and identify the first step I should do today.`,
    },
  },
  {
    id: "email-reply",
    category: "productivity",
    title: "სწრაფი პასუხი ელ. ფოსტაზე",
    description: "ადგენ მოკლე, ნათელ პასუხს მიღებულ წერილზე.",
    tags: ["ელ. ფოსტა", "პასუხი"],
    prompt: {
      ka: `შენ ხარ პროფესიული კომუნიკაციისა და ეტიკეტის ექსპერტი. შენი ამოცანაა დამიწერო მოკლე, ეფექტური და მკაფიო პასუხი მიღებულ ელ. წერილზე.

მიღებული ელ. წერილი:
„[ჩასვი წერილი]“

- რა მინდა რომ ვუპასუხო: [შენი მთავარი სათქმელი / გადაწყვეტილება]
- ტონი: [მაგ. საქმიანი და თავაზიანი / მეგობრული / მკაცრი და დიპლომატიური]

წესები და ფორმატი:
1. შემოგვთავაზე პასუხის 2 განსხვავებული ვარიანტი:
   - ვარიანტი A: მაქსიმალურად მოკლე, ლაკონური და პირდაპირი.
   - ვარიანტი B: უფრო თბილი, დეტალური და კავშირის დამყარებაზე ორიენტირებული.
2. პასუხები უნდა იყოს აბსოლუტურად გამართული, თავაზიანი და შეესაბამებოდეს ბიზნეს-კომუნიკაციის წესებს.`,
      en: `Draft a reply to the email below.

Email I received:
"[paste the email]"

What I want to say: [your main point]
Tone: [polite / brief / firm]

Keep it short and clear. Give me 2 options — one warmer, one more direct.`,
    },
  },

  // ── ანალიზი და მონაცემები / data ──────────────────────────────────────
  {
    id: "spreadsheet-formula",
    category: "data",
    title: "Excel / Sheets ფორმულა",
    description: "წერთ ფორმულებს კონკრეტული გამოთვლებისთვის.",
    tags: ["excel", "sheets", "ფორმულა"],
    prompt: {
      ka: `შენ ხარ მონაცემთა ანალიზისა და ცხრილების (Excel და Google Sheets) წამყვანი ექსპერტი. შენი ამოცანაა შეადგინო ზუსტი და ოპტიმალური ფორმულა ჩემი ამოცანის გადასაჭრელად.

- მონაცემთა სტრუქტურა: [აღწერე შენი სვეტები, სტრიქონები და მონაცემთა ტიპები]
- რა მინდა გამოვთვალო / მივიღო: [აღწერე საბოლოო მიზანი]
- პლატფორმა: [Excel / Google Sheets]

წესები და ფორმატი:
1. მოგვეცი მზა, სამუშაო ფორმულა.
2. ნაბიჯ-ნაბიჯ, მარტივი ენით ახსენი, თუ როგორ მუშაობს ფორმულის თითოეული ფუნქცია და არგუმენტი.
3. მიუთითე სასაზღვრო შემთხვევები (Edge Cases, მაგ. ცარიელი უჯრები, შეცდომები, არასწორი მონაცემები) და როგორ ავიცილოთ ისინი თავიდან (მაგ. IFERROR-ის გამოყენებით).`,
      en: `Write a spreadsheet formula for [Excel / Google Sheets].

What I have: [describe your columns and data]
What I want to calculate: [describe the result]

Give the formula, explain how it works, and mention any edge cases (empty cells, errors) I should handle.`,
    },
  },
  {
    id: "sql-query",
    category: "data",
    title: "SQL მოთხოვნა",
    description: "თარგმნი ჩვეულებრივ აღწერას მუშა SQL მოთხოვნად.",
    tags: ["SQL", "მონაცემები", "ბაზა"],
    prompt: {
      ka: `შენ ხარ მონაცემთა ბაზების Senior ადმინისტრატორი და SQL-ის წამყვანი დეველოპერი. შენი ამოცანაა დაწერო ოპტიმალური, სწრაფი და უსაფრთხო SQL მოთხოვნა.

- ბაზის სქემა და ცხრილები: [აღწერე შენი ცხრილები, სვეტები და კავშირები / Primary-Foreign keys]
- რა მონაცემები მჭირდება ბაზიდან: [აღწერე სასურველი შედეგი]
- SQL დიალექტი: [მაგ. PostgreSQL, MySQL, MS SQL, SQLite]

წესები და ფორმატი:
1. დაწერე გამართული და სუფთა SQL კოდი სწორი ინდენტაციით.
2. ნაბიჯ-ნაბიჯ ახსენი მოთხოვნის თითოეული ნაწილის (მაგ. JOIN-ები, GROUP BY, ფილტრები) დანიშნულება.
3. შემომთავარე რჩევები წარმადობის ოპტიმიზაციისთვის (მაგ. რომელი ინდექსების შექმნა გააუმჯობესებს ამ მოთხოვნის მუშაობას).`,
      en: `Write an SQL query for the following.

Tables and columns: [describe your schema]
What I need: [describe the result you want]

Give the query, explain each part, and suggest an index if it would help performance.`,
    },
  },
  {
    id: "interpret-data",
    category: "data",
    title: "მონაცემების ინტერპრეტაცია",
    description: "ხვდები, რას გეუბნება ციფრები და რა გააკეთო შემდეგ.",
    tags: ["ანალიზი", "მონაცემები"],
    prompt: {
      ka: `შენ ხარ მონაცემთა წამყვანი ანალიტიკოსი და ბიზნეს-სტრატეგი. შენი ამოცანაა გააანალიზო ქვემოთ მოცემული მონაცემები და დამეხმარო მათგან რეალური ბიზნეს-ღირებულების მქონე დასკვნების გამოტანაში.

მონაცემები:
[ჩასვი მონაცემები, ცხრილი ან ციფრები]

კონტექსტი / მიზანი: [ბიზნესის სფერო, რისი გაგება გსურს]

წესები და ფორმატი:
1. ნათლად და წაკითხვად ჩამოაყალიბე:
   - მთავარი ტენდენციები და კანონზომიერებები, რომლებიც მონაცემებში ვლინდება.
   - ნებისმიერი ანომალია, უჩვეულო გადახრა ან მოულოდნელი ციფრი (Outliers).
   - ამ ტენდენციების სავარაუდო ბიზნეს-გამომწვევი მიზეზები.
2. მკაფიოდ გამიჯნე ერთმანეთისგან მყარი ფაქტები და შენი ლოგიკური დაშვებები/ჰიპოთეზები.
3. ჩამოწერე 3 კონკრეტული სამოქმედო რეკომენდაცია (Actionable Insights) ამ ანალიზზე დაყრდნობით.`,
      en: `Help me interpret the data below.

[paste your numbers / table]

Tell me: what stands out, possible reasons behind the patterns, what questions the data raises, and what I should look at next. Be clear about what is fact vs. assumption.`,
    },
  },
  {
    id: "data-cleaning",
    category: "data",
    title: "ცხრილის გასუფთავება",
    description: "იღებ ნაბიჯ-ნაბიჯ გეგმას არეული მონაცემების მოსაწესრიგებლად.",
    tags: ["მონაცემები", "გასუფთავება"],
    prompt: {
      ka: `შენ ხარ მონაცემთა ინჟინერიის და ხარისხის კონტროლის ექსპერტი. შენი ამოცანაა შეიმუშაო არეული მონაცემთა ბაზის/ცხრილის გასუფთავების დეტალური და უსაფრთხო სტრატეგია.

- მონაცემთა პრობლემები: [აღწერე პრობლემები, მაგ. დუბლიკატი სტრიქონები, არათანმიმდევრული ფორმატები, ცარიელი უჯრები]
- ინსტრუმენტი: [Excel / Google Sheets / Python (Pandas) / SQL]

წესები და ფორმატი:
1. შექმენი მონაცემების გასუფთავების ნაბიჯ-ნაბიჯ, უსაფრთხო გეგმა (Data Cleaning Pipeline).
2. თითოეული ნაბიჯისთვის მიუთითე კონკრეტული მეთოდი, ფუნქცია ან კოდის ნაწყვეტი მითითებულ ინსტრუმენტში.
3. ახსენი, როგორ ავიცილოთ თავიდან მონაცემების შემთხვევითი დაკარგვა ან დაზიანება გასუფთავების პროცესში.`,
      en: `I have a messy dataset. Help me clean it.

Description of the data and its problems: [e.g. duplicates, inconsistent formats, missing values]

Give me a step-by-step cleaning plan, and for each step, the formula or method to use in [Excel / Sheets / Python].`,
    },
  },
  {
    id: "choose-chart",
    category: "data",
    title: "დიაგრამის შერჩევა",
    description: "ირჩევ სწორ ვიზუალიზაციას შენი მესიჯისთვის.",
    tags: ["დიაგრამა", "ვიზუალიზაცია"],
    prompt: {
      ka: `შენ ხარ მონაცემთა ვიზუალიზაციისა და პრეზენტაციის წამყვანი ექსპერტი. შენი ამოცანაა შემირჩიო ოპტიმალური დიაგრამის ტიპი ჩემი მონაცემების საუკეთესოდ წარსადგენად.

- ჩემი მონაცემები და მესიჯი: [აღწერე რისი ჩვენება გსურს, მაგ. გაყიდვების ზრდა წლების მიხედვით, ბაზრის წილი]
- სამიზნე აუდიტორია: [ვინ ნახავს ამ ვიზუალიზაციას, მაგ. ინვესტორები, გუნდის წევრები]

წესები და ფორმატი:
1. შემომთავარე 1-2 ყველაზე შესაფერისი დიაგრამის ტიპი (მაგ. Bar chart, Line chart, Scatter plot) და დეტალურად დაასაბუთე შენი არჩევანი.
2. მოგვეცი დიზაინისა და გაფორმების 3 რეკომენდაცია (ფერები, ლეგენდა, აქცენტები), რათა დიაგრამა იყოს მაქსიმალურად გასაგები და ეფექტური.
3. ნათლად მიუთითე, თუ რა შეცდომებს ან ვიზუალურ ხრიკებს უნდა ავარიდოთ თავი, რათა დიაგრამამ შეცდომაში არ შეიყვანოს მკითხველი.`,
      en: `Help me choose the right chart.

What I want to show: [describe your data and the message]
Audience: [who will see it]

Recommend the best chart type, explain why, and tell me what to avoid so the chart is not misleading.`,
    },
  },
  {
    id: "ab-test",
    category: "data",
    title: "A/B ტესტის შედეგების ახსნა",
    description: "ხვდები, რომელმა ვერსიამ მოიგო — და მნიშვნელოვანია თუ არა.",
    tags: ["A/B", "ტესტი", "კონვერსია"],
    prompt: {
      ka: `შენ ხარ მონაცემთა ანალიტიკოსი და სტატისტიკის ექსპერტი. შენი ამოცანაა შეფასო ჩემი A/B ტესტის შედეგები და დამეხმარო მათი სტატისტიკური მნიშვნელობის გაგებაში.

ტესტის მონაცემები:
- ვერსია A (საკონტროლო): [ვიზიტორები / კონვერსიები, მაგ. 1000 ვიზიტორი, 50 კონვერსია]
- ვერსია B (საცდელი): [ვიზიტორები / კონვერსიები, მაგ. 1020 ვიზიტორი, 75 კონვერსია]
- ტესტის მიზანი: [რას ამოწმებდი]

წესები და ფორმატი:
1. გამოთვალე კონვერსიის პროცენტული მაჩვენებელი (Conversion Rate) თითოეული ვერსიისთვის და მათ შორის პროცენტული სხვაობა.
2. მარტივი ენით აგვიხსენი, არის თუ არა სხვაობა სტატისტიკურად მნიშვნელოვანი (Statistically Significant) და შეიძლება თუ არა ეს იყოს უბრალო შემთხვევითობა (განმარტე p-value-ს კონცეფცია ამ კონტექსტში).
3. მოგვეცი მკაფიო ბიზნეს-რეკომენდაცია: უნდა დავნერგოთ ვერსია B, გავაგრძელოთ ტესტირება, თუ დავბრუნდეთ ვერსია A-ზე.`,
      en: `Help me understand my A/B test results.

- Version A: [conversions / visitors]
- Version B: [conversions / visitors]
- Goal of the test: [what you were testing]

Tell me which version performed better, whether the difference looks meaningful or could be random, and what I should do next.`,
    },
  },
];
