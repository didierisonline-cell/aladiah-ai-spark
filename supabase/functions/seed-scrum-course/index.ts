import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Scrum Guide based course content
const courseData = {
  title: "Professional Scrum Master Certification",
  description: "Master the Scrum framework from the official Scrum Guide. Learn Scrum theory, team roles, events, artifacts, and how to facilitate agile teams effectively.",
  chapters: [
    {
      title: "Chapter 1: Introduction to Scrum",
      description: "Understanding the fundamentals of Scrum and agile principles",
      order_index: 0,
      videos: [
        {
          title: "1.1 What is Scrum?",
          description: "Learn the definition, purpose, and core principles of Scrum",
          order_index: 0,
          questions: [
            {
              question_text: "What is the best definition of Scrum according to the Scrum Guide?",
              scenario_context: "Your organization is considering adopting Scrum. The CEO asks you to explain what Scrum is in one sentence.",
              options: ["A project management methodology with detailed upfront planning", "A lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems", "A set of rigid rules for software development", "A process for managing remote teams"],
              correct_answer_index: 1,
              explanation: "Scrum is defined as a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems."
            },
            {
              question_text: "What are the three pillars of empiricism that Scrum is founded upon?",
              scenario_context: "During a Scrum training session, you need to explain the theoretical foundation of Scrum.",
              options: ["Planning, Execution, Delivery", "Transparency, Inspection, Adaptation", "Speed, Quality, Cost", "Communication, Collaboration, Commitment"],
              correct_answer_index: 1,
              explanation: "Scrum is founded on empiricism and lean thinking. The three pillars are Transparency, Inspection, and Adaptation."
            },
            {
              question_text: "How does Scrum help teams deal with complexity?",
              scenario_context: "A project manager from a traditional background asks why Scrum works better for complex projects.",
              options: ["By creating detailed plans at the start of the project", "Through iterative progress and continuous inspection and adaptation", "By assigning more resources to the project", "By breaking down all requirements before starting"],
              correct_answer_index: 1,
              explanation: "Scrum employs an iterative, incremental approach to optimize predictability and control risk through continuous inspection and adaptation."
            },
            {
              question_text: "What makes Scrum intentionally incomplete?",
              scenario_context: "A new team member is confused why Scrum doesn't prescribe specific techniques or tools.",
              options: ["It's still being developed and will be complete soon", "It only defines the minimum necessary, allowing teams to fill in the gaps with practices that work for them", "The creators forgot to add more rules", "Different industries need completely different versions"],
              correct_answer_index: 1,
              explanation: "Scrum is intentionally incomplete, only defining the parts required to implement Scrum theory. Teams fill in the gaps with practices and techniques that work best for them."
            },
            {
              question_text: "What happens when the pillars of transparency, inspection, and adaptation are not upheld?",
              scenario_context: "A Scrum Team is hiding their impediments from stakeholders and not adapting their process.",
              options: ["The project continues as normal", "Waste and unpredictable outcomes increase, and goals are put at risk", "The team gets more freedom to work", "Sprint velocity automatically improves"],
              correct_answer_index: 1,
              explanation: "When these pillars are not upheld, waste increases, outcomes become unpredictable, and the ability to manage risk decreases significantly."
            }
          ]
        },
        {
          title: "1.2 Scrum Values",
          description: "Explore the five values that guide Scrum teams",
          order_index: 1,
          questions: [
            {
              question_text: "What are the five Scrum Values?",
              scenario_context: "You are coaching a new Scrum Team and need to introduce them to the foundational values.",
              options: ["Speed, Quality, Cost, Scope, Risk", "Commitment, Focus, Openness, Respect, Courage", "Trust, Communication, Flexibility, Innovation, Excellence", "Planning, Execution, Review, Retrospective, Delivery"],
              correct_answer_index: 1,
              explanation: "The five Scrum Values are Commitment, Focus, Openness, Respect, and Courage."
            },
            {
              question_text: "How does the value of 'Courage' manifest in a Scrum Team?",
              scenario_context: "A team member is afraid to speak up about a technical issue that could delay the Sprint.",
              options: ["Working overtime without asking for help", "Having the courage to do the right thing and work on tough problems", "Ignoring problems to maintain team harmony", "Following all orders from management without question"],
              correct_answer_index: 1,
              explanation: "Courage means team members have courage to do the right thing and work on tough problems, even when it's difficult or uncomfortable."
            },
            {
              question_text: "What does 'Focus' mean in the context of Scrum?",
              scenario_context: "Team members are being pulled into multiple projects and meetings during a Sprint.",
              options: ["Everyone focuses on different tasks to maximize output", "The team focuses on the work of the Sprint and its goals", "Focus means working longer hours", "Managers focus on tracking team performance"],
              correct_answer_index: 1,
              explanation: "Focus means everyone focuses on the work of the Sprint and the goals of the Scrum Team, avoiding distractions that don't contribute to the Sprint Goal."
            },
            {
              question_text: "Why is 'Openness' important for Scrum Teams?",
              scenario_context: "A Scrum Team is hesitant to share their challenges with stakeholders.",
              options: ["It makes reporting easier for managers", "The Scrum Team and stakeholders are open about work and challenges, enabling transparency", "It reduces the need for documentation", "Open floor plans improve communication"],
              correct_answer_index: 1,
              explanation: "Openness enables transparency. The Scrum Team and stakeholders agree to be open about all work and the challenges with performing the work."
            },
            {
              question_text: "How do Scrum Values contribute to the success of empiricism?",
              scenario_context: "You need to explain to leadership why values matter in an agile transformation.",
              options: ["They don't - empiricism only requires processes", "They build trust and create an environment where the pillars of empiricism can thrive", "Values are optional nice-to-haves", "Only the Scrum Master needs to embody these values"],
              correct_answer_index: 1,
              explanation: "When the values are embodied by the Scrum Team and the people they work with, the empirical Scrum pillars of transparency, inspection, and adaptation come to life building trust."
            }
          ]
        },
        {
          title: "1.3 Empiricism & Lean Thinking",
          description: "Understand the theoretical foundations of Scrum",
          order_index: 2,
          questions: [
            {
              question_text: "What is empiricism in the context of Scrum?",
              scenario_context: "A stakeholder asks why Scrum doesn't predict exactly what will be delivered in 6 months.",
              options: ["Following a detailed plan created at the start", "Knowledge comes from experience and making decisions based on what is observed", "Using historical data to predict future outcomes", "Trusting expert opinions over actual results"],
              correct_answer_index: 1,
              explanation: "Empiricism asserts that knowledge comes from experience and making decisions based on what is observed. Scrum uses this to make informed decisions based on actual progress."
            },
            {
              question_text: "How does lean thinking apply to Scrum?",
              scenario_context: "Your team is trying to understand how to reduce waste in their process.",
              options: ["Reducing team size to cut costs", "Reducing waste and focusing on the essentials", "Eliminating all meetings", "Working faster without quality checks"],
              correct_answer_index: 1,
              explanation: "Lean thinking reduces waste and focuses on the essentials, helping teams deliver more value with less overhead."
            },
            {
              question_text: "Why does Scrum employ an iterative, incremental approach?",
              scenario_context: "The CFO wants to know why the team can't just deliver everything at once at the end.",
              options: ["To make more meetings", "To optimize predictability and control risk", "To justify longer timelines", "To create more documentation"],
              correct_answer_index: 1,
              explanation: "Scrum employs an iterative, incremental approach to optimize predictability and to control risk. It engages groups of people to deliver value incrementally."
            },
            {
              question_text: "What is the relationship between the three pillars of Scrum?",
              scenario_context: "A team is inspecting their work but not making any changes based on their findings.",
              options: ["They are independent concepts", "Inspection without adaptation is pointless; all three pillars work together", "Only transparency matters for success", "Adaptation can happen without inspection"],
              correct_answer_index: 1,
              explanation: "The three pillars are interconnected. Transparency enables inspection, and inspection without adaptation is considered pointless. All three must work together."
            },
            {
              question_text: "When should inspection occur in Scrum?",
              scenario_context: "A manager wants to schedule inspection meetings only at the end of each quarter.",
              options: ["Only at the end of the project", "Frequently throughout the Sprint, but not so often it gets in the way of work", "Once a year during annual reviews", "Never - trust the team to self-manage"],
              correct_answer_index: 1,
              explanation: "Scrum artifacts and progress must be inspected frequently and diligently to detect potentially undesirable variances or problems, but not so frequently that inspection gets in the way of the work."
            }
          ]
        }
      ],
      endQuizQuestions: [
        // 40 questions for chapter end quiz - combining and expanding on mini video topics
        {
          question_text: "According to the Scrum Guide, what is Scrum?",
          scenario_context: "You're presenting Scrum to your company's board of directors for the first time.",
          options: ["A complete methodology for software development", "A lightweight framework that helps generate value through adaptive solutions", "A set of tools for project tracking", "A management hierarchy structure"],
          correct_answer_index: 1,
          explanation: "Scrum is a lightweight framework that helps people, teams and organizations generate value through adaptive solutions for complex problems."
        },
        {
          question_text: "What are the three pillars of empiricism?",
          scenario_context: "During a Scrum Master interview, you're asked about the foundation of Scrum.",
          options: ["Planning, Doing, Checking", "Transparency, Inspection, Adaptation", "Scope, Time, Cost", "Define, Design, Develop"],
          correct_answer_index: 1,
          explanation: "The three pillars of empiricism are Transparency, Inspection, and Adaptation."
        },
        {
          question_text: "Which Scrum value encourages team members to speak up about problems?",
          scenario_context: "A developer notices a security flaw but is hesitant to bring it up because it might delay the Sprint.",
          options: ["Commitment", "Focus", "Openness", "Courage"],
          correct_answer_index: 3,
          explanation: "Courage gives team members the confidence to do the right thing and work on tough problems."
        },
        {
          question_text: "What does the Scrum value of Commitment mean?",
          scenario_context: "A new team member thinks commitment means promising to finish all items in the Sprint Backlog.",
          options: ["Promising to complete all Sprint Backlog items", "Committing to the goals of the Scrum Team", "Working overtime when needed", "Never changing the plan"],
          correct_answer_index: 1,
          explanation: "Commitment means the team commits to achieving its goals and to supporting each other, not necessarily completing every planned item."
        },
        {
          question_text: "Why is Scrum described as 'simple to understand'?",
          scenario_context: "A colleague argues that Scrum is too complicated to implement.",
          options: ["It has very few rules", "It provides detailed instructions for every situation", "It defines only what's necessary, keeping it lightweight", "It eliminates all complexity from projects"],
          correct_answer_index: 2,
          explanation: "Scrum is simple because it only defines what's necessary to implement Scrum theory, leaving room for teams to add their own practices."
        },
        {
          question_text: "What happens when Scrum is only partially implemented?",
          scenario_context: "Management wants to adopt Scrum but skip the Sprint Retrospective to save time.",
          options: ["It works just as well", "It can be used to explore other techniques and methodologies", "The benefits of Scrum may not be fully realized", "It becomes more agile"],
          correct_answer_index: 2,
          explanation: "While Scrum can be used as a container for other techniques, partial implementation may not provide the full benefits of the framework."
        },
        {
          question_text: "What does transparency mean in Scrum?",
          scenario_context: "Team members are keeping their work-in-progress private until it's complete.",
          options: ["Making all code open source", "The emergent process and work must be visible to those performing and receiving the work", "Publishing all meeting notes", "Sharing salary information"],
          correct_answer_index: 1,
          explanation: "Transparency means the emergent process and work must be visible to those performing the work as well as those receiving the work."
        },
        {
          question_text: "How often should inspection occur in Scrum?",
          scenario_context: "A manager wants to add daily reports for each team member.",
          options: ["Continuously, but not so often it gets in the way of work", "Only during Sprint Review", "Once per release", "As determined by management"],
          correct_answer_index: 0,
          explanation: "Inspection should occur frequently and diligently, but not so frequently that it gets in the way of the work."
        },
        {
          question_text: "When is adaptation required in Scrum?",
          scenario_context: "During Daily Scrum, the team discovers they're behind on the Sprint Goal.",
          options: ["Only at the end of the Sprint", "When any aspects of a process deviate outside acceptable limits", "When management requests changes", "Adaptation is optional"],
          correct_answer_index: 1,
          explanation: "Adaptation must happen when any aspects of a process deviate outside acceptable limits or if the resulting product is unacceptable."
        },
        {
          question_text: "What is the purpose of Scrum events?",
          scenario_context: "A team member complains about having too many meetings.",
          options: ["To keep everyone busy", "To create opportunities for inspection and adaptation", "To satisfy management requirements", "To document progress"],
          correct_answer_index: 1,
          explanation: "All Scrum events are formal opportunities to inspect and adapt Scrum artifacts."
        },
        {
          question_text: "What does the Scrum value of Focus help teams achieve?",
          scenario_context: "Team members are constantly being pulled into other projects during the Sprint.",
          options: ["Multi-tasking efficiency", "Concentrated effort on Sprint work and goals", "Individual productivity metrics", "Faster typing speed"],
          correct_answer_index: 1,
          explanation: "Focus means everyone concentrates on the work of the Sprint and the goals of the Scrum Team."
        },
        {
          question_text: "How does Respect manifest in a Scrum Team?",
          scenario_context: "A senior developer dismisses a junior developer's idea without consideration.",
          options: ["Following a strict hierarchy", "Team members respect each other as capable, independent people", "Respecting only the Scrum Master's decisions", "Never disagreeing with teammates"],
          correct_answer_index: 1,
          explanation: "Respect means Scrum Team members respect each other to be capable, independent people, and are respected as such by the people with whom they work."
        },
        {
          question_text: "Why does Scrum emphasize small teams?",
          scenario_context: "Your organization has 50 developers who need to work on one product.",
          options: ["To reduce costs", "Small teams communicate better and are more productive", "To limit the scope of projects", "Because Scrum doesn't scale"],
          correct_answer_index: 1,
          explanation: "Small teams communicate better and are more productive. Larger teams should consider reorganizing into multiple cohesive Scrum Teams."
        },
        {
          question_text: "What is the relationship between empiricism and Scrum?",
          scenario_context: "A traditional project manager asks why Scrum doesn't follow a predictive approach.",
          options: ["They are unrelated concepts", "Scrum is founded on empiricism - learning from experience", "Empiricism is optional in Scrum", "Scrum rejects empiricism"],
          correct_answer_index: 1,
          explanation: "Scrum is founded on empiricism, which asserts that knowledge comes from experience and making decisions based on what is observed."
        },
        {
          question_text: "How does lean thinking contribute to Scrum?",
          scenario_context: "The team has many processes that don't seem to add value.",
          options: ["It doesn't - lean and Scrum are separate", "Lean thinking reduces waste and focuses on essentials", "Lean means doing less work", "Lean thinking increases documentation"],
          correct_answer_index: 1,
          explanation: "Lean thinking reduces waste and focuses on the essentials, which aligns with Scrum's lightweight nature."
        },
        {
          question_text: "What should happen if transparency is low?",
          scenario_context: "Stakeholders don't have visibility into what the team is working on.",
          options: ["Continue working as usual", "Decisions become risky as they're based on incomplete information", "Increase the Sprint length", "Add more documentation requirements"],
          correct_answer_index: 1,
          explanation: "Low transparency makes decisions risky because they may be based on incomplete or inaccurate information."
        },
        {
          question_text: "What makes Scrum difficult to master?",
          scenario_context: "A team has been doing Scrum for 6 months but isn't seeing improvements.",
          options: ["The rules are too complex", "Truly embodying the values and principles requires practice", "There isn't enough documentation", "Scrum tools are expensive"],
          correct_answer_index: 1,
          explanation: "While Scrum is simple to understand, it is difficult to master because it requires deeply understanding and living the values and principles."
        },
        {
          question_text: "What is the purpose of the iterative approach in Scrum?",
          scenario_context: "A stakeholder asks why you deliver in Sprints instead of all at once.",
          options: ["To extend the project timeline", "To optimize predictability and control risk", "To create more meetings", "To increase costs"],
          correct_answer_index: 1,
          explanation: "The iterative approach optimizes predictability and controls risk by delivering value incrementally."
        },
        {
          question_text: "Who is responsible for upholding Scrum values?",
          scenario_context: "A team member says values are only the Scrum Master's concern.",
          options: ["Only the Scrum Master", "Only management", "The entire Scrum Team", "Values are not important"],
          correct_answer_index: 2,
          explanation: "The entire Scrum Team is responsible for embodying the Scrum values in their work and interactions."
        },
        {
          question_text: "When values are embodied, what develops within the team?",
          scenario_context: "A new team is struggling to work together effectively.",
          options: ["Competition", "Trust", "Bureaucracy", "Hierarchy"],
          correct_answer_index: 1,
          explanation: "When the values are embodied, the empirical Scrum pillars come to life, building trust among team members."
        },
        {
          question_text: "What does Scrum NOT prescribe?",
          scenario_context: "A manager asks which programming methodology Scrum requires.",
          options: ["Having a Product Owner", "Specific techniques or technologies to use", "Sprint events", "A Definition of Done"],
          correct_answer_index: 1,
          explanation: "Scrum does not prescribe specific techniques, practices, or technologies to use. It only provides the framework."
        },
        {
          question_text: "Why is adaptation essential in Scrum?",
          scenario_context: "The team learned something new about customer needs mid-Sprint.",
          options: ["It isn't - plans should not change", "It allows teams to respond to change and deliver value", "It makes reporting easier", "It reduces accountability"],
          correct_answer_index: 1,
          explanation: "Adaptation allows teams to respond to new information and changing requirements, ensuring they continue to deliver value."
        },
        {
          question_text: "What happens when a team lacks courage?",
          scenario_context: "Team members avoid bringing up problems in meetings.",
          options: ["The team works more harmoniously", "Important issues go unaddressed, affecting quality", "Sprint velocity increases", "Stakeholders are happier"],
          correct_answer_index: 1,
          explanation: "Without courage, team members may not speak up about problems, leading to unaddressed issues that affect quality and outcomes."
        },
        {
          question_text: "How should Scrum Teams handle complex problems?",
          scenario_context: "The team faces an uncertain technical challenge with no clear solution.",
          options: ["Wait for management guidance", "Use empiricism - try solutions and learn from results", "Avoid the problem", "Hire external consultants immediately"],
          correct_answer_index: 1,
          explanation: "Scrum uses empiricism to handle complexity - teams experiment, observe results, and adapt based on what they learn."
        },
        {
          question_text: "What is the benefit of inspection in Scrum?",
          scenario_context: "The team rarely looks at their Sprint progress during the Sprint.",
          options: ["It creates documentation", "It detects potentially undesirable variances early", "It satisfies auditors", "It reduces the need for planning"],
          correct_answer_index: 1,
          explanation: "Inspection helps detect potentially undesirable variances or problems early, when they're easier to address."
        },
        {
          question_text: "What role does Openness play in transparency?",
          scenario_context: "A team member is hesitant to share that they're struggling with a task.",
          options: ["They are unrelated", "Openness enables transparency by encouraging honest communication", "Openness replaces transparency", "Only managers need to be open"],
          correct_answer_index: 1,
          explanation: "Openness enables transparency. When team members are open about work and challenges, the team can inspect and adapt effectively."
        },
        {
          question_text: "What should guide decisions in Scrum?",
          scenario_context: "A stakeholder wants to make a decision based on a prediction made 6 months ago.",
          options: ["Original project plans", "What is observed and experienced (empiricism)", "Management preferences", "Industry best practices only"],
          correct_answer_index: 1,
          explanation: "Decisions should be based on what is observed and experienced, which is the essence of empiricism."
        },
        {
          question_text: "How does Scrum view self-management?",
          scenario_context: "A manager wants to assign specific tasks to each team member.",
          options: ["Teams should be told what to do", "Teams internally decide who does what, when, and how", "Only senior members self-manage", "Self-management creates chaos"],
          correct_answer_index: 1,
          explanation: "Scrum Teams are self-managing, meaning they internally decide who does what, when, and how."
        },
        {
          question_text: "What is the danger of low transparency?",
          scenario_context: "The team reports everything is on track but the actual work is behind schedule.",
          options: ["There is no danger", "Risk increases because decisions are made on incomplete information", "It speeds up development", "It protects the team from criticism"],
          correct_answer_index: 1,
          explanation: "Low transparency leads to decisions made on incomplete information, which increases risk and unpredictability."
        },
        {
          question_text: "Why does Scrum limit what it defines?",
          scenario_context: "A new team asks why Scrum doesn't tell them exactly how to do their work.",
          options: ["The creators didn't finish the framework", "To allow various processes, techniques and methods within it", "To reduce training costs", "To make certification easier"],
          correct_answer_index: 1,
          explanation: "Scrum is intentionally incomplete to allow various processes, techniques, and methods to be employed within the framework."
        },
        {
          question_text: "What is the key to building trust in Scrum?",
          scenario_context: "A new team is struggling to trust each other's judgments.",
          options: ["Strict oversight", "Embodying the Scrum values", "Detailed contracts", "Performance reviews"],
          correct_answer_index: 1,
          explanation: "When the values are embodied by the Scrum Team, trust is built among team members."
        },
        {
          question_text: "How should a Scrum Team respond to unexpected findings during inspection?",
          scenario_context: "The Sprint Review reveals the product doesn't meet user expectations.",
          options: ["Continue as planned", "Adapt the plan or approach as soon as possible", "Blame the team", "Cancel the project"],
          correct_answer_index: 1,
          explanation: "When something is learned through inspection, the team should adapt as soon as possible to minimize further deviation."
        },
        {
          question_text: "What mindset does Scrum require for success?",
          scenario_context: "Leadership wants guarantees about what will be delivered in the next 6 months.",
          options: ["Predictive planning mindset", "Empirical mindset accepting uncertainty", "Fixed scope mindset", "Command-and-control mindset"],
          correct_answer_index: 1,
          explanation: "Scrum requires an empirical mindset that accepts uncertainty and makes decisions based on what is observed rather than predicted."
        },
        {
          question_text: "What enables the Scrum Team to create value?",
          scenario_context: "A team is producing features but stakeholders are not satisfied.",
          options: ["Working faster", "The combination of the framework and Scrum values", "More detailed requirements", "Stricter deadlines"],
          correct_answer_index: 1,
          explanation: "The combination of the Scrum framework and Scrum values enables teams to create value by addressing complex problems effectively."
        },
        {
          question_text: "What should happen when the Sprint Goal becomes obsolete?",
          scenario_context: "Major market changes make the current Sprint Goal irrelevant.",
          options: ["Continue working on the Sprint Goal anyway", "The Sprint may be cancelled", "Wait until the next Sprint", "Ignore the market changes"],
          correct_answer_index: 1,
          explanation: "A Sprint may be cancelled if the Sprint Goal becomes obsolete, which is an example of adaptation."
        },
        {
          question_text: "Why is the Definition of Done important for transparency?",
          scenario_context: "Different team members have different ideas of what 'done' means.",
          options: ["It's not related to transparency", "It creates a shared understanding of work completion", "It reduces the need for testing", "It speeds up development"],
          correct_answer_index: 1,
          explanation: "The Definition of Done creates transparency by providing a shared understanding of what work being complete means."
        },
        {
          question_text: "What is the relationship between inspection and transparency?",
          scenario_context: "The team wants to inspect their progress but not everyone has access to the information.",
          options: ["They are unrelated", "Inspection is only possible with transparency", "Inspection creates transparency", "Neither is important"],
          correct_answer_index: 1,
          explanation: "Transparency is required for inspection. Without transparency, inspection becomes misleading and wasteful."
        },
        {
          question_text: "How does Scrum handle the need for experimentation?",
          scenario_context: "The team wants to try a new technology but isn't sure it will work.",
          options: ["Experimentation is not allowed", "The empirical nature of Scrum supports experimentation and learning", "All experiments require approval", "Only proven technologies should be used"],
          correct_answer_index: 1,
          explanation: "Scrum's empirical nature supports experimentation. Teams can try approaches, observe results, and adapt based on what they learn."
        },
        {
          question_text: "What happens when Scrum is implemented without understanding its values?",
          scenario_context: "A team follows all Scrum events and artifacts but team members don't trust each other.",
          options: ["Scrum works perfectly fine", "The team may not achieve the full benefits of Scrum", "Values are optional additions", "The team becomes more efficient"],
          correct_answer_index: 1,
          explanation: "Without embodying the values, teams may follow the mechanics of Scrum but not achieve its full benefits."
        },
        {
          question_text: "What is the ultimate goal of Scrum?",
          scenario_context: "Someone asks you to summarize why organizations should use Scrum.",
          options: ["To reduce costs", "To generate value through adaptive solutions for complex problems", "To create more meetings", "To produce more documentation"],
          correct_answer_index: 1,
          explanation: "The ultimate goal of Scrum is to help people, teams, and organizations generate value through adaptive solutions for complex problems."
        }
      ]
    },
    {
      title: "Chapter 2: The Scrum Team",
      description: "Learn about the Scrum Team roles and responsibilities",
      order_index: 1,
      videos: [
        {
          title: "2.1 The Scrum Team Structure",
          description: "Understanding the composition and characteristics of Scrum Teams",
          order_index: 0,
          questions: [
            {
              question_text: "What is the fundamental unit of Scrum?",
              scenario_context: "Your organization is restructuring and wants to know how to organize people for Scrum.",
              options: ["The Project Manager", "The Scrum Team", "The Development Department", "The Product Owner"],
              correct_answer_index: 1,
              explanation: "The fundamental unit of Scrum is a small team of people, called the Scrum Team."
            },
            {
              question_text: "What is the recommended size of a Scrum Team?",
              scenario_context: "You're forming a new Scrum Team and need to decide how many people to include.",
              options: ["3-5 people", "5 or fewer people", "10 or fewer people, typically smaller", "15-20 people"],
              correct_answer_index: 2,
              explanation: "The Scrum Team is typically 10 or fewer people, and in general, smaller teams communicate better and are more productive."
            },
            {
              question_text: "How many sub-teams or hierarchies exist within a Scrum Team?",
              scenario_context: "A manager wants to create a QA sub-team and a Development sub-team within the Scrum Team.",
              options: ["Two (technical and non-technical)", "As many as needed for efficiency", "None - there are no sub-teams or hierarchies", "One for each discipline"],
              correct_answer_index: 2,
              explanation: "Within a Scrum Team, there are no sub-teams or hierarchies. It is a cohesive unit of professionals."
            },
            {
              question_text: "What three roles exist within a Scrum Team?",
              scenario_context: "You're explaining Scrum roles to a new hire.",
              options: ["Manager, Developer, Tester", "Scrum Master, Product Owner, Developers", "Technical Lead, Business Analyst, Team Members", "Project Manager, Team Lead, Staff"],
              correct_answer_index: 1,
              explanation: "A Scrum Team consists of one Scrum Master, one Product Owner, and Developers."
            },
            {
              question_text: "What does it mean that a Scrum Team is self-managing?",
              scenario_context: "A manager is confused about who assigns tasks to the team.",
              options: ["They don't need any management at all", "They internally decide who does what, when, and how", "Each person manages themselves individually", "The Scrum Master manages all tasks"],
              correct_answer_index: 1,
              explanation: "Self-managing means the team internally decides who does what, when, and how to accomplish their work."
            }
          ]
        },
        {
          title: "2.2 The Product Owner",
          description: "The role responsible for maximizing the value of the product",
          order_index: 1,
          questions: [
            {
              question_text: "What is the Product Owner's primary accountability?",
              scenario_context: "A new Product Owner asks what their main focus should be.",
              options: ["Managing the development team", "Maximizing the value of the product resulting from the Scrum Team's work", "Writing all user stories", "Attending all Daily Scrums"],
              correct_answer_index: 1,
              explanation: "The Product Owner is accountable for maximizing the value of the product resulting from the work of the Scrum Team."
            },
            {
              question_text: "Who manages the Product Backlog?",
              scenario_context: "Multiple people want to add items to the Product Backlog.",
              options: ["The entire Scrum Team collaboratively", "The Product Owner", "The Scrum Master", "Stakeholders"],
              correct_answer_index: 1,
              explanation: "The Product Owner is responsible for effective Product Backlog management."
            },
            {
              question_text: "Can the Product Owner delegate Product Backlog work to others?",
              scenario_context: "The Product Owner wants developers to help write Product Backlog items.",
              options: ["No, only the Product Owner can do this work", "Yes, but the Product Owner remains accountable", "Yes, and accountability transfers too", "Only the Scrum Master can help"],
              correct_answer_index: 1,
              explanation: "The Product Owner may delegate work to others, but they remain accountable for the outcome."
            },
            {
              question_text: "How many people represent the Product Owner role?",
              scenario_context: "Two managers both want to be the Product Owner for one product.",
              options: ["As many as needed", "One person, not a committee", "Two, for backup", "It depends on the product"],
              correct_answer_index: 1,
              explanation: "The Product Owner is one person, not a committee. They may represent the needs of many stakeholders, but one person is accountable."
            },
            {
              question_text: "What must happen for a Product Owner's decisions to be respected?",
              scenario_context: "Stakeholders keep bypassing the Product Owner to request features directly from developers.",
              options: ["Nothing - stakeholders can request directly", "The entire organization must respect the Product Owner's decisions", "Developers must ignore stakeholders", "The Scrum Master must enforce it"],
              correct_answer_index: 1,
              explanation: "For Product Owners to succeed, the entire organization must respect their decisions. These decisions are visible in the content and ordering of the Product Backlog."
            }
          ]
        },
        {
          title: "2.3 The Scrum Master",
          description: "The servant leader who helps everyone understand Scrum",
          order_index: 2,
          questions: [
            {
              question_text: "What is the Scrum Master accountable for?",
              scenario_context: "A hiring manager asks what a Scrum Master actually does.",
              options: ["Managing the development team", "Establishing Scrum as defined in the Scrum Guide", "Delivering the product on time", "Writing code and tests"],
              correct_answer_index: 1,
              explanation: "The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide."
            },
            {
              question_text: "How does the Scrum Master help establish Scrum?",
              scenario_context: "A Scrum Master wonders how to best support their team and organization.",
              options: ["By enforcing rules and punishing violations", "By helping everyone understand Scrum theory and practice, both within the Team and the organization", "By doing all the planning", "By attending meetings on behalf of the team"],
              correct_answer_index: 1,
              explanation: "Scrum Masters help everyone understand Scrum theory and practice, both within the Scrum Team and the organization."
            },
            {
              question_text: "What is the Scrum Master's relationship to the team's effectiveness?",
              scenario_context: "The team is struggling to improve their processes.",
              options: ["Not their concern", "They are accountable for the Scrum Team's effectiveness", "They measure but don't influence", "Only technical effectiveness matters"],
              correct_answer_index: 1,
              explanation: "The Scrum Master is accountable for the Scrum Team's effectiveness."
            },
            {
              question_text: "How does the Scrum Master serve the Product Owner?",
              scenario_context: "The Product Owner is struggling with backlog management.",
              options: ["By taking over backlog management", "By helping find techniques for effective Product Goal definition and Backlog management", "By disagreeing with their priorities", "By writing user stories for them"],
              correct_answer_index: 1,
              explanation: "The Scrum Master helps the Product Owner find techniques for effective Product Goal definition and Product Backlog management, among other things."
            },
            {
              question_text: "What leadership style does a Scrum Master embody?",
              scenario_context: "Someone asks if the Scrum Master is a traditional manager.",
              options: ["Command and control", "Servant leadership for the Scrum Team and organization", "Laissez-faire", "Authoritarian"],
              correct_answer_index: 1,
              explanation: "Scrum Masters are true leaders who serve the Scrum Team and the larger organization."
            }
          ]
        },
        {
          title: "2.4 The Developers",
          description: "The professionals who create the product Increment",
          order_index: 3,
          questions: [
            {
              question_text: "Who are the Developers in a Scrum Team?",
              scenario_context: "A tester asks if they are considered a Developer in Scrum.",
              options: ["Only software programmers", "People committed to creating any aspect of a usable Increment each Sprint", "Anyone who writes code", "External contractors only"],
              correct_answer_index: 1,
              explanation: "Developers are the people in the Scrum Team committed to creating any aspect of a usable Increment each Sprint."
            },
            {
              question_text: "What are Developers accountable for?",
              scenario_context: "Developers are unsure about their responsibilities beyond writing code.",
              options: ["Just writing code", "Creating a plan for the Sprint (Sprint Backlog), adhering to Definition of Done, adapting daily toward Sprint Goal, and holding each other accountable as professionals", "Following the Product Owner's exact instructions", "Reporting to the Scrum Master"],
              correct_answer_index: 1,
              explanation: "Developers are accountable for creating a plan for the Sprint, instilling quality through the Definition of Done, adapting daily, and holding each other accountable."
            },
            {
              question_text: "Who creates the Sprint Backlog?",
              scenario_context: "The Product Owner wants to assign specific Sprint Backlog items to developers.",
              options: ["The Product Owner", "The Scrum Master", "The Developers", "Management"],
              correct_answer_index: 2,
              explanation: "The Developers create a plan for the Sprint, which is the Sprint Backlog."
            },
            {
              question_text: "What skills should Developers have?",
              scenario_context: "You're hiring developers for a Scrum Team and wondering about skill requirements.",
              options: ["All the same skills", "Only coding skills", "The skills needed to create a usable Increment, often broad and varied", "Only the Scrum Master needs varied skills"],
              correct_answer_index: 2,
              explanation: "The specific skills needed by the Developers are often broad and will vary with the domain of work."
            },
            {
              question_text: "How do Developers adapt their plan during the Sprint?",
              scenario_context: "The team discovers new information mid-Sprint.",
              options: ["They wait until the next Sprint", "They adapt their plan daily toward the Sprint Goal", "They ask the Scrum Master for permission", "They stop working until the plan is updated"],
              correct_answer_index: 1,
              explanation: "Developers are accountable for adapting their plan each day toward the Sprint Goal."
            }
          ]
        }
      ],
      endQuizQuestions: [
        {
          question_text: "What is the fundamental unit of Scrum?",
          scenario_context: "You're explaining Scrum structure to new team members.",
          options: ["The Sprint", "The Scrum Team", "The Product Backlog", "The Scrum Master"],
          correct_answer_index: 1,
          explanation: "The Scrum Team is the fundamental unit of Scrum."
        },
        {
          question_text: "How many roles exist within a Scrum Team?",
          scenario_context: "A manager is trying to map traditional roles to Scrum.",
          options: ["One: Team Members", "Two: Leaders and Workers", "Three: Scrum Master, Product Owner, Developers", "Four: including Project Manager"],
          correct_answer_index: 2,
          explanation: "There are three roles: Scrum Master, Product Owner, and Developers."
        },
        {
          question_text: "What size should a Scrum Team be?",
          scenario_context: "Your organization wants to form Scrum Teams from a 30-person department.",
          options: ["15-20 people", "10 or fewer people", "Exactly 7 people", "As large as needed"],
          correct_answer_index: 1,
          explanation: "Scrum Teams are typically 10 or fewer people. Smaller teams communicate better and are more productive."
        },
        {
          question_text: "Are there sub-teams or hierarchies within a Scrum Team?",
          scenario_context: "A manager wants to create a test team within the Scrum Team.",
          options: ["Yes, for efficiency", "Only if needed", "No, there are none", "Yes, always"],
          correct_answer_index: 2,
          explanation: "Within a Scrum Team, there are no sub-teams or hierarchies."
        },
        {
          question_text: "What does it mean for a Scrum Team to be cross-functional?",
          scenario_context: "The team says they need to wait for a separate QA team to test their work.",
          options: ["Everyone does the same work", "Members have all skills necessary to create value each Sprint", "They work across departments", "They function in multiple time zones"],
          correct_answer_index: 1,
          explanation: "Cross-functional means team members have all the skills necessary to create value each Sprint."
        },
        {
          question_text: "What is the Product Owner's main accountability?",
          scenario_context: "A new Product Owner asks what success looks like in their role.",
          options: ["Completing sprints on time", "Maximizing the value of the product", "Managing developers", "Writing code"],
          correct_answer_index: 1,
          explanation: "The Product Owner is accountable for maximizing the value of the product."
        },
        {
          question_text: "Who owns the Product Backlog?",
          scenario_context: "Multiple stakeholders want control over backlog priorities.",
          options: ["The Scrum Master", "Stakeholders collectively", "The Product Owner", "The Development team"],
          correct_answer_index: 2,
          explanation: "The Product Owner is responsible for effective Product Backlog management."
        },
        {
          question_text: "Can Product Backlog management work be delegated?",
          scenario_context: "The Product Owner wants developers to help refine backlog items.",
          options: ["No, never", "Yes, but accountability remains with the Product Owner", "Yes, and accountability transfers too", "Only to the Scrum Master"],
          correct_answer_index: 1,
          explanation: "The Product Owner may delegate work to others, but remains accountable."
        },
        {
          question_text: "How many Product Owners should a product have?",
          scenario_context: "Two departments each want their own Product Owner for the same product.",
          options: ["One per department", "One person, not a committee", "Two for redundancy", "As many as needed"],
          correct_answer_index: 1,
          explanation: "The Product Owner is one person, not a committee."
        },
        {
          question_text: "What must stakeholders respect regarding the Product Owner?",
          scenario_context: "A VP wants to override the Product Owner's backlog ordering.",
          options: ["Nothing specific", "The Product Owner's decisions as shown in the Backlog", "Only the Sprint Goal", "Their technical expertise"],
          correct_answer_index: 1,
          explanation: "The entire organization must respect the Product Owner's decisions, visible in the Product Backlog."
        },
        {
          question_text: "What is the Scrum Master accountable for?",
          scenario_context: "Someone confuses the Scrum Master with a traditional project manager.",
          options: ["Project delivery", "Establishing Scrum as defined in the Scrum Guide", "Team performance metrics", "Budget management"],
          correct_answer_index: 1,
          explanation: "The Scrum Master is accountable for establishing Scrum as defined in the Scrum Guide."
        },
        {
          question_text: "How does the Scrum Master help the organization?",
          scenario_context: "Leadership wonders what the Scrum Master does outside the team.",
          options: ["Nothing outside the team", "Leading, training, and coaching the organization in Scrum adoption", "Managing other Scrum Teams", "Reporting team performance"],
          correct_answer_index: 1,
          explanation: "The Scrum Master serves the organization by leading, training, and coaching in Scrum adoption."
        },
        {
          question_text: "What type of leader is the Scrum Master?",
          scenario_context: "A Scrum Master is unsure about their leadership style.",
          options: ["Authoritarian", "Servant leader", "Manager", "Director"],
          correct_answer_index: 1,
          explanation: "Scrum Masters are servant leaders who serve the Scrum Team and organization."
        },
        {
          question_text: "How does the Scrum Master help the Product Owner?",
          scenario_context: "The Product Owner struggles with backlog management.",
          options: ["Takes over backlog duties", "Helps find techniques for effective Product Goal definition and Backlog management", "Makes decisions for them", "Writes user stories"],
          correct_answer_index: 1,
          explanation: "The Scrum Master helps the Product Owner find techniques for effective management."
        },
        {
          question_text: "What does the Scrum Master do for impediments?",
          scenario_context: "The team is blocked by an organizational policy.",
          options: ["Nothing - that's management's job", "Causes removal of impediments to the Scrum Team's progress", "Documents them for review", "Escalates everything to management"],
          correct_answer_index: 1,
          explanation: "The Scrum Master causes the removal of impediments to the Scrum Team's progress."
        },
        {
          question_text: "Who are the Developers in Scrum?",
          scenario_context: "A designer asks if they're considered a Developer.",
          options: ["Only programmers", "People committed to creating any aspect of a usable Increment", "External contractors", "Anyone who writes code"],
          correct_answer_index: 1,
          explanation: "Developers are people committed to creating any aspect of a usable Increment each Sprint."
        },
        {
          question_text: "What do Developers create for the Sprint?",
          scenario_context: "The team is starting Sprint Planning.",
          options: ["A Gantt chart", "The Sprint Backlog (a plan for the Sprint)", "A project charter", "A requirements document"],
          correct_answer_index: 1,
          explanation: "Developers create a plan for the Sprint, which is the Sprint Backlog."
        },
        {
          question_text: "How do Developers ensure quality?",
          scenario_context: "There's debate about when and how to ensure quality.",
          options: ["Wait for QA phase", "Instilling quality by adhering to a Definition of Done", "Only test at the end", "Let the Scrum Master handle it"],
          correct_answer_index: 1,
          explanation: "Developers instill quality by adhering to a Definition of Done."
        },
        {
          question_text: "How often should Developers adapt toward the Sprint Goal?",
          scenario_context: "The team wants to know when to make adjustments.",
          options: ["Weekly", "Each day", "Only during Sprint Review", "Never during a Sprint"],
          correct_answer_index: 1,
          explanation: "Developers adapt their plan each day toward the Sprint Goal."
        },
        {
          question_text: "What accountability do Developers have to each other?",
          scenario_context: "A developer is consistently missing commitments but no one says anything.",
          options: ["None", "Holding each other accountable as professionals", "Only the Scrum Master holds them accountable", "Only for their own work"],
          correct_answer_index: 1,
          explanation: "Developers hold each other accountable as professionals."
        },
        {
          question_text: "What happens if the Scrum Team is too large?",
          scenario_context: "Your 15-person team is experiencing communication problems.",
          options: ["Add more meetings", "Consider reorganizing into multiple cohesive Scrum Teams", "Remove the least productive members", "Add a project manager"],
          correct_answer_index: 1,
          explanation: "If a team becomes too large, consider reorganizing into multiple cohesive Scrum Teams."
        },
        {
          question_text: "Who is responsible for all product-related activities?",
          scenario_context: "Stakeholders are confused about who to go to for product decisions.",
          options: ["The Project Manager", "The Scrum Team as a whole", "Only the Product Owner", "Only the Developers"],
          correct_answer_index: 1,
          explanation: "The Scrum Team is responsible for all product-related activities."
        },
        {
          question_text: "What does self-managing mean for a Scrum Team?",
          scenario_context: "A manager wants to know who assigns work to the team.",
          options: ["No management is needed", "They internally decide who does what, when, and how", "Each person works independently", "The Scrum Master manages everything"],
          correct_answer_index: 1,
          explanation: "Self-managing means the team internally decides who does what, when, and how."
        },
        {
          question_text: "What skills should be present in a Scrum Team?",
          scenario_context: "You're forming a team and deciding what expertise is needed.",
          options: ["Only development skills", "Only the most common skills", "All skills needed to create value each Sprint", "Skills determined by management"],
          correct_answer_index: 2,
          explanation: "Scrum Teams are cross-functional, having all skills needed to create value each Sprint."
        },
        {
          question_text: "How should multiple Scrum Teams on the same product coordinate?",
          scenario_context: "Three Scrum Teams are working on one product.",
          options: ["They should have separate Product Backlogs", "They share one Product Backlog and one Product Owner", "Each should have their own Product Owner", "Coordination isn't needed"],
          correct_answer_index: 1,
          explanation: "Multiple Scrum Teams working on the same product share one Product Backlog and one Product Owner."
        },
        {
          question_text: "What is NOT a responsibility of the Product Owner?",
          scenario_context: "A Product Owner is unsure what's outside their role.",
          options: ["Developing and communicating the Product Goal", "Ordering the Product Backlog", "Managing the development team's daily work", "Ensuring the Product Backlog is transparent"],
          correct_answer_index: 2,
          explanation: "The Product Owner manages the Product Backlog, not the development team's daily work."
        },
        {
          question_text: "How should the Product Goal be communicated?",
          scenario_context: "Stakeholders don't understand where the product is heading.",
          options: ["Keep it confidential", "Developing and explicitly communicating the Product Goal", "Only tell the Developers", "Post it once and forget about it"],
          correct_answer_index: 1,
          explanation: "The Product Owner is responsible for developing and explicitly communicating the Product Goal."
        },
        {
          question_text: "What does the Scrum Master do for the Developers?",
          scenario_context: "Developers are struggling to self-manage effectively.",
          options: ["Manages them directly", "Coaches them in self-management and cross-functionality", "Does their work for them", "Reports their problems to management"],
          correct_answer_index: 1,
          explanation: "The Scrum Master coaches the team members in self-management and cross-functionality."
        },
        {
          question_text: "What is the Scrum Master's role regarding the Definition of Done?",
          scenario_context: "The team doesn't have a clear Definition of Done.",
          options: ["Writes it for the team", "Helps the Scrum Team focus on creating high-value Increments that meet the Definition of Done", "It's not their concern", "Enforces it strictly"],
          correct_answer_index: 1,
          explanation: "The Scrum Master helps the Scrum Team focus on creating high-value Increments that meet the Definition of Done."
        },
        {
          question_text: "How does the Scrum Master serve stakeholders?",
          scenario_context: "Stakeholders don't understand how to interact with the Scrum Team.",
          options: ["Acts as a buffer to prevent all contact", "Helps stakeholders understand and enact an empirical approach for complex work", "Takes stakeholder requirements directly", "Manages stakeholder expectations through status reports"],
          correct_answer_index: 1,
          explanation: "The Scrum Master helps stakeholders understand and enact an empirical approach for complex work."
        },
        {
          question_text: "Who ensures that Scrum events are positive and productive?",
          scenario_context: "Team meetings are running long and unproductive.",
          options: ["The Product Owner", "The Scrum Master", "Each attendee", "Management"],
          correct_answer_index: 1,
          explanation: "The Scrum Master ensures that all Scrum events take place and are positive, productive, and kept within the timebox."
        },
        {
          question_text: "What should Developers do if the Sprint Goal becomes unreachable?",
          scenario_context: "Mid-Sprint, the team realizes they can't meet the Sprint Goal.",
          options: ["Work overtime to complete everything", "Communicate with the Product Owner about scope negotiation", "Wait until Sprint Review to mention it", "Cancel the Sprint immediately"],
          correct_answer_index: 1,
          explanation: "Developers should communicate with the Product Owner to negotiate the scope of the Sprint Backlog."
        },
        {
          question_text: "How do Developers demonstrate their professionalism?",
          scenario_context: "A developer wants to know how to act professionally in Scrum.",
          options: ["By following orders without question", "By holding each other accountable as professionals", "By working independently", "By reporting only good news"],
          correct_answer_index: 1,
          explanation: "Developers hold each other accountable as professionals."
        },
        {
          question_text: "What makes a Scrum Team effective?",
          scenario_context: "Leadership wants to understand what contributes to team success.",
          options: ["Strict management oversight", "The Scrum Master is accountable for the Scrum Team's effectiveness", "Having the most experienced developers", "Working longer hours"],
          correct_answer_index: 1,
          explanation: "The Scrum Master is accountable for the Scrum Team's effectiveness."
        },
        {
          question_text: "Who decides the ordering of the Product Backlog?",
          scenario_context: "Multiple stakeholders are arguing about priorities.",
          options: ["The Scrum Master", "Stakeholders by voting", "The Product Owner", "The Developers"],
          correct_answer_index: 2,
          explanation: "Ordering the Product Backlog is a responsibility of the Product Owner."
        },
        {
          question_text: "Can someone outside the Scrum Team change the Product Backlog?",
          scenario_context: "An executive wants to add items directly to the Product Backlog.",
          options: ["Yes, anyone can modify it", "No, they must convince the Product Owner", "Only the CEO can", "The Scrum Master decides"],
          correct_answer_index: 1,
          explanation: "No one can force changes to the Scrum Team's backlog. Those wanting changes must convince the Product Owner."
        },
        {
          question_text: "What collaborative approach does the Scrum Team take?",
          scenario_context: "A new team member wants to understand teamwork expectations.",
          options: ["Each person works alone", "Stakeholders tell them exactly what to do", "They work together with stakeholders on a Sprint", "Only during meetings"],
          correct_answer_index: 2,
          explanation: "The Scrum Team works with stakeholders to understand and solve complex problems together."
        },
        {
          question_text: "How does the Scrum Master help remove barriers?",
          scenario_context: "The team keeps running into organizational obstacles.",
          options: ["Escalates everything immediately", "Removes barriers between stakeholders and Scrum Teams", "Ignores organizational issues", "Only handles technical barriers"],
          correct_answer_index: 1,
          explanation: "The Scrum Master removes barriers between stakeholders and Scrum Teams."
        },
        {
          question_text: "What focus should Developers have during a Sprint?",
          scenario_context: "Team members are being pulled in multiple directions.",
          options: ["Whatever management needs", "Creating any aspect of a usable Increment", "Only their assigned tasks", "Personal development goals"],
          correct_answer_index: 1,
          explanation: "Developers are committed to creating any aspect of a usable Increment each Sprint."
        },
        {
          question_text: "What defines whether a Scrum Team member is a Developer?",
          scenario_context: "A business analyst wants to know their role on the Scrum Team.",
          options: ["Their job title", "Their commitment to creating aspects of a usable Increment", "Whether they write code", "Their years of experience"],
          correct_answer_index: 1,
          explanation: "Developers are defined by their commitment to creating any aspect of a usable Increment each Sprint."
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if course already exists
    const { data: existingCourse } = await supabaseAdmin
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

    // Create course
    const { data: course, error: courseError } = await supabaseAdmin
      .from("courses")
      .insert({
        title: courseData.title,
        description: courseData.description,
        is_published: true,
      })
      .select()
      .single();

    if (courseError) throw courseError;

    // Create chapters, videos, quizzes, and questions
    for (const chapterData of courseData.chapters) {
      const { data: chapter, error: chapterError } = await supabaseAdmin
        .from("chapters")
        .insert({
          course_id: course.id,
          title: chapterData.title,
          description: chapterData.description,
          order_index: chapterData.order_index,
        })
        .select()
        .single();

      if (chapterError) throw chapterError;

      // Create videos for this chapter
      for (const videoData of chapterData.videos) {
        const { data: video, error: videoError } = await supabaseAdmin
          .from("videos")
          .insert({
            chapter_id: chapter.id,
            title: videoData.title,
            description: videoData.description,
            order_index: videoData.order_index,
          })
          .select()
          .single();

        if (videoError) throw videoError;

        // Create mini quiz for this video
        const { data: miniQuiz, error: quizError } = await supabaseAdmin
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

        // Create questions for mini quiz
        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          await supabaseAdmin
            .from("quiz_questions")
            .insert({
              quiz_id: miniQuiz.id,
              question_text: q.question_text,
              scenario_context: q.scenario_context,
              options: q.options,
              correct_answer_index: q.correct_answer_index,
              explanation: q.explanation,
              order_index: i,
            });
        }
      }

      // Create chapter end quiz
      const { data: endQuiz, error: endQuizError } = await supabaseAdmin
        .from("quizzes")
        .insert({
          chapter_id: chapter.id,
          quiz_type: "chapter_end",
          passing_score: 100,
        })
        .select()
        .single();

      if (endQuizError) throw endQuizError;

      // Create questions for chapter end quiz
      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        await supabaseAdmin
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
      }
    }

    return new Response(
      JSON.stringify({ 
        message: "Course created successfully", 
        courseId: course.id,
        chapters: courseData.chapters.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
