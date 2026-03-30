<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9c7d58eb-07df-4ea0-aee7-e4397434cd28

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` from `.env.example` and set your Gemini key:
   `GEMINI_API_KEY=your_key_here`
3. Ensure required entry styles file exists:
   `index.css`
4. Validate the project:
   `npm run lint`
5. Run the app:
   `npm run dev`

## Required Local Files

- `.env.local` (local only, not committed)
- `index.css` (imported by `index.html`)

## Troubleshooting

- **Error: Cannot find type definition file for 'node'**
  Run `npm install` to install dev dependencies.
- **Missing Gemini key / AI features disabled**
  Ensure `GEMINI_API_KEY` is present in `.env.local`.
- **Missing stylesheet warning for `/index.css`**
  Ensure `index.css` exists at the project root.
