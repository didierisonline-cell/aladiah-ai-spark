import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { requireAdmin } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const courseData = {
  title: "AI Mastery for Scrum Masters & Project Managers",
  description: "Master the most powerful AI tools of 2025-2026 to automate workflows, accelerate delivery, and become the highest-performing Scrum Master or Project Manager on your team. Covers ChatGPT, GitHub Copilot, Jira AI, Notion AI, and dozens more tools through practical exercises and real-world scenarios.",
  chapters: [
    // MODULE 1
    {
      title: "Module 1: AI Foundations for Project Managers & Scrum Masters",
      description: "Understand what AI means for project delivery, learn to evaluate AI tools critically, and build an AI-first mindset that transforms how you lead teams.",
      order_index: 0,
      videos: [
        {
          title: "1.1 The AI Revolution in Project Management",
          description: "Discover how AI is reshaping project management and Scrum. Learn why AI literacy separates top-performing PMs from the rest.",
          order_index: 0, professorIndex: 0,
          lessonScript: { mainPoints: ["AI is fundamentally reshaping project management in 2025-2026.", "PMs who leverage AI deliver 20-40% faster than those who don't.", "AI automates routine tasks so you can focus on leadership and decision-making.", "The AI-first mindset means asking 'Can AI handle this?' before defaulting to manual.", "By the end of this course you'll have a complete AI-powered PM toolkit."] },
          questions: [
            { question_text: "What is the PRIMARY reason AI literacy is essential for PMs in 2025-2026?", scenario_context: "Your organization is deciding which PM competencies to invest in.", options: ["AI will replace all PMs within 2 years", "AI tools automate routine tasks, letting PMs focus on leadership and decisions", "Clients require PMs to have computer science degrees", "AI is a temporary trend that will fade"], correct_answer_index: 1, explanation: "AI augments the PM role by automating routine tasks, freeing PMs to focus on leadership, stakeholder management, and strategic decisions." },
            { question_text: "How does AI change the Scrum Master's daily workflow?", scenario_context: "A traditional SM is considering how AI tools might change their role.", options: ["AI eliminates the need for Scrum ceremonies", "AI automates note-taking and pattern analysis while the SM focuses on coaching", "AI replaces the SM role entirely", "AI only helps with technical tasks"], correct_answer_index: 1, explanation: "AI handles mechanical tasks (transcription, summarization) while the SM focuses on coaching, facilitation, and removing impediments." },
            { question_text: "A PM says their team doesn't need AI because they're already efficient. What's the BEST counter-argument?", scenario_context: "You're presenting an AI adoption proposal to a skeptical PMO.", options: ["AI is mandatory", "Competing teams using AI will deliver faster, creating a widening gap", "AI tools are free", "The CEO said everyone must use AI"], correct_answer_index: 1, explanation: "Teams augmented by AI show 20-40% improvements in delivery speed. Teams that don't adopt fall behind as AI raises the performance baseline." },
            { question_text: "Which PM activity is LEAST likely to be fully automated by AI?", scenario_context: "You're mapping which activities should be AI-augmented vs. kept human.", options: ["Writing status reports", "Navigating organizational politics and stakeholder conflicts", "Generating meeting summaries", "Categorizing backlog items"], correct_answer_index: 1, explanation: "Politics and conflict resolution require emotional intelligence and relationship context that AI cannot replicate." },
            { question_text: "What is the 'AI-first mindset' for project management?", scenario_context: "You're coaching a team on adopting AI tools.", options: ["Always use AI, never do anything manually", "Start every task by asking 'Can AI handle this?' before defaulting to manual", "Replace all team members with AI", "Only use AI for tasks taking more than 4 hours"], correct_answer_index: 1, explanation: "AI-first means making AI the default starting point, then deciding where human judgment adds value." }
          ]
        },
        {
          title: "1.2 How AI Actually Works: A PM's Guide to LLMs, Agents, and Automation",
          description: "Demystify AI terminology. Understand LLMs, AI agents, RAG, and automation pipelines at the level needed for smart tool decisions.",
          order_index: 1, professorIndex: 1,
          lessonScript: { mainPoints: ["Large Language Models (LLMs) power tools like ChatGPT and Claude.", "AI agents can chain actions together to accomplish complex multi-step tasks.", "RAG (Retrieval-Augmented Generation) lets AI reference YOUR project data.", "AI hallucination means models can generate confident but incorrect information.", "Understanding these concepts helps you evaluate tools and talk to engineering."] },
          questions: [
            { question_text: "What does 'LLM' stand for and why should a PM care?", scenario_context: "Your engineering team is discussing adopting an LLM-based tool.", options: ["Large Language Model — the tech behind ChatGPT that PMs use for content generation and analysis", "Lean Lifecycle Management — a PM framework", "Linear Logic Machine — a calculator for estimation", "Low Latency Messaging — a chat protocol"], correct_answer_index: 0, explanation: "LLMs power most AI tools PMs use. Understanding this helps evaluate and select the right tools." },
            { question_text: "What is RAG and how is it relevant to PM tools?", scenario_context: "A vendor claims their AI tool uses RAG for project-specific answers.", options: ["AI pulls from your own documents before generating answers, making responses project-specific", "A method for generating random test data", "A security protocol for AI systems", "A rating system for AI quality"], correct_answer_index: 0, explanation: "RAG lets AI reference your project docs and sprint data, making outputs relevant to YOUR project." },
            { question_text: "What is an 'AI agent' in project management automation?", scenario_context: "You're evaluating a tool advertised as an 'AI agent for PM.'", options: ["A human AI consultant", "An AI that autonomously performs multi-step tasks and uses tools to achieve goals", "A chatbot that only answers questions", "A database for project info"], correct_answer_index: 1, explanation: "AI agents chain multiple actions and make intermediate decisions to accomplish complex goals." },
            { question_text: "Why is understanding 'hallucination' critical for PMs using AI?", scenario_context: "You used ChatGPT for a risk analysis and are about to share it.", options: ["Hallucination isn't a real concern", "AI can generate confident but factually incorrect info, so PMs must verify outputs", "Hallucination only affects image generation", "Hallucination means the AI crashes"], correct_answer_index: 1, explanation: "AI hallucination means false info with high confidence. PMs must treat AI output as a draft requiring review." },
            { question_text: "What's the difference between AI 'automation' and 'augmentation'?", scenario_context: "You're categorizing PM tasks for AI approach.", options: ["No difference", "Automation = AI does it end-to-end; augmentation = AI assists while human retains control", "Automation is cheaper", "Automation is technical only"], correct_answer_index: 1, explanation: "Automation replaces human effort; augmentation enhances human capability with AI assistance." }
          ]
        },
        {
          title: "1.3 Evaluating AI Tools: A Decision Framework for PMs",
          description: "Learn a 5-criteria framework: accuracy, integration, security, cost-to-value, and adoption friction. Compare real tools side by side.",
          order_index: 2, professorIndex: 2,
          lessonScript: { mainPoints: ["Five criteria: accuracy, integration capability, security posture, cost-to-value ratio, adoption friction.", "Integration capability determines if the tool fits your existing workflow.", "Security posture is non-negotiable — check SOC 2, GDPR compliance.", "Adoption friction kills powerful tools — ease of use matters enormously.", "Always run a time-boxed pilot before committing to any AI tool."] },
          questions: [
            { question_text: "What are the five criteria in the AI tool evaluation framework?", scenario_context: "Your PMO asks you to recommend an AI tool.", options: ["Price, brand, popularity, design, speed", "Accuracy, integration capability, security posture, cost-to-value ratio, adoption friction", "Features, reviews, downloads, pricing, support", "Model size, training data, valuation, marketing, partnerships"], correct_answer_index: 1, explanation: "These five criteria provide a comprehensive lens for evaluating any AI tool's fit for your team." },
            { question_text: "When evaluating 'integration capability,' what should a PM prioritize?", scenario_context: "Comparing two AI meeting assistants — one integrates with your stack, one doesn't.", options: ["The tool should work standalone", "It should connect with existing PM tools, comms platforms, and data sources", "It should replace all existing tools", "Integration doesn't matter if AI is powerful"], correct_answer_index: 1, explanation: "A powerful tool that doesn't connect to Jira, Slack, or your repo is far less valuable than one that integrates." },
            { question_text: "What does 'adoption friction' measure?", scenario_context: "You selected a powerful AI tool but your team refuses to use it.", options: ["How expensive the tool is", "Resistance, learning curve, and workflow disruption when adopting the tool", "How many features it has", "How fast it processes requests"], correct_answer_index: 1, explanation: "High friction tools get abandoned regardless of capability. Ease of adoption must be weighed heavily." },
            { question_text: "A free AI tool processes data on external servers with no SOC 2 compliance. What should you do?", scenario_context: "A team member recommends a capable free AI tool.", options: ["Use it since it's free", "Evaluate security posture against your org's data policies before allowing project data", "Security doesn't matter for PM data", "Only use for personal tasks"], correct_answer_index: 1, explanation: "Project data often contains sensitive business info. Tools without compliance certifications pose breach risks." },
            { question_text: "How should 'cost-to-value ratio' be calculated?", scenario_context: "You need to justify an AI tool subscription to finance.", options: ["Compare price to competitors only", "Total cost vs measurable time saved, quality improvements, and faster delivery", "Choose cheapest option", "Cost doesn't matter if tool is good"], correct_answer_index: 1, explanation: "A $50/month tool saving 10 hours per sprint is extremely high value. Measure total benefit against total cost." }
          ]
        },
        {
          title: "1.4 Building an AI-First Mindset on Your Team",
          description: "Shift from 'AI as optional' to 'AI as default.' Learn change management techniques specific to AI adoption.",
          order_index: 3, professorIndex: 0,
          lessonScript: { mainPoints: ["The biggest barrier to AI adoption is mindset, not technology.", "Start with quick wins — automate one visible, painful task first.", "Create psychological safety for experimentation with AI tools.", "Designate AI champions on the team to model usage.", "Measure and celebrate AI-driven improvements to build momentum."] },
          questions: [
            { question_text: "What is the biggest barrier to AI adoption on teams?", scenario_context: "You're planning an AI rollout for your Scrum team.", options: ["Cost of tools", "Mindset and resistance to change, not technology", "Lack of AI tools", "Team size"], correct_answer_index: 1, explanation: "Most AI tools are accessible and affordable. The real barrier is changing how people think about their work." },
            { question_text: "What's the BEST first step to build an AI-first culture?", scenario_context: "Your team is skeptical about AI tools.", options: ["Mandate AI usage for all tasks", "Start with one quick win — automate a visible, painful task to show value", "Give a 3-hour presentation on AI theory", "Wait for the team to adopt naturally"], correct_answer_index: 1, explanation: "Quick wins build momentum. Pick one painful manual task, automate it, and let the results speak." },
            { question_text: "What role do 'AI champions' play on the team?", scenario_context: "You're structuring your AI adoption plan.", options: ["They enforce AI tool usage", "They model AI usage, share tips, and help teammates overcome friction", "They report non-compliance to management", "They build the AI tools themselves"], correct_answer_index: 1, explanation: "AI champions lead by example, share discoveries, and provide peer support for adoption." },
            { question_text: "How should a PM handle a team member who fears AI will replace their job?", scenario_context: "A developer expresses anxiety about AI coding assistants.", options: ["Tell them to get over it", "Acknowledge the concern and show how AI augments their skills, making them more valuable", "Ignore the concern", "Agree that they should be worried"], correct_answer_index: 1, explanation: "Address fears directly with empathy and evidence. AI makes skilled professionals more productive, not replaceable." },
            { question_text: "What should you measure to track AI adoption success?", scenario_context: "Leadership wants metrics on your AI initiative.", options: ["Number of AI tools purchased", "Time saved, quality improvements, and team satisfaction with AI-augmented workflows", "Number of prompts sent to ChatGPT", "Social media mentions of AI"], correct_answer_index: 1, explanation: "Measure outcomes (time saved, quality, satisfaction) not inputs (tools purchased, prompts sent)." }
          ]
        },
        {
          title: "1.5 AI Ethics, Security, and Governance for Project Leaders",
          description: "Data privacy risks, hallucination management, and corporate AI governance. Create an AI usage policy for your team.",
          order_index: 4, professorIndex: 1,
          lessonScript: { mainPoints: ["Never paste confidential data into public AI tools without approval.", "AI hallucinations can be dangerous in stakeholder communications — always verify.", "Create a simple AI usage policy: what data can go in, what tools are approved.", "Understand GDPR, SOC 2, and your org's specific data handling requirements.", "Bias in AI outputs can affect hiring, prioritization, and resource allocation."] },
          questions: [
            { question_text: "A PM pastes a client's confidential revenue data into ChatGPT to generate a report. What's wrong?", scenario_context: "A team member is using AI to speed up reporting.", options: ["Nothing wrong", "Public AI tools may store/train on input data, violating client confidentiality", "It's only wrong if the report is wrong", "ChatGPT is always safe for any data"], correct_answer_index: 1, explanation: "Data sent to public AI tools may be stored, used for training, or exposed. Confidential data needs approved, enterprise-grade tools." },
            { question_text: "How should a PM handle AI hallucinations in stakeholder communications?", scenario_context: "AI-generated metrics in your status report look suspicious.", options: ["Trust AI outputs — they're always accurate", "Always verify AI-generated facts and data before sharing with stakeholders", "Only verify if someone questions the data", "Add a disclaimer that AI might be wrong"], correct_answer_index: 1, explanation: "AI can generate plausible but false information. PMs must verify all AI outputs before external communication." },
            { question_text: "What should an AI usage policy for your team include?", scenario_context: "You're drafting AI governance guidelines.", options: ["A ban on all AI tools", "Approved tools list, data classification rules, and verification requirements", "Just a link to ChatGPT", "Nothing — let people use whatever they want"], correct_answer_index: 1, explanation: "A good policy defines which tools are approved, what data can be shared, and when human verification is required." },
            { question_text: "What is AI bias and why should PMs care?", scenario_context: "Using AI to help with resource allocation decisions.", options: ["AI bias doesn't exist", "AI can reflect biases from training data, affecting decisions on hiring, prioritization, and resources", "Bias only matters in healthcare AI", "PMs can't do anything about bias"], correct_answer_index: 1, explanation: "AI models can perpetuate biases. PMs must review AI recommendations critically, especially for decisions affecting people." },
            { question_text: "Which is the safest approach to using AI tools with sensitive project data?", scenario_context: "Your project involves proprietary algorithms.", options: ["Use any AI tool — they're all secure", "Use enterprise-grade tools with SOC 2 compliance and data processing agreements", "Only use AI offline", "Avoid AI entirely"], correct_answer_index: 1, explanation: "Enterprise tools with compliance certifications (SOC 2, GDPR) and DPAs provide the security guarantees needed for sensitive data." }
          ]
        },
        {
          title: "1.6 The AI-Augmented PM/SM: Your New Role Definition",
          description: "Map out which parts of your workflow AI can automate, augment, or where it should not be used.",
          order_index: 5, professorIndex: 2,
          lessonScript: { mainPoints: ["Map every PM task into three buckets: automate, augment, or keep human.", "AI excels at: data analysis, writing drafts, pattern recognition, scheduling.", "Humans excel at: stakeholder relationships, conflict resolution, creative strategy.", "The augmented PM delivers in days what used to take weeks.", "Your competitive advantage is knowing WHEN to use AI and when not to."] },
          questions: [
            { question_text: "Which PM task is BEST suited for full AI automation?", scenario_context: "You're mapping your workflow for AI integration.", options: ["Negotiating with a difficult stakeholder", "Generating meeting summaries from transcripts", "Mentoring a junior team member", "Resolving a team conflict"], correct_answer_index: 1, explanation: "Meeting summarization is mechanical and repetitive — perfect for full automation. Human tasks need human judgment." },
            { question_text: "Which task should remain fully human even with AI available?", scenario_context: "Your organization wants to maximize AI usage.", options: ["Writing status reports", "Building trust and relationships with stakeholders", "Categorizing backlog items", "Analyzing sprint metrics"], correct_answer_index: 1, explanation: "Trust and relationships require genuine human connection. AI can support but not replace interpersonal leadership." },
            { question_text: "What does 'AI augmentation' mean for a Scrum Master?", scenario_context: "You're explaining your AI-augmented approach.", options: ["AI runs the ceremonies while SM watches", "AI provides data, insights, and drafts while SM applies judgment and facilitates", "SM becomes unnecessary", "AI augmentation only works for developers"], correct_answer_index: 1, explanation: "Augmentation means AI handles data and drafts while the SM brings expertise, judgment, and facilitation skills." },
            { question_text: "How should a PM categorize the task of 'estimating project delivery dates'?", scenario_context: "Building your AI task classification.", options: ["Fully automate — AI is always right", "Augment — AI analyzes data and suggests dates, PM applies context and judgment", "Keep fully human — AI can't help with dates", "Skip estimation entirely"], correct_answer_index: 1, explanation: "AI can analyze historical data and suggest dates, but the PM must factor in context, risks, and stakeholder needs." },
            { question_text: "What is the competitive advantage of the AI-augmented PM?", scenario_context: "Explaining to your manager why AI skills matter.", options: ["They can work 24 hours a day", "They deliver in days what used to take weeks by leveraging AI for routine work", "They don't need a team", "They can replace developers"], correct_answer_index: 1, explanation: "The augmented PM's edge is speed and quality — AI handles the routine, freeing the PM for high-value leadership." }
          ]
        },
        {
          title: "1.7 Hands-On: Setting Up Your AI Workspace",
          description: "Set up accounts and configure ChatGPT, Claude, Microsoft Copilot, and key integrations. Build your ready-to-use AI toolkit.",
          order_index: 6, professorIndex: 0,
          lessonScript: { mainPoints: ["Create accounts on ChatGPT, Claude, and Microsoft Copilot.", "Configure browser extensions for quick AI access.", "Set up Notion AI for documentation workflows.", "Connect AI tools to your project management platform.", "Create your first prompt templates for common PM tasks."] },
          questions: [
            { question_text: "What should you set up FIRST when building your AI PM workspace?", scenario_context: "Starting from scratch with AI tools.", options: ["A complex automation pipeline", "Core AI assistants (ChatGPT, Claude) plus integration with your PM tool", "Every AI tool available on the market", "A custom AI model"], correct_answer_index: 1, explanation: "Start with 2-3 core AI assistants integrated with your existing PM workflow. Build complexity gradually." },
            { question_text: "Why should you set up multiple AI assistants rather than just one?", scenario_context: "Deciding how many AI tools to use.", options: ["To spend more money", "Different models have different strengths — Claude for analysis, ChatGPT for creativity, Copilot for Office integration", "One AI is always enough", "To confuse the team"], correct_answer_index: 1, explanation: "Each AI has strengths. Using multiple tools lets you pick the best one for each specific task." },
            { question_text: "What are prompt templates and why are they valuable for PMs?", scenario_context: "A colleague asks why you're saving prompts.", options: ["Templates are unnecessary overhead", "Pre-written prompts for common tasks that ensure consistent, high-quality AI outputs", "Templates are only for developers", "They replace the need to learn AI"], correct_answer_index: 1, explanation: "Prompt templates save time and ensure consistency. A good sprint planning prompt produces reliable results every time." },
            { question_text: "Which integration should a PM prioritize when connecting AI to their workflow?", scenario_context: "You can only set up one integration today.", options: ["Social media AI", "AI integration with your primary project management tool (Jira, Linear, Asana)", "AI image generation", "AI music generation"], correct_answer_index: 1, explanation: "Connecting AI to your PM tool creates the most immediate value — automated backlog management, reporting, and analysis." },
            { question_text: "What's the recommended approach to expanding your AI toolkit over time?", scenario_context: "You've mastered the basics and want to add more tools.", options: ["Add all tools at once", "Add one tool at a time, master it, measure impact, then add the next", "Never add more tools", "Let the team decide randomly"], correct_answer_index: 1, explanation: "Gradual adoption with measured impact prevents tool fatigue and ensures each addition provides real value." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "What is the 'AI-first mindset' and how does it apply to PM?", scenario_context: "You're training new PMs on AI adoption.", options: ["Replacing humans with AI", "Defaulting to AI for every task, then deciding where human judgment adds value", "Avoiding AI entirely", "Only using AI for coding"], correct_answer_index: 1, explanation: "AI-first means asking 'Can AI help?' as the default starting point for every task." },
        { question_text: "Which of the five evaluation criteria addresses the risk of data breaches?", scenario_context: "Evaluating AI tools for your enterprise.", options: ["Accuracy", "Security posture", "Cost-to-value", "Adoption friction"], correct_answer_index: 1, explanation: "Security posture evaluates compliance certifications, data handling, and breach risk." },
        { question_text: "A PM uses AI to generate a risk report but doesn't verify the data. What principle did they violate?", scenario_context: "The report contained inaccurate statistics.", options: ["Cost optimization", "Human verification of AI outputs (hallucination management)", "Tool integration", "Adoption friction"], correct_answer_index: 1, explanation: "AI outputs must always be verified by humans before being shared with stakeholders." },
        { question_text: "What makes RAG particularly valuable for PM tools?", scenario_context: "Comparing AI tools for your team.", options: ["It's cheaper", "It lets AI reference YOUR project data for specific, relevant answers", "It's faster", "It works offline"], correct_answer_index: 1, explanation: "RAG makes AI responses specific to your project rather than generic, by pulling from your documents." },
        { question_text: "How should you handle team resistance to AI adoption?", scenario_context: "Half your team is skeptical about AI tools.", options: ["Mandate usage and punish non-compliance", "Start with quick wins, designate champions, and create safety for experimentation", "Give up on AI adoption", "Replace resistant team members"], correct_answer_index: 1, explanation: "Build momentum with visible wins, peer support, and a safe environment for learning." }
      ]
    },
    // MODULE 2
    {
      title: "Module 2: AI for Sprint Planning & Backlog Management",
      description: "Use AI to write user stories, prioritize backlogs, estimate effort, and run sprint planning in half the time using ChatGPT, Copilot, Jira AI, and Linear AI.",
      order_index: 1,
      videos: [
        {
          title: "2.1 AI-Powered User Story Writing with ChatGPT and Copilot",
          description: "Learn prompt engineering to generate well-formed user stories with acceptance criteria, edge cases, and testable conditions.",
          order_index: 0, professorIndex: 1,
          lessonScript: { mainPoints: ["Great prompts produce great user stories — structure matters.", "Include persona, goal, benefit, and acceptance criteria in your prompt.", "Ask AI to generate edge cases and negative scenarios you might miss.", "Iterate on AI output — treat the first draft as a starting point.", "Build a prompt template library for different story types."] },
          questions: [
            { question_text: "What's the BEST prompt structure for generating user stories with AI?", scenario_context: "You're creating user stories for a new feature.", options: ["Just say 'write a user story'", "Provide persona, goal, benefit, acceptance criteria, and ask for edge cases", "Copy-paste the requirements doc", "Let AI decide the format"], correct_answer_index: 1, explanation: "Structured prompts with context produce high-quality stories. Include the persona, goal, acceptance criteria, and ask for edge cases." },
            { question_text: "How should you treat the first AI-generated user story draft?", scenario_context: "ChatGPT produced a user story for your sprint.", options: ["Use it exactly as-is", "Treat it as a starting point that needs human review and refinement", "Delete it and write from scratch", "Only use it if it's perfect"], correct_answer_index: 1, explanation: "AI drafts are starting points. Human review ensures business context, edge cases, and team knowledge are incorporated." },
            { question_text: "What unique advantage does AI bring to user story writing?", scenario_context: "Comparing AI-written vs manually-written stories.", options: ["AI stories are always better", "AI can generate edge cases and negative scenarios humans often overlook", "AI stories don't need acceptance criteria", "AI replaces the Product Owner"], correct_answer_index: 1, explanation: "AI excels at systematically identifying edge cases, error scenarios, and boundary conditions that humans often miss." },
            { question_text: "What should you include in your AI prompt to get testable acceptance criteria?", scenario_context: "Your QA team needs clear test conditions.", options: ["Nothing special — AI knows what QA needs", "Explicitly ask for given/when/then format with specific, measurable conditions", "Just say 'add tests'", "QA should write their own criteria"], correct_answer_index: 1, explanation: "Explicitly requesting given/when/then format produces testable criteria that QA can directly convert to test cases." },
            { question_text: "Why should you build a prompt template library for user stories?", scenario_context: "You write stories every sprint.", options: ["Templates are too rigid", "Consistent prompts produce consistent quality and save time across sprints", "Each story needs a unique prompt", "Templates only work for simple stories"], correct_answer_index: 1, explanation: "Templates ensure quality consistency and save time. You can customize per story while maintaining a solid foundation." }
          ]
        },
        {
          title: "2.2 Backlog Prioritization with AI: MoSCoW, WSJF, and Beyond",
          description: "Use AI to analyze backlog items against frameworks like MoSCoW, WSJF, and value-vs-effort matrices.",
          order_index: 1, professorIndex: 2,
          lessonScript: { mainPoints: ["Feed AI your backlog with business value and effort data for prioritization.", "AI can apply MoSCoW, WSJF, or custom frameworks consistently.", "Unlike humans, AI doesn't have recency bias or pet projects.", "Always review AI prioritization — it lacks organizational context.", "Use AI to generate the initial ranking, then adjust with stakeholder input."] },
          questions: [
            { question_text: "How can AI improve backlog prioritization over purely manual methods?", scenario_context: "Your backlog has 200+ items that need ranking.", options: ["AI is always right about priorities", "AI applies frameworks consistently without human biases like recency or favoritism", "AI should make all priority decisions", "AI can't help with prioritization"], correct_answer_index: 1, explanation: "AI applies prioritization frameworks consistently, avoiding the cognitive biases that affect human judgment." },
            { question_text: "What data should you provide AI for effective WSJF prioritization?", scenario_context: "Setting up AI-assisted backlog prioritization.", options: ["Just the story titles", "Business value, time criticality, risk reduction, and estimated effort for each item", "Only the sprint number", "The team's favorite features"], correct_answer_index: 1, explanation: "WSJF needs business value, time criticality, risk reduction, and effort data to calculate meaningful priority scores." },
            { question_text: "Why should PMs review AI-generated priority rankings?", scenario_context: "AI ranked your backlog items.", options: ["AI rankings are always perfect", "AI lacks organizational context, politics, and strategic nuances that affect real priorities", "Reviewing wastes time", "AI accounts for all factors"], correct_answer_index: 1, explanation: "AI lacks awareness of organizational politics, strategic pivots, and stakeholder relationships that influence real prioritization." },
            { question_text: "What advantage does AI have over a manual value-vs-effort matrix?", scenario_context: "Comparing prioritization approaches.", options: ["AI matrices are prettier", "AI can process hundreds of items consistently and identify patterns humans miss", "Manual matrices are always better", "No advantage"], correct_answer_index: 1, explanation: "AI scales to hundreds of items while maintaining consistency and identifying value patterns across the backlog." },
            { question_text: "How should you handle a situation where AI prioritization conflicts with a key stakeholder's preference?", scenario_context: "AI ranked Feature A low, but the VP wants it done first.", options: ["Always follow AI", "Use AI ranking as objective data in the conversation, but respect organizational dynamics", "Always follow the stakeholder", "Ignore both"], correct_answer_index: 1, explanation: "AI provides objective data that informs the conversation, but the PM must balance data with organizational realities." }
          ]
        },
        {
          title: "2.3 AI-Assisted Effort Estimation and Story Pointing",
          description: "AI analyzes historical sprint data to suggest story points and flag likely under-estimates.",
          order_index: 2, professorIndex: 0,
          lessonScript: { mainPoints: ["Feed AI your historical velocity and story completion data.", "AI can compare new stories against similar completed stories for estimates.", "AI flags stories that look under-estimated based on complexity patterns.", "Use AI estimates as input to Planning Poker, not replacements for it.", "Track AI estimation accuracy over time to calibrate."] },
          questions: [
            { question_text: "How should AI estimates be used in Planning Poker?", scenario_context: "Your team does Planning Poker for estimation.", options: ["Replace Planning Poker with AI estimates", "Use AI estimates as an additional data point alongside team discussion", "AI estimates are irrelevant to Planning Poker", "Only use AI if team disagrees"], correct_answer_index: 1, explanation: "AI estimates provide a data-driven starting point, but team discussion in Planning Poker adds context and shared understanding." },
            { question_text: "What historical data makes AI estimation most accurate?", scenario_context: "Setting up AI-assisted estimation.", options: ["Team member names", "Past stories with their initial estimates, actual effort, and complexity attributes", "Sprint dates only", "Stakeholder feedback"], correct_answer_index: 1, explanation: "Historical stories with estimate-vs-actual comparisons let AI learn your team's estimation patterns." },
            { question_text: "AI flags a story as likely under-estimated. What should you do?", scenario_context: "AI says a 3-point story should be 8 points.", options: ["Ignore AI — the team knows best", "Investigate why AI flagged it — check for hidden complexity the team may have missed", "Automatically change to 8 points", "Remove the story from the sprint"], correct_answer_index: 1, explanation: "AI flags deserve investigation. The team may have overlooked dependencies or complexity that AI detected from patterns." },
            { question_text: "What's the main limitation of AI-assisted estimation?", scenario_context: "Deciding how much to rely on AI estimates.", options: ["AI estimates are always wrong", "AI can't account for novel work, team changes, or technical debt the team hasn't documented", "AI estimates are always right", "AI can only estimate in hours"], correct_answer_index: 1, explanation: "AI works from historical patterns. Novel technology, team changes, or undocumented tech debt can throw off estimates." },
            { question_text: "How should you calibrate AI estimation over sprints?", scenario_context: "Your AI estimator has been running for 3 sprints.", options: ["No calibration needed", "Compare AI predictions against actuals each sprint and feed corrections back", "Recalibrate daily", "Never change the model"], correct_answer_index: 1, explanation: "Regular comparison of predictions vs actuals improves the model. Feed back corrections to improve accuracy over time." }
          ]
        },
        {
          title: "2.4 Jira AI and Linear AI: Hands-On Backlog Automation",
          description: "Master built-in AI in Jira and Linear: auto-categorization, smart suggestions, duplicate detection, and AI-generated sub-tasks.",
          order_index: 3, professorIndex: 1,
          lessonScript: { mainPoints: ["Jira AI can auto-categorize issues, detect duplicates, and suggest priorities.", "Linear AI generates sub-tasks and identifies related issues automatically.", "Enable AI suggestions in your PM tool before configuring custom rules.", "AI duplicate detection saves hours of manual backlog grooming.", "Combine platform AI with external tools for maximum automation."] },
          questions: [
            { question_text: "What is Jira AI's MOST time-saving feature for backlog management?", scenario_context: "Setting up Jira AI for your team.", options: ["Changing ticket colors", "Auto-categorization and duplicate detection across the entire backlog", "Sending email notifications", "Creating Gantt charts"], correct_answer_index: 1, explanation: "Auto-categorization and duplicate detection automate hours of manual grooming work." },
            { question_text: "How does Linear AI help during refinement sessions?", scenario_context: "Preparing for your weekly refinement.", options: ["It replaces the Product Owner", "It generates sub-tasks, identifies related issues, and suggests missing details", "It only helps developers", "It runs the meeting automatically"], correct_answer_index: 1, explanation: "Linear AI pre-analyzes stories to generate sub-tasks and flag gaps before refinement." },
            { question_text: "What should you do BEFORE enabling AI features in your PM tool?", scenario_context: "Your team just upgraded to Jira Premium with AI.", options: ["Enable everything immediately", "Review data privacy settings and ensure AI features comply with your org's policies", "Disable all existing features", "Wait 6 months"], correct_answer_index: 1, explanation: "Check privacy settings and compliance before enabling AI features that process your project data." },
            { question_text: "How can platform AI (Jira/Linear) be combined with external AI (ChatGPT)?", scenario_context: "Maximizing AI impact on backlog management.", options: ["Never combine tools", "Use platform AI for categorization and detection, external AI for story writing and analysis", "Only use one tool at a time", "External AI replaces platform AI"], correct_answer_index: 1, explanation: "Platform AI handles structured data operations; external AI handles creative and analytical tasks. Together they cover more ground." },
            { question_text: "AI detected 15 duplicate issues in your backlog. What's the best next step?", scenario_context: "Jira AI flagged potential duplicates.", options: ["Auto-delete all duplicates", "Review each flagged pair — merge genuine duplicates, keep false positives", "Ignore the suggestions", "Delete the older issues automatically"], correct_answer_index: 1, explanation: "AI duplicate detection is a suggestion, not a decision. Review each pair to confirm before merging." }
          ]
        },
        {
          title: "2.5 AI for Sprint Planning Meetings: From Prep to Commitment",
          description: "Automate sprint planning prep: capacity analysis, carryover assessment, dependency mapping, and sprint goal drafting.",
          order_index: 4, professorIndex: 2,
          lessonScript: { mainPoints: ["AI can prepare the sprint planning meeting in 10 minutes instead of 2 hours.", "Feed AI your team's capacity, velocity history, and carryover items.", "AI generates a draft sprint goal based on backlog priorities and business objectives.", "Use AI to map dependencies between sprint items before the meeting.", "The meeting shifts from 'what should we do' to 'validating AI recommendations.'"] },
          questions: [
            { question_text: "How does AI change the sprint planning meeting dynamic?", scenario_context: "You're restructuring sprint planning with AI support.", options: ["AI runs the meeting", "The meeting shifts from building a plan to reviewing and refining AI's draft plan", "Sprint planning is no longer needed", "Nothing changes"], correct_answer_index: 1, explanation: "AI does the heavy lifting of analysis and drafting, so the team focuses on reviewing, adjusting, and committing." },
            { question_text: "What data should you feed AI for sprint planning preparation?", scenario_context: "Preparing AI-assisted sprint planning.", options: ["Only the backlog", "Team capacity, velocity history, carryover items, and top-priority backlog items", "Just the sprint number", "Previous retrospective notes only"], correct_answer_index: 1, explanation: "AI needs capacity, velocity, carryover, and priorities to generate a realistic sprint plan draft." },
            { question_text: "AI suggests a sprint goal. How should the team respond?", scenario_context: "AI drafted: 'Complete checkout flow and reduce login errors by 50%.'", options: ["Accept it as-is", "Review it, discuss alignment with business objectives, and refine as needed", "Reject it — only POs write sprint goals", "Write a completely different goal"], correct_answer_index: 1, explanation: "AI sprint goals are starting points for discussion. The team refines based on business context and commitment." },
            { question_text: "AI identified 3 cross-team dependencies in your proposed sprint. What's the BEST action?", scenario_context: "Dependencies could block sprint items.", options: ["Ignore dependencies", "Address them before or during sprint planning — reach out to dependent teams", "Remove all dependent items", "Let them become blockers during the sprint"], correct_answer_index: 1, explanation: "Proactively addressing dependencies before the sprint prevents mid-sprint blockers." },
            { question_text: "How much time should AI-assisted sprint planning save compared to traditional?", scenario_context: "Measuring AI impact on ceremonies.", options: ["No time saved", "Prep time drops from hours to minutes; meeting time reduces by 30-50%", "The meeting takes longer with AI", "Exactly 7 minutes"], correct_answer_index: 1, explanation: "AI handles analysis and drafting, reducing prep from hours to minutes and meeting time by 30-50%." }
          ]
        },
        {
          title: "2.6 Refinement Sessions Supercharged by AI",
          description: "AI pre-analyzes stories, generates clarifying questions, identifies missing acceptance criteria, and suggests technical considerations.",
          order_index: 5, professorIndex: 0,
          lessonScript: { mainPoints: ["Have AI review each story BEFORE refinement to identify gaps.", "AI generates clarifying questions that improve the discussion.", "AI suggests acceptance criteria the team might miss.", "Technical considerations from AI help developers prepare.", "Refinement becomes about deep discussion, not identifying basics."] },
          questions: [
            { question_text: "When should AI analyze stories for refinement preparation?", scenario_context: "Planning your refinement workflow.", options: ["During the meeting", "Before the meeting — so AI findings are ready for discussion", "After the meeting", "Never — refinement is human-only"], correct_answer_index: 1, explanation: "Pre-meeting analysis means the team walks in with AI-identified gaps, making the discussion more productive." },
            { question_text: "AI found 5 missing acceptance criteria on a story. What should the team do?", scenario_context: "Reviewing AI suggestions before refinement.", options: ["Add all 5 automatically", "Review each suggestion — add valid ones, discuss questionable ones during refinement", "Ignore AI suggestions", "Remove the story"], correct_answer_index: 1, explanation: "AI suggestions are starting points. Some may be spot-on, others may not apply to your specific context." },
            { question_text: "How does AI improve the QUALITY of refinement discussions?", scenario_context: "Your refinement sessions feel shallow.", options: ["AI talks during the meeting", "AI handles basic gap-finding so humans can focus on deep design and risk discussions", "AI replaces the discussion", "Quality doesn't change"], correct_answer_index: 1, explanation: "When AI identifies basic gaps beforehand, the team spends time on deeper discussions about design, risk, and approach." },
            { question_text: "What AI-generated artifact is MOST valuable for developers before refinement?", scenario_context: "Developers want to come to refinement prepared.", options: ["A joke to break the ice", "Technical considerations and potential implementation approaches for each story", "Sprint burndown predictions", "Meeting agenda"], correct_answer_index: 1, explanation: "AI-generated technical considerations help developers think through implementation before the meeting." },
            { question_text: "How should a SM introduce AI pre-analysis to an existing refinement process?", scenario_context: "Your team has been doing refinement the same way for a year.", options: ["Replace the entire process overnight", "Add AI analysis as a supplement first — share findings at the start of refinement", "Don't mention AI", "Cancel refinement sessions"], correct_answer_index: 1, explanation: "Start by supplementing the existing process. Show AI findings at the start of meetings and let value speak for itself." }
          ]
        },
        {
          title: "2.7 Lab: Build an AI Backlog Management Pipeline",
          description: "Combine everything into an end-to-end pipeline: AI writes stories, prioritizes, estimates, and prepares sprint plans.",
          order_index: 6, professorIndex: 1,
          lessonScript: { mainPoints: ["Connect your AI tools into a workflow: story creation → prioritization → estimation → planning.", "Use ChatGPT for story writing, platform AI for categorization, and AI for estimation.", "Automate the handoffs between steps where possible.", "Test the pipeline with a real backlog sample.", "Measure time saved compared to your manual process."] },
          questions: [
            { question_text: "What is the correct ORDER for an AI backlog management pipeline?", scenario_context: "Building your end-to-end pipeline.", options: ["Estimate → Write → Plan → Prioritize", "Write stories → Prioritize → Estimate → Plan sprint", "Plan → Write → Estimate → Prioritize", "The order doesn't matter"], correct_answer_index: 1, explanation: "The logical flow is: create stories, prioritize them, estimate effort, then plan the sprint." },
            { question_text: "What's the BIGGEST risk of a fully automated backlog pipeline?", scenario_context: "Your pipeline runs without human intervention.", options: ["It's too fast", "Losing human judgment and context that AI can't provide", "It costs too much", "No risk — automation is always good"], correct_answer_index: 1, explanation: "Full automation without human checkpoints risks losing context, stakeholder input, and business judgment." },
            { question_text: "How should you measure the success of your AI backlog pipeline?", scenario_context: "Reporting pipeline impact to leadership.", options: ["Number of AI-generated stories", "Time saved per sprint, story quality scores, and estimation accuracy improvement", "Number of tools connected", "How impressed stakeholders are"], correct_answer_index: 1, explanation: "Measure outcomes: time saved, quality improvement, and estimation accuracy — not activity metrics." },
            { question_text: "Where should you add human checkpoints in the AI pipeline?", scenario_context: "Designing quality gates.", options: ["No checkpoints needed", "After story generation (PO review) and after prioritization (stakeholder alignment)", "Only at the very end", "Before every single AI action"], correct_answer_index: 1, explanation: "Key checkpoints: PO reviews AI-generated stories, and stakeholders validate AI-suggested priorities." },
            { question_text: "You built the pipeline but the team isn't using it. What's the most likely cause?", scenario_context: "Pipeline adoption is low after 2 sprints.", options: ["The pipeline is too fast", "Too much adoption friction — the workflow is too complex or disrupts existing habits", "AI pipelines never work", "The team is lazy"], correct_answer_index: 1, explanation: "Adoption friction kills pipelines. Simplify the workflow, reduce steps, and integrate into existing habits." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "What's the FIRST step in creating AI-powered user stories?", scenario_context: "Starting with AI for story writing.", options: ["Ask AI to 'write stories'", "Provide structured prompts with persona, goal, acceptance criteria, and edge cases", "Let AI read the codebase", "Copy competitor stories"], correct_answer_index: 1, explanation: "Structured prompts produce structured, high-quality stories." },
        { question_text: "How does AI improve effort estimation accuracy over time?", scenario_context: "Your AI estimator has been running for 5 sprints.", options: ["It doesn't improve", "It learns from estimate-vs-actual comparisons to calibrate predictions", "It gets worse over time", "It stays exactly the same"], correct_answer_index: 1, explanation: "AI estimation improves with feedback — comparing predictions to actuals calibrates the model." },
        { question_text: "What's Jira AI's most impactful feature for large backlogs?", scenario_context: "Your backlog has 500+ items.", options: ["Color coding", "Duplicate detection and auto-categorization", "Email integration", "Time tracking"], correct_answer_index: 1, explanation: "At scale, duplicate detection and categorization save enormous manual grooming effort." },
        { question_text: "AI-assisted sprint planning shifts the meeting focus to what?", scenario_context: "Redesigning your sprint planning.", options: ["Reading the backlog aloud", "Reviewing, refining, and committing to AI's draft plan", "Explaining Scrum theory", "Assigning tasks to individuals"], correct_answer_index: 1, explanation: "AI handles analysis and drafting; the team focuses on review, refinement, and commitment." },
        { question_text: "What human judgment should ALWAYS complement AI backlog prioritization?", scenario_context: "AI ranked your backlog.", options: ["None — AI is objective", "Organizational context, stakeholder relationships, and strategic alignment", "Color preferences", "Alphabetical ordering"], correct_answer_index: 1, explanation: "AI provides data-driven rankings, but humans add organizational awareness and strategic context." }
      ]
    },
    // MODULE 3
    {
      title: "Module 3: AI for Communication & Documentation",
      description: "Transform meeting notes, stakeholder reports, sprint reviews, and retrospectives using Otter.ai, Notion AI, Fireflies, and Gamma.",
      order_index: 2,
      videos: [
        {
          title: "3.1 Automated Meeting Summaries with Otter.ai and Fireflies",
          description: "Configure AI meeting assistants to transcribe, extract action items, and generate structured summaries.",
          order_index: 0, professorIndex: 2,
          lessonScript: { mainPoints: ["AI meeting assistants join calls, transcribe, and extract action items automatically.", "Configure summary format: decisions, action items, key discussion points.", "Review AI summaries for accuracy before distributing.", "Otter.ai excels at live transcription; Fireflies at post-meeting analysis.", "Set up automatic distribution to Slack/email after each meeting."] },
          questions: [
            { question_text: "What's the PRIMARY benefit of AI meeting assistants for PMs?", scenario_context: "Evaluating whether to adopt Otter.ai.", options: ["Better audio quality", "Automated transcription, action item extraction, and summary generation — saving hours of manual notes", "Recording meetings for surveillance", "Replacing meeting attendees"], correct_answer_index: 1, explanation: "AI meeting tools save PMs 2-4 hours per week by automating the entire note-taking and summary workflow." },
            { question_text: "Before distributing an AI-generated meeting summary, what should you do?", scenario_context: "AI just generated your standup summary.", options: ["Send immediately", "Review for accuracy — AI may miss context or misattribute statements", "Delete it and write manually", "Only send to the team lead"], correct_answer_index: 1, explanation: "AI summaries can miss nuance or misattribute. A quick review ensures accuracy before distribution." },
            { question_text: "How should you configure AI meeting summaries for maximum value?", scenario_context: "Setting up Fireflies for your team.", options: ["Full transcript only", "Structured format: decisions made, action items with owners, key discussion points", "Just attendee names", "Audio recording only"], correct_answer_index: 1, explanation: "Structured summaries with decisions, action items, and key points are immediately actionable." },
            { question_text: "When is Otter.ai preferred over Fireflies?", scenario_context: "Choosing between the two tools.", options: ["Otter.ai is always better", "Otter.ai excels at live transcription during meetings; Fireflies at deeper post-meeting analysis", "Fireflies is always better", "They're identical"], correct_answer_index: 1, explanation: "Each tool has strengths: Otter for real-time transcription, Fireflies for post-meeting intelligence and analytics." },
            { question_text: "What should you do if a meeting contains confidential M&A discussions?", scenario_context: "Your AI bot is configured to join all meetings.", options: ["Let AI record everything", "Disable AI recording for sensitive meetings or use an on-premise solution", "Confidentiality doesn't matter", "Record but don't share summaries"], correct_answer_index: 1, explanation: "Sensitive meetings should exclude AI recording or use tools with enterprise data guarantees." }
          ]
        },
        {
          title: "3.2 Stakeholder Reports and Status Updates with AI",
          description: "Generate professional stakeholder reports in minutes from sprint data, blockers, and metrics.",
          order_index: 1, professorIndex: 0,
          lessonScript: { mainPoints: ["Feed AI your sprint data and it generates executive-ready reports.", "Tailor report tone: executive summary vs. technical deep-dive.", "AI can generate different report versions for different audiences.", "Include metrics, accomplishments, risks, and next steps.", "Build a report template prompt that you reuse every sprint."] },
          questions: [
            { question_text: "What data should you feed AI to generate a stakeholder report?", scenario_context: "End of sprint, report due tomorrow.", options: ["Just the sprint number", "Sprint metrics, completed items, blockers, risks, and upcoming goals", "Team member names", "Meeting recordings only"], correct_answer_index: 1, explanation: "Comprehensive data produces comprehensive reports. Include metrics, accomplishments, blockers, risks, and plans." },
            { question_text: "How should reports differ between executive and technical stakeholders?", scenario_context: "You have reports due to the VP and the tech lead.", options: ["Same report for everyone", "Executive: business impact and metrics; Technical: implementation details and risks", "Technical stakeholders don't need reports", "Executive reports should be longer"], correct_answer_index: 1, explanation: "AI can generate audience-specific versions: executives want outcomes and metrics; technical leaders want implementation details." },
            { question_text: "What's the time savings of AI-generated stakeholder reports?", scenario_context: "Measuring AI impact on your workflow.", options: ["No time saved", "Reports that took 2-3 hours now take 15-20 minutes with AI + review", "Takes longer with AI", "Exactly 5 minutes saved"], correct_answer_index: 1, explanation: "AI drafts reports in minutes. With 15-20 minutes of review and customization, you save 80% of report-writing time." },
            { question_text: "Why should you build a reusable report prompt template?", scenario_context: "You write stakeholder reports every sprint.", options: ["Templates are inflexible", "Consistency across sprints and massive time savings from reuse", "Each report should be completely unique", "Templates are only for juniors"], correct_answer_index: 1, explanation: "A template prompt ensures consistent quality and format while saving time on the repetitive structure." },
            { question_text: "AI generated a report claiming '95% sprint completion rate' but actual rate was 82%. What went wrong?", scenario_context: "Catching an error before sending the report.", options: ["AI reports are always accurate", "AI hallucinated a metric — this is why human verification is required before distribution", "82% rounds up to 95%", "The report format was wrong"], correct_answer_index: 1, explanation: "Classic AI hallucination. Always verify metrics in AI-generated reports against actual data before sharing." }
          ]
        },
        {
          title: "3.3 Sprint Review and Demo Preparation with AI",
          description: "AI drafts sprint review agendas, demo scripts, release notes, and talking points.",
          order_index: 2, professorIndex: 1,
          lessonScript: { mainPoints: ["AI generates sprint review agendas from completed story data.", "Demo scripts with talking points ensure smooth presentations.", "Release notes can be auto-generated from merged PRs and completed stories.", "AI suggests stakeholder-relevant highlights from the sprint.", "Prep time drops from hours to minutes."] },
          questions: [
            { question_text: "What can AI generate for sprint review preparation?", scenario_context: "Sprint review is tomorrow.", options: ["Only the invite", "Agenda, demo script, release notes, and stakeholder-relevant highlights", "Just a slideshow", "Nothing useful for reviews"], correct_answer_index: 1, explanation: "AI can draft the complete review package: agenda, demo script, release notes, and talking points." },
            { question_text: "How should AI-generated demo scripts be used?", scenario_context: "AI created a script for your demo.", options: ["Read it word-for-word", "Use as a structure guide and talking points, but present naturally", "Memorize it completely", "Give it to a bot to present"], correct_answer_index: 1, explanation: "Demo scripts work best as guides. Use the structure and key points but present with your own expertise and energy." },
            { question_text: "What data produces the BEST AI-generated release notes?", scenario_context: "Generating release notes for stakeholders.", options: ["Sprint number only", "Completed stories, merged PRs, bug fixes, and user-facing changes", "Team meeting notes", "Jira URL"], correct_answer_index: 1, explanation: "Comprehensive input (stories, PRs, fixes, changes) produces release notes that cover everything stakeholders need." },
            { question_text: "AI suggests highlighting a minor bug fix in the sprint review. Should you?", scenario_context: "AI listed it as a key accomplishment.", options: ["Always follow AI suggestions", "Evaluate audience relevance — executives care about business impact, not minor fixes", "Yes — all fixes are important", "Never mention bug fixes"], correct_answer_index: 1, explanation: "AI suggests based on data, but the PM curates for audience. Executive reviews focus on business-impactful items." },
            { question_text: "How much prep time does AI typically save for sprint reviews?", scenario_context: "Measuring AI impact.", options: ["No savings", "Preparation drops from 2-3 hours to 20-30 minutes", "Takes longer", "Saves exactly 10 minutes"], correct_answer_index: 1, explanation: "AI handles the heavy lifting of content generation. Human review and customization takes a fraction of the original time." }
          ]
        },
        {
          title: "3.4 AI-Driven Retrospectives: Deeper Insights, Better Actions",
          description: "AI analyzes retro feedback, identifies recurring themes, suggests experiments, and tracks improvement trends.",
          order_index: 3, professorIndex: 2,
          lessonScript: { mainPoints: ["AI identifies patterns across multiple retrospectives that humans miss.", "Feed anonymous retro data to AI for theme analysis and sentiment detection.", "AI suggests specific, actionable experiments based on identified issues.", "Track improvement trends over sprints with AI-powered analytics.", "AI helps prevent the same issues from recurring sprint after sprint."] },
          questions: [
            { question_text: "What unique insight can AI provide in retrospectives?", scenario_context: "Your retros feel repetitive.", options: ["Better snack suggestions", "Cross-sprint pattern analysis revealing recurring themes humans miss", "Faster meeting ending", "Better voting on retro items"], correct_answer_index: 1, explanation: "AI analyzes data across multiple retros to surface patterns: recurring issues, improving trends, and chronic problems." },
            { question_text: "How should retro data be provided to AI for analysis?", scenario_context: "Setting up AI-driven retros.", options: ["Real-time voice recording with names", "Anonymized, aggregated feedback to protect psychological safety", "Only positive feedback", "Manager summaries only"], correct_answer_index: 1, explanation: "Anonymous data protects psychological safety while letting AI identify themes and patterns." },
            { question_text: "AI identified 'unclear requirements' as a recurring theme across 5 sprints. What should the SM do?", scenario_context: "AI pattern analysis reveals a chronic issue.", options: ["Mention it once and move on", "Treat it as a systemic issue requiring a focused improvement experiment", "Blame the Product Owner", "Ignore patterns — each sprint is unique"], correct_answer_index: 1, explanation: "Recurring themes across sprints indicate systemic issues that need dedicated experiments, not just discussion." },
            { question_text: "How does AI help generate better retro action items?", scenario_context: "Your retro action items are too vague.", options: ["AI makes them longer", "AI suggests specific, measurable experiments based on the identified issues", "AI removes action items", "AI assigns blame"], correct_answer_index: 1, explanation: "AI turns vague concerns into specific, measurable experiments: 'Try X for Y sprints and measure Z.'" },
            { question_text: "Should AI replace the Scrum Master's facilitation in retros?", scenario_context: "Defining AI's role in retros.", options: ["Yes — AI is better at facilitation", "No — AI provides data and insights while the SM facilitates human discussion", "AI should run half the retro", "Retros don't need facilitation"], correct_answer_index: 1, explanation: "AI enhances retros with data. The SM brings empathy, facilitation skill, and psychological safety that AI can't provide." }
          ]
        },
        {
          title: "3.5 Notion AI and Gamma for PM Documentation",
          description: "Create living documentation with Notion AI and auto-generate presentations with Gamma.",
          order_index: 4, professorIndex: 0,
          lessonScript: { mainPoints: ["Notion AI creates project wikis, onboarding guides, and process docs.", "Use Notion AI to summarize long documents and extract key decisions.", "Gamma converts written content into polished presentations automatically.", "Living docs stay updated with AI-assisted maintenance.", "Build documentation templates that AI fills in each sprint."] },
          questions: [
            { question_text: "What makes Notion AI particularly valuable for PM documentation?", scenario_context: "Choosing a documentation tool.", options: ["Nice colors", "AI that drafts, summarizes, and maintains living documents within your existing workspace", "Offline mode", "Free pricing"], correct_answer_index: 1, explanation: "Notion AI creates and maintains docs in your workspace — no context-switching between tools." },
            { question_text: "How does Gamma help PMs with communication?", scenario_context: "You need a presentation for tomorrow's review.", options: ["Gamma is a video editor", "Gamma auto-generates polished presentations from written content", "Gamma is a code editor", "Gamma is a chat tool"], correct_answer_index: 1, explanation: "Gamma converts your written content (sprint data, report text) into visual presentations automatically." },
            { question_text: "What is a 'living document' and how does AI help maintain it?", scenario_context: "Your project wiki is always outdated.", options: ["A document that moves", "A doc that stays current — AI helps update it regularly based on new decisions and changes", "A document with animations", "Living docs don't exist"], correct_answer_index: 1, explanation: "Living docs are continuously updated. AI can flag outdated sections and suggest updates based on recent activity." },
            { question_text: "What Notion AI feature saves the most time for PMs?", scenario_context: "You use Notion for project management.", options: ["Emoji suggestions", "Summarizing long documents and extracting action items", "Background images", "Font selection"], correct_answer_index: 1, explanation: "Summarization and extraction turn long meeting notes and documents into actionable insights instantly." },
            { question_text: "How should you combine Notion AI and Gamma in your workflow?", scenario_context: "Building a documentation-to-presentation pipeline.", options: ["Use them separately", "Write in Notion AI, then use Gamma to turn key content into stakeholder presentations", "They can't be combined", "Use Gamma for everything"], correct_answer_index: 1, explanation: "Notion for creating/maintaining content, Gamma for transforming that content into visual presentations." }
          ]
        },
        {
          title: "3.6 Lab: Automate Your Entire Communication Workflow",
          description: "Build an end-to-end pipeline: AI records meetings, extracts actions, updates backlog, drafts reports, and prepares retro analysis.",
          order_index: 5, professorIndex: 1,
          lessonScript: { mainPoints: ["Connect meeting AI to your project management tool for automatic action item creation.", "Set up automated report generation triggered by sprint end dates.", "Create a retro analysis pipeline that feeds into the next sprint.", "Test the full pipeline end-to-end with a real sprint cycle.", "Measure total communication time saved across the team."] },
          questions: [
            { question_text: "What's the correct flow for an automated communication pipeline?", scenario_context: "Building your end-to-end workflow.", options: ["Reports → Meetings → Actions", "Record meeting → Extract actions → Update backlog → Draft report → Analyze retro", "Retro → Meeting → Report", "Order doesn't matter"], correct_answer_index: 1, explanation: "The pipeline flows from meeting capture through action extraction, backlog updates, reporting, and retrospective analysis." },
            { question_text: "What's the biggest risk of over-automating communications?", scenario_context: "Your pipeline handles everything automatically.", options: ["It's too efficient", "Losing the human touch and nuance in stakeholder communications", "Automation is always good", "Tools become too expensive"], correct_answer_index: 1, explanation: "Stakeholder communications need human nuance. Over-automation can feel impersonal and miss important context." },
            { question_text: "How should you measure the success of communication automation?", scenario_context: "Reporting on your automation initiative.", options: ["Number of automated messages", "Hours saved per sprint, communication quality scores, and stakeholder satisfaction", "Number of tools used", "Email open rates"], correct_answer_index: 1, explanation: "Measure time savings, quality, and satisfaction — not just volume of automated outputs." },
            { question_text: "Where is the MOST critical human checkpoint in the communication pipeline?", scenario_context: "Designing quality gates.", options: ["Nowhere needed", "Before any AI-generated content goes to external stakeholders", "Only at the beginning", "Only at the end"], correct_answer_index: 1, explanation: "External stakeholder communications must be human-reviewed for accuracy, tone, and political sensitivity." },
            { question_text: "Your communication pipeline saves 8 hours per sprint. What should you do with that time?", scenario_context: "Measuring the real impact of automation.", options: ["Nothing", "Reinvest in high-value activities: coaching, stakeholder relationships, and strategic planning", "Work 8 fewer hours", "Build more automations"], correct_answer_index: 1, explanation: "The real value of automation is freeing time for leadership, coaching, and strategic work that AI can't do." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "What's the most time-saving AI communication tool for PMs?", scenario_context: "Prioritizing which tool to adopt first.", options: ["AI image generation", "AI meeting assistants that auto-transcribe and generate summaries", "AI email sorting", "AI calendar management"], correct_answer_index: 1, explanation: "Meeting tools save the most time — PMs spend 30-50% of their time in meetings." },
        { question_text: "How should AI stakeholder reports be tailored for different audiences?", scenario_context: "Report due to both VP and tech lead.", options: ["Same report for all", "Executives get business impact; technical leaders get implementation details", "Only send to executives", "Let AI decide the audience"], correct_answer_index: 1, explanation: "AI can generate audience-specific versions optimized for each stakeholder's needs." },
        { question_text: "What makes AI retrospective analysis superior to manual analysis?", scenario_context: "Improving your retro process.", options: ["AI is always right", "AI identifies cross-sprint patterns and trends that humans miss", "AI facilitates better", "Manual is always better"], correct_answer_index: 1, explanation: "AI's ability to analyze across many sprints reveals systemic patterns invisible in single-session analysis." },
        { question_text: "What's the critical human checkpoint in AI communication workflows?", scenario_context: "Designing your automation pipeline.", options: ["No checkpoints needed", "Review before external stakeholder distribution", "Only check formatting", "Check grammar only"], correct_answer_index: 1, explanation: "AI-generated content must be verified for accuracy and appropriateness before reaching external stakeholders." },
        { question_text: "How does Gamma complement Notion AI in a PM's workflow?", scenario_context: "Building your documentation pipeline.", options: ["They do the same thing", "Notion AI creates/maintains content; Gamma transforms it into presentations", "Gamma replaces Notion", "They can't be used together"], correct_answer_index: 1, explanation: "Notion AI is for creating and maintaining docs; Gamma converts that content into visual presentations." }
      ]
    },
    // MODULE 4
    {
      title: "Module 4: AI for Development & Delivery Acceleration",
      description: "Understand how AI accelerates CI/CD, code review, testing, and deployment so you can remove impediments faster. Covers GitHub Copilot, Cursor, Vercel AI, and Datadog.",
      order_index: 3,
      videos: [
        {
          title: "4.1 GitHub Copilot and Cursor: What PMs Need to Know",
          description: "How AI coding assistants work, productivity gains to expect, and how to factor them into capacity planning.",
          order_index: 0, professorIndex: 2,
          lessonScript: { mainPoints: ["GitHub Copilot and Cursor help developers write code 30-50% faster.", "PMs should factor AI-assisted productivity into capacity planning.", "AI coding tools don't replace developers — they remove boilerplate work.", "Track adoption metrics: PR cycle time, code output, bug rates.", "Understanding these tools helps you remove impediments faster."] },
          questions: [
            { question_text: "How should a PM factor GitHub Copilot into capacity planning?", scenario_context: "Your team just adopted Copilot.", options: ["Assume 100% productivity increase", "Expect 20-40% faster coding after a ramp-up period, and adjust estimates gradually", "No impact on capacity", "Double the sprint scope immediately"], correct_answer_index: 1, explanation: "AI coding tools typically yield 20-40% improvements after ramp-up. Adjust gradually based on actual data." },
            { question_text: "What metric best shows Copilot's impact on your team?", scenario_context: "Measuring AI coding tool ROI.", options: ["Lines of code generated", "PR cycle time reduction and developer satisfaction scores", "Number of Copilot suggestions accepted", "Cost per developer"], correct_answer_index: 1, explanation: "PR cycle time and developer satisfaction show real delivery impact, not just output volume." },
            { question_text: "A developer says Copilot is slowing them down. What should you investigate?", scenario_context: "Unexpected adoption resistance.", options: ["Force them to use it", "Check if they need configuration help, training, or if the tool isn't suited to their work type", "Remove Copilot from their machine", "Replace the developer"], correct_answer_index: 1, explanation: "Resistance often signals configuration issues or mismatched expectations. Investigate and support, don't mandate." },
            { question_text: "What's the difference between Copilot and Cursor for a PM's perspective?", scenario_context: "Evaluating AI coding tools.", options: ["They're identical", "Copilot integrates with GitHub/VS Code; Cursor is an AI-native editor with deeper context awareness", "Cursor is for managers", "Copilot is free, Cursor isn't"], correct_answer_index: 1, explanation: "Different integration approaches: Copilot extends existing editors, Cursor is built from scratch around AI capabilities." },
            { question_text: "Should a PM learn to use Copilot themselves?", scenario_context: "Considering hands-on AI tool experience.", options: ["No — it's only for developers", "Yes — understanding the tool helps you set realistic expectations and remove impediments", "Only if they code daily", "PMs should never touch code tools"], correct_answer_index: 1, explanation: "Hands-on experience with developer tools helps PMs understand capabilities, set expectations, and support the team." }
          ]
        },
        {
          title: "4.2 AI-Powered Code Review and Pull Request Management",
          description: "AI tools review code for bugs, security issues, and style. Track adoption, reduce PR cycle time, and manage quality.",
          order_index: 1, professorIndex: 0,
          lessonScript: { mainPoints: ["AI code review catches bugs and security issues before human reviewers.", "Reduces PR cycle time by providing instant first-pass feedback.", "AI doesn't replace human review — it handles the mechanical checks.", "Track metrics: time-to-first-review, bugs caught by AI vs humans.", "Help your team adopt AI review as a quality accelerator, not a threat."] },
          questions: [
            { question_text: "How does AI code review improve the development workflow?", scenario_context: "Your team's PRs sit unreviewed for days.", options: ["AI replaces human reviewers", "AI provides instant first-pass review, catching mechanical issues so humans focus on design and logic", "AI makes code review unnecessary", "AI only checks formatting"], correct_answer_index: 1, explanation: "AI handles mechanical checks instantly, letting human reviewers focus on architecture and business logic." },
            { question_text: "What should a PM track to measure AI code review impact?", scenario_context: "Reporting on developer productivity.", options: ["Number of comments AI makes", "Time-to-first-review, PR cycle time, and bug escape rate", "Lines of code reviewed", "Number of PRs rejected"], correct_answer_index: 1, explanation: "These metrics show real delivery impact: faster reviews, shorter cycles, and fewer bugs reaching production." },
            { question_text: "A senior developer feels threatened by AI code review. How should you respond?", scenario_context: "Managing team dynamics.", options: ["Tell them to accept it", "Show how AI handles tedious checks so they can focus on the high-value design reviews they enjoy", "Remove AI code review", "Replace the developer"], correct_answer_index: 1, explanation: "Frame AI as handling the boring parts so senior devs can focus on the architecture and mentoring they value." },
            { question_text: "AI flagged a security vulnerability in a PR. What's the PM's role?", scenario_context: "AI found a SQL injection risk.", options: ["Fix it yourself", "Ensure the team addresses it before merge and consider adding it to the Definition of Done", "Ignore it — AI is overreacting", "Report the developer to security"], correct_answer_index: 1, explanation: "PMs ensure security findings are addressed and use them to improve processes (e.g., DoD, security checklists)." },
            { question_text: "What's the ideal relationship between AI and human code review?", scenario_context: "Designing your review process.", options: ["AI only", "Human only", "AI does first pass on bugs/security/style; humans review design, logic, and architecture", "Alternate between AI and human per PR"], correct_answer_index: 2, explanation: "Layered review: AI catches mechanical issues first, then humans review the higher-order concerns." }
          ]
        },
        {
          title: "4.3 AI for Test Automation and Quality Assurance",
          description: "AI test generation creates unit, integration, and E2E tests from code changes. Incorporate into your Definition of Done.",
          order_index: 2, professorIndex: 1,
          lessonScript: { mainPoints: ["AI generates test cases from code changes and user stories.", "AI identifies untested edge cases and boundary conditions.", "Incorporate AI testing into your Definition of Done.", "Track test coverage improvement with AI-generated tests.", "AI testing accelerates delivery without sacrificing quality."] },
          questions: [
            { question_text: "How can AI test generation be incorporated into the Definition of Done?", scenario_context: "Updating your team's DoD.", options: ["Don't change the DoD", "Add 'AI-generated tests reviewed and passing' as a DoD item", "Remove all testing from DoD", "AI replaces the DoD"], correct_answer_index: 1, explanation: "Adding AI-generated testing to the DoD ensures consistent coverage without slowing delivery." },
            { question_text: "What's AI's biggest advantage in test generation?", scenario_context: "Evaluating AI testing tools.", options: ["Tests run faster", "AI systematically identifies edge cases and boundary conditions humans often miss", "AI tests are prettier", "AI eliminates the need for QA"], correct_answer_index: 1, explanation: "AI excels at systematically generating edge case tests that human testers often overlook." },
            { question_text: "Should AI-generated tests replace human-written tests?", scenario_context: "Defining your testing strategy.", options: ["Yes — AI is better", "No — AI supplements human tests by covering mechanical edge cases; humans write business logic tests", "Yes — save money on QA", "AI can't write useful tests"], correct_answer_index: 1, explanation: "AI handles edge cases and mechanical coverage; humans write business-context-aware tests." },
            { question_text: "Your team's test coverage jumped from 40% to 75% with AI. Is this good?", scenario_context: "Measuring AI testing impact.", options: ["Coverage doesn't matter", "Good progress — but verify the AI tests are meaningful, not just increasing numbers", "75% is too low", "Coverage should always be 100%"], correct_answer_index: 1, explanation: "Higher coverage is good, but quality matters. Verify AI tests actually catch bugs, not just inflate numbers." },
            { question_text: "How does AI testing affect sprint velocity?", scenario_context: "Forecasting AI testing impact.", options: ["Slows velocity", "Increases velocity — faster test creation means faster story completion", "No impact", "Decreases quality"], correct_answer_index: 1, explanation: "AI test generation reduces the testing bottleneck, allowing stories to move through the pipeline faster." }
          ]
        },
        {
          title: "4.4 CI/CD Pipeline Optimization with AI",
          description: "AI optimizes build times, identifies flaky tests, predicts deployment failures, and auto-heals pipelines.",
          order_index: 3, professorIndex: 2,
          lessonScript: { mainPoints: ["AI identifies and quarantines flaky tests that waste pipeline time.", "Build time optimization: AI suggests parallelization and caching strategies.", "Predictive deployment: AI flags risky deployments before they fail.", "Auto-healing pipelines retry transient failures without human intervention.", "PMs should understand pipeline health metrics to track delivery efficiency."] },
          questions: [
            { question_text: "What is a 'flaky test' and why should PMs care?", scenario_context: "Pipeline failures are blocking deployments.", options: ["A test with a funny name", "A test that passes/fails randomly, wasting pipeline time and blocking deployments", "A test that's too easy", "A test for UI animations"], correct_answer_index: 1, explanation: "Flaky tests cause random pipeline failures, blocking deployments and wasting developer time. AI can identify and quarantine them." },
            { question_text: "How does AI predictive deployment help PMs?", scenario_context: "Your team deploys twice per week.", options: ["AI deploys automatically", "AI flags risky deployments before they fail, reducing rollbacks and incidents", "AI replaces the deploy button", "No impact on PMs"], correct_answer_index: 1, explanation: "Predictive deployment reduces failed releases, which means fewer incidents and less firefighting for the PM." },
            { question_text: "What pipeline metric should a PM track to show AI optimization impact?", scenario_context: "Reporting CI/CD improvements.", options: ["Number of pipelines", "Build time, deployment frequency, and change failure rate", "Number of commits", "Cost of CI/CD tools"], correct_answer_index: 1, explanation: "These DORA metrics directly show delivery efficiency: faster builds, more deployments, fewer failures." },
            { question_text: "AI suggests parallelizing test suites to cut build time by 60%. What should the PM do?", scenario_context: "AI pipeline optimization recommendation.", options: ["Implement immediately without testing", "Work with the team to validate, test in staging, then implement", "Ignore the suggestion", "Wait 6 months"], correct_answer_index: 1, explanation: "AI recommendations need validation. Test in staging first to ensure parallelization doesn't break test isolation." },
            { question_text: "What is 'auto-healing' in CI/CD pipelines?", scenario_context: "Learning about advanced pipeline features.", options: ["Pipelines fix code bugs", "Pipelines automatically retry transient failures (network, resource) without human intervention", "Pipelines heal themselves from security breaches", "Auto-healing doesn't exist"], correct_answer_index: 1, explanation: "Auto-healing retries failures caused by temporary issues (network timeouts, resource limits), reducing manual intervention." }
          ]
        },
        {
          title: "4.5 AI Monitoring and Incident Response with Datadog",
          description: "AI-powered monitoring detects anomalies, correlates incidents, and auto-generates root cause analyses.",
          order_index: 4, professorIndex: 0,
          lessonScript: { mainPoints: ["AI anomaly detection catches issues before users report them.", "Incident correlation: AI connects related alerts into a single incident.", "Auto-generated root cause analysis speeds up resolution.", "MTTR (Mean Time To Resolution) drops significantly with AI monitoring.", "PMs should understand monitoring dashboards to facilitate incident response."] },
          questions: [
            { question_text: "How does AI anomaly detection help PMs?", scenario_context: "Your app had an outage last week that users found before the team.", options: ["It doesn't help PMs", "AI catches performance issues before users are affected, reducing firefighting", "AI prevents all outages", "AI only helps DevOps"], correct_answer_index: 1, explanation: "Early anomaly detection means fewer user-impacting incidents, reducing escalations and stakeholder anxiety." },
            { question_text: "What does AI incident correlation do?", scenario_context: "Your team got 47 alerts during an incident.", options: ["Sends more alerts", "Groups related alerts into a single incident with likely root cause", "Deletes old alerts", "Forwards alerts to management"], correct_answer_index: 1, explanation: "Correlation reduces alert noise by connecting related symptoms into a single, actionable incident view." },
            { question_text: "How should a PM use MTTR metrics from AI monitoring?", scenario_context: "Reporting on operational health.", options: ["Ignore operational metrics", "Track MTTR trends to show improvement and justify continued investment in AI monitoring", "Only share when MTTR is low", "MTTR is only for SRE teams"], correct_answer_index: 1, explanation: "MTTR trends demonstrate the value of AI monitoring investment and team improvement in incident response." },
            { question_text: "AI generated a root cause analysis for yesterday's outage. How should you use it?", scenario_context: "Post-incident review.", options: ["Accept it as the final answer", "Use it as a starting point for the team's blameless postmortem discussion", "File it and forget", "Share with executives without review"], correct_answer_index: 1, explanation: "AI root cause analysis is a starting point. The team's postmortem adds human context and identifies systemic improvements." },
            { question_text: "Why should PMs understand monitoring dashboards?", scenario_context: "Your manager says monitoring is 'not a PM thing.'", options: ["PMs don't need dashboards", "Understanding system health helps PMs anticipate risks, facilitate incident response, and report accurately", "Only to impress engineers", "Dashboards are too technical for PMs"], correct_answer_index: 1, explanation: "System health awareness makes PMs more effective at risk management, incident coordination, and stakeholder communication." }
          ]
        },
        {
          title: "4.6 Vercel AI and Deployment Intelligence",
          description: "Intelligent deployments, preview environments, and performance analytics with Vercel AI SDK.",
          order_index: 5, professorIndex: 1,
          lessonScript: { mainPoints: ["Preview deployments let stakeholders review changes before production.", "AI-powered performance analytics identify regressions automatically.", "Deployment intelligence prevents bad releases from reaching users.", "Edge-first deployment reduces latency globally.", "PMs can use preview URLs for stakeholder review and feedback."] },
          questions: [
            { question_text: "How do preview deployments help PMs with stakeholder management?", scenario_context: "Your VP wants to see features before they go live.", options: ["They don't help PMs", "Stakeholders can review real, working features via preview URLs before production release", "Preview deployments are only for developers", "They replace staging environments"], correct_answer_index: 1, explanation: "Preview URLs give stakeholders hands-on access to review features, reducing surprises and building confidence." },
            { question_text: "What does 'deployment intelligence' prevent?", scenario_context: "Your team had a bad deploy last week.", options: ["All deployments", "Bad releases from reaching users by detecting regressions pre-deployment", "Developers from deploying", "All code changes"], correct_answer_index: 1, explanation: "AI deployment intelligence catches performance regressions and errors before they reach production users." },
            { question_text: "How should a PM use Vercel's performance analytics?", scenario_context: "Tracking application performance.", options: ["Ignore performance metrics", "Monitor Core Web Vitals to ensure user experience meets standards and report trends", "Only check when users complain", "Performance is only a developer concern"], correct_answer_index: 1, explanation: "Performance directly impacts user satisfaction. PMs should track Core Web Vitals and report trends to stakeholders." },
            { question_text: "What is 'edge-first deployment' and why should a PM care?", scenario_context: "Evaluating deployment strategies.", options: ["Deploying only edge cases", "Deploying to servers close to users globally for faster load times and better UX", "A risky deployment strategy", "Deploying on the weekend"], correct_answer_index: 1, explanation: "Edge deployment means faster load times for all users globally, directly improving user experience and satisfaction." },
            { question_text: "How can preview deployments speed up the sprint review process?", scenario_context: "Improving sprint review efficiency.", options: ["They can't", "Stakeholders review working features asynchronously before the review meeting", "They slow things down", "Preview deployments replace sprint reviews"], correct_answer_index: 1, explanation: "Async review via preview URLs means the sprint review meeting focuses on discussion, not demos from scratch." }
          ]
        },
        {
          title: "4.7 Lab: Measuring and Reporting AI Impact on Delivery Velocity",
          description: "Build a dashboard tracking AI tool impact: cycle time, deployment frequency, change failure rate, and MTTR.",
          order_index: 6, professorIndex: 2,
          lessonScript: { mainPoints: ["Track the four DORA metrics: deployment frequency, lead time, change failure rate, MTTR.", "Compare metrics before and after AI tool adoption.", "Build a dashboard that visualizes AI impact clearly.", "Present findings to stakeholders with before-and-after comparisons.", "Use data to justify continued AI tool investment."] },
          questions: [
            { question_text: "What are the four DORA metrics PMs should track?", scenario_context: "Building your delivery dashboard.", options: ["Cost, revenue, users, retention", "Deployment frequency, lead time for changes, change failure rate, MTTR", "Sprint velocity, story points, bugs, hours", "Lines of code, PRs, commits, releases"], correct_answer_index: 1, explanation: "DORA metrics are the industry standard for measuring software delivery performance." },
            { question_text: "How should you present AI impact to skeptical stakeholders?", scenario_context: "Justifying AI tool subscriptions.", options: ["Show how cool the tools are", "Before-and-after DORA metric comparisons with dollar values for time saved", "Just share vendor marketing", "Tell them everyone is doing it"], correct_answer_index: 1, explanation: "Data-driven before-and-after comparisons with business value calculations are most convincing." },
            { question_text: "Your team's deployment frequency doubled after AI adoption. What does this indicate?", scenario_context: "Analyzing your dashboard data.", options: ["Nothing meaningful", "The team can deliver changes to users faster, indicating improved delivery capability", "They're deploying too much", "AI is unreliable"], correct_answer_index: 1, explanation: "Higher deployment frequency means faster value delivery to users — a key indicator of delivery health." },
            { question_text: "Change failure rate dropped from 15% to 5% after AI code review adoption. What should you report?", scenario_context: "Preparing the monthly report.", options: ["Report the number only", "AI code review caught bugs that would have reached production, saving X hours of incident response", "Don't report — 5% is still not zero", "Report that developers are making fewer mistakes"], correct_answer_index: 1, explanation: "Frame the improvement in business terms: fewer production incidents, less firefighting, better user experience." },
            { question_text: "What's the MOST common mistake PMs make when reporting on AI tool impact?", scenario_context: "Learning from other PMs' experiences.", options: ["Reporting too much data", "Measuring activity (prompts sent, tools used) instead of outcomes (time saved, quality improved)", "Not using charts", "Reporting too infrequently"], correct_answer_index: 1, explanation: "Outcome metrics (time saved, quality, velocity) matter more than activity metrics (tool usage counts)." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "How should PMs factor AI coding assistants into capacity planning?", scenario_context: "Sprint planning with a Copilot-enabled team.", options: ["Double the scope", "Expect 20-40% productivity improvement after ramp-up, adjust gradually based on data", "No adjustment needed", "Cut the team size in half"], correct_answer_index: 1, explanation: "Gradual adjustment based on actual measured productivity gains is the responsible approach." },
        { question_text: "What's the ideal layered approach to code review?", scenario_context: "Designing your review process.", options: ["AI only", "AI first pass for bugs/security/style, then human review for design and architecture", "Human only", "Skip code review"], correct_answer_index: 1, explanation: "AI handles mechanical checks; humans focus on design, architecture, and business logic." },
        { question_text: "Which DORA metric shows how quickly your team recovers from failures?", scenario_context: "Building your delivery dashboard.", options: ["Deployment frequency", "MTTR — Mean Time To Resolution", "Lead time", "Change failure rate"], correct_answer_index: 1, explanation: "MTTR measures how quickly the team restores service after an incident." },
        { question_text: "How do preview deployments improve the PM workflow?", scenario_context: "Evaluating deployment strategies.", options: ["They don't affect PMs", "Stakeholders review working features async via URLs before sprint review", "They replace sprint reviews", "They only help developers"], correct_answer_index: 1, explanation: "Preview URLs enable async stakeholder review, making sprint review meetings more efficient and focused." },
        { question_text: "What's the PM's role during a production incident with AI monitoring?", scenario_context: "Your app's error rate just spiked.", options: ["Fix the code", "Facilitate response using AI-generated RCA, communicate with stakeholders, track MTTR", "Ignore it — that's DevOps", "Blame the developer who deployed"], correct_answer_index: 1, explanation: "PMs facilitate incident response, manage stakeholder communication, and drive postmortem improvements." }
      ]
    },
    // MODULE 5
    {
      title: "Module 5: AI for Risk Management & Decision Making",
      description: "Use predictive analytics, risk scoring, resource optimization, and burndown prediction to make smarter decisions faster.",
      order_index: 4,
      videos: [
        {
          title: "5.1 Predictive Analytics for Sprint and Project Forecasting",
          description: "Use AI to analyze historical data and predict sprint completion, delivery dates, and resource bottlenecks.",
          order_index: 0, professorIndex: 0,
          lessonScript: { mainPoints: ["AI uses historical velocity to predict sprint completion probability.", "Monte Carlo simulations give probability ranges, not single-point estimates.", "Feed AI your actual data for project-specific predictions.", "Forecast.app and similar tools automate predictive analytics.", "Share probability ranges with stakeholders instead of false-precision dates."] },
          questions: [
            { question_text: "Why are Monte Carlo simulations better than single-point estimates for project forecasting?", scenario_context: "Your stakeholder wants a delivery date.", options: ["They're not better", "They provide probability ranges that honestly represent uncertainty", "They give exact dates", "They're only for financial forecasting"], correct_answer_index: 1, explanation: "Monte Carlo shows probability distributions: '85% chance of completing by March 15' is more honest and useful than 'We'll deliver March 10.'" },
            { question_text: "What data does AI need for accurate sprint forecasting?", scenario_context: "Setting up predictive analytics.", options: ["Team member ages", "Historical velocity, story completion rates, scope change frequency, and team capacity", "Only sprint dates", "Stakeholder wishes"], correct_answer_index: 1, explanation: "Historical data on velocity, completion rates, and scope changes let AI build accurate prediction models." },
            { question_text: "How should a PM present AI forecasts to stakeholders?", scenario_context: "Sharing delivery predictions.", options: ["Give exact dates", "Share probability ranges: 'There's an 80% chance we deliver by X, 95% by Y'", "Don't share forecasts", "Only share optimistic scenarios"], correct_answer_index: 1, explanation: "Probability ranges build trust by honestly representing uncertainty while giving stakeholders useful planning data." },
            { question_text: "AI predicts only 40% chance of completing all sprint items. What should you do?", scenario_context: "Mid-sprint forecast looks bad.", options: ["Ignore the forecast", "Discuss with the team: reduce scope, address blockers, or reset stakeholder expectations", "Push the team to work overtime", "Blame poor estimation"], correct_answer_index: 1, explanation: "Low completion probability is an early warning. Take action: reduce scope, remove blockers, or manage expectations." },
            { question_text: "How often should AI forecasts be refreshed?", scenario_context: "Determining forecast cadence.", options: ["Once per project", "Continuously — as new data comes in, predictions should update", "Once per quarter", "Only when stakeholders ask"], correct_answer_index: 1, explanation: "Forecasts improve with fresh data. Continuous updates catch emerging risks early." }
          ]
        },
        {
          title: "5.2 AI Risk Scoring and Early Warning Systems",
          description: "Create AI-powered risk registers that auto-score and re-rank risks. Set up early warning triggers.",
          order_index: 1, professorIndex: 1,
          lessonScript: { mainPoints: ["AI analyzes project signals to score risks automatically.", "Early warning triggers alert you before risks become issues.", "Feed AI data from multiple sources: code metrics, sprint data, team sentiment.", "AI re-ranks risks dynamically as project conditions change.", "Build a risk dashboard that updates in real-time."] },
          questions: [
            { question_text: "What advantage does AI risk scoring have over manual risk registers?", scenario_context: "Your risk register is updated monthly.", options: ["No advantage", "AI continuously re-scores risks based on real-time project data", "Manual is always better", "AI makes risks worse"], correct_answer_index: 1, explanation: "AI monitors project signals continuously, re-scoring risks dynamically instead of relying on monthly manual reviews." },
            { question_text: "What project signals should feed into AI risk analysis?", scenario_context: "Configuring your risk early warning system.", options: ["Only financial data", "Sprint velocity, bug rates, team sentiment, scope changes, and dependency status", "Stakeholder emails only", "Weather forecasts"], correct_answer_index: 1, explanation: "Multiple signals paint a complete picture: velocity trends, quality metrics, team health, and scope stability." },
            { question_text: "AI flags a 'high risk' on team burnout based on overtime data. What should you do?", scenario_context: "AI early warning system alert.", options: ["Ignore it — AI doesn't understand people", "Investigate with the team, validate the signal, and take preventive action", "Fire the tired team members", "Reduce all deadlines"], correct_answer_index: 1, explanation: "AI burnout signals deserve investigation. Talk to the team, validate, and take preventive action before it impacts delivery." },
            { question_text: "How do AI early warning triggers differ from traditional risk monitoring?", scenario_context: "Upgrading your risk management.", options: ["They're the same", "AI triggers automatically when data crosses thresholds; traditional relies on someone noticing", "Traditional is better", "AI triggers too many false alarms"], correct_answer_index: 1, explanation: "AI monitoring never sleeps and catches threshold breaches the moment they happen, not when someone checks." },
            { question_text: "Your AI risk dashboard shows 3 new 'medium' risks this sprint. What's the BEST response?", scenario_context: "Reviewing your risk dashboard.", options: ["Panic", "Review each risk, validate with the team, assign mitigation owners, and track in standup", "Wait until they become 'high'", "Remove them from the dashboard"], correct_answer_index: 1, explanation: "Medium risks need attention: validate, assign owners, mitigate, and monitor — don't wait for escalation." }
          ]
        },
        {
          title: "5.3 Resource Optimization and Capacity Planning with AI",
          description: "AI optimizes team allocation, predicts burnout, balances workloads, and models resource scenarios.",
          order_index: 2, professorIndex: 2,
          lessonScript: { mainPoints: ["AI analyzes team utilization to identify overallocation.", "Predict burnout before it happens using workload pattern analysis.", "Model different staffing scenarios to see trade-offs.", "Balance workloads across team members for sustainable delivery.", "AI capacity planning accounts for PTO, meetings, and context-switching."] },
          questions: [
            { question_text: "What does AI resource optimization consider that manual planning often misses?", scenario_context: "Your team seems overloaded but capacity planning says they're fine.", options: ["Nothing extra", "Context-switching overhead, meeting time, PTO patterns, and sustainable pace factors", "Only salary costs", "Team member preferences"], correct_answer_index: 1, explanation: "AI accounts for hidden capacity drains: meetings, context-switching, and PTO that manual planning overlooks." },
            { question_text: "AI predicts Developer A will burn out in 3 weeks. What should the PM do?", scenario_context: "AI burnout prediction alert.", options: ["Wait and see", "Rebalance workload now, discuss with the developer, and adjust sprint commitments", "Replace the developer", "Ignore AI — it can't predict human feelings"], correct_answer_index: 1, explanation: "Proactive intervention prevents burnout: rebalance work, check in with the person, and adjust commitments." },
            { question_text: "How can AI help with the 'what if we lose a team member' scenario?", scenario_context: "Planning for team changes.", options: ["AI can't help with this", "AI models impact on velocity, capacity, and delivery timelines for different staffing scenarios", "Just hire replacements immediately", "Ignore the risk"], correct_answer_index: 1, explanation: "AI scenario modeling shows exactly how team changes affect delivery, helping PMs prepare contingency plans." },
            { question_text: "What's the key difference between utilization and productivity in AI capacity analysis?", scenario_context: "Your team is 100% utilized but delivery is slow.", options: ["They're the same", "Utilization measures time spent; productivity measures value delivered — high utilization can mask low productivity", "Productivity doesn't matter", "Utilization is always more important"], correct_answer_index: 1, explanation: "100% utilization often means no slack for innovation, learning, or handling unexpected work. AI helps find the optimal balance." },
            { question_text: "How should AI workload balancing recommendations be implemented?", scenario_context: "AI suggests reassigning 3 stories.", options: ["Auto-reassign without discussion", "Discuss recommendations with the team, consider context AI doesn't have, then adjust", "Ignore the suggestions", "Only follow if team agrees unanimously"], correct_answer_index: 1, explanation: "AI recommendations are data-driven starting points. Team discussion adds context about skills, interests, and preferences." }
          ]
        },
        {
          title: "5.4 AI-Enhanced Burndown and Burnup Analysis",
          description: "Go beyond traditional burndown with AI-powered trend analysis, scope creep detection, and completion prediction.",
          order_index: 3, professorIndex: 0,
          lessonScript: { mainPoints: ["Traditional burndowns show what happened; AI burndowns predict what will happen.", "AI detects scope creep patterns and alerts you early.", "Completion predictions adjust based on current team velocity.", "AI generates narrative commentary on sprint health.", "Use AI burndown insights in daily standup for data-driven discussions."] },
          questions: [
            { question_text: "How does an AI-enhanced burndown differ from a traditional one?", scenario_context: "Upgrading your sprint tracking.", options: ["It looks prettier", "AI adds predictive trends, scope creep alerts, and completion probability", "There's no difference", "AI burndowns are less accurate"], correct_answer_index: 1, explanation: "AI adds forward-looking analysis: where are we headed based on current patterns, not just where we've been." },
            { question_text: "AI detected scope creep mid-sprint. What should the SM do?", scenario_context: "3 new stories were added after sprint start.", options: ["Accept all new work", "Raise it in standup, negotiate with the PO, and protect the sprint goal", "Remove team members", "Ignore it"], correct_answer_index: 1, explanation: "Scope creep threatens the sprint goal. The SM must raise it, facilitate negotiation, and protect commitment." },
            { question_text: "AI predicts the team will complete 85% of the sprint by Friday. How should this inform decisions?", scenario_context: "Wednesday standup.", options: ["No action needed", "Identify which 15% might not finish, discuss trade-offs, and update stakeholders proactively", "Push for 100% at all costs", "Cancel the sprint"], correct_answer_index: 1, explanation: "85% prediction lets you proactively manage expectations and make trade-off decisions while there's still time." },
            { question_text: "What data makes AI burndown predictions most accurate?", scenario_context: "Calibrating your AI burndown.", options: ["Team member names", "Story-level progress updates, blocker status, and remaining effort estimates", "Sprint number only", "Meeting attendance"], correct_answer_index: 1, explanation: "Granular story progress data gives AI the most accurate picture for prediction." },
            { question_text: "How should AI sprint health commentary be used in standups?", scenario_context: "Incorporating AI insights into daily routines.", options: ["Read the full AI report aloud", "Share key AI insights as a conversation starter, then focus on human discussion", "Ignore AI during standup", "Replace standup with AI reports"], correct_answer_index: 1, explanation: "AI insights spark data-driven discussion. The standup remains a human conversation informed by AI data." }
          ]
        },
        {
          title: "5.5 Data-Driven Decision Making with AI Analysis",
          description: "Feed AI your project data for decision recommendations on scope, timeline, and resources.",
          order_index: 4, professorIndex: 1,
          lessonScript: { mainPoints: ["Structure your decisions as data problems AI can analyze.", "AI can evaluate trade-offs: cut scope vs extend timeline vs add resources.", "Always include constraints and priorities in your AI analysis prompt.", "AI provides options and trade-offs; the PM makes the final call.", "Document AI-assisted decisions for future learning."] },
          questions: [
            { question_text: "How should a PM structure a decision for AI analysis?", scenario_context: "You're facing a scope-timeline-resource trade-off.", options: ["Just ask 'what should I do?'", "Provide options, constraints, priorities, and data so AI can analyze trade-offs", "AI can't help with decisions", "Let AI decide everything"], correct_answer_index: 1, explanation: "Structured input (options, constraints, data) lets AI provide meaningful trade-off analysis." },
            { question_text: "AI recommends cutting 20% of scope to meet the deadline. What should you do?", scenario_context: "AI analyzed your project data.", options: ["Cut immediately", "Review which items to cut with stakeholders, considering business impact and dependencies", "Ignore the recommendation", "Cut 40% to be safe"], correct_answer_index: 1, explanation: "AI identifies the need; the PM works with stakeholders to decide WHAT to cut based on business priorities." },
            { question_text: "Why should PM decisions assisted by AI be documented?", scenario_context: "Building decision-making practices.", options: ["Documentation is unnecessary", "To learn from outcomes, improve AI prompts, and provide audit trails", "Only for compliance", "To blame AI if things go wrong"], correct_answer_index: 1, explanation: "Documentation enables learning: what AI recommended, what you decided, and what actually happened." },
            { question_text: "AI suggests adding 2 developers will accelerate delivery by 30%. Should you do it?", scenario_context: "AI resource analysis.", options: ["Add them immediately", "Consider Brook's Law, onboarding time, and team dynamics — AI may not account for these", "AI is always right about staffing", "Never add people"], correct_answer_index: 1, explanation: "AI may not account for onboarding overhead, team dynamics, and Brook's Law. Factor these in before deciding." },
            { question_text: "What's the PM's role when AI and human intuition disagree?", scenario_context: "AI recommends one thing, your gut says another.", options: ["Always follow AI", "Investigate the disagreement — understand AI's data and your intuition's basis, then decide", "Always follow intuition", "Flip a coin"], correct_answer_index: 1, explanation: "Disagreement is a signal to dig deeper. Understand both perspectives, then make an informed decision." }
          ]
        },
        {
          title: "5.6 Lab: Build Your AI-Powered Project Health Dashboard",
          description: "Combine forecasting, risk scoring, resource analysis, and burndown prediction into a single AI-enhanced view.",
          order_index: 5, professorIndex: 2,
          lessonScript: { mainPoints: ["A single dashboard combines all AI-powered metrics.", "Include: forecasts, risk scores, capacity utilization, and burndown predictions.", "Set up automated alerts for threshold breaches.", "Update the dashboard with real project data.", "Present the dashboard to stakeholders as your command center."] },
          questions: [
            { question_text: "What should an AI project health dashboard include?", scenario_context: "Building your PM command center.", options: ["Only burndown charts", "Forecasts, risk scores, capacity utilization, burndown predictions, and DORA metrics", "Just a status color (red/yellow/green)", "Meeting schedules"], correct_answer_index: 1, explanation: "A comprehensive dashboard combines multiple AI-powered views for complete project health visibility." },
            { question_text: "How should dashboard alerts be configured?", scenario_context: "Setting up automated monitoring.", options: ["Alert on everything", "Set meaningful thresholds that indicate real problems, not noise", "No alerts needed", "Only alert the PM"], correct_answer_index: 1, explanation: "Effective alerts trigger on meaningful thresholds. Too many alerts cause alert fatigue and get ignored." },
            { question_text: "Who should have access to the project health dashboard?", scenario_context: "Configuring dashboard permissions.", options: ["Only the PM", "The entire team and key stakeholders — transparency builds trust", "Only executives", "Only developers"], correct_answer_index: 1, explanation: "Transparency builds trust. Sharing the dashboard with the team and stakeholders promotes accountability." },
            { question_text: "Your dashboard shows green across all metrics but the team feels stressed. What's wrong?", scenario_context: "Dashboard data contradicts team sentiment.", options: ["The team is wrong", "The dashboard may be missing human factors — add team health/satisfaction metrics", "Ignore the team", "The dashboard is broken"], correct_answer_index: 1, explanation: "Dashboards without human factors miss important signals. Add team sentiment and satisfaction metrics." },
            { question_text: "How often should the project health dashboard be reviewed with stakeholders?", scenario_context: "Establishing review cadence.", options: ["Never — it's self-service", "Weekly or bi-weekly with a brief review of trends and action items", "Only when something is wrong", "Once per project"], correct_answer_index: 1, explanation: "Regular reviews with stakeholders build shared understanding and catch emerging issues early." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "Why are probability ranges better than exact dates for project forecasting?", scenario_context: "Presenting delivery forecasts.", options: ["They're not better", "They honestly represent uncertainty while giving useful planning data", "Stakeholders prefer exact dates", "They're easier to calculate"], correct_answer_index: 1, explanation: "Probability ranges build trust by being honest about uncertainty instead of false precision." },
        { question_text: "What makes AI risk scoring superior to monthly manual risk reviews?", scenario_context: "Upgrading risk management.", options: ["AI is always right", "AI continuously monitors real-time signals instead of relying on periodic human review", "Manual is better", "AI can't assess risks"], correct_answer_index: 1, explanation: "Continuous AI monitoring catches emerging risks between manual review cycles." },
        { question_text: "AI predicts burnout for a team member. What's the FIRST action?", scenario_context: "AI early warning alert.", options: ["Fire them", "Have a 1-on-1 conversation to validate and discuss workload adjustments", "Ignore it", "Reduce their pay"], correct_answer_index: 1, explanation: "Validate the AI signal with the person first, then take supportive action." },
        { question_text: "What's the danger of a 'green dashboard' with an unhappy team?", scenario_context: "Metrics look great but morale is low.", options: ["No danger", "Dashboard is missing human factors — delivery metrics don't capture team health", "The team is wrong", "Ignore morale"], correct_answer_index: 1, explanation: "Delivery metrics alone miss human factors. A complete dashboard includes team health indicators." },
        { question_text: "When AI and human intuition disagree on a decision, what should the PM do?", scenario_context: "Making a difficult trade-off.", options: ["Always follow AI", "Investigate both perspectives, understand the data gap, then make an informed call", "Always follow gut", "Ask someone else to decide"], correct_answer_index: 1, explanation: "Disagreement signals a data gap. Investigate before deciding — neither AI nor intuition is always right." }
      ]
    },
    // MODULE 6
    {
      title: "Module 6: Building Your AI-Powered PM Toolkit",
      description: "Create custom GPTs, automate workflows with Zapier and Make, build dashboards, and complete a capstone project demonstrating AI mastery.",
      order_index: 5,
      videos: [
        {
          title: "6.1 Creating Custom GPTs for Your PM Workflow",
          description: "Build custom GPTs: a sprint planning assistant, stakeholder report writer, or risk analysis bot.",
          order_index: 0, professorIndex: 0,
          lessonScript: { mainPoints: ["Custom GPTs encode your team's knowledge and processes.", "Include instructions, knowledge files, and action capabilities.", "Build GPTs for your most repetitive PM tasks.", "Share GPTs across the team for consistent output quality.", "Iterate on your GPT based on usage feedback."] },
          questions: [
            { question_text: "What makes a custom GPT more valuable than generic ChatGPT for PM work?", scenario_context: "Deciding whether to build custom GPTs.", options: ["Custom GPTs are faster", "They encode your team's specific processes, templates, and knowledge for consistent outputs", "No difference", "Custom GPTs are only for developers"], correct_answer_index: 1, explanation: "Custom GPTs bake in your team's context so every output follows your processes and standards." },
            { question_text: "What should you include in a custom GPT's instructions?", scenario_context: "Building a sprint planning GPT.", options: ["Just a name", "Role definition, output format, knowledge context, and constraints specific to your team", "Nothing — let it figure things out", "Only a greeting message"], correct_answer_index: 1, explanation: "Clear instructions with role, format, context, and constraints produce the most useful and consistent outputs." },
            { question_text: "Which PM task benefits MOST from a custom GPT?", scenario_context: "Choosing your first custom GPT project.", options: ["One-time tasks", "Frequently repeated tasks with consistent format requirements like stakeholder reports", "Tasks you do once a year", "Tasks that require no writing"], correct_answer_index: 1, explanation: "High-frequency, format-consistent tasks like weekly reports benefit most from custom GPTs." },
            { question_text: "How should you improve a custom GPT over time?", scenario_context: "Your GPT is good but not perfect.", options: ["Delete and rebuild from scratch", "Iterate based on usage feedback — refine instructions, add examples, update knowledge", "Never change it", "Build a new one for every update"], correct_answer_index: 1, explanation: "Continuous refinement based on real usage makes GPTs increasingly valuable over time." },
            { question_text: "Should custom GPTs be shared across the team?", scenario_context: "You built a great report-writing GPT.", options: ["Keep it personal", "Yes — shared GPTs ensure consistent quality and save the whole team time", "Only share with managers", "GPTs can't be shared"], correct_answer_index: 1, explanation: "Sharing multiplies the value. The whole team benefits from consistent, high-quality outputs." }
          ]
        },
        {
          title: "6.2 Workflow Automation with Zapier and Make",
          description: "Connect AI tools into automated workflows: Jira to ChatGPT to Slack, transcripts to Notion, sprint data to reports.",
          order_index: 1, professorIndex: 1,
          lessonScript: { mainPoints: ["Zapier and Make connect AI tools without writing code.", "Build workflows: meeting → transcript → action items → Jira tickets.", "Start with simple 2-step automations before building complex ones.", "Test automations with real data before going live.", "Monitor automations — they can break when tools update."] },
          questions: [
            { question_text: "What's the main benefit of Zapier/Make for PMs?", scenario_context: "Evaluating automation platforms.", options: ["They're free", "Connect AI tools into automated workflows without writing code", "They replace project management tools", "They only work with email"], correct_answer_index: 1, explanation: "No-code automation lets PMs build powerful AI-connected workflows without engineering help." },
            { question_text: "What's a practical PM automation to build first?", scenario_context: "Starting with workflow automation.", options: ["A complex 10-step pipeline", "Meeting transcript → extract action items → create Jira tickets automatically", "Automate payroll", "Replace the entire sprint process"], correct_answer_index: 1, explanation: "Start simple with high-impact automations. Meeting-to-Jira is practical, saves time, and proves the concept." },
            { question_text: "Your automation created 20 duplicate Jira tickets. What went wrong?", scenario_context: "Automation error.", options: ["Jira is broken", "The automation lacked deduplication logic — always add checks before creating records", "Automations are unreliable", "Shut down all automations"], correct_answer_index: 1, explanation: "Automations need guard rails: deduplication checks, validation steps, and error handling." },
            { question_text: "How should you test automations before going live?", scenario_context: "Building a new workflow.", options: ["Test in production", "Run with sample data in a test environment, verify outputs, then enable for live data", "No testing needed", "Test once and forget"], correct_answer_index: 1, explanation: "Test with sample data first. Verify every step produces expected outputs before connecting to live systems." },
            { question_text: "Your Zapier automation stopped working after a tool update. What should you do?", scenario_context: "Monday morning — automation failures.", options: ["Rebuild from scratch", "Check which step broke, update the connection or mapping, and add monitoring alerts", "Abandon automation", "Wait for it to fix itself"], correct_answer_index: 1, explanation: "Tool updates can break connections. Diagnose the specific failure, fix it, and add monitoring to catch future breaks." }
          ]
        },
        {
          title: "6.3 Building AI-Integrated Dashboards",
          description: "Create dashboards combining traditional metrics with AI insights using Notion, Google Sheets, and custom solutions.",
          order_index: 2, professorIndex: 2,
          lessonScript: { mainPoints: ["Combine traditional metrics (velocity, burndown) with AI insights (predictions, risks).", "Notion dashboards are easy to build and share with stakeholders.", "Google Sheets + AI plugins create powerful analysis dashboards.", "Design for your audience: executives vs team views.", "Automate data refresh so dashboards stay current."] },
          questions: [
            { question_text: "What makes an AI-integrated dashboard different from a traditional one?", scenario_context: "Upgrading your project reporting.", options: ["Better colors", "It adds predictive insights, risk scores, and AI-generated analysis alongside standard metrics", "No difference", "AI dashboards are less reliable"], correct_answer_index: 1, explanation: "AI dashboards add forward-looking insights: predictions, risk analysis, and recommendations alongside historical data." },
            { question_text: "How should dashboard views differ for executives vs the team?", scenario_context: "Designing your dashboard.", options: ["Same view for everyone", "Executives see business impact summaries; teams see detailed sprint and technical metrics", "Only build for executives", "Teams don't need dashboards"], correct_answer_index: 1, explanation: "Different audiences need different views: executives want outcomes, teams want operational detail." },
            { question_text: "What's the biggest mistake when building PM dashboards?", scenario_context: "Learning from common failures.", options: ["Too few metrics", "Including too many metrics — signal gets lost in noise", "Using the wrong colors", "Making them too pretty"], correct_answer_index: 1, explanation: "Dashboard overload hides important signals. Focus on the 5-7 metrics that actually drive decisions." },
            { question_text: "How should you keep dashboard data fresh?", scenario_context: "Your dashboard data is always stale.", options: ["Update manually every Friday", "Automate data refresh using APIs, Zapier, or scheduled scripts", "Stale data is fine", "Let someone else update it"], correct_answer_index: 1, explanation: "Automated data refresh ensures dashboards always show current information without manual effort." },
            { question_text: "What AI insight should EVERY PM dashboard include?", scenario_context: "Choosing must-have dashboard components.", options: ["AI-generated jokes", "Sprint completion prediction and risk score — forward-looking insights that drive action", "Historical data only", "Team member photos"], correct_answer_index: 1, explanation: "Predictive insights (completion forecast, risk score) turn dashboards from rear-view mirrors into navigation tools." }
          ]
        },
        {
          title: "6.4 Prompt Libraries and Templates for PM/SM",
          description: "Organize a personal prompt library for every PM ceremony and deliverable. Version, categorize, and share.",
          order_index: 3, professorIndex: 0,
          lessonScript: { mainPoints: ["Build a categorized prompt library: planning, communication, risk, reporting.", "Version your prompts — track what works and iterate.", "Include context placeholders that get filled in per use.", "Share your library with the team for consistent quality.", "Great prompts are your most valuable AI asset."] },
          questions: [
            { question_text: "Why is a prompt library valuable for PMs?", scenario_context: "Colleagues ask why you save prompts.", options: ["It's unnecessary", "Consistent quality, time savings, and institutional knowledge that survives team changes", "Prompts are always the same", "AI doesn't need prompts"], correct_answer_index: 1, explanation: "A prompt library ensures quality, saves time, and preserves knowledge — even when team members change." },
            { question_text: "How should prompts be organized in the library?", scenario_context: "Structuring your prompt library.", options: ["Alphabetically", "By PM activity: planning, estimation, communication, risk, retrospectives", "Randomly", "By creation date"], correct_answer_index: 1, explanation: "Category-based organization lets you quickly find the right prompt for the current task." },
            { question_text: "What are 'context placeholders' in prompt templates?", scenario_context: "Building reusable prompts.", options: ["Decorative elements", "Variables like [sprint_number], [team_velocity] that get filled in for each use", "Permanent text", "AI instructions only"], correct_answer_index: 1, explanation: "Placeholders make templates reusable: fill in the specific data for each sprint/project while keeping the structure." },
            { question_text: "How often should prompts be updated?", scenario_context: "Maintaining your prompt library.", options: ["Never — they're perfect once written", "After each use, note what worked and refine; formally review quarterly", "Daily", "Only when AI models change"], correct_answer_index: 1, explanation: "Iterative improvement after each use keeps prompts sharp. Quarterly reviews catch bigger optimization opportunities." },
            { question_text: "A team member improved your sprint planning prompt significantly. What should you do?", scenario_context: "Prompt collaboration.", options: ["Ignore their changes", "Update the shared library with the improvement and credit them — encourage team contribution", "Keep your original version", "Delete their version"], correct_answer_index: 1, explanation: "Collaborative improvement strengthens the library. Credit contributors to encourage more team participation." }
          ]
        },
        {
          title: "6.5 Staying Current: The AI Tool Landscape in 2025-2026",
          description: "Develop a system to evaluate and adopt new AI tools. Run pilots, measure adoption, and make build-vs-buy decisions.",
          order_index: 4, professorIndex: 1,
          lessonScript: { mainPoints: ["The AI tool landscape changes every month — have a system to stay current.", "Follow key AI newsletters and communities for PM-relevant updates.", "Run time-boxed pilots: 2 weeks to evaluate a new tool with real work.", "Measure pilot outcomes against your 5-criteria framework.", "Make build-vs-buy decisions based on data, not hype."] },
          questions: [
            { question_text: "How should PMs stay current with AI tools?", scenario_context: "The AI landscape is moving fast.", options: ["Try every new tool immediately", "Follow curated sources, run structured pilots, and evaluate against your framework", "Ignore new tools — what you have works", "Wait for IT to tell you"], correct_answer_index: 1, explanation: "Structured evaluation (curated sources + pilots + framework) prevents both FOMO and tool paralysis." },
            { question_text: "What's the ideal length for an AI tool pilot?", scenario_context: "Evaluating a new AI meeting assistant.", options: ["One meeting", "2 weeks — enough for real usage patterns without over-investing", "6 months", "1 year"], correct_answer_index: 1, explanation: "2 weeks gives enough real usage data to evaluate while keeping the investment small if it doesn't work out." },
            { question_text: "A new AI tool is getting massive hype but has no enterprise security. Should you adopt it?", scenario_context: "Everyone is talking about a shiny new tool.", options: ["Yes — don't miss out", "No — evaluate against all 5 criteria; missing security is a deal-breaker for enterprise use", "Wait for the next version", "Only use for personal tasks"], correct_answer_index: 1, explanation: "Hype doesn't override the evaluation framework. Missing security is a fundamental criteria failure for enterprise adoption." },
            { question_text: "When should a PM build custom AI solutions vs buying tools?", scenario_context: "Your needs are unique.", options: ["Always build", "Buy when tools meet 80%+ of needs; build only when unique workflow requirements justify the investment", "Always buy", "Neither — don't use AI"], correct_answer_index: 1, explanation: "Buy-first is usually better. Build only when your workflow is genuinely unique and no tool comes close." },
            { question_text: "How should you measure the success of a tool pilot?", scenario_context: "Your 2-week pilot just ended.", options: ["Count how many times you used it", "Evaluate against all 5 framework criteria with actual usage data and team feedback", "Check social media reviews", "Ask the vendor"], correct_answer_index: 1, explanation: "Apply your evaluation framework with real data: accuracy, integration, security, value, and adoption experience." }
          ]
        },
        {
          title: "6.6 Capstone Project: Design Your AI-Powered PM Operating Model",
          description: "Apply everything to design a complete AI-powered operating model with toolkit, automations, dashboards, and projected gains.",
          order_index: 5, professorIndex: 2,
          lessonScript: { mainPoints: ["Design your complete AI PM operating model as a capstone.", "Include: tools, automations, dashboards, prompt libraries, and governance.", "Project productivity gains based on what you learned.", "Present your model as if pitching to your PMO or leadership.", "This capstone is your portfolio piece for the AI-augmented PM career."] },
          questions: [
            { question_text: "What should your AI-powered PM operating model include?", scenario_context: "Building your capstone deliverable.", options: ["Just a list of tools", "Tool stack, automation workflows, dashboards, prompt library, governance policy, and projected ROI", "A single AI subscription", "Meeting notes from the course"], correct_answer_index: 1, explanation: "A complete model covers tools, workflows, measurement, governance, and projected business impact." },
            { question_text: "How should you project ROI for your AI PM operating model?", scenario_context: "Quantifying the business case.", options: ["Guess a big number", "Calculate time saved per ceremony/deliverable × hourly rate × frequency", "ROI can't be calculated for AI", "Copy industry averages"], correct_answer_index: 1, explanation: "Bottom-up calculation: time saved on specific tasks × cost × frequency gives credible, defensible ROI numbers." },
            { question_text: "What's the most important section of your operating model for leadership?", scenario_context: "Presenting to the PMO.", options: ["The tool list", "The projected business impact: time saved, quality improved, delivery accelerated", "The technical architecture", "The prompt library"], correct_answer_index: 1, explanation: "Leadership cares about business outcomes. Lead with impact: faster delivery, higher quality, time and cost savings." },
            { question_text: "How should governance be integrated into the operating model?", scenario_context: "Balancing speed and safety.", options: ["Skip governance — it slows things down", "Include an AI usage policy, data classification, verification requirements, and tool approval process", "Add governance later", "Only IT handles governance"], correct_answer_index: 1, explanation: "Governance protects the organization. Include it from the start to build trust with leadership and security teams." },
            { question_text: "What makes this capstone a career differentiator for PMs?", scenario_context: "Planning your career growth.", options: ["It's just coursework", "It demonstrates practical AI mastery with a ready-to-implement plan that most PMs don't have", "Anyone can build one", "Certifications matter more"], correct_answer_index: 1, explanation: "A concrete, implementable AI operating model shows employers you can actually deliver AI-powered PM value, not just talk about it." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "What makes custom GPTs more valuable than generic AI for PM work?", scenario_context: "Evaluating custom GPT investment.", options: ["They're faster", "They encode your team's processes and context for consistent, relevant outputs", "They're cheaper", "No difference"], correct_answer_index: 1, explanation: "Custom GPTs bake in your specific context, producing outputs aligned with your team's standards." },
        { question_text: "What's the best first automation to build with Zapier or Make?", scenario_context: "Starting with workflow automation.", options: ["The most complex one", "A simple, high-impact flow like meeting transcript → action items → Jira tickets", "Payroll automation", "Social media posting"], correct_answer_index: 1, explanation: "Start simple with proven value. Meeting-to-ticket automation is practical and demonstrates clear ROI." },
        { question_text: "How should you evaluate new AI tools as they emerge?", scenario_context: "AI landscape is changing rapidly.", options: ["Try everything", "Apply your 5-criteria framework with 2-week time-boxed pilots", "Ignore new tools", "Wait for peers to adopt first"], correct_answer_index: 1, explanation: "Structured evaluation with time-boxed pilots prevents both FOMO and analysis paralysis." },
        { question_text: "What's the most important element of an AI PM operating model for leadership buy-in?", scenario_context: "Presenting your capstone to the PMO.", options: ["Technical architecture", "Projected business impact with time savings and ROI calculations", "Tool vendor names", "The prompt library"], correct_answer_index: 1, explanation: "Leadership buys outcomes, not tools. Lead with business impact and ROI." },
        { question_text: "How should an AI PM prompt library be maintained over time?", scenario_context: "Your library is growing.", options: ["Never update prompts", "Iterate after each use, review quarterly, and encourage team contributions", "Delete and rebuild yearly", "Only the creator should update it"], correct_answer_index: 1, explanation: "Continuous improvement through usage feedback and team collaboration keeps the library sharp and relevant." }
      ]
    }
  ]
};

// ── Seed function ──────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    // SECURITY: founder/admin only — this seeder writes content with the service role.
    const __adminCheck = await requireAdmin(req);
    if (__adminCheck instanceof Response) return __adminCheck;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const courseId = "dddddddd-eeee-ffff-1111-222222222222";

    // Delete existing course data (in correct order to respect FK constraints)
    const { data: existingChapters } = await supabase
      .from("chapters").select("id").eq("course_id", courseId);

    if (existingChapters && existingChapters.length > 0) {
      const chapterIds = existingChapters.map(c => c.id);

      // Delete quiz_questions via quizzes
      const { data: existingQuizzes } = await supabase
        .from("quizzes").select("id").in("chapter_id", chapterIds);

      if (existingQuizzes && existingQuizzes.length > 0) {
        const quizIds = existingQuizzes.map(q => q.id);
        await supabase.from("quiz_questions").delete().in("quiz_id", quizIds);
        await supabase.from("quizzes").delete().in("id", quizIds);
      }

      // Delete videos
      await supabase.from("videos").delete().in("chapter_id", chapterIds);
      // Delete chapters
      await supabase.from("chapters").delete().eq("course_id", courseId);
    }
    // Delete the course itself
    await supabase.from("courses").delete().eq("id", courseId);

    // Create the course
    const courseTranslations = {
      es: { title: "Dominio de IA para Scrum Masters y Project Managers", description: "Domina las herramientas de IA más potentes para automatizar flujos de trabajo y acelerar la entrega." },
      zh: { title: "Scrum Master和项目经理的AI精通", description: "掌握最强大的AI工具，自动化工作流程并加速交付。" },
      ar: { title: "إتقان الذكاء الاصطناعي لمديري المشاريع و Scrum Masters", description: "أتقن أقوى أدوات الذكاء الاصطناعي لأتمتة سير العمل وتسريع التسليم." },
      fr: { title: "Maîtrise de l'IA pour Scrum Masters et Chefs de Projet", description: "Maîtrisez les outils IA les plus puissants pour automatiser les flux et accélérer la livraison." },
      de: { title: "KI-Meisterschaft für Scrum Master und Projektmanager", description: "Meistern Sie die leistungsstärksten KI-Tools zur Automatisierung von Workflows." },
      ja: { title: "スクラムマスターとプロジェクトマネージャーのためのAIマスタリー", description: "最も強力なAIツールをマスターし、ワークフローを自動化して配信を加速します。" },
    };

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({ id: courseId, title: courseData.title, description: courseData.description, is_published: true, translations: courseTranslations })
      .select().single();

    if (courseError) throw courseError;

    // Chapter translations
    const chapterTranslationsMap: Record<number, Record<string, { title: string; description: string }>> = {
      0: { es: { title: "Módulo 1: Fundamentos de IA para PM y SM", description: "Comprende la IA para entrega de proyectos." }, fr: { title: "Module 1 : Fondamentaux IA pour PM/SM", description: "Comprendre l'IA pour la livraison de projets." }, de: { title: "Modul 1: KI-Grundlagen für PM/SM", description: "KI für Projektabwicklung verstehen." }, zh: { title: "模块1：PM/SM的AI基础", description: "了解AI对项目交付的意义。" }, ar: { title: "الوحدة 1: أساسيات الذكاء الاصطناعي", description: "فهم الذكاء الاصطناعي لتسليم المشاريع." }, ja: { title: "モジュール1：PM/SMのためのAI基礎", description: "プロジェクト配信のためのAIを理解する。" } },
      1: { es: { title: "Módulo 2: IA para Planificación de Sprint", description: "IA para historias, priorización y estimación." }, fr: { title: "Module 2 : IA pour la Planification de Sprint", description: "IA pour stories, priorisation et estimation." }, de: { title: "Modul 2: KI für Sprint-Planung", description: "KI für Stories, Priorisierung und Schätzung." }, zh: { title: "模块2：AI用于Sprint规划", description: "AI用于用户故事、优先级和估算。" }, ar: { title: "الوحدة 2: الذكاء الاصطناعي لتخطيط Sprint", description: "الذكاء الاصطناعي للقصص والأولويات والتقدير." }, ja: { title: "モジュール2：スプリント計画のためのAI", description: "ストーリー、優先順位、見積もりのためのAI。" } },
      2: { es: { title: "Módulo 3: IA para Comunicación", description: "Transformar reuniones e informes con IA." }, fr: { title: "Module 3 : IA pour la Communication", description: "Transformer réunions et rapports avec l'IA." }, de: { title: "Modul 3: KI für Kommunikation", description: "Meetings und Berichte mit KI transformieren." }, zh: { title: "模块3：AI用于沟通", description: "用AI改造会议和报告。" }, ar: { title: "الوحدة 3: الذكاء الاصطناعي للتواصل", description: "تحويل الاجتماعات والتقارير بالذكاء الاصطناعي." }, ja: { title: "モジュール3：コミュニケーションのためのAI", description: "AIでミーティングとレポートを変革する。" } },
      3: { es: { title: "Módulo 4: IA para Aceleración de Entrega", description: "CI/CD, revisión de código y monitoreo con IA." }, fr: { title: "Module 4 : IA pour l'Accélération", description: "CI/CD, revue de code et monitoring avec IA." }, de: { title: "Modul 4: KI für Delivery-Beschleunigung", description: "CI/CD, Code-Review und Monitoring mit KI." }, zh: { title: "模块4：AI用于交付加速", description: "CI/CD、代码审查和AI监控。" }, ar: { title: "الوحدة 4: تسريع التسليم بالذكاء الاصطناعي", description: "CI/CD ومراجعة الكود والمراقبة." }, ja: { title: "モジュール4：デリバリー加速のためのAI", description: "CI/CD、コードレビュー、AIモニタリング。" } },
      4: { es: { title: "Módulo 5: IA para Gestión de Riesgos", description: "Análisis predictivo y toma de decisiones." }, fr: { title: "Module 5 : IA pour la Gestion des Risques", description: "Analytique prédictive et prise de décision." }, de: { title: "Modul 5: KI für Risikomanagement", description: "Prädiktive Analytik und Entscheidungsfindung." }, zh: { title: "模块5：AI用于风险管理", description: "预测分析和决策制定。" }, ar: { title: "الوحدة 5: إدارة المخاطر بالذكاء الاصطناعي", description: "التحليلات التنبؤية واتخاذ القرارات." }, ja: { title: "モジュール5：リスク管理のためのAI", description: "予測分析と意思決定。" } },
      5: { es: { title: "Módulo 6: Tu Toolkit de IA", description: "GPTs personalizados, automatización y proyecto final." }, fr: { title: "Module 6 : Votre Boîte à Outils IA", description: "GPTs personnalisés, automatisation et projet final." }, de: { title: "Modul 6: Ihr KI-Toolkit", description: "Benutzerdefinierte GPTs, Automatisierung und Abschlussprojekt." }, zh: { title: "模块6：构建AI工具包", description: "自定义GPT、自动化和顶点项目。" }, ar: { title: "الوحدة 6: مجموعة أدوات الذكاء الاصطناعي", description: "GPTs مخصصة والأتمتة والمشروع النهائي." }, ja: { title: "モジュール6：AIツールキットの構築", description: "カスタムGPT、自動化、キャップストーンプロジェクト。" } },
    };

    // Create chapters, videos, and quizzes
    for (const chapterData of courseData.chapters) {
      const chapterTranslations = chapterTranslationsMap[chapterData.order_index] || {};

      const { data: chapter, error: chapterError } = await supabase
        .from("chapters")
        .insert({ course_id: course.id, title: chapterData.title, description: chapterData.description, order_index: chapterData.order_index, translations: chapterTranslations })
        .select().single();

      if (chapterError) throw chapterError;

      for (const videoData of chapterData.videos) {
        const lessonNum = `${chapterData.order_index + 1}.${videoData.order_index + 1}`;
        const videoTranslations = {
          es: { title: `${lessonNum} ${videoData.title.split(' ').slice(1).join(' ')}`, description: videoData.description },
          zh: { title: `${lessonNum} 课程`, description: videoData.description },
          ar: { title: `${lessonNum} الدرس`, description: videoData.description },
          fr: { title: `${lessonNum} Leçon`, description: videoData.description },
          de: { title: `${lessonNum} Lektion`, description: videoData.description },
          ja: { title: `${lessonNum} レッスン`, description: videoData.description },
        };

        const { data: video, error: videoError } = await supabase
          .from("videos")
          .insert({ chapter_id: chapter.id, title: videoData.title, description: videoData.description, order_index: videoData.order_index, translations: videoTranslations })
          .select().single();

        if (videoError) throw videoError;

        // Mini quiz for this video
        const { data: quiz, error: quizError } = await supabase
          .from("quizzes")
          .insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 100 })
          .select().single();

        if (quizError) throw quizError;

        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          const { error: questionError } = await supabase
            .from("quiz_questions")
            .insert({ quiz_id: quiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
          if (questionError) throw questionError;
        }
      }

      // Chapter end quiz
      const { data: endQuiz, error: endQuizError } = await supabase
        .from("quizzes")
        .insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 100 })
        .select().single();

      if (endQuizError) throw endQuizError;

      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        const { error: questionError } = await supabase
          .from("quiz_questions")
          .insert({ quiz_id: endQuiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
        if (questionError) throw questionError;
      }
    }

    return new Response(
      JSON.stringify({ message: "AI Mastery course created successfully", courseId: course.id, chapters: courseData.chapters.length, totalLessons: courseData.chapters.reduce((sum, ch) => sum + ch.videos.length, 0) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error seeding AI course:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
