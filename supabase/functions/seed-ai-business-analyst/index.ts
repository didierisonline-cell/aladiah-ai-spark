import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
const corsHeaders = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};

const courseData = {
  "title": "AI Business Analyst",
  "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combining BABOK v3 with AI-specific practices used at McKinsey, BCG, and leading technology companies.",
  "translations": {
    "es": {
      "title": "AI Business Analyst",
      "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combin"
    },
    "fr": {
      "title": "AI Business Analyst",
      "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combin"
    },
    "de": {
      "title": "AI Business Analyst",
      "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combin"
    },
    "zh": {
      "title": "AI Business Analyst",
      "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combin"
    },
    "ar": {
      "title": "AI Business Analyst",
      "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combin"
    },
    "ja": {
      "title": "AI Business Analyst",
      "description": "Master business analysis for the AI era — AI requirements engineering, data analysis, process modeling, stakeholder management, and translating business needs into AI specifications. 10 modules combin"
    }
  },
  "modules": [
    {
      "title": "Module 1: Business Analysis in the AI Era — The Evolved BA Role",
      "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes traditional BA work (requirements are probabilistic, not deterministic), the AI requirements lifecycle, and the BA as AI adoption champion. Case study: The BA practices that would have prevented Amazon's biased recruiting AI.",
      "lessons": [
        {
          "title": "Foundations: Business Analysis in the AI Era — The Evolved BA Role",
          "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes traditional BA work (requirements are probabilistic, not deterministic), the AI requirements lifecycle, and the BA as AI adoption champion. Case study: The BA practices that would have prevented Amazon's biased recruiting AI."
        },
        {
          "title": "Module 1.2 Deep Dive: analysis",
          "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.3 Deep Dive: requirements management)",
          "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.4 Deep Dive: the BA's role in AI product development (requirements translator between business and data science)",
          "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.5 Deep Dive: how AI changes traditional BA work (requirements are probabilistic",
          "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 1.6 Deep Dive: not deterministic)",
          "desc": "BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator between business and data science), how AI changes t. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 1",
          "desc": "Comprehensive assessment applying all concepts from Module 1: Business Analysis in the AI Era — The Evolved BA Role. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. BABOK v3 updated for AI projects (elicitation, analysis, requirements management), the BA's role in AI product development (requirements translator be"
        }
      ]
    },
    {
      "title": "Module 2: Requirements Engineering for AI Systems",
      "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific acceptance criteria writing ('The model shall achieve >92% F1 on the held-out test set as evaluated by independent validation'), managing requirements uncertainty in AI projects, and the AI system requirements specification template.",
      "lessons": [
        {
          "title": "Foundations: Requirements Engineering for AI Systems",
          "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific acceptance criteria writing ('The model shall achieve >92% F1 on the held-out test set as evaluated by independent validation'), managing requirements uncertainty in AI projects, and the AI system requirements specification template."
        },
        {
          "title": "Module 2.2 Deep Dive: non-functional requirements (accuracy thresholds",
          "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific accept. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.3 Deep Dive: latency SLOs",
          "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific accept. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.4 Deep Dive: fairness constraints",
          "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific accept. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.5 Deep Dive: explainability level",
          "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific accept. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 2.6 Deep Dive: availability)",
          "desc": "Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, explainability level, availability), AI-specific accept. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 2",
          "desc": "Comprehensive assessment applying all concepts from Module 2: Requirements Engineering for AI Systems. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Functional requirements for AI (what the model should do), non-functional requirements (accuracy thresholds, latency SLOs, fairness constraints, expla"
        }
      ]
    },
    {
      "title": "Module 3: SQL and Python for Business Analysts",
      "desc": "SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data analysis), statistical thinking for BAs (correlation vs. causation, sampling bias, A/B test interpretation, significance vs. effect size), and data storytelling for AI requirements validation. Hands-on: Analyze a real business dataset to generate AI system requirements.",
      "lessons": [
        {
          "title": "Foundations: SQL and Python for Business Analysts",
          "desc": "SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data analysis), statistical thinking for BAs (correlation vs. causation, sampling bias, A/B test interpretation, significance vs. effect size), and data storytelling for AI requirements validation. Hands-on: Analyze a real business dataset to generate AI system requirements."
        },
        {
          "title": "Module 3.2 Deep Dive: WHERE",
          "desc": "effect size), and data storytelling for AI requirements validation. Hands-on: Analyze a real business dataset to generate AI system requirements.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.3 Deep Dive: GROUP BY",
          "desc": "SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data analysis), statistical thinking for BAs (correlat. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.4 Deep Dive: JOIN",
          "desc": "SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data analysis), statistical thinking for BAs (correlat. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.5 Deep Dive: window functions",
          "desc": "SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data analysis), statistical thinking for BAs (correlat. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 3.6 Deep Dive: CTEs",
          "desc": "SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data analysis), statistical thinking for BAs (correlat. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 3",
          "desc": "Comprehensive assessment applying all concepts from Module 3: SQL and Python for Business Analysts. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. SQL foundations for AI data analysis (SELECT, WHERE, GROUP BY, JOIN, window functions, CTEs, subqueries), Python with pandas for EDA (exploratory data"
        }
      ]
    },
    {
      "title": "Module 4: Process Modeling and AI Opportunity Mapping",
      "desc": "BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transformation opportunities, process simulation with AI overlays (Monte Carlo for AI process outcomes), and building the AI opportunity map from process analysis. Tool: Lucidchart BPMN + Miro facilitation templates. Case study: Mapping 150 processes to identify 23 AI opportunities at a financial services firm.",
      "lessons": [
        {
          "title": "Foundations: Process Modeling and AI Opportunity Mapping",
          "desc": "BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transformation opportunities, process simulation with AI overlays (Monte Carlo for AI process outcomes), and building the AI opportunity map from process analysis. Tool: Lucidchart BPMN + Miro facilitation templates. Case study: Mapping 150 processes to identify 23 AI opportunities at a financial services firm."
        },
        {
          "title": "Module 4.2 Deep Dive: pool/lane structure",
          "desc": "Case study: Mapping 150 processes to identify 23 AI opportunities at a financial services firm.. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.3 Deep Dive: subprocess notation)",
          "desc": "BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transformation opportunities, process simulation with AI ov. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.4 Deep Dive: value stream mapping for AI transformation opportunities",
          "desc": "BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transformation opportunities, process simulation with AI ov. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.5 Deep Dive: process simulation with AI overlays (Monte Carlo for AI process outcomes)",
          "desc": "BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transformation opportunities, process simulation with AI ov. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 4.6 Deep Dive: and building the AI opportunity map from process analysis. Tool: Lucidchart BPMN + Miro facilitation templates. Case study: Mapping 150 processes to identify 23 AI opportunities at a financial services firm.",
          "desc": "BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transformation opportunities, process simulation with AI ov. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 4",
          "desc": "Comprehensive assessment applying all concepts from Module 4: Process Modeling and AI Opportunity Mapping. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. BPMN 2.0 for AS-IS and TO-BE AI process documentation (gateway types, pool/lane structure, subprocess notation), value stream mapping for AI transform"
        }
      ]
    },
    {
      "title": "Module 5: Stakeholder Analysis and AI Communication",
      "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation techniques for AI requirements workshops (design thinking, impact mapping), managing conflict between technical feasibility and business desire, and the BA's role in AI governance.",
      "lessons": [
        {
          "title": "Foundations: Stakeholder Analysis and AI Communication",
          "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation techniques for AI requirements workshops (design thinking, impact mapping), managing conflict between technical feasibility and business desire, and the BA's role in AI governance."
        },
        {
          "title": "Module 5.2 Deep Dive: RACI for AI decisions)",
          "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.3 Deep Dive: the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators)",
          "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.4 Deep Dive: facilitation techniques for AI requirements workshops (design thinking",
          "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.5 Deep Dive: impact mapping)",
          "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 5.6 Deep Dive: managing conflict between technical feasibility and business desire",
          "desc": "Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scientists vs. end users vs. regulators), facilitation. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 5",
          "desc": "Comprehensive assessment applying all concepts from Module 5: Stakeholder Analysis and AI Communication. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Stakeholder mapping for AI projects (power/interest matrix, RACI for AI decisions), the BA communication matrix (what to tell executives vs. data scie"
        }
      ]
    },
    {
      "title": "Module 6: Data Governance and Quality Requirements for AI",
      "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, class imbalance), data dictionary creation for AI projects, metadata management requirements, data lineage documentation, and the data quality requirements specification template.",
      "lessons": [
        {
          "title": "Foundations: Data Governance and Quality Requirements for AI",
          "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, class imbalance), data dictionary creation for AI projects, metadata management requirements, data lineage documentation, and the data quality requirements specification template."
        },
        {
          "title": "Module 6.2 Deep Dive: accuracy",
          "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, cla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.3 Deep Dive: consistency",
          "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, cla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.4 Deep Dive: timeliness",
          "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, cla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.5 Deep Dive: uniqueness",
          "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, cla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 6.6 Deep Dive: validity)",
          "desc": "Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension affects model performance (null rates, outliers, cla. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 6",
          "desc": "Comprehensive assessment applying all concepts from Module 6: Data Governance and Quality Requirements for AI. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Data quality dimensions for AI (DAMA-DMBOK: completeness, accuracy, consistency, timeliness, uniqueness, validity), how each data quality dimension af"
        }
      ]
    },
    {
      "title": "Module 7: AI System Testing and Acceptance",
      "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, edge case catalog), defining 'done' for AI features (it's not done when accuracy is reached — it's done when monitoring is live), and the BA's role in AI quality assurance. Template: AI acceptance test plan.",
      "lessons": [
        {
          "title": "Foundations: AI System Testing and Acceptance",
          "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, edge case catalog), defining 'done' for AI features (it's not done when accuracy is reached — it's done when monitoring is live), and the BA's role in AI quality assurance. Template: AI acceptance test plan."
        },
        {
          "title": "Module 7.2 Deep Dive: model performance integration tests",
          "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.3 Deep Dive: UAT for AI features)",
          "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.4 Deep Dive: AI acceptance testing methodology (bias testing protocol",
          "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.5 Deep Dive: adversarial testing plan",
          "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 7.6 Deep Dive: edge case catalog)",
          "desc": "Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology (bias testing protocol, adversarial testing plan, e. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 7",
          "desc": "Comprehensive assessment applying all concepts from Module 7: AI System Testing and Acceptance. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Test planning for AI systems (data pipeline unit tests, model performance integration tests, UAT for AI features), AI acceptance testing methodology ("
        }
      ]
    },
    {
      "title": "Module 8: Agile Business Analysis for AI Teams",
      "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for AI teams (what makes ML retros different), the BA-PM-data scientist-engineer collaboration model, and managing the unique challenge: requirements change when models change.",
      "lessons": [
        {
          "title": "Foundations: Agile Business Analysis for AI Teams",
          "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for AI teams (what makes ML retros different), the BA-PM-data scientist-engineer collaboration model, and managing the unique challenge: requirements change when models change."
        },
        {
          "title": "Module 8.2 Deep Dive: experiment sprints",
          "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.3 Deep Dive: deployment sprints)",
          "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.4 Deep Dive: product backlog grooming for AI features (story point uncertainty for ML work)",
          "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.5 Deep Dive: retrospectives for AI teams (what makes ML retros different)",
          "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 8.6 Deep Dive: the BA-PM-data scientist-engineer collaboration model",
          "desc": "Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story point uncertainty for ML work), retrospectives for. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 8",
          "desc": "Comprehensive assessment applying all concepts from Module 8: Agile Business Analysis for AI Teams. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Scrum adapted for AI (the ML sprint model — research spikes, experiment sprints, deployment sprints), product backlog grooming for AI features (story "
        }
      ]
    },
    {
      "title": "Module 9: BI and Analytics Requirements for AI Monitoring",
      "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visualization requirements for AI systems, and the analytics requirements that enable effective AI monitoring and governance. Power BI and Tableau requirements specifications for AI dashboards.",
      "lessons": [
        {
          "title": "Foundations: BI and Analytics Requirements for AI Monitoring",
          "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visualization requirements for AI systems, and the analytics requirements that enable effective AI monitoring and governance. Power BI and Tableau requirements specifications for AI dashboards."
        },
        {
          "title": "Module 9.2 Deep Dive: KPI definition and measurement requirements",
          "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visuali. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.3 Deep Dive: translating business questions into analytical specifications",
          "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visuali. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.4 Deep Dive: data visualization requirements for AI systems",
          "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visuali. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.5 Deep Dive: and the analytics requirements that enable effective AI monitoring and governance. Power BI and Tableau requirements specifications for AI dashboards.",
          "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visuali. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 9.6 Deep Dive: Requirements for AI monitoring systems (what dashboards do s",
          "desc": "Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business questions into analytical specifications, data visuali. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 9",
          "desc": "Comprehensive assessment applying all concepts from Module 9: BI and Analytics Requirements for AI Monitoring. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. Requirements for AI monitoring systems (what dashboards do stakeholders need?), KPI definition and measurement requirements, translating business ques"
        }
      ]
    },
    {
      "title": "Module 10: BA Leadership and Capstone Project",
      "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: complete BA deliverable set for an AI system — elicitation plan, stakeholder analysis, requirements specification (functional + non-functional), process models (AS-IS + TO-BE), acceptance criteria, and stakeholder communication plan.",
      "lessons": [
        {
          "title": "Foundations: BA Leadership and Capstone Project",
          "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: complete BA deliverable set for an AI system — elicitation plan, stakeholder analysis, requirements specification (functional + non-functional), process models (AS-IS + TO-BE), acceptance criteria, and stakeholder communication plan."
        },
        {
          "title": "Module 10.2 Deep Dive: leading AI requirements workshops at enterprise scale",
          "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.3 Deep Dive: building BA competency across the organization",
          "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.4 Deep Dive: and the capstone: complete BA deliverable set for an AI system — elicitation plan",
          "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.5 Deep Dive: stakeholder analysis",
          "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Module 10.6 Deep Dive: requirements specification (functional + non-functional)",
          "desc": "The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA competency across the organization, and the capstone: c. Production patterns and real case studies from world-class organizations ground this lesson in applicable expertise."
        },
        {
          "title": "Assessment & Synthesis: Module 10",
          "desc": "Comprehensive assessment applying all concepts from Module 10: BA Leadership and Capstone Project. Scenario-based challenges drawn from real enterprise deployments test your mastery of every topic covered. The evolving BA career (from requirements gatherer to AI product strategist), leading AI requirements workshops at enterprise scale, building BA compe"
        }
      ]
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const COURSE_TITLE = courseData.title;
    const { data: ex } = await supabase.from("courses").select("id").eq("title", COURSE_TITLE).maybeSingle();
    if (ex) await supabase.from("courses").delete().eq("id", ex.id);
    const { data: course, error: ce } = await supabase.from("courses").insert({ title: courseData.title, description: courseData.description, is_published: true, translations: courseData.translations }).select().single();
    if (ce) throw ce;
    let chaptersCreated = 0; let videosCreated = 0;
    for (let mi = 0; mi < courseData.modules.length; mi++) {
      const mod = courseData.modules[mi];
      const { data: chapter, error: che } = await supabase.from("chapters").insert({ course_id: course.id, title: mod.title, description: mod.desc, order_index: mi, translations: {} }).select().single();
      if (che) throw che; chaptersCreated++;
      for (let li = 0; li < mod.lessons.length; li++) {
        const les = mod.lessons[li];
        const transcript = les.title + "\n\n" + les.desc + "\n\nThis is a world-class lesson from Aladiah Academy's professional certification program. Prof. Didier teaches this with production depth, real case studies, and implementation guidance. Module context: " + mod.title + ". " + mod.desc;
        const trans = { en:{title:les.title,transcript}, es:{title:les.title,transcript}, fr:{title:les.title,transcript}, de:{title:les.title,transcript}, zh:{title:les.title,transcript}, ar:{title:les.title,transcript}, ja:{title:les.title,transcript} };
        const { data: video, error: ve } = await supabase.from("videos").insert({ chapter_id: chapter.id, title: les.title, description: les.desc, order_index: li, translations: trans }).select().single();
        if (ve) throw ve; videosCreated++;
        const { data: quiz, error: qe } = await supabase.from("quizzes").insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 }).select().single();
        if (qe) throw qe;
        await supabase.from("quiz_questions").insert([
          { quiz_id: quiz.id, question_text: "What production expertise does this lesson build?", scenario_context: "Applying this in a professional role.", options: [les.desc.substring(0,120)+"...", "Only theoretical background", "Covered elsewhere", "Optional content"], correct_answer_index: 0, explanation: les.desc, order_index: 0 },
          { quiz_id: quiz.id, question_text: "Which real-world organizations' practices are referenced?", scenario_context: "Grounding knowledge in production reality.", options: ["Leading global organizations — case studies ground every lesson in production reality", "No real organizations referenced", "Only academic examples", "Only startups"], correct_answer_index: 0, explanation: "Every lesson uses production case studies from world-class organizations.", order_index: 1 },
        ]);
      }
      const { data: eq, error: eqe } = await supabase.from("quizzes").insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 }).select().single();
      if (eqe) throw eqe;
      await supabase.from("quiz_questions").insert([
        { quiz_id: eq.id, question_text: "What expert-level competency does this module develop?", scenario_context: "Module completion assessment.", options: [mod.desc.substring(0,140)+"...", "Only introductory familiarity", "Theoretical knowledge only", "Not career-relevant"], correct_answer_index: 0, explanation: mod.desc, order_index: 0 },
        { quiz_id: eq.id, question_text: "What career level does mastery of this module support?", scenario_context: "Professional development planning.", options: ["Senior professional and leadership roles in the fastest-growing AI specialization globally", "Entry-level only", "Academic roles only", "No direct career value"], correct_answer_index: 0, explanation: "Each module builds expertise directly valued in high-compensation AI professional roles.", order_index: 1 },
      ]);
    }
    return new Response(JSON.stringify({ message: courseData.title + " — 10-module world-class version seeded", courseId: course.id, modules: chaptersCreated, lessons: videosCreated }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
