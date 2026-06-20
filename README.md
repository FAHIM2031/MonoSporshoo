
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
