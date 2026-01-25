# Implementation Plan: AI Prompt Engineering Landing Page (`/ai`)

## Overview

Create a high-conversion landing page at `/ai` for the "AI პრომპტ-ინჟინერიის და ავტომატიზაციის Mega პროგრამა" course. The page will follow existing design patterns while presenting the 6-module curriculum in an engaging, sales-optimized way.

---

## File Structure

```
src/
├── pages/
│   └── AIPromptEngineering.tsx          # Main page component
├── components/
│   └── ai-course/
│       ├── AIHero.tsx                   # Hero section with main value prop
│       ├── AICurriculumModules.tsx      # 6-module curriculum display
│       ├── AITestimonials.tsx           # Social proof (dummy testimonials)
│       ├── AIWhoIsThisFor.tsx           # Target audience section
│       ├── AIFinalProject.tsx           # Capstone project showcase
│       ├── AIPricing.tsx                # Pricing section
│       ├── AIFAQ.tsx                    # FAQ specific to this course
│       └── AITransformationPath.tsx     # Before/after transformation
```

---

## Section-by-Section Plan

### 1. AIHero.tsx - Hero Section
- **Headline**: "AI პრომპტ-ინჟინერიის Mega პროგრამა: ნულიდან AI არქიტექტორამდე"
- **Subheadline**: Focus on "no coding required" value prop
- Scarcity badge: "400+ სტუდენტმა უკვე შეიძინა"
- Live viewer counter (reuse existing pattern)
- Dual CTAs: "იხილე პროგრამა" + "ჩაეწერე"
- Trust indicators: "პროგრამირების გარეშე", "6 მოდული", "n8n ავტომატიზაცია"
- Use `EpicPixelBackground` component

### 2. AIWhoIsThisFor.tsx - Target Audience
Three-column grid showing ideal students:
- მარკეტერები & კონტენტ-მენეჯერები
- ბიზნეს მფლობელები & ანალიტიკოსები
- ტექნოლოგიით დაინტერესებული არა-პროგრამისტები

### 3. AICurriculumModules.tsx - The 6-Module Curriculum (MAIN FEATURE)
Visual timeline/card layout showing all 6 modules:

| Module | Color Theme | Icon | Key Topics |
|--------|-------------|------|------------|
| 🟢 Module 1: T.C.R.E.I. Framework | Green | `MessageSquare` | LLM basics, Task, Context, References, Evaluate |
| 🔵 Module 2: Advanced Prompting | Blue | `Brain` | Chain of Thought, Prompt Chaining, Structured Data |
| 🟠 Module 3: Business Use Cases | Orange | `Briefcase` | Content marketing, Analytics, Communication |
| 🟣 Module 4: Multimodal AI | Purple | `Image` | DALL-E, Vision, Data conversation |
| 🔴 Module 5: Custom GPTs & Gems | Red | `Bot` | Custom Instructions, Knowledge Base, Actions |
| 🔥 Module 6: n8n Automation | Gradient | `Workflow` | Webhooks, RAG, Vector stores, Agents |

Each module card expands to show subtopics.

### 4. AIFinalProject.tsx - Capstone Project
- "შექმენი ავტონომიური AI სისტემა რომელიც აერთიანებს ყველა მოდულს"
- Visual diagram showing how modules connect
- Example use cases for final projects

### 5. AITestimonials.tsx - Social Proof
6 dummy testimonials (will be replaced with real ones):
- Mix of roles: მარკეტერი, ბიზნეს მფლობელი, HR მენეჯერი, etc.
- Each highlighting different module benefits

### 6. AITransformationPath.tsx - Before/After
Split comparison:
- **უამისო**: ხელით ყველაფერი, დროის კარგვა, შეცდომები
- **ამ კურსის შემდეგ**: ავტომატიზაცია, AI აგენტები, პროდუქტიულობა

### 7. AIPricing.tsx - Pricing Section
- Single-tier or multi-tier pricing
- Highlight what's included
- Scarcity/urgency elements
- CTA button with Tally form integration

### 8. AIFAQ.tsx - FAQ
Accordion-based FAQ:
- "პროგრამირება საჭიროა?" → არა
- "რა ხანგრძლივობისაა?" → 6 მოდული, თვითნაბიჯი
- "რა ინსტრუმენტებს ვისწავლი?" → ChatGPT, Claude, DALL-E, n8n, etc.
- "რა მივიღებ დასრულების შემდეგ?"

---

## Visual Consistency

- Reuse existing Tailwind classes: `pixel-border`, `pixel-shadow`, `card-hover`
- Color variables: `secondary` (red), `accent` (green), `premium` (gold)
- Typography: Georgian fonts (`font-georgian`), Orbitron for headings
- Gradients: `bg-gradient-hero`, `bg-gradient-card`
- Animations: `animate-pulse`, `pixel-float`, `fade-in`

---

## Routing Update

Update `src/App.tsx`:
```tsx
import AIPromptEngineering from "./pages/AIPromptEngineering";
// ...
<Route path="/ai" element={<AIPromptEngineering />} />
```

---

## Responsive Design

- Mobile-first approach matching existing patterns
- Breakpoints: `sm:`, `md:`, `lg:` as used in Hero.tsx
- Stack modules vertically on mobile, grid on desktop

---

## Key Conversion Elements

1. **Social proof**: 400+ students already enrolled
2. **Scarcity**: "ნაკადი ივსება" badge
3. **Authority**: Detailed curriculum (transparency builds trust)
4. **Risk reversal**: Clear what they'll learn
5. **Multiple CTAs**: Top, middle, and bottom of page
6. **Sticky CTA bar**: Reuse `StickyCtaBar` component

---

## Files to Create (9 total)

1. `src/pages/AIPromptEngineering.tsx` - Main page
2. `src/components/ai-course/AIHero.tsx`
3. `src/components/ai-course/AICurriculumModules.tsx`
4. `src/components/ai-course/AITestimonials.tsx`
5. `src/components/ai-course/AIWhoIsThisFor.tsx`
6. `src/components/ai-course/AIFinalProject.tsx`
7. `src/components/ai-course/AITransformationPath.tsx`
8. `src/components/ai-course/AIPricing.tsx`
9. `src/components/ai-course/AIFAQ.tsx`

## Files to Modify (1)

1. `src/App.tsx` - Add route for `/ai`

---

## Progress Tracking

- [x] Create ai-course directory
- [x] AIHero.tsx (160 lines)
- [x] AIWhoIsThisFor.tsx (140 lines)
- [x] AICurriculumModules.tsx (278 lines)
- [x] AIFinalProject.tsx (145 lines)
- [x] AITestimonials.tsx (150 lines)
- [x] AITransformationPath.tsx (151 lines)
- [x] AIPricing.tsx (174 lines)
- [x] AIFAQ.tsx (105 lines)
- [x] AIPromptEngineering.tsx (65 lines)
- [x] Update App.tsx routing

**Total: ~1,368 lines of code created**

## Build Status: ✅ SUCCESS
