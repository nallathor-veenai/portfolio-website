import { useState } from 'react';
import { Linkedin, Github, Mail, Phone, MapPin, FileText, X, Download, ExternalLink } from 'lucide-react';
import { resumeData } from '../data/resumeData';

export default function ProfilePage() {
  const [showResume, setShowResume] = useState(false);

  const handleDownloadPDF = () => {
    // Download the static PDF file
    const link = document.createElement('a');
    link.href = '/JV-Resume.pdf';
    link.download = 'JV-Resume.pdf';
    link.click();
  };

  const handleOpenPDF = () => {
    // Open PDF in new tab
    window.open('/JV-Resume.pdf', '_blank');
  };

  return (
    <div className="page profile-page">
      <div className="profile-header">
        <div className="profile-avatar">JV</div>
        <h1 className="profile-name">{resumeData.name}</h1>
        <p className="profile-title">Engineering Manager | AI/ML Leader | 10+ Years at Amazon</p>
        <p className="profile-location">
          <MapPin size={14} /> {resumeData.location}
        </p>
      </div>

      <div className="social-links">
        <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
          <Linkedin size={20} />
          LinkedIn
        </a>
        <a href={resumeData.github} target="_blank" rel="noopener noreferrer" className="social-link">
          <Github size={20} />
          GitHub
        </a>
      </div>

      <div className="contact-info">
        <div className="contact-item">
          <Mail size={18} />
          <a href={`mailto:${resumeData.email}`}>{resumeData.email}</a>
        </div>
        <div className="contact-item">
          <Phone size={18} />
          <span>{resumeData.phone}</span>
        </div>
        <div className="contact-item">
          <MapPin size={18} />
          <span>{resumeData.location}</span>
        </div>
      </div>

      <button className="view-resume-btn" onClick={() => setShowResume(true)}>
        <FileText size={20} />
        View Resume
      </button>

      {showResume && (
        <div className="pdf-modal-overlay" onClick={() => setShowResume(false)}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h2>Resume</h2>
              <button className="pdf-modal-close" onClick={() => setShowResume(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="pdf-content">
              {/* Embed PDF viewer */}
              <iframe
                src="/JV-Resume.pdf"
                title="JV Resume"
                style={{
                  width: '100%',
                  height: '60vh',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', padding: '16px 24px' }}>
              <button className="pdf-download-btn" onClick={handleDownloadPDF} style={{ flex: 1 }}>
                <Download size={18} />
                Download PDF
              </button>
              <button
                className="pdf-download-btn"
                onClick={handleOpenPDF}
                style={{ flex: 1, background: 'var(--surface-light)' }}
              >
                <ExternalLink size={18} />
                Open in New Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
