#!/usr/bin/env python3
"""
Data Updater for Portfolio Website

This script updates the portfolio website data from:
1. A .docx resume file
2. GitHub repositories

It regenerates:
- src/data/resumeData.ts (TypeScript data file)
- public/audio/resume_voice.wav (30-second voice summary)

Usage:
    python dataUpdater.py --resume path/to/resume.docx

Note: This does NOT update the static JV-Resume.pdf file.
      Place your custom PDF in public/JV-Resume.pdf manually.

Requirements:
    pip install python-docx requests

For voice generation (optional):
    pip install chatterbox-tts torch torchaudio
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Optional

# Try to import docx, provide helpful error if not installed
try:
    from docx import Document
except ImportError:
    print("Error: python-docx not installed")
    print("Install with: pip install python-docx")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("Error: requests not installed")
    print("Install with: pip install requests")
    sys.exit(1)


# Configuration
PROJECT_ROOT = Path(__file__).parent
DATA_FILE = PROJECT_ROOT / "src" / "data" / "resumeData.ts"
AUDIO_FILE = PROJECT_ROOT / "public" / "audio" / "resume_voice.wav"
GITHUB_USERNAME = "nallathor-veenai"


def extract_text_from_docx(docx_path: Path) -> str:
    """Extract all text from a .docx file."""
    doc = Document(docx_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)


def parse_resume(text: str) -> dict:
    """Parse resume text into structured data."""
    data = {
        'name': '',
        'email': '',
        'phone': '',
        'location': '',
        'linkedin': '',
        'github': '',
        'summary': '',
        'coreExpertise': {
            'aiml': [],
            'leadership': [],
            'technical': []
        },
        'experience': [],
        'education': {
            'degree': '',
            'period': '',
            'institution': '',
            'honors': '',
            'activities': ''
        }
    }

    lines = text.split('\n')

    # Extract name (usually first line)
    for line in lines:
        if line.strip():
            # Look for name pattern - usually contains (JV) or similar
            if '(' in line and ')' in line:
                data['name'] = line.strip()
                break
            elif not '@' in line and not 'http' in line.lower():
                data['name'] = line.strip()
                break

    # Extract contact info
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        data['email'] = email_match.group()

    phone_match = re.search(r'\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}', text)
    if phone_match:
        data['phone'] = phone_match.group()

    # Location (look for city, state pattern)
    location_match = re.search(r'(Seattle|San Francisco|New York|Austin|Boston)[\s,]+\w{2}', text, re.IGNORECASE)
    if location_match:
        data['location'] = location_match.group()

    # LinkedIn
    linkedin_match = re.search(r'https?://(?:www\.)?linkedin\.com/[\w/-]+', text)
    if linkedin_match:
        data['linkedin'] = linkedin_match.group()

    # GitHub
    github_match = re.search(r'https?://github\.com/[\w-]+', text)
    if github_match:
        data['github'] = github_match.group()

    # Summary - look for text after name/contact and before sections
    summary_patterns = [
        r"I'm seeking.*?(?=CORE|EXPERTISE|EXPERIENCE|EDUCATION|\n\n\n)",
        r"seeking.*?leadership.*?(?=CORE|EXPERTISE|EXPERIENCE)",
    ]
    for pattern in summary_patterns:
        summary_match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if summary_match:
            data['summary'] = summary_match.group().strip()
            break

    # AI/ML expertise
    aiml_patterns = ['LLM', 'generative AI', 'RAG', 'ML classifier', 'prompt engineering',
                     'conversational AI', 'machine learning', 'GenAI']
    for pattern in aiml_patterns:
        if pattern.lower() in text.lower():
            data['coreExpertise']['aiml'].append(pattern)

    # Extract experience sections
    exp_section = re.search(r'(SDM|SDE|Manager|Engineer).*?(?=EDUCATION|$)', text, re.DOTALL | re.IGNORECASE)
    if exp_section:
        # Parse individual roles
        roles = re.findall(r'(SDM|SDE\d?)[,\s]+([^(]+)\((\d{4}-\d{4}|\d{4}-Present)\)', text, re.IGNORECASE)
        for role in roles:
            data['experience'].append({
                'title': f"{role[0]}, {role[1].strip()}",
                'period': role[2],
                'subtitle': '',
                'highlights': [],
                'keywords': []
            })

    # Education
    edu_match = re.search(r'B\.?S\.?\s+.*?Computer Science.*?(\d{4}\s*[-–]\s*\d{4})', text, re.IGNORECASE)
    if edu_match:
        data['education']['degree'] = 'B.S. Computer Science and Engineering'
        data['education']['period'] = edu_match.group(1)

    college_match = re.search(r'College of Engineering.*?(?:University|India)', text, re.IGNORECASE)
    if college_match:
        data['education']['institution'] = college_match.group()

    gpa_match = re.search(r'CGPA[:\s]+(\d+\.\d+/\d+)', text, re.IGNORECASE)
    if gpa_match:
        data['education']['honors'] = f"CGPA: {gpa_match.group(1)}"

    return data


def fetch_github_projects(username: str) -> list:
    """Fetch public repositories from GitHub."""
    print(f"Fetching GitHub repos for {username}...")

    try:
        response = requests.get(
            f'https://api.github.com/users/{username}/repos',
            headers={'Accept': 'application/vnd.github.v3+json'},
            timeout=10
        )
        response.raise_for_status()
        repos = response.json()

        projects = []
        for repo in repos:
            if not repo.get('fork', False):  # Skip forks
                # Generate keywords from name and description
                keywords = []
                name_parts = repo['name'].replace('-', ' ').replace('_', ' ').split()
                keywords.extend([p.lower() for p in name_parts if len(p) > 2])

                if repo.get('description'):
                    desc_words = repo['description'].lower().split()
                    keywords.extend([w for w in desc_words if len(w) > 3 and w.isalpha()][:5])

                projects.append({
                    'name': repo['name'],
                    'description': repo.get('description') or 'No description',
                    'language': repo.get('language') or 'Not specified',
                    'keywords': list(set(keywords))[:6]
                })

        print(f"Found {len(projects)} repositories")
        return projects

    except Exception as e:
        print(f"Warning: Could not fetch GitHub repos: {e}")
        return []


def generate_short_resume(data: dict) -> str:
    """Generate a 30-second voice-friendly summary."""
    name = data.get('name', 'JV').split('(')[0].strip()
    nickname = 'JV'
    if '(' in data.get('name', ''):
        nickname = re.search(r'\((\w+)\)', data['name']).group(1)

    summary = f"""Hi, I'm {nickname} - {name}, an engineering leader based in {data.get('location', 'Seattle')} with over 10 years at Amazon.

I currently lead Books and Classical Music for Alexa Plus, Amazon's new LLM-powered Alexa. My team delivers AI experiences to over a million users, including RAG-based book Q&A and generative stories.

Previously, I led a 23-engineer cross-org migration, merging Kindle and Audible services into Alexa, saving 6 headcount and generating 120 million in yearly profits.

I scaled my team from 4 to 13 engineers and built the text extraction tech powering 50,000 machine-narrated audiobooks annually.

I'm passionate about building high-performing teams, architecting scalable AI systems, and solving complex technical challenges. Let's connect!"""

    return summary


def generate_typescript_file(data: dict, github_projects: list, short_resume: str) -> str:
    """Generate the TypeScript data file content."""

    def to_ts_string(s: str) -> str:
        """Escape string for TypeScript."""
        return s.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

    def to_ts_array(arr: list) -> str:
        """Convert Python list to TypeScript array string."""
        items = [f'"{item}"' for item in arr]
        return '[' + ', '.join(items) + ']'

    # Build experience array
    exp_items = []
    for exp in data['experience']:
        exp_items.append(f'''    {{
      title: "{exp['title']}",
      period: "{exp['period']}",
      subtitle: "{exp.get('subtitle', '')}",
      highlights: {to_ts_array(exp.get('highlights', []))},
      keywords: {to_ts_array(exp.get('keywords', []))}
    }}''')

    # Build github projects array
    proj_items = []
    for proj in github_projects:
        proj_items.append(f'''    {{
      name: "{proj['name']}",
      description: "{to_ts_string(proj['description'])}",
      language: "{proj['language']}",
      keywords: {to_ts_array(proj['keywords'])}
    }}''')

    ts_content = f'''export const resumeData = {{
  name: "{data['name']}",
  email: "{data['email']}",
  phone: "{data['phone']}",
  location: "{data['location']}",
  linkedin: "{data['linkedin']}",
  github: "{data['github']}",

  summary: `{to_ts_string(data['summary'])}`,

  coreExpertise: {{
    aiml: {to_ts_array(data['coreExpertise']['aiml'])},
    leadership: {to_ts_array(data['coreExpertise']['leadership'])},
    technical: {to_ts_array(data['coreExpertise']['technical'])}
  }},

  experience: [
{chr(10).join(exp_items)}
  ],

  education: {{
    degree: "{data['education']['degree']}",
    period: "{data['education']['period']}",
    institution: "{data['education']['institution']}",
    honors: "{data['education']['honors']}",
    activities: "{data['education']['activities']}"
  }},

  githubProjects: [
{chr(10).join(proj_items)}
  ]
}};

// Short resume for display (clean version)
export const shortResume = `{to_ts_string(short_resume)}`;

// Version with Chatterbox emotion tags for TTS generation
// Chatterbox Turbo supports: [laugh], [chuckle], [cough] and emotion exaggeration parameter
export const shortResumeWithEmotions = `[cheerful] Hi! I'm JV - Jayavasanth Ramesh, an engineering leader based in Seattle with over 10 years at Amazon. [chuckle]

[proud] I currently lead Books and Classical Music for Alexa Plus, Amazon's new LLM-powered Alexa. My team delivers AI experiences to over a million users, including RAG-based book Q&A and generative stories.

[confident] Previously, I led a 23-engineer cross-org migration, merging Kindle and Audible services into Alexa, saving 6 headcount and generating 120 million in yearly profits.

[enthusiastic] I scaled my team from 4 to 13 engineers and built the text extraction tech powering 50,000 machine-narrated audiobooks annually.

[warm] I'm passionate about building high-performing teams, architecting scalable AI systems, and solving complex technical challenges. [friendly] Let's connect!`;
'''

    return ts_content


def generate_voice_audio(text: str, output_path: Path) -> bool:
    """Generate voice audio using Chatterbox or macOS fallback."""

    # Try Chatterbox first
    try:
        from chatterbox.tts import ChatterboxTTS
        import torchaudio
        import torch

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Generating audio with Chatterbox on {device}...")

        model = ChatterboxTTS.from_pretrained(device=device)
        wav = model.generate(text, exaggeration=0.5)
        torchaudio.save(str(output_path), wav, model.sr)

        return True
    except ImportError:
        print("Chatterbox not available, using macOS fallback...")
    except Exception as e:
        print(f"Chatterbox error: {e}")

    # macOS fallback
    import platform
    if platform.system() == "Darwin":
        try:
            aiff_path = output_path.with_suffix(".aiff")
            subprocess.run(
                ["say", "-v", "Samantha", "-r", "175", "-o", str(aiff_path), text],
                check=True
            )
            subprocess.run(
                ["afconvert", "-f", "WAVE", "-d", "LEI16", str(aiff_path), str(output_path)],
                check=True
            )
            aiff_path.unlink()
            return True
        except Exception as e:
            print(f"macOS say command failed: {e}")

    return False


def main():
    parser = argparse.ArgumentParser(
        description='Update portfolio website data from resume and GitHub',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
    python dataUpdater.py --resume JRNarrative.docx
    python dataUpdater.py --resume ~/Documents/myresume.docx --no-audio
    python dataUpdater.py --github-only

Note: This script does NOT update the static JV-Resume.pdf file.
      Place your custom PDF in public/JV-Resume.pdf manually.
        '''
    )
    parser.add_argument('--resume', type=Path, help='Path to .docx resume file')
    parser.add_argument('--no-audio', action='store_true', help='Skip audio generation')
    parser.add_argument('--github-only', action='store_true', help='Only update GitHub projects')
    parser.add_argument('--github-user', default=GITHUB_USERNAME, help='GitHub username')

    args = parser.parse_args()

    print("=" * 60)
    print("Portfolio Data Updater")
    print("=" * 60)

    # Load existing data if available
    existing_data = None
    if DATA_FILE.exists():
        print(f"\nExisting data file found: {DATA_FILE}")

    # Parse resume if provided
    if args.resume and not args.github_only:
        if not args.resume.exists():
            print(f"Error: Resume file not found: {args.resume}")
            sys.exit(1)

        print(f"\nParsing resume: {args.resume}")
        text = extract_text_from_docx(args.resume)
        data = parse_resume(text)
        print(f"  Name: {data['name']}")
        print(f"  Email: {data['email']}")
        print(f"  Location: {data['location']}")
    else:
        # Use default data structure
        print("\nUsing default data structure (no resume provided)")
        data = {
            'name': 'Jayavasanth Ramesh (JV)',
            'email': '[REDACTED_EMAIL]',
            'phone': '[REDACTED_PHONE]',
            'location': 'Seattle, WA',
            'linkedin': 'https://www.linkedin.com/in/jvr-seattle/',
            'github': f'https://github.com/{args.github_user}',
            'summary': '',
            'coreExpertise': {'aiml': [], 'leadership': [], 'technical': []},
            'experience': [],
            'education': {'degree': '', 'period': '', 'institution': '', 'honors': '', 'activities': ''}
        }

    # Fetch GitHub projects
    github_projects = fetch_github_projects(args.github_user)

    # Generate short resume
    short_resume = generate_short_resume(data)

    # Generate TypeScript file
    print(f"\nGenerating TypeScript data file...")
    ts_content = generate_typescript_file(data, github_projects, short_resume)

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(ts_content)
    print(f"  Saved: {DATA_FILE}")

    # Generate audio
    if not args.no_audio:
        print(f"\nGenerating voice audio...")
        AUDIO_FILE.parent.mkdir(parents=True, exist_ok=True)

        if generate_voice_audio(short_resume, AUDIO_FILE):
            print(f"  Saved: {AUDIO_FILE}")
            print(f"  Size: {AUDIO_FILE.stat().st_size / 1024:.1f} KB")
        else:
            print("  Warning: Could not generate audio")

    print(f"\n{'=' * 60}")
    print("Update complete!")
    print(f"{'=' * 60}")
    print("\nNote: The static PDF (public/JV-Resume.pdf) was NOT updated.")
    print("      Place your custom PDF there manually if needed.")


if __name__ == '__main__':
    main()
