import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fixed UUIDs for the AI PM course
    const courseId = "dddddddd-eeee-ffff-1111-222222222222";
    
    const chapterIds = {
      module1: "e1111111-1111-1111-1111-111111111111",
      module2: "e2222222-2222-2222-2222-222222222222",
      module3: "e3333333-3333-3333-3333-333333333333",
      module4: "e4444444-4444-4444-4444-444444444444",
    };

    // Check if course already exists
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("id", courseId)
      .single();

    if (existingCourse) {
      return new Response(
        JSON.stringify({ message: "AI PM course already exists", courseId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the course
    const { error: courseError } = await supabase.from("courses").insert({
      id: courseId,
      title: "Managing AI Projects: From Strategy to Delivery",
      description: "Equip yourself with the tools and strategies to successfully design, manage, and scale AI projects in real-world environments. Covering the entire lifecycle from resource planning to deployment, this course emphasizes effective practices for optimizing performance, minimizing risks, and addressing ethical challenges.",
      is_published: true,
    });

    if (courseError) throw courseError;

    // Create chapters (modules)
    const chapters = [
      {
        id: chapterIds.module1,
        course_id: courseId,
        title: "Module 1: Course Introduction",
        description: "This course explores the end-to-end process of managing at-scale AI projects, focusing on key stages, management concerns, and risk mitigation strategies.",
        order_index: 0,
      },
      {
        id: chapterIds.module2,
        course_id: courseId,
        title: "Module 2: AI Impacts on Labor",
        description: "Covers key labor-related topics in AI projects, including common roles, essential skills, automation considerations, and building cognitively diverse teams for optimal outcomes.",
        order_index: 1,
      },
      {
        id: chapterIds.module3,
        course_id: courseId,
        title: "Module 3: Designing At-Scale AI Projects",
        description: "Explores the complexities of designing and delivering scalable AI projects, covering the entire lifecycle from planning to deployment with focus on scalability, resource management, and strategic decision-making.",
        order_index: 2,
      },
      {
        id: chapterIds.module4,
        course_id: courseId,
        title: "Module 4: Managing At-Scale AI Projects",
        description: "Gain insights into effective management strategies to optimize the delivery of AI projects on a large scale, including Agile methodologies, change management, and sound management practices.",
        order_index: 3,
      },
    ];

    const { error: chaptersError } = await supabase.from("chapters").insert(chapters);
    if (chaptersError) throw chaptersError;

    // Create videos for each module
    const videos = [
      // Module 1: Course Introduction
      {
        chapter_id: chapterIds.module1,
        title: "Course Overview",
        description: "Welcome to Managing AI Projects! Learn what awaits you in this comprehensive program on AI project management.",
        duration_seconds: 300,
        order_index: 0,
      },
      {
        chapter_id: chapterIds.module1,
        title: "Instructor Biography - Dr. Ian McCulloh",
        description: "Meet your instructor Dr. Ian McCulloh and learn about his extensive experience in AI project management.",
        duration_seconds: 240,
        order_index: 1,
      },

      // Module 2: AI Impacts on Labor (11 videos)
      {
        chapter_id: chapterIds.module2,
        title: "AI Common Roles and Skills",
        description: "Explore the common roles and essential skills required for success in AI projects.",
        duration_seconds: 600,
        order_index: 0,
      },
      {
        chapter_id: chapterIds.module2,
        title: "AI Roles in Development and Production",
        description: "Understand the different roles needed during AI development and production phases.",
        duration_seconds: 480,
        order_index: 1,
      },
      {
        chapter_id: chapterIds.module2,
        title: "The AI Flash Team",
        description: "Learn about the concept of AI Flash Teams and how to build rapid response AI units.",
        duration_seconds: 660,
        order_index: 2,
      },
      {
        chapter_id: chapterIds.module2,
        title: "The Talent Supply Chain",
        description: "Understand the talent supply chain for AI projects and how to manage it effectively.",
        duration_seconds: 720,
        order_index: 3,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Designing AI Role Structures in an Organization",
        description: "Learn how to design effective AI role structures within your organization.",
        duration_seconds: 840,
        order_index: 4,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Skills and Training Assessment",
        description: "Explore methods for assessing skills and training needs in AI teams.",
        duration_seconds: 480,
        order_index: 5,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Current and Emerging Labor Trends Part 1",
        description: "Examine current labor trends affecting AI project management.",
        duration_seconds: 600,
        order_index: 6,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Current and Emerging Labor Trends Part 2",
        description: "Continue exploring labor trends and their implications for AI teams.",
        duration_seconds: 540,
        order_index: 7,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Current and Emerging Labor Trends Part 3",
        description: "Conclude the labor trends analysis with future projections.",
        duration_seconds: 900,
        order_index: 8,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Performance Assessment Part 1",
        description: "Learn effective methods for assessing AI team performance.",
        duration_seconds: 600,
        order_index: 9,
      },
      {
        chapter_id: chapterIds.module2,
        title: "Performance Assessment Part 2",
        description: "Continue with advanced performance assessment techniques.",
        duration_seconds: 840,
        order_index: 10,
      },

      // Module 3: Designing At-Scale AI Projects (11 videos)
      {
        chapter_id: chapterIds.module3,
        title: "Designing At-Scale AI Projects",
        description: "Introduction to designing AI projects that can scale effectively.",
        duration_seconds: 840,
        order_index: 0,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Example Projects",
        description: "Analyze real-world examples of successful at-scale AI projects.",
        duration_seconds: 780,
        order_index: 1,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Management of At-Scale AI Projects",
        description: "Learn key management principles for large-scale AI initiatives.",
        duration_seconds: 720,
        order_index: 2,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Operating Models",
        description: "Explore different operating models for AI project delivery.",
        duration_seconds: 600,
        order_index: 3,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Management Considerations",
        description: "Understand critical management considerations for AI projects.",
        duration_seconds: 600,
        order_index: 4,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Use Case – Australian Customs and Border Protection",
        description: "Deep dive into a real-world case study of AI implementation.",
        duration_seconds: 720,
        order_index: 5,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Solutioning AI Projects",
        description: "Learn how to solution AI projects from requirements to design.",
        duration_seconds: 780,
        order_index: 6,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Cost Estimation and Financials AI Projects",
        description: "Master cost estimation techniques for AI project budgeting.",
        duration_seconds: 720,
        order_index: 7,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Financial Key Performance Indicators (KPIs)",
        description: "Understand financial KPIs essential for AI project success.",
        duration_seconds: 480,
        order_index: 8,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Schedule and Staffing Mobilization - Part 1",
        description: "Learn effective scheduling and staffing strategies for AI projects.",
        duration_seconds: 840,
        order_index: 9,
      },
      {
        chapter_id: chapterIds.module3,
        title: "Schedule and Staffing Mobilization - Part 2",
        description: "Continue with advanced mobilization techniques.",
        duration_seconds: 660,
        order_index: 10,
      },

      // Module 4: Managing At-Scale AI Projects (7 videos)
      {
        chapter_id: chapterIds.module4,
        title: "Managing At-Scale AI Projects",
        description: "Overview of management strategies for large-scale AI delivery.",
        duration_seconds: 900,
        order_index: 0,
      },
      {
        chapter_id: chapterIds.module4,
        title: "Optimizing At-Scale AI Delivery - Part 1",
        description: "Learn optimization techniques for AI project delivery.",
        duration_seconds: 540,
        order_index: 1,
      },
      {
        chapter_id: chapterIds.module4,
        title: "Optimizing At-Scale AI Delivery - Part 2",
        description: "Continue with advanced optimization strategies.",
        duration_seconds: 1260,
        order_index: 2,
      },
      {
        chapter_id: chapterIds.module4,
        title: "Agile Methods for At-Scale AI Delivery",
        description: "Apply Agile methodologies to large-scale AI projects.",
        duration_seconds: 1560,
        order_index: 3,
      },
      {
        chapter_id: chapterIds.module4,
        title: "Mitigating Risks in At-Scale AI Projects",
        description: "Identify and mitigate risks in large AI initiatives.",
        duration_seconds: 900,
        order_index: 4,
      },
      {
        chapter_id: chapterIds.module4,
        title: "Stakeholder and Change Management",
        description: "Master stakeholder engagement and change management for AI.",
        duration_seconds: 1620,
        order_index: 5,
      },
      {
        chapter_id: chapterIds.module4,
        title: "Demonstrating Sound Management Practices",
        description: "Learn best practices for demonstrating effective AI project management.",
        duration_seconds: 1380,
        order_index: 6,
      },
    ];

    const { data: insertedVideos, error: videosError } = await supabase
      .from("videos")
      .insert(videos)
      .select("id, chapter_id, title, order_index");
    
    if (videosError) throw videosError;

    // Create quizzes for each video (mini_video type) and each chapter (chapter_end type)
    const quizzes = [];

    // Mini quizzes for each video
    for (const video of insertedVideos) {
      quizzes.push({
        video_id: video.id,
        chapter_id: video.chapter_id,
        quiz_type: "mini_video",
        passing_score: 100,
      });
    }

    // Chapter end quizzes
    for (const chapterId of Object.values(chapterIds)) {
      quizzes.push({
        video_id: null,
        chapter_id: chapterId,
        quiz_type: "chapter_end",
        passing_score: 100,
      });
    }

    const { data: insertedQuizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .insert(quizzes)
      .select("id, video_id, chapter_id, quiz_type");
    
    if (quizzesError) throw quizzesError;

    // Generate quiz questions for each quiz
    const quizQuestions = [];

    for (const quiz of insertedQuizzes) {
      const video = insertedVideos.find(v => v.id === quiz.video_id);
      const chapter = chapters.find(c => c.id === quiz.chapter_id);
      
      const questionCount = quiz.quiz_type === "mini_video" ? 5 : 40;
      const topic = video?.title || chapter?.title || "AI Project Management";
      
      for (let i = 0; i < questionCount; i++) {
        quizQuestions.push(generateAIPMQuestion(quiz.id, topic, i, quiz.quiz_type));
      }
    }

    const { error: questionsError } = await supabase
      .from("quiz_questions")
      .insert(quizQuestions);
    
    if (questionsError) throw questionsError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "AI PM course created successfully",
        courseId,
        videosCreated: insertedVideos.length,
        quizzesCreated: insertedQuizzes.length,
        questionsCreated: quizQuestions.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error seeding AI PM course:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateAIPMQuestion(quizId: string, topic: string, index: number, quizType: string) {
  const questionBanks: Record<string, any[]> = {
    "Course Overview": [
      {
        question: "What is the PRIMARY focus of this AI Project Management course?",
        options: ["Learning programming languages", "Managing end-to-end AI project lifecycle", "Building machine learning models", "Data engineering techniques"],
        correct: 1,
        explanation: "This course focuses on the complete lifecycle of managing AI projects from strategy to delivery."
      },
      {
        question: "Which aspect makes this AI PM course unique?",
        options: ["Focus only on technical aspects", "Focus on both technical and human aspects", "Focus only on coding", "Focus only on documentation"],
        correct: 1,
        explanation: "The course uniquely addresses both technical and human aspects of AI project management."
      },
      {
        question: "What type of learners would benefit most from this course?",
        options: ["Only data scientists", "Only developers", "Anyone leading or managing AI initiatives", "Only executives"],
        correct: 2,
        explanation: "The course is designed for anyone involved in leading or managing AI projects at any scale."
      },
      {
        question: "What approach does the course use to ensure practical learning?",
        options: ["Only theoretical lectures", "Case studies and practical examples", "Only reading assignments", "Only coding exercises"],
        correct: 1,
        explanation: "The course uses case studies and practical examples to provide actionable knowledge."
      },
      {
        question: "Which of the following is NOT a key topic covered in this course?",
        options: ["Risk mitigation", "Team collaboration", "Database administration", "Ethical challenges"],
        correct: 2,
        explanation: "Database administration is not a focus; the course covers management, risk, ethics, and team dynamics."
      }
    ],
    "AI Common Roles and Skills": [
      {
        question: "Which role is primarily responsible for ensuring AI models work correctly in production?",
        options: ["Data Scientist", "ML Engineer", "Product Manager", "Business Analyst"],
        correct: 1,
        explanation: "ML Engineers focus on deploying and maintaining AI models in production environments."
      },
      {
        question: "What skill is essential for ALL AI project team members?",
        options: ["Deep learning expertise", "Effective communication", "Database administration", "Frontend development"],
        correct: 1,
        explanation: "Effective communication is essential for all team members to collaborate successfully."
      },
      {
        question: "Which role bridges the gap between business needs and technical implementation?",
        options: ["Data Engineer", "ML Researcher", "AI Product Manager", "DevOps Engineer"],
        correct: 2,
        explanation: "AI Product Managers translate business requirements into technical specifications."
      },
      {
        question: "What distinguishes a Data Scientist from an ML Engineer?",
        options: ["Data Scientists focus more on exploration and modeling", "There is no difference", "ML Engineers do more research", "Data Scientists only clean data"],
        correct: 0,
        explanation: "Data Scientists focus on exploration, analysis, and model development, while ML Engineers focus on production deployment."
      },
      {
        question: "Which skill cluster is most important for AI team leadership?",
        options: ["Only technical skills", "Only soft skills", "Combination of technical understanding and leadership", "Only project management certification"],
        correct: 2,
        explanation: "Effective AI leadership requires both technical understanding and leadership capabilities."
      }
    ],
    "The AI Flash Team": [
      {
        question: "What is the PRIMARY purpose of an AI Flash Team?",
        options: ["Long-term product development", "Rapid response to AI opportunities or problems", "Research only", "Training new employees"],
        correct: 1,
        explanation: "AI Flash Teams are designed for rapid mobilization to address urgent AI opportunities or challenges."
      },
      {
        question: "What characteristic defines a successful Flash Team?",
        options: ["Large team size", "Cross-functional expertise and agility", "Focus on single skill", "Permanent team structure"],
        correct: 1,
        explanation: "Flash Teams succeed through cross-functional expertise and the ability to move quickly."
      },
      {
        question: "When should an organization deploy a Flash Team?",
        options: ["For routine maintenance", "When rapid AI deployment is critical", "For annual planning", "Only for failed projects"],
        correct: 1,
        explanation: "Flash Teams are deployed when speed and focused expertise are critical for AI initiatives."
      },
      {
        question: "What is a key risk of Flash Team approaches?",
        options: ["Too slow", "Knowledge loss after disbandment", "Too many resources", "Lack of expertise"],
        correct: 1,
        explanation: "A key risk is losing institutional knowledge when the team disbands after completing their mission."
      },
      {
        question: "How should Flash Teams be structured for optimal performance?",
        options: ["Hierarchical with many approval layers", "Flat with autonomous decision-making", "Matrix with dual reporting", "Traditional project structure"],
        correct: 1,
        explanation: "Flash Teams work best with flat structures allowing rapid, autonomous decision-making."
      }
    ],
    "Designing At-Scale AI Projects": [
      {
        question: "What is the FIRST consideration when designing at-scale AI projects?",
        options: ["Choosing the latest technology", "Understanding business objectives and constraints", "Hiring more staff", "Building the largest possible dataset"],
        correct: 1,
        explanation: "Understanding business objectives and constraints is fundamental to successful AI project design."
      },
      {
        question: "Which factor is MOST critical for AI project scalability?",
        options: ["Using the newest algorithms", "Architecture that supports growth", "Having the most data scientists", "Using cloud computing only"],
        correct: 1,
        explanation: "Scalable architecture is essential for AI projects that need to grow and handle increasing demands."
      },
      {
        question: "What approach helps manage complexity in large AI projects?",
        options: ["Avoiding documentation", "Modular design with clear interfaces", "Single monolithic system", "Minimal testing"],
        correct: 1,
        explanation: "Modular design with clear interfaces helps manage complexity and enables independent scaling."
      },
      {
        question: "How should resource allocation be approached in at-scale AI projects?",
        options: ["Fixed allocation throughout", "Dynamic allocation based on project phases", "Minimal resources at all times", "Maximum resources from start"],
        correct: 1,
        explanation: "Dynamic resource allocation allows flexibility as project needs evolve through different phases."
      },
      {
        question: "What is a common pitfall in scaling AI projects?",
        options: ["Too much planning", "Underestimating data infrastructure needs", "Over-communicating with stakeholders", "Excessive testing"],
        correct: 1,
        explanation: "Underestimating data infrastructure is a common pitfall that can derail AI scaling efforts."
      }
    ],
    "Managing At-Scale AI Projects": [
      {
        question: "What management approach is MOST effective for at-scale AI projects?",
        options: ["Waterfall only", "Hybrid Agile with appropriate governance", "No formal methodology", "Strict command and control"],
        correct: 1,
        explanation: "Hybrid Agile approaches balance flexibility with necessary governance for large-scale AI projects."
      },
      {
        question: "How should risk be managed in large AI projects?",
        options: ["Ignore until problems occur", "Proactive identification and mitigation strategies", "Transfer all risk to vendors", "Accept all risks as inevitable"],
        correct: 1,
        explanation: "Proactive risk identification and mitigation are essential for managing large AI projects successfully."
      },
      {
        question: "What is the role of governance in at-scale AI projects?",
        options: ["Slowing down progress", "Ensuring alignment, compliance, and quality", "Blocking innovation", "Only for reporting to executives"],
        correct: 1,
        explanation: "Governance ensures alignment with objectives, regulatory compliance, and quality standards."
      },
      {
        question: "How should stakeholder expectations be managed?",
        options: ["Promise everything they want", "Regular communication with realistic timelines", "Avoid stakeholder contact", "Only report successes"],
        correct: 1,
        explanation: "Regular, honest communication with realistic expectations is key to stakeholder management."
      },
      {
        question: "What metric is MOST important for measuring AI project success?",
        options: ["Lines of code written", "Business value delivered", "Number of models built", "Team size"],
        correct: 1,
        explanation: "Business value delivered is the ultimate measure of AI project success."
      }
    ],
    "Agile Methods for At-Scale AI Delivery": [
      {
        question: "How should Agile be adapted for AI projects?",
        options: ["Use exactly as defined for software", "Adapt sprints for experimentation and iteration", "Abandon Agile entirely", "Only use Kanban"],
        correct: 1,
        explanation: "AI projects require adapted Agile approaches that accommodate experimentation and model iteration."
      },
      {
        question: "What is a key challenge of applying Agile to AI projects?",
        options: ["Agile is too slow", "Uncertainty in model development outcomes", "Teams don't like Agile", "No documentation needed"],
        correct: 1,
        explanation: "The inherent uncertainty in AI model development requires flexible sprint planning and expectations."
      },
      {
        question: "How should sprint planning account for AI development?",
        options: ["Ignore AI-specific needs", "Include time for experimentation and failure", "Only plan successful outcomes", "Avoid sprint planning"],
        correct: 1,
        explanation: "AI sprint planning must include time for experimentation, iteration, and learning from failures."
      },
      {
        question: "What is the role of the Scrum Master in AI projects?",
        options: ["Building AI models", "Facilitating team processes and removing impediments", "Making all technical decisions", "Managing stakeholders only"],
        correct: 1,
        explanation: "The Scrum Master facilitates processes and removes impediments, including AI-specific challenges."
      },
      {
        question: "How should AI project demos be conducted?",
        options: ["Show only polished results", "Include both successes and learnings from experiments", "Avoid demos until project end", "Only show technical metrics"],
        correct: 1,
        explanation: "AI demos should showcase both successes and learnings to maintain transparency and realistic expectations."
      }
    ],
    "Mitigating Risks in At-Scale AI Projects": [
      {
        question: "What is the MOST significant risk category in AI projects?",
        options: ["Only technical risks", "Data quality and bias risks", "Only schedule risks", "Only budget risks"],
        correct: 1,
        explanation: "Data quality and bias risks can fundamentally undermine AI project outcomes and must be prioritized."
      },
      {
        question: "How should ethical risks in AI be addressed?",
        options: ["Ignore until complaints arise", "Proactive assessment and mitigation from project start", "Delegate to legal team only", "Address only if required by law"],
        correct: 1,
        explanation: "Ethical risks require proactive assessment and mitigation strategies from the project's inception."
      },
      {
        question: "What is a key strategy for mitigating model risk?",
        options: ["Use only one model", "Implement robust testing and validation", "Avoid documentation", "Deploy without testing"],
        correct: 1,
        explanation: "Robust testing and validation processes are essential for mitigating AI model risks."
      },
      {
        question: "How should regulatory compliance risks be managed?",
        options: ["Wait for regulations to be enforced", "Build compliance considerations into design", "Ignore regulations", "Address compliance after deployment"],
        correct: 1,
        explanation: "Regulatory compliance should be built into the project design from the beginning."
      },
      {
        question: "What role does documentation play in risk mitigation?",
        options: ["No role", "Critical for traceability and audit requirements", "Only for legal purposes", "Optional nice-to-have"],
        correct: 1,
        explanation: "Documentation is critical for traceability, audit requirements, and institutional knowledge preservation."
      }
    ],
    "Stakeholder and Change Management": [
      {
        question: "Who are the PRIMARY stakeholders in AI projects?",
        options: ["Only IT department", "Business users, executives, and technical teams", "Only data scientists", "Only external customers"],
        correct: 1,
        explanation: "AI projects impact and involve business users, executives, and technical teams as primary stakeholders."
      },
      {
        question: "What is the BEST approach to managing AI-related organizational change?",
        options: ["Implement changes without communication", "Gradual change with training and support", "Force immediate adoption", "Avoid change management"],
        correct: 1,
        explanation: "Gradual change with proper training and support ensures successful AI adoption across the organization."
      },
      {
        question: "How should resistance to AI be addressed?",
        options: ["Ignore resistors", "Understand concerns and address through education and involvement", "Remove resistant employees", "Mandate compliance"],
        correct: 1,
        explanation: "Understanding and addressing concerns through education and involvement builds acceptance and support."
      },
      {
        question: "What communication strategy works best for AI projects?",
        options: ["Technical jargon for everyone", "Tailored messaging for different stakeholder groups", "Minimal communication", "Only written reports"],
        correct: 1,
        explanation: "Different stakeholders need tailored messaging appropriate to their interests and technical understanding."
      },
      {
        question: "How should AI project impact on jobs be communicated?",
        options: ["Avoid the topic", "Honest, proactive communication with transition support", "Promise no changes", "Only discuss after implementation"],
        correct: 1,
        explanation: "Honest, proactive communication with support for transitions builds trust and reduces anxiety."
      }
    ]
  };

  // Generic questions for topics not in the bank
  const genericQuestions = [
    {
      question: `What is the PRIMARY purpose of ${topic} in AI project management?`,
      options: ["To add bureaucratic processes", "To enable successful AI project delivery", "To slow down development", "To reduce team size"],
      correct: 1,
      explanation: `${topic} is designed to enable successful AI project delivery through structured approaches and best practices.`
    },
    {
      question: `Which of the following is a key benefit of properly implementing ${topic}?`,
      options: ["Reduced collaboration", "Longer project timelines", "Improved project outcomes and reduced risks", "Elimination of all meetings"],
      correct: 2,
      explanation: `Proper implementation of ${topic} leads to improved outcomes and reduced project risks.`
    },
    {
      question: `How does ${topic} contribute to AI project success?`,
      options: ["It doesn't contribute", "Provides structure and best practices for delivery", "Only adds documentation", "Replaces the need for skilled team members"],
      correct: 1,
      explanation: `${topic} provides essential structure and best practices that support successful AI project delivery.`
    },
    {
      question: `What is the BEST approach to implementing ${topic}?`,
      options: ["Ignore stakeholder input", "Adapt to project context while following core principles", "Apply rigidly without adaptation", "Avoid documentation"],
      correct: 1,
      explanation: `The best approach is to adapt ${topic} to your specific project context while maintaining core principles.`
    },
    {
      question: `What should be considered when evaluating ${topic} effectiveness?`,
      options: ["Only cost savings", "Business value delivered and team performance", "Only speed of delivery", "Number of documents produced"],
      correct: 1,
      explanation: `Effectiveness should be measured by business value delivered and overall team performance.`
    }
  ];

  // Find matching questions or use generic
  const topicKey = Object.keys(questionBanks).find(key => 
    topic.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(topic.toLowerCase())
  );
  
  const availableQuestions = topicKey ? questionBanks[topicKey] : genericQuestions;
  const questionData = availableQuestions[index % availableQuestions.length];

  return {
    quiz_id: quizId,
    question_text: questionData.question,
    scenario_context: `During an AI project management discussion about ${topic}, a team member asks for clarification on this concept.`,
    options: JSON.stringify(questionData.options),
    correct_answer_index: questionData.correct,
    explanation: questionData.explanation,
    order_index: index,
  };
}
