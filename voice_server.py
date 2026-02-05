#!/usr/bin/env python3
"""
Voice Server for Portfolio Website
Uses Chatterbox TTS to generate voice audio from text with emotion control.

Install dependencies:
    pip install chatterbox-tts flask flask-cors torch torchaudio

Run:
    python voice_server.py

Chatterbox supports:
- Zero-shot voice cloning from reference audio
- Emotion exaggeration control (0.0 = monotone, 1.0 = expressive)
- Paralinguistic tags in Turbo model: [laugh], [chuckle], [cough]
- Custom emotion markers: [cheerful], [proud], [confident], [enthusiastic], [warm], [friendly]
"""

import os
from pathlib import Path

# Output directory for audio files
AUDIO_DIR = Path(__file__).parent / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

# Short resume with emotion tags for Chatterbox
# Note: Chatterbox Turbo natively supports [laugh], [chuckle], [cough]
# Other emotion markers like [cheerful] are processed as style hints
SHORT_RESUME_WITH_EMOTIONS = """Hi! I'm JV - Jayavasanth Ramesh, an engineering leader based in Seattle with over 10 years at Amazon. [chuckle]

I currently lead Books and Classical Music for Alexa Plus, Amazon's new LLM-powered Alexa. My team delivers AI experiences to over a million users, including RAG-based book Q&A and generative stories.

Previously, I led a 23-engineer cross-org migration, merging Kindle and Audible services into Alexa, saving 6 headcount and generating 120 million in yearly profits.

I scaled my team from 4 to 13 engineers and built the text extraction tech powering 50,000 machine-narrated audiobooks annually.

I'm passionate about building high-performing teams, architecting scalable AI systems, and solving complex technical challenges. Let's connect!"""


def generate_with_chatterbox(
    text: str,
    output_path: Path,
    reference_audio: str = None,
    exaggeration: float = 0.5,  # 0.0 = monotone, 1.0 = very expressive
) -> bool:
    """
    Generate speech using Chatterbox TTS with emotion control.

    Args:
        text: Text to synthesize (can include emotion tags)
        output_path: Where to save the audio file
        reference_audio: Optional path to reference audio for voice cloning
        exaggeration: Emotion intensity (0.0-1.0)
    """
    try:
        from chatterbox.tts import ChatterboxTTS
        import torchaudio
        import torch

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Loading Chatterbox model on {device}...")

        model = ChatterboxTTS.from_pretrained(device=device)

        print(f"Generating audio with exaggeration={exaggeration}...")

        # Generate with emotion exaggeration
        if reference_audio and Path(reference_audio).exists():
            print(f"Using reference audio: {reference_audio}")
            wav = model.generate(
                text,
                audio_prompt_path=reference_audio,
                exaggeration=exaggeration,
            )
        else:
            wav = model.generate(
                text,
                exaggeration=exaggeration,
            )

        print(f"Saving audio to {output_path}...")
        torchaudio.save(str(output_path), wav, model.sr)

        return True

    except ImportError as e:
        print(f"Import error: {e}")
        print("Please install chatterbox-tts: pip install chatterbox-tts")
        return False
    except Exception as e:
        print(f"Error generating audio: {e}")
        import traceback
        traceback.print_exc()
        return False


def generate_with_macos_fallback(text: str, output_path: Path) -> bool:
    """Fallback to macOS say command if Chatterbox is unavailable."""
    import subprocess
    import platform

    if platform.system() != "Darwin":
        print("macOS fallback only available on macOS")
        return False

    try:
        aiff_path = output_path.with_suffix(".aiff")
        # Use Samantha voice with slightly faster rate for natural delivery
        subprocess.run(
            ["say", "-v", "Samantha", "-r", "175", "-o", str(aiff_path), text],
            check=True
        )
        # Convert to wav
        subprocess.run(
            ["afconvert", "-f", "WAVE", "-d", "LEI16", str(aiff_path), str(output_path)],
            check=True
        )
        aiff_path.unlink()  # Remove temp file
        print(f"Generated audio using macOS say command: {output_path}")
        return True
    except Exception as e:
        print(f"macOS fallback failed: {e}")
        return False


def main():
    """Generate the voice resume audio file."""
    print("=" * 60)
    print("Voice Resume Generator")
    print("=" * 60)

    output_path = AUDIO_DIR / "resume_voice.wav"

    # Try Chatterbox first
    print("\nAttempting to generate with Chatterbox TTS...")
    success = generate_with_chatterbox(
        text=SHORT_RESUME_WITH_EMOTIONS,
        output_path=output_path,
        exaggeration=0.5,  # Moderate expressiveness
    )

    if not success:
        print("\nChatterbox not available, trying macOS fallback...")
        # Clean version without emotion tags for macOS
        clean_text = SHORT_RESUME_WITH_EMOTIONS.replace("[chuckle]", "")
        success = generate_with_macos_fallback(clean_text, output_path)

    if success:
        print(f"\n{'=' * 60}")
        print(f"SUCCESS! Audio saved to: {output_path}")
        print(f"File size: {output_path.stat().st_size / 1024:.1f} KB")
        print(f"{'=' * 60}")
    else:
        print(f"\n{'=' * 60}")
        print("FAILED to generate audio")
        print("Please install Chatterbox TTS:")
        print("  pip install chatterbox-tts torch torchaudio")
        print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
