/**
 * Full lecture scripts for AI Mastery Course — Modules 4, 5, and 6.
 * Each script is 500–800 words of what Professor Didier would SAY during a live class.
 * Tone: warm, encouraging, expert. Includes real examples and practical tips.
 */

const scripts: Record<string, string> = {

  "4.1": `Welcome back, mi gente! Today we are diving into something that is transforming how software gets built — GitHub Copilot and Cursor. Now, I know what some of you are thinking: "Professor Didier, I'm a PM, not a developer. Why do I need to know about coding tools?" Great question. Here is why: if you don't understand what your developers are working with, you cannot remove their impediments, you cannot plan capacity accurately, and you cannot have credible conversations with your engineering leads.

Let me start with GitHub Copilot. Copilot is an AI pair programmer that sits right inside VS Code or JetBrains. It suggests code completions, writes entire functions, and even generates unit tests — all in real time. The data from GitHub's own research shows developers using Copilot complete tasks about 55 percent faster and feel more satisfied doing it. That is not a small number. If your team of eight developers each saves two hours a day on boilerplate code, that is sixteen developer-hours freed up every single day for the complex, creative work that actually moves your product forward.

Now, Cursor takes a different approach. Instead of being a plugin, Cursor is an entire editor built around AI from the ground up. It has deeper context awareness — it can read your whole codebase and give suggestions that understand how your services connect. Think of Copilot as an excellent autocomplete on steroids, and Cursor as having an AI architect sitting next to your developer who understands the full system.

So what does this mean for you as a PM or Scrum Master? Three things.

First, capacity planning changes. When your team adopts Copilot or Cursor, you should not double the sprint scope on day one. What I have seen work is this: give the team two to three sprints to ramp up. Track their velocity. You will typically see a 20 to 40 percent improvement after that ramp-up period. Adjust gradually, based on real data — not vendor promises.

Second, track the right metrics. Lines of code is a vanity metric — ignore it. What you want to measure is PR cycle time, which is how long it takes from when a developer opens a pull request to when it gets merged. You also want to track developer satisfaction scores and bug introduction rates. If Copilot is generating code faster but introducing more bugs, that is not a win. You need the full picture.

Third, and this is important — these tools do not replace developers. I had a VP once ask me, "If Copilot writes the code, do we need fewer engineers?" The answer is no. What happens is your engineers spend less time on repetitive boilerplate and more time on architecture decisions, complex business logic, and system design. The work shifts from mechanical to strategic. Your team gets better, not smaller.

Here is a practical tip I want you to take away today. Schedule a 30-minute demo with your tech lead. Ask them to show you Copilot or Cursor in action on a real task. Watch how they use it. Ask what it is good at and where it falls short. That hands-on understanding will make you a better PM immediately, because the next time a developer says "this integration is complex," you will understand whether AI can help accelerate it or whether it genuinely requires deep human thinking.

One more thing — if a developer on your team says Copilot is slowing them down, do not force them to use it. Investigate. Maybe they need configuration help, maybe the tool is not suited to the language they work in, or maybe they need training on how to write effective prompts for the AI. Support them, do not mandate. Adoption works through value, not through policy.

Alright, to wrap up: Copilot and Cursor are game-changers for developer productivity. Your job as a PM is to understand what they do, plan for the productivity ramp-up, track meaningful metrics, and support your team through adoption. That is how you become the PM every engineering team wants to work with. Let us move on!`,


  "4.2": `Alright everyone, let us talk about something that causes pain on almost every software team — code review. You know the scenario: a developer finishes their work, opens a pull request, and then it sits there. For hours. Sometimes days. Waiting for a reviewer. Meanwhile, the developer context-switches to something else, the reviewer finally gets to it, leaves fifteen comments, and now we are in a back-and-forth that burns through the sprint. Sound familiar?

AI-powered code review is changing this completely. Tools like CodeRabbit, GitHub Copilot code review, Sourcery, and Amazon CodeGuru can now provide instant first-pass review on every pull request the moment it is opened. And I mean instant — within seconds.

Here is what these tools actually do. They scan the code for common bugs, security vulnerabilities, performance issues, and style inconsistencies. CodeRabbit, for example, will read your PR diff, understand the context of the change, and leave specific, line-level comments — just like a human reviewer would. It might say, "This SQL query is vulnerable to injection — use parameterized queries instead." Or, "This function has a time complexity of O(n squared) — consider using a hash map for O(n) lookup."

Now, does this replace your senior developers' code reviews? Absolutely not. And this is a critical point I need you to understand as PMs and Scrum Masters. AI handles the mechanical layer: syntax issues, known vulnerability patterns, style guide compliance, and common anti-patterns. Humans still need to review architecture decisions, business logic correctness, and design patterns. Think of it as a layered approach — AI is the first pass, humans are the second.

Let me give you a real example. I worked with a team that had an average time-to-first-review of 14 hours. That means every pull request sat for over half a day before anyone even looked at it. After implementing AI code review, that dropped to under 2 minutes for the AI first pass, and human reviewers could then focus on the substantive issues. Their overall PR cycle time dropped from 3 days to 1 day. That is a massive delivery acceleration.

Here is what you should track to measure impact. Time-to-first-review — how quickly does the first feedback arrive? PR cycle time — from open to merge, how long does it take? Bug escape rate — are fewer bugs reaching production? And reviewer workload — are your senior devs spending less time on tedious review comments and more time on mentoring and architecture?

Now, let me address the human side, because this matters. When you introduce AI code review, some senior developers will feel threatened. They have built their identity around being the gatekeeper of code quality. Your job as a Scrum Master is to reframe this. Tell them: "AI is handling the boring part — the semicolons, the null checks, the style guide violations. Now you get to focus on what you actually love: the design discussions, the architecture debates, and mentoring junior developers."

Here is your action item from this lesson. Talk to your team about their current PR review pain points. Then look at tools like CodeRabbit — they have a free tier for open source and affordable plans for private repos. Run a two-week pilot on a non-critical repo. Compare the before-and-after metrics. When you bring data to your sprint retrospective showing that PR cycle time dropped by 50 percent, you will have buy-in from the entire team.

One final tip: if AI flags a security vulnerability, do not just fix it and move on. Add that check to your Definition of Done. Over time, you are building a security-aware culture powered by AI, not just patching individual issues. That is how great Scrum Masters think — systematically. Let us keep going!`,


  "4.3": `Welcome to one of my favorite topics — AI for test automation and quality assurance. If you have ever been on a team where testing is the bottleneck — where stories are "done" but stuck in QA for days — this lesson is going to change how you think about quality.

Here is the traditional problem. A developer writes a feature. Then someone — either the developer or a QA engineer — has to write tests. Unit tests, integration tests, maybe end-to-end tests. This takes time. A lot of time. Studies show that writing tests typically takes 30 to 50 percent of the total development effort for a story. And because testing feels less exciting than building features, it often gets cut when the sprint is running behind schedule. What happens then? Bugs reach production. Users suffer. The team firefights. Sound familiar?

AI test generation tools like Codium AI, Diffblue, and GitHub Copilot's test generation feature are solving this problem. These tools analyze your code changes and automatically generate test cases. Not just happy-path tests — they identify edge cases and boundary conditions that human testers often miss.

Let me give you a concrete example. Say your developer writes a function that calculates a discount based on order amount. A human tester might write three tests: no discount under 50 dollars, 10 percent off over 100 dollars, and 20 percent off over 200 dollars. An AI test generator will write those three plus: what happens with zero dollars? Negative amounts? The exact boundary values of 50, 100, and 200? What about extremely large numbers? What about non-numeric input? It systematically covers scenarios that humans skip because we think in happy paths.

Now, here is how this impacts your role as a PM or Scrum Master. First, you should update your Definition of Done. Add a line item that says: "AI-generated tests reviewed and passing." This does not mean the team blindly accepts every test the AI creates. They review them, make sure they are meaningful, and keep the ones that add value. But the AI does the heavy lifting of generating the initial test suite.

Second, track test coverage as a team metric. I worked with a team whose test coverage went from 40 percent to 78 percent in just two sprints after adopting AI test generation. That is a huge jump. But — and this is important — you need to verify the quality of those tests, not just the quantity. A test that passes 100 percent of the time but never actually catches a bug is useless. Look at mutation testing scores to verify your tests are actually effective.

Third, understand how this affects velocity. When AI handles test generation, stories move through the pipeline faster. Your team is not stuck in a testing bottleneck. I have seen teams increase their throughput by 25 to 30 percent just by removing the QA bottleneck with AI-assisted testing.

Here is a practical tip for your next sprint planning. When the team estimates a story, ask: "Are we factoring in AI-assisted testing?" If your team is still estimating as if they are writing every test by hand, your estimates are too high. Help the team recalibrate their estimates based on the new tooling reality.

One word of caution though. AI-generated tests are excellent for mechanical coverage — edge cases, boundary conditions, null checks. But they do not replace human-written tests for business logic. Your QA engineer still needs to write tests that validate business rules, user workflows, and integration scenarios that require domain knowledge. The best approach is a partnership: AI covers the mechanical base, humans add the business intelligence layer.

For your homework, I want you to ask your team one question: "What percentage of our bugs in the last three sprints would have been caught by better test coverage?" If the answer is more than 20 percent, you have a strong case for AI test generation. Bring the data, suggest a pilot, and measure the results. That is how data-driven PMs operate. See you in the next lesson!`,


  "4.4": `Alright, let us get into something that is the backbone of modern software delivery — your CI/CD pipeline. Continuous Integration, Continuous Deployment. If the pipeline is healthy, your team ships fast. If the pipeline is broken or slow, everything grinds to a halt. And as a PM or Scrum Master, understanding pipeline health is directly tied to your ability to forecast delivery.

Here is what I see on too many teams. The build takes 45 minutes. Tests randomly fail — not because the code is broken, but because the tests are flaky. Deployments happen once a week because everyone is scared of breaking production. And when something does break, it takes hours to figure out what went wrong. AI is transforming every single one of these pain points.

Let us start with flaky tests. A flaky test is one that passes sometimes and fails sometimes, with the same code. They are the bane of every development team. AI tools like BuildPulse and Launchable analyze your test history to identify which tests are flaky. They can quarantine those tests — move them out of the critical path so they stop blocking deployments — while still running them separately so the team can fix them. I worked with a team that had 12 flaky tests blocking their pipeline three to four times a week. After AI-based quarantine, their pipeline reliability went from 70 percent to 98 percent overnight.

Next, build time optimization. AI tools analyze your build pipeline and suggest improvements. Maybe your test suite can be parallelized. Maybe certain build steps can be cached. Maybe tests can be reordered so the fastest-failing ones run first, giving developers quicker feedback. Tools like Launchable use machine learning to predict which tests are most likely to fail based on the code changes, so you run those first. This can cut your effective build time by 50 to 70 percent.

Then there is predictive deployment. This is powerful. AI analyzes your deployment history and current code changes to flag risky deployments before you push that button. It might say, "This deployment touches the payment module, which has had three incidents in the past month. Risk level: high. Recommend deploying during low-traffic hours with extra monitoring." As a PM, this is gold. You can proactively plan around risky deploys instead of reacting to incidents.

And finally, auto-healing pipelines. When a build fails because of a transient issue — a network timeout downloading a dependency, a temporary resource limit — AI-powered pipelines automatically retry. No human intervention needed. The developer does not even know it happened. The pipeline just works.

So what should you be tracking as a PM? The four DORA metrics. Deployment frequency — how often you ship. Lead time for changes — from commit to production. Change failure rate — what percentage of deployments cause incidents. And Mean Time To Recovery, MTTR — how fast you recover when something breaks. These four metrics are the gold standard for measuring delivery performance, and AI pipeline optimization improves all four.

Here is your practical takeaway. In your next one-on-one with your tech lead or DevOps engineer, ask three questions. One: "What is our current build time, and what would cutting it in half mean for the team?" Two: "How many times did flaky tests block our pipeline this sprint?" Three: "What percentage of our deployments fail?" Write down the answers. These are your baseline metrics. After implementing AI pipeline optimizations, you will measure again and show the improvement.

Remember, you do not need to be the one configuring these tools. Your job is to understand the metrics, advocate for pipeline improvements, and remove the organizational impediments that prevent your team from shipping faster. When the VP asks, "Why can't we ship faster?" you want to have data-driven answers, not guesses. That is the AI-augmented PM in action. On to the next one!`,


  "4.5": `Hello everyone! Today we are going to talk about something that every PM dreads — production incidents. That 2 AM alert. That Slack message from the VP saying, "The app is down." That scramble to figure out what went wrong. AI-powered monitoring with tools like Datadog is changing how we detect, diagnose, and resolve these incidents. And as a PM or Scrum Master, understanding this gives you a superpower.

Let me set the scene with a real scenario. Last year, I was advising a team whose e-commerce application started running slow during a flash sale. Without AI monitoring, here is what would have happened: users would complain on social media, customer support would get flooded, someone would escalate to engineering, and maybe 30 to 45 minutes later the team would start investigating. By then, you have lost revenue, damaged user trust, and your team is in firefighting mode.

With Datadog's AI-powered monitoring, here is what actually happened: the anomaly detection system noticed response times climbing 15 minutes before users felt any impact. It automatically correlated the spike with a database query that was not optimized for the sale traffic patterns. The on-call engineer got a single alert — not 47 separate ones — with a probable root cause and recommended action. The issue was resolved in 8 minutes. Users never noticed. That is the power of AI monitoring.

Let us break down the key capabilities. First, anomaly detection. Traditional monitoring uses static thresholds — alert when CPU is above 80 percent, alert when response time exceeds 2 seconds. The problem? These thresholds do not account for normal patterns. Your traffic is higher during business hours, spikes during marketing campaigns, and drops on weekends. AI learns your system's normal behavior and alerts on actual anomalies, not just threshold breaches. This reduces false alerts dramatically while catching real issues earlier.

Second, incident correlation. During a major incident, your monitoring system might fire 50 to 100 alerts. Database slow. API timeout. Error rate up. Memory usage high. Traditionally, your team has to sort through all of these to find the root cause. AI correlation groups all related alerts into a single incident and identifies the most likely root cause. Instead of 50 alerts, your team sees one incident with a probable explanation.

Third, auto-generated root cause analysis. After an incident, Datadog's AI can produce an initial RCA that traces the chain of events: "At 14:32, a deployment introduced a change to the search service. At 14:35, search response times increased by 300 percent. At 14:37, the API gateway began returning 503 errors due to search timeout cascading." This gives your team a head start on the postmortem.

Now, here is where you come in as a PM. Your role during incidents is not to fix the code. It is to facilitate the response, communicate with stakeholders, and drive improvements afterward. When you understand the monitoring dashboard, you can look at Datadog during an incident and tell your stakeholders, "The team has identified the root cause. It is related to the search service deployment. Estimated resolution is 15 minutes." That is calm, informed communication — and it comes from understanding your tools.

Track MTTR as your primary operational metric. Mean Time To Resolution. If your MTTR is trending down sprint over sprint, your team is getting better at incident response. If it is trending up, something is wrong — maybe the system is getting more complex without corresponding observability improvements.

Here is your action item: ask your tech lead to give you a 20-minute tour of your monitoring dashboard. Learn where to find the key metrics: error rates, response times, and active incidents. You do not need to understand every graph, but knowing where to look during an incident makes you an effective facilitator instead of a spectator. That is a game-changer for your credibility with the engineering team.`,


  "4.6": `Alright, let us talk about something that bridges the gap between code and users — deployment intelligence. Specifically, how Vercel's AI-powered platform is changing how modern teams deploy and deliver applications. Even if your team does not use Vercel today, the concepts we cover here apply to any modern deployment platform.

Let me start with preview deployments, because this is going to change your stakeholder management game. In the traditional world, when a developer finishes a feature, the PM has to wait until it is deployed to a staging environment, coordinate a demo time, and then show it to stakeholders. With Vercel, every single pull request automatically gets its own unique preview URL. The feature is live, running, clickable — and you can share that URL with your VP, your product owner, or your customer in a Slack message. "Hey, here is the new checkout flow. Click this link and try it yourself."

Do you see what this does for your sprint review? Instead of spending 30 minutes doing live demos that might break, your stakeholders have already played with the features before the meeting. The sprint review becomes a discussion about what they experienced, not a presentation. That is a higher-quality conversation, and it happens because the technology removed the demo bottleneck.

Now let us talk about deployment intelligence — the AI layer. Vercel's platform analyzes your deployments and provides performance analytics automatically. It tracks Core Web Vitals — Largest Contentful Paint, First Input Delay, Cumulative Layout Shift — which are the metrics Google uses to rank websites. When your team deploys a change that makes the page load slower, Vercel flags it automatically. You see a regression before users feel it.

Here is a real scenario I encountered. A team deployed a beautiful new hero image on their landing page. It looked amazing. But it was a 4-megabyte unoptimized PNG. Vercel's performance analytics immediately showed that Largest Contentful Paint went from 1.2 seconds to 4.8 seconds. The team caught it within minutes and optimized the image before most users ever loaded the page. Without that AI-powered performance monitoring, they might not have noticed until SEO rankings dropped weeks later.

Edge-first deployment is another concept you need to understand. Traditional deployment puts your application on servers in one location — maybe US East. Users in Tokyo, London, or Sao Paulo experience latency because every request travels across the world. Edge deployment pushes your application to servers in dozens of locations globally. The user in Tokyo hits a server in Tokyo. The user in London hits a server in London. Load times drop dramatically everywhere. As a PM, this matters because page load time directly impacts user engagement and conversion. Amazon found that every 100 milliseconds of latency cost them 1 percent in sales. Every. Hundred. Milliseconds.

So how do you use all of this as a PM? Three practical tips. First, make preview URLs part of your workflow. Every time a feature PR is opened, share the preview URL with relevant stakeholders. Get feedback before the sprint review, not during it. This eliminates the "I didn't know it would look like that" surprise.

Second, add Core Web Vitals to your sprint dashboard. You do not need to understand the technical details — just track the trend lines. If they are green, great. If they are trending red after a deployment, raise it with the team.

Third, use deployment data in your retrospectives. Vercel gives you deployment frequency, success rates, and rollback counts. These are delivery health metrics. If your team deployed 15 times last sprint with zero rollbacks, that is a sign of a healthy, confident team. If they deployed twice with one rollback, there is a process issue to investigate.

One last thought. The best PMs I know treat deployment not as a technical event but as a delivery event. Every deployment is value reaching users. The faster and safer you can deploy, the faster you deliver value. Tools like Vercel with AI intelligence make that possible. Embrace it, learn it, and use it to accelerate your team. See you in the lab!`,


  "4.7": `Welcome to our lab session! This is where we roll up our sleeves and build something real. Today, you are going to create a delivery velocity dashboard that measures and reports the impact of AI tools on your team's delivery performance. This is not a theoretical exercise — this is something you can take back to your team on Monday and start using.

Let me tell you why this matters with a story. I worked with a PM named Sarah who convinced her organization to invest in Copilot licenses, AI code review, and AI testing tools. Three months later, her VP asked, "What did we get for that investment?" Sarah did not have data. She had feelings — "the team seems faster" — but no numbers. She lost the budget for the next quarter. Do not be Sarah. Measure everything.

Here is what we are building. A dashboard that tracks the four DORA metrics — the industry standard for software delivery performance — and shows the before-and-after impact of AI tool adoption.

Metric one: deployment frequency. How often does your team deploy to production? Before AI tools, maybe you deployed once a week. After AI-powered CI/CD optimization, maybe you deploy daily. That is a 5x improvement. Pull this data from your CI/CD tool — GitHub Actions, GitLab CI, Jenkins — they all expose deployment counts.

Metric two: lead time for changes. This is the time from when a developer commits code to when it is running in production. It includes code review time, build time, test time, and deployment time. AI tools impact every stage: Copilot accelerates coding, AI review speeds up the review cycle, AI testing reduces the QA bottleneck, and AI pipeline optimization cuts build time. Track the total and each component separately so you can show exactly where the improvements happened.

Metric three: change failure rate. What percentage of deployments cause a production incident? AI code review and AI testing should reduce this by catching bugs earlier. If your change failure rate drops from 15 percent to 5 percent, that is 10 percent fewer incidents. Calculate the cost of each incident — developer time to fix, lost revenue, user impact — and you have a dollar value for the improvement.

Metric four: MTTR, Mean Time To Resolution. When something does break, how fast do you recover? AI monitoring with Datadog should reduce this. Track it in minutes, and show the trend over time.

Now, here is how to build the actual dashboard. Start simple. A Google Sheet works perfectly. Create four tabs — one for each metric. Pull data weekly from your tools. Most CI/CD platforms have APIs, or you can export manually to start. Create charts that show the trend over time with a clear "AI adoption date" marker so the before-and-after is obvious.

For the presentation layer, use a simple formula. For each metric, calculate: the improvement percentage, the time saved per sprint, and the dollar value. Time saved multiplied by the average hourly rate of a developer gives you a dollar figure. Leadership loves dollar figures.

Here is a template for your executive summary: "Since adopting AI development tools 8 weeks ago, our team has improved deployment frequency by 3x, reduced lead time from 5 days to 1.5 days, decreased change failure rate from 12 percent to 4 percent, and cut MTTR from 2 hours to 35 minutes. The estimated time savings are 120 developer-hours per month, valued at approximately 18,000 dollars."

That is how you justify AI tool investment. That is how you get the budget renewed. And that is how you prove your value as an AI-augmented PM.

Your assignment: build this dashboard with your team's real data. Even if you only have two weeks of data after AI adoption, start tracking now. The earlier you establish a baseline, the more compelling your story will be. If you do not have real production data yet, use the sample dataset I have provided and practice building the dashboard with that. The skill is in the structure and the storytelling, not just the numbers. Go build it, and bring your results to the next session!`,


  "5.1": `Welcome to Module 5, everyone! We are shifting gears from delivery acceleration to something equally critical — using AI for risk management and decision making. And we are starting with one of the most powerful tools in your AI arsenal: predictive analytics for sprint and project forecasting.

Let me ask you something. How many times has a stakeholder asked, "When will this be done?" and you gave them a date that turned out to be wrong? Every PM in the room is raising their hand right now, including me. Traditional estimation is broken. We estimate with story points, we calculate average velocity, we divide remaining work by velocity, and we get a date. The problem? That single-point estimate hides enormous uncertainty. Velocity varies sprint to sprint. Scope changes. People get sick. Dependencies slip. A single number pretends none of that variability exists.

This is where Monte Carlo simulations change everything. Instead of saying "We will deliver on March 15th," a Monte Carlo simulation runs thousands of possible scenarios based on your historical data and tells you: "There is a 50 percent chance you deliver by March 10th, an 85 percent chance by March 22nd, and a 95 percent chance by April 2nd." That is a fundamentally more honest and useful answer.

Tools like Forecast.app, ActionableAgile, and even a well-prompted ChatGPT can run these simulations for you. Here is how it works in practice. You feed the tool your team's historical data — velocity per sprint, how often scope changes, how many stories get carried over. The AI runs thousands of randomized scenarios using that data and produces a probability distribution for your delivery date.

Let me give you a real example. I was coaching a team with 45 stories remaining in their backlog. Their average velocity was 12 stories per sprint, but it ranged from 8 to 16. A traditional forecast would say: 45 divided by 12 equals 3.75 sprints, so about 4 sprints. But the Monte Carlo simulation said: 50 percent chance of completing in 3 sprints, 85 percent chance in 5 sprints, and 95 percent chance in 6 sprints. The range from 3 to 6 sprints — that is the real uncertainty. And hiding it behind "about 4 sprints" would have been dishonest.

When the PM shared the probability range with the stakeholder, something magical happened. The stakeholder said, "I need 85 percent confidence for this launch date. What do we need to do to hit 3 sprints at 85 percent confidence?" That turned into a productive conversation about reducing scope or adding capacity — a real trade-off discussion instead of a fictional deadline.

Here is how to make this work in your day-to-day. First, start collecting data if you are not already. You need at least 5 to 8 sprints of historical velocity data for meaningful predictions. The more data, the better the model.

Second, update your forecasts continuously. Do not run a Monte Carlo simulation once and call it done. As new sprint data comes in, feed it into the model. After a sprint where you completed 16 stories, the forecast shifts. After a sprint where you completed 8, it shifts again. Real-time forecasting based on real data.

Third — and this is the most important tip — always present ranges, not points. Train your stakeholders to think in probabilities. "We have an 80 percent chance of delivering by date X" is honest and actionable. "We will deliver on date X" is a promise you probably cannot keep.

Fourth, use AI forecasting to have better sprint planning conversations. If the AI predicts only a 40 percent chance of completing everything in the sprint backlog, that is a signal to reduce scope during planning, not after the sprint fails.

Your practical exercise: take your last 8 sprints of velocity data and run a Monte Carlo simulation. You can use Forecast.app, or even ask ChatGPT: "Given these velocity data points, run a Monte Carlo simulation for completing 30 remaining stories." Compare the AI forecast to your gut feeling. I bet the AI shows more uncertainty than you expected. That gap is where better PM decisions live.`,


  "5.2": `Let us talk about risk management, and specifically how AI is turning the traditional risk register from a dusty document nobody reads into a living, breathing early warning system. This is one of the areas where AI adds the most value for PMs and Scrum Masters, and I am excited to show you how.

Here is the problem with traditional risk management. You create a risk register at the beginning of the project. You list risks, assign probabilities and impacts, identify mitigation strategies, and assign owners. Then what happens? The register sits in a shared drive. Maybe you review it once a month in a steering committee meeting. Someone updates a few scores. And then something goes wrong that was either not on the register or was scored "low" because conditions changed and nobody updated it. Does this sound familiar?

AI risk scoring solves this by continuously monitoring project signals and automatically re-scoring risks based on real-time data. Think of it as having a risk analyst working 24 hours a day, 7 days a week, watching every signal from your project and updating the risk register in real time.

Here is what an AI risk system can monitor. Sprint data: if velocity is declining for three consecutive sprints, the "delivery delay" risk score goes up automatically. Code metrics: if bug counts are rising or code complexity is increasing, the "quality" risk goes up. Team signals: if overtime hours are increasing or people are skipping one-on-ones, the "team burnout" risk goes up. Dependency status: if an external team's deliverables are slipping, your "dependency" risk goes up. The AI synthesizes all of these signals into a dynamic risk score.

Let me give you a practical example. I advised a team building a payment integration. At sprint 3, everything looked fine — green across the board. But the AI risk system noticed three subtle signals: the payment API documentation had been updated twice in a week by the third-party provider, two developers had asked questions about the API in the team Slack channel, and the integration stories were taking 20 percent longer than estimated. Individually, none of these would have triggered alarm bells. Together, the AI flagged "Payment Integration Risk: Medium-High" and recommended the PM investigate.

The PM called the third-party provider and discovered they were planning a breaking API change in two weeks — one that would have blown up the integration. Because the AI caught the pattern early, the team adapted their approach and avoided a two-sprint delay. That is the power of AI early warning.

Here is how to set this up practically. You do not need a fancy enterprise tool to start. You can build a basic AI risk scoring system with ChatGPT or Claude. Create a prompt that takes your project signals as input — sprint velocity trend, bug count trend, team overtime hours, scope change count, and dependency status. Ask the AI to score each risk on your register from 1 to 10 based on these signals. Run this prompt weekly, feeding in fresh data each time. You will be amazed at how well AI identifies emerging risks that your manual review misses.

For a more automated approach, tools like Forecast.app, Planview, and some Jira plugins offer built-in AI risk scoring that connects directly to your project data. They pull metrics automatically and update risk scores in real time.

Set up threshold-based alerts. When a risk score crosses from "low" to "medium," get a notification. When it crosses from "medium" to "high," get an urgent alert plus a recommended action. Do not wait for risks to become issues before you act.

Your assignment is straightforward. Take your current risk register — I know you have one, even if it is neglected — and feed the top five risks plus your current project data into ChatGPT. Ask it to re-score each risk based on the data. I guarantee at least one risk will be scored significantly differently than your manual assessment. That gap is where AI adds value. Use it, trust but verify, and make risk management a real-time practice instead of a monthly ceremony.`,


  "5.3": `Alright everyone, today we are addressing one of the most difficult problems in project management — resource optimization and capacity planning. And I want to start by being honest: most of us do capacity planning badly. We count heads, multiply by hours, subtract some percentage for meetings, and call it capacity. But the reality is so much more complex, and AI is finally giving us the tools to handle that complexity.

Here is what traditional capacity planning misses. Context-switching overhead — when a developer works on three projects, they do not deliver a third of their capacity to each. They deliver maybe 20 percent to each because of the cognitive cost of switching. Meeting load — your developer might have 6 hours of meetings a week that do not show up in your capacity calculation. PTO patterns — the team's effective capacity in December is wildly different from March. And sustainable pace — just because someone can work 60 hours one week does not mean they can sustain it.

AI capacity planning tools analyze all of these factors. Tools like Forecast.app, Tempus, and Hive use machine learning to build realistic capacity models. They look at actual historical data — not theoretical availability — to predict how much work your team can actually deliver.

Let me walk you through a real scenario. I was coaching a PM who had a team of 6 developers. On paper, the team had 240 hours per week of capacity. The PM was planning sprints based on roughly 200 hours after subtracting for meetings and overhead. But the team kept under-delivering. They were consistently completing about 70 percent of their sprint commitments.

We ran the team's actual data through an AI capacity analyzer. The results were eye-opening. Developer A was in 15 hours of meetings per week. Developer B was split across two projects with massive context-switching costs. Developer C had a pattern of taking every other Friday off. The real effective capacity was not 200 hours — it was 142 hours. Once the PM planned based on 142 hours, the team started hitting their commitments consistently. Morale went up. Predictability went up. Stakeholder trust went up.

Now, let me talk about burnout prediction, because this is where AI gets genuinely powerful. AI can analyze workload patterns to predict burnout before it happens. The signals include: increasing overtime hours over consecutive weeks, declining code quality metrics, reduced participation in team discussions, shorter commit messages (yes, this is a real signal), and increasing time between task starts and completions.

When the AI flags a burnout risk, your job as a PM or Scrum Master is not to send an email about it. You have a one-on-one conversation. You say, "Hey, I noticed you have been carrying a heavy load the last few sprints. How are you feeling? What can we take off your plate?" That human conversation, triggered by AI data, prevents burnout instead of reacting to it.

Scenario modeling is another powerful capability. What happens if we lose a developer? What if we add a contractor for three sprints? What if we reduce sprint scope by 20 percent? AI can model each scenario and show you the projected impact on velocity and delivery dates. This is incredibly valuable for planning conversations with leadership.

Here is your practical tip for this week. Build a simple capacity reality check. For each team member, track three things over the next two sprints: hours in meetings, hours of context-switching between projects, and actual hours of focused development work. Compare this to your theoretical capacity model. The gap will likely surprise you, and it explains why your sprint commitments are not being met.

Remember: AI resource optimization is not about squeezing more work out of people. It is about understanding realistic capacity so you can make honest commitments, protect your team's sustainable pace, and deliver predictably. The best PMs I know protect their team first and the timeline second, because a burned-out team delivers nothing. Use AI to see the full picture, and lead with empathy.`,


  "5.4": `Today we are going to upgrade one of the most fundamental tools in your Scrum toolkit — the burndown chart. You all know what a burndown chart is. It shows work remaining over time. If the line trends down toward zero by the end of the sprint, you are on track. Simple, right? The problem is, traditional burndowns only tell you where you have been. They do not tell you where you are going. AI-enhanced burndown analysis changes that completely.

Let me explain the difference with an example. It is Wednesday of a two-week sprint. Your traditional burndown shows that you have completed 40 percent of the work with 60 percent of the time gone. Is that good or bad? Honestly, a traditional burndown cannot tell you. Maybe the remaining 60 percent of work includes two easy stories and you will finish early. Or maybe it includes that monster integration story that always takes longer than estimated. The traditional chart treats all remaining work equally.

An AI-enhanced burndown looks at the specific stories remaining, their complexity, historical completion patterns for similar stories, the team's current velocity trend within the sprint, and any blockers in progress. It then tells you: "Based on current patterns, there is a 72 percent probability of completing all sprint items by Friday. The payment integration story is the primary risk — similar stories have taken 40 percent longer than estimated." That is actionable intelligence.

Now let us talk about scope creep detection, because this is a silent killer of sprints and AI is excellent at catching it. Scope creep in a sprint looks like this: the sprint started with 10 stories. By day 3, two more stories were added because "they are small" or "the PO says they are urgent." By day 7, another story was split into two, adding net new work. The total scope has grown by 30 percent, but nobody formally acknowledged it.

AI detects this pattern and alerts you. It calculates the scope change percentage in real time and correlates it with completion probability. When scope grows by 15 percent mid-sprint, the AI might say: "Sprint scope has increased by 15 percent. Based on current velocity, completion probability dropped from 85 percent to 58 percent. Recommend removing 2 stories to restore 80 percent confidence." As a Scrum Master, that is exactly the data you need to have a productive conversation with the Product Owner about protecting the sprint goal.

Here is how to use AI burndown insights in your daily standup. Do not replace the standup with an AI report — that misses the point entirely. Instead, use the AI insights as a conversation starter. Start the standup by sharing: "Our AI burndown shows 65 percent completion probability for this sprint. The two highest-risk items are the search refactor and the API migration. Let us hear from the folks working on those." This focuses the standup on what actually matters instead of going around the room hearing "I worked on my task yesterday and will work on it today."

The AI-generated narrative commentary is another powerful feature. Instead of just showing numbers, AI tools like LinearB or Pluralsight Flow generate written analysis: "Sprint 24 is tracking 12 percent behind Sprint 23 at the same point. The primary difference is the database migration story, which has been in progress for 4 days versus the 2-day estimate. Recommend a team swarming approach to unblock." This narrative turns data into action.

For your practical application, here is what I want you to do. Take your current sprint's burndown data and feed it into ChatGPT with this prompt: "Given the following sprint data — total stories, completed stories, days remaining, and average daily completion rate — what is the probability of completing all items? What are the risks?" Compare the AI's assessment to your gut feeling. If there is a gap, investigate why. Over time, you will calibrate your intuition with AI-powered data, and your sprint forecasting will become remarkably accurate.

One more thing — track scope change percentage for every sprint. Even a simple count of "stories added after sprint start" creates accountability. When you show the team that scope grew by 25 percent in three of the last four sprints, it drives a powerful retrospective conversation about protecting sprint commitments.`,


  "5.5": `Let us dive into something that separates good PMs from great ones — data-driven decision making. Every day, you make dozens of decisions. Should we cut scope or extend the timeline? Should we add a team member or reduce parallel workstreams? Should we invest in tech debt reduction or push for the next feature? Most PMs make these decisions based on experience and gut feeling. The best PMs combine their intuition with AI-powered data analysis.

Here is the framework I want you to adopt. When you face a decision, structure it as a data problem before asking for opinions. That means defining three things: the options on the table, the constraints you are working within, and the criteria that matter most. Then feed this structure to AI for analysis.

Let me walk through a real example. A PM I was coaching faced this situation: the team had committed to a launch date 6 weeks out, but after 2 sprints, they were 20 percent behind. The options were: cut 20 percent of scope, extend the deadline by 2 weeks, add 2 contractors, or have the team work overtime for 4 weeks. The constraints were: the marketing campaign was already scheduled, the budget had some flexibility, and the team was already working at high capacity.

She put this into Claude with all the project data — velocity trends, story sizes, team capacity, and contractor onboarding overhead. The AI analysis came back with a clear recommendation: Option 1 (cut scope) combined with a partial Option 2 (1-week extension) gave the highest probability of success with the lowest risk. The AI showed that adding contractors would actually slow the team for the first 2 weeks due to onboarding overhead (Brook's Law in action), and overtime would increase the bug rate by an estimated 30 percent based on industry data.

The PM presented this analysis to her stakeholder — not just the recommendation, but the trade-off analysis for each option. The stakeholder chose the scope cut plus one-week extension, and the project launched successfully. The key insight: the AI did not make the decision. The PM structured the problem, the AI analyzed the trade-offs, and the stakeholder chose based on business priorities.

Here is how you can do this in practice. Build a decision template that you use consistently. Include: the decision to be made, the options being considered, quantitative data for each option (cost, time impact, risk level), qualitative factors (team morale, stakeholder relationships, market timing), constraints and priorities, and the AI's analysis of trade-offs. This template forces rigor into every decision and creates a record you can learn from.

When AI and your intuition disagree, that is not a problem — it is a signal. Dig into the disagreement. Maybe the AI does not have context about a stakeholder relationship that makes one option politically impossible. Or maybe your intuition is anchored to an experience from a different project that does not apply here. The investigation itself improves your decision.

One critical practice I want you to adopt: document every significant AI-assisted decision. Write down what the AI recommended, what you decided, and why. Then, three months later, review the outcomes. Did the AI's prediction hold? Did your override work out? This feedback loop makes both you and your AI prompts better over time. I call it a "decision journal," and it is one of the most powerful tools for PM growth I have ever seen.

Let me leave you with a practical tip. Start small. Next time you face a scope-timeline-resource trade-off, take 15 minutes to structure it as a data problem and run it through Claude or ChatGPT. Include your constraints, your velocity data, and your options. Compare the AI analysis to your instinct. You do not have to follow the AI — but having that second perspective, grounded in data, will make your decision more robust.

The goal is not to outsource your judgment to AI. The goal is to augment your judgment with data-driven analysis so that every decision you make is informed by both experience and evidence. That is the AI-augmented PM at their best.`,


  "5.6": `Welcome to our second lab session! Today we are building something that will become your daily command center — an AI-powered project health dashboard that combines everything we have learned in this module: forecasting, risk scoring, resource analysis, and burndown prediction. By the end of this lab, you will have a single view that tells you the health of your project at a glance.

Let me tell you why this matters. I coached a PM who had data scattered across six different tools — Jira for sprint data, Google Sheets for risk registers, Confluence for meeting notes, Slack for team sentiment, GitHub for code metrics, and Datadog for operational health. Every morning, she spent 45 minutes checking each tool to understand her project's status. Forty-five minutes, every single day, just to build a mental picture that was already outdated by the time she finished.

We built her an AI-powered dashboard that pulled from all six sources and presented a single health view. Her morning check dropped from 45 minutes to 5 minutes. More importantly, the dashboard caught patterns she was missing — like the correlation between increasing bug counts and declining team sentiment that preceded a major quality issue.

Here is what your dashboard should include. Section one: sprint forecast. Display the AI-generated completion probability for the current sprint. Show the confidence range — "72 percent to 88 percent chance of completing the sprint goal." Include the scope change percentage so everyone can see if scope creep is affecting the forecast. Color-code it: green above 80 percent, yellow between 60 and 80, red below 60.

Section two: risk heat map. Show your top 5 to 7 risks with their AI-generated scores. Color-code by severity. Include the trend arrow — is the risk increasing, stable, or decreasing? When a risk moves from yellow to red, everyone should see it immediately.

Section three: team capacity and health. Show actual capacity versus planned capacity. Include the burnout risk indicator for each team member — not by name on the shared dashboard, but as team-level aggregates. Display the sustainable pace metric: are you above or below the team's sustainable delivery rate?

Section four: delivery metrics. The four DORA metrics from Module 4: deployment frequency, lead time, change failure rate, and MTTR. Show the trend for each, comparing to the team's baseline and to industry benchmarks.

Section five: AI-generated narrative. This is the secret weapon. Use AI to generate a two-paragraph written summary of project health that updates daily. Something like: "Sprint 12 is tracking at 78 percent completion confidence, slightly below the team average of 83 percent. The primary risk is the authentication migration, which has exceeded its estimate by 40 percent. Team capacity is at 92 percent utilization, which is above the recommended sustainable pace of 85 percent. Recommend discussing workload rebalancing in tomorrow's standup."

Now, how do you actually build this? Start with the tool you already have. If you use Notion, build it in Notion with database views and formulas. If you use Google Sheets, build it there with charts and conditional formatting. The tool does not matter — the structure does. Pull data manually for the first two weeks to prove the value. Then automate the data collection using Zapier or Make, which we will cover in Module 6.

For the AI narrative, set up a weekly automation: export your sprint data, feed it to ChatGPT or Claude with a prompt template, and paste the generated narrative into your dashboard. As you get more comfortable, automate this entire flow.

Here is your exercise. Build the first two sections — sprint forecast and risk heat map — using your current project's real data. If you do not have access to real data, use the sample dataset provided. Show the dashboard to one stakeholder this week and ask for feedback. Iterate based on what they find valuable. The best dashboards are built through use, not through design.

Set up automated alerts for two threshold breaches: sprint completion probability dropping below 70 percent, and any risk score exceeding 8 out of 10. These two alerts alone will catch most critical issues before they become crises. Now go build it!`,


  "6.1": `Welcome to our final module, everyone! This is where everything comes together. We are going to build your complete AI-powered PM toolkit, starting with one of the most practical skills you will learn in this entire course — creating custom GPTs for your PM workflow.

Let me explain why custom GPTs are a game-changer. When you use generic ChatGPT, you start from scratch every time. You type your context, explain your format preferences, describe your team's processes, and hope the output matches what you need. With a custom GPT, all of that context is baked in. You configure it once, and every time you or your team uses it, the output follows your standards automatically.

Think of it this way. Using generic ChatGPT is like hiring a brilliant consultant who knows nothing about your company. Every conversation starts with a briefing. A custom GPT is like having that same brilliant consultant after they have worked with you for six months — they know your processes, your templates, your terminology, and your preferences.

Let me walk you through building three custom GPTs that every PM should have.

GPT number one: the Sprint Report Writer. Configure it with these instructions: "You are a sprint report assistant for a Scrum team. When given sprint data — completed stories, velocity, blockers, and upcoming risks — you generate a professional sprint report following this template..." Then include your actual template. Add a knowledge file with your last three sprint reports as examples. Now, every Friday, you paste in your sprint data and get a polished report in 30 seconds that follows your exact format.

GPT number two: the Stakeholder Email Composer. This one saves me an hour every week. Instructions: "You write professional stakeholder communications for a PM. Tone is confident but transparent. Always include: current status, key achievements, risks, and next steps. Adapt formality based on the audience — executive summary for VP and above, detailed update for project teams." Feed it your stakeholder list context. Now when you need to write that tricky email to the VP about a delay, you give the GPT the facts and it drafts a message with the right tone and structure.

GPT number three: the Risk Analyzer. Instructions: "You are a project risk analyst. When given project data, you identify risks, score them on probability and impact (1-5 scale), suggest mitigation strategies, and flag any risks the PM might be overlooking. Always consider: technical risks, team risks, dependency risks, scope risks, and stakeholder risks." This one is powerful because it catches blind spots — risks you are too close to the project to see.

Now, here is what makes a custom GPT truly effective — the configuration details. First, write clear and specific instructions. Do not say "write good reports." Say "write a sprint report with exactly four sections: Summary (2-3 sentences), Completed Work (bullet list with story IDs), Risks and Blockers (table format), and Next Sprint Preview (3-5 upcoming priorities)."

Second, upload knowledge files. Your past reports, your templates, your team's Definition of Done, your project charter — these give the GPT context that makes outputs relevant to your specific project.

Third, set constraints. Tell the GPT what NOT to do: "Never make up metrics. If data is missing, ask for it. Never use jargon the stakeholder would not understand. Always flag uncertainties."

Fourth, iterate relentlessly. After every use, note what was good and what needed editing. Refine the instructions. Add examples of ideal output. A custom GPT after 10 iterations is dramatically better than the one you built on day one.

Finally, share your GPTs with your team. When everyone uses the same Sprint Report GPT, all reports follow the same format. Consistency goes up. Quality goes up. Time spent goes down. That is the power of encoding your team's knowledge into AI.

Your assignment: build one custom GPT this week. Pick the task you do most frequently — sprint reports, stakeholder emails, or backlog refinement — and build a GPT for it. Use it for one full sprint. Iterate based on results. Then share it with your team and watch the impact multiply.`,


  "6.2": `Today we are going to connect all of your AI tools into automated workflows using Zapier and Make. This is where AI goes from "a cool tool I use sometimes" to "an invisible assistant that works for me 24/7." And the best part? You do not need to write a single line of code.

Let me paint the picture of what is possible. Right now, after every team meeting, you probably do something like this: listen to the recording, write down action items, create Jira tickets for each one, send a Slack message to the team with the summary, and update your project tracker. That takes 20 to 30 minutes per meeting. With Zapier or Make, here is what happens: the meeting ends in Zoom or Google Meet, the transcript is automatically sent to ChatGPT, ChatGPT extracts action items and decisions, each action item becomes a Jira ticket with the right assignee and sprint, a summary is posted to Slack, and your Notion project tracker updates. All of this happens in under 2 minutes with zero effort from you.

Let me explain the basics quickly. Zapier and Make are no-code automation platforms that connect different apps together. They work on a trigger-action model. A trigger is something that starts the workflow — "a new meeting transcript appears in Google Drive." An action is what happens next — "send the transcript to ChatGPT." You chain actions together into a workflow, and it runs automatically every time the trigger fires.

Let me walk you through three essential automations every PM should build.

Automation one: the meeting-to-action-items pipeline. Trigger: new file in your Google Drive meetings folder. Step 1: send the transcript to OpenAI with a prompt: "Extract all action items from this meeting transcript. For each, identify the owner, deadline, and priority." Step 2: for each action item, create a Jira ticket. Step 3: post a summary to your team's Slack channel. Step 4: add a row to your project tracker spreadsheet. This single automation saves 2 to 3 hours per week for an active PM.

Automation two: the daily standup digest. Trigger: scheduled every morning at 8:45 AM, 15 minutes before standup. Step 1: pull yesterday's completed items from Jira. Step 2: pull any new blockers or flagged items. Step 3: send to ChatGPT to generate a standup preparation briefing. Step 4: post to Slack so everyone comes to standup informed. This makes your standups sharper and shorter because everyone starts with context.

Automation three: the weekly stakeholder report generator. Trigger: every Friday at 3 PM. Step 1: pull sprint data from Jira — velocity, completed stories, remaining work. Step 2: pull risk scores from your risk tracker. Step 3: send all data to ChatGPT with your report template prompt. Step 4: draft the report in Google Docs. Step 5: notify you on Slack that the draft is ready for review. You review, make minor tweaks, and send it out. What used to take an hour on Friday afternoon now takes 10 minutes.

Now, here are the critical lessons I have learned about automation. Start simple. Build a 2-step automation first — trigger and one action. Get it working. Then add steps. If you try to build a 7-step automation on day one, you will get frustrated and give up.

Always add error handling. What happens if the Jira API is down? What if ChatGPT returns an unexpected format? Build in checks and fallback paths. Zapier has built-in error handling and retry logic — use it.

Test with real data before going live. Create a test Jira project, use a sample transcript, and verify every step produces the right output. I once saw a PM's automation create 47 duplicate Jira tickets because they skipped testing. Learn from their pain.

Monitor your automations. They can break when tools update their APIs. Zapier shows you which runs succeeded and which failed. Check this weekly — it takes two minutes and prevents surprises.

Your assignment: build the meeting-to-action-items automation this week. Start with a simple version — just transcript to Slack summary. Get that working, then add the Jira ticket creation. Then add the project tracker update. Build layer by layer, and within two weeks you will have a powerful automation that saves you hours every week.`,


  "6.3": `Today we are building something that ties your entire AI toolkit together — an AI-integrated dashboard. Not just a regular dashboard with charts and numbers, but one that includes AI-generated insights, predictions, and recommendations alongside your traditional metrics. This is your command center as an AI-powered PM.

Let me start with the philosophy behind a great dashboard. Most PM dashboards are rear-view mirrors — they show you what happened. Sprint velocity last sprint. Bugs found last week. Deployment count last month. Useful? Sure. But you are driving forward while looking backward. An AI-integrated dashboard adds the windshield: where are you going, what is ahead, and what should you do about it.

Here is the structure I recommend, and I have seen this work across dozens of teams.

Layer one: the traditional metrics. These are your foundation. Sprint velocity trend, burndown chart, bug count, deployment frequency. You already know these. Display them clearly with good visual design — sparklines for trends, conditional color coding for status. Use Notion databases, Google Sheets, or a tool like Retool if you want something more polished.

Layer two: AI-generated predictions. This is where the magic happens. Next to your velocity chart, add the AI-predicted completion date with confidence intervals. Next to your bug count, add the AI-predicted quality trend. Next to your team capacity view, add the burnout risk indicator. These predictions come from the techniques we learned in Module 5 — Monte Carlo simulations, AI risk scoring, and capacity analysis.

Layer three: AI-generated narrative. This is the most underappreciated element and the most powerful. Once a day or once a week, feed your dashboard data to ChatGPT or Claude with a prompt like: "Analyze this project data and write a 3-sentence health summary. Identify the top risk and recommend one action." Post that narrative at the top of your dashboard. Executives love this because they get the story, not just the numbers.

Let me walk you through building this in Notion, since many of you use it. Create a Notion database called "Sprint Metrics" with properties for sprint number, velocity, stories completed, stories planned, scope changes, and bugs found. Create a second database called "Risk Register" with risk name, AI score, trend, and owner. Create a third database called "AI Insights" where you paste the weekly AI-generated narrative.

Build a dashboard page that shows: a gallery view of the current sprint's key metrics at the top, a timeline view of velocity trends, a board view of risks color-coded by severity, and the latest AI insight prominently displayed.

Now for the Google Sheets approach — which honestly is more powerful for data visualization. Set up a sheet that pulls data from Jira via a Zapier integration or manual export. Use the SPARKLINE function for trend indicators in cells. Use conditional formatting so cells turn red, yellow, or green based on thresholds. Create charts for velocity trend, burndown, and deployment frequency. Add a "AI Analysis" sheet where you paste the weekly ChatGPT analysis.

Here is the critical design principle: build for your audience. Your team dashboard should show detailed sprint-level data — individual story progress, blocker status, and test coverage. Your executive dashboard should show high-level outcomes — delivery confidence, top risks, and projected dates. Same data source, different views. Never make an executive parse through a 30-metric dashboard to find the three things they care about.

Automation tip: use the Zapier workflows we built in the previous lesson to keep data fresh. Automated data pulls from Jira every morning. Automated AI narrative generation every Monday. Automated Slack notification when risk thresholds are breached. The dashboard should update itself — if you are manually updating it every day, you have not automated enough.

One mistake I see constantly: dashboard overload. PMs add every metric they can think of, and the result is a wall of numbers that nobody reads. My rule is simple: if a metric does not drive a decision, remove it. Every element on your dashboard should answer a question that leads to action. "What is our sprint completion confidence?" drives scope decisions. "What is our top risk?" drives mitigation actions. "Is the team at sustainable pace?" drives workload decisions.

Your assignment: build a minimal AI-integrated dashboard this week with three elements — sprint completion forecast, top 3 risks with AI scores, and one AI-generated narrative paragraph. Share it with your team and one stakeholder. Get feedback. Iterate. The perfect dashboard does not exist on day one — it evolves through use.`,


  "6.4": `Let us talk about something that sounds simple but is actually one of the most valuable assets you will build in your AI career — a prompt library. Your collection of tested, refined, proven prompts that produce excellent results every time. This is your intellectual property as an AI-augmented PM.

Here is why this matters. I see PMs using AI inefficiently every day. They open ChatGPT, think for a minute about what to type, write a mediocre prompt, get a mediocre result, tweak it a few times, eventually get something decent, and then... close the tab. Next week, they need the same thing and start from scratch. That is like writing a new sprint report template every Friday instead of reusing the one that works.

A prompt library fixes this completely. You write a great prompt once, save it, categorize it, and reuse it forever — improving it each time. Over months, you build a collection of 30 to 50 prompts that cover every major PM task, each one refined through dozens of uses.

Let me show you how to organize this. I recommend five categories.

Category one: Planning Prompts. Sprint planning, backlog refinement, release planning, capacity estimation. Example: "You are a senior Scrum Master. Given the following backlog items [paste items] and team velocity of [X] points per sprint, recommend a sprint backlog that maximizes value while staying within capacity. Consider dependencies, risk, and balanced workload. Output: recommended sprint backlog as a table with columns for Story, Points, Priority, Assignee, and Rationale."

Category two: Communication Prompts. Stakeholder emails, sprint reports, status updates, escalation messages. Example: "Write a project status email to [VP/Director/Team]. Context: [paste context]. Include: 2-sentence executive summary, 3 key achievements this sprint, top 2 risks with mitigation status, and next sprint priorities. Tone: [confident/transparent/urgent]. Maximum 200 words."

Category three: Risk and Analysis Prompts. Risk assessment, decision analysis, root cause investigation, retrospective facilitation. Example: "Given the following project data [paste data], identify the top 5 risks. For each risk, provide: description, probability (1-5), impact (1-5), composite score, early warning signals to monitor, and recommended mitigation action."

Category four: Facilitation Prompts. Retrospective questions, workshop agendas, icebreakers, conflict resolution frameworks. Example: "Design a 60-minute sprint retrospective for a team experiencing [low morale/missed commitments/scope creep]. Include: icebreaker (5 minutes), data gathering activity (15 minutes), insight generation (20 minutes), action item creation (15 minutes), and closing (5 minutes). The approach should be [fun/structured/therapeutic] based on the team's current mood."

Category five: Automation and Integration Prompts. These are the prompts you use inside your Zapier and Make workflows — the ones that process meeting transcripts, generate reports, and analyze data automatically.

Now, here is what makes a prompt truly great. First, it has context placeholders. Use brackets like [team_velocity], [sprint_number], [risk_description] to mark where you insert specific data each time. This makes the prompt a template, not a one-time message.

Second, it specifies the output format. Do you want a table? Bullet points? An email? A JSON object? Tell the AI. "Output as a markdown table with columns for..." is much better than hoping the AI picks the right format.

Third, it includes constraints. "Maximum 200 words." "Do not invent metrics — if data is missing, say so." "Use language appropriate for a non-technical audience." Constraints prevent the AI from going off the rails.

Fourth, it is versioned. Keep track of changes. Prompt v1 might produce decent results. After five iterations, prompt v5 produces excellent results. If you are not versioning, you will accidentally overwrite a good prompt with a worse one.

For storage, use whatever your team already lives in. A Notion database with properties for category, prompt text, version, and last-used date works great. A Google Sheet works too. Even a folder of text files works — the important thing is that they are organized and accessible.

Your assignment: create your prompt library with at least 5 prompts — one from each category. Use each one at least once this week. After each use, note what worked and what you would change. Refine and version. In four weeks, you will have a library of 15 to 20 battle-tested prompts that save you hours every sprint.`,


  "6.5": `Today we are addressing something that keeps every AI-savvy PM up at night — how do you stay current when the AI landscape is changing every single week? New tools launch constantly. Existing tools add AI features overnight. And what was cutting-edge six months ago might already be obsolete. Let me give you a system for navigating this without losing your mind.

First, let me be honest about the problem. When I first started tracking AI tools for project management in early 2025, I counted about 40 relevant tools. By mid-2025, it was over 120. By early 2026, we are well past 200. Nobody — I repeat, nobody — can evaluate every tool. You need a filter. You need a system.

Here is the system I recommend, and it works beautifully once you set it up.

Layer one: curated information sources. You do not need to follow 50 AI newsletters. Pick three to five high-quality sources and read them consistently. Here are my recommendations: "The Neuron" for daily AI news, Lenny Rachitsky's newsletter for product and PM-specific AI insights, and the Atlassian blog for how AI is being integrated into PM tools you already use. On LinkedIn, follow three to four PM thought leaders who share AI tool reviews. That is it. Fifteen minutes of reading, three times a week. You will catch 90 percent of what matters.

Layer two: the evaluation framework. Remember the five criteria from Module 1? Accuracy, integration capability, security posture, cost-to-value ratio, and adoption friction. Every new tool gets scored against these five criteria. No exceptions. This prevents shiny object syndrome. I do not care how beautiful the demo is — if it does not integrate with Jira and Slack, it is not entering my workflow.

Layer three: structured pilots. When a tool passes your framework evaluation with a score of 4 out of 5 or higher, run a time-boxed pilot. Two weeks. That is enough time to use the tool on real work without over-committing. During the pilot, track three things: time saved per use, output quality compared to your current approach, and adoption friction — how easy is it for you and the team to actually use it?

Let me give you a real example. In late 2025, a tool called Spinach AI launched for automated standup facilitation. It looked impressive. I scored it: accuracy 4, integration 5 (it connected to Jira and Slack natively), security 4 (SOC 2 compliant), cost-to-value 4, adoption friction 3 (required some team behavior changes). Total: 20 out of 25. Worth a pilot.

During the two-week pilot, I discovered that the standup summaries saved 10 minutes per day, but the team felt the automated check-ins were impersonal and reduced team bonding. The adoption friction was higher than expected. Result: we kept the summary feature but returned to live standups for the human connection. The pilot gave us data to make a nuanced decision instead of an all-or-nothing choice.

Now let us talk about the build-versus-buy decision, because this comes up frequently. Should you build custom AI solutions with tools like GPT API, or buy existing products? Here is my rule of thumb: buy when a tool meets 80 percent or more of your needs. The last 20 percent is rarely worth the engineering effort, maintenance burden, and opportunity cost of building custom. Build only when your workflow is genuinely unique and no existing tool comes close, AND you have engineering resources available, AND the expected ROI justifies the development cost.

For 2025 and 2026, watch these trends. First, AI agents are moving from simple chatbots to multi-step autonomous systems — PM-focused agents are getting smarter fast. Second, AI is being embedded directly into tools you already use — Jira, Confluence, Slack, and Notion all have AI features improving rapidly. Sometimes the best "new tool" is a new feature in your existing tool. Third, multimodal AI is coming to PM tools — imagine uploading a whiteboard photo and having AI extract user stories automatically.

Here is your maintenance routine. Every Monday, 15 minutes scanning your sources. Every month, evaluate one new tool. Every quarter, pilot the highest-scoring one. Every six months, review your entire toolkit. This cadence keeps you current without overwhelm.

Your assignment: set up your three to five curated information sources this week. Subscribe, bookmark, or add them to your RSS reader. Next Monday, do your first 15-minute scan and identify one tool worth evaluating. Score it against the framework. Build this into a habit, and you will always be ahead of the curve.`,


  "6.6": `Congratulations, everyone. You have made it to the capstone. This is where everything comes together — six modules of AI mastery condensed into a single deliverable that proves your capability and becomes a blueprint you can implement on Monday morning. You are going to design your complete AI-Powered PM Operating Model.

Let me tell you what this is and why it matters beyond this course. An operating model is not a list of tools. It is a system. It describes how you work — what tools you use, how they connect, what is automated, what is human, how you measure success, and how you govern AI usage. When you present this to a hiring manager, a PMO leader, or your current VP, it demonstrates something rare: you do not just know AI tools — you know how to orchestrate them into a coherent system that delivers measurable business value.

Here is the structure of your capstone deliverable, and I want you to follow this exactly.

Section one: Your AI Tool Stack. List every AI tool in your operating model, organized by PM function. Planning: what tools do you use for sprint planning, estimation, and backlog management? Communication: what tools handle meeting transcription, report generation, and stakeholder updates? Delivery: what tools support code review, testing, CI/CD, and deployment? Risk and Analytics: what tools provide forecasting, risk scoring, and decision analysis? For each tool, specify: the tool name, what it does in your workflow, how it integrates with your other tools, and the monthly cost.

Section two: Your Automation Workflows. Map out your key automated workflows. The meeting-to-action-items pipeline. The weekly report generator. The daily standup digest. The risk score updater. For each workflow, draw the trigger-action chain: what starts it, what steps happen, and what output is produced. Include the Zapier or Make configuration details so someone could replicate it.

Section three: Your Dashboard Design. Describe your AI-integrated dashboard. What metrics does it show? What AI predictions are included? What is the narrative section? How often does it refresh? Who has access — team view versus executive view? Include a mockup or screenshot of the dashboard you built in the Module 5 lab.

Section four: Your Prompt Library. Include your top 10 prompts — the ones that cover your most frequent PM tasks. Show the versioned, refined versions — not the first drafts. Categorize them by PM function. These demonstrate your prompt engineering maturity.

Section five: Your Governance Framework. This is what separates a mature operating model from a tool wishlist. Include your AI usage policy: what data can be shared with AI tools, what tools are approved, what verification requirements exist. Define the review process for AI-generated outputs — when does a human need to review before sharing? Address security and compliance — how does your model handle sensitive project data?

Section six: Projected ROI. This is the section that gets leadership buy-in. For each major automation and AI tool, calculate: time saved per week, time saved per sprint, and time saved per quarter. Convert to dollar values using average loaded hourly rates. Sum it up. A typical AI-powered PM operating model saves 15 to 25 hours per sprint. At 75 dollars per hour loaded cost, that is 1,125 to 1,875 dollars per sprint, or 30,000 to 50,000 dollars per year. Those are real numbers that get real budgets approved.

Here is my guidance on the presentation. Structure it as a pitch, not a report. Imagine you are presenting to your PMO director and asking for approval to implement this model across all PM teams. Lead with the problem — how much time PMs waste on manual, repetitive tasks. Present the solution — your integrated AI operating model. Show the evidence — the tools, workflows, and dashboards you have actually built during this course. Close with the impact — the projected ROI and the competitive advantage of AI-augmented PM teams.

I want to leave you with something personal. When I started teaching this course, some people told me AI would make PMs obsolete. I have seen the exact opposite. AI makes great PMs extraordinary. It frees you from the spreadsheets and the status emails so you can do what only humans can do — build trust, resolve conflicts, inspire teams, and make judgment calls that no algorithm can replicate. The PMs who embrace AI do not get replaced. They get promoted.

Your capstone is due in two weeks. Build something you are proud of. Build something you will actually use. And when you implement it at work and your team delivers 30 percent faster with fewer late nights — remember this moment. You earned it. Now go build your future. I am proud of every single one of you.`

};

export default scripts;
