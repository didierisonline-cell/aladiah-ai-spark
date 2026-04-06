const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vgujnkxylipfwmkpwzvb.supabase.co', process.env.SUPABASE_SERVICE_KEY);

const modules = [
  // SCRUM MASTER
  { chapterId: '4e3787b0-f659-4242-81db-8c3a47e6055b', title: 'Module 1 Quiz: The Role of the Scrum Master', questions: [
    { question: 'What is the primary role of a Scrum Master?', options: ['Assign tasks to developers', 'Serve as a servant-leader and coach who removes impediments', 'Approve the product backlog', 'Report project status to executives'], correct: 1 },
    { question: 'Where does the Scrum Master\'s authority come from?', options: ['Their job title', 'The project charter', 'Influence and coaching, not formal authority', 'The CEO'], correct: 2 },
    { question: 'What are the three pillars of Scrum empiricism?', options: ['Planning, execution, review', 'Transparency, inspection, adaptation', 'Speed, quality, value', 'Scope, schedule, budget'], correct: 1 },
    { question: 'How does a Scrum Master handle team impediments?', options: ['Logs them and reviews monthly', 'Ignores minor ones', 'Treats every impediment as a personal mission to resolve quickly', 'Escalates all impediments to the CEO'], correct: 2 },
    { question: 'What distinguishes a traditional Project Manager from a Scrum Master?', options: ['The PM uses sprints; the SM uses Gantt charts', 'The PM controls tasks and plans; the SM enables self-organization', 'The SM writes code; the PM does not', 'There is no difference'], correct: 1 },
  ]},
  { chapterId: '96f7c3dc-9d34-468b-90e7-6b7916fda6e8', title: 'Module 2 Quiz: Scrum Master Opportunities', questions: [
    { question: 'What is the average Scrum Master salary range in the United States?', options: ['$40,000–$60,000', '$95,000–$140,000', '$200,000–$250,000', '$60,000–$80,000'], correct: 1 },
    { question: 'Which certification is considered the most recognized globally for Scrum Masters?', options: ['PMP', 'CSM from Scrum Alliance', 'ITIL', 'Six Sigma Black Belt'], correct: 1 },
    { question: 'What level of Scrum Master focuses on team dynamics beyond ceremonies?', options: ['Level 1 – Ceremony Facilitator', 'Level 2 – Team Coach', 'Level 3 – System Thinker', 'Level 4 – Transformation Leader'], correct: 1 },
    { question: 'What is the recommended first certification for new Scrum Masters entering the market?', options: ['PMI-ACP', 'PSM1', 'CSM', 'SAFe Scrum Master'], correct: 2 },
    { question: 'Which skill is most difficult to teach but most valuable in a Scrum Master?', options: ['Knowing the Scrum Guide', 'Facilitation', 'Coaching and asking powerful questions', 'Running Daily Scrums'], correct: 2 },
  ]},
  { chapterId: 'a515410c-3791-49fc-8ded-1d7aafc3bf6d', title: 'Module 3 Quiz: Scrum Master Job Overview', questions: [
    { question: 'What do employers look for FIRST when hiring a Scrum Master?', options: ['Years of experience', 'Certification as a baseline filter', 'Technical coding skills', 'MBA degree'], correct: 1 },
    { question: 'Which work environment is considered the "sweet spot" for new Scrum Masters?', options: ['Startup', 'Large enterprise', 'Mid-size technology company', 'Government agency'], correct: 2 },
    { question: 'What format should you use to prepare interview stories?', options: ['SMART', 'STAR (Situation, Task, Action, Result)', 'SWOT', 'MoSCoW'], correct: 1 },
    { question: 'What does the PSM1 certification from Scrum.org signal to employers?', options: ['You attended a two-day course', 'Deeper knowledge due to its higher difficulty and lower pass rate', 'SAFe experience', 'PMP equivalency'], correct: 1 },
    { question: 'What is a key advantage for Latin American Scrum Masters in the global market?', options: ['Lower certification costs', 'Bilingual skills and cultural versatility for remote global roles', 'Easier exams', 'Proximity to US time zones only'], correct: 1 },
  ]},
  { chapterId: 'c85f9cfc-3b92-46d6-b34a-b97933cf634a', title: 'Module 4 Quiz: Final Project', questions: [
    { question: 'What is the first piece of advice Prof. Didier gives to aspiring Scrum Masters?', options: ['Get certified immediately', 'Get in the room before you have the title', 'Apply for jobs right away', 'Learn to code'], correct: 1 },
    { question: 'What should you document daily to build your Scrum Master portfolio?', options: ['Salary data', 'Date, situation, action, outcome', 'Team member performance', 'Product backlog items'], correct: 1 },
    { question: 'What does "Solo Excelencia" mean in the context of Aladiah Academy?', options: ['Only Spanish speakers welcome', 'Excellence only — the standard Prof. Didier sets', 'Solo learning preferred', 'Certification is optional'], correct: 1 },
    { question: 'Why is building your professional network before you need it important?', options: ['To show off certifications', 'Because most roles are filled through referrals and relationships', 'To get discounts on courses', 'Network is not important for Scrum Masters'], correct: 1 },
    { question: 'What is the most important thing a Scrum Master should know about themselves professionally?', options: ['Their exact salary target', 'Their "why" — the personal motivation that sustains them through challenges', 'Their preferred Scrum tool', 'Their Myers-Briggs type'], correct: 1 },
  ]},

  // AI MASTERY
  { chapterId: '8b4cf17f-6ce1-4cc1-a788-96a8fb388e20', title: 'Module 1 Quiz: AI Foundations', questions: [
    { question: 'What is a Large Language Model (LLM)?', options: ['A database of project templates', 'An AI trained on large text datasets that generates responses word by word', 'A project management tool', 'A type of spreadsheet software'], correct: 1 },
    { question: 'What is the biggest risk of using consumer AI tools with confidential project data?', options: ['Slow response times', 'Data may be used to train future AI models', 'High subscription costs', 'Limited language support'], correct: 1 },
    { question: 'Which of the following is NOT one of the five AI tool evaluation criteria?', options: ['Integration fit', 'Output quality', 'Celebrity endorsements', 'Data security'], correct: 2 },
    { question: 'What is the difference between an LLM and an AI Agent?', options: ['LLMs are more expensive', 'Agents can take autonomous actions; LLMs only generate text', 'LLMs are newer technology', 'There is no difference'], correct: 1 },
    { question: 'Stage two of AI adoption mindset is considered most dangerous. What is it?', options: ['Skepticism', 'Over-reliance — accepting AI outputs without critical review', 'Calibrated integration', 'Rejection'], correct: 1 },
  ]},
  { chapterId: '90196385-0952-4d34-9560-d273d50d63d1', title: 'Module 2 Quiz: AI for Sprint Planning', questions: [
    { question: 'What is the primary benefit of AI-powered user story writing?', options: ['Eliminates the need for Product Owners', 'Produces consistent quality stories with comprehensive acceptance criteria faster', 'Replaces Sprint Planning', 'Removes the need for acceptance criteria'], correct: 1 },
    { question: 'What does WSJF stand for in backlog prioritization?', options: ['Weighted Sprint Job Flow', 'Weighted Shortest Job First', 'Work Sprint Job Framework', 'Weekly Sprint Job Filter'], correct: 1 },
    { question: 'What is the recommended approach for using AI estimation in Planning Poker?', options: ['Replace Planning Poker entirely with AI', 'Use AI estimates as one reference point alongside team judgment', 'Only use AI for large stories', 'Ignore AI estimates completely'], correct: 1 },
    { question: 'What does Jira\'s AI retrospective summarization feature do?', options: ['Replaces the retrospective ceremony', 'Generates a structured retrospective starting point from sprint data', 'Assigns action items automatically', 'Sends meeting invites'], correct: 1 },
    { question: 'What are the four stages of an AI Backlog Management Pipeline?', options: ['Plan, build, test, deploy', 'Intake, enrichment, refinement prep, sprint load analysis', 'Elicit, analyze, document, validate', 'Create, review, approve, close'], correct: 1 },
  ]},
  { chapterId: '4a85985c-9e97-4667-a390-f454973693f2', title: 'Module 3 Quiz: AI for Communication', questions: [
    { question: 'Which tool automatically joins meetings, transcribes them, and generates summaries?', options: ['Jira', 'Otter.ai or Fireflies.ai', 'Notion only', 'Slack'], correct: 1 },
    { question: 'What is the key principle when using AI for status report generation?', options: ['Let AI invent missing details', 'Only put verified facts into the prompt — AI communicates reality, not creates it', 'Always use the longest report format', 'Skip the RAG status'], correct: 1 },
    { question: 'What is Gamma primarily used for in PM workflows?', options: ['Code review', 'AI-powered presentation building from written content', 'Database management', 'Sprint planning'], correct: 1 },
    { question: 'What is the correct approach to AI-enhanced retrospectives?', options: ['Replace the ceremony with AI analysis', 'Use AI pattern analysis as a conversation starter, not a conclusion', 'Only analyze the last sprint', 'Eliminate action items'], correct: 1 },
    { question: 'How much time per week can automated meeting summaries save a typical PM?', options: ['5 minutes', '30 minutes', '2–3 hours', '8 hours'], correct: 2 },
  ]},
  { chapterId: 'dc09d40d-cc7f-4b5d-8d7d-391c1cc59b79', title: 'Module 4 Quiz: AI for Delivery', questions: [
    { question: 'What does GitHub Copilot research show about developer task completion speed?', options: ['5% faster', '25% faster', 'Approximately 55% faster', 'No significant difference'], correct: 2 },
    { question: 'What is the primary benefit of AI code review tools like CodeRabbit?', options: ['They replace human reviewers entirely', 'They provide instant first-pass review, freeing humans for architectural discussions', 'They automatically merge pull requests', 'They write unit tests automatically'], correct: 1 },
    { question: 'What are DORA metrics?', options: ['A type of sprint planning framework', 'Deployment Frequency, Lead Time, Change Failure Rate, MTTR', 'Daily Operations Reporting Analytics', 'Docker, Orchestration, Registry, Automation'], correct: 1 },
    { question: 'What does intelligent test selection in CI/CD do?', options: ['Runs all tests on every commit', 'Runs only tests most likely to fail based on code changes, reducing pipeline time', 'Eliminates the need for testing', 'Only runs tests weekly'], correct: 1 },
    { question: 'What is the recommended approach for PM capacity planning when teams adopt Copilot?', options: ['Immediately double sprint capacity', 'Protect a 2–3 sprint ramp-up period before expecting velocity improvements', 'Reduce team size immediately', 'Switch to waterfall during transition'], correct: 1 },
  ]},
  { chapterId: '3a3d3413-43b8-48db-873e-1339197b78ba', title: 'Module 5 Quiz: AI for Risk Management', questions: [
    { question: 'What does Monte Carlo simulation produce for project forecasting?', options: ['A single fixed delivery date', 'A probability distribution of possible outcomes', 'A Gantt chart', 'A resource allocation plan'], correct: 1 },
    { question: 'What is velocity anomaly detection used for?', options: ['Detecting slow internet connections', 'Alerting when sprint progress deviates from historical patterns early enough to intervene', 'Measuring code quality', 'Tracking employee hours'], correct: 1 },
    { question: 'What does the Project Health Dashboard\'s Predictive Forecast panel show?', options: ['Yesterday\'s completed stories', 'Monte Carlo probability distribution for the release date based on current velocity', 'Team member satisfaction scores', 'Budget variance only'], correct: 1 },
    { question: 'What is the RED method for service monitoring?', options: ['Risk, Escalation, Documentation', 'Rate, Errors, Duration', 'Review, Evaluate, Deploy', 'Respond, Escalate, Decide'], correct: 1 },
    { question: 'In AI-assisted decision making, what is Step 3 after framing and data gathering?', options: ['Immediately decide', 'Analysis generation — ask AI to identify factors, trade-offs, and risks', 'Skip to documentation', 'Consult only human experts'], correct: 1 },
  ]},
  { chapterId: '49f5e732-a9a1-4dab-bd5f-3aee99e0548e', title: 'Module 6 Quiz: AI-Powered PM Toolkit', questions: [
    { question: 'What are the three components needed to build a Custom PM AI Assistant?', options: ['GPU, RAM, storage', 'System prompt, context documents, custom instructions', 'API key, database, frontend', 'Training data, model, deployment'], correct: 1 },
    { question: 'When should you use Make (formerly Integromat) over Zapier?', options: ['For simple trigger-action workflows', 'For workflows requiring conditional branching or complex data transformation', 'For email campaigns only', 'Make and Zapier are identical'], correct: 1 },
    { question: 'What is the most underrated component of an AI-integrated dashboard?', options: ['Colorful charts', 'The natural language summary that tells the story behind the numbers', 'Real-time alerts', 'Mobile compatibility'], correct: 1 },
    { question: 'What should you do every time a prompt produces excellent output?', options: ['Delete it after use', 'Save it to your prompt library with notes on when to use it', 'Share it publicly immediately', 'Modify it so it cannot be reused'], correct: 1 },
    { question: 'What are the five components of a PM AI Operating Model?', options: ['Vision, mission, values, goals, metrics', 'Daily workflow, ceremony enhancement, communication system, metrics dashboard, learning commitment', 'Plan, do, check, act, improve', 'Initiate, plan, execute, monitor, close'], correct: 1 },
  ]},

  // PROJECT MANAGEMENT
  { chapterId: '4929aa1a-ec99-436a-a023-62c741aacbb3', title: 'Module 1 Quiz: PM Foundations', questions: [
    { question: 'What are the four phases of the project lifecycle?', options: ['Design, Build, Test, Deploy', 'Initiating, Planning, Executing, Closing', 'Start, Middle, End, Archive', 'Concept, Development, Launch, Review'], correct: 1 },
    { question: 'In a Matrix Organization, team members report to:', options: ['Only the Project Manager', 'Only their functional manager', 'Both functional manager and project manager', 'The CEO directly'], correct: 2 },
    { question: 'What is the purpose of the Project Charter?', options: ['To track daily tasks', 'To formally authorize the project and give the PM authority to use resources', 'To replace the project plan', 'To document lessons learned'], correct: 1 },
    { question: 'In the power-interest grid, how should you manage high-power, low-interest stakeholders?', options: ['Ignore them', 'Keep them satisfied with summary-level information', 'Involve them in every decision', 'Remove them from the stakeholder register'], correct: 1 },
    { question: 'Which organizational structure gives project managers the MOST authority?', options: ['Functional', 'Weak matrix', 'Balanced matrix', 'Projectized'], correct: 3 },
  ]},
  { chapterId: '5210464d-b9c4-4d92-a700-6443110470ab', title: 'Module 2 Quiz: Scope Management', questions: [
    { question: 'What is scope creep?', options: ['Deliberate scope reduction', 'Gradual unauthorized expansion of scope without adjusting time, cost, or resources', 'Completing scope ahead of schedule', 'Formal change control process'], correct: 1 },
    { question: 'What does the WBS (Work Breakdown Structure) decompose?', options: ['The project team structure', 'The total project scope into smaller, manageable components', 'The project budget only', 'The project schedule'], correct: 1 },
    { question: 'What is the difference between scope validation and quality control?', options: ['They are the same thing', 'Scope validation verifies deliverables meet requirements; QC verifies they meet quality standards', 'QC is done first, then validation', 'Validation is only done at project end'], correct: 1 },
    { question: 'What is the primary elicitation technique recommended for large stakeholder populations?', options: ['Individual interviews only', 'Observation', 'Surveys and questionnaires', 'Focus groups'], correct: 2 },
    { question: 'In Agile scope management, who is solely responsible for backlog prioritization?', options: ['The Scrum Master', 'The development team', 'The Product Owner', 'The project sponsor'], correct: 2 },
  ]},
  { chapterId: '4b84a74d-843e-4281-966d-86bb7bdcd24a', title: 'Module 3 Quiz: Schedule Management', questions: [
    { question: 'What does the Critical Path determine?', options: ['The most expensive activities', 'The minimum project duration and activities where any delay impacts the end date', 'The activities with the most resources', 'The first activities to start'], correct: 1 },
    { question: 'What is Total Float?', options: ['The total project budget reserve', 'Latest Start minus Earliest Start — how long an activity can be delayed without delaying the project', 'The time between sprints', 'Available resource hours'], correct: 1 },
    { question: 'What is the PERT three-point estimation formula?', options: ['(O + M + P) / 3', '(O + 4M + P) / 6', '(O + P) / 2', '(M × 4) + O'], correct: 1 },
    { question: 'What is the difference between crashing and fast-tracking?', options: ['They are identical techniques', 'Crashing adds resources; fast-tracking executes activities in parallel', 'Fast-tracking adds resources; crashing removes scope', 'Crashing is agile; fast-tracking is waterfall'], correct: 1 },
    { question: 'What does a Schedule Performance Index (SPI) of 0.85 indicate?', options: ['The project is 15% ahead of schedule', 'The project is behind schedule — getting 85 cents of schedule value per dollar of time spent', 'The project is on track', 'The project is over budget'], correct: 1 },
  ]},
  { chapterId: '68ac9d73-c0a5-4f96-b90f-7f81c7c93ea7', title: 'Module 4 Quiz: Cost Management', questions: [
    { question: 'What does a Cost Performance Index (CPI) of 0.90 mean?', options: ['The project is 10% ahead of budget', 'The project is getting $0.90 of value for every $1 spent — over budget', 'The project is on track', 'The project has 10% contingency remaining'], correct: 1 },
    { question: 'What is the difference between contingency reserves and management reserves?', options: ['They are the same thing', 'Contingency is for identified risks (inside baseline); management reserves are for unknown unknowns (outside baseline)', 'Management reserves are larger', 'Contingency is for cost; management is for schedule'], correct: 1 },
    { question: 'What does Estimate at Completion (EAC) = BAC / CPI calculate?', options: ['The remaining work cost', 'The total projected project cost based on current cost performance continuing', 'The original budget', 'The cost variance'], correct: 1 },
    { question: 'Which estimation technique is MOST accurate but most time-consuming?', options: ['Analogous estimating', 'Parametric estimating', 'ROM estimating', 'Bottom-up estimating'], correct: 3 },
    { question: 'What does a positive NPV indicate about a project?', options: ['The project will be late', 'The project returns more than the cost of capital and creates value', 'The project is too expensive', 'NPV has no business relevance'], correct: 1 },
  ]},
  { chapterId: '4390d629-151b-41bf-9c9b-63cf347eb251', title: 'Module 5 Quiz: Risk Management', questions: [
    { question: 'What is the definition of a project risk?', options: ['Any negative event', 'An uncertain event that, if it occurs, has a positive OR negative effect on project objectives', 'Only threats, never opportunities', 'A guaranteed problem'], correct: 1 },
    { question: 'What does Monte Carlo simulation produce for risk analysis?', options: ['A single risk score', 'A probability distribution of possible project outcomes', 'A list of risk owners', 'A Gantt chart'], correct: 1 },
    { question: 'What is risk mitigation?', options: ['Transferring risk to a third party', 'Reducing the probability or impact of a threat', 'Accepting the risk without action', 'Eliminating the risk entirely'], correct: 1 },
    { question: 'What is the difference between active and passive risk acceptance?', options: ['Active acceptance means ignoring the risk', 'Active acceptance establishes contingency reserves; passive does nothing and addresses the risk if it occurs', 'Passive acceptance is better', 'They are identical approaches'], correct: 1 },
    { question: 'What is a risk trigger?', options: ['A risk that has already occurred', 'An indicator that a risk event is about to materialize, prompting response activation', 'A risk that cannot be mitigated', 'The risk register tool'], correct: 1 },
  ]},
  { chapterId: 'aad527e6-e30f-474f-a985-4db1395b9025', title: 'Module 6 Quiz: Stakeholder & Communication', questions: [
    { question: 'What are the five stakeholder engagement levels?', options: ['Active, passive, neutral, interested, disengaged', 'Unaware, resistant, neutral, supportive, leading', 'Hostile, skeptical, neutral, friendly, champion', 'Aware, informed, engaged, committed, advocating'], correct: 1 },
    { question: 'What is the difference between push and pull communication?', options: ['Push is faster; pull is slower', 'Push sends information proactively; pull makes information available for stakeholders to access when needed', 'They are the same approach', 'Pull is only for executives'], correct: 1 },
    { question: 'Which conflict resolution style is MOST time-consuming but produces the most durable results?', options: ['Forcing', 'Avoiding', 'Compromising', 'Collaborating (Problem Solving)'], correct: 3 },
    { question: 'What is the most important practice for virtual team management?', options: ['Avoid all synchronous meetings', 'Make implicit expectations explicit — communicate what co-located teams take for granted', 'Hire only in the same time zone', 'Rely entirely on email'], correct: 1 },
    { question: 'When should formal communications be documented in writing?', options: ['Only for budget approvals', 'Only at project close', 'Always — especially for anything that might later be disputed', 'Never, verbal is sufficient'], correct: 2 },
  ]},
  { chapterId: '3b4de0e6-17fd-4660-b5f4-578511f4a5f0', title: 'Module 7 Quiz: Quality Management', questions: [
    { question: 'What is the difference between quality assurance and quality control?', options: ['They are identical', 'QA is process-focused and preventive; QC is product-focused and detective', 'QC comes before QA', 'QA is done by developers; QC by managers'], correct: 1 },
    { question: 'What does the Pareto principle state about quality problems?', options: ['All problems are equally important', '80% of problems come from 20% of causes', '50% of defects are developer errors', 'Quality costs twice the development cost'], correct: 1 },
    { question: 'What does the cost of non-conformance typically compare to the cost of conformance?', options: ['They are equal', 'Non-conformance costs 3–5 times more than conformance', 'Conformance always costs more', 'Non-conformance is cheaper'], correct: 1 },
    { question: 'What does Test-Driven Development (TDD) require developers to do?', options: ['Write tests after code is complete', 'Write failing tests FIRST, then write the minimum code to make them pass', 'Skip unit testing for speed', 'Only test at sprint end'], correct: 1 },
    { question: 'In the PDCA cycle, what does the "Check" step involve?', options: ['Planning the improvement', 'Implementing the change', 'Evaluating the results of the change against expected improvement', 'Standardizing the improvement'], correct: 2 },
  ]},
  { chapterId: '0d3b43bb-285b-494c-b99c-eda3ce3448b9', title: 'Module 8 Quiz: Procurement Management', questions: [
    { question: 'Which contract type places the MOST cost risk on the buyer?', options: ['Fixed-price', 'Cost-plus-fixed-fee', 'Time-and-materials', 'Firm-fixed-price'], correct: 1 },
    { question: 'What is a Statement of Work (SOW)?', options: ['A vendor\'s marketing document', 'A document describing the work, deliverables, performance standards, and timeline under a contract', 'The project charter', 'A risk register'], correct: 1 },
    { question: 'Why should source selection criteria be established BEFORE issuing the RFP?', options: ['To save time', 'To prevent bias risk and maintain procurement integrity', 'Criteria are always set after proposals arrive', 'To give vendors more guidance'], correct: 1 },
    { question: 'What is the primary risk of adversarial contract negotiation?', options: ['Higher contract prices', 'A vendor who is minimally compliant and difficult to work with', 'Longer negotiation time', 'Reduced scope'], correct: 1 },
    { question: 'What should accompany every scope change in a vendor contract?', options: ['A verbal agreement', 'A formal change order adjusting the contract price and timeline', 'An email only', 'A new RFP'], correct: 1 },
  ]},
  { chapterId: '100d2786-d4e0-41f3-a8d5-bffc6a3ee765', title: 'Module 9 Quiz: Agile & Hybrid PM', questions: [
    { question: 'What are the four Agile Manifesto values?', options: ['Plan, execute, review, adapt', 'Individuals/interactions, working software, customer collaboration, responding to change — over their counterparts', 'Scope, schedule, cost, quality', 'Sprint, backlog, review, retro'], correct: 1 },
    { question: 'What is the WIP limit in Kanban?', options: ['The maximum team size', 'An explicit cap on items in a workflow stage that prevents overloading', 'The sprint velocity cap', 'The maximum story points per sprint'], correct: 1 },
    { question: 'In SAFe, what is an Agile Release Train (ART)?', options: ['A deployment pipeline', 'A group of synchronized Agile teams working on a Program Increment together', 'A type of sprint ceremony', 'A release calendar'], correct: 1 },
    { question: 'What is the most common hybrid PM pattern in enterprises?', options: ['Pure waterfall with agile retrospectives', 'Agile execution engine within a traditional governance framework', 'SAFe only', 'Kanban only'], correct: 1 },
    { question: 'What is PI Planning in SAFe?', options: ['A daily standup for all teams', 'A two-day event where all ART teams plan their work for the next 8–12 weeks together', 'A product roadmap review', 'A quarterly budget meeting'], correct: 1 },
  ]},
  { chapterId: '52bca873-aaa7-434a-bf48-408b36fc0135', title: 'Module 10 Quiz: PM Leadership & Career', questions: [
    { question: 'What are the four domains of Emotional Intelligence according to Goleman?', options: ['Planning, organizing, leading, controlling', 'Self-awareness, self-management, social awareness, relationship management', 'Initiation, planning, execution, closure', 'Vision, strategy, tactics, operations'], correct: 1 },
    { question: 'How many questions is the PMP exam, and how long is it?', options: ['100 questions, 2 hours', '200 questions, 4 hours', '180 questions, 230 minutes', '150 questions, 3 hours'], correct: 2 },
    { question: 'What percentage of the PMP exam covers agile and hybrid approaches?', options: ['10%', '25%', 'Approximately 50%', '75%'], correct: 2 },
    { question: 'What does benefits realization management track?', options: ['Project schedule performance', 'Whether the business benefits projected in the business case actually materialize after project close', 'Team member performance', 'Certification maintenance'], correct: 1 },
    { question: 'What is the recommended minimum number of practice questions before the PMP exam?', options: ['100', '250', '500–600', '1000'], correct: 2 },
  ]},

  // DATA ANALYTICS
  { chapterId: '43479d00-ad3b-4049-b8c5-9921bea92d58', title: 'Module 1 Quiz: Data Analytics Foundations', questions: [
    { question: 'Which stage of the analytics lifecycle typically consumes 60–80% of project time?', options: ['Business understanding', 'Data acquisition', 'Data preparation', 'Modeling'], correct: 2 },
    { question: 'What is the difference between structured and unstructured data?', options: ['Structured data is newer', 'Structured data has predefined schema (rows/columns); unstructured has no predefined format', 'Unstructured data is always larger', 'They are the same thing'], correct: 1 },
    { question: 'Which programming language is dominant for data science and machine learning?', options: ['Java', 'R', 'Python', 'COBOL'], correct: 2 },
    { question: 'What is the most commonly required technical skill in analytics job descriptions?', options: ['Python', 'Tableau', 'SQL', 'Excel'], correct: 2 },
    { question: 'What does AI-powered text-to-SQL enable?', options: ['Converting Python to SQL', 'Business users querying databases in natural language without writing SQL', 'Automatic database creation', 'SQL performance optimization'], correct: 1 },
  ]},
  { chapterId: '74cce117-e814-4c52-97d8-5d2e825f26da', title: 'Module 2 Quiz: SQL for Analytics', questions: [
    { question: 'What does a LEFT JOIN return?', options: ['Only matching rows from both tables', 'All rows from the left table and matching rows from the right table', 'All rows from both tables', 'Only non-matching rows'], correct: 1 },
    { question: 'What distinguishes a window function from an aggregate function?', options: ['Window functions are slower', 'Window functions perform calculations across related rows WITHOUT collapsing the result set', 'Aggregate functions are newer', 'They are identical'], correct: 1 },
    { question: 'What does a Common Table Expression (CTE) improve?', options: ['Query execution speed only', 'Query readability and maintainability by breaking complex queries into named logical steps', 'Database storage', 'Index performance'], correct: 1 },
    { question: 'What is the primary tool for diagnosing a slow SQL query?', options: ['COUNT(*)', 'EXPLAIN or EXPLAIN ANALYZE', 'SELECT *', 'GROUP BY'], correct: 1 },
    { question: 'What makes cloud data warehouses like Snowflake different from traditional databases?', options: ['They only support NoSQL', 'Columnar storage, massively parallel processing, and elastic scaling for analytical workloads', 'They are cheaper always', 'They require no SQL knowledge'], correct: 1 },
  ]},
  { chapterId: '853509f6-7709-4783-972d-47ee1f4c09b3', title: 'Module 3 Quiz: Python for Analytics', questions: [
    { question: 'What is a pandas DataFrame?', options: ['A Python loop structure', 'A two-dimensional tabular data structure with labeled axes — like a powerful spreadsheet you control with code', 'A visualization library', 'A machine learning model'], correct: 1 },
    { question: 'What is the most common quality issue in real-world data?', options: ['Too much data', 'Missing values, inconsistent formatting, and duplicate records', 'Data is always perfect', 'Too many columns'], correct: 1 },
    { question: 'What does the Pareto principle suggest for data visualization?', options: ['Show all data equally', 'Use bar charts for everything', 'Maximize data-ink ratio — maximize data, minimize decoration', 'Always use 3D charts'], correct: 2 },
    { question: 'What does vectorized operations in pandas mean?', options: ['Operations using vectors from geometry', 'Applying a function to every element simultaneously — much faster than Python loops', 'Using only numerical data', 'Compressing data files'], correct: 1 },
    { question: 'What statistical property enables hypothesis testing with non-normal data?', options: ['The law of large numbers', 'The central limit theorem — sample means are approximately normally distributed for large samples', 'Standard deviation', 'The Pareto principle'], correct: 1 },
  ]},
  { chapterId: 'ca7b8048-558e-4cfd-be35-63a1e04e6958', title: 'Module 4 Quiz: Data Visualization & BI', questions: [
    { question: 'What is DAX in Power BI?', options: ['A data storage format', 'Data Analysis Expressions — the formula language for Power BI calculations', 'A type of chart', 'A database connector'], correct: 1 },
    { question: 'What does the Kano model categorize?', options: ['Database performance', 'Requirements by their relationship to customer satisfaction: basic needs, performance needs, delighters', 'Data quality dimensions', 'Visualization types'], correct: 1 },
    { question: 'What is the data storytelling structure?', options: ['Introduction, body, conclusion', 'Setup (context), conflict (insight), resolution (recommendation)', 'Data, chart, table', 'Problem, solution, cost'], correct: 1 },
    { question: 'What is a self-service analytics semantic layer?', options: ['A type of chart template', 'A business-friendly data model that abstracts complexity and exposes metrics in business terms', 'A user interface for executives', 'A database backup system'], correct: 1 },
    { question: 'Which chart type should you AVOID for more than 4 categories?', options: ['Bar charts', 'Line charts', 'Pie charts — they are extremely difficult to read accurately', 'Scatter plots'], correct: 2 },
  ]},
  { chapterId: '0b47b444-103b-4280-b71b-dbc316905d18', title: 'Module 5 Quiz: Statistics & Probability', questions: [
    { question: 'What is the most important distinction in applied statistics?', options: ['Mean vs median', 'Correlation vs causation — correlated variables do not necessarily have a causal relationship', 'Sample vs population', 'Normal vs skewed distribution'], correct: 1 },
    { question: 'What does a p-value measure?', options: ['The effect size', 'The probability of observing results as extreme as yours if the null hypothesis were true', 'The sample size needed', 'The confidence interval width'], correct: 1 },
    { question: 'What distribution models the number of events in a fixed time interval?', options: ['Normal distribution', 'Binomial distribution', 'Poisson distribution', 'Exponential distribution'], correct: 2 },
    { question: 'What are the three components of time series decomposition?', options: ['Mean, median, mode', 'Trend, seasonality, and residual (plus cyclicality)', 'Input, process, output', 'Past, present, future'], correct: 1 },
    { question: 'What must be true about a time series before applying most forecasting methods?', options: ['It must be normally distributed', 'It must be stationary — constant mean, variance, and autocorrelation structure', 'It must have at least 1000 data points', 'It must show an upward trend'], correct: 1 },
  ]},
  { chapterId: '4104812e-69ab-410b-ba0d-c99c2e09a55d', title: 'Module 6 Quiz: Machine Learning', questions: [
    { question: 'What are the three types of machine learning?', options: ['Fast, medium, slow learning', 'Supervised, unsupervised, and reinforcement learning', 'Classification, regression, clustering', 'Training, validation, testing'], correct: 1 },
    { question: 'What is overfitting?', options: ['Training a model too quickly', 'When a model learns training data too well, capturing noise as signal, leading to poor generalization', 'Using too many features', 'Having too large a dataset'], correct: 1 },
    { question: 'What does AUC-ROC measure?', options: ['Model training speed', 'The model\'s ability to discriminate between classes across all probability thresholds', 'The number of features used', 'Prediction accuracy only'], correct: 1 },
    { question: 'What is feature engineering?', options: ['Building software features', 'Transforming raw data into informative input features for machine learning models', 'Engineering the model architecture', 'Creating training datasets from scratch'], correct: 1 },
    { question: 'What does AutoML automate?', options: ['Data collection only', 'Feature engineering, algorithm selection, hyperparameter tuning, and model evaluation', 'Only model deployment', 'Database design'], correct: 1 },
  ]},
  { chapterId: '2598dc21-e292-4bd7-bc72-4ab2464256a3', title: 'Module 7 Quiz: Analytics in Practice', questions: [
    { question: 'What is the CRISP-DM framework?', options: ['A Python library', 'Cross-Industry Standard Process for Data Mining — the most widely used analytics project methodology', 'A database design standard', 'A machine learning algorithm'], correct: 1 },
    { question: 'When communicating analytics to executives, what should you lead with?', options: ['Methodology and data sources', 'The key insight and recommendation — not the methodology', 'Statistical significance values', 'The full data exploration process'], correct: 1 },
    { question: 'What are the three lines of defense in analytics governance?', options: ['Developer, tester, deployer', 'Business operations (own risk), security/compliance (oversight), internal audit (assurance)', 'Data engineer, analyst, scientist', 'Collect, clean, analyze'], correct: 1 },
    { question: 'What does analytics ethics require regarding data minimization?', options: ['Collect as much data as possible', 'Collecting only the data necessary for the specific purpose', 'Share all data publicly', 'Store data indefinitely'], correct: 1 },
    { question: 'What is the most important portfolio project characteristic for analytics job seekers?', options: ['Using the most complex algorithms', 'Demonstrating the complete analytics workflow from data through business communication', 'Having the largest dataset', 'Using only Python'], correct: 1 },
  ]},
  { chapterId: 'f9b1e986-db52-4054-8c52-3f25c076d9c5', title: 'Module 8 Quiz: Analytics Career & Certification', questions: [
    { question: 'What does the Google Data Analytics Certificate primarily cover?', options: ['Advanced machine learning', 'Foundational analytics using Google\'s tool ecosystem: Sheets, BigQuery, Tableau, R', 'Database administration', 'Data engineering'], correct: 1 },
    { question: 'What is the most challenging aspect of PL-300 (Power BI) certification preparation?', options: ['Data connections', 'DAX — Data Analysis Expressions — especially evaluation context and filter context', 'Creating charts', 'Publishing reports'], correct: 1 },
    { question: 'Which analytics specialization focuses on funnel analysis, A/B testing, and retention?', options: ['Financial Analytics', 'Supply Chain Analytics', 'Product Analytics', 'People Analytics'], correct: 2 },
    { question: 'What is shifting analytics work as AI tools become more prevalent?', options: ['From strategic to mechanical work', 'From mechanical execution (queries, charts) to strategic activities (question framing, interpretation, communication)', 'From Python to SQL', 'From visualization to raw data'], correct: 1 },
    { question: 'What type of database stores high-dimensional vector representations for similarity search?', options: ['Relational databases', 'Document databases', 'Vector databases like Pinecone and Weaviate', 'Column-family databases'], correct: 2 },
  ]},

  // CYBERSECURITY
  { chapterId: '340d7b3e-adf1-41b5-9b9d-2f2d4adfffff', title: 'Module 1 Quiz: Cybersecurity Foundations', questions: [
    { question: 'What does the CIA Triad stand for?', options: ['Cyber Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Compliance, Investigation, Audit', 'Control, Identify, Assess'], correct: 1 },
    { question: 'Which threat actor type is motivated primarily by financial gain?', options: ['Nation-state actors', 'Hacktivists', 'Cybercriminals', 'Script kiddies'], correct: 2 },
    { question: 'What are the five functions of the NIST Cybersecurity Framework?', options: ['Plan, Do, Check, Act, Improve', 'Identify, Protect, Detect, Respond, Recover', 'Assess, Mitigate, Monitor, Report, Remediate', 'Prevent, Detect, Analyze, Contain, Eradicate'], correct: 1 },
    { question: 'What does the FAIR model help organizations calculate?', options: ['Network bandwidth requirements', 'Dollar estimates of cyber risk for comparing with security investment costs', 'Employee security training hours', 'Patch management timelines'], correct: 1 },
    { question: 'In security governance, what is the role of the third line of defense?', options: ['Business operations owning risk', 'Security and compliance oversight', 'Internal audit providing independent assurance', 'External regulators'], correct: 2 },
  ]},
  { chapterId: '7ddbc844-fd9e-447e-beb8-796563050805', title: 'Module 2 Quiz: Network Security', questions: [
    { question: 'What is the core principle of Zero Trust network architecture?', options: ['Trust everything inside the perimeter', 'Never trust, always verify — every connection request is authenticated regardless of source', 'Only verify external connections', 'Trust based on IP address'], correct: 1 },
    { question: 'What is the difference between IDS and IPS?', options: ['IDS is newer technology', 'IDS detects and alerts; IPS detects AND automatically blocks attacks', 'IPS only monitors; IDS blocks', 'They are identical'], correct: 1 },
    { question: 'What does a SIEM platform do?', options: ['Manages patch deployment', 'Collects security events from across the environment and correlates them to identify attack patterns', 'Stores backup data', 'Monitors employee productivity'], correct: 1 },
    { question: 'What is WPA3\'s key improvement over WPA2?', options: ['Faster speeds', 'Simultaneous Authentication of Equals providing stronger protection against offline dictionary attacks', 'Lower power consumption', 'Longer range'], correct: 1 },
    { question: 'What does AI-powered User Entity Behavior Analytics (UEBA) detect?', options: ['Network performance issues', 'Compromised accounts and insider threats by identifying deviations from user behavior baselines', 'Software bugs', 'Hardware failures'], correct: 1 },
  ]},
  { chapterId: '8abfd1f5-5304-49f6-930e-d1a4f3656141', title: 'Module 3 Quiz: Ethical Hacking', questions: [
    { question: 'What must precede every penetration test?', options: ['Installing Kali Linux', 'Explicit written authorization from the appropriate organizational authority', 'Notifying law enforcement', 'Running a vulnerability scan'], correct: 1 },
    { question: 'What is spear phishing?', options: ['Mass email phishing campaigns', 'Highly personalized phishing targeting specific individuals using research about the target', 'SMS-based phishing', 'Voice-based phishing'], correct: 1 },
    { question: 'What is lateral movement in a cyberattack?', options: ['Moving data to external storage', 'Exploiting trust relationships between systems to expand access from an initial compromise', 'Upgrading attacker tools', 'Deleting log files'], correct: 1 },
    { question: 'What is the Mimikatz tool used for during post-exploitation?', options: ['Network scanning', 'Credential harvesting — extracting plaintext passwords and Kerberos tickets from Windows memory', 'Web application testing', 'Firewall bypass'], correct: 1 },
    { question: 'What is the single most effective technical control for limiting phishing impact?', options: ['Spam filtering alone', 'Multi-factor authentication — even if a password is stolen, MFA prevents its use', 'Security awareness training alone', 'Email encryption'], correct: 1 },
  ]},
  { chapterId: '8e40f678-fb9b-4514-84c1-ccb6b5661470', title: 'Module 4 Quiz: Identity & Access Management', questions: [
    { question: 'Which MFA factor provides the STRONGEST authentication?', options: ['SMS one-time passwords', 'Authenticator apps', 'Hardware security keys like YubiKey', 'Biometrics alone'], correct: 2 },
    { question: 'What is Role-Based Access Control (RBAC)?', options: ['Access based on user location', 'Assigning permissions to roles and assigning users to roles rather than individual permission grants', 'Access granted automatically on hire', 'Time-based access control'], correct: 1 },
    { question: 'What is Just-In-Time (JIT) privileged access?', options: ['Fast user provisioning', 'Granting elevated privileges only when needed and for limited durations, then removing them', 'Permanent admin accounts', 'Automated password rotation'], correct: 1 },
    { question: 'What does Conditional Access in Zero Trust evaluate?', options: ['Only username and password', 'Identity, device health, location, and risk score to make access decisions', 'Network perimeter location only', 'Job title and department'], correct: 1 },
    { question: 'What is the leaver process in identity lifecycle management?', options: ['Onboarding new employees', 'Immediately revoking all access when someone leaves the organization', 'Adjusting access when someone changes roles', 'Password reset procedures'], correct: 1 },
  ]},
  { chapterId: '2ad6fa2d-5c7e-4f26-b625-9814012c6ce5', title: 'Module 5 Quiz: Cloud Security', questions: [
    { question: 'In IaaS, who is responsible for securing the guest operating system?', options: ['The cloud provider', 'The customer', 'A shared responsibility equally', 'The ISP'], correct: 1 },
    { question: 'What is the most common cause of cloud security failures?', options: ['Cloud provider breaches', 'Customer misconfigurations — misconfigured storage, overly permissive IAM, unencrypted data', 'DDoS attacks', 'Hardware failures'], correct: 1 },
    { question: 'What does AWS GuardDuty do?', options: ['Manages SSL certificates', 'Continuously monitors AWS accounts for malicious activity using ML and threat intelligence', 'Provides DNS services', 'Manages EC2 auto-scaling'], correct: 1 },
    { question: 'What is DevSecOps?', options: ['A development methodology without security', 'Integrating security into the software development lifecycle from the beginning', 'Security testing only at release', 'A separate security team that reviews code monthly'], correct: 1 },
    { question: 'What does SAST analyze?', options: ['Running applications by simulating attacks', 'Source code for security vulnerabilities without executing it', 'Network traffic patterns', 'Server configuration files'], correct: 1 },
  ]},
  { chapterId: 'b78c7933-1514-4b2b-b292-f15dbf64077d', title: 'Module 6 Quiz: Incident Response', questions: [
    { question: 'What are the four phases of the NIST incident response lifecycle?', options: ['Identify, contain, eradicate, close', 'Preparation, Detection/Analysis, Containment/Eradication/Recovery, Post-Incident Activity', 'Alert, escalate, resolve, document', 'Plan, detect, respond, report'], correct: 1 },
    { question: 'What is the chain of custody in digital forensics?', options: ['The list of suspects', 'Documentation of every person who handles evidence and every action taken — ensuring admissibility', 'The evidence storage location', 'The forensic tool used'], correct: 1 },
    { question: 'What is the MITRE ATT&CK framework used for?', options: ['Network monitoring', 'Organizing threat intelligence about adversary tactics, techniques, and procedures', 'Patch management', 'User access control'], correct: 1 },
    { question: 'What is a blameless postmortem?', options: ['A postmortem that ignores the incident', 'An incident analysis focused on system and process failures rather than individual blame', 'A quick 5-minute debrief', 'A legal document'], correct: 1 },
    { question: 'What does SOAR stand for in cybersecurity?', options: ['Security Operations and Response', 'Security Orchestration, Automation, and Response', 'System Operations, Alerting, and Remediation', 'Secure Operations and Risk'], correct: 1 },
  ]},
  { chapterId: 'ecacdc23-9c3f-48e9-9b57-22d7b7a7e473', title: 'Module 7 Quiz: Application Security', questions: [
    { question: 'What is the #1 OWASP Top 10 risk?', options: ['SQL Injection', 'Broken Access Control', 'Cryptographic Failures', 'Security Misconfiguration'], correct: 1 },
    { question: 'What prevents SQL injection in application code?', options: ['Input length limits', 'Parameterized queries (prepared statements) that separate query structure from data', 'Encrypting the database', 'Using a firewall'], correct: 1 },
    { question: 'What is the most important API security risk according to OWASP API Top 10?', options: ['Rate limiting absence', 'Broken Object Level Authorization — failing to verify user access to specific objects', 'Missing API documentation', 'Slow response times'], correct: 1 },
    { question: 'What does threat modeling during design phase prevent?', options: ['Performance issues', 'Security vulnerabilities from being built into systems rather than retrofitting security later', 'Budget overruns', 'Scope creep'], correct: 1 },
    { question: 'What does SCA (Software Composition Analysis) identify?', options: ['Performance bottlenecks', 'Known vulnerabilities in open source dependencies used in the application', 'Database schema issues', 'UI design problems'], correct: 1 },
  ]},
  { chapterId: '16a91f7c-784b-42f1-a114-4bf82c023087', title: 'Module 8 Quiz: Cybersecurity Career', questions: [
    { question: 'What is the CompTIA Security+ passing threshold?', options: ['70%', '75% correct answers', 'A scaled score of 750 out of 900', 'Any score above 600'], correct: 2 },
    { question: 'What mindset does the CISSP exam require?', options: ['Deep technical implementation focus', 'Managerial and executive thinking — prioritizing business protection over technical perfection', 'Entry-level practitioner perspective', 'Pure compliance focus'], correct: 1 },
    { question: 'What is the primary entry point into cybersecurity careers?', options: ['Penetration testing', 'Security Operations Center (SOC) analyst roles', 'CISO roles', 'Security engineering'], correct: 1 },
    { question: 'What platforms provide legal penetration testing practice for portfolio building?', options: ['Production company systems', 'HackTheBox, TryHackMe, and PicoCTF', 'Any public website', 'Government systems'], correct: 1 },
    { question: 'What is the key way AI is making cyberattacks more dangerous?', options: ['Faster computers only', 'AI enables more convincing phishing, deepfakes, AI-assisted vulnerability discovery, and adaptive malware', 'Better network speeds', 'Cheaper hardware'], correct: 1 },
  ]},

  // SOLUTION ARCHITECT
  { chapterId: '09adc7cb-fde5-4895-8987-032931063d47', title: 'Module 1 Quiz: Architecture Foundations', questions: [
    { question: 'What distinguishes an architect\'s mindset from a developer\'s mindset?', options: ['Architects write more code', 'Architects optimize for quality at scale over time; developers optimize for making features work correctly', 'Developers have more responsibility', 'Architects do not communicate with stakeholders'], correct: 1 },
    { question: 'What does the C4 model stand for?', options: ['Cloud, Container, Component, Code', 'Context, Containers, Components, Code', 'Capability, Capacity, Compliance, Cost', 'Compute, Cache, CDN, Control'], correct: 1 },
    { question: 'What is an Architecture Decision Record (ADR)?', options: ['A deployment log', 'A document recording architectural decisions with context, options considered, and rationale', 'A project status report', 'A code review checklist'], correct: 1 },
    { question: 'What does the "fail secure" security principle mean?', options: ['Fail as quickly as possible', 'When a component fails, it fails to a secure (deny) state rather than a permissive state', 'Security systems never fail', 'Fail gracefully with user messages'], correct: 1 },
    { question: 'What does availability of 99.99% translate to in annual downtime?', options: ['About 87 hours', 'About 8.7 hours', 'About 52 minutes', 'About 5 minutes'], correct: 2 },
  ]},
  { chapterId: '653088bf-45d2-4940-bfe8-027a2df08f86', title: 'Module 2 Quiz: AWS Architecture', questions: [
    { question: 'What are the six pillars of the AWS Well-Architected Framework?', options: ['Compute, Storage, Network, Security, Cost, Scale', 'Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability', 'IAM, VPC, EC2, S3, RDS, Lambda', 'Plan, Design, Build, Test, Deploy, Monitor'], correct: 1 },
    { question: 'What is the difference between RDS Multi-AZ and Read Replicas?', options: ['They are identical', 'Multi-AZ provides high availability via automatic failover; Read Replicas improve read performance and scale', 'Read Replicas are for writes; Multi-AZ for reads', 'Multi-AZ is cheaper'], correct: 1 },
    { question: 'What is the Recovery Time Objective (RTO)?', options: ['The maximum acceptable data loss measured in time', 'The maximum acceptable time to restore service after a failure', 'The time to deploy a new feature', 'The monthly uptime percentage'], correct: 1 },
    { question: 'What does the active-active disaster recovery pattern provide?', options: ['The lowest cost DR option', 'Near-instant failover by running workloads simultaneously in multiple regions', 'Only backup storage', 'Single region protection'], correct: 1 },
    { question: 'What service does AWS CloudFront provide?', options: ['Database hosting', 'Content delivery network — caching assets at edge locations globally to reduce latency', 'Identity management', 'Container orchestration'], correct: 1 },
  ]},
  { chapterId: 'd77a22fb-6f3b-4c5e-917e-89f1a8f548da', title: 'Module 3 Quiz: Microservices', questions: [
    { question: 'What is the database-per-service pattern in microservices?', options: ['All services share one database', 'Each service owns its data and exposes it only through its API — enabling independent deployment', 'Services use only NoSQL', 'The database is managed by a central team'], correct: 1 },
    { question: 'What does the circuit breaker pattern do?', options: ['Cuts power to servers', 'Detects when a downstream service is failing and fails fast for subsequent requests — preventing cascading failures', 'Encrypts service communication', 'Routes traffic between services'], correct: 1 },
    { question: 'What is Conway\'s Law?', options: ['Security must be built in from the start', 'Organizations design systems that mirror their communication structures', 'Microservices must be under 1000 lines of code', 'APIs must be RESTful'], correct: 1 },
    { question: 'What does a service mesh like Istio provide?', options: ['Application business logic', 'Networking infrastructure (service discovery, mTLS, load balancing, observability) without requiring it in each service', 'Database connection pooling', 'Frontend routing'], correct: 1 },
    { question: 'What is the Saga pattern used for?', options: ['Service discovery', 'Managing data consistency across multiple services using local transactions and compensating transactions', 'API rate limiting', 'Log aggregation'], correct: 1 },
  ]},
  { chapterId: '20d586b5-1b24-4838-8bde-fd2bf45917e6', title: 'Module 4 Quiz: Data Architecture', questions: [
    { question: 'What is database sharding?', options: ['Backing up databases', 'Horizontally partitioning a database across multiple servers to scale beyond single-server limits', 'Compressing database files', 'Encrypting database columns'], correct: 1 },
    { question: 'What type of database is best for social networks and fraud detection?', options: ['Relational databases', 'Key-value stores', 'Column-family databases', 'Graph databases'], correct: 3 },
    { question: 'What is the LRU cache eviction policy?', options: ['Least Recently Used — evicts items not accessed for the longest time', 'Largest Recently Updated', 'Last Read Unchanged', 'Least Required Units'], correct: 0 },
    { question: 'What are the four principles of data mesh?', options: ['Collect, store, process, serve', 'Domain ownership, data as a product, self-serve infrastructure, federated governance', 'Ingest, transform, load, visualize', 'Create, read, update, delete'], correct: 1 },
    { question: 'What do vector databases like Pinecone enable?', options: ['Faster SQL queries', 'Storing high-dimensional vector representations for similarity search — fundamental to AI/ML applications', 'Real-time transaction processing', 'Graph traversal queries'], correct: 1 },
  ]},
  { chapterId: '59e62a5d-e4f1-40ed-8f7a-5af6877c086d', title: 'Module 5 Quiz: Security Architecture', questions: [
    { question: 'What is defense in depth?', options: ['Having the deepest firewall rules', 'Multiple independent layers of security so failure in any single layer does not result in complete security failure', 'Very complex security policies', 'Only network-level security'], correct: 1 },
    { question: 'What is the principle of least privilege in security architecture?', options: ['Users have the minimum access required for their legitimate functions', 'All users have read-only access', 'Admins have all access', 'Access is granted based on seniority'], correct: 0 },
    { question: 'What does mTLS (mutual TLS) authenticate?', options: ['Only the server to the client', 'Both the client and the server to each other — strongest service-to-service authentication', 'Only SSL certificates', 'User passwords'], correct: 1 },
    { question: 'What is GDPR\'s breach notification requirement?', options: ['30 days', '7 days', '72 hours', '24 hours'], correct: 2 },
    { question: 'What does data tokenization protect?', options: ['Network traffic', 'Sensitive data like payment card numbers by replacing them with non-sensitive tokens', 'Server passwords', 'API endpoints'], correct: 1 },
  ]},
  { chapterId: 'a4ff6d37-39e5-4467-98dc-cf9a14518938', title: 'Module 6 Quiz: Performance Architecture', questions: [
    { question: 'What does Amdahl\'s Law quantify?', options: ['Database query speed', 'The maximum speedup from parallelization — limited by the fraction that must remain sequential', 'Network bandwidth requirements', 'Memory allocation efficiency'], correct: 1 },
    { question: 'What is the "knee of the curve" in load testing?', options: ['The point where costs exceed budget', 'The load level where performance begins to degrade', 'The maximum number of users', 'The test failure threshold'], correct: 1 },
    { question: 'What are Core Web Vitals?', options: ['Server CPU metrics', 'Google\'s user experience metrics: LCP (loading), FID (interactivity), CLS (visual stability)', 'Database performance indicators', 'Network latency measurements'], correct: 1 },
    { question: 'What does horizontal scaling require that vertical scaling does not?', options: ['More expensive hardware', 'Stateless components — each instance must handle any request without depending on local state', 'Database changes', 'Load balancers only'], correct: 1 },
    { question: 'What is the purpose of a CDN (Content Delivery Network)?', options: ['Database replication', 'Serving static assets from edge servers geographically close to users, reducing latency', 'Application monitoring', 'Code deployment'], correct: 1 },
  ]},
  { chapterId: '4fe53a3b-c2b4-44e7-886b-a151a4f9ee40', title: 'Module 7 Quiz: Modern Architecture Patterns', questions: [
    { question: 'What is the key advantage of serverless architecture?', options: ['Unlimited execution time', 'No server provisioning — the provider allocates resources dynamically and you pay only for compute used', 'Better security always', 'Faster execution always'], correct: 1 },
    { question: 'What is a cold start in serverless?', options: ['A server in a cold data center', 'Latency when a function is invoked after inactivity — the platform must provision a new execution environment', 'A failed deployment', 'A cache miss'], correct: 1 },
    { question: 'What is an Internal Developer Platform (IDP)?', options: ['An internal app store', 'A product built by platform engineering teams enabling developers to self-serve infrastructure without deep expertise', 'A developer training program', 'An internal code review tool'], correct: 1 },
    { question: 'What is the "golden path" in platform engineering?', options: ['The fastest deployment route', 'The platform-prescribed, supported, optimized way to build and deploy services with sensible defaults', 'The most expensive infrastructure option', 'The path for senior engineers only'], correct: 1 },
    { question: 'What is CQRS?', options: ['A cloud provider', 'Command Query Responsibility Segregation — separating the read model from the write model for different optimizations', 'A container runtime', 'A security framework'], correct: 1 },
  ]},
  { chapterId: '1f925b90-f736-4ced-8f40-0df76fe06a4f', title: 'Module 8 Quiz: Architecture Career', questions: [
    { question: 'What does the AWS SAA-C03 exam test?', options: ['AWS billing management', 'Designing cost-effective, performant, secure, and operationally excellent solutions on AWS', 'AWS customer support', 'AWS marketing tools'], correct: 1 },
    { question: 'What is TOGAF primarily used for?', options: ['Network security', 'Enterprise architecture development, governance, and management framework', 'DevOps automation', 'Database design'], correct: 1 },
    { question: 'What distinguishes an Architecture Decision Record from a design document?', options: ['ADRs are longer', 'ADRs specifically record the context, options considered, decision made, and rationale — creating institutional memory', 'Design documents are more formal', 'They are the same thing'], correct: 1 },
    { question: 'As architects advance in career, what becomes MORE important relative to technical skills?', options: ['Coding speed', 'Communication, stakeholder management, and organizational influence capabilities', 'Learning new programming languages', 'Infrastructure management'], correct: 1 },
    { question: 'What is sustainable architecture focused on?', options: ['Long-lived codebases only', 'Minimizing energy consumption and carbon emissions while meeting functional requirements', 'Low-cost infrastructure only', 'Open source only'], correct: 1 },
  ]},

  // DEVOPS
  { chapterId: 'f753ef14-bd0f-4e8a-91d9-f1c5a50dd5d2', title: 'Module 1 Quiz: DevOps Foundations', questions: [
    { question: 'What does DORA stand for?', options: ['DevOps Operations Research Agency', 'DevOps Research and Assessment — the team behind key DevOps performance research', 'Deployment Operations Reliability Analytics', 'Docker Operations Registry Architecture'], correct: 1 },
    { question: 'What are the four DORA metrics?', options: ['Speed, Quality, Safety, Cost', 'Deployment Frequency, Lead Time for Changes, Change Failure Rate, Mean Time to Recovery', 'Commits, Builds, Tests, Deployments', 'Planning, Coding, Testing, Releasing'], correct: 1 },
    { question: 'What is Continuous Integration?', options: ['Integrating with third-party services', 'Frequently merging developer code changes into a shared repository with automatic build and test on every merge', 'Monthly release cycles', 'Integration testing only'], correct: 1 },
    { question: 'What is the difference between Continuous Delivery and Continuous Deployment?', options: ['They are identical', 'Continuous Delivery keeps software deployable with human approval to deploy; Continuous Deployment also automates the production deployment', 'Continuous Deployment requires more testing', 'Continuous Delivery is faster'], correct: 1 },
    { question: 'What does trunk-based development require?', options: ['Long-lived feature branches', 'All developers work on a single main branch with short-lived branches — enabling true Continuous Integration', 'Separate release branches for each version', 'Monthly merges to main'], correct: 1 },
  ]},
  { chapterId: 'f58333ea-9746-41a3-9532-417efddafa6f', title: 'Module 2 Quiz: Docker', questions: [
    { question: 'What is the key benefit of multi-stage Docker builds?', options: ['Faster internet speeds', 'Separating build dependencies from runtime — producing much smaller, more secure production images', 'Enabling parallel container execution', 'Automatic security scanning'], correct: 1 },
    { question: 'What is the recommended method for persisting container data beyond container lifecycle?', options: ['Storing in container filesystem', 'Docker Volumes — managed by Docker and persisting independently of containers', 'Environment variables', 'Bind mounts only'], correct: 1 },
    { question: 'What security practice should ALWAYS be followed with Docker images?', options: ['Use the latest tag for all images', 'Scan images for vulnerabilities AND run as non-root users', 'Store secrets in environment variables', 'Use only public images'], correct: 1 },
    { question: 'What is Docker layer caching?', options: ['Storing container logs', 'Reusing previously built layers when dependencies have not changed — dramatically speeding up builds', 'A security feature', 'Network traffic caching'], correct: 1 },
    { question: 'What should you NEVER do with secrets in Docker images?', options: ['Use Docker secrets', 'Include secrets in the image via ENV, COPY, or RUN commands — they become part of the image layer', 'Use external secrets managers', 'Inject secrets at runtime'], correct: 1 },
  ]},
  { chapterId: '1238b5fb-b455-4999-8181-f0c754032d0b', title: 'Module 3 Quiz: Kubernetes', questions: [
    { question: 'What is the role of etcd in Kubernetes?', options: ['Running containers', 'The distributed key-value store that holds the entire cluster state', 'Network routing', 'Container image storage'], correct: 1 },
    { question: 'What is the difference between a Deployment and a StatefulSet?', options: ['They are identical', 'Deployments manage stateless workloads; StatefulSets manage stateful workloads requiring stable identity and persistent storage', 'StatefulSets are faster', 'Deployments are for databases'], correct: 1 },
    { question: 'What does a Kubernetes Network Policy do?', options: ['Configures DNS', 'Controls traffic flow between pods — implementing least-privilege network access within the cluster', 'Manages storage allocation', 'Handles SSL certificates'], correct: 1 },
    { question: 'What is the Restricted Pod Security Standard?', options: ['The least restrictive option', 'The most security-hardened profile: no root users, no privilege escalation, read-only root filesystem', 'Only for privileged workloads', 'An optional configuration'], correct: 1 },
    { question: 'What does the Cluster Autoscaler do?', options: ['Scales application pods horizontally', 'Automatically adds or removes cluster nodes based on pod scheduling requirements and utilization', 'Manages container images', 'Updates Kubernetes versions'], correct: 1 },
  ]},
  { chapterId: '02e6e40d-f584-4ff3-a63a-8764c5867bf6', title: 'Module 4 Quiz: Infrastructure as Code', questions: [
    { question: 'What is the purpose of Terraform state?', options: ['Storing code history', 'Terraform\'s record mapping configuration to real-world infrastructure — enabling it to know what exists and what to change', 'A backup mechanism', 'Deployment logs'], correct: 1 },
    { question: 'What does terraform plan do?', options: ['Creates infrastructure immediately', 'Shows what changes Terraform will make to bring infrastructure into alignment with configuration — without making changes', 'Deletes all resources', 'Validates HCL syntax only'], correct: 1 },
    { question: 'What is Ansible\'s key advantage over Terraform for configuration management?', options: ['Terraform cannot manage cloud resources', 'Ansible configures WHAT runs on infrastructure (OS, apps, config); Terraform provisions the infrastructure itself', 'Ansible is faster always', 'Ansible supports more cloud providers'], correct: 1 },
    { question: 'What is GitOps?', options: ['Using Git for code versioning only', 'Using Git as the single source of truth for declarative infrastructure state — with automated reconciliation to match desired state', 'A Git branching strategy', 'GitHub-specific DevOps practices'], correct: 1 },
    { question: 'What advantage does Pulumi offer over Terraform HCL?', options: ['Lower cost', 'Infrastructure defined in general-purpose programming languages (TypeScript, Python, Go) — enabling full language capabilities', 'Better cloud support', 'Faster execution always'], correct: 1 },
  ]},
  { chapterId: 'fd2c3b41-207a-470a-8cf4-c71add177323', title: 'Module 5 Quiz: CI/CD Pipelines', questions: [
    { question: 'What is a blue-green deployment?', options: ['A deployment strategy using blue and green environments with instant traffic switching', 'A Docker networking configuration', 'A Kubernetes deployment type', 'A Git branching strategy'], correct: 0 },
    { question: 'What is the testing pyramid\'s recommendation for unit tests?', options: ['Minimize unit tests — they are too slow', 'Unit tests should form the base — they run in milliseconds and provide precise, fast feedback', 'Only end-to-end tests matter', 'Unit tests replace integration tests'], correct: 1 },
    { question: 'What does SAST do in DevSecOps pipelines?', options: ['Tests running applications by simulating attacks', 'Analyzes source code for security vulnerabilities without executing it — at commit time', 'Scans container images', 'Monitors production systems'], correct: 1 },
    { question: 'What is the goal for CI pipeline execution time?', options: ['Under 1 hour', 'Under 30 minutes', 'Under 10 minutes to provide prompt feedback to developers', 'Time does not matter'], correct: 2 },
    { question: 'What are flaky tests?', options: ['Tests that always fail', 'Tests that sometimes pass and sometimes fail without code changes — undermining pipeline reliability', 'Tests that are too slow', 'Tests without assertions'], correct: 1 },
  ]},
  { chapterId: '3a81323c-59ff-454e-8337-235c0fb91c0d', title: 'Module 6 Quiz: Cloud Platforms & SRE', questions: [
    { question: 'What is a Service Level Objective (SLO)?', options: ['A vendor contract term', 'A target level of reliability for a service measured over a rolling time window', 'A team performance metric', 'A deployment frequency goal'], correct: 1 },
    { question: 'What is an error budget?', options: ['The cost of production incidents', 'The allowed unreliability derived from the SLO — spent by failures and replenished over time', 'The QA team\'s test budget', 'Infrastructure cost allocation'], correct: 1 },
    { question: 'What is toil in SRE practice?', options: ['Hard, important work', 'Manual, repetitive, automatable operational work that grows proportionally with service scale', 'Emergency incident response', 'Technical debt'], correct: 1 },
    { question: 'What are the three pillars of observability?', options: ['Monitoring, alerting, dashboards', 'Metrics, logs, and distributed traces', 'CPU, memory, network', 'Availability, performance, security'], correct: 1 },
    { question: 'What does OpenTelemetry provide?', options: ['A monitoring vendor platform', 'Vendor-neutral SDKs for producing metrics, logs, and traces that can be sent to any compatible backend', 'A specific alerting tool', 'A cloud provider service'], correct: 1 },
  ]},
  { chapterId: 'd18459b0-cfcf-4bf6-804b-4952c01272bd', title: 'Module 7 Quiz: Platform Engineering at Scale', questions: [
    { question: 'What does a service mesh implement in the network layer?', options: ['Application business logic', 'Service discovery, mTLS, load balancing, and observability without requiring each service to implement these', 'Database connection management', 'User authentication'], correct: 1 },
    { question: 'What is FinOps?', options: ['Financial software for accounting', 'A financial operating model bringing accountability to cloud variable spend through visibility, optimization, and culture', 'Finance department DevOps tools', 'Cloud billing alerts only'], correct: 1 },
    { question: 'What does Team Topologies recommend for minimizing cognitive load?', options: ['Large teams for all work', 'Organizing teams around stream-aligned, platform, enabling, and complicated-subsystem types to optimize flow', 'Having one large DevOps team', 'Outsourcing all operations'], correct: 1 },
    { question: 'What is the expand-contract pattern for database migrations?', options: ['Expanding the database size', 'Expand adds new structure, application migrates to use it, contract removes old structure — enabling zero-downtime schema changes', 'Adding more database nodes', 'A backup and restore strategy'], correct: 1 },
    { question: 'What are spot instances best used for?', options: ['Production databases', 'Fault-tolerant, flexible workloads where interruption is acceptable — providing up to 90% cost savings', 'Customer-facing web servers', 'Stateful applications'], correct: 1 },
  ]},
  { chapterId: 'f0260730-00d5-477c-bb46-13dc264d1884', title: 'Module 8 Quiz: DevOps Career & Certifications', questions: [
    { question: 'What type of exam is the CKA (Certified Kubernetes Administrator)?', options: ['Multiple choice questions', 'A performance-based exam where you complete real tasks on live Kubernetes clusters', 'An open book exam', 'An essay exam'], correct: 1 },
    { question: 'What does the AWS DevOps Engineer Professional exam cover?', options: ['AWS sales and pricing', 'SDLC automation, IaC, resilient cloud solutions, monitoring, incident response, security', 'AWS support procedures', 'AWS marketing strategy'], correct: 1 },
    { question: 'What is Platform Engineering\'s primary focus?', options: ['Writing application code', 'Building internal developer platforms as products that enable teams to self-serve infrastructure', 'Managing vendor contracts', 'Network administration'], correct: 1 },
    { question: 'What is the future impact of WebAssembly (WASM) on DevOps?', options: ['No impact expected', 'A lightweight alternative to containers with millisecond startup times for serverless and edge computing', 'Replacing all containers', 'Only for web browsers'], correct: 1 },
    { question: 'What characterizes elite DevOps performers in deployment frequency?', options: ['Monthly releases', 'Weekly releases', 'Multiple deployments per day', 'Quarterly releases'], correct: 2 },
  ]},

  // BUSINESS ANALYSIS
  { chapterId: 'be88f7b7-b501-42f2-847f-c3c3d59ace9a', title: 'Module 1 Quiz: BA Foundations', questions: [
    { question: 'What is the primary role of a Business Analyst?', options: ['Write application code', 'Bridge the gap between business problems and technology solutions by defining needs and recommending solutions', 'Manage project schedules', 'Test software applications'], correct: 1 },
    { question: 'What does BABOK stand for?', options: ['Business Analytics Best Operating Knowledge', 'Business Analysis Body of Knowledge — the IIBA\'s comprehensive BA framework', 'Business Architect Business Operations Kit', 'Baseline Analysis Business Object Knowledge'], correct: 1 },
    { question: 'What are the six BABOK knowledge areas?', options: ['Elicit, analyze, document, validate, implement, test', 'BA Planning, Elicitation, Requirements Analysis, Strategy Analysis, Requirements Life Cycle, Solution Evaluation', 'Scope, schedule, cost, risk, quality, procurement', 'Initiate, plan, execute, monitor, control, close'], correct: 1 },
    { question: 'What does AI-assisted requirements documentation primarily do for BAs?', options: ['Replaces the BA role entirely', 'Takes rough notes and generates structured requirements drafts, shifting BA time to validation and refinement', 'Creates final approved documents automatically', 'Conducts stakeholder interviews'], correct: 1 },
    { question: 'What is the most important BA core competency?', options: ['Technical coding skills', 'Communication — adapting style and vocabulary for business, technical, executive, and user audiences', 'Database design', 'Project scheduling'], correct: 1 },
  ]},
  { chapterId: 'e93b3558-9519-48e9-ae07-4d95eb65f73d', title: 'Module 2 Quiz: Elicitation & Requirements', questions: [
    { question: 'Which elicitation technique is MOST efficient for diverse stakeholder groups?', options: ['Individual interviews only', 'Document analysis', 'Structured workshops — producing more in 1–2 days than weeks of individual interviews', 'Email surveys'], correct: 2 },
    { question: 'What is the key limitation of self-reported requirements from users?', options: ['Users always know exactly what they want', 'Users often cannot accurately describe habitual workflows — observation reveals what they cannot articulate', 'Users overestimate their needs', 'Users only focus on technical details'], correct: 1 },
    { question: 'What is the INVEST criteria for user stories?', options: ['Important, Needed, Verified, Estimated, Scoped, Tested', 'Independent, Negotiable, Valuable, Estimable, Small, Testable', 'Informative, New, Validated, Easy, Simple, Trackable', 'Identified, Named, Valuable, Efficient, Specific, Technical'], correct: 1 },
    { question: 'What makes a requirement ambiguous and therefore low quality?', options: ['Being too specific', 'Using vague language like "user-friendly" or "fast" that means different things to different people', 'Having multiple acceptance criteria', 'Being written in business language'], correct: 1 },
    { question: 'What does a requirements traceability matrix link?', options: ['Team members to tasks', 'Business objectives to requirements to solution features to test cases', 'Requirements to developers', 'User stories to sprints'], correct: 1 },
  ]},
  { chapterId: '208a0f38-0cf0-4cfd-838c-db3dc8d66f9a', title: 'Module 3 Quiz: Process Analysis & Modeling', questions: [
    { question: 'What is BPMN?', options: ['Business Project Management Notation', 'Business Process Model and Notation — the international standard for process modeling', 'Business Performance Metrics Network', 'Basic Process Mapping Notation'], correct: 1 },
    { question: 'What do swimlane diagrams show?', options: ['Swimming competition results', 'Which role or system is responsible for each activity — making handoff points visible', 'Data flow only', 'System architecture'], correct: 1 },
    { question: 'What are the eight types of Lean waste?', options: ['Cost, time, quality, resources, space, energy, personnel, equipment', 'Defects, overproduction, waiting, non-utilized talent, transportation, inventory, motion, extra processing', 'Planning, design, development, testing, deployment, maintenance, support, retirement', 'Input, process, output, feedback, control, environment, stakeholders, goals'], correct: 1 },
    { question: 'What does process mining use to discover actual process execution?', options: ['Interviews and workshops', 'System event logs analyzed by AI to reveal how processes actually execute versus how they are documented', 'Manual observation only', 'Organizational charts'], correct: 1 },
    { question: 'What is the purpose of a data dictionary?', options: ['A glossary of business terms', 'Defining the meaning, format, source, and business rules for each data element in the system', 'An index of database tables', 'A list of data quality issues'], correct: 1 },
  ]},
  { chapterId: '5fbc93a5-9bca-498f-a593-cd5e6cd2133b', title: 'Module 4 Quiz: Agile Business Analysis', questions: [
    { question: 'What are the two most common BA roles in agile environments?', options: ['Developer and tester', 'BA as Product Owner OR BA as dedicated team member supporting the Product Owner', 'Scrum Master and BA', 'BA and project manager'], correct: 1 },
    { question: 'What are the two axes of a user story map?', options: ['Effort and value', 'Horizontal: user journey sequence; Vertical: depth of functionality (minimum viable to complete)', 'Priority and size', 'Business value and technical complexity'], correct: 1 },
    { question: 'What does ATDD stand for?', options: ['Agile Test-Driven Development', 'Acceptance Test-Driven Development — defining acceptance tests before implementation begins', 'Automated Test Design Documentation', 'Advanced Technical Design Discipline'], correct: 1 },
    { question: 'What is the Gherkin syntax format?', options: ['User story format', 'Given-When-Then — a structured natural language format for acceptance criteria that can be automated as tests', 'A database query language', 'A UML diagram notation'], correct: 1 },
    { question: 'What does SAFe\'s benefit hypothesis capture?', options: ['Financial projections only', 'Why a feature creates value — the business outcome it is expected to deliver', 'Technical implementation details', 'Team velocity assumptions'], correct: 1 },
  ]},
  { chapterId: '2e05ce4b-46ff-44af-9e27-64a041ee6927', title: 'Module 5 Quiz: Solution Design & Evaluation', questions: [
    { question: 'What is the most common problem framing mistake?', options: ['Making the problem too broad', 'Proposing a solution in the problem statement instead of describing the actual business problem', 'Not involving enough stakeholders', 'Skipping root cause analysis'], correct: 1 },
    { question: 'What does the five whys technique accomplish?', options: ['Generates five solution options', 'Drills down to root cause by repeatedly asking why — preventing solutions that only address symptoms', 'Identifies five key stakeholders', 'Creates five acceptance criteria'], correct: 1 },
    { question: 'In solution options analysis, what should evaluation criteria be established BEFORE?', options: ['Before the project starts', 'Before issuing the RFP/RFQ — establishing criteria after receiving proposals creates bias', 'Before budget approval', 'Before stakeholder identification'], correct: 1 },
    { question: 'What is the MoSCoW rule of thumb for Must Have requirements?', options: ['Must Haves should be 90% of total effort', 'Must Haves should represent no more than 60% of total effort to maintain meaningful prioritization', 'All requirements are Must Haves', 'Must Haves are only regulatory requirements'], correct: 1 },
    { question: 'What does UAT (User Acceptance Testing) validate?', options: ['Technical performance only', 'Business fitness — that the solution supports real work effectively, distinct from technical quality control', 'Security vulnerabilities', 'Code quality metrics'], correct: 1 },
  ]},
  { chapterId: '53dc66de-e1ff-48f2-ab51-f348db0b8afd', title: 'Module 6 Quiz: Data Analysis for BAs', questions: [
    { question: 'What SQL technique do BAs use to understand a new data source?', options: ['DELETE FROM tables', 'SELECT DISTINCT, COUNT with GROUP BY, MIN/MAX/AVG to explore data distributions and content', 'Creating stored procedures', 'Index optimization'], correct: 1 },
    { question: 'What is the requirements defect discovery cost principle?', options: ['All defects cost the same to fix', 'Defects discovered during requirements review cost much less than those found in development or testing', 'Testing phase defects are cheapest to fix', 'Production defects are cheapest to fix'], correct: 1 },
    { question: 'What does requirements volatility measure?', options: ['How well requirements are written', 'How frequently requirements change after baseline — indicating either immature elicitation or a changing business environment', 'The number of requirements', 'Stakeholder satisfaction with requirements'], correct: 1 },
    { question: 'What does AI-powered exploratory data analysis generate automatically?', options: ['Final business recommendations', 'Comprehensive dataset summaries — distributions, correlations, anomalies, quality issues — in seconds', 'Database schema designs', 'Code for data pipelines'], correct: 1 },
    { question: 'What does process mining reveal that traditional process documentation cannot?', options: ['Organizational charts', 'How processes actually execute in systems versus how they are documented — revealing real deviations and bottlenecks', 'Budget allocations', 'Project timelines'], correct: 1 },
  ]},
  { chapterId: 'e6d76dcf-0f6d-4530-b4e0-c3be8d56cf1a', title: 'Module 7 Quiz: Advanced BA Topics', questions: [
    { question: 'What is the ADKAR model?', options: ['A requirements framework', 'Awareness, Desire, Knowledge, Ability, Reinforcement — stages of individual change management', 'An agile methodology', 'A data analysis technique'], correct: 1 },
    { question: 'What is a business capability model?', options: ['An org chart', 'A map of what the business does — its capabilities — independent of how it is organized or what systems support it', 'A skills matrix', 'A process flow diagram'], correct: 1 },
    { question: 'What key competency is unique to digital transformation BA work?', options: ['Traditional requirements documentation', 'Customer experience and service design thinking — understanding the whole service journey across digital and human touchpoints', 'Waterfall project management', 'Database administration'], correct: 1 },
    { question: 'What does organizational network analysis map?', options: ['IT network topology', 'Informal communication and collaboration networks — revealing how information actually flows beyond the formal org chart', 'Project dependencies', 'Software architecture'], correct: 1 },
    { question: 'What does enterprise architecture alignment prevent in BA work?', options: ['Stakeholder conflicts', 'Solutions designed without reference to enterprise architecture — creating technical debt and integration complexity', 'Budget overruns', 'Requirement changes'], correct: 1 },
  ]},
  { chapterId: '43468e4a-6a2c-43cf-aaaa-fad6fb6615c9', title: 'Module 8 Quiz: BA Certification & Career', questions: [
    { question: 'What does CBAP certification require in terms of experience?', options: ['2 years and 1000 hours', '7,500 hours of BA work experience with at least 900 hours in 4 of 6 BABOK knowledge areas', '5 years in any IT role', '3 years as a project manager'], correct: 1 },
    { question: 'What does the PMI-PBA bridge?', options: ['Agile and waterfall methodology', 'Business analysis and project management — particularly valuable for BAs in PMO environments', 'Data analysis and business strategy', 'Requirements and testing'], correct: 1 },
    { question: 'What is the most common BA specialization path in agile organizations?', options: ['Data science', 'Product Owner — BAs combine requirements expertise with stakeholder skills to excel in this role', 'Security analysis', 'Infrastructure management'], correct: 1 },
    { question: 'What is becoming a baseline competency for all BAs?', options: ['Machine learning development', 'Data literacy — querying databases, interpreting analytics, evaluating data quality independently', 'DevOps toolchain knowledge', 'Mobile app development'], correct: 1 },
    { question: 'What future BA opportunity does AI create beyond automation?', options: ['No new opportunities', 'Specifying AI system requirements — the business rules, outcomes, and ethical constraints AI systems must follow', 'Only replacing current BA tasks', 'Replacing all stakeholder interviews'], correct: 1 },
  ]},
];

async function seedAllQuizzes() {
  let totalQuizzes = 0, totalQuestions = 0;
  
  for (const mod of modules) {
    // Create the quiz
    const { data: quiz, error: quizErr } = await supabase
      .from('quizzes')
      .insert({ chapter_id: mod.chapterId, title: mod.title, passing_score: 70 })
      .select()
      .single();
    
    if (quizErr) { console.error(`❌ Quiz failed: ${mod.title}`, quizErr.message); continue; }
    totalQuizzes++;
    
    // Insert questions
    for (let i = 0; i < mod.questions.length; i++) {
      const q = mod.questions[i];
      const options = {};
      q.options.forEach((opt, idx) => { options[String.fromCharCode(65 + idx)] = opt; });
      
      const { error: qErr } = await supabase.from('quiz_questions').insert({
        quiz_id: quiz.id,
        question: q.question,
        options,
        correct_answer: String.fromCharCode(65 + q.correct),
        order_index: i,
      });
      
      if (qErr) console.error(`❌ Question failed: ${q.question.substring(0, 40)}`, qErr.message);
      else totalQuestions++;
    }
    
    process.stdout.write(`\r✅ ${totalQuizzes}/${modules.length} quizzes | ${totalQuestions} questions`);
  }
  
  console.log(`\n\n🎉 Done! ${totalQuizzes} quizzes and ${totalQuestions} questions seeded across all courses.`);
}

seedAllQuizzes();
