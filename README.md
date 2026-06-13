# Stardance Learn

An adaptive learning app for kids and teens (ages 5–18). Pick a subject, answer
questions, and your guide **Cosmo** adjusts the difficulty as you go — leveling
you up after a couple of correct answers in a row, or stepping back to give
you a refresher if things get tricky.

## Subjects

- **Math** — Algebra 2: linear equations, systems of equations, quadratics,
  exponents & polynomials, functions & graphing.
- **Biology** — nature of science, characteristics of life, macromolecules,
  cell theory & transport, cellular processes, ecosystems & energy flow, DNA,
  protein synthesis, mutations, mitosis & meiosis.

Space and Coding modules are planned but not yet available.

## How it works

- **Adaptive difficulty** — each topic tracks a tier (1–5). Two correct
  answers in a row level you up; two incorrect answers in a row level you
  down. Reaching tier 5 with a correct streak marks the topic mastered.
- **XP & progress** — correct answers earn XP scaled by the current tier;
  progress per topic is saved locally in the browser.
- **AI tutor (optional)** — on devices with WebGPU, the app can run a small
  language model (Llama 3.2, 1B or 3B) directly in the browser via
  [WebLLM](https://github.com/mlc-ai/web-llm) to generate extra practice
  questions and tailored explanations. Without WebGPU, the app falls back to
  a built-in question bank — everything still works.
- **Voice** — questions and feedback can optionally be read aloud.
- **Privacy-friendly** — no backend; all profile data and AI inference stay
  on-device.

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # type-check and build for production
npm run lint     # run ESLint
npm run preview  # preview the production build
```

## Tech stack

React, TypeScript, Vite, React Router, Tailwind CSS, and
[@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) for in-browser AI.
