export const resumeData = {
  name: "Jayavasanth Ramesh (JV)",
  email: "[REDACTED_EMAIL]",
  phone: "[REDACTED_PHONE]",
  location: "Seattle, WA",
  linkedin: "https://www.linkedin.com/in/jvr-seattle/",
  github: "https://github.com/nallathor-veenai",

  summary: `I'm seeking an engineering manager role where I can continue showcasing my skills in building high-performing teams, architecting scalable systems, and delivering AI-powered products. With over 10+ years at Amazon, I've demonstrated hands-on technical leadership—scaling teams from 4 to 13 engineers, leading 23-engineer cross-org platform migrations, and pioneering AI features serving millions. I lead by example: debugging production issues, designing architectures, and building tools alongside my teams. I thrive on complex technical challenges requiring deep architectural thinking and cross-organizational influence, while growing engineers under my leadership.`,

  coreExpertise: {
    aiml: ["LLMs", "Generative AI", "Scaling genAI features", "Prompt engineering", "Conversational AI", "RAG systems", "ML classifiers"],
    leadership: ["Team scaling (4→13 engineers)", "Cross-functional program management (23 engineers, 3 orgs)", "Multi-year roadmap building", "Performance management", "Technical mentorship", "Org transitions", "250+ interviews"],
    technical: ["High scale AWS systems (Lambda, Step Functions, SNS, SQS, Glue, CloudFront, DynamoDB, S3)", "Microservices", "Distributed systems", "Elasticsearch", "Vector databases", "SQL", "Python", "C++", "Java", "TypeScript", "React Native", "Multi-platform development (Web, Kindle, Mac, Windows)", "Layout and Text Rendering engines"]
  },

  experience: [
    {
      title: "SDM, Books and Classical Music in Alexa+",
      period: "2024-Present",
      subtitle: "Innovation with AI: Building the Future",
      highlights: [
        "Lead Books, Classical Music in Alexa+ (newer LLM version of Alexa)",
        "Delivered end-to-end books workflows: Books Q&A (RAG based), conversational book recommendations, and Generative Stories",
        "Scaled genAI experiences to ~1M+ Alexa users",
        "Delivered features for Amazon Devices product day, against tight timelines - working E2E from device firmware to 10+ backend services",
        "Built ML classifiers, LLM-based normalizers and fine-tuned elastic search clusters and vector databases",
        "Hand-built an LLM-powered defect analyzer that auto-identifies root causes for failures through deductive reasoning on logs from 10+ micro-services – improving oncall efficiency by 20%"
      ],
      keywords: ["LLM", "RAG", "Alexa", "GenAI", "ML classifiers", "vector databases", "elasticsearch"]
    },
    {
      title: "SDM, Books in Alexa",
      period: "2023-2024",
      subtitle: "Leading Complex Cross-Org Transformations",
      highlights: [
        "Proposed vertical platform called Books Skills Kit to integrate Kindle/Audible's 10+ microservices into Alexa Music's 8+ microservice architecture",
        "Created multi-year roadmap for 23 engineers across 3 orgs, managing 13 directly",
        "Merger of 12+ microservices and related workflows from Kindle/Audible to Alexa",
        "Seamless integration with no regressions to customer experience for 100M+ Alexa Music users",
        "Reduced operational burden by ~6HC yielding 120M contribution profits yearly, serving 2.2M users"
      ],
      keywords: ["cross-org", "platform migration", "microservices", "roadmap", "leadership", "Alexa", "Kindle", "Audible"]
    },
    {
      title: "SDM, Kindle Assistive Reader",
      period: "2020-2022",
      subtitle: "Team Building & Product Ownership",
      highlights: [
        "Scaled team from 4 to 13 engineers",
        "Owned six tier-2 micro-services reaching 200k users daily",
        "Built core text extraction tech for machine-narrated audiobook (50,000 books annually, $1.5M ARR)",
        "Hand-built scripts to automate customer impact ticket tracking and sprint board maintenance"
      ],
      keywords: ["team scaling", "Kindle", "text extraction", "audiobook", "microservices", "automation"]
    },
    {
      title: "SDE1 & SDE2",
      period: "2015-2019",
      subtitle: "The Foundation",
      highlights: [
        "Kindle rendering engine building multi-platform (Web, Kindle, Mac, Windows) tools and frameworks",
        "Worked on multiple features at Lambda@Edge, serving ~4.5M TPS"
      ],
      keywords: ["rendering engine", "multi-platform", "Lambda@Edge", "high scale", "Kindle"]
    }
  ],

  education: {
    degree: "B.S. Computer Science and Engineering",
    period: "2011 – 2015",
    institution: "College of Engineering, Guindy (Anna University), Chennai, India",
    honors: "CGPA: 9.28/10",
    activities: "Mentored junior developers | Active in multiple technical clubs"
  },

  githubProjects: [
    {
      name: "interactive-code-reviewer",
      description: "A utility tool to help interactively review code. Built with Remarkable pro and Kindle Scribe in mind.",
      language: "C++",
      keywords: ["code review", "kindle scribe", "remarkable", "productivity"]
    },
    {
      name: "SpeakOut",
      description: "A PDF to voice book converter Application",
      language: "Python",
      keywords: ["text-to-speech", "PDF", "accessibility", "voice"]
    },
    {
      name: "how-many-plants-did-you-kill",
      description: "A Chrome plugin that shows how much carbon offsetting has to be done",
      language: "TypeScript",
      keywords: ["chrome extension", "environment", "carbon", "sustainability"]
    },
    {
      name: "exile",
      description: "Standalone binary management tool designed to be used alongside Git",
      language: "Python",
      keywords: ["git", "binary management", "devtools"]
    },
    {
      name: "GrabIt",
      description: "An app to get offers on the Go!",
      language: "JavaScript",
      keywords: ["mobile app", "offers", "deals"]
    },
    {
      name: "annaikuSamarpanam",
      description: "An android app that displays Tamil poems",
      language: "Java",
      keywords: ["android", "tamil", "poetry", "culture"]
    },
    {
      name: "llama-stack",
      description: "Model components of the Llama Stack APIs",
      language: "Python",
      keywords: ["LLM", "llama", "AI", "machine learning"]
    },
    {
      name: "Zodiac",
      description: "Zodiac Project",
      language: "Python",
      keywords: ["python", "zodiac"]
    }
  ]
};

// Short resume for display (clean version)
export const shortResume = `Hi, I'm JV - Jayavasanth Ramesh, an engineering leader based in Seattle with over 10 years at Amazon.

I currently lead Books and Classical Music for Alexa Plus, Amazon's new LLM-powered Alexa. My team delivers AI experiences to over a million users, including RAG-based book Q&A and generative stories.

Previously, I led a 23-engineer cross-org migration, merging Kindle and Audible services into Alexa, saving 6 headcount and generating 120 million in yearly profits.

I scaled my team from 4 to 13 engineers and built the text extraction tech powering 50,000 machine-narrated audiobooks annually.

I'm passionate about building high-performing teams, architecting scalable AI systems, and solving complex technical challenges. Let's connect!`;

// Version with Chatterbox emotion tags for TTS generation
// Chatterbox Turbo supports: [laugh], [chuckle], [cough] and emotion exaggeration parameter
export const shortResumeWithEmotions = `[cheerful] Hi! I'm JV - Jayavasanth Ramesh, an engineering leader based in Seattle with over 10 years at Amazon. [chuckle]

[proud] I currently lead Books and Classical Music for Alexa Plus, Amazon's new LLM-powered Alexa. My team delivers AI experiences to over a million users, including RAG-based book Q&A and generative stories.

[confident] Previously, I led a 23-engineer cross-org migration, merging Kindle and Audible services into Alexa, saving 6 headcount and generating 120 million in yearly profits.

[enthusiastic] I scaled my team from 4 to 13 engineers and built the text extraction tech powering 50,000 machine-narrated audiobooks annually.

[warm] I'm passionate about building high-performing teams, architecting scalable AI systems, and solving complex technical challenges. [friendly] Let's connect!`;
