export default {
  Navbar: {
    // Sections
    home: "Home",
    about: "About",
    projects: "Projects",
    stack: "Stack",
    contact: "Contact",

    // CTA
    letsTalk: "Let's talk",

    // Aria-labels
    backToTop: "Back to top",
    primaryNav: "Primary",
    mobileNav: "Mobile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  Hero: {
    location: "Working remotely",
    expertise: "Full Stack, Next.js and Laravel",

    titleLine1: "Crafting",
    titleLine2: "modern",
    titleLine3: "web experiences.",

    descBefore:
      "Full Stack Developer building thoughtful digital products with",
    descStack: "Next.js, React and Laravel.",

    exploreWork: "Explore my work",
    getInTouch: "Get in touch",
  },
  About: {
    kicker: "ABOUT",
    glyph: "A",
    title: {
      line1: "More than code.",
      line2Before: "A",
      line2Accent: "mindset",
      line3: "for building.",
    },
    intro:
      "I build digital products that combine thoughtful interfaces, solid architecture and reliable functionality. From the first component to the underlying API, I care about how every part works together.",
    bio: {
      p1: "I’m a Full Stack Developer who enjoys building modern web applications, from refined user interfaces to the systems that power them. I like turning ideas into practical digital products, exploring new technologies and finding the right balance between user experience, maintainability and performance.",
      p2: "I’m drawn to both sides of an application: the interface people touch and the structure that keeps it dependable. I care about consistent interfaces, well-organized code and products that stay useful and maintainable, and I keep learning by solving concrete problems.",
    },
    profileAria: "Profile details",
    profile: {
      currentFocus: { label: "Current focus", value: "Full Stack Development" },
      mainStack: { label: "Main stack", value: "Next.js, React, Laravel" },
      interestedIn: {
        label: "Interested in",
        value: "UI engineering, software architecture, APIs",
      },
      learning: { label: "Learning mindset", value: "Continuous improvement" },
      workPreference: { label: "Work preference", value: "" },
      availability: { label: "Availability", value: "Open to opportunities" },
      languages: { label: "Languages", value: "French, English" },
      location: { label: "Location", value: "Benin" },
      openTo: {
        label: "Open to",
        value: "Freelance projects, internships, collaborations",
      },
    },
    expertiseBlock: {
      title: "Areas of expertise",
      note: "What I work on, and the tools I reach for. Open a row to see the technologies.",
    },
    // Les listes `tech` sont séparées par "|"
    expertise: {
      frontend: {
        title: "Frontend Engineering",
        description:
          "Modern, responsive and accessible interfaces, with attention to visual hierarchy, interaction and performance.",
        tech: "React|Next.js|Vue.js|TypeScript|JavaScript|HTML5|CSS3|Tailwind CSS",
      },
      backend: {
        title: "Backend Development",
        description:
          "API design, data handling and business logic, and the integration between frontend and backend services.",
        tech: "PHP|Laravel|REST APIs|Node.js|Authentication|Authorization|Data validation",
      },
      data: {
        title: "Database & Data Modeling",
        description:
          "Structuring data, designing schemas and connecting them to web applications.",
        tech: "MySQL|PostgreSQL|Supabase|SQL|Database migrations|Relations and constraints|Indexing and queries",
      },
      integration: {
        title: "Full Stack Integration",
        description:
          "Connecting interfaces to APIs and handling state, forms, sessions, errors and data flow.",
        tech: "Next.js App Router|Server Components|Client Components|API integration|Form validation|Authentication flows|State management",
      },
      ui: {
        title: "UI Engineering & Motion",
        description:
          "Detailed interfaces, consistent interactions and smooth, purposeful animation.",
        tech: "Motion (Framer Motion)|GSAP|CSS animations|Responsive design|Accessibility|Component architecture",
      },
      workflow: {
        title: "Development Workflow",
        description:
          "Organizing code, managing versions and preparing applications for deployment.",
        tech: "Git|GitHub|npm|Vite|ESLint|Prettier|Vercel|Linux|Environment variables",
      },
    },
    methodBlock: {
      title: "How I approach a build",
      note: "A loose sequence I come back to, not a fixed process.",
    },
    methodology: {
      understand: {
        title: "Understand the problem",
        description:
          "Clarify the goal, the people using it and the constraints before writing code.",
      },
      design: {
        title: "Design the structure",
        description:
          "Shape the data, routes and components so the system stays easy to reason about.",
      },
      build: {
        title: "Build the interface",
        description:
          "Turn the structure into responsive, accessible and well-composed screens.",
      },
      connect: {
        title: "Connect the logic",
        description:
          "Wire interfaces to APIs, state, forms and authentication flows.",
      },
      refine: {
        title: "Refine and optimize",
        description:
          "Test, polish and improve performance until the details hold together.",
      },
    },
  },
  Stack: {
    kicker: "STACK",
    title: {
      line1: "Tools of",
      line2: "the trade.",
    },
    intro:
      "A selection of technologies I use to design, develop and connect modern web applications.",
    coreBlock: { title: "Core stack" },
    core: {
      nextjs: "App Router, Server and Client Components",
      react: "Component-driven interfaces",
      typescript: "Typed JavaScript",
      javascript: "The language of the web",
      laravel: "PHP framework for web apps and APIs",
      php: "Server-side language",
      tailwind: "Utility-first styling",
      mysql: "Relational database",
    },
    // Les listes `items` sont séparées par "|"
    categories: {
      frontend: {
        title: "Frontend ecosystem",
        blurb: "Interfaces, styling and motion.",
        items:
          "React|Next.js|Vue.js|Pinia|HTML5|CSS3|Motion (Framer Motion)|GSAP|Lucide|shadcn/ui",
      },
      backend: {
        title: "Backend ecosystem",
        blurb: "APIs, authentication and server logic.",
        items:
          "Laravel|PHP|REST APIs|Authentication|Authorization|Middleware|API Resources",
      },
      data: {
        title: "Databases & services",
        blurb: "Storing, modeling and securing data.",
        items:
          "MySQL|PostgreSQL|Supabase|Prisma|SQLite|Database migrations|Row Level Security",
      },
      tools: {
        title: "Tools & workflow",
        blurb: "Day-to-day tooling and delivery.",
        items: "Git|GitHub|VS Code|Linux|npm|Composer|Vercel",
      },
      concepts: {
        title: "Concepts & engineering",
        blurb: "The practices behind the code.",
        items:
          "Responsive design|Component architecture|State management|API integration|Authentication flows|Database modeling|Error handling|Performance optimization|Accessibility|SEO fundamentals|Clean code|Version control|Deployment|Security fundamentals",
      },
    },
    cta: {
      label: "Let’s build something",
      sr: "Get in touch",
    },
  },
  contact: {
    title: "Contact",
    header: {
      line1: "Have a project in mind?",
      line2: "Let's talk about it together.",
    },
    coordinates: "My coordinates",
    location: {
      label: "Based in Benin",
      availability: "Available for freelance & permanent",
    },
    form: {
      name: {
        label: "Full name",
        placeholder: "John Doe",
        error: "Required",
        minLength: "Minimum 2 characters",
      },
      email: {
        label: "Email",
        placeholder: "your@email.com",
        error: "Required",
        pattern: "Invalid email",
      },
      message: {
        label: "Message",
        placeholder: "Tell me about your project...",
        error: "Required",
      },
      submit: {
        sending: "Sending",
        send: "Send message",
      },
    },
    alerts: {
      success: "Message sent successfully!",
      error: "An error occurred",
    },
  },
  Projects: {
    kicker: "SELECTED WORK",
    countOne: "project",
    countOther: "projects",
    title: {
      line1: "Selected projects.",
      line2: "Built with intent.",
    },
    intro:
      "A collection of digital products, experiments and applications built from concept to implementation.",
    hint: "SCROLL TO EXPLORE →",
    empty: "No projects to show yet.",
    prev: "Previous project",
    next: "Next project",
  },
  ProjectItem: {
    screenshotOf: "Screenshot of {title}",
    noScreenshot: "No screenshot available for {title}",
    screenshotToAdd: "Screenshot to add",
    demoTag: "Demo content",
    technologies: "Technologies",
    moreTech: "and {count} more",
    livePreview: "Live preview",
    sourceCode: "Source code",
    caseStudy: "Read case study",
    ofProject: "of {title}",
    caseStudyContext: ": {title}",
    newTab: "(opens in a new tab)",
  },
  FrontendSkills: {
    title: {
      before: "What I",
      accent: "master",
      dots: "...",
    },
    subtitle:
      "Technologies I use every day to create exceptional web experiences",
    skills: {
      react: {
        title: "React & Next.js",
        description: "High-performance SPAs & SSR",
        highlights: "Advanced hooks|Render optimization|ISR/SSG",
      },
      tailwind: {
        title: "Tailwind CSS",
        description: "Fast, responsive design",
        highlights: "Dark mode|Animations|Custom plugins",
      },
      tools: {
        title: "Tools & Workflows",
        description: "Continuous integration",
        highlights: "Git/GitHub|Vercel/Netlify|CI/CD",
      },
    },
    stackTitle: "My frontend stack in 2025",
  },
  project: {
    backToProjects: "Back to projects",
    techStack: "Tech Stack",
    directLinks: "Direct Links",
    liveDemo: "Live Demo",
    sourceCode: "Source Code",
    projectDescription: "Project Description",
  },
  Contact: {
    eyebrow: "CONTACT",
    // Les lignes du titre sont séparées par "|"
    titleLines: "Let’s work|together on your|next idea.",
    // Mot mis en accent : il doit apparaître tel quel dans une des lignes
    accent: "together",
    intro:
      "Have a project, an opportunity or just a question? Send me a message and I’ll get back to you as soon as I can.",
    availability: "Available for new projects",
    closing: "Thanks for stopping by.",
    signature: "Arel.",
    email: {
      copied: "Copied!",
      failed: "Copy failed",
      copy: "Copy address",
      copyAria: "Copy email address",
      send: "Send me an email",
      hint: "Select the address above and copy it manually.",
      srCopied: "Email address copied to clipboard.",
      srFailed: "Could not copy the address. Please select it manually.",
    },
    newTab: "(opens in a new tab)",
    backToTop: "Back to top",
  },
  ContactForm: {
    title: "Or send a message",
    optional: "(optional)",
    fields: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
    },
    honeypot: "Leave this field empty",
    submit: "Send message",
    sending: "Sending…",
    srSending: "Sending your message.",
    srSent: "Your message has been sent.",
    success: {
      title: "Message sent",
      text: "Thank you for getting in touch.",
      again: "Send another message",
    },
    fallback: " You can also email me at {email}.",
    status: {
      checkFields: "Please check the highlighted fields.",
      generic: "Something went wrong while sending your message.",
      timeout:
        "The request took too long, so I can’t confirm the message was sent.",
      network: "Network error: your message was not sent.",
    },
    // Codes d'erreur renvoyés par contact-schema.ts et /api/contact
    errors: {
      nameRequired: "Please enter your name.",
      nameTooLong: "Your name is too long.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "Please enter a valid email address.",
      subjectTooLong: "The subject is too long.",
      messageRequired: "Please write a message.",
      messageTooShort: "Your message is too short.",
      messageTooLong: "Your message is too long.",
      rateLimited: "Too many attempts. Please try again in a few minutes.",
      spam: "Your message could not be sent.",
      server: "The service is unavailable right now.",
    },
  },
  footer: {
    signature: "Arel Tohoubi",
    bio: "Frontend Developer specialized in creating clean interfaces and memorable digital experiences.",
    location: {
      title: "Location",
      country: "Benin, West Africa",
      time: "Local Time",
    },
    social: {
      title: "Social",
    },
    bottom: {
      copyright: "© {year} — Handcrafted by Arel",
      backToTop: "Back to Top",
    },
  },
} as const;