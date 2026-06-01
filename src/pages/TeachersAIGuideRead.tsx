import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
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
import bitcampLogo from "@/assets/bitcamp-logo-main.png";

const TEACHER_GUIDE_API_URL =
  import.meta.env.VITE_TEACHER_GUIDE_API_URL ||
  "https://us-central1-bitcamp-flitt.cloudfunctions.net/teacher-guide-api";

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
      '"წარმოიდგინე, რომ ხარ გამოცდილი\n\n$$საგანი$$\n\nმასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური გეგმა თემაზე:\n\n$$თემა$$\n\n. კლასი: მე-\n\n$$კლასი$$\n\n..."',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (მათემატიკა):",
        parameters: "პარამეტრები: თემა - პროცენტები და ფასდაკლებები; კლასი - მე-6.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი მათემატიკის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: პროცენტები და ფასდაკლებები. სამიზნე აუდიტორია არის მე-6 კლასი. გეგმაში გაწერე: 1. დროის ზუსტი განაწილება (წუთების მიხედვით); 2. ორი ინტერაქტიული აქტივობა მოსწავლეების ჩასართავად (რომელიც არ საჭიროებს რთულ რესურსებს); 3. სამი შემაჯამებელი, კრიტიკული აზროვნების განმავითარებელი კითხვა გაკვეთილის ბოლოსთვის."',
        result:
          'შედეგი: AI დაგიგეგმავთ აქტივობას "შოპინგი თბილისი მოლში", სადაც მოსწავლეებს დაურიგდებათ წარმოსახვითი ბიუჯეტი და მოუწევთ რეალურ მაღაზიებში 20%-იანი და 50%-იანი ფასდაკლებების გამოთვლა.',
      },
      {
        title: "მაგალითი 2 (ქართული ენა და ლიტერატურა):",
        parameters: 'პარამეტრები: თემა - ვაჟა-ფშაველას "ალუდა ქეთელაური"; კლასი - მე-10.',
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი ქართული ენისა და ლიტერატურის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: ვაჟა-ფშაველას \'ალუდა ქეთელაური\' - ტრადიციისა და ინდივიდის დაპირისპირება. სამიზნე აუდიტორია არის მე-10 კლასი. გეგმაში გაწერე: 1. დროის ზუსტი განაწილება; 2. ორი ინტერაქტიული აქტივობა; 3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: AI შემოგთავაზებთ კლასში "სასამართლო პროცესის" სიმულაციას, სადაც მოსწავლეთა ერთი ნაწილი თემის უხუცესების როლს მოირგებს, მეორე კი – ალუდას პოზიციას დაიცავს.',
      },
      {
        title: "მაგალითი 3 (საქართველოს ისტორია):",
        parameters: "პარამეტრები: თემა - დიდგორის ბრძოლა; კლასი - მე-8.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი საქართველოს ისტორიის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: დიდგორის ბრძოლა და დავით აღმაშენებლის სამხედრო ტაქტიკა. სამიზნე აუდიტორია არის მე-8 კლასი. გეგმაში გაწერე: 1. დროის ზუსტი განაწილება; 2. ორი ინტერაქტიული აქტივობა; 3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: მიიღებთ დაგეგმილ ჯგუფურ აქტივობას "სამხედრო შტაბი", სადაც ბავშვები დაფაზე დახატულ მარტივ რუკაზე თავად შეეცდებიან სტრატეგიის შემუშავებას.',
      },
      {
        title: "მაგალითი 4 (ინგლისური ენა):",
        parameters: "პარამეტრები: თემა - მოგზაურობა და აეროპორტის ლექსიკა; კლასი - მე-9.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი ინგლისური ენის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: Travel and Airport Vocabulary. სამიზნე აუდიტორია არის მე-9 კლასი. გეგმაში გაწერე: 1. დროის ზუსტი განაწილება; 2. ორი ინტერაქტიული აქტივობა; 3. სამი შემაჯამებელი კითხვა."',
        result:
          'შედეგი: მოგაწვდით აქტივობას "ქუთაისის აეროპორტის სიმულაცია", სადაც მოსწავლეები წყვილებში თამაშობენ მესაზღვრისა და ტურისტის დიალოგს.',
      },
      {
        title: "მაგალითი 5 (ბიოლოგია):",
        parameters: "პარამეტრები: თემა - უჯრედის აგებულება; კლასი - მე-7.",
        prompt:
          '"წარმოიდგინე, რომ ხარ გამოცდილი ბიოლოგიის მასწავლებელი. შემიქმენი 45-წუთიანი გაკვეთილის დეტალური, ინოვაციური გეგმა თემაზე: მცენარეული და ცხოველური უჯრედის აგებულება. სამიზნე აუდიტორია არის მე-7 კლასი. გეგმაში გაწერე: 1. დროის ზუსტი განაწილება; 2. ორი ინტერაქტიული აქტივობა; 3. სამი შემაჯამებელი კითხვა."',
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
      '"უნდა მოვამზადო\n\n$$რაოდენობა$$\n\n-სლაიდიანი პრეზენტაცია თემაზე:\n\n$$თემა$$\n\n. დამიწერე შინაარსი და ვიზუალის იდეა..."',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (გეოგრაფია):",
        parameters: "პარამეტრები: თემა - საქართველოს ჰავა; სლაიდები - 8.",
        prompt:
          '"უნდა მოვამზადო 8-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: საქართველოს რელიეფი და ჰავა. მოსწავლეებისთვის ის უნდა იყოს მარტივად აღქმადი. დამიწერე თითოეული სლაიდის დეტალური შინაარსი: 1. სლაიდის სათაური; 2. ძირითადი ტექსტი (არაუმეტეს 3-4 მოკლე წინადადებისა/Bullet point-ისა); 3. დეტალური იდეა, თუ როგორი ვიზუალი/სურათი უნდა გამოვიყენო ამ სლაიდზე თვალსაჩინოებისთვის."',
        result:
          "შედეგი: ტექსტის ნაცვლად, AI შემოგთავაზებთ კოლხეთის დაბლობისა და ჯავახეთის ზეგნის კონტრასტულ ფოტოებს, ტექსტად კი მხოლოდ ნალექების წლიურ სტატისტიკას მოგცემთ.",
      },
      {
        title: "მაგალითი 2 (ხელოვნება):",
        parameters: "პარამეტრები: თემა - ქართული ხუროთმოძღვრება; სლაიდები - 10.",
        prompt:
          '"უნდა მოვამზადო 10-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: ქართული საეკლესიო ხუროთმოძღვრება (სვეტიცხოველი და ჯვარი). მოსწავლეებისთვის ის უნდა იყოს მარტივად აღქმადი. დამიწერე თითოეული სლაიდის დეტალური შინაარსი: 1. სათაური; 2. ძირითადი ტექსტი (მაქსიმუმ 3 bullet point); 3. ვიზუალის იდეა."',
        result:
          "შედეგი: ჯვარ-გუმბათოვანი არქიტექტურის ასახსნელად, AI გირჩევთ გამოიყენოთ მონასტრის ჭრის სქემატური ფოტო წითელი ისრებით, რომლებიც სიმძიმის გადანაწილებას აჩვენებს.",
      },
      {
        title: "მაგალითი 3 (ფიზიკა):",
        parameters: "პარამეტრები: თემა - ნიუტონის კანონები; სლაიდები - 7.",
        prompt:
          '"უნდა მოვამზადო 7-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: ნიუტონის კანონები და მათი გამოვლენა ყოველდღიურობაში. დამიწერე თითოეული სლაიდის დეტალური შინაარსი: 1. სათაური; 2. ძირითადი ტექსტი; 3. ვიზუალის იდეა."',
        result:
          "შედეგი: ინერციის კანონის ასახსნელად, AI შემოგთავაზებთ ვიზუალს: ავტობუსის მკვეთრი დამუხრუჭებისას წინ გადავარდნილი მგზავრი, რათა ბავშვებმა თავად გამოიტანონ დასკვნა.",
      },
      {
        title: "მაგალითი 4 (Geography - ინგლისურ ენაზე):",
        parameters: "პარამეტრები: Topic - Global Warming; Slides - 9.",
        prompt:
          '"I need to prepare a 9-slide educational presentation on the topic: Global Warming and its consequences. It must be easily understandable for students. Write detailed content for each slide: 1. Slide title; 2. Main text (max 3-4 short bullet points); 3. A detailed idea of what kind of visual/image to use."',
        result:
          "შედეგი: მე-4 სლაიდზე ვრცელი ტექსტის ნაცვლად, მიიღებთ რჩევას დადოთ ორი ფოტო: მყინვარი 50 წლის წინ და დღეს, მოკლე შოკისმომგვრელი სტატისტიკით.",
      },
      {
        title: "მაგალითი 5 (Math - Geometry / გეომეტრია):",
        parameters: "პარამეტრები: თემა - პითაგორას თეორემა; სლაიდები - 8.",
        prompt:
          '"უნდა მოვამზადო 8-სლაიდიანი საგანმანათლებლო პრეზენტაცია თემაზე: პითაგორას თეორემა და მისი პრაქტიკული გამოყენება. დამიწერე თითოეული სლაიდის შინაარსი: 1. სათაური; 2. ძირითადი ტექსტი; 3. ვიზუალის იდეა."',
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
      '"შემიქმენი\n\n$$რაოდენობა$$\n\n-კითხვიანი ტესტი თემაზე:\n\n$$თემა$$\n\n... მცდარი პასუხები უნდა ეფუძნებოდეს მოსწავლეების ტიპურ შეცდომებს."',
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
      '"ქვემოთ მოცემული მაქვს რთული სასწავლო ტექსტი. გთხოვ, გადაწერო და ადაპტირება გაუკეთო ამ ტექსტს 3 სხვადასხვა სირთულის დონედ: 1. საბაზისო დონე (გამოიყენე მარტივი წინადადებები, აუხსენი რთული ტერმინები მარტივი ენით - მათთვის, ვისაც უჭირს აღქმა); 2. სტანდარტული სასკოლო დონე; 3. მოწინავე, ანალიტიკური დონე (ჩართე დამატებითი კრიტიკული კითხვები და წაახალისე ღრმა ანალიზი). აი, ტექსტი:\n\n$$ჩასვით თქვენი მასალა$$\n\n"',
    examplesIntro: "💡 რეალური მაგალითები, თუ როგორ მუშაობს ეს:",
    examples: [
      {
        title: "მაგალითი 1 (სამოქალაქო განათლება):",
        parameters: "პარამეტრები: თემა - საქართველოს კონსტიტუცია; მასალა - ვიკიპედიის რთული სტატია.",
        prompt:
          '"ქვემოთ მოცემული მაქვს რთული აკადემიური ტექსტი საქართველოს კონსტიტუციის ისტორიაზე. გთხოვ, გადაწერო და ადაპტირება გაუკეთო ამ ტექსტს მე-9 კლასელებისთვის 3 სხვადასხვა სირთულის დონედ: 1. საბაზისო დონე (გამოიყენე მარტივი წინადადებები და მოკლე აბზაცები - მათთვის, ვისაც უჭირს კითხვა); 2. სტანდარტული დონე; 3. მოწინავე, ანალიტიკური დონე (დაამატე კითხვები მოქალაქის პასუხისმგებლობაზე). აი, ტექსტი:\n\n$$აქ ჩასვამთ ვიკიპედიის სტატიას$$\n\n"',
        result:
          'შედეგი: AI საბაზისო დონისთვის ტექსტს აქცევს მოკლე, გასაგებ წესების კრებულად ("კონსტიტუცია არის ქვეყნის მთავარი წესების წიგნი"), ხოლო მოწინავე დონისთვის დაამატებს სამართლებრივ ქეისებს, მაგალითად: "როგორ ფიქრობ, რატომ არის მნიშვნელოვანი ადამიანის უფლებების დაცვა კონსტიტუციით?".',
      },
      {
        title: "მაგალითი 2 (ბიოლოგია):",
        parameters: "პარამეტრები: თემა - იმუნური სისტემა; კლასი - მე-8.",
        prompt:
          '"ქვემოთ მოცემული მაქვს სახელმძღვანელოს ტექსტი ადამიანის იმუნურ სისტემაზე (ლეიკოციტები, ფაგოციტოზი). გთხოვ, გადაწერო ტექსტი 3 დონედ: 1. საბაზისო დონე (გამოიყენე \'ორგანიზმის ჯარისკაცების\' და \'ციხესიმაგრის\' ანალოგიები); 2. სტანდარტული დონე; 3. მოწინავე დონე (ჩართე დამატებითი ინფორმაცია აუტოიმუნურ დაავადებებზე). აი, ტექსტი:\n\n$$ჩასვით წიგნის ტექსტი$$\n\n"',
        result:
          'შედეგი: საბაზისო დონის ტექსტში რთული ბიოლოგიური ტერმინები ("ფაგოციტოზი") ჩანაცვლდება ან აიხსნება მარტივი ასოციაციებით ("როგორ შთანთქავს მცველი ბაქტერიას"), რაც სპეციალური საგანმანათლებლო საჭიროების (სსსმ) მქონე მოსწავლეებს მასალის გაგებაში დაეხმარება.',
      },
      {
        title: "მაგალითი 3 (ქართული ენა და ლიტერატურა):",
        parameters: 'პარამეტრები: თემა - ილია ჭავჭავაძის პუბლიცისტიკა ("რა გითხრათ, რით გაგახაროთ?"); კლასი - მე-10.',
        prompt:
          '"ქვემოთ მოცემულია ილია ჭავჭავაძის წერილი \'რა გითხრათ, რით გაგახაროთ?\'. ტექსტი შეიცავს არქაულ ლექსიკას და რთულ სინტაქსს. გთხოვ, დაამუშავო ეს ტექსტი 3 ვერსიად: 1. საბაზისო დონე (შეინარჩუნე მთავარი აზრი, მაგრამ სრულად გაამარტივე ენა და განმარტე ძველი სიტყვები ფრჩხილებში); 2. სტანდარტული დონე (დატოვე ავტორის სტილი, მაგრამ დაურთე ლექსიკონი აბზაცების ბოლოს); 3. მოწინავე დონე (ტექსტის გარდა, დაამატე 2-3 კრიტიკული კითხვა ტექსტის ქვეტექსტებსა და ირონიაზე). აი, ტექსტი:\n\n$$ჩასვით ილიას წერილი$$\n\n"',
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
      '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე:\n\n$$თემა$$\n\n, მე-\n\n$$კლასი$$\n\nკლასისთვის. ტრადიციული კითხვების ნაცვლად, მოიფიქრე 1 საინტერესო, რეალურ ცხოვრებასთან დაკავშირებული პრობლემური სცენარი. ამ სცენარის ბაზაზე, დაუწერე 4 პრაქტიკული დავალება/მისია, რომელიც მოსწავლემ ეტაპობრივად უნდა გადაჭრას საკუთარი ცოდნის გამოყენებით. დავალებები უნდა ავითარებდეს პრობლემის გადაჭრის უნარს."',
    examplesIntro: "💡 რეალური მაგალითები, თუ როგორ მუშაობს ეს:",
    examples: [
      {
        title: "მაგალითი 1 (მათემატიკა):",
        parameters: "პარამეტრები: თემა - პროცენტები და ბიუჯეტირება; კლასი - მე-6.",
        prompt:
          '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: პროცენტების გამოთვლა და ბიუჯეტირება, მე-6 კლასისთვის. ტრადიციული ამოცანების ნაცვლად, მოიფიქრე 1 საინტერესო, სკოლის ცხოვრებასთან დაკავშირებული სცენარი - კლასის ექსკურსიის დაგეგმვა კახეთში 500 ლარიანი ბიუჯეტით. ამ სცენარის ბაზაზე, დაუწერე 4 პრაქტიკული დავალება (მაგ: ტრანსპორტის 15%-იანი ფასდაკლების გამოთვლა), რომელიც მოსწავლემ ეტაპობრივად უნდა გადაჭრას."',
        result:
          "შედეგი: მოსწავლეები მიიღებენ დავალებას, სადაც მათ უნდა გამოთვალონ, ეყოფათ თუ არა 500 ლარი, თუ მიკროავტობუსი ღირს 250 ლარი (15% ფასდაკლებით), ხოლო მუზეუმის ბილეთი თითო ბავშვზე 3 ლარია.",
      },
      {
        title: "მაგალითი 2 (ინგლისური ენა):",
        parameters: "პარამეტრები: თემა - Food and Restaurant (საკვები და რესტორანი); კლასი - მე-8.",
        prompt:
          '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: Food and Restaurant Vocabulary, მე-8 კლასისთვის. მოიფიქრე 1 საინტერესო სცენარი: მოსწავლე მოგზაურობს ლონდონში და რესტორანში უნდა შეუკვეთოს საჭმელი მეგობრისთვის, რომელსაც აქვს ალერგია თხილეულსა და რძის პროდუქტებზე. ამ სცენარის ბაზაზე, დაუწერე 4 პრაქტიკული მისია (მაგ: მენიუს გაშიფვრა, მიმტანთან დიალოგის აწყობა)."',
        result:
          "შედეგი: AI შექმნის ინგლისურენოვან მენიუს და მოსწავლემ უნდა შეარჩიოს კერძები ისე, რომ არ დაარღვიოს ალერგიული შეზღუდვები და ჩაეტიოს კონკრეტულ ფასში, რაც ავითარებს წაკითხულის გააზრებას.",
      },
      {
        title: "მაგალითი 3 (სამოქალაქო განათლება):",
        parameters: "პარამეტრები: თემა - ადგილობრივი თვითმმართველობა და ბიუჯეტი; კლასი - მე-10.",
        prompt:
          '"შემიქმენი პრაქტიკული სამუშაო ფურცლის (Worksheet) შინაარსი თემაზე: ადგილობრივი ბიუჯეტის განაწილება, მე-10 კლასისთვის. მოიფიქრე რეალური სცენარი: მოსწავლეები არიან ქალაქის საკრებულოს წევრები. მათ აქვთ შეზღუდული ბიუჯეტი და უნდა გადაწყვიტონ - სკოლის სტადიონი გაარემონტონ თუ ახალი სკვერი გააშენონ. დაუწერე 4 პრაქტიკული დავალება, სადაც მოუწევთ მოსახლეობის ინტერესების აწონ-დაწონვა და არგუმენტირებული გადაწყვეტილების მიღება."',
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
      '"მე ვარ მასწავლებელი. გიგზავნი მოსწავლის ნაშრომს თემაზე:\n\n$$თემა$$\n\n. გთხოვ, შეაფასო ეს ნაშრომი 10-ბალიანი სისტემით შემდეგი 3 კრიტერიუმით: 1. არგუმენტაციის სიძლიერე; 2. ფაქტობრივი სიზუსტე; 3. სტრუქტურა და გრამატიკა. შეფასების შემდეგ, დამიწერე მოკლე, ემპათიური და განმავითარებელი უკუკავშირი მოსწავლისთვის (მისთვის გასაგებ, თბილ ენაზე). ჯერ შეუქე ძლიერი მხარეები, შემდეგ დელიკატურად მიუთითე 2 კონკრეტულ დეტალზე გამოსასწორებლად და დაასრულე მოტივაციით. ნაშრომი:\n\n$$ჩასვით მოსწავლის ტექსტი$$\n\n"',
    examplesIntro: "💡 რეალური, გამზადებული მაგალითები:",
    examples: [
      {
        title: "მაგალითი 1 (ქართული ენა და ლიტერატურა):",
        parameters: 'პარამეტრები: თემა - "ჩემი საყვარელი წიგნი"; კლასი - მე-6.',
        prompt:
          '"მე ვარ ქართული ენის მასწავლებელი. გიგზავნი მე-6 კლასელის ესეს თემაზე: \'ჩემი საყვარელი წიგნი\'. გთხოვ, შეაფასო ეს ნაშრომი 10-ბალიანი სისტემით 3 კრიტერიუმით: 1. შინაარსის გადმოცემა; 2. ფანტაზია და შემოქმედებითობა; 3. პუნქტუაცია და წინადადების სტრუქტურა. შეფასების შემდეგ, დამიწერე მოკლე, ემპათიური უკუკავშირი მოსწავლისთვის \'სენდვიჩის მეთოდით\' (პოზიტივი-კრიტიკა-პოზიტივი). ნაშრომი:\n\n$$აქ ჩასვით მოსწავლის ტექსტი$$\n\n"',
        result:
          'შედეგი: AI ჯერ შეაქებს ბავშვის კრეატიულ იდეებს (მაგ: "ძალიან მომეწონა, როგორ აღწერე მთავარი გმირი"), შემდეგ რბილად ურჩევს, როგორ დაიწყოს ახალი აბზაცი და დაასრულებს წამახალისებელი სიტყვებით.',
      },
      {
        title: "მაგალითი 2 (სამოქალაქო განათლება):",
        parameters: 'პარამეტრები: თემა - "უნდა იყოს თუ არა სასკოლო ფორმა სავალდებულო?"; კლასი - მე-10.',
        prompt:
          '"მე ვარ სამოქალაქო განათლების მასწავლებელი. გიგზავნი მე-10 კლასელის სადისკუსიო ნაშრომს თემაზე: \'უნდა იყოს თუ არა სასკოლო ფორმა სავალდებულო?\'. შეაფასე ნაშრომი 10-ბალიანი სისტემით: 1. არგუმენტაციის სიძლიერე; 2. კონტრარგუმენტების გაბათილება; 3. სტრუქტურა. დამიწერე განმავითარებელი უკუკავშირი, სადაც მიუთითებ 2 კონკრეტულ დეტალზე, რაც უნდა გააუმჯობესოს (მაგ: სტატისტიკის დამატება). ნაშრომი:\n\n$$აქ ჩასვით მოსწავლის ტექსტი$$\n\n"',
        result:
          "შედეგი: უკუკავშირი ფოკუსირებული იქნება იმაზე, თუ რამდენად ლოგიკურად მოჰყავს მოსწავლეს არგუმენტები. AI ზუსტად მიუთითებს აბზაცს, სადაც მოსწავლეს შეეძლო კვლევის ან სტატისტიკის მოყვანა თავისი პოზიციის გასამყარებლად.",
      },
      {
        title: "მაგალითი 3 (ისტორია):",
        parameters: "პარამეტრები: თემა - ისტორიული მოვლენის ანალიზი; კლასი - მე-11.",
        prompt:
          '"მე ვარ ისტორიის მასწავლებელი. გიგზავნი მე-11 კლასელის ანალიტიკურ ესეს. შეაფასე 3 კრიტერიუმით: 1. ფაქტობრივი სიზუსტე; 2. მიზეზ-შედეგობრივი კავშირების დანახვა; 3. აკადემიური ენა. დაუწერე მოსწავლეს პროფესიონალური, მაგრამ თბილი უკუკავშირი. ნაშრომი:\n\n$$აქ ჩასვით მოსწავლის ტექსტი$$\n\n"',
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

export default function TeachersAIGuideRead() {
  const [openMenu, setOpenMenu] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const masterclassHref = useMemo(getMasterclassHref, []);

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
        <title>უფასო გზამკვლევი: გადატვირთული მასწავლებლიდან AI-ით აღჭურვილ პროფესიონალამდე | BitCamp</title>
        <meta
          name="description"
          content="BitCamp-ის უფასო გზამკვლევი მასწავლებლებისთვის: 6 პრაქტიკული AI შაბლონი გაკვეთილების, ტესტების, სლაიდების და უკუკავშირის მოსამზადებლად."
        />
        <meta property="og:title" content="უფასო AI გზამკვლევი მასწავლებლებისთვის | BitCamp" />
        <meta property="og:type" content="article" />
      </Helmet>

      <main className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 teacher-guide-grid" aria-hidden="true" />
        <div className="absolute left-0 right-0 top-0 h-1 bg-[#df3342]" aria-hidden="true" />

        <header className="relative border-b border-[#293a52] bg-[#05091d]/96 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
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

        <section className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <GuideNav />
            </aside>

            <article className="min-w-0">
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
                <h1 className="relative z-10 max-w-4xl text-3xl font-black leading-tight text-[#fff4e8] sm:text-5xl">
                  გადატვირთული მასწავლებლიდან — AI-ით აღჭურვილ პროფესიონალამდე
                </h1>
                <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
                  <Stat label="შაბლონი" value="6" />
                  <Stat label="სამუშაო დრო" value="15 წუთი" />
                  <Stat label="ფოკუსი" value="პრაქტიკა" />
                </div>
              </section>

              <section className="mt-8 grid gap-5" id="intro">
                <div className="border border-[#293a52] bg-[#071025] p-5 sm:p-7">
                  <h2 className="text-2xl font-black text-[#fff4e8]">
                    შესავალი: დროა, დავიბრუნოთ ჩვენი ენერგია და თავისუფალი დრო
                  </h2>
                  <div className="mt-5 space-y-4 text-base leading-8 text-[#d6e0eb]">
                    {introParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center border border-[#293a52] bg-[#0d1730] p-5 sm:p-6">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
                      🚀 პრაქტიკული ნაწილი
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#fff4e8]">
                      6 ჯადოსნური შაბლონი (Prompt)
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#c7d3df]">
                      გამოყენების ინსტრუქცია: დააკოპირეთ ქვემოთ მოცემული გამზადებული შაბლონები, სურვილის
                      შემთხვევაში შეცვალეთ მონაცემები და გაუგზავნეთ ChatGPT-ს ან Claude-ს.
                    </p>
                  </div>
                  <a
                    href="#lesson-plan"
                    className="inline-flex items-center justify-center gap-2 bg-[#fff4e8] px-4 py-3 text-sm font-black text-[#05091d]"
                  >
                    დაწყება
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </section>

              <div className="mt-8 space-y-8">
                {guideSections.map((section) => (
                  <GuideSectionCard
                    key={section.id}
                    section={section}
                    copiedKey={copiedKey}
                    onCopy={copyPrompt}
                  />
                ))}
              </div>

              <section
                id="next-step"
                className="mt-8 border border-[#df3342]/70 bg-[#071025] p-5 shadow-[6px_6px_0_#df3342] sm:p-7"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
                  🎁 რა არის შემდეგი ნაბიჯი? (ჩვენი მთავარი შეთავაზება)
                </p>
                <div className="mt-5 space-y-4 text-base leading-8 text-[#d6e0eb]">
                  <p>
                    ეს დოკუმენტი მხოლოდ აისბერგის მწვერვალია. ხელოვნურ ინტელექტს შეუძლია ბევრად მეტი, ვიდრე
                    უბრალოდ ტექსტების გენერირება.
                  </p>
                  <p>
                    თუ გსურთ, რომ ეს ყველაფერი პრაქტიკაში ნახოთ, ისწავლოთ დამალული ხრიკები და გაიგოთ, თუ როგორ
                    უნდა აქციოთ AI თქვენს უძლიერეს პროფესიულ იარაღად, გიწვევთ BitCamp - ის უფასო ონლაინ
                    მასტერკლასზე.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 border border-[#293a52] bg-[#05091d] p-4 sm:grid-cols-3">
                  <InfoTile icon={<Sparkles size={18} />} label="🎯 თემა" value="როგორ ვაქციოთ AI ჩვენს საუკეთესო ასისტენტად — პრაქტიკული ვორქშოფი მასწავლებლებისთვის." />
                  <InfoTile icon={<CalendarDays size={18} />} label="დრო" value="შაბათი, 6 ივნისი, 2026 · 13:00" />
                  <InfoTile icon={<GraduationCap size={18} />} label="💻 ფორმატი" value="პირდაპირი ეთერი (Zoom/Google Meet), სადაც ეკრანის გაზიარებით, თქვენს თვალწინ შევქმნი რეალურ გაკვეთილებსა და ტესტებს." />
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
              <GuideNav onNavigate={() => setOpenMenu(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function GuideNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="sticky top-6 border border-[#293a52] bg-[#071025] p-4">
      <p className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">სარჩევი</p>
      <div className="space-y-2">
        <NavLink href="#intro" onNavigate={onNavigate}>
          შესავალი
        </NavLink>
        {guideSections.map((section) => (
          <NavLink key={section.id} href={`#${section.id}`} onNavigate={onNavigate}>
            {section.number}. {section.title}
          </NavLink>
        ))}
        <NavLink href="#next-step" onNavigate={onNavigate}>
          შემდეგი ნაბიჯი
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({ href, children, onNavigate }: { href: string; children: ReactNode; onNavigate?: () => void }) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="block border border-transparent px-3 py-2 text-sm font-semibold leading-5 text-[#c7d3df] transition hover:border-[#293a52] hover:bg-[#0d1730] hover:text-[#fff4e8]"
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
              {example.parameters && <p className="mb-4 text-sm font-semibold leading-6 text-[#c7d3df]">{example.parameters}</p>}
              <PromptBlock
                title="გამზადებული შაბლონი (Prompt):"
                text={example.prompt}
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
  copied,
  onCopy,
  className = "",
}: {
  title: string;
  text: string;
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
      <pre className="whitespace-pre-wrap break-words p-4 font-sans text-sm leading-7 text-[#d6e0eb]">{text}</pre>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#293a52] bg-[#05091d] p-4">
      <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#9fb0c3]">{label}</p>
      <p className="mt-1 text-xl font-black text-[#fff4e8]">{value}</p>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 flex h-8 w-8 flex-none items-center justify-center bg-[#df3342] text-[#fff4e8]">
        {icon}
      </span>
      <div>
        <p className="font-black text-[#fff4e8]">{label}</p>
        <p className="mt-1 text-sm leading-6 text-[#c7d3df]">{value}</p>
      </div>
    </div>
  );
}
