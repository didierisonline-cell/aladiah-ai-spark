import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 4 Dominican professors with distinct personalities
const professors = [
  {
    id: "professor_didier",
    name: "Professor Didier",
    voiceId: "iP95p4xoKVk53GoZ742B", // Chris - Black American male voice, warm and confident
    personality: "Warm and encouraging, uses Dominican expressions, often says '¡Mira!' and 'Tú sabes'",
    style: "Speaks with passion about Scrum, loves sports analogies especially baseball"
  },
  {
    id: "professor_carmen",
    name: "Profesora Carmen Valdez",
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - clear, professional
    personality: "Sharp wit, practical examples, occasionally teases students kindly",
    style: "Uses real-world Dominican business examples, loves merengue metaphors for teamwork"
  },
  {
    id: "professor_rafael",
    name: "Professor Rafael Jiménez",
    voiceId: "onwK4e9ZLuTAKqWW03F9", // Daniel - energetic
    personality: "Energetic and humorous, tells jokes, uses 'manito' and '¡Dimelo!' frequently",
    style: "High energy, uses funny stories to explain concepts, references Dominican culture"
  },
  {
    id: "professor_lucia",
    name: "Profesora Lucía Fernández",
    voiceId: "pFZP5JQG7iQjIQuC4Bku", // Lily - warm, friendly
    personality: "Motherly wisdom, patient explanations, uses 'mi amor' and 'mijo/mija'",
    style: "Storytelling approach, connects Scrum to family and community values"
  }
];

// Course-specific content templates for personalized lessons
const courseContentTemplates: Record<string, Record<string, string[]>> = {
  // Scrum Master Course
  "scrum_master": {
    "role": [
      "The Scrum Master is like the coach of a baseball team - you're not playing the game yourself, but without you, the team falls apart!",
      "In my years working with Dominican companies, I've seen how a good Scrum Master can transform a team from chaos to champions.",
      "Think of the Scrum Master as the facilitator who removes obstacles - like clearing the dance floor so everyone can move to the merengue!"
    ],
    "opportunities": [
      "The demand for Scrum Masters is growing fast! Companies from Santo Domingo to New York are looking for talented practitioners.",
      "As a Scrum Master, you can work in tech, finance, healthcare - any industry that wants to deliver value faster.",
      "The certification opens doors to salaries ranging from entry-level to senior positions - the sky is the limit, manito!"
    ]
  },
  // Jira Course
  "jira_project": {
    "setup": [
      "Setting up Jira is like organizing your kitchen before cooking a big sancocho - everything needs its place!",
      "First, we create the project. Think of it as your digital workspace where all the magic happens.",
      "The board is where you'll see your team's work flowing like a river - from To Do, to In Progress, to Done!"
    ],
    "sprints": [
      "Sprints in Jira are your two-week dance - you plan, you execute, you review, you improve!",
      "The burndown chart tells you if you're on track - it's like checking the recipe while cooking to make sure everything is coming together.",
      "Managing epics is like managing a big family reunion - you need to see both the big picture and the details!"
    ]
  },
  // Agile Development Course
  "agile_development": {
    "principles": [
      "Agile is not just a methodology - it's a mindset! Like how we Dominicans adapt to any situation with a smile.",
      "The Agile Manifesto values individuals and interactions over processes - because at the end of the day, it's about people, mi gente!",
      "Iterative development means you deliver small pieces frequently - like serving appetizers before the main course!"
    ],
    "planning": [
      "User stories are the heart of Agile planning - they tell us what the customer really needs, not what we think they need.",
      "Story points help us estimate effort - it's not about hours, it's about complexity. Like comparing cooking rice to making mofongo!",
      "Backlog refinement is our weekly grooming session - keeping everything organized and ready for the next sprint."
    ],
    "execution": [
      "The daily standup is sacred - 15 minutes, standing up, focused on what matters. No dominoes talk until after!",
      "Burndown charts show our progress - when the line goes down smoothly, we're in the zone. When it flatlines, we need to investigate!",
      "The sprint retrospective is where we get better - we celebrate wins and fix problems. No blame, only improvement!"
    ]
  },
  // CSM/PSM Certification Course
  "certification": {
    "csm": [
      "The Certified Scrum Master exam tests your understanding of Scrum values and principles - it's not just about memorizing, it's about applying!",
      "For CSM success, you need to understand servant leadership - you lead by serving your team, not by commanding them.",
      "The exam will test scenarios - real situations where you need to choose the most Agile response. Think like a Scrum Master!"
    ],
    "psm": [
      "PSM-I is challenging because it's based strictly on the Scrum Guide - every word matters, so read it carefully!",
      "The Professional Scrum Master exam expects you to know the WHY behind every Scrum element, not just the WHAT.",
      "Time management is key in the PSM exam - you have 60 minutes for 80 questions. Practice, practice, practice!"
    ],
    "exam_prep": [
      "Both certifications require understanding the Scrum framework deeply - roles, events, artifacts, and their purposes.",
      "Practice with scenario-based questions - the exams test your ability to apply knowledge, not just recall it.",
      "Remember the core values: Commitment, Focus, Openness, Respect, and Courage. They guide every answer!"
    ]
  }
};

// Detailed lesson content by video title keywords
const lessonContentByTopic: Record<string, string> = {
  // Scrum Master Course topics
  "role of scrum master": `
    The Scrum Master is a servant leader who helps the team succeed. Unlike a traditional manager who gives orders, 
    the Scrum Master facilitates, coaches, and removes impediments. They protect the team from distractions and ensure 
    Scrum practices are followed. The three key responsibilities are: coaching the team on Scrum practices, 
    facilitating Scrum events, and removing obstacles that slow down the team. A great Scrum Master is like a 
    shield for the team - they handle external pressures so developers can focus on delivering value.
  `,
  "scrum master opportunities": `
    The job market for Scrum Masters is thriving! Companies across all industries recognize the value of Agile practices.
    Entry-level Scrum Masters can expect competitive salaries, with senior positions commanding even higher compensation.
    Beyond traditional tech companies, you'll find opportunities in finance, healthcare, government, and startups.
    The certification opens doors globally - remote work options mean you can work for companies anywhere in the world
    while enjoying your café con leche on a Dominican beach!
  `,
  "job overview": `
    A typical day as a Scrum Master includes facilitating the daily standup, meeting with stakeholders, 
    removing blockers for the team, and continuously improving team processes. You'll work closely with 
    Product Owners to ensure the backlog is well-maintained and developers understand the requirements.
    The role requires excellent communication skills, patience, and a genuine desire to help others succeed.
  `,
  "swot analysis": `
    SWOT analysis helps you understand your Strengths, Weaknesses, Opportunities, and Threats as a Scrum Master.
    Strengths might include your communication skills and Agile knowledge. Weaknesses could be areas where you 
    need more experience. Opportunities are the growing demand for Scrum Masters and new industries adopting Agile.
    Threats might be automation or changes in how teams work. Use this analysis to create your personal development plan!
  `,
  
  // Jira Course topics
  "create jira account": `
    Setting up your Jira account is the first step to mastering Agile project management. Navigate to Atlassian's 
    website, choose the free tier to start, and verify your email. Once logged in, you'll see the clean dashboard 
    where your projects will live. Remember to use a professional email - this account might become your career tool!
  `,
  "jira project setup": `
    Creating a new Jira project is straightforward. Click 'Create Project', choose a Scrum template, and give it 
    a meaningful name. Configure your board columns to match your team's workflow - typically To Do, In Progress, 
    Code Review, and Done. Set up your team members and their roles. The project settings allow you to customize 
    issue types, workflows, and permissions to match your organization's needs.
  `,
  "user stories jira": `
    Writing user stories in Jira follows the format: 'As a [user type], I want [goal] so that [benefit]'. 
    Add acceptance criteria in the description to make requirements clear. Use labels and components to organize 
    stories. Link related issues together. Attach mockups or specifications as needed. A well-written user story 
    is like a recipe - it tells the developer exactly what to cook and how to know when it's ready!
  `,
  "sprint backlog": `
    The sprint backlog contains the work committed for the current sprint. Drag prioritized items from the 
    product backlog into your sprint. Ensure the team has capacity - don't overcommit! Break down large stories 
    into smaller tasks. The sprint backlog is the team's commitment - once the sprint starts, protect it from 
    scope creep. Use the board view to visualize progress throughout the sprint.
  `,
  "jira board": `
    The Jira board is your command center. It shows all work in progress, who's working on what, and bottlenecks 
    at a glance. Customize columns to match your workflow. Use swim lanes to organize by assignee or priority. 
    Quick filters help focus on specific work. The board is alive - it changes constantly as work moves from 
    left to right. Teach your team to update their cards in real-time for accurate visibility.
  `,
  "epic creation": `
    Epics are large bodies of work that span multiple sprints. Create an epic for major features or themes. 
    Link child issues to epics to track progress. Use the epic roadmap to plan releases. Each epic should have 
    a clear goal and definition of done. Think of epics as chapters in a book - they group related stories 
    into a coherent narrative that delivers significant value to users.
  `,
  "dependencies": `
    Managing dependencies in Jira keeps your project flowing smoothly. Use 'blocks' and 'is blocked by' links 
    to show relationships. The dependency board visualizes these connections. Address blockers in daily standups. 
    Cross-team dependencies require extra attention - schedule coordination meetings. Plan sprints considering 
    dependencies to avoid delays. Like a chain, your project is only as strong as its weakest link!
  `,
  "burndown chart": `
    The burndown chart shows remaining work versus time. A healthy sprint shows a steady downward slope. 
    Flat lines indicate blocked work. Sudden drops mean scope was removed. Upward spikes mean scope was added. 
    Review the burndown daily in standup. Compare actual versus ideal lines. Use historical burndowns to improve 
    estimation. This chart tells the story of your sprint - learn to read it like a book!
  `,
  
  // Agile Development Course topics
  "introduction to agile": `
    Agile is a set of values and principles for software development that emerged from the Agile Manifesto in 2001.
    The core idea is to deliver working software frequently, respond to change over following a rigid plan, 
    and prioritize customer collaboration. Agile is not a single methodology - it's an umbrella covering Scrum, 
    Kanban, XP, and more. The goal is to deliver value early and often while adapting to changing requirements.
  `,
  "agile principles": `
    The 12 Agile principles guide everything we do. Customer satisfaction through early and continuous delivery. 
    Welcome changing requirements, even late in development. Deliver working software frequently. 
    Business people and developers must work together daily. Build projects around motivated individuals. 
    Face-to-face conversation is the most efficient communication. Working software is the primary measure of progress.
    Sustainable development pace. Continuous attention to technical excellence. Simplicity is essential.
    Self-organizing teams produce the best work. Regular reflection and adjustment.
  `,
  "methodologies overview": `
    Beyond Scrum, there are other Agile frameworks. Kanban focuses on visualizing work and limiting work in progress.
    Extreme Programming (XP) emphasizes technical practices like pair programming and test-driven development.
    Lean software development applies manufacturing principles to eliminate waste. SAFe scales Agile for large enterprises.
    Each methodology has strengths - choose based on your team's context and needs.
  `,
  "working agile": `
    Working Agile means embracing change, collaborating closely, and delivering incrementally. 
    Break work into small pieces that can be completed in days, not months. Get feedback early and often.
    Automate testing and deployment to enable frequent releases. Foster a culture of psychological safety 
    where team members can take risks and learn from failures. Trust the team to self-organize.
  `,
  "scrum overview": `
    Scrum is a framework for developing complex products. It defines three roles: Product Owner, Scrum Master, 
    and Development Team. Five events: Sprint, Sprint Planning, Daily Scrum, Sprint Review, and Sprint Retrospective.
    Three artifacts: Product Backlog, Sprint Backlog, and Increment. Sprints are fixed time-boxes, usually two weeks.
    The goal is to deliver a potentially releasable increment every sprint.
  `,
  "3 roles of scrum": `
    The Product Owner maximizes value by managing the product backlog. They represent stakeholders and make 
    prioritization decisions. The Scrum Master serves the team by facilitating events, removing impediments, 
    and coaching Agile practices. The Development Team are the professionals who deliver the increment - 
    they are cross-functional and self-organizing. Together, these three roles form a complete, balanced team.
  `,
  "artifacts events benefits": `
    Scrum artifacts provide transparency. The Product Backlog is an ordered list of everything needed in the product.
    The Sprint Backlog is the forecast of work for the sprint plus a plan. The Increment is the sum of completed 
    items representing usable value. Events create regularity and minimize the need for ad-hoc meetings.
    Benefits include faster time to market, higher quality, increased customer satisfaction, and improved team morale.
  `,
  "organizational impact": `
    Agile transforms organizations beyond development teams. HR adapts hiring for cross-functional skills.
    Finance learns to budget for iterative development. Legal adjusts contracts for flexibility.
    Leadership shifts from command-and-control to servant leadership. The culture embraces experimentation 
    and continuous improvement. Success requires commitment from all levels of the organization.
  `,
  "iterative development": `
    Iterative development delivers working software in short cycles. Each iteration produces something usable.
    Feedback from each iteration informs the next. This reduces risk compared to big-bang delivery.
    Teams learn and improve with each cycle. Stakeholders see progress regularly. Course corrections are 
    easier and cheaper when made early. Iteration is the heartbeat of Agile.
  `,
  "destination unknown": `
    In Agile, we embrace uncertainty. We don't pretend to know everything upfront. Instead, we discover 
    requirements through collaboration and iteration. The destination may be unknown at the start, 
    but each sprint brings clarity. This is not chaos - it's adaptive planning. We commit to direction, 
    not detailed destinations, and adjust as we learn more.
  `,
  "agile roles training": `
    Every Agile role requires training and practice. Product Owners need training in backlog management and 
    stakeholder communication. Scrum Masters need facilitation and coaching skills. Developers need technical 
    practices like TDD and pair programming. Training should be ongoing - Agile is a journey of continuous learning.
    Invest in your team's growth and watch performance soar!
  `,
  "kanban planning tools": `
    Kanban boards visualize work flowing through stages. Each column represents a process state. 
    Cards move from left to right as work progresses. Work-in-Progress (WIP) limits prevent overload.
    Tools like Jira, Trello, and ZenHub provide digital boards. Physical boards with sticky notes work great too!
    The key is visibility - when everyone sees the work, collaboration improves naturally.
  `,
  "user stories": `
    User stories capture requirements from the user's perspective. The format is: As a [user type], I want [goal], 
    so that [benefit]. Good stories are Independent, Negotiable, Valuable, Estimable, Small, and Testable (INVEST).
    Add acceptance criteria to clarify when the story is complete. Stories spark conversations - they're not 
    detailed specifications but placeholders for collaboration.
  `,
  "story points": `
    Story points estimate effort, complexity, and uncertainty - not hours. Use the Fibonacci sequence (1, 2, 3, 5, 8, 13...).
    Points are relative - compare stories to each other. Planning poker builds consensus on estimates.
    Velocity is the average points completed per sprint. Over time, velocity becomes a reliable planning tool.
    Don't compare velocity across teams - points are team-specific!
  `,
  "product backlog": `
    The product backlog is an ordered list of everything that might be needed in the product. 
    The Product Owner owns it but collaborates with the team. Top items are refined and ready for sprint planning.
    Lower items can be less detailed. The backlog is never complete - it evolves as we learn more about the product 
    and its users. Regular grooming keeps it healthy and relevant.
  `,
  "backlog refinement": `
    Backlog refinement, also called grooming, is the ongoing process of adding detail to backlog items.
    The team breaks down large items, adds acceptance criteria, and estimates. Spend about 10% of sprint capacity 
    on refinement. This prepares items for future sprints. Well-refined backlogs make sprint planning smooth 
    and reduce surprises during the sprint.
  `,
  "sprint planning": `
    Sprint planning kicks off each sprint. The team selects items from the product backlog they can complete.
    They create a sprint goal that provides focus. Tasks are created for each selected item. 
    The result is the sprint backlog - the team's commitment for the sprint. Good planning considers capacity, 
    dependencies, and the team's velocity. Plan thoroughly but timebox the meeting!
  `,
  "daily execution": `
    Daily execution in Scrum centers on the daily standup. Each team member answers three questions: 
    What did I complete yesterday? What will I work on today? What obstacles do I face?
    Keep it short - 15 minutes maximum. Stand up to keep it brief! Address blockers immediately after.
    The team self-organizes to meet the sprint goal.
  `,
  "daily stand up": `
    The daily standup is a 15-minute time-boxed event. It happens at the same time and place daily.
    Only the development team is required, but others can attend silently. It's not a status report to management - 
    it's for team coordination. Face each other, not a screen. Capture impediments for the Scrum Master to address.
    This daily touchpoint keeps the team aligned and moving forward.
  `,
  "burndown charts": `
    Burndown charts track remaining work over time. The vertical axis shows story points or tasks remaining.
    The horizontal axis shows days in the sprint. The ideal line shows perfect linear progress.
    The actual line shows reality. Deviations indicate problems or opportunities. Teams review burndowns daily 
    to forecast sprint completion. It's a powerful transparency tool!
  `,
  "sprint review": `
    The sprint review happens at the end of every sprint. The team demonstrates completed work to stakeholders.
    Feedback is collected to inform future backlog priorities. It's a collaborative working session, not a formal presentation.
    Celebrate accomplishments! The Product Owner updates the backlog based on feedback. 
    This is where delivered value meets customer reality.
  `,
  "sprint retrospective": `
    The sprint retrospective is where the team improves. What went well? What could be better? 
    What will we commit to improve? This is a safe space for honest reflection. Focus on process, not people.
    Create actionable improvement items. Follow up on previous commitments. 
    Teams that retrospect regularly get better and better over time!
  `,
  "measurements": `
    Effective metrics drive improvement. Velocity measures output consistency. Lead time measures delivery speed.
    Cycle time measures flow efficiency. Escaped defects measure quality. Team happiness matters too!
    Avoid vanity metrics - focus on actionable insights. Metrics should help the team, not judge them.
    What gets measured gets improved, so choose wisely!
  `,
  "next sprint": `
    Preparing for the next sprint starts before the current one ends. The Product Owner prioritizes the backlog.
    Refinement ensures top items are ready. The team considers lessons from the retrospective.
    Sprint planning sets the new goal and commitment. Each sprint builds on the last - 
    continuous improvement compounds over time into remarkable results!
  `,
  "anti-patterns health": `
    Agile anti-patterns are common mistakes that undermine Scrum. Zombie Scrum has all the events but delivers no value.
    ScrumBut changes rules to avoid discipline. Absent Product Owners create priority confusion.
    Unsupported teams face constant interruptions. Check your team's health regularly. 
    Address anti-patterns early before they become culture!
  `,
  "final project": `
    The final project brings everything together! You'll apply all the concepts learned throughout the course.
    Create a complete Agile plan from scratch. Define user stories, estimate with story points, 
    plan sprints, and simulate execution. Use GitHub or ZenHub to manage your project.
    This is your certification practice - treat it like the real thing!
  `,
  "project overview scenario": `
    Your final project scenario simulates a real product development situation. You'll receive requirements 
    from a fictional stakeholder. Create a product backlog, prioritize items, and plan two sprints.
    Execute the sprints, track progress with burndown charts, and conduct reviews and retrospectives.
    Document your process and decisions. This hands-on experience prepares you for real-world Scrum mastery!
  `,
  
  // CSM/PSM Certification topics
  "analyze apply deliver": `
    Master Agile and Scrum requires understanding theory and applying it in practice. Analyze means 
    understanding the principles deeply - why does Scrum work? Apply means using these principles in real situations.
    Deliver means producing value consistently. Excellence comes from continuous practice and reflection.
    The certification tests your ability to do all three!
  `,
  "mastering scrum essentials": `
    Scrum essentials start with the values: Commitment, Focus, Openness, Respect, and Courage.
    These values guide all Scrum activities. The Scrum framework provides structure, but values provide spirit.
    Master the events - each has a specific purpose and time-box. Understand artifacts and their transparency.
    Essential mastery means knowing not just what to do, but why we do it.
  `,
  "csm certification": `
    The Certified Scrum Master certification from Scrum Alliance validates your Scrum knowledge.
    The exam covers Scrum roles, events, artifacts, and their purposes. Expect scenario-based questions 
    that test your ability to apply Scrum principles. Study the Scrum Guide thoroughly.
    Practice with sample exams. Understand servant leadership and facilitation.
    CSM certified professionals are trusted Scrum practitioners!
  `,
  "psm certification": `
    The Professional Scrum Master certification from Scrum.org is challenging and respected.
    PSM-I requires 85% to pass - it's rigorous! The exam is based strictly on the Scrum Guide.
    Every word in the Scrum Guide matters. Scenario questions test application, not just memory.
    Time management is crucial - 60 minutes for 80 questions. Practice extensively before attempting!
    PSM certification demonstrates deep Scrum mastery.
  `,
  "exam preparation": `
    Successful exam preparation requires a structured approach. Read the Scrum Guide multiple times - 
    it's only about 20 pages! Take practice exams to identify weak areas. Study with a group for discussion.
    Understand the WHY behind every Scrum element. Time yourself on practice tests. 
    Rest well before the exam. You've prepared - trust your knowledge and apply it confidently!
  `
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoId, lessonTitle, lessonContent, professorIndex, courseTitle, chapterTitle } = await req.json();
    
    const professor = professors[professorIndex % professors.length];
    
    // Generate the lesson script with personalized content
    const script = generateLessonScript(lessonTitle, lessonContent, professor, courseTitle, chapterTitle);
    
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    
    // Try to generate audio with ElevenLabs
    if (ELEVENLABS_API_KEY) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${professor.voiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "xi-api-key": ELEVENLABS_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: script,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.3,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          
          const uint8Array = new Uint8Array(audioBuffer);
          const base64Audio = base64Encode(uint8Array);

          return new Response(
            JSON.stringify({
              success: true,
              mode: "audio",
              audioBase64: base64Audio,
              professor: {
                name: professor.name,
                id: professor.id,
              },
              script: script,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        
        // If ElevenLabs fails, log the error and fall through to text-only mode
        const errorText = await response.text();
        console.warn("ElevenLabs API failed, falling back to text-only mode:", errorText);
      } catch (ttsError) {
        console.warn("ElevenLabs request failed, falling back to text-only mode:", ttsError);
      }
    }
    
    // Text-only fallback mode - return just the script without audio
    console.log("Returning text-only lesson content");
    
    return new Response(
      JSON.stringify({
        success: true,
        mode: "text",
        audioBase64: null,
        professor: {
          name: professor.name,
          id: professor.id,
        },
        script: script,
        message: "Audio generation unavailable. Showing text lesson instead.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error generating lesson:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateLessonScript(title: string, content: any, professor: any, courseTitle?: string, chapterTitle?: string): string {
  const greetings = [
    `¡Hola, qué lo que! Welcome back to Aladiah Academy. I'm ${professor.name}, and today we're diving into something really exciting.`,
    `¡Dimelo! What's up everyone? ${professor.name} here, ready to drop some knowledge on you today.`,
    `¡Mira! Welcome, welcome! It's ${professor.name}, and I'm so happy to see you all here again.`,
    `¡Wepa! How are we doing today? ${professor.name} at your service, ready to make you an Agile expert!`,
  ];

  const transitions = [
    "Now, this is where it gets really interesting, tú sabes...",
    "Pay attention to this part, porque this is going to be on the exam, manito!",
    "Let me tell you something, mi gente...",
    "Here's where the magic happens, ¡de verdad!",
    "Now listen closely, because this is crucial for your certification...",
  ];

  const jokes = [
    "You know, my abuela used to say, 'Mijo, if you can organize a family sancocho for 30 people, you can be a Scrum Master!' And you know what? She wasn't wrong!",
    "This is like dominoes, my friend. You need strategy, you need teamwork, and you definitely need to know when to pass!",
    "In the DR, we say 'el que mucho abarca, poco aprieta' - and that's basically the Sprint Backlog in a nutshell!",
    "My cousin thought Scrum was a new bachata dance move. ¡Imagínate! But honestly, coordinating a Sprint is like leading a dance - everyone needs to know the steps!",
    "Back in my village, we'd say 'poco a poco se va lejos' - little by little you go far. That's iterative development, Dominican style!",
  ];

  const closings = [
    "And that's the lesson for today, mi gente! Remember, practice makes perfect. ¡Nos vemos pronto!",
    "That's a wrap, manito! Now go out there and be the Agile practitioner your team deserves. ¡Pa'lante siempre!",
    "Alright, that's all for now. Keep studying, keep practicing, and remember - you got this! ¡Bendiciones!",
    "We made it through another lesson! Give yourself a pat on the back. ¡Hasta la próxima!",
    "Now go practice what you learned, and remember - in Agile, we learn by doing! ¡Éxito!",
  ];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  const randomClosing = closings[Math.floor(Math.random() * closings.length)];

  // Find specific content for this topic
  const titleLower = title.toLowerCase();
  let specificContent = "";
  
  // Search for matching topic content
  for (const [keyword, content] of Object.entries(lessonContentByTopic)) {
    if (titleLower.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(titleLower.split(' ').slice(0, 3).join(' '))) {
      specificContent = content;
      break;
    }
  }

  // If no specific content found, try to match partial keywords
  if (!specificContent) {
    const keywords = titleLower.split(' ');
    for (const [topicKey, topicContent] of Object.entries(lessonContentByTopic)) {
      const topicKeywords = topicKey.toLowerCase().split(' ');
      const hasMatch = keywords.some(kw => topicKeywords.some(tk => tk.includes(kw) || kw.includes(tk)));
      if (hasMatch) {
        specificContent = topicContent;
        break;
      }
    }
  }

  // Build the script based on the lesson content
  let script = `${randomGreeting}\n\n`;
  
  if (courseTitle) {
    script += `We're continuing our journey in the ${courseTitle} course. `;
  }
  if (chapterTitle) {
    script += `This lesson is part of the ${chapterTitle} module. `;
  }
  
  script += `Today's topic is "${title}". ${randomJoke}\n\n`;
  
  // Add the specific content if found
  if (specificContent) {
    script += `${specificContent.trim()}\n\n`;
    script += `${randomTransition}\n\n`;
  }
  
  // Add any additional content passed in
  if (typeof content === 'string') {
    script += `${content}\n\n`;
  } else if (content?.mainPoints) {
    content.mainPoints.forEach((point: string, index: number) => {
      script += `Key point number ${index + 1}: ${point}\n\n`;
    });
  }

  script += `${randomClosing}`;

  return script;
}
