import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Complete 4-Module Scrum Master Course based on the curriculum
const courseData = {
  title: "Scrum Master Profession",
  description: "Unleash your career potential with our course on the fundamentals of the Scrum Master role. Whether you're new to Agile methodologies or seek to enhance your project management skills, this course will equip you with the knowledge and tools needed to excel as a Scrum Master.",
  chapters: [
    // MODULE 1: The Role of the Scrum Master
    {
      title: "Module 1: The Role of the Scrum Master",
      description: "This module defines the Scrum Master's role and summarizes the Scrum Framework and the Scrum Master's involvement. It also describes how the role benefits the organization.",
      order_index: 0,
      videos: [
        {
          title: "1.1 Course Introduction: Scrum Master Profession",
          description: "Welcome to the Scrum Master Profession course. Let's explore what you'll learn and how to succeed.",
          order_index: 0,
          professorIndex: 0, // Professor Miguel
          lessonScript: {
            mainPoints: [
              "Welcome to the Scrum Master Profession course! This course will transform your career and give you the skills to lead agile teams.",
              "Throughout this course, you'll learn the essential aspects of being a Scrum Master by contrasting Scrum with traditional project management methods.",
              "You'll understand why Scrum is a game-changer in today's dynamic business landscape.",
              "We'll dive into practical skills required to become a highly effective Scrum Master through hands-on practice and real-life scenarios.",
              "By the end of this course, you'll be ready to ace certification exams and prove your expertise as a Scrum Master!"
            ]
          },
          questions: [
            {
              question_text: "What framework does this course primarily teach?",
              scenario_context: "A friend asks what methodology you are studying.",
              options: ["Waterfall", "Scrum", "PRINCE2", "Kanban"],
              correct_answer_index: 1,
              explanation: "This course is centered on the Scrum framework.",
              competency: "scrum:framework"
            },
            {
              question_text: "What is the Scrum Master's primary value to an organization?",
              scenario_context: "An executive asks you to justify the Scrum Master role.",
              options: ["Writing code faster", "Managing budgets", "Enabling teams to deliver value continuously through Agile practices", "Creating detailed project plans"],
              correct_answer_index: 2,
              explanation: "A Scrum Master enables continuous value delivery by coaching teams and removing obstacles.",
              competency: "scrum:roles"
            },
            {
              question_text: "What does 'servant leadership' mean in the Scrum context?",
              scenario_context: "A hiring manager asks you to define servant leadership.",
              options: ["The SM serves coffee to the team", "The SM prioritizes the needs of the team over personal authority", "The SM reports to every team member", "The SM avoids making any decisions"],
              correct_answer_index: 1,
              explanation: "Servant leadership means prioritizing enabling and supporting the team rather than exercising authority.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "Which Scrum value is demonstrated when team members share progress openly?",
              scenario_context: "During a Daily Scrum, each member updates the team on blockers and progress.",
              options: ["Courage", "Commitment", "Transparency", "Focus"],
              correct_answer_index: 2,
              explanation: "Transparency is reflected when team members openly share their work and impediments.",
              competency: "scrum:empiricism"
            },
            {
              question_text: "How does the Scrum Master support the Product Owner?",
              scenario_context: "A Product Owner struggles to communicate priorities to the team.",
              options: ["By writing user stories for them", "By helping them understand and apply effective Product Backlog management", "By approving the product vision", "By presenting the backlog to stakeholders instead"],
              correct_answer_index: 1,
              explanation: "The SM supports the PO by helping them manage the Product Backlog effectively.",
              competency: "scrum:stakeholders"
            }
          ]
        },
        {
          title: "1.2 Scrum Master Role and Benefits",
          description: "Understanding the Scrum Master role and how it benefits the organization.",
          order_index: 1,
          professorIndex: 1, // Professor Carmen
          lessonScript: {
            mainPoints: [
              "The Scrum Master is a servant-leader for the Scrum Team. Think of them as a coach, facilitator, and protector all rolled into one.",
              "Unlike traditional project managers, Scrum Masters don't manage people - they facilitate processes and remove impediments.",
              "The Scrum Master helps the team stay focused on the Sprint Goal and shields them from external distractions.",
              "Organizations benefit from Scrum Masters through improved team productivity, better product quality, and faster delivery.",
              "The Scrum Master also helps the broader organization understand and adopt Scrum practices, creating lasting change."
            ]
          },
          questions: [
            {
              question_text: "Which of the following is NOT a responsibility of a Scrum Master?",
              scenario_context: "An interviewer asks you to describe what a Scrum Master does not do.",
              options: ["Facilitating Scrum events", "Coaching the team on Agile practices", "Assigning tasks to developers", "Removing impediments"],
              correct_answer_index: 2,
              explanation: "Scrum Masters do not assign tasks — teams self-organize.",
              competency: "scrum:roles"
            },
            {
              question_text: "How does a Scrum Master benefit the organization beyond the team?",
              scenario_context: "A VP asks what value the Scrum Master brings to the broader company.",
              options: ["By managing project budgets", "By coaching the organization in Agile adoption and removing systemic impediments", "By writing technical documentation", "By replacing the HR function"],
              correct_answer_index: 1,
              explanation: "Scrum Masters benefit the organization by coaching Agile adoption and removing systemic barriers.",
              competency: "scrum:stakeholders"
            },
            {
              question_text: "How does a Scrum Master handle a team conflict?",
              scenario_context: "Two developers disagree on the technical approach for a user story.",
              options: ["Decides for the team which approach to use", "Ignores it and hopes it resolves itself", "Facilitates a conversation to help the team reach their own resolution", "Escalates immediately to HR"],
              correct_answer_index: 2,
              explanation: "A Scrum Master facilitates conflict resolution by guiding the team to resolve it themselves.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What is the primary benefit of daily Scrums for a development team?",
              scenario_context: "A stakeholder questions why the team needs to meet every day.",
              options: ["To report status to management", "To synchronize work and identify impediments quickly", "To update the Product Backlog", "To review completed user stories"],
              correct_answer_index: 1,
              explanation: "Daily Scrums help the team synchronize and surface impediments early.",
              competency: "scrum:events"
            },
            {
              question_text: "What does continuous improvement mean in a Scrum context?",
              scenario_context: "Your team completed a Retrospective and identified three process improvements.",
              options: ["Releasing features faster without quality checks", "Regularly inspecting and adapting processes to become more effective", "Replacing team members who underperform", "Adding more tools and ceremonies"],
              correct_answer_index: 1,
              explanation: "Continuous improvement means regularly inspecting how the team works and adapting to improve.",
              competency: "scrum:empiricism"
            }
          ]
        },
        {
          title: "1.3 Expert Viewpoints: What does the Scrum Master Do?",
          description: "Real perspectives from experienced Scrum Masters about their daily responsibilities.",
          order_index: 2,
          professorIndex: 2, // Professor Rafael
          lessonScript: {
            mainPoints: [
              "Experienced Scrum Masters share that their primary focus is on coaching the team and facilitating Scrum events.",
              "A typical day involves checking in with team members, removing blockers, and preparing for upcoming ceremonies.",
              "Scrum Masters spend significant time coaching team members on Scrum values and self-organization.",
              "They work with Product Owners to ensure the Product Backlog is well-refined and ready for Sprint Planning.",
              "Beyond the team, Scrum Masters often work on organizational impediments and help other teams improve."
            ]
          },
          questions: [
            {
              question_text: "How do expert Scrum Masters approach stakeholder management?",
              scenario_context: "A senior executive keeps bypassing the Scrum process.",
              options: ["Always comply with executive requests immediately", "Ignore stakeholders outside the team", "Educate stakeholders on Scrum and find ways to engage them constructively", "Escalate to HR every time"],
              correct_answer_index: 2,
              explanation: "Expert SMs educate stakeholders on Scrum and find constructive ways to engage them.",
              competency: "scrum:stakeholders"
            },
            {
              question_text: "How should a SM respond when asked to be the team's project manager?",
              scenario_context: "Your manager tells you to start managing the team's tasks and reporting deadlines.",
              options: ["Accept the role immediately", "Refuse all communication with management", "Clarify the SM's role and coach the organization on the difference", "Start using Gantt charts alongside Scrum"],
              correct_answer_index: 2,
              explanation: "A SM should clarify their distinct role and use it as an opportunity to educate the organization.",
              competency: "scrum:roles"
            },
            {
              question_text: "What do experts say about SMs who also code or do technical work?",
              scenario_context: "You are a developer who just became a SM on the same team.",
              options: ["It is always a best practice to do both", "It creates a conflict of interest and splits focus — the SM role should be primary", "Technical SMs are always more effective", "Only non-technical people should be SMs"],
              correct_answer_index: 1,
              explanation: "Combining SM and developer roles splits focus and can compromise the SM's neutrality.",
              competency: "scrum:roles"
            },
            {
              question_text: "What is the significance of asking powerful questions?",
              scenario_context: "A team member comes to you with a problem and expects you to solve it.",
              options: ["It wastes time when direct answers are more efficient", "Powerful questions help team members discover solutions themselves", "It is a technique used only in coaching sessions", "It shows the SM does not know the answer"],
              correct_answer_index: 1,
              explanation: "Powerful questions build team problem-solving capability rather than creating dependency.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What is the difference between coaching and mentoring?",
              scenario_context: "A junior developer asks you to teach them everything about Scrum.",
              options: ["There is no difference", "Coaching draws out the person's own answers; mentoring shares the SM's experience", "Mentoring is for personal issues; coaching is for technical issues", "Coaching is only for managers"],
              correct_answer_index: 1,
              explanation: "Coaching asks questions to help someone discover their own answers; mentoring shares knowledge.",
              competency: "scrum:team-dynamics"
            }
          ]
        },
        {
          title: "1.4 Scrum Master Skill Inventory",
          description: "The essential skills every Scrum Master needs to develop and master.",
          order_index: 3,
          professorIndex: 3, // Professor Lucia
          lessonScript: {
            mainPoints: [
              "Facilitation is one of the most critical skills - being able to guide discussions and help teams reach decisions.",
              "Coaching skills help Scrum Masters develop individuals and teams to reach their full potential.",
              "Conflict resolution is essential as Scrum Masters help navigate disagreements constructively.",
              "Teaching abilities allow Scrum Masters to help organizations understand and adopt Scrum.",
              "Emotional intelligence enables Scrum Masters to read the room and respond appropriately to team dynamics."
            ]
          },
          questions: [
            {
              question_text: "What is the value of understanding business context for a SM?",
              scenario_context: "The PO mentions revenue goals when discussing backlog priorities.",
              options: ["Business context is irrelevant to the SM role", "Understanding business goals helps the SM facilitate better prioritization and stakeholder alignment", "Only the PO needs to understand business context", "It helps the SM become a PO eventually"],
              correct_answer_index: 1,
              explanation: "Business context helps the SM facilitate more meaningful conversations about value and priority.",
              competency: "scrum:stakeholders"
            },
            {
              question_text: "Which demonstrates a SM's conflict resolution skill?",
              scenario_context: "Two senior developers are in a heated debate over architecture during Sprint Planning.",
              options: ["Taking sides with the more senior developer", "Ending Sprint Planning early", "Creating space for both views and guiding the team to a shared decision", "Reporting the conflict to HR immediately"],
              correct_answer_index: 2,
              explanation: "Conflict resolution involves creating a safe space for all views and helping the team decide.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What does 'holding the space' mean in facilitation?",
              scenario_context: "The team goes silent after a difficult question during a Retrospective.",
              options: ["Filling silence with your own answers immediately", "Booking the conference room in advance", "Maintaining a safe environment that allows the team to reflect at their own pace", "Scheduling the next meeting"],
              correct_answer_index: 2,
              explanation: "Holding the space means maintaining a safe environment and allowing silence and reflection.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What is the role of transparency in a SM's skill set?",
              scenario_context: "The team is behind on Sprint goals but the SM has not communicated this to the PO.",
              options: ["Transparency is optional when information may cause concern", "Transparency is a core skill — ensure all relevant information is visible to those who need it", "Only the PO should be transparent", "Transparency applies only during reviews"],
              correct_answer_index: 1,
              explanation: "Transparency is a foundational SM skill — ensuring relevant information is visible.",
              competency: "scrum:empiricism"
            },
            {
              question_text: "How does a SM use retrospective techniques effectively?",
              scenario_context: "Your team says the Retrospective always feels the same.",
              options: ["Cancel retrospectives to save time", "Vary techniques like Start/Stop/Continue, 4Ls, and Sailboat to keep engagement high", "Let the team run it with no structure", "Use only one technique forever for consistency"],
              correct_answer_index: 1,
              explanation: "Rotating facilitation techniques keeps Retrospectives fresh and increases engagement.",
              competency: "scrum:events"
            }
          ]
        },
        {
          title: "1.5 Expert Viewpoints: Scrum Master Skills",
          description: "Industry experts share their perspectives on the most valuable Scrum Master skills.",
          order_index: 4,
          professorIndex: 0, // Professor Miguel
          lessonScript: {
            mainPoints: [
              "Experts agree that soft skills are often more important than technical knowledge for Scrum Masters.",
              "Active listening is highlighted as crucial - understanding what team members are really saying.",
              "Patience is essential because change takes time and teams need room to grow.",
              "Systems thinking helps Scrum Masters see the bigger picture and identify root causes.",
              "Continuous learning is vital as the Agile landscape evolves constantly."
            ]
          },
          questions: [
            {
              question_text: "How do experienced SMs approach a team that resists Agile?",
              scenario_context: "Your new team says Scrum is just overhead.",
              options: ["Force compliance by enforcing all ceremonies strictly", "Ignore their concerns and proceed as planned", "Meet them where they are, understand frustrations, and build trust through small wins", "Replace resistant team members"],
              correct_answer_index: 2,
              explanation: "Expert SMs build trust by meeting teams where they are and demonstrating value gradually.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What skill helps a SM lead organizational change beyond their team?",
              scenario_context: "Your company wants to scale Agile across all departments.",
              options: ["Project management certification", "Change management skills and stakeholder influence", "Database administration", "Knowledge of accounting principles"],
              correct_answer_index: 1,
              explanation: "Change management skills allow SMs to guide organizational Agile transformations.",
              competency: "scrum:stakeholders"
            },
            {
              question_text: "How should a SM handle a technically superior team member who dismisses Scrum?",
              scenario_context: "Your best developer openly says Scrum is a waste of time.",
              options: ["Remove them from the team", "Agree with them publicly to avoid conflict", "Acknowledge their expertise, explore concerns, and connect Scrum's value to what they care about", "Report them to the PO"],
              correct_answer_index: 2,
              explanation: "Effective SMs acknowledge expertise and make Scrum's value relevant to individual goals.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What do experts say about SMs with both Agile and business skills?",
              scenario_context: "A recruiter tells you the most in-demand SMs have a business background.",
              options: ["Business skills are irrelevant to coaching", "Combined Agile and business skills make SMs more credible organizational partners", "Business skills make SMs too focused on profit", "Only POs need business skills"],
              correct_answer_index: 1,
              explanation: "Business literacy combined with Agile expertise makes SMs more effective organizational partners.",
              competency: "scrum:stakeholders"
            },
            {
              question_text: "What does 'holding a mirror' mean as a SM technique?",
              scenario_context: "Your team is not aware their estimation habits cause Sprint overload.",
              options: ["Bringing a physical whiteboard to retros", "Reflecting observations back to the team to help them see their own patterns", "Criticizing team members in public", "Recording the team without their consent"],
              correct_answer_index: 1,
              explanation: "Holding a mirror means neutrally reflecting the team's patterns back to prompt self-awareness.",
              competency: "scrum:team-dynamics"
            }
          ]
        },
        {
          title: "1.6 A Day in the Life of a Scrum Master",
          description: "Walk through a typical day for a practicing Scrum Master.",
          order_index: 5,
          professorIndex: 1, // Professor Carmen
          lessonScript: {
            mainPoints: [
              "A typical day starts with reviewing the Sprint board and checking for any blockers that emerged overnight.",
              "Morning often includes the Daily Scrum - a 15-minute sync where the team shares progress and plans.",
              "Throughout the day, Scrum Masters have one-on-ones, coaching sessions, and work on removing impediments.",
              "Afternoons might include stakeholder meetings, backlog refinement sessions, or preparing for upcoming ceremonies.",
              "The day ends with reflection on what was accomplished and what improvements can be made tomorrow."
            ]
          },
          questions: [
            {
              question_text: "What is typically the first thing a SM does at the start of their workday?",
              scenario_context: "You are preparing for your first day as a SM.",
              options: ["Checks and assigns tasks to team members", "Reviews the team's progress, checks for blockers, and prepares for the Daily Scrum", "Writes the Sprint report", "Attends a management briefing"],
              correct_answer_index: 1,
              explanation: "A SM begins the day by reviewing team status and preparing to facilitate the Daily Scrum.",
              competency: "scrum:roles"
            },
            {
              question_text: "Why does a SM invest time in 1:1 conversations with team members?",
              scenario_context: "You schedule a weekly 1:1 with each team member.",
              options: ["To evaluate their performance for HR purposes", "To build trust and surface concerns that might not emerge in group settings", "To assign personal targets and KPIs", "To replace the Daily Scrum"],
              correct_answer_index: 1,
              explanation: "1:1s build individual trust and surface concerns that people may not share in group settings.",
              competency: "scrum:team-dynamics"
            },
            {
              question_text: "What should a SM do when the Daily Scrum consistently runs over 15 minutes?",
              scenario_context: "Your Daily Scrum has been running 30-40 minutes for three weeks.",
              options: ["Extend the time-box permanently", "Accept it since longer meetings mean more collaboration", "Coach the team on the purpose of the Daily Scrum and introduce techniques to stay focused", "Cancel the Daily Scrum"],
              correct_answer_index: 2,
              explanation: "Chronic over-runs signal a facilitation opportunity — coach the team to keep to time-box.",
              competency: "scrum:events"
            },
            {
              question_text: "How does the SM handle a stakeholder who demands daily status updates?",
              scenario_context: "A VP emails you every morning asking for a team status report.",
              options: ["Writes a daily report to keep them happy", "Ignores the emails", "Engages the stakeholder and provides appropriate visibility through Scrum artifacts", "Adds the VP to the Daily Scrum"],
              correct_answer_index: 2,
              explanation: "The SM connects the stakeholder to appropriate Scrum artifacts and review events.",
              competency: "scrum:stakeholders"
            },
            {
              question_text: "What does a SM model through their own behavior?",
              scenario_context: "A new team member watches how you respond to a tense situation in Sprint Planning.",
              options: ["Authority and control", "The Scrum values: commitment, focus, openness, respect, and courage", "Speed and efficiency above all else", "Deference to the most senior person in the room"],
              correct_answer_index: 1,
              explanation: "Scrum Masters embody Scrum values — their behavior models commitment, openness, respect, focus, and courage.",
              competency: "scrum:empiricism"
            }
          ]
        }
      ],
      endQuizQuestions: generateModule1EndQuiz()
    },
    // MODULE 2: Scrum Master Opportunities
    {
      title: "Module 2: Scrum Master Opportunities",
      description: "This module compares traditional project management with a Scrum Master role and explores opportunities in the current work environment.",
      order_index: 1,
      videos: [
        {
          title: "2.1 Scrum Master and Traditional Project Manager Comparison",
          description: "Understanding the key differences between Scrum Masters and traditional project managers.",
          order_index: 0,
          professorIndex: 2, // Professor Rafael
          lessonScript: {
            mainPoints: [
              "Traditional project managers focus on planning, scheduling, and controlling. Scrum Masters focus on facilitating, coaching, and removing impediments.",
              "Project managers often have direct authority over team members. Scrum Masters influence through servant leadership.",
              "Traditional PM uses detailed upfront planning. Scrum uses iterative planning that adapts to change.",
              "Project managers track progress against a baseline plan. Scrum Masters help teams inspect and adapt continuously.",
              "Both roles aim for project success, but through fundamentally different approaches to leadership and change."
            ]
          },
          questions: [
            {
              question_text: "What is the primary focus of a traditional project manager?",
              scenario_context: "You're comparing PM and SM roles.",
              options: ["Facilitating and coaching", "Planning, scheduling, and controlling", "Removing impediments only", "Writing code"],
              correct_answer_index: 1,
              explanation: "Traditional project managers focus on planning, scheduling, and controlling project activities."
            },
            {
              question_text: "How do Scrum Masters typically influence their teams?",
              scenario_context: "You need to explain your leadership approach.",
              options: ["Through direct authority", "Through servant leadership", "Through financial incentives", "Through threat of termination"],
              correct_answer_index: 1,
              explanation: "Scrum Masters influence through servant leadership rather than direct authority."
            },
            {
              question_text: "How does Scrum approach planning compared to traditional PM?",
              scenario_context: "Stakeholders want a detailed 12-month plan.",
              options: ["Detailed upfront planning", "Iterative planning that adapts to change", "No planning at all", "Planning only at the end"],
              correct_answer_index: 1,
              explanation: "Scrum uses iterative planning that adapts to change rather than detailed upfront planning."
            },
            {
              question_text: "How do project managers typically track progress?",
              scenario_context: "You're comparing tracking methods.",
              options: ["Daily standups only", "Against a baseline plan", "No tracking needed", "Through Scrum events"],
              correct_answer_index: 1,
              explanation: "Project managers track progress against a baseline plan created at the start."
            },
            {
              question_text: "What common goal do both PMs and Scrum Masters share?",
              scenario_context: "You're explaining why both roles matter.",
              options: ["Following identical processes", "Project success through their respective approaches", "Maximizing team size", "Creating documentation"],
              correct_answer_index: 1,
              explanation: "Both roles aim for project success, but through fundamentally different approaches."
            }
          ]
        },
        {
          title: "2.2 Expert Viewpoints: Scrum Master Opportunities",
          description: "Industry experts share insights on career opportunities for Scrum Masters.",
          order_index: 1,
          professorIndex: 3, // Professor Lucia
          lessonScript: {
            mainPoints: [
              "The demand for Scrum Masters continues to grow as more organizations adopt Agile practices.",
              "Opportunities exist across all industries - tech, healthcare, finance, manufacturing, and more.",
              "Remote work has expanded opportunities, allowing Scrum Masters to work with global teams.",
              "Many organizations are looking for Scrum Masters who can also coach at the enterprise level.",
              "Career paths can lead to Agile Coach, Release Train Engineer, or organizational transformation roles."
            ]
          },
          questions: [
            {
              question_text: "What is the trend for Scrum Master demand?",
              scenario_context: "You're considering a career as a Scrum Master.",
              options: ["Decreasing significantly", "Continues to grow as organizations adopt Agile", "Staying exactly the same", "Only growing in tech"],
              correct_answer_index: 1,
              explanation: "The demand for Scrum Masters continues to grow as more organizations adopt Agile practices."
            },
            {
              question_text: "In which industries can Scrum Masters find opportunities?",
              scenario_context: "You're exploring different sectors.",
              options: ["Only software development", "Only startups", "Across all industries including tech, healthcare, finance", "Only Fortune 500 companies"],
              correct_answer_index: 2,
              explanation: "Opportunities exist across all industries including tech, healthcare, finance, manufacturing, and more."
            },
            {
              question_text: "How has remote work affected Scrum Master opportunities?",
              scenario_context: "You're considering remote work options.",
              options: ["Eliminated all opportunities", "Expanded opportunities for global team work", "Had no impact", "Reduced salary potential"],
              correct_answer_index: 1,
              explanation: "Remote work has expanded opportunities, allowing Scrum Masters to work with global teams."
            },
            {
              question_text: "What additional skill are many organizations seeking?",
              scenario_context: "You want to make yourself more marketable.",
              options: ["Programming expertise", "Enterprise-level coaching capabilities", "Marketing skills", "Legal expertise"],
              correct_answer_index: 1,
              explanation: "Many organizations are looking for Scrum Masters who can also coach at the enterprise level."
            },
            {
              question_text: "What career paths can Scrum Masters pursue?",
              scenario_context: "You're planning your long-term career.",
              options: ["Only staying as Scrum Master forever", "Agile Coach, RTE, or organizational transformation roles", "Only becoming a developer", "Only moving to sales"],
              correct_answer_index: 1,
              explanation: "Career paths can lead to Agile Coach, Release Train Engineer, or organizational transformation roles."
            }
          ]
        },
        {
          title: "2.3 Developing Scrum Master Skills",
          description: "How to develop and strengthen the skills needed to succeed as a Scrum Master.",
          order_index: 2,
          professorIndex: 0, // Professor Miguel
          lessonScript: {
            mainPoints: [
              "Start with the basics - read and deeply understand the Scrum Guide. It's the foundation of everything.",
              "Practice facilitation in any setting - team meetings, community groups, family gatherings!",
              "Seek mentorship from experienced Scrum Masters or Agile Coaches.",
              "Join Scrum communities and attend meetups to learn from peers and stay current.",
              "Get certified to validate your knowledge, but remember certification is just the beginning of your journey."
            ]
          },
          questions: [
            {
              question_text: "What foundational document should you master first?",
              scenario_context: "You're starting your Scrum Master journey.",
              options: ["PMBOK Guide", "The Scrum Guide", "Company policies", "Technical documentation"],
              correct_answer_index: 1,
              explanation: "Start with the basics - read and deeply understand the Scrum Guide. It's the foundation."
            },
            {
              question_text: "Where can you practice facilitation skills?",
              scenario_context: "You want to improve your facilitation.",
              options: ["Only in professional settings", "Any setting - team meetings, community groups, anywhere", "Only during Scrum events", "Only with certification training"],
              correct_answer_index: 1,
              explanation: "Practice facilitation in any setting - team meetings, community groups, even family gatherings."
            },
            {
              question_text: "What is a recommended way to accelerate your growth?",
              scenario_context: "You want to develop faster as a Scrum Master.",
              options: ["Work alone and figure it out", "Seek mentorship from experienced Scrum Masters", "Avoid asking for help", "Only read books"],
              correct_answer_index: 1,
              explanation: "Seek mentorship from experienced Scrum Masters or Agile Coaches to accelerate your growth."
            },
            {
              question_text: "Why should you join Scrum communities?",
              scenario_context: "You're wondering if networking is worth your time.",
              options: ["To find a new job", "To learn from peers and stay current", "To complain about your team", "To avoid doing real work"],
              correct_answer_index: 1,
              explanation: "Join Scrum communities and attend meetups to learn from peers and stay current."
            },
            {
              question_text: "What is the role of certification in becoming a Scrum Master?",
              scenario_context: "You're deciding whether to get certified.",
              options: ["It's not needed at all", "It validates knowledge but is just the beginning of the journey", "It guarantees job success", "It replaces practical experience"],
              correct_answer_index: 1,
              explanation: "Get certified to validate your knowledge, but remember certification is just the beginning of your journey."
            }
          ]
        },
        {
          title: "2.4 Scrum Master Employment Opportunities",
          description: "Exploring the job market and employment opportunities for Scrum Masters.",
          order_index: 3,
          professorIndex: 1, // Professor Carmen
          lessonScript: {
            mainPoints: [
              "Job postings for Scrum Masters have increased significantly in recent years.",
              "Many companies seek Scrum Masters with industry-specific experience in their domain.",
              "Contract and consulting opportunities allow flexibility and variety in your career.",
              "Some organizations combine Scrum Master with other roles - be aware of the expectations.",
              "Building a strong LinkedIn presence and portfolio can significantly boost your job search."
            ]
          },
          questions: [
            {
              question_text: "What trend exists in Scrum Master job postings?",
              scenario_context: "You're analyzing the job market.",
              options: ["Significant decrease", "Significant increase in recent years", "No change", "Jobs only for seniors"],
              correct_answer_index: 1,
              explanation: "Job postings for Scrum Masters have increased significantly in recent years."
            },
            {
              question_text: "What type of experience do many companies value?",
              scenario_context: "You're tailoring your resume.",
              options: ["Any random experience", "Industry-specific experience in their domain", "Only technical experience", "Only educational degrees"],
              correct_answer_index: 1,
              explanation: "Many companies seek Scrum Masters with industry-specific experience in their domain."
            },
            {
              question_text: "What alternative to full-time employment exists for Scrum Masters?",
              scenario_context: "You're exploring different work arrangements.",
              options: ["None available", "Contract and consulting opportunities", "Only volunteer work", "Only government positions"],
              correct_answer_index: 1,
              explanation: "Contract and consulting opportunities allow flexibility and variety in your career."
            },
            {
              question_text: "What should you be aware of in some job postings?",
              scenario_context: "You're reviewing a job description.",
              options: ["All jobs are identical", "Some organizations combine Scrum Master with other roles", "Salaries are always the same", "Experience never matters"],
              correct_answer_index: 1,
              explanation: "Some organizations combine Scrum Master with other roles - be aware of the expectations."
            },
            {
              question_text: "What can significantly boost your job search?",
              scenario_context: "You're preparing for your job search.",
              options: ["Avoiding social media", "Building a strong LinkedIn presence and portfolio", "Waiting for jobs to find you", "Hiding your experience"],
              correct_answer_index: 1,
              explanation: "Building a strong LinkedIn presence and portfolio can significantly boost your job search."
            }
          ]
        },
        {
          title: "2.5 Scrum Master Levels",
          description: "Understanding the different levels of Scrum Master experience and expertise.",
          order_index: 4,
          professorIndex: 2, // Professor Rafael
          lessonScript: {
            mainPoints: [
              "Entry-level Scrum Masters focus on learning the framework and facilitating basic Scrum events.",
              "Mid-level Scrum Masters can effectively coach teams and handle complex impediments.",
              "Senior Scrum Masters work across multiple teams and influence organizational change.",
              "Principal or Staff Scrum Masters shape Agile strategy and mentor other Scrum Masters.",
              "Each level requires developing deeper coaching skills and broader organizational influence."
            ]
          },
          questions: [
            {
              question_text: "What is the focus of entry-level Scrum Masters?",
              scenario_context: "You're just starting your SM career.",
              options: ["Organizational transformation", "Learning the framework and facilitating basic events", "Mentoring other SMs", "Enterprise coaching"],
              correct_answer_index: 1,
              explanation: "Entry-level Scrum Masters focus on learning the framework and facilitating basic Scrum events."
            },
            {
              question_text: "What can mid-level Scrum Masters handle effectively?",
              scenario_context: "You've been a SM for 2 years.",
              options: ["Only simple problems", "Coaching teams and complex impediments", "Only administrative tasks", "Only single team facilitation"],
              correct_answer_index: 1,
              explanation: "Mid-level Scrum Masters can effectively coach teams and handle complex impediments."
            },
            {
              question_text: "What do senior Scrum Masters typically do?",
              scenario_context: "You're aspiring to senior level.",
              options: ["Focus only on one team", "Work across multiple teams and influence organizational change", "Avoid organizational politics", "Only attend meetings"],
              correct_answer_index: 1,
              explanation: "Senior Scrum Masters work across multiple teams and influence organizational change."
            },
            {
              question_text: "What is a Principal Scrum Master's responsibility?",
              scenario_context: "You're learning about the highest SM levels.",
              options: ["Just facilitating ceremonies", "Shaping Agile strategy and mentoring other Scrum Masters", "Only technical work", "Writing code"],
              correct_answer_index: 1,
              explanation: "Principal or Staff Scrum Masters shape Agile strategy and mentor other Scrum Masters."
            },
            {
              question_text: "What is required to advance to higher Scrum Master levels?",
              scenario_context: "You want to grow in your career.",
              options: ["Just more years of experience", "Deeper coaching skills and broader organizational influence", "Only more certifications", "Switching companies frequently"],
              correct_answer_index: 1,
              explanation: "Each level requires developing deeper coaching skills and broader organizational influence."
            }
          ]
        },
        {
          title: "2.6 Expert Viewpoints: Why Become a Scrum Master",
          description: "Experts share their personal journeys and reasons for choosing the Scrum Master path.",
          order_index: 5,
          professorIndex: 3, // Professor Lucia
          lessonScript: {
            mainPoints: [
              "Many Scrum Masters love the role because they can make a real difference in people's work lives.",
              "The variety of challenges keeps the role engaging - no two days are exactly alike.",
              "Scrum Masters often report high job satisfaction from helping teams succeed.",
              "The role offers a unique blend of people skills, problem-solving, and continuous learning.",
              "For those who love coaching and development, being a Scrum Master is incredibly fulfilling."
            ]
          },
          questions: [
            {
              question_text: "Why do many Scrum Masters love their role?",
              scenario_context: "You're considering becoming a Scrum Master.",
              options: ["High salary only", "Making a real difference in people's work lives", "Easy work", "No meetings required"],
              correct_answer_index: 1,
              explanation: "Many Scrum Masters love the role because they can make a real difference in people's work lives."
            },
            {
              question_text: "What keeps the Scrum Master role engaging?",
              scenario_context: "You worry about getting bored.",
              options: ["Repetitive tasks", "The variety of challenges - no two days are alike", "Following the same routine", "Avoiding problems"],
              correct_answer_index: 1,
              explanation: "The variety of challenges keeps the role engaging - no two days are exactly alike."
            },
            {
              question_text: "What is a common source of job satisfaction for Scrum Masters?",
              scenario_context: "You're evaluating career happiness.",
              options: ["Avoiding all team interaction", "Helping teams succeed", "Working alone", "Minimizing meetings"],
              correct_answer_index: 1,
              explanation: "Scrum Masters often report high job satisfaction from helping teams succeed."
            },
            {
              question_text: "What unique blend does the Scrum Master role offer?",
              scenario_context: "You're comparing different career paths.",
              options: ["Only technical skills", "People skills, problem-solving, and continuous learning", "Only administrative tasks", "Only management duties"],
              correct_answer_index: 1,
              explanation: "The role offers a unique blend of people skills, problem-solving, and continuous learning."
            },
            {
              question_text: "Who might find the Scrum Master role incredibly fulfilling?",
              scenario_context: "You're assessing your fit for the role.",
              options: ["Those who avoid people", "Those who love coaching and development", "Those who want to work alone", "Those who dislike change"],
              correct_answer_index: 1,
              explanation: "For those who love coaching and development, being a Scrum Master is incredibly fulfilling."
            }
          ]
        }
      ],
      endQuizQuestions: generateModule2EndQuiz()
    },
    // MODULE 3: Scrum Master Job Overview and Opportunities
    {
      title: "Module 3: Scrum Master Job Overview and Opportunities",
      description: "A comprehensive overview of Scrum Master roles, certification paths, and the job environment.",
      order_index: 2,
      videos: [
        {
          title: "3.1 Expert Viewpoints: Scrum Master Employment",
          description: "Industry experts discuss the current state of Scrum Master employment.",
          order_index: 0,
          professorIndex: 0, // Professor Miguel
          lessonScript: {
            mainPoints: [
              "The Scrum Master job market remains strong with continuous growth in demand.",
              "Companies are increasingly looking for experienced Scrum Masters who can hit the ground running.",
              "Remote and hybrid work options have become standard in many Scrum Master positions.",
              "Industry experience combined with Scrum expertise creates particularly attractive candidates.",
              "Networking and community involvement often lead to the best job opportunities."
            ]
          },
          questions: [
            {
              question_text: "What is the current state of the Scrum Master job market?",
              scenario_context: "You're evaluating career stability.",
              options: ["Declining rapidly", "Strong with continuous growth", "Completely saturated", "Only entry-level available"],
              correct_answer_index: 1,
              explanation: "The Scrum Master job market remains strong with continuous growth in demand."
            },
            {
              question_text: "What are companies increasingly looking for?",
              scenario_context: "You're preparing for job interviews.",
              options: ["Only new graduates", "Experienced Scrum Masters who can hit the ground running", "Only project managers converting", "Only those with MBAs"],
              correct_answer_index: 1,
              explanation: "Companies are increasingly looking for experienced Scrum Masters who can hit the ground running."
            },
            {
              question_text: "What work arrangements have become standard for Scrum Masters?",
              scenario_context: "You're considering work-life balance options.",
              options: ["Only on-site full-time", "Remote and hybrid work options", "Only contract work", "No flexibility available"],
              correct_answer_index: 1,
              explanation: "Remote and hybrid work options have become standard in many Scrum Master positions."
            },
            {
              question_text: "What combination creates particularly attractive candidates?",
              scenario_context: "You want to stand out in applications.",
              options: ["Only certifications", "Industry experience combined with Scrum expertise", "Only educational degrees", "Only years of experience"],
              correct_answer_index: 1,
              explanation: "Industry experience combined with Scrum expertise creates particularly attractive candidates."
            },
            {
              question_text: "What often leads to the best job opportunities?",
              scenario_context: "You're strategizing your job search.",
              options: ["Only applying online", "Networking and community involvement", "Waiting for recruiters", "Avoiding social media"],
              correct_answer_index: 1,
              explanation: "Networking and community involvement often lead to the best job opportunities."
            }
          ]
        },
        {
          title: "3.2 The Path to Certification: PMI-ACP, PMI-DASM, and CSM",
          description: "Understanding the major Scrum Master certifications and how to achieve them.",
          order_index: 1,
          professorIndex: 1, // Professor Carmen
          lessonScript: {
            mainPoints: [
              "The Certified Scrum Master (CSM) from Scrum Alliance is one of the most recognized certifications.",
              "PMI-ACP (Agile Certified Practitioner) covers multiple Agile frameworks, not just Scrum.",
              "PMI-DASM (Disciplined Agile Scrum Master) focuses on practical application in various contexts.",
              "Each certification has different prerequisites - some require experience, others just training.",
              "Choose your certification path based on your career goals and the preferences of your target employers."
            ]
          },
          questions: [
            {
              question_text: "Which certification is one of the most recognized for Scrum Masters?",
              scenario_context: "You're choosing your first certification.",
              options: ["PMP", "Certified Scrum Master (CSM) from Scrum Alliance", "Six Sigma Black Belt", "ITIL Foundation"],
              correct_answer_index: 1,
              explanation: "The Certified Scrum Master (CSM) from Scrum Alliance is one of the most recognized certifications."
            },
            {
              question_text: "What does the PMI-ACP certification cover?",
              scenario_context: "You're comparing different certifications.",
              options: ["Only Scrum", "Multiple Agile frameworks, not just Scrum", "Only Kanban", "Only traditional PM"],
              correct_answer_index: 1,
              explanation: "PMI-ACP (Agile Certified Practitioner) covers multiple Agile frameworks, not just Scrum."
            },
            {
              question_text: "What does PMI-DASM focus on?",
              scenario_context: "You're evaluating PMI certifications.",
              options: ["Only theory", "Practical application in various contexts", "Only one methodology", "Only large enterprises"],
              correct_answer_index: 1,
              explanation: "PMI-DASM (Disciplined Agile Scrum Master) focuses on practical application in various contexts."
            },
            {
              question_text: "What differs between certifications regarding prerequisites?",
              scenario_context: "You're checking if you qualify.",
              options: ["All are identical", "Some require experience, others just training", "None require training", "All require 10+ years experience"],
              correct_answer_index: 1,
              explanation: "Each certification has different prerequisites - some require experience, others just training."
            },
            {
              question_text: "How should you choose your certification path?",
              scenario_context: "You're planning your professional development.",
              options: ["Pick the cheapest one", "Based on career goals and target employer preferences", "Get all of them at once", "Avoid certifications entirely"],
              correct_answer_index: 1,
              explanation: "Choose your certification path based on your career goals and the preferences of your target employers."
            }
          ]
        },
        {
          title: "3.3 Expert Viewpoints: Scrum Master Job Environment",
          description: "Experts share insights about working as a Scrum Master in different environments.",
          order_index: 2,
          professorIndex: 2, // Professor Rafael
          lessonScript: {
            mainPoints: [
              "Scrum Masters work in diverse environments from startups to large enterprises.",
              "The culture of an organization significantly impacts how the Scrum Master role is perceived and utilized.",
              "Some environments are more Agile-mature than others - this affects your daily challenges.",
              "Scrum Masters outside IT are growing in areas like HR, marketing, and operations.",
              "Finding the right organizational fit is crucial for job satisfaction and effectiveness."
            ]
          },
          questions: [
            {
              question_text: "In what environments do Scrum Masters work?",
              scenario_context: "You're exploring different company types.",
              options: ["Only large corporations", "Diverse environments from startups to large enterprises", "Only tech companies", "Only consulting firms"],
              correct_answer_index: 1,
              explanation: "Scrum Masters work in diverse environments from startups to large enterprises."
            },
            {
              question_text: "What significantly impacts how the Scrum Master role is perceived?",
              scenario_context: "You're evaluating potential employers.",
              options: ["Only salary levels", "The culture of an organization", "Office location only", "Company age only"],
              correct_answer_index: 1,
              explanation: "The culture of an organization significantly impacts how the Scrum Master role is perceived and utilized."
            },
            {
              question_text: "What affects your daily challenges as a Scrum Master?",
              scenario_context: "You're preparing for different scenarios.",
              options: ["Only your skills", "The Agile maturity of the environment", "Only team size", "Only the product type"],
              correct_answer_index: 1,
              explanation: "Some environments are more Agile-mature than others - this affects your daily challenges."
            },
            {
              question_text: "Where are Scrum Masters growing outside of IT?",
              scenario_context: "You're exploring non-traditional SM opportunities.",
              options: ["Nowhere", "HR, marketing, and operations", "Only manufacturing", "Only healthcare"],
              correct_answer_index: 1,
              explanation: "Scrum Masters outside IT are growing in areas like HR, marketing, and operations."
            },
            {
              question_text: "What is crucial for job satisfaction and effectiveness?",
              scenario_context: "You're considering job offers.",
              options: ["Only salary", "Finding the right organizational fit", "Only title", "Only team size"],
              correct_answer_index: 1,
              explanation: "Finding the right organizational fit is crucial for job satisfaction and effectiveness."
            }
          ]
        }
      ],
      endQuizQuestions: generateModule3EndQuiz()
    },
    // MODULE 4: Final Project
    {
      title: "Module 4: Final Project",
      description: "In this project you will be challenged to perform a SWOT analysis on the Scrum Master role to determine potential opportunities and threats.",
      order_index: 3,
      videos: [
        {
          title: "4.1 Expert Viewpoints: Advice for Aspiring Scrum Masters",
          description: "Final advice and guidance from experienced Scrum Masters for those starting their journey.",
          order_index: 0,
          professorIndex: 3, // Professor Lucia
          lessonScript: {
            mainPoints: [
              "Start by observing experienced Scrum Masters and learning from their approaches.",
              "Be patient with yourself and your teams - mastery takes time and practice.",
              "Build strong relationships with Product Owners, developers, and stakeholders.",
              "Never stop learning - the Agile world evolves constantly and so should you.",
              "Remember that your job is to make others successful, not to be the hero yourself."
            ]
          },
          questions: [
            {
              question_text: "How should aspiring Scrum Masters begin their journey?",
              scenario_context: "You're just starting out.",
              options: ["Immediately take charge", "Observe experienced Scrum Masters and learn from them", "Avoid all senior SMs", "Only read books"],
              correct_answer_index: 1,
              explanation: "Start by observing experienced Scrum Masters and learning from their approaches."
            },
            {
              question_text: "What should you understand about developing mastery?",
              scenario_context: "You feel frustrated with your progress.",
              options: ["It happens instantly", "Mastery takes time and practice", "Some people never learn", "It requires no effort"],
              correct_answer_index: 1,
              explanation: "Be patient with yourself and your teams - mastery takes time and practice."
            },
            {
              question_text: "What relationships should Scrum Masters prioritize building?",
              scenario_context: "You're planning your stakeholder engagement.",
              options: ["Only with management", "With Product Owners, developers, and stakeholders", "Only with other Scrum Masters", "Only with customers"],
              correct_answer_index: 1,
              explanation: "Build strong relationships with Product Owners, developers, and stakeholders."
            },
            {
              question_text: "Why should you never stop learning as a Scrum Master?",
              scenario_context: "You have 10 years of experience.",
              options: ["Learning isn't necessary", "The Agile world evolves constantly", "Only new SMs need to learn", "Experience replaces learning"],
              correct_answer_index: 1,
              explanation: "Never stop learning - the Agile world evolves constantly and so should you."
            },
            {
              question_text: "What is the core purpose of a Scrum Master's job?",
              scenario_context: "You're reflecting on your role.",
              options: ["To be the hero", "To make others successful", "To take credit for success", "To manage every decision"],
              correct_answer_index: 1,
              explanation: "Remember that your job is to make others successful, not to be the hero yourself."
            }
          ]
        }
      ],
      endQuizQuestions: generateModule4EndQuiz()
    }
  ]
};

function generateModule1EndQuiz(): any[] {
  return [
    {
      question_text: "What is the primary goal of the Scrum Master Profession course?",
      scenario_context: "You're recommending this course to a colleague.",
      options: ["To learn coding", "To equip learners with knowledge to excel as Scrum Masters", "To become a project manager", "To learn waterfall methodology"],
      correct_answer_index: 1,
      explanation: "The course equips learners with knowledge and tools needed to excel as a Scrum Master."
    },
    {
      question_text: "How does a Scrum Master lead their team?",
      scenario_context: "You're explaining your leadership approach.",
      options: ["Through command and control", "Through servant leadership", "Through micromanagement", "Through delegation only"],
      correct_answer_index: 1,
      explanation: "Scrum Masters lead through servant leadership, focusing on serving the team's needs."
    },
    // Add more comprehensive questions...
    {
      question_text: "What is the Scrum Master's role in Daily Scrum?",
      scenario_context: "You're facilitating your first Daily Scrum.",
      options: ["To give status updates", "To facilitate the 15-minute sync", "To assign tasks", "To take meeting notes"],
      correct_answer_index: 1,
      explanation: "The Scrum Master facilitates the Daily Scrum but doesn't run or direct it."
    },
    {
      question_text: "Why is emotional intelligence important for Scrum Masters?",
      scenario_context: "You notice team tension during a Sprint.",
      options: ["It's not important", "To read and respond to team dynamics", "To avoid all emotions", "To manipulate team members"],
      correct_answer_index: 1,
      explanation: "Emotional intelligence enables Scrum Masters to read the room and respond appropriately."
    },
    {
      question_text: "What should a Scrum Master do when they identify an impediment?",
      scenario_context: "A team member can't access needed resources.",
      options: ["Ignore it", "Work to remove it", "Report it to HR", "Blame the team member"],
      correct_answer_index: 1,
      explanation: "Scrum Masters work actively to remove impediments that block team progress."
    }
  ];
}

function generateModule2EndQuiz(): any[] {
  return [
    {
      question_text: "What is the main difference between a PM and Scrum Master's planning approach?",
      scenario_context: "You're comparing methodologies.",
      options: ["No difference", "PMs use detailed upfront planning, SMs use iterative planning", "SMs plan more", "PMs never plan"],
      correct_answer_index: 1,
      explanation: "Traditional PMs use detailed upfront planning while Scrum uses iterative, adaptive planning."
    },
    {
      question_text: "What career paths are available for experienced Scrum Masters?",
      scenario_context: "You're planning your career growth.",
      options: ["Only staying as SM", "Agile Coach, RTE, or transformation roles", "Only becoming a PM", "No growth paths exist"],
      correct_answer_index: 1,
      explanation: "Career paths can lead to Agile Coach, Release Train Engineer, or organizational transformation roles."
    },
    {
      question_text: "Why is certification important but not sufficient?",
      scenario_context: "You just passed your CSM exam.",
      options: ["Certification guarantees success", "It validates knowledge but is just the beginning", "It replaces experience", "It's not important"],
      correct_answer_index: 1,
      explanation: "Certification validates knowledge but practical experience and continuous learning are essential."
    },
    {
      question_text: "What level focuses on organizational change?",
      scenario_context: "You want to have broader impact.",
      options: ["Entry-level", "Senior Scrum Master", "Junior only", "None of them"],
      correct_answer_index: 1,
      explanation: "Senior Scrum Masters work across multiple teams and influence organizational change."
    },
    {
      question_text: "What makes Scrum Master roles engaging according to experts?",
      scenario_context: "You want to understand job satisfaction.",
      options: ["Repetitive work", "Variety of challenges", "Easy problems", "No challenges"],
      correct_answer_index: 1,
      explanation: "The variety of challenges keeps the role engaging - no two days are exactly alike."
    }
  ];
}

function generateModule3EndQuiz(): any[] {
  return [
    {
      question_text: "Which certification covers multiple Agile frameworks?",
      scenario_context: "You want broad Agile knowledge.",
      options: ["CSM", "PMI-ACP", "PSM", "SAFe only"],
      correct_answer_index: 1,
      explanation: "PMI-ACP (Agile Certified Practitioner) covers multiple Agile frameworks, not just Scrum."
    },
    {
      question_text: "What often leads to the best job opportunities for Scrum Masters?",
      scenario_context: "You're job hunting.",
      options: ["Mass applying online", "Networking and community involvement", "Waiting passively", "Avoiding LinkedIn"],
      correct_answer_index: 1,
      explanation: "Networking and community involvement often lead to the best job opportunities."
    },
    {
      question_text: "Where are Scrum Masters increasingly finding opportunities outside IT?",
      scenario_context: "You're exploring diverse industries.",
      options: ["Nowhere", "HR, marketing, and operations", "Only manufacturing", "Only retail"],
      correct_answer_index: 1,
      explanation: "Scrum Masters are growing in areas like HR, marketing, and operations outside IT."
    },
    {
      question_text: "What is crucial when evaluating potential employers?",
      scenario_context: "You have multiple job offers.",
      options: ["Only salary", "Organizational culture and fit", "Only location", "Only company size"],
      correct_answer_index: 1,
      explanation: "Finding the right organizational fit is crucial for job satisfaction and effectiveness."
    },
    {
      question_text: "What work arrangements have become standard for Scrum Masters?",
      scenario_context: "You value flexibility.",
      options: ["Only on-site", "Remote and hybrid options", "Only full-time", "Only contract"],
      correct_answer_index: 1,
      explanation: "Remote and hybrid work options have become standard in many Scrum Master positions."
    }
  ];
}

function generateModule4EndQuiz(): any[] {
  return [
    {
      question_text: "What is the purpose of a SWOT analysis for the Scrum Master role?",
      scenario_context: "You're starting the final project.",
      options: ["To criticize the role", "To identify opportunities and threats for the organization", "To avoid problems", "To create documentation only"],
      correct_answer_index: 1,
      explanation: "SWOT analysis helps determine potential opportunities if done well or threats if not conducted successfully."
    },
    {
      question_text: "What is the core job of a Scrum Master according to experts?",
      scenario_context: "You're reflecting on your purpose.",
      options: ["To be the hero", "To make others successful", "To take all credit", "To manage everyone"],
      correct_answer_index: 1,
      explanation: "The Scrum Master's job is to make others successful, not to be the hero themselves."
    },
    {
      question_text: "Why should experienced Scrum Masters continue learning?",
      scenario_context: "You have many years of experience.",
      options: ["They shouldn't", "The Agile world evolves constantly", "Learning stops after certification", "Experience is enough"],
      correct_answer_index: 1,
      explanation: "The Agile world evolves constantly and Scrum Masters should evolve with it."
    },
    {
      question_text: "What relationships are essential for Scrum Master success?",
      scenario_context: "You're building your network.",
      options: ["Only with managers", "With POs, developers, and stakeholders", "Only with customers", "None needed"],
      correct_answer_index: 1,
      explanation: "Building strong relationships with Product Owners, developers, and stakeholders is essential."
    },
    {
      question_text: "How should aspiring Scrum Masters approach their development?",
      scenario_context: "You're just starting your journey.",
      options: ["Rush to lead", "Be patient - mastery takes time", "Avoid all mentors", "Skip observation"],
      correct_answer_index: 1,
      explanation: "Be patient with yourself and your teams - mastery takes time and practice."
    }
  ];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if course already exists
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("title", courseData.title)
      .single();

    if (existingCourse) {
      return new Response(
        JSON.stringify({ message: "Course already exists", courseId: existingCourse.id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the course with translations
    const courseTranslations = {
      es: {
        title: "Profesión de Scrum Master",
        description: "Libera tu potencial profesional con nuestro curso sobre los fundamentos del rol de Scrum Master."
      },
      zh: {
        title: "Scrum Master 职业",
        description: "通过我们关于Scrum Master角色基础知识的课程释放您的职业潜力。"
      },
      ar: {
        title: "مهنة Scrum Master",
        description: "أطلق العنان لإمكانياتك المهنية من خلال دورتنا حول أساسيات دور Scrum Master."
      },
      fr: {
        title: "Profession Scrum Master",
        description: "Libérez votre potentiel de carrière avec notre cours sur les fondamentaux du rôle de Scrum Master."
      },
      de: {
        title: "Scrum Master Beruf",
        description: "Entfesseln Sie Ihr Karrierepotenzial mit unserem Kurs über die Grundlagen der Scrum Master Rolle."
      },
      ja: {
        title: "スクラムマスター職",
        description: "スクラムマスターの役割の基礎に関するコースで、キャリアの可能性を解き放ちましょう。"
      }
    };

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: courseData.title,
        description: courseData.description,
        is_published: true,
        translations: courseTranslations,
      })
      .select()
      .single();

    if (courseError) throw courseError;

    // Chapter translations mapping
    const chapterTranslationsMap: Record<number, Record<string, { title: string; description: string }>> = {
      0: {
        es: { title: "Módulo 1: El Rol del Scrum Master", description: "Este módulo define el rol del Scrum Master y resume el Marco de Scrum." },
        zh: { title: "模块1：Scrum Master的角色", description: "本模块定义了Scrum Master的角色，总结了Scrum框架。" },
        ar: { title: "الوحدة 1: دور Scrum Master", description: "تحدد هذه الوحدة دور Scrum Master وتلخص إطار عمل Scrum." },
        fr: { title: "Module 1 : Le Rôle du Scrum Master", description: "Ce module définit le rôle du Scrum Master et résume le Framework Scrum." },
        de: { title: "Modul 1: Die Rolle des Scrum Masters", description: "Dieses Modul definiert die Rolle des Scrum Masters." },
        ja: { title: "モジュール1：スクラムマスターの役割", description: "このモジュールでは、スクラムマスターの役割を定義します。" }
      },
      1: {
        es: { title: "Módulo 2: Fundamentos de Scrum", description: "Este módulo proporciona una inmersión profunda en el Marco de Scrum." },
        zh: { title: "模块2：Scrum基础", description: "本模块深入介绍Scrum框架。" },
        ar: { title: "الوحدة 2: أساسيات Scrum", description: "توفر هذه الوحدة نظرة معمقة في إطار عمل Scrum." },
        fr: { title: "Module 2 : Fondamentaux de Scrum", description: "Ce module offre une plongée approfondie dans le Framework Scrum." },
        de: { title: "Modul 2: Scrum Grundlagen", description: "Dieses Modul bietet einen tiefen Einblick in das Scrum Framework." },
        ja: { title: "モジュール2：スクラムの基礎", description: "このモジュールでは、スクラムフレームワークを深く掘り下げます。" }
      },
      2: {
        es: { title: "Módulo 3: Eventos de Scrum", description: "Domina los cinco eventos de Scrum." },
        zh: { title: "模块3：Scrum事件", description: "掌握五个Scrum事件。" },
        ar: { title: "الوحدة 3: أحداث Scrum", description: "أتقن أحداث Scrum الخمسة." },
        fr: { title: "Module 3 : Événements Scrum", description: "Maîtrisez les cinq événements Scrum." },
        de: { title: "Modul 3: Scrum Events", description: "Meistern Sie die fünf Scrum Events." },
        ja: { title: "モジュール3：スクラムイベント", description: "5つのスクラムイベントをマスターする。" }
      },
      3: {
        es: { title: "Módulo 4: Dominio Avanzado de Scrum", description: "Técnicas avanzadas para escalar Scrum." },
        zh: { title: "模块4：高级Scrum精通", description: "扩展Scrum的高级技术。" },
        ar: { title: "الوحدة 4: إتقان Scrum المتقدم", description: "تقنيات متقدمة لتوسيع نطاق Scrum." },
        fr: { title: "Module 4 : Maîtrise Avancée de Scrum", description: "Techniques avancées pour l'échelle Scrum." },
        de: { title: "Modul 4: Fortgeschrittene Scrum-Meisterschaft", description: "Fortgeschrittene Techniken zur Skalierung von Scrum." },
        ja: { title: "モジュール4：上級スクラムマスタリー", description: "スクラムのスケーリングのための高度なテクニック。" }
      }
    };

    // Create chapters and videos
    for (const chapterData of courseData.chapters) {
      const chapterTranslations = chapterTranslationsMap[chapterData.order_index] || {};
      
      const { data: chapter, error: chapterError } = await supabase
        .from("chapters")
        .insert({
          course_id: course.id,
          title: chapterData.title,
          description: chapterData.description,
          order_index: chapterData.order_index,
          translations: chapterTranslations,
        })
        .select()
        .single();

      if (chapterError) throw chapterError;

      // Create videos for this chapter
      for (const videoData of chapterData.videos) {
        // Generate video translations based on lesson number
        const lessonNum = `${chapterData.order_index + 1}.${videoData.order_index + 1}`;
        const videoTranslations = {
          es: { title: `${lessonNum} ${videoData.title.split(': ')[1] || videoData.title}`, description: videoData.description },
          zh: { title: `${lessonNum} 课程`, description: videoData.description },
          ar: { title: `${lessonNum} الدرس`, description: videoData.description },
          fr: { title: `${lessonNum} Leçon`, description: videoData.description },
          de: { title: `${lessonNum} Lektion`, description: videoData.description },
          ja: { title: `${lessonNum} レッスン`, description: videoData.description }
        };
        
        const { data: video, error: videoError } = await supabase
          .from("videos")
          .insert({
            chapter_id: chapter.id,
            title: videoData.title,
            description: videoData.description,
            order_index: videoData.order_index,
            translations: videoTranslations,
          })
          .select()
          .single();

        if (videoError) throw videoError;

        // Create mini quiz for this video
        const { data: quiz, error: quizError } = await supabase
          .from("quizzes")
          .insert({
            video_id: video.id,
            chapter_id: chapter.id,
            quiz_type: "mini_video",
            passing_score: 100,
          })
          .select()
          .single();

        if (quizError) throw quizError;

        // Create questions for this quiz
        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          const { error: questionError } = await supabase
            .from("quiz_questions")
            .insert({
              quiz_id: quiz.id,
              question_text: q.question_text,
              scenario_context: q.scenario_context,
              options: q.options,
              correct_answer_index: q.correct_answer_index,
              explanation: q.explanation,
              competency: q.competency,
              order_index: i,
            });

          if (questionError) throw questionError;
        }
      }

      // Create chapter end quiz
      const { data: endQuiz, error: endQuizError } = await supabase
        .from("quizzes")
        .insert({
          chapter_id: chapter.id,
          quiz_type: "chapter_end",
          passing_score: 100,
        })
        .select()
        .single();

      if (endQuizError) throw endQuizError;

      // Create chapter end quiz questions
      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        const { error: questionError } = await supabase
          .from("quiz_questions")
          .insert({
            quiz_id: endQuiz.id,
            question_text: q.question_text,
            scenario_context: q.scenario_context,
            options: q.options,
            correct_answer_index: q.correct_answer_index,
            explanation: q.explanation,
            order_index: i,
          });

        if (questionError) throw questionError;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Course created successfully",
        courseId: course.id,
        chapters: courseData.chapters.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error seeding course:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
