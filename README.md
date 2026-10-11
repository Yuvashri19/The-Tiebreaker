# The Tiebreaker ⚖️

> An AI-powered decision analysis and matrix platform that helps weigh criteria, visualize pros and cons, run SWOT matrices, and compare choices with real-time weighted scoring to resolve tough dilemmas.

---

## 🌟 Overview

Making critical career, architectural, business, or lifestyle decisions often leads to analysis paralysis. **The Tiebreaker** provides a structured, objective decision framework powered by Gemini 2.5 Flash to deconstruct complex dilemmas into actionable insights:

- **Executive Verdict & Strategic Roadmap**: Objective recommendation with a confidence score, core rationale, trade-off analysis, and a 3-step immediate action plan.
- **Weighted Pros & Cons**: Comprehensive impact evaluation for each option with severity/benefit scoring. Add, customize, or remove factors on the fly.
- **SWOT Analysis Matrix**: Clear quadrant visualization of internal Strengths & Weaknesses alongside external Opportunities & Threats.
- **Dynamic Weighted Comparison Matrix**: Fully interactive multi-criteria decision table. Adjust criterion importance weights, score options from 1 to 10, add custom metrics, and watch ranked scores calculate in real-time.
- **Scenario Library & History**: Pre-loaded with realistic dilemmas (e.g., Tech Stack Migration, City Relocation, Job Offer vs. Startup) and automatic browser persistence for all your sessions.

---

## 🛠️ Technology Stack

- **Frontend**:
  - [React 19](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Motion](https://motion.dev/) (Smooth layout transitions)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
  - [@google/genai](https://www.npmjs.com/package/@google/genai) SDK (Google Gemini 2.5 Flash)
  - [dotenv](https://github.com/motdotla/dotenv)
- **Tooling & Build**:
  - [Vite 6](https://vitejs.dev/) (Client bundler and dev server middleware)
  - [tsx](https://github.com/privatenumber/tsx) (TypeScript Node execution)
  - [esbuild](https://esbuild.github.io/) (Server production packaging)

---

## 📂 Project Structure

```
├── assets/             # Static graphics and icons
├── src/
│   ├── components/     # React modular UI components
│   │   ├── ComparisonMatrix.tsx  # Dynamic multi-attribute scoring grid
│   │   ├── DecisionForm.tsx      # Dilemma input form with presets
│   │   ├── Header.tsx            # Navigation header & branding
│   │   ├── HistorySidebar.tsx    # Saved sessions & sample selector
│   │   ├── ProsConsPanel.tsx     # Weighted factor evaluation
│   │   ├── SWOTPanel.tsx         # 4-quadrant SWOT matrix
│   │   └── VerdictPanel.tsx      # Strategic recommendation & roadmap
│   ├── sampleDecisions.ts        # Pre-configured high-fidelity sample decisions
│   ├── types.ts                  # Shared TypeScript interfaces
│   ├── App.tsx                   # Main application layout & state management
│   ├── main.tsx                  # React DOM entry point
│   └── index.css                 # Global CSS with Tailwind styling
├── server.ts           # Express backend with Gemini API proxy & Vite middleware
├── index.html          # HTML5 entry template with OpenGraph meta tags
├── package.json        # Dependencies and build scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── .env.example        # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A Google Gemini API Key (obtain from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and configure your API key:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and supply your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   PORT=3000
   ```

---

## 💻 Development & Build Scripts

- **Run in Development Mode**:
  ```bash
  npm run dev
  ```
  Starts the full-stack server on `http://localhost:3000` with hot-module reloading and backend API routing.

- **Typecheck & Lint**:
  ```bash
  npm run lint
  ```
  Runs `tsc --noEmit` across all TypeScript files.

- **Build for Production**:
  ```bash
  npm run build
  ```
  Compiles the Vite client into `dist/` and bundles `server.ts` into `dist/server.cjs`.

- **Run Production Server**:
  ```bash
  npm run start
  ```
  Launches the production Node.js Express server serving the compiled SPA assets.

---

## 🔒 Security & Privacy

- All API calls to Gemini occur strictly server-side (`/api/decision/analyze`), ensuring your `GEMINI_API_KEY` is never exposed to client browsers.
- Local sessions and custom criteria weights are saved locally in the browser via `localStorage`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
