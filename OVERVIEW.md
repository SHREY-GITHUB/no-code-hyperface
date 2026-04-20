# Hyperface Studio

### A no code configurator for credit card onboarding journeys

---

## What it is

Hyperface Studio is a no code tool for designing and managing credit card onboarding journeys. When a bank or fintech launches a new card, they need to decide what information to collect from applicants, how to verify their identity, how to run credit checks, and how to handle agreements. Today that process usually involves engineering every single time something changes. Hyperface Studio removes that dependency entirely.

A product manager can open the tool, configure a full multi stage journey in minutes, preview exactly what the applicant will see on their phone, and publish it. No code, no sprint planning, no waiting.

---

## Why I built it

The interesting problem in onboarding is not the engineering, it is the iteration speed. Every small tweak to a form field, every new verification method, every adjustment to the bureau logic currently needs a developer in the loop. That is a huge drag on how quickly a fintech can experiment and optimise conversion.

I wanted to build a tool that lets the people who actually own the journey, which is product managers and growth teams, make those changes themselves. The configuration should be visual, the preview should be instant, and the output should be something a mobile app can consume directly.

---

## What you can do with it today

### Dashboard

The homepage gives you a view of every card program you are running. You can see which ones are live and which are drafts, along with application volumes, conversion rates, and when each one was last modified. From here you either open an existing program to edit it, or create a new one from scratch.

### Creating a new program

Clicking **New Program** opens a quick modal where you name the program, add a short description, and pick a colour scheme. Once created, the program shows up on the dashboard with its own branding and opens the editor pre configured.

### The journey editor

The editor is built around four configurable stages.

**Application Form**
Choose which fields to show applicants, mark them as required or optional, add helpful hints, and group them across multiple pages. You can also set validation rules for things like minimum income or age.

**Bureau and Decisioning**
Controls how the credit check runs and what happens at each outcome. You can configure approval logic, manual review queues, and decline flows with adverse action notices.

**KYC Verification**
Toggle verification methods on and off. Today it supports Aadhaar OTP, Video KYC, DigiLocker, and manual document upload. A product manager can enable exactly the methods they want without touching any code.

**Agreement and Consent**
Handles the legal documents an applicant signs before their card is issued.

Each stage can be toggled off, reordered by drag and drop, and configured independently.

### Live preview and full preview mode

A live preview panel on the right of the editor updates in real time as you configure the journey. For a deeper look, full screen Preview Mode simulates the actual applicant experience with proper mobile animations, screen transitions, and realistic card data.

Demo scenarios let you trigger specific outcomes without needing real credit bureau data. You can force a bureau failure, route the application to manual review, or simulate a low score decline to test every branch of the journey.

---

## Tech stack

The stack is intentionally lean. Every choice here was made to keep the app fast, simple, and easy for anyone to pick up.

**Frontend**
- **React 18** for the UI, using functional components and hooks throughout
- **Vite 6** as the build tool and dev server, which gives near instant hot reloads during development
- **Tailwind CSS 3** for utility styling, combined with custom CSS variables for the design tokens
- **Inter** as the primary typeface, loaded via system font stack for performance

**Architecture choices**
- No external UI component library, every button, card, modal, and toggle is built from scratch for full control over the design
- No state management library, state is lifted to the root `App.jsx` and prop drilled intentionally since the app is small enough that this stays clean
- No routing library, navigation between the home dashboard, editor, and preview mode is handled with simple boolean state flags

**Deployment and tooling**
- **Git** for version control
- **GitHub** as the remote repository
- **Vercel** for production hosting, with automatic deploys on every push to main
- **Claude Code** as the AI pair programmer used throughout the build

---

## How it is built

The application is a single page React app built on Vite, with no external UI library. The design system, colours, shadows, typography, and animation keyframes, is all custom and consistent throughout.

State is lifted to the root component, which keeps the code easy to reason about and extend. There is no routing library, no state management library, just React state and clean prop flow.

The preview animations use GPU accelerated CSS transitions with carefully managed React keys so that screens preserve their internal state during slide transitions. The bureau animation does not reset mid slide, and the form page does not jump back to page one when you navigate away. That kind of detail took real iteration to get right.

---

## How I built and deployed it

This part matters as much as the product itself, because it shows the actual workflow of going from an idea to something running in production.

### Step one, identifying the problem

I started by thinking about where product teams get slowed down the most in a fintech. Onboarding kept coming up. Every credit card product I looked at had the same pattern. A product manager wants to change a field, tweak a verification method, or adjust a bureau rule, and it becomes an engineering ticket that waits in a backlog. That gap between wanting a change and shipping it is where conversion gets left on the table. So the problem I picked was, how do you let the product team own the journey end to end without engineering being in the loop for every change.

### Step two, designing the product

Before writing any code I mapped out the four core stages of a card journey on paper. Application form, bureau and decisioning, KYC, agreement and consent. Then I sketched what the editor should look like, how the preview should feel, and what the homepage should surface. Keeping the scope tight was the key decision here, four stages is enough to demonstrate the pattern without the tool becoming a complicated configurator in itself.

### Step three, building with Claude Code

I used Claude Code as my pair programmer for the entire build. My workflow was to describe what I wanted in plain English, let Claude generate the component, then iterate on the small details.

The iteration was constant. I would ask for a card layout, then refine the spacing, then the shadows, then the hover states, then the dark mode, then the animations. Every small detail went through several rounds. When a CSS transition did not feel right, I would describe the glitch in words and Claude would debug the React key behaviour or the animation fill mode. When the drag and drop on the stage list felt clunky, a few passes fixed it.

I also used Claude to catch regressions. Before pushing anything to main, I would ask it to run through a QA checklist and verify nothing was broken. That checklist eventually got written into the `CLAUDE.md` file so every future session picked it up automatically.

### Step four, version control

I initialised a Git repo locally and created a repository on GitHub called `no-code-hyperface`. Every meaningful change got committed with a clear message. I used the terminal directly for all Git operations, `git add`, `git commit`, `git push`, rather than a GUI, so the commit history stays clean and the workflow stays fast.

Commits are grouped by feature, so when the interviewer looks at the history they can see the logical progression. First the scaffolding, then the editor, then the preview mode, then the daylight mode design overhaul, then the homepage, then the new program modal with colour picker, and so on.

### Step five, deploying to production with Vercel

Once the first working version was on GitHub I connected the repo to Vercel. This was genuinely a two minute setup. Vercel auto detected the Vite project, ran `npm run build`, and served the `dist` folder from its global CDN. The result was a live production URL that I could share with anyone.

From that point on, deploying became zero effort. Every `git push origin main` triggers an automatic Vercel build and pushes the new version to production within about thirty seconds. No manual deploy step, no uploading files, no server to manage.

### Step six, iterating in production

With the deploy pipeline set up, the feedback loop became very short. I could make a change, push it, and have it live in under a minute. When I caught a bug or wanted to polish something, the fix and the deploy were essentially the same action. That tight loop is what let me iterate so heavily on the design details without feeling slowed down by operations.

---

## Future enhancements

There is a lot of room to push this further. Here is what I would prioritise next.

### More journey stages

The four stages today cover the common case but a real onboarding flow has many more configurable steps.

- **Payments stage** to plug in a custom payment gateway for the joining fee or first EMI
- **GST verification** for business credit cards where you need to validate the applicant's registered business
- **Disbursement configuration** for how the credit limit gets issued and what the draw down rules are
- **Better onboarding flows** with conditional branching, so the journey adapts to the applicant rather than running everyone through the same linear path

### Richer verification methods

KYC today has four methods. A production version could add bank statement analysis, salary slip OCR, video liveness checks, and cross referencing against government databases, all as toggleable options that a product manager can switch on in seconds.

### Real analytics

The analytics panel today shows illustrative numbers. Wiring it up to real journey telemetry would be a major step up. Imagine seeing drop off rates at each individual field, time spent on each screen, bureau approval rates segmented by applicant type, and conversion funnels broken down by cohort. That would turn Hyperface Studio from a configuration tool into a conversion optimisation tool.

### Real publishing

Publishing today is a visual step. The most impactful enhancement would be making it genuinely go live. When a product manager clicks Publish, the configuration should generate a versioned API endpoint that the mobile app consumes dynamically. A change to the applicant journey would then go live within minutes, with zero engineering deployment needed. This is the change that would actually deliver on the no code promise end to end.

### Better theming and branding

Colour theming today is a set of six presets. A future version could let you bring in your brand's exact colours, logo, fonts, and visual identity, so the preview accurately represents what your applicants will actually see, rather than showing a generic template.

### Smarter colour coding and program organisation

As the number of programs grows, a single grid view starts to get crowded. Grouping by status, by bank, by product line, plus filters and search, would make it easier to manage a large portfolio.

---

## Closing thought

What I tried to build is not just a form builder. It is an attempt to show how the onboarding journey, which is one of the highest leverage parts of any credit product, can be owned end to end by the product team rather than being gated by engineering. The stack is intentionally simple, the state model is intentionally flat, and the design is intentionally clean, because the whole point is that a tool like this should feel effortless to use and easy to extend.
