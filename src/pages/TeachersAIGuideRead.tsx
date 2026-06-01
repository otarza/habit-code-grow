import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Check,
  Clipboard,
  GraduationCap,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";
import bitcampLogo from "@/assets/bitcamp-logo-main.png";

const TEACHER_GUIDE_API_URL =
  import.meta.env.VITE_TEACHER_GUIDE_API_URL ||
  "https://us-central1-bitcamp-flitt.cloudfunctions.net/teacher-guide-api";

const TEACHERS_GUIDE_READ_PATH = "/teachers-ai-guide/read";

type GuideExample = {
  title: string;
  parameters?: string;
  prompt: string;
  result: string;
};

type GuideSection = {
  id: string;
  number: string;
  title: string;
  why: string;
  structureLabel: string;
  structure: string;
  examplesIntro: string;
  examples: GuideExample[];
};

const introParagraphs = [
  'თუ ამ დოკუმენტს კითხულობთ, ეს სცენარი ალბათ კარგად გეცნობათ: სკოლაში დამღლელი დღის შემდეგ სახლში ბრუნდებით და იწყება თქვენი მეორე, "უხილავი" ცვლა. ნაშრომების გასწორება, ტესტების შედგენა, შემდეგი დღის გაკვეთილის დაგეგმვა და სლაიდების აწყობა ხშირად გაკარგვინებთ საღამოებს და შაბათ-კვირასაც კი.',
  "თქვენი მთავარი მისია მოსწავლეებისთვის ცოდნის, შთაგონებისა და მოტივაციის გაზიარებაა და არა ეროვნული სასწავლო გეგმის (ესგ) მოთხოვნების დასაკმაყოფილებელ დაუსრულებელ ქაღალდომანიასა და რუტინაში ჩაძირვა.",
  "ხელოვნური ინტელექტი (AI) არ არის აქ იმისთვის, რომ ჩაგანაცვლოთ — ის არის თქვენი პირადი, დაუღალავი ასისტენტი, რომელიც მზადაა, ბიუროკრატიული და სტრუქტურული სამუშაოს 80% საკუთარ თავზე აიღოს. ამ გზამკვლევში გაგიზიარებთ 6 უძლიერეს შაბლონს (Prompt). მათი დახმარებით, იმ საქმეს, რასაც აქამდე 3 საათი სჭირდებოდა, 15 წუთში დაასრულებთ.",
];

const guideSections: GuideSection[] = [
  {
    id: "lesson-plan",
    number: "1",
    title: "გაკვეთილის ინტერაქტიული გეგმის გენერატორი (დროის მენეჯმენტით)",
    why:
      "რატომ არის ეს ღირებული: გაკვეთილის გეგმის დაწერა ხშირად ფორმალური პროცესია, რომელიც ესგ-ს სტანდარტებს უნდა მოერგოს. ეს შაბლონი არა მხოლოდ ავსებს ფორმალობას, არამედ გთავაზობთ კრეატიულ იდეებს, სადაც ყოველი წუთი გათვლილია.",
    structureLabel: "ძირითადი სტრუქტურა:",
    structure:
      '"წარმოიდგინე, რომ ხარ გამოცდილი [ჩასვი საგანი] მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: [ჩასვი თემა]. სამიზნე აუდიტორია არის [ჩასვი კლასი] კლასი.\n\nგეგმაში გაწერე:\n1. დროის ზუსტი განაწილება (წუთების მიხედვით);\n2. ორი ინტერაქტიული აქტივობა მოსწავლეების ჩასართავად (რომელიც არ საჭიროებს რთულ რესურსებს);\n3. სამი შემაჯამებელი, კრიტიკული აზროვნების განმავითარებელი კითხვა გაკვეთილის ბოლოსთვის."',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (მათემატიკა):",
        parameters: "პარამეტრები: თემა - პროცენტები და ფასდაკლებები; კლასი - მე-6.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი მათემატიკის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: პროცენტები და ფასდაკლებები. სამიზნე აუდიტორია არის მე-6 კლასი.\n\nგეგმაში გაწერე:\n1. დროის ზუსტი განაწილება (წუთების მიხედვით);\n2. ორი ინტერაქტიული აქტივობა მოსწავლეების ჩასართავად (რომელიც არ საჭიროებს რთულ რესურსებს);\n3. სამი შემაჯამებელი, კრიტიკული აზროვნების განმავითარებელი კითხვა გაკვეთილის ბოლოსთვის."',
        result:
          'შედეგი: AI დაგიგეგმავთ აქტივობას "შოპინგი თბილისი მოლში", სადაც მოსწავლეებს დაურიგდებათ წარმოსახვითი ბიუჯეტი და მოუწევთ რეალურ მაღაზიებში 20%-იანი და 50%-იანი ფასდაკლებების გამოთვლა.',
      },
      {
        title: "მაგალითი 2 (ქართული ენა და ლიტერატურა):",
        parameters: 'პარამეტრები: თემა - ვაჟა-ფშაველას "ალუდა ქეთელაური"; კლასი - მე-10.',
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი ქართული ენისა და ლიტერატურის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: ვაჟა-ფშაველას "ალუდა ქეთელაური" - ტრადიციისა და ინდივიდის დაპირისპირება. სამიზნე აუდიტორია არის მე-10 კლასი.\n\nგეგმაში გაწერე:\n1. დროის ზუსტი განაწილება;\n2. ორი ინტერაქტიული აქტივობა;\n3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: AI შემოგთავაზებთ კლასში "სასამართლო პროცესის" სიმულაციას, სადაც მოსწავლეთა ერთი ნაწილი თემის უხუცესების როლს მოირგებს, მეორე კი – ალუდას პოზიციას დაიცავს.',
      },
      {
        title: "მაგალითი 3 (საქართველოს ისტორია):",
        parameters: "პარამეტრები: თემა - დიდგორის ბრძოლა; კლასი - მე-8.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი საქართველოს ისტორიის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: დიდგორის ბრძოლა და დავით აღმაშენებლის სამხედრო ტაქტიკა. სამიზნე აუდიტორია არის მე-8 კლასი.\n\nგეგმაში გაწერე:\n1. დროის ზუსტი განაწილება;\n2. ორი ინტერაქტიული აქტივობა;\n3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: მიიღებთ დაგეგმილ ჯგუფურ აქტივობას "სამხედრო შტაბი", სადაც ბავშვები დაფაზე დახატულ მარტივ რუკაზე თავად შეეცდებიან სტრატეგიის შემუშავებას.',
      },
      {
        title: "მაგალითი 4 (ინგლისური ენა):",
        parameters: "პარამეტრები: თემა - მოგზაურობა და აეროპორტის ლექსიკა; კლასი - მე-9.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი ინგლისური ენის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: მოგზაურობა და აეროპორტის ლექსიკა. სამიზნე აუდიტორია არის მე-9 კლასი.\n\nგეგმაში გაწერე:\n1. დროის ზუსტი განაწილება;\n2. ორი ინტერაქტიული აქტივობა;\n3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: მოგაწვდით აქტივობას "ქუთაისის აეროპორტის სიმულაცია", სადაც მოსწავლეები წყვილებში თამაშობენ მესაზღვრისა და ტურისტის დიალოგს.',
      },
      {
        title: "მაგალითი 5 (ბიოლოგია):",
        parameters: "პარამეტრები: თემა - უჯრედის აგებულება; კლასი - მე-7.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი ბიოლოგიის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: მცენარეული და ცხოველური უჯრედის აგებულება. სამიზნე აუდიტორია არის მე-7 კლასი.\n\nგეგმაში გაწერე:\n1. დროის ზუსტი განაწილება;\n2. ორი ინტერაქტიული აქტივობა;\n3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: შეიქმნება "უჯრედი-ქალაქის" მოდელი, სადაც მიტოქონდრია შედარებულია ელექტროსადგურთან, ხოლო ბირთვი - მერიასთან.',
      },
    ],
  },
  {
    id: "slides",
    number: "2",
    title: 'პრეზენტაციის სლაიდების სტრუქტურირება ("Death by PowerPoint"-ის დასასრული)',
    why:
      "რატომ არის ეს ღირებული: მოსწავლეებს ეძინებათ სლაიდებზე, სადაც ეკრანი სავსეა ტექსტებით. ხელოვნური ინტელექტი მუშაობს როგორც დიზაინერი — ის ანაწილებს ინფორმაციას ლოგიკურად და გირჩევთ კონკრეტულ ვიზუალებს უკეთესი აღქმისთვის.",
    structureLabel: "ძირითადი სტრუქტურა:",
    structure:
      '"უნდა მოვამზადო [ჩასვი რაოდენობა]-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: [ჩასვი თემა]. მოსწავლეებისთვის ის უნდა იყოს მარტივად აღქმადი. დამიწერე თითოეული სლაიდის დეტალური შინაარსი:\n1. სლაიდის სათაური;\n2. ძირითადი ტექსტი (არაუმეტეს 3-4 მოკლე წინადადებისა/Bullet point-ისა);\n3. დეტალური იდეა, თუ როგორი ვიზუალი/სურათი უნდა გამოვიყენო ამ სლაიდზე თვალსაჩინოებისთვის."',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (გეოგრაფია):",
        parameters: "პარამეტრები: თემა - საქართველოს ჰავა; სლაიდები - 8.",
        prompt:
          '"უნდა მოვამზადო 8-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: საქართველოს ჰავა. მოსწავლეებისთვის ის უნდა იყოს მარტივად აღქმადი. დამიწერე თითოეული სლაიდის დეტალური შინაარსი:\n1. სლაიდის სათაური;\n2. ძირითადი ტექსტი (არაუმეტეს 3-4 მოკლე წინადადებისა/Bullet point-ისა);\n3. დეტალური იდეა, თუ როგორი ვიზუალი/სურათი უნდა გამოვიყენო ამ სლაიდზე თვალსაჩინოებისთვის."',
        result:
          "შედეგი: ტექსტის ნაცვლად, AI შემოგთავაზებთ კოლხეთის დაბლობისა და ჯავახეთის ზეგნის კონტრასტულ ფოტოებს, ტექსტად კი მხოლოდ ნალექების წლიურ სტატისტიკას მოგცემთ.",
      },
      {
        title: "მაგალითი 2 (ხელოვნება):",
        parameters: "პარამეტრები: თემა - ქართული ხუროთმოძღვრება; სლაიდები - 10.",
        prompt:
          '"უნდა მოვამზადო 10-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: ქართული ხუროთმოძღვრება. მოსწავლეებისთვის ის უნდა იყოს მარტივად აღქმადი. დამიწერე თითოეული სლაიდის დეტალური შინაარსი:\n1. სათაური;\n2. ძირითადი ტექსტი (მაქსიმუმ 3 bullet point);\n3. ვიზუალის იდეა."',
        result:
          "შედეგი: ჯვარ-გუმბათოვანი არქიტექტურის ასახსნელად, AI გირჩევთ გამოიყენოთ მონასტრის ჭრის სქემატური ფოტო წითელი ისრებით, რომლებიც სიმძიმის გადანაწილებას აჩვენებს.",
      },
      {
        title: "მაგალითი 3 (ფიზიკა):",
        parameters: "პარამეტრები: თემა - ნიუტონის კანონები; სლაიდები - 7.",
        prompt:
          '"უნდა მოვამზადო 7-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: ნიუტონის კანონები. დამიწერე თითოეული სლაიდის დეტალური შინაარსი:\n1. სათაური;\n2. ძირითადი ტექსტი;\n3. ვიზუალის იდეა."',
        result:
          "შედეგი: ინერციის კანონის ასახსნელად, AI შემოგთავაზებთ ვიზუალს: ავტობუსის მკვეთრი დამუხრუჭებისას წინ გადავარდნილი მგზავრი, რათა ბავშვებმა თავად გამოიტანონ დასკვნა.",
      },
      {
        title: "მაგალითი 4 (Geography - ინგლისურ ენაზე):",
        parameters: "პარამეტრები: Topic - Global Warming; Slides - 9.",
        prompt:
          '"I need to prepare a 9-slide educational presentation on the topic: Global Warming and its consequences. It must be easily understandable for students. Write detailed content for each slide:\n1. Slide title;\n2. Main text (max 3-4 short bullet points);\n3. A detailed idea of what kind of visual/image to use."',
        result:
          "შედეგი: მე-4 სლაიდზე ვრცელი ტექსტის ნაცვლად, მიიღებთ რჩევას დადოთ ორი ფოტო: მყინვარი 50 წლის წინ და დღეს, მოკლე შოკისმომგვრელი სტატისტიკით.",
      },
      {
        title: "მაგალითი 5 (Math - Geometry / გეომეტრია):",
        parameters: "პარამეტრები: თემა - პითაგორას თეორემა; სლაიდები - 8.",
        prompt:
          '"უნდა მოვამზადო 8-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: პითაგორას თეორემა და მისი პრაქტიკული გამოყენება. დამიწერე თითოეული სლაიდის შინაარსი:\n1. სათაური;\n2. ძირითადი ტექსტი;\n3. ვიზუალის იდეა."',
        result:
          "შედეგი: ფორმულის ($a^2 + b^2 = c^2$) მშრალი მოწოდების ნაცვლად, AI შემოგთავაზებთ კედელზე მიყუდებული კიბის ილუსტრაციას, სადაც მოსწავლემ კიბის სიგრძე უნდა გამოთვალოს.",
      },
    ],
  },
  {
    id: "quizzes",
    number: "3",
    title: "ტესტებისა და ქვიზების გენერირება (ჭკვიანური მცდარი პასუხებით)",
    why:
      "რატომ არის ეს ღირებული: სწორი კითხვების მოფიქრება მარტივია, მაგრამ დამაჯერებელი მცდარი პასუხების (Distractors) შედგენა საათებს ითხოვს. AI ამას იდეალურად და წამებში აკეთებს.",
    structureLabel: "ძირითადი სტრუქტურა:",
    structure:
      '"შემიქმენი [ჩასვი რაოდენობა]-კითხვიანი ტესტი თემაზე: [ჩასვი თემა]. სამიზნე აუდიტორიაა [ჩასვი კლასი] კლასის მოსწავლეები. თითოეულ კითხვას უნდა ჰქონდეს 4 სავარაუდო პასუხი (A, B, C, D), საიდანაც მხოლოდ 1 არის სწორი. ყურადღება მიაქციე: არასწორი პასუხები უნდა იყოს ძალიან დამაჯერებელი და ეფუძნებოდეს მოსწავლეების მიერ დაშვებულ ტიპურ, ლოგიკურ შეცდომებს. ბოლოში დაურთე სწორი პასუხების გასაღები."',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (მათემატიკა):",
        parameters: "პარამეტრები: თემა - წილადების შეკრება; კითხვები - 5; კლასი - მე-6.",
        prompt:
          '"შემიქმენი 5-კითხვიანი ტესტი თემაზე: წილადების შეკრება სხვადასხვა მნიშვნელით. სამიზნე აუდიტორიაა მე-6 კლასის მოსწავლეები. თითოეულ კითხვას უნდა ჰქონდეს 4 სავარაუდო პასუხი (A, B, C, D), საიდანაც მხოლოდ 1 არის სწორი. ყურადღება მიაქციე: არასწორი პასუხები უნდა იყოს ძალიან დამაჯერებელი და ეფუძნებოდეს მოსწავლეების მიერ დაშვებულ ტიპურ, ლოგიკურ შეცდომებს. ბოლოში დაურთე სწორი პასუხების გასაღები."',
        result:
          "შედეგი: კითხვაზე $\\frac{1}{2} + \\frac{1}{3}$ AI მცდარ პასუხად აუცილებლად ჩასვამს $\\frac{2}{5}$-ს (როცა ბავშვები მრიცხველსაც კრებენ და მნიშვნელსაც). ეს იდეალურად გამოავლენს გაუგებრობას.",
      },
      {
        title: "მაგალითი 2 (ქიმია):",
        parameters: "პარამეტრები: თემა - pH შკალა და ინდიკატორები; კითხვები - 7; კლასი - მე-9.",
        prompt:
          '"შემიქმენი 7-კითხვიანი ტესტი თემაზე: მჟავები და ფუძეები (pH შკალა და ინდიკატორები). სამიზნე აუდიტორიაა მე-9 კლასის მოსწავლეები. თითოეულ კითხვას უნდა ჰქონდეს 4 სავარაუდო პასუხი (მხოლოდ 1 სწორი). არასწორი პასუხები უნდა ეფუძნებოდეს ტიპურ შეცდომებს. ბოლოში დაურთე გასაღები."',
        result:
          'შედეგი: AI შეგიქმნით პრაქტიკულ კითხვებს, მაგ: "ლაკმუსის ქაღალდი გაწითლდა. რა ნივთიერებაა სინჯარაში?". მცდარ პასუხებში შემოგთავაზებთ სუსტ ფუძეებსა და ნეიტრალურ ხსნარებს.',
      },
      {
        title: "მაგალითი 3 (ფიზიკა):",
        parameters: "პარამეტრები: თემა - სითბური მოვლენები; კითხვები - 6; კლასი - მე-8.",
        prompt:
          '"შემიქმენი 6-კითხვიანი ტესტი თემაზე: სითბური მოვლენები და აგრეგატული მდგომარეობის ცვლილება. სამიზნე აუდიტორიაა მე-8 კლასის მოსწავლეები. 4 სავარაუდო პასუხი თითო კითხვაზე. მცდარი პასუხები უნდა იყოს დამაჯერებელი და ეფუძნებოდეს ლოგიკურ შეცდომებს."',
        result:
          "შედეგი: თუ კითხვა ეხება წყლის დუღილის ტემპერატურას მაღალ მთაში, მცდარ პასუხად AI განზრახ მიუთითებს $100^{\\circ}C$-ს, რაც ამოწმებს კანონზომიერების გააზრებას და არა დაზეპირებას.",
      },
      {
        title: "მაგალითი 4 (გეოგრაფია):",
        parameters: "პარამეტრები: თემა - გეოგრაფიული კოორდინატები; კითხვები - 5; კლასი - მე-7.",
        prompt:
          '"შემიქმენი 5-კითხვიანი ტესტი თემაზე: გრძედი, განედი და გეოგრაფიული კოორდინატების დადგენა. სამიზნე აუდიტორიაა მე-7 კლასი. 4 სავარაუდო პასუხი. არასწორი პასუხები დააფუძნე ბავშვების ტიპურ შეცდომებს."',
        result:
          "შედეგი: AI განზრახ შეურევს დასავლეთ/აღმოსავლეთ ნახევარსფეროებს მცდარ პასუხებში (მაგალითად, სწორი $40^{\\circ}$ ჩ.გ.-ის ნაცვლად დაწერს $40^{\\circ}$ ა.გ.). ეს აჩვენებს, ვინ ურევს ეკვატორსა და ნულოვან მერიდიანს.",
      },
    ],
  },
  {
    id: "inclusive",
    number: "4",
    title: "ინკლუზიური სწავლება: მასალის მორგება სხვადასხვა დონეზე",
    why:
      "რატომ არის ეს ღირებული: კლასში ზოგ ბავშვს მასალის ათვისება უჭირს, ზოგი კი ძალიან წინ არის და დამატებით გამოწვევას ითხოვს. მასწავლებელს ფიზიკურად არ აქვს დრო 1 ტექსტის 3 სხვადასხვა ვერსიის დასაწერად.",
    structureLabel: "შაბლონი წამოსაღებად:",
    structure:
      '"ქვემოთ მოცემული მაქვს რთული სასწავლო ტექსტი. გთხოვ, გადაწერო და ადაპტირება გაუკეთო ამ ტექსტს 3 სხვადასხვა სირთულის დონედ:\n1. საბაზისო დონე (გამოიყენე მარტივი წინადადებები, აუხსენი რთული ტერმინები მარტივი ენით - მათთვის, ვისაც უჭირს აღქმა);\n2. სტანდარტული სასკოლო დონე;\n3. მოწინავე, ანალიტიკური დონე (ჩართე დამატებითი კრიტიკული კითხვები და წაახალისე ღრმა ანალიზი).\n\nაი, ტექსტი:\n\n[ჩასვი შენი მასალა]\n\n"',
    examplesIntro: "💡 რეალური მაგალითები, თუ როგორ მუშაობს ეს:",
    examples: [
      {
        title: "მაგალითი 1 (სამოქალაქო განათლება):",
        parameters: "პარამეტრები: თემა - საქართველოს კონსტიტუცია; მასალა - ვიკიპედიის რთული სტატია.",
        prompt:
          '"ქვემოთ მოცემული მაქვს ვიკიპედიის რთული სტატია თემაზე: საქართველოს კონსტიტუცია. გთხოვ, გადაწერო და ადაპტირება გაუკეთო ამ ტექსტს მე-9 კლასელებისთვის 3 სხვადასხვა სირთულის დონედ:\n1. საბაზისო დონე (გამოიყენე მარტივი წინადადებები და მოკლე აბზაცები - მათთვის, ვისაც უჭირს კითხვა);\n2. სტანდარტული დონე;\n3. მოწინავე, ანალიტიკური დონე (დაამატე კითხვები მოქალაქის პასუხისმგებლობაზე).\n\nაი, ტექსტი:\n\n[ჩასვი ვიკიპედიის სტატია]\n\n"',
        result:
          'შედეგი: AI საბაზისო დონისთვის ტექსტს აქცევს მოკლე, გასაგებ წესების კრებულად ("კონსტიტუცია არის ქვეყნის მთავარი წესების წიგნი"), ხოლო მოწინავე დონისთვის დაამატებს სამართლებრივ ქეისებს, მაგალითად: "როგორ ფიქრობ, რატომ არის მნიშვნელოვანი ადამიანის უფლებების დაცვა კონსტიტუციით?".',
      },
      {
        title: "მაგალითი 2 (ბიოლოგია):",
        parameters: "პარამეტრები: თემა - იმუნური სისტემა; კლასი - მე-8.",
        prompt:
          '"ქვემოთ მოცემული მაქვს მე-8 კლასის სახელმძღვანელოს ტექსტი თემაზე: იმუნური სისტემა (ლეიკოციტები, ფაგოციტოზი). გთხოვ, გადაწერო ტექსტი 3 დონედ:\n1. საბაზისო დონე (გამოიყენე \'ორგანიზმის ჯარისკაცების\' და \'ციხესიმაგრის\' ანალოგიები);\n2. სტანდარტული დონე;\n3. მოწინავე დონე (ჩართე დამატებითი ინფორმაცია აუტოიმუნურ დაავადებებზე).\n\nაი, ტექსტი:\n\n[ჩასვი წიგნის ტექსტი]\n\n"',
        result:
          'შედეგი: საბაზისო დონის ტექსტში რთული ბიოლოგიური ტერმინები ("ფაგოციტოზი") ჩანაცვლდება ან აიხსნება მარტივი ასოციაციებით ("როგორ შთანთქავს მცველი ბაქტერიას"), რაც სპეციალური საგანმანათლებლო საჭიროების (სსსმ) მქონე მოსწავლეებს მასალის გაგებაში დაეხმარება.',
      },
      {
        title: "მაგალითი 3 (ქართული ენა და ლიტერატურა):",
        parameters: 'პარამეტრები: თემა - ილია ჭავჭავაძის პუბლიცისტიკა ("რა გითხრათ, რით გაგახაროთ?"); კლასი - მე-10.',
        prompt:
          '"ქვემოთ მოცემულია მე-10 კლასის მასალა თემაზე: ილია ჭავჭავაძის პუბლიცისტიკა ("რა გითხრათ, რით გაგახაროთ?"). ტექსტი შეიცავს არქაულ ლექსიკას და რთულ სინტაქსს. გთხოვ, დაამუშავო ეს ტექსტი 3 ვერსიად:\n1. საბაზისო დონე (შეინარჩუნე მთავარი აზრი, მაგრამ სრულად გაამარტივე ენა და განმარტე ძველი სიტყვები ფრჩხილებში);\n2. სტანდარტული დონე (დატოვე ავტორის სტილი, მაგრამ დაურთე ლექსიკონი აბზაცების ბოლოს);\n3. მოწინავე დონე (ტექსტის გარდა, დაამატე 2-3 კრიტიკული კითხვა ტექსტის ქვეტექსტებსა და ირონიაზე).\n\nაი, ტექსტი:\n\n[ჩასვი ილიას წერილი]\n\n"',
        result:
          "შედეგი: ტექსტის არსი და ილიას მთავარი სათქმელი სამივე ვერსიაში შენარჩუნდება, თუმცა მოსწავლეები, რომლებსაც უჭირთ მე-19 საუკუნის ქართულის გაგება, შეძლებენ პირდაპირ შინაარსზე ფოკუსირებას, ხოლო ძლიერი მოსწავლეები ავტორის ირონიის ანალიზს შეუდგებიან.",
      },
    ],
  },
  {
    id: "worksheets",
    number: "5",
    title: "პრაქტიკული სამუშაო ფურცლების (Worksheets) შექმნა რეალური სცენარებით",
    why:
      "რატომ არის ეს ღირებული: მშრალი თეორიის პრაქტიკაში გადატანა საუკეთესო გზაა სწავლებისთვის. ამ შაბლონით თქვენ ქმნით დავალებებს, რომლებიც მოსწავლეებს აჩვენებს, თუ როგორ გამოადგებათ ეს ცოდნა რეალურ ცხოვრებაში.",
    structureLabel: "შაბლონი წამოსაღებად:",
    structure:
      '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: [ჩასვი თემა], [ჩასვი კლასი] კლასისთვის. ტრადიციული კითხვების ნაცვლად, მოიფიქრე 1 საინტერესო, რეალურ ცხოვრებასთან დაკავშირებული პრობლემური სცენარი. ამ სცენარის ბაზაზე, დაუწერე 4 პრაქტიკული დავალება/მისია, რომელიც მოსწავლემ ეტაპობრივად უნდა გადაჭრას საკუთარი ცოდნის გამოყენებით. დავალებები უნდა ავითარებდეს პრობლემის გადაჭრის უნარს."',
    examplesIntro: "💡 რეალური მაგალითები, თუ როგორ მუშაობს ეს:",
    examples: [
      {
        title: "მაგალითი 1 (მათემატიკა):",
        parameters: "პარამეტრები: თემა - პროცენტები და ბიუჯეტირება; კლასი - მე-6.",
        prompt:
          '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: პროცენტები და ბიუჯეტირება, მე-6 კლასისთვის. ტრადიციული ამოცანების ნაცვლად, მოიფიქრე 1 საინტერესო, სკოლის ცხოვრებასთან დაკავშირებული სცენარი - კლასის ექსკურსიის დაგეგმვა კახეთში 500 ლარიანი ბიუჯეტით. ამ სცენარის ბაზაზე, დაუწერე 4 პრაქტიკული დავალება (მაგ: ტრანსპორტის 15%-იანი ფასდაკლების გამოთვლა), რომელიც მოსწავლემ ეტაპობრივად უნდა გადაჭრას."',
        result:
          "შედეგი: მოსწავლეები მიიღებენ დავალებას, სადაც მათ უნდა გამოთვალონ, ეყოფათ თუ არა 500 ლარი, თუ მიკროავტობუსი ღირს 250 ლარი (15% ფასდაკლებით), ხოლო მუზეუმის ბილეთი თითო ბავშვზე 3 ლარია.",
      },
      {
        title: "მაგალითი 2 (ინგლისური ენა):",
        parameters: "პარამეტრები: თემა - Food and Restaurant (საკვები და რესტორანი); კლასი - მე-8.",
        prompt:
          '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: Food and Restaurant (საკვები და რესტორანი), მე-8 კლასისთვის. მოიფიქრე 1 საინტერესო სცენარი: მოსწავლე მოგზაურობს ლონდონში და რესტორანში უნდა შეუკვეთოს საჭმელი მეგობრისთვის, რომელსაც აქვს ალერგია თხილეულსა და რძის პროდუქტებზე. ამ სცენარის ბაზაზე, დაუწერე 4 პრაქტიკული მისია (მაგ: მენიუს გაშიფვრა, მიმტანთან დიალოგის აწყობა)."',
        result:
          "შედეგი: AI შექმნის ინგლისურენოვან მენიუს და მოსწავლემ უნდა შეარჩიოს კერძები ისე, რომ არ დაარღვიოს ალერგიული შეზღუდვები და ჩაეტიოს კონკრეტულ ფასში, რაც ავითარებს წაკითხულის გააზრებას.",
      },
      {
        title: "მაგალითი 3 (სამოქალაქო განათლება):",
        parameters: "პარამეტრები: თემა - ადგილობრივი თვითმმართველობა და ბიუჯეტი; კლასი - მე-10.",
        prompt:
          '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: ადგილობრივი თვითმმართველობა და ბიუჯეტი, მე-10 კლასისთვის. მოიფიქრე რეალური სცენარი: მოსწავლეები არიან ქალაქის საკრებულოს წევრები. მათ აქვთ შეზღუდული ბიუჯეტი და უნდა გადაწყვიტონ - სკოლის სტადიონი გაარემონტონ თუ ახალი სკვერი გააშენონ. დაუწერე 4 პრაქტიკული დავალება, სადაც მოუწევთ მოსახლეობის ინტერესების აწონ-დაწონვა და არგუმენტირებული გადაწყვეტილების მიღება."',
        result:
          "შედეგი: სამუშაო ფურცელი მოსწავლეებს ჩააყენებს დილემის წინაშე. მათ მოუწევთ წარმოსახვითი მოსახლეობის (ახალგაზრდების და ხანდაზმულების) \"მოთხოვნების\" წაკითხვა და საბოლოო ვერდიქტის გამოტანა, რაც ამუშავებს კრიტიკულ აზროვნებას.",
      },
    ],
  },
  {
    id: "feedback",
    number: "6",
    title: "ნაშრომების შეფასება ემპათიური და განმავითარებელი უკუკავშირით",
    why:
      'რატომ არის ეს ღირებული: 30 ესეს გასწორება არა მხოლოდ თვალებს ღლის, არამედ ემოციურადაც გფიტავთ. AI უზრუნველყოფს 100%-ით ობიექტურ, დეტალურ შეფასებას და იყენებს "სენდვიჩის მეთოდს" (პოზიტივი-კრიტიკა-პოზიტივი), რათა მოსწავლეს მოტივაცია არ დაეკარგოს.',
    structureLabel: "შაბლონი წამოსაღებად:",
    structure:
      '"მე ვარ მასწავლებელი. გიგზავნი მოსწავლის ნაშრომს თემაზე: [ჩასვი თემა]. გთხოვ, შეაფასო ეს ნაშრომი 10-ბალიანი სისტემით შემდეგი 3 კრიტერიუმით:\n1. არგუმენტაციის სიძლიერე;\n2. ფაქტობრივი სიზუსტე;\n3. სტრუქტურა და გრამატიკა.\n\nშეფასების შემდეგ, დამიწერე მოკლე, ემპათიური და განმავითარებელი უკუკავშირი მოსწავლისთვის (მისთვის გასაგებ, თბილ ენაზე). ჯერ შეუქე ძლიერი მხარეები, შემდეგ დელიკატურად მიუთითე 2 კონკრეტულ დეტალზე გამოსასწორებლად და დაასრულე მოტივაციით. ნაშრომი:\n\n[ჩასვი მოსწავლის ტექსტი თუ გაქვს ელექტრონული ფორმით ან ატვირთე მოსწავლის ხელნაწერის ფოტო(ები)]\n\n"',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (ქართული ენა და ლიტერატურა):",
        parameters: 'პარამეტრები: თემა - "ჩემი საყვარელი წიგნი"; კლასი - მე-6.',
        prompt:
          '"მე ვარ ქართული ენის მასწავლებელი. გიგზავნი მე-6 კლასელის ესეს თემაზე: \'ჩემი საყვარელი წიგნი\'. გთხოვ, შეაფასო ეს ნაშრომი 10-ბალიანი სისტემით 3 კრიტერიუმით:\n1. შინაარსის გადმოცემა;\n2. ფანტაზია და შემოქმედებითობა;\n3. პუნქტუაცია და წინადადების სტრუქტურა.\n\nშეფასების შემდეგ, დამიწერე მოკლე, ემპათიური უკუკავშირი მოსწავლისთვის \'სენდვიჩის მეთოდით\' (პოზიტივი-კრიტიკა-პოზიტივი). ნაშრომი:\n\n[ჩასვი მოსწავლის ტექსტი თუ გაქვს ელექტრონული ფორმით ან ატვირთე მოსწავლის ხელნაწერის ფოტო(ები)]\n\n"',
        result:
          'შედეგი: AI ჯერ შეაქებს ბავშვის კრეატიულ იდეებს (მაგ: "ძალიან მომეწონა, როგორ აღწერე მთავარი გმირი"), შემდეგ რბილად ურჩევს, როგორ დაიწყოს ახალი აბზაცი და დაასრულებს წამახალისებელი სიტყვებით.',
      },
      {
        title: "მაგალითი 2 (სამოქალაქო განათლება):",
        parameters: 'პარამეტრები: თემა - "უნდა იყოს თუ არა სასკოლო ფორმა სავალდებულო?"; კლასი - მე-10.',
        prompt:
          '"მე ვარ სამოქალაქო განათლების მასწავლებელი. გიგზავნი მე-10 კლასელის სადისკუსიო ნაშრომს თემაზე: \'უნდა იყოს თუ არა სასკოლო ფორმა სავალდებულო?\'. შეაფასე ნაშრომი 10-ბალიანი სისტემით:\n1. არგუმენტაციის სიძლიერე;\n2. კონტრარგუმენტების გაბათილება;\n3. სტრუქტურა.\n\nდამიწერე განმავითარებელი უკუკავშირი, სადაც მიუთითებ 2 კონკრეტულ დეტალზე, რაც უნდა გააუმჯობესოს (მაგ: სტატისტიკის დამატება). ნაშრომი:\n\n[ჩასვი მოსწავლის ტექსტი თუ გაქვს ელექტრონული ფორმით ან ატვირთე მოსწავლის ხელნაწერის ფოტო(ები)]\n\n"',
        result:
          "შედეგი: უკუკავშირი ფოკუსირებული იქნება იმაზე, თუ რამდენად ლოგიკურად მოჰყავს მოსწავლეს არგუმენტები. AI ზუსტად მიუთითებს აბზაცს, სადაც მოსწავლეს შეეძლო კვლევის ან სტატისტიკის მოყვანა თავისი პოზიციის გასამყარებლად.",
      },
      {
        title: "მაგალითი 3 (ისტორია):",
        parameters: "პარამეტრები: თემა - ისტორიული მოვლენის ანალიზი; კლასი - მე-11.",
        prompt:
          '"მე ვარ ისტორიის მასწავლებელი. გიგზავნი მე-11 კლასელის ანალიტიკურ ესეს თემაზე: ისტორიული მოვლენის ანალიზი. შეაფასე 3 კრიტერიუმით:\n1. ფაქტობრივი სიზუსტე;\n2. მიზეზ-შედეგობრივი კავშირების დანახვა;\n3. აკადემიური ენა.\n\nდაუწერე მოსწავლეს პროფესიონალური, მაგრამ თბილი უკუკავშირი. ნაშრომი:\n\n[ჩასვი მოსწავლის ტექსტი თუ გაქვს ელექტრონული ფორმით ან ატვირთე მოსწავლის ხელნაწერის ფოტო(ები)]\n\n"',
        result:
          "შედეგი: AI დააფასებს მოსწავლის სიღრმისეულ ხედვას და მისცემს რჩევას, თუ როგორ ჩასვას ისტორიული წყაროები ტექსტში უფრო ბუნებრივად და დამაჯერებლად.",
      },
    ],
  },
];

function getMasterclassHref() {
  if (typeof window === "undefined") return "/teachers-ai-masterclass/confirmed/";
  const token = new URLSearchParams(window.location.search).get("token");
  if (!token) return "/teachers-ai-masterclass/confirmed/";

  const url = new URL(`${TEACHER_GUIDE_API_URL.replace(/\/$/, "")}/masterclass`);
  url.searchParams.set("token", token);
  return url.toString();
}

function getCurrentQueryString() {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

function getGuideIndexHref(queryString = "") {
  return `${TEACHERS_GUIDE_READ_PATH}${queryString}`;
}

function getGuideTopicHref(sectionId: string, queryString = "") {
  return `${TEACHERS_GUIDE_READ_PATH}/${sectionId}${queryString}`;
}

export default function TeachersAIGuideRead() {
  const { sectionId } = useParams<{ sectionId?: string }>();
  const [openMenu, setOpenMenu] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const masterclassHref = useMemo(getMasterclassHref, []);
  const queryString = useMemo(getCurrentQueryString, []);
  const selectedSection = sectionId ? guideSections.find((section) => section.id === sectionId) : undefined;
  const selectedSectionIndex = selectedSection ? guideSections.findIndex((section) => section.id === selectedSection.id) : -1;
  const pageTitle = selectedSection
    ? `${selectedSection.number}. ${selectedSection.title} | BitCamp`
    : "უფასო გზამკვლევი: გადატვირთული მასწავლებლიდან AI-ით აღჭურვილ პროფესიონალამდე | BitCamp";

  const copyPrompt = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(""), 1600);
    } catch {
      setCopiedKey("");
    }
  };

  return (
    <div className="teacher-guide-page bg-[#05091d] text-[#fff4e8]">
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content="BitCamp-ის უფასო გზამკვლევი მასწავლებლებისთვის: 6 პრაქტიკული AI შაბლონი გაკვეთილების, ტესტების, სლაიდების და უკუკავშირის მოსამზადებლად."
        />
        <meta property="og:title" content="უფასო AI გზამკვლევი მასწავლებლებისთვის | BitCamp" />
        <meta property="og:type" content="article" />
      </Helmet>

      <main className="relative min-h-screen">
        <div className="absolute inset-0 teacher-guide-grid" aria-hidden="true" />
        <div className="absolute left-0 right-0 top-0 h-1 bg-[#df3342]" aria-hidden="true" />

        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#293a52] bg-[#05091d]/96 px-4 py-4 backdrop-blur sm:px-6 lg:relative lg:inset-auto lg:z-auto lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <a href="/teachers-ai-guide" className="inline-block bg-[#fff4e8] p-2 shadow-[3px_3px_0_#df3342]">
              <img src={bitcampLogo} alt="BitCamp" className="h-auto w-28 sm:w-36" />
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-[#293a52] px-3 py-2 text-sm font-black text-[#fff4e8] lg:hidden"
              onClick={() => setOpenMenu(true)}
            >
              <Menu size={16} aria-hidden="true" />
              სარჩევი
            </button>
            <a
              href={masterclassHref}
              className="hidden items-center gap-2 bg-[#df3342] px-4 py-3 text-sm font-black text-[#fff4e8] transition hover:bg-[#c62a39] lg:inline-flex"
            >
              მასტერკლასზე რეგისტრაცია
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </header>
        <div className="h-[111px] lg:hidden" aria-hidden="true" />

        <section className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto max-w-5xl">
            <article className="min-w-0">
              {selectedSection ? (
                <>
                  <TopicPageHeader section={selectedSection} queryString={queryString} />
                  <GuideSectionCard section={selectedSection} copiedKey={copiedKey} onCopy={copyPrompt} />
                  <TopicPager currentIndex={selectedSectionIndex} queryString={queryString} />
                  <NextStepSection masterclassHref={masterclassHref} />
                </>
              ) : sectionId ? (
                <MissingTopic queryString={queryString} />
              ) : (
                <>
                  <GuideHero />
                  <TopicIndexCards queryString={queryString} />
                  <IntroSection />
                  <NextStepSection masterclassHref={masterclassHref} />
                </>
              )}
            </article>
          </div>
        </section>

        <div className="sticky bottom-0 z-30 border-t border-[#293a52] bg-[#05091d]/95 px-4 py-3 backdrop-blur lg:hidden">
          <a
            href={masterclassHref}
            className="inline-flex w-full items-center justify-center gap-2 bg-[#df3342] px-4 py-3 text-sm font-black text-[#fff4e8]"
          >
            მასტერკლასზე რეგისტრაცია
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        {openMenu && (
          <div className="fixed inset-0 z-50 bg-[#05091d]/80 p-4 backdrop-blur lg:hidden">
            <div className="ml-auto h-full max-w-sm overflow-y-auto border border-[#293a52] bg-[#071025] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-black text-[#fff4e8]">სარჩევი</p>
                <button
                  type="button"
                  className="border border-[#293a52] p-2 text-[#fff4e8]"
                  onClick={() => setOpenMenu(false)}
                  aria-label="დახურვა"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
              <GuideNav
                queryString={queryString}
                currentSectionId={selectedSection?.id}
                onNavigate={() => setOpenMenu(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function GuideHero() {
  return (
    <section className="teacher-guide-panel">
      <div className="teacher-guide-panel__cap" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="relative z-10 mb-4 inline-flex items-center gap-2 border border-[#df3342]/60 bg-[#df3342]/10 px-3 py-2 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
        <BookOpenCheck size={15} aria-hidden="true" />
        📘 უფასო გზამკვლევი
      </p>
      <h1 className="relative z-10 max-w-4xl text-2xl font-black leading-tight text-[#fff4e8] sm:text-4xl">
        გადატვირთული მასწავლებლიდან — AI-ით აღჭურვილ პროფესიონალამდე
      </h1>
    </section>
  );
}

function IntroSection() {
  return (
    <section className="mt-8 grid gap-5" id="intro">
      <div className="border border-[#293a52] bg-[#071025] p-5 sm:p-7">
        <h2 className="text-2xl font-black text-[#fff4e8]">
          მასწავლებლებო! დროა, დაიბრუნოთ რუტინისგან წართმეული ენერგია და თავისუფალი დრო
        </h2>
        <div className="mt-5 space-y-4 text-base leading-8 text-[#d6e0eb]">
          {introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function TopicIndexCards({ queryString }: { queryString: string }) {
  return (
    <section className="mt-8 border border-[#293a52] bg-[#0d1730] p-5 sm:p-6" id="topics">
      <div className="max-w-3xl">
        <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
          🚀 პრაქტიკული ნაწილი
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#fff4e8]">6 ჯადოსნური შაბლონი (Prompt)</h2>
        <p className="mt-3 text-sm leading-6 text-[#c7d3df]">
          გამოყენების ინსტრუქცია: აირჩიეთ თემა, დააკოპირეთ გამზადებული შაბლონები, სურვილის შემთხვევაში
          შეცვალეთ მონაცემები და გაუგზავნეთ ChatGPT-ს ან Claude-ს.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {guideSections.map((section) => (
          <a
            key={section.id}
            href={getGuideTopicHref(section.id, queryString)}
            className="group flex min-h-44 flex-col border border-[#293a52] bg-[#05091d] p-4 transition hover:border-[#df3342] hover:shadow-[5px_5px_0_rgba(223,51,66,0.5)]"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center bg-[#df3342] font-mono text-base font-black text-[#fff4e8]">
              {section.number}
            </span>
            <h3 className="mt-4 text-lg font-black leading-7 text-[#fff4e8]">{section.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#9fb0c3]">{section.why}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-black text-[#ffb3ad]">
              თემის გახსნა
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function NextStepSection({ masterclassHref }: { masterclassHref: string }) {
  return (
    <section
      id="next-step"
      className="mt-8 border border-[#df3342]/70 bg-[#071025] p-5 shadow-[6px_6px_0_#df3342] sm:p-7"
    >
      <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
        🎁 რა არის შემდეგი ნაბიჯი? (ჩვენი მთავარი შეთავაზება)
      </p>
      <h2 className="mt-3 flex flex-col gap-3 text-2xl font-black leading-tight text-[#fff4e8] sm:flex-row sm:items-center sm:text-4xl">
        <span className="inline-flex items-center gap-3">
          <span className="text-[#df3342]">შემდეგი ნაბიჯი</span>
          <span
            className="inline-flex h-12 w-12 flex-none items-center justify-center border border-[#df3342]/70 bg-[#df3342]/15 text-[#ffb3ad] shadow-[4px_4px_0_rgba(223,51,66,0.4)]"
            aria-hidden="true"
          >
            <ArrowRight size={34} strokeWidth={3} />
          </span>
        </span>
        <span>უფასო ონლაინ მასტერკლასი მასწავლებლებისთვის</span>
      </h2>
      <div className="mt-5 space-y-4 text-base leading-8 text-[#d6e0eb]">
        <p>
          ეს დოკუმენტი მხოლოდ აისბერგის მწვერვალია. ხელოვნურ ინტელექტს შეუძლია ბევრად მეტი, ვიდრე უბრალოდ
          ტექსტების გენერირება.
        </p>
        <p>
          თუ გსურთ, რომ ეს ყველაფერი პრაქტიკაში ნახოთ, ისწავლოთ დამალული ხრიკები და გაიგოთ, თუ როგორ უნდა
          აქციოთ AI თქვენს უძლიერეს პროფესიულ იარაღად, გიწვევთ BitCamp - ის უფასო ონლაინ მასტერკლასზე.
        </p>
      </div>
      <div className="mt-6 divide-y divide-[#293a52] border border-[#293a52] bg-[#05091d]">
        <InfoTile
          icon={<Sparkles size={18} />}
          label="🎯 თემა"
          value="როგორ ვაქციოთ AI ჩვენს საუკეთესო ასისტენტად — პრაქტიკული ვორქშოფი მასწავლებლებისთვის."
        />
        <InfoTile icon={<CalendarDays size={18} />} label="დრო" value="შაბათი, 6 ივნისი, 2026 · 13:00" />
        <InfoTile
          icon={<GraduationCap size={18} />}
          label="💻 ფორმატი"
          value="პირდაპირი ეთერი (Zoom/Google Meet), სადაც ეკრანის გაზიარებით, თქვენს თვალწინ შევქმნი რეალურ გაკვეთილებსა და ტესტებს."
        />
      </div>
      <p className="mt-5 text-base leading-7 text-[#d6e0eb]">
        ადგილები შეზღუდულია, რადგან მსურს თითოეული მონაწილის კითხვას პასუხი გავცე.
      </p>
      <p className="mt-5 text-2xl">👉</p>
      <a
        href={masterclassHref}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#df3342] px-5 py-4 text-center text-base font-black text-[#fff4e8] transition hover:bg-[#c62a39] sm:w-auto"
      >
        დააწკაპუნეთ აქ, რათა დარეგისტრირდეთ და დაჯავშნოთ თქვენი ადგილი უფასო მასტერკლასზე
        <ArrowRight size={18} aria-hidden="true" />
      </a>
    </section>
  );
}

function TopicPageHeader({ section, queryString }: { section: GuideSection; queryString: string }) {
  return (
    <section className="mb-6 border border-[#293a52] bg-[#071025] p-5 sm:p-7">
      <a
        href={getGuideIndexHref(queryString)}
        className="inline-flex items-center gap-2 border border-[#293a52] px-3 py-2 text-sm font-black text-[#c7d3df] transition hover:border-[#df3342] hover:text-[#fff4e8]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        გზამკვლევზე დაბრუნება
      </a>
      <p className="mt-6 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
        შაბლონი {section.number} / 6
      </p>
      <h1 className="mt-3 text-3xl font-black leading-tight text-[#fff4e8] sm:text-5xl">{section.title}</h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[#d6e0eb]">
        ეს გვერდი ამ ერთ გამოყენების სცენარზეა ფოკუსირებული. დააკოპირეთ ძირითადი შაბლონი ან გახსენით
        მაგალითები კონკრეტული საგნის მიხედვით.
      </p>
    </section>
  );
}

function TopicPager({ currentIndex, queryString }: { currentIndex: number; queryString: string }) {
  const previous = currentIndex > 0 ? guideSections[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < guideSections.length - 1 ? guideSections[currentIndex + 1] : undefined;

  return (
    <nav className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="თემებს შორის ნავიგაცია">
      <a
        href={getGuideIndexHref(queryString)}
        className="inline-flex items-center justify-center gap-2 border border-[#293a52] bg-[#071025] px-4 py-3 text-sm font-black text-[#fff4e8] transition hover:border-[#df3342]"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        ყველა თემა
      </a>
      {previous ? (
        <a
          href={getGuideTopicHref(previous.id, queryString)}
          className="inline-flex items-center justify-center gap-2 border border-[#293a52] bg-[#071025] px-4 py-3 text-sm font-black text-[#c7d3df] transition hover:border-[#df3342] hover:text-[#fff4e8]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          წინა
        </a>
      ) : (
        <span aria-hidden="true" />
      )}
      {next ? (
        <a
          href={getGuideTopicHref(next.id, queryString)}
          className="inline-flex items-center justify-center gap-2 bg-[#df3342] px-4 py-3 text-sm font-black text-[#fff4e8] transition hover:bg-[#c62a39]"
        >
          შემდეგი
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

function MissingTopic({ queryString }: { queryString: string }) {
  return (
    <section className="border border-[#293a52] bg-[#071025] p-5 sm:p-7">
      <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">თემა ვერ მოიძებნა</p>
      <h1 className="mt-3 text-3xl font-black text-[#fff4e8]">ეს გვერდი აღარ არსებობს</h1>
      <p className="mt-4 text-base leading-7 text-[#d6e0eb]">
        დაბრუნდით გზამკვლევის მთავარ გვერდზე და აირჩიეთ ერთ-ერთი აქტუალური თემა.
      </p>
      <a
        href={getGuideIndexHref(queryString)}
        className="mt-6 inline-flex items-center gap-2 bg-[#df3342] px-4 py-3 text-sm font-black text-[#fff4e8]"
      >
        გზამკვლევზე დაბრუნება
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

function GuideNav({
  queryString,
  currentSectionId,
  onNavigate,
}: {
  queryString: string;
  currentSectionId?: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="border border-[#293a52] bg-[#071025] p-4">
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">სარჩევი</p>
      <div className="space-y-2">
        <NavLink href={`${getGuideIndexHref(queryString)}#intro`} onNavigate={onNavigate}>
          შესავალი
        </NavLink>
        {guideSections.map((section) => (
          <NavLink
            key={section.id}
            href={getGuideTopicHref(section.id, queryString)}
            active={section.id === currentSectionId}
            onNavigate={onNavigate}
          >
            {section.number}. {section.title}
          </NavLink>
        ))}
        <NavLink href={`${getGuideIndexHref(queryString)}#next-step`} onNavigate={onNavigate}>
          შემდეგი ნაბიჯი
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  active = false,
  onNavigate,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={`block border px-3 py-2 text-sm font-semibold leading-5 transition hover:border-[#293a52] hover:bg-[#0d1730] hover:text-[#fff4e8] ${
        active
          ? "border-[#df3342]/70 bg-[#df3342]/10 text-[#fff4e8]"
          : "border-transparent text-[#c7d3df]"
      }`}
    >
      {children}
    </a>
  );
}

function GuideSectionCard({
  section,
  copiedKey,
  onCopy,
}: {
  section: GuideSection;
  copiedKey: string;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <section id={section.id} className="scroll-mt-6 border border-[#293a52] bg-[#071025] p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <span className="flex h-12 w-12 flex-none items-center justify-center bg-[#df3342] font-mono text-lg font-black text-[#fff4e8]">
          {section.number}
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight text-[#fff4e8] sm:text-3xl">{section.title}</h2>
          <p className="mt-4 text-base leading-8 text-[#d6e0eb]">{section.why}</p>
        </div>
      </div>

      <PromptBlock
        className="mt-6"
        title={section.structureLabel}
        text={section.structure}
        copied={copiedKey === `${section.id}-structure`}
        onCopy={() => onCopy(`${section.id}-structure`, section.structure)}
      />

      <h3 className="mt-7 text-lg font-black text-[#fff4e8]">{section.examplesIntro}</h3>
      <div className="mt-4 grid gap-4">
        {section.examples.map((example, index) => (
          <details
            key={example.title}
            className="group border border-[#293a52] bg-[#05091d]"
            open={index === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
              <span className="font-black text-[#fff4e8]">{example.title}</span>
              <span className="font-mono text-xs font-bold text-[#ffb3ad] group-open:hidden">გახსნა</span>
              <span className="hidden font-mono text-xs font-bold text-[#9fb0c3] group-open:inline">დახურვა</span>
            </summary>
            <div className="border-t border-[#293a52] p-4">
              {example.parameters && <ParameterLine text={example.parameters} />}
              <PromptBlock
                title="გამზადებული შაბლონი (Prompt):"
                text={example.prompt}
                highlightTerms={getParameterValues(example.parameters)}
                copied={copiedKey === `${section.id}-${index}`}
                onCopy={() => onCopy(`${section.id}-${index}`, example.prompt)}
              />
              <p className="mt-4 border-l-4 border-[#df3342] bg-[#0d1730] p-4 text-sm leading-7 text-[#d6e0eb]">
                {example.result}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function PromptBlock({
  title,
  text,
  highlightTerms = [],
  copied,
  onCopy,
  className = "",
}: {
  title: string;
  text: string;
  highlightTerms?: string[];
  copied: boolean;
  onCopy: () => void;
  className?: string;
}) {
  return (
    <div className={`border border-[#293a52] bg-[#0d1730] ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-[#293a52] px-4 py-3">
        <p className="text-sm font-black text-[#fff4e8]">{title}</p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex flex-none items-center gap-2 bg-[#fff4e8] px-3 py-2 text-xs font-black text-[#05091d]"
        >
          {copied ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />}
          {copied ? "დაკოპირდა" : "კოპირება"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words p-4 font-sans text-sm leading-7 text-[#d6e0eb]">
        <HighlightedPrompt text={text} highlightTerms={highlightTerms} />
      </pre>
    </div>
  );
}

function HighlightedPrompt({ text, highlightTerms = [] }: { text: string; highlightTerms?: string[] }) {
  const terms = normalizeHighlightTerms(highlightTerms);

  if (!terms.length) {
    return (
      <>
        {text.split(/(\[[^\]]+\])/g).map((part, index) =>
          isPlaceholderToken(part) ? (
            <HighlightToken key={`${part}-${index}`}>{part}</HighlightToken>
          ) : (
            <span key={`${part}-${index}`}>{part}</span>
          )
        )}
      </>
    );
  }

  const matcher = new RegExp(`(\\[[^\\]]+\\]|${terms.map(escapeRegExp).join("|")})`, "g");

  return (
    <>
      {text.split(matcher).map((part, index) =>
        isPlaceholderToken(part) || terms.includes(part) ? (
          <HighlightToken key={`${part}-${index}`}>{part}</HighlightToken>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  );
}

function isPlaceholderToken(value: string) {
  return value.startsWith("[") && value.endsWith("]");
}

function ParameterLine({ text }: { text: string }) {
  const [label] = text.split(/:\s(.+)/);
  const items = getParameterItems(text);

  if (!items.length) {
    return <p className="mb-4 text-sm font-semibold leading-6 text-[#c7d3df]">{text}</p>;
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm leading-6">
      <span className="mr-1 font-black text-[#c7d3df]">{label}:</span>
      {items.map((item) => {
        const [parameterLabel, value] = item.split(/\s-\s(.+)/);

        if (!value) {
          return <HighlightToken key={item}>{item}</HighlightToken>;
        }

        return (
          <span key={item} className="inline-flex flex-wrap items-center gap-1">
            <span className="font-bold text-[#9fb0c3]">{parameterLabel} -</span>
            <HighlightToken>{value}</HighlightToken>
          </span>
        );
      })}
    </div>
  );
}

function getParameterItems(text = "") {
  const [, rest] = text.split(/:\s(.+)/);
  return rest ? rest.replace(/\.$/, "").split(";").map((item) => item.trim()).filter(Boolean) : [];
}

function getParameterValues(text = "") {
  return getParameterItems(text)
    .map((item) => item.split(/\s-\s(.+)/)[1] || item)
    .flatMap((value) => {
      const cleanValue = value.trim();
      const unquoted = cleanValue.replace(/^["']|["']$/g, "");
      const quotedPieces = [...cleanValue.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
      return [cleanValue, unquoted, ...quotedPieces];
    });
}

function normalizeHighlightTerms(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
    .sort((a, b) => b.length - a.length);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightToken({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-[#df3342]/60 bg-[#df3342]/15 px-1.5 py-0.5 font-black text-[#ffb3ad] shadow-[2px_2px_0_rgba(223,51,66,0.35)]">
      {children}
    </span>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 p-4 sm:items-start sm:gap-4">
      <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center bg-[#df3342] text-[#fff4e8]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-base font-black text-[#fff4e8]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[#c7d3df]">{value}</p>
      </div>
    </div>
  );
}
