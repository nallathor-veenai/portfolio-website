import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Mic, MicOff } from 'lucide-react';
import { resumeData } from '../data/resumeData';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  projects?: typeof resumeData.githubProjects;
  experience?: typeof resumeData.experience;
}

const suggestedQuestions = [
  "What's JV's experience with AI?",
  "Tell me about GitHub projects",
  "What teams has JV led?",
  "What's JV's education?",
];

function searchContent(query: string): Message {
  const lowerQuery = query.toLowerCase();
  const response: Message = {
    id: Date.now(),
    text: '',
    isBot: true,
  };

  // Check for greetings
  if (lowerQuery.match(/^(hi|hello|hey|greetings)/)) {
    response.text = `Hello! I'm JV's resume assistant. I can help you learn about JV's experience, skills, projects, and more. What would you like to know?`;
    return response;
  }

  // Check for AI/ML/LLM related queries
  if (lowerQuery.match(/\b(ai|ml|machine learning|llm|genai|generative|rag|classifier)\b/)) {
    const aiExperience = resumeData.experience.filter(exp =>
      exp.keywords.some(k => k.toLowerCase().includes('llm') || k.toLowerCase().includes('ai') || k.toLowerCase().includes('ml') || k.toLowerCase().includes('rag'))
    );
    const aiProjects = resumeData.githubProjects.filter(p =>
      p.keywords.some(k => k.toLowerCase().includes('ai') || k.toLowerCase().includes('llm') || k.toLowerCase().includes('ml'))
    );

    response.text = `JV has extensive AI/ML experience:\n\n**Core Skills:** ${resumeData.coreExpertise.aiml.join(', ')}\n\n**Key Achievements:**\n- Built RAG-based Books Q&A and conversational recommendations for Alexa+\n- Scaled genAI experiences to ~1M+ users\n- Created ML classifiers and LLM-based normalizers\n- Built an LLM-powered defect analyzer improving oncall efficiency by 20%`;
    response.experience = aiExperience;
    if (aiProjects.length > 0) {
      response.projects = aiProjects;
    }
    return response;
  }

  // Check for leadership/team/management queries
  if (lowerQuery.match(/\b(lead|team|manage|leadership|scale|engineer)\b/)) {
    response.text = `JV's leadership experience spans multiple teams:\n\n**Team Building:**\n- Scaled team from 4 to 13 engineers at Kindle Assistive Reader\n- Led 23-engineer cross-org migration across 3 organizations\n- Conducted 250+ interviews\n\n**Leadership Skills:** ${resumeData.coreExpertise.leadership.join(', ')}\n\n**Key Impact:**\n- Reduced operational burden by 6 headcount, yielding $120M contribution profits yearly\n- Seamless platform migration serving 2.2M users with no regressions`;
    response.experience = resumeData.experience.filter(exp =>
      exp.keywords.some(k => k.toLowerCase().includes('leadership') || k.toLowerCase().includes('team'))
    );
    return response;
  }

  // Check for GitHub/projects queries
  if (lowerQuery.match(/\b(github|project|repo|code|open source)\b/)) {
    response.text = `Here are JV's GitHub projects:`;
    response.projects = resumeData.githubProjects;
    return response;
  }

  // Check for specific project mentions
  for (const project of resumeData.githubProjects) {
    if (lowerQuery.includes(project.name.toLowerCase()) ||
        project.keywords.some(k => lowerQuery.includes(k.toLowerCase()))) {
      response.text = `Found a relevant project:`;
      response.projects = [project];
      return response;
    }
  }

  // Check for education queries
  if (lowerQuery.match(/\b(education|degree|university|college|school|study)\b/)) {
    response.text = `**Education:**\n\n**${resumeData.education.degree}**\n${resumeData.education.institution}\n${resumeData.education.period}\n\n**Honors:** ${resumeData.education.honors}\n**Activities:** ${resumeData.education.activities}`;
    return response;
  }

  // Check for skills/technical queries
  if (lowerQuery.match(/\b(skill|technical|tech|aws|python|java|typescript)\b/)) {
    response.text = `**JV's Technical Skills:**\n\n**AI/ML:** ${resumeData.coreExpertise.aiml.join(', ')}\n\n**Technical:** ${resumeData.coreExpertise.technical.join(', ')}`;
    return response;
  }

  // Check for Alexa/Amazon related queries
  if (lowerQuery.match(/\b(alexa|amazon|kindle|audible)\b/)) {
    const alexaExp = resumeData.experience.filter(exp =>
      exp.keywords.some(k => k.toLowerCase().includes('alexa') || k.toLowerCase().includes('kindle') || k.toLowerCase().includes('audible'))
    );
    response.text = `JV has 10+ years at Amazon, working on:\n\n- **Alexa+ (2024-Present):** Leading Books and Classical Music with LLM-powered features serving 1M+ users\n- **Books in Alexa (2023-2024):** Led cross-org platform migration for 23 engineers\n- **Kindle Assistive Reader (2020-2022):** Scaled team to 13 engineers, owned 6 services reaching 200k daily users\n- **Kindle Rendering (2015-2019):** Built multi-platform tools and Lambda@Edge features at 4.5M TPS`;
    response.experience = alexaExp;
    return response;
  }

  // Check for contact info
  if (lowerQuery.match(/\b(contact|email|phone|reach|linkedin)\b/)) {
    response.text = `**Contact JV:**\n\n- Email: ${resumeData.email}\n- Phone: ${resumeData.phone}\n- Location: ${resumeData.location}\n- LinkedIn: ${resumeData.linkedin}\n- GitHub: ${resumeData.github}`;
    return response;
  }

  // Check for summary/about queries
  if (lowerQuery.match(/\b(about|summary|who|introduce|tell me about|background)\b/)) {
    response.text = resumeData.summary;
    return response;
  }

  // Check for experience/work history
  if (lowerQuery.match(/\b(experience|work|history|career|job|role)\b/)) {
    response.text = `**JV's Career Journey:**`;
    response.experience = resumeData.experience;
    return response;
  }

  // Default response
  response.text = `I can help you learn about JV's:\n\n- **AI/ML Experience** - LLMs, RAG systems, GenAI features\n- **Leadership** - Team scaling, cross-org programs\n- **Technical Skills** - AWS, distributed systems, multi-platform dev\n- **GitHub Projects** - Open source contributions\n- **Education & Background**\n\nTry asking something specific like "What's JV's AI experience?" or "Tell me about the GitHub projects"`;
  return response;
}

// Speech Recognition type definitions
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm JV's resume assistant. Ask me anything about JV's experience, skills, projects, or background. You can type or use the microphone to ask questions!",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);

        // If final result, auto-send
        if (event.results[event.results.length - 1].isFinal) {
          setTimeout(() => {
            handleSendWithText(transcript);
          }, 500);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendWithText = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text,
      isBot: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botResponse = searchContent(text);
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleSend = () => {
    handleSendWithText(input);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now(),
        text: question,
        isBot: false,
      };
      setMessages((prev) => [...prev, userMessage]);

      setTimeout(() => {
        const botResponse = searchContent(question);
        setMessages((prev) => [...prev, botResponse]);
      }, 500);
    }, 100);
    setInput('');
  };

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <h1>Chat with JV's Resume</h1>
        <p>Ask questions about experience, skills, projects, and more</p>
      </div>

      <div className="suggested-questions">
        {suggestedQuestions.map((q, idx) => (
          <button key={idx} className="suggested-btn" onClick={() => handleSuggestion(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              {msg.isBot && <Bot size={18} style={{ marginTop: '2px', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                {msg.experience && msg.experience.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {msg.experience.map((exp, idx) => (
                      <div key={idx} className="project-card">
                        <h4>{exp.title}</h4>
                        <p>{exp.period} - {exp.subtitle}</p>
                        <ul style={{ marginTop: '8px', marginLeft: '16px', fontSize: '12px' }}>
                          {exp.highlights.slice(0, 3).map((h, hIdx) => (
                            <li key={hIdx} style={{ marginBottom: '4px' }}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {msg.projects && msg.projects.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    {msg.projects.map((project, idx) => (
                      <div key={idx} className="project-card">
                        <h4>
                          <a
                            href={`https://github.com/nallathor-veenai/${project.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit' }}
                          >
                            {project.name}
                          </a>
                        </h4>
                        <p>{project.description}</p>
                        {project.language && <span className="language">{project.language}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {!msg.isBot && <User size={18} style={{ marginTop: '2px', flexShrink: 0 }} />}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        {speechSupported && (
          <button
            className={`mic-btn ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        )}
        <input
          type="text"
          className="chat-input"
          placeholder={isListening ? 'Listening...' : 'Ask about JV\'s experience, skills, or projects...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim()}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
