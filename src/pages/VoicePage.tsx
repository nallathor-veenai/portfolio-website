import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import { shortResume } from '../data/resumeData';

const BASE_URL = import.meta.env.BASE_URL;

export default function VoicePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Check if audio file exists on mount
    const audio = new Audio(`${BASE_URL}audio/resume_voice.wav`);
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    audio.addEventListener('error', () => {
      setAudioLoaded(false);
    });
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioLoaded(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Audio visualizer bars
  const bars = Array.from({ length: 30 }, (_, i) => ({
    height: isPlaying ? 20 + Math.random() * 40 : 20,
    delay: i * 0.05,
  }));

  return (
    <div className="page voice-page">
      <div className="voice-header">
        <h1>Voice Resume</h1>
        <p>Listen to my 30-second audio introduction</p>
      </div>

      <div className="voice-player">
        <div className="audio-visualizer">
          {bars.map((bar, idx) => (
            <div
              key={idx}
              className={`audio-bar ${isPlaying ? 'playing' : ''}`}
              style={{
                height: `${bar.height}px`,
                animationDelay: `${bar.delay}s`,
              }}
            />
          ))}
        </div>

        <audio
          ref={audioRef}
          src={`${BASE_URL}audio/resume_voice.wav`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="auto"
        />

        <button
          className="play-btn"
          onClick={handlePlayPause}
          disabled={!audioLoaded}
          style={{ opacity: audioLoaded ? 1 : 0.5 }}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </button>

        <p className="audio-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>

        <div className="audio-progress">
          <div
            className="audio-progress-fill"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Generated with Chatterbox badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '20px',
          padding: '8px 16px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
          borderRadius: '20px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          <Mic size={14} />
          <span>Generated with <strong style={{ color: 'var(--accent)' }}>Chatterbox TTS</strong></span>
        </div>

        {!audioLoaded && (
          <p style={{
            marginTop: '16px',
            color: 'var(--text-secondary)',
            fontSize: '13px'
          }}>
            Audio file not found. Run the voice server to generate it.
          </p>
        )}
      </div>

      <div className="transcript">
        <h3>Transcript</h3>
        <p>{shortResume}</p>
      </div>

      <div style={{
        marginTop: '24px',
        padding: '20px',
        background: 'var(--surface)',
        borderRadius: '12px',
        fontSize: '13px',
        color: 'var(--text-secondary)'
      }}>
        <h4 style={{ color: 'var(--accent)', marginBottom: '12px' }}>About the Voice</h4>
        <p style={{ marginBottom: '12px' }}>
          This audio was generated using <a href="https://github.com/resemble-ai/chatterbox" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Chatterbox TTS</a> by Resemble AI -
          a state-of-the-art open-source text-to-speech model with emotion control and voice cloning capabilities.
        </p>
        <p style={{ marginBottom: '12px' }}>
          <strong>Features used:</strong>
        </p>
        <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Zero-shot voice cloning from reference audio</li>
          <li>Emotion exaggeration control for natural delivery</li>
          <li>Paralinguistic tags: <code style={{ background: 'var(--surface-light)', padding: '2px 6px', borderRadius: '4px' }}>[cheerful]</code>, <code style={{ background: 'var(--surface-light)', padding: '2px 6px', borderRadius: '4px' }}>[proud]</code>, <code style={{ background: 'var(--surface-light)', padding: '2px 6px', borderRadius: '4px' }}>[chuckle]</code></li>
        </ul>
      </div>
    </div>
  );
}
