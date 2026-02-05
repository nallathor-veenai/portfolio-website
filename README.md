# JV's Portfolio

My personal portfolio site with a resume chatbot and voice intro.

## Pages

**Profile** - My links, contact info, and a PDF resume viewer

**Chat** - People can ask questions about my experience and projects. Supports voice input via the mic button.

**Voice** - A 30-second audio version of my resume, generated with Chatterbox TTS

## Running locally

```bash
npm install
npm run dev
```

## Updating content

To change my info, I edit `src/data/resumeData.ts` directly, or use the updater script:

```bash
# Update from a new resume docx
python dataUpdater.py --resume path/to/new_resume.docx

# Update GitHub projects only
python dataUpdater.py --github-only

# Update without regenerating audio
python dataUpdater.py --resume JRNarrative.docx --no-audio
```

The PDF resume at `public/JV-Resume.pdf` needs to be updated manually - the script doesn't touch it.

## Voice audio

The voice intro is pre-generated. To regenerate it after changing the resume text:

```bash
python voice_server.py
```

Uses Chatterbox TTS if installed, otherwise falls back to macOS text-to-speech.
