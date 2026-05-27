import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const courseData = {
  title: "AI Agent Engineer",
  description: "Master building autonomous multi-agent AI systems with LangGraph, MCP, RAG pipelines, and production LLM deployment. The most in-demand AI engineering skill of 2025-2030.",
  chapters: [
    {
      title: "Module 1: LLM Foundations and Prompt Engineering",
      description: "Deep understanding of large language models, tokenization, context windows, and advanced prompt engineering techniques.",
      order_index: 0,
      videos: [
        {
          title: "1.1 How Large Language Models Work",
          description: "Transformers, attention mechanisms, pre-training, RLHF, and what makes frontier models different.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "Large Language Models are trained on massive text corpora using transformer architectures with self-attention mechanisms. The attention mechanism allows the model to weigh the importance of different tokens when predicting the next token \u2014 enabling long-range dependencies that RNNs struggled with. Pre-training on hundreds of billions of tokens gives the model a rich world model and language understanding before any task-specific fine-tuning.",
              "The transformer architecture consists of stacked encoder or decoder blocks. Decoder-only models (GPT-4, Claude, Llama) generate text autoregressively \u2014 each token is predicted from all previous tokens. Encoder-decoder models (T5, BART) are better for translation and summarization. Encoder-only models (BERT, RoBERTa) are best for classification and embedding tasks. Most frontier AI agents use decoder-only models for their generation capabilities.",
              "Tokenization determines how text is converted to numbers. BPE (Byte Pair Encoding) and SentencePiece create subword tokens that balance vocabulary size (typically 32K-100K tokens) with coverage of rare words. 'Tokenization' might be 3 tokens: 'Token', 'ization', 's'. One token \u2248 0.75 words in English. Context window limits (4K-200K tokens) determine how much text the model can process at once \u2014 a critical architectural constraint for agent design.",
              "RLHF (Reinforcement Learning from Human Feedback) transforms a base language model into an assistant. A reward model trained on human preference comparisons scores model outputs. PPO optimization then fine-tunes the base model to maximize reward while staying close to the original distribution. This process is why Claude follows instructions, declines harmful requests, and produces helpful responses \u2014 capabilities not present in base models.",
              "Inference cost and latency fundamentals: larger models produce better outputs but cost more. GPT-4 costs ~$0.03/1K input tokens and ~$0.06/1K output tokens. A chat application with 10K users and 100 messages/day might spend $50-500/day on LLM costs. Batch inference reduces cost by 50%+ but adds latency. Caching identical requests eliminates redundant compute. These economics determine when to use frontier models vs fine-tuned smaller models."
            ]
          },
          questions: [            {
              question_text: "What is tokenization and why does it matter for agent context window management?",
              scenario_context: "Your agent is hitting context window limits unexpectedly.",
              options: ["A tokenizer is a text compression algorithm", "Tokenization converts text to numerical tokens (~0.75 words each) \u2014 understanding token counts is critical for fitting prompts, history, and retrieved context within model limits", "Tokenization is used only for model training", "Tokenization determines model response quality"],
              correct_answer_index: 1,
              explanation: "Models process tokens, not words. A 128K context window can hold ~96K words. Tracking token counts across system prompt, conversation history, retrieved documents, and tool results is essential for agent reliability."
            },
            {
              question_text: "Why is chain-of-thought prompting effective for multi-step reasoning tasks?",
              scenario_context: "Your agent makes errors on complex multi-step calculations.",
              options: ["CoT reduces API costs", "CoT forces the model to decompose problems and reason explicitly, reducing errors on tasks requiring multiple reasoning steps", "CoT is faster than standard prompting", "CoT only works with specific model families"],
              correct_answer_index: 1,
              explanation: "CoT works because LLMs predict the next token given all previous tokens. By generating intermediate reasoning steps, the model's context includes its own correct reasoning, guiding subsequent steps toward the correct final answer."
            },
            {
              question_text: "What is the primary defense against prompt injection in production LLM applications?",
              scenario_context: "Users are embedding 'ignore previous instructions' in their inputs.",
              options: ["Input length limits", "Treating user content as data using delimiters \u2014 never allowing user content to appear in instruction position; validating outputs for unexpected behavior", "Only using system prompts", "Requiring user authentication"],
              correct_answer_index: 1,
              explanation: "Structural separation is the primary defense: use XML tags or JSON structures to clearly mark user content as data. The model sees <user_input>...</user_input> as content to process, not instructions to follow."
            },
            {
              question_text: "What are structured outputs and why are they mandatory for production AI agents?",
              scenario_context: "Your agent's JSON parsing fails intermittently in production.",
              options: ["Outputs formatted with markdown", "Structured outputs constrain LLM output to a defined schema (JSON/XML) enabling reliable programmatic processing \u2014 use function calling or JSON mode, validate with Pydantic", "Outputs stored in a database", "Outputs with clear section headers"],
              correct_answer_index: 1,
              explanation: "Production agents must parse LLM outputs programmatically. Without structured output enforcement (function calling, JSON mode, grammar-constrained generation), LLM outputs occasionally deviate from expected format, causing parsing failures and agent errors."
            }]
        },
        {
          title: "1.2 Advanced Prompt Engineering for Production Systems",
          description: "Techniques for reliable, consistent LLM outputs in production: system prompts, few-shot learning, chain-of-thought, and structured outputs.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "System prompt engineering is the most underrated skill in production LLM development. The system prompt defines the AI's persona, constraints, capabilities, and output format before any user interaction. A well-crafted system prompt handles 80% of reliability challenges \u2014 it provides context, defines what the model can and cannot do, specifies output format, and handles edge cases explicitly. Poor system prompts produce unpredictable, inconsistent behavior.",
              "Few-shot prompting provides examples of desired input-output pairs in the prompt. Rather than describing what you want abstractly, show 3-5 examples of perfect outputs. For classification tasks, few-shot examples dramatically improve accuracy. For structured data extraction, examples teach the exact JSON schema. For code generation, examples demonstrate coding style and error handling patterns. The quality of few-shot examples directly determines output quality.",
              "Chain-of-thought (CoT) prompting instructs the model to reason step-by-step before answering. Adding 'Let's think step by step' or providing CoT examples in few-shot demonstrations dramatically improves performance on multi-step reasoning tasks. For agent systems, CoT reasoning traces help debug model decisions and provide interpretability. ReAct (Reasoning + Acting) extends CoT to interleave reasoning with tool use \u2014 the model reasons about what tool to call, calls it, observes the result, and reasons about the next step.",
              "Structured outputs are essential for production AI agents. Instructing the model to output JSON, XML, or a specific schema enables programmatic processing. OpenAI's function calling and JSON mode, Anthropic's tool use format, and Google's Gemini function declarations all provide mechanisms for reliable structured outputs. Always define the exact schema with field descriptions and examples. Validate outputs with Pydantic models \u2014 never assume the LLM produced valid JSON.",
              "Prompt injection is the most critical security challenge for production LLM systems. An attacker embeds instructions in user inputs, retrieved documents, or tool outputs that hijack the model's behavior. Defense strategies: treat user content and retrieved content as data, not instructions; use XML/JSON delimiters to clearly separate system instructions from external content; implement output filtering for sensitive patterns; use separate models for security-sensitive operations."
            ]
          },
          questions: [            {
              question_text: "What is tokenization and why does it matter for agent context window management?",
              scenario_context: "Your agent is hitting context window limits unexpectedly.",
              options: ["A tokenizer is a text compression algorithm", "Tokenization converts text to numerical tokens (~0.75 words each) \u2014 understanding token counts is critical for fitting prompts, history, and retrieved context within model limits", "Tokenization is used only for model training", "Tokenization determines model response quality"],
              correct_answer_index: 1,
              explanation: "Models process tokens, not words. A 128K context window can hold ~96K words. Tracking token counts across system prompt, conversation history, retrieved documents, and tool results is essential for agent reliability."
            },
            {
              question_text: "Why is chain-of-thought prompting effective for multi-step reasoning tasks?",
              scenario_context: "Your agent makes errors on complex multi-step calculations.",
              options: ["CoT reduces API costs", "CoT forces the model to decompose problems and reason explicitly, reducing errors on tasks requiring multiple reasoning steps", "CoT is faster than standard prompting", "CoT only works with specific model families"],
              correct_answer_index: 1,
              explanation: "CoT works because LLMs predict the next token given all previous tokens. By generating intermediate reasoning steps, the model's context includes its own correct reasoning, guiding subsequent steps toward the correct final answer."
            },
            {
              question_text: "What is the primary defense against prompt injection in production LLM applications?",
              scenario_context: "Users are embedding 'ignore previous instructions' in their inputs.",
              options: ["Input length limits", "Treating user content as data using delimiters \u2014 never allowing user content to appear in instruction position; validating outputs for unexpected behavior", "Only using system prompts", "Requiring user authentication"],
              correct_answer_index: 1,
              explanation: "Structural separation is the primary defense: use XML tags or JSON structures to clearly mark user content as data. The model sees <user_input>...</user_input> as content to process, not instructions to follow."
            },
            {
              question_text: "What are structured outputs and why are they mandatory for production AI agents?",
              scenario_context: "Your agent's JSON parsing fails intermittently in production.",
              options: ["Outputs formatted with markdown", "Structured outputs constrain LLM output to a defined schema (JSON/XML) enabling reliable programmatic processing \u2014 use function calling or JSON mode, validate with Pydantic", "Outputs stored in a database", "Outputs with clear section headers"],
              correct_answer_index: 1,
              explanation: "Production agents must parse LLM outputs programmatically. Without structured output enforcement (function calling, JSON mode, grammar-constrained generation), LLM outputs occasionally deviate from expected format, causing parsing failures and agent errors."
            }]
        }
      ],
      endQuizQuestions: [            {
              question_text: "Your RAG agent retrieves 5 documents averaging 2,000 tokens each. The system prompt is 800 tokens. After 10 conversation turns (avg 200 tokens each), you hit the context limit. What is the first optimization?",
              scenario_context: "You need to fit more conversation history and retrieved context.",
              options: ["Use a model with larger context window", "Implement sliding window: keep last N turns, summarize older history; truncate or summarize retrieved chunks rather than including full documents", "Reduce the number of retrieved documents to 1", "Shorten the system prompt"],
              correct_answer_index: 1,
              explanation: "Multi-pronged context management: conversation history is summarized/truncated as it grows; retrieved documents are chunked and only relevant passages included; system prompt is kept minimal. This extends effective context 3-5x."
            },
            {
              question_text: "You need to extract structured company data (name, revenue, employees) from unstructured press releases with 99% accuracy. What prompting approach delivers this?",
              scenario_context: "Your current extraction has 82% accuracy.",
              options: ["Zero-shot instruction only", "Few-shot with 5 high-quality examples of press release \u2192 structured JSON, plus schema definition with field descriptions and constraints", "Use a general-purpose extraction prompt", "Ask the model to 'be careful and accurate'"],
              correct_answer_index: 1,
              explanation: "Few-shot with clear examples is the highest-impact technique for structured extraction. The model learns from examples what constitutes a good extraction, including handling edge cases, missing data, and ambiguous phrasing."
            }]
    },
    {
      title: "Module 2: Building Production AI Agents with LangGraph",
      description: "Design, implement, and deploy autonomous AI agents using LangGraph's stateful graph architecture.",
      order_index: 1,
      videos: [
        {
          title: "2.1 LangGraph Architecture: Nodes, Edges, and State",
          description: "Understanding LangGraph's graph-based approach to building stateful, controllable AI agents.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "LangGraph represents AI agents as directed graphs where nodes perform work and edges define transitions. This differs fundamentally from sequential chains \u2014 graphs support cycles (the agent can loop, reflect, and retry), conditional branching (different paths based on intermediate results), and parallel execution (multiple nodes running simultaneously). The result is agents that can implement complex decision-making processes that sequential chains cannot express.",
              "State is the central concept in LangGraph. Every node reads from and writes to a shared state object \u2014 a TypedDict or Pydantic model that accumulates the agent's working memory across graph traversal. State includes conversation history, intermediate results, retrieved documents, tool call results, and error states. Designing the right state schema is the first and most important step in LangGraph development.",
              "Nodes implement the agent's actions. A node is a Python function (or LangChain Runnable) that takes state as input and returns state updates. Typical nodes: an LLM node that calls the model and stores the response, a tool execution node that runs a function call, a retrieval node that queries a vector store, a routing node that decides the next step, and a validation node that checks output quality and triggers re-tries.",
              "Edges define transitions between nodes. Unconditional edges always go from node A to node B. Conditional edges use a function to determine which node to transition to \u2014 this implements branching and looping. The END sentinel node terminates the graph. Human-in-the-loop patterns use interrupt_before or interrupt_after to pause execution and await human input before continuing.",
              "LangGraph's checkpointing system saves complete graph state after each node execution. This enables: persistence (agents survive process restarts), human-in-the-loop (pause for approval and resume), time-travel debugging (replay from any past state), and parallel execution across multiple conversation threads. Use SQLite checkpointer for development, PostgreSQL checkpointer for production, Redis for low-latency state access."
            ]
          },
          questions: [            {
              question_text: "What makes LangGraph superior to simple sequential LangChain chains for complex agents?",
              scenario_context: "You need to build an agent that can retry failed steps and branch based on intermediate results.",
              options: ["LangGraph is faster", "LangGraph supports cycles (retry loops), conditional branching, and parallel execution \u2014 expressing complex decision flows that sequential chains cannot", "LangGraph uses less memory", "LangGraph has better LLM integrations"],
              correct_answer_index: 1,
              explanation: "Sequential chains execute once left to right. LangGraph graphs can loop (agent retries with different approach), branch (different paths based on tool results), and run in parallel (simultaneous tool calls) \u2014 enabling agents that reason and adapt."
            },
            {
              question_text: "Why is tool description quality critical for reliable multi-tool agent behavior?",
              scenario_context: "Your agent consistently selects the wrong tool for tasks.",
              options: ["Tool descriptions affect API latency", "The model uses descriptions to decide when and how to use each tool \u2014 vague descriptions cause incorrect tool selection; precise descriptions enable reliable behavior", "Longer descriptions are always better", "Tool descriptions are ignored by the model"],
              correct_answer_index: 1,
              explanation: "The LLM sees only the tool name and description to decide which tool fits the current step. 'Searches the web' is ambiguous; 'Searches Google for current information about a topic when you need recent news, current events, or real-time data' is precise."
            },
            {
              question_text: "Your AI agent needs to simultaneously retrieve from 3 different data sources to answer a question. What is the most efficient approach?",
              scenario_context: "Sequential retrieval takes 3 seconds; you need sub-1-second response.",
              options: ["Chain retrieval calls sequentially", "Use parallel node execution in LangGraph \u2014 all 3 retrieval nodes execute simultaneously, latency = max(3 retrievals) not sum", "Use only 1 data source", "Pre-cache all possible queries"],
              correct_answer_index: 1,
              explanation: "LangGraph parallel branches execute nodes simultaneously. Three 1-second retrievals run in parallel complete in 1 second total versus 3 seconds sequentially \u2014 critical for user-facing agents."
            },
            {
              question_text: "What is the correct error handling strategy when a critical tool call fails?",
              scenario_context: "Your agent's database query returns an error during production execution.",
              options: ["Log the error and continue as if the query succeeded", "Implement retry with exponential backoff for transient failures; fall back to alternative approaches for persistent failures; never hallucinate results when tools fail", "Immediately return an error to the user", "Silently skip the failed tool call"],
              correct_answer_index: 1,
              explanation: "Tool failure handling: retry transient errors (network timeouts, rate limits) with backoff; for persistent failures, try alternative approaches; always be transparent about unavailability rather than hallucinating results that weren't retrieved."
            }]
        },
        {
          title: "2.2 Tool Use, Function Calling, and Multi-Tool Agents",
          description: "Build agents that use real tools \u2014 APIs, databases, code execution, and web search.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "Tool use transforms LLMs from text generators into action-taking agents. Tools are functions the model can call \u2014 web search, database queries, code execution, API calls, file operations. The model decides which tool to call and with what arguments based on the task. The tool executes, returns results, and the model uses those results to continue reasoning. This ReAct (Reasoning + Acting) loop is the foundation of modern AI agents.",
              "OpenAI function calling, Anthropic tool use, and Google function declarations all implement the same concept with provider-specific syntax. Define tools as JSON schemas specifying the function name, description, and parameter types. The description is critical \u2014 it teaches the model when and how to use the tool. Ambiguous descriptions cause incorrect tool selection; precise descriptions enable reliable tool use.",
              "Multi-tool agents must handle tool orchestration: calling tools in sequence (each result informs the next call), in parallel (independent tools called simultaneously to reduce latency), and conditionally (calling different tools based on intermediate results). LangGraph's parallel node execution enables calling 3-5 tools simultaneously \u2014 retrieving context from multiple sources in parallel rather than sequentially.",
              "Error handling in tool use is critical for production reliability. Tools fail: APIs are unavailable, queries return empty results, code execution raises exceptions. Agents must handle these gracefully: retry with exponential backoff for transient failures, fall back to alternative tools or approaches on persistent failures, clearly communicate unavailability to users rather than hallucinating results, and log all tool errors for debugging.",
              "Security for tool-using agents requires the principle of least privilege. Each tool should have only the permissions it needs \u2014 a web search tool shouldn't have file system access. Validate and sanitize tool inputs before execution \u2014 an agent with database query tools is vulnerable to SQL injection via prompt injection. Implement output filtering on tool results before they enter the agent's context. Log all tool calls with inputs and outputs for audit trails."
            ]
          },
          questions: [            {
              question_text: "What makes LangGraph superior to simple sequential LangChain chains for complex agents?",
              scenario_context: "You need to build an agent that can retry failed steps and branch based on intermediate results.",
              options: ["LangGraph is faster", "LangGraph supports cycles (retry loops), conditional branching, and parallel execution \u2014 expressing complex decision flows that sequential chains cannot", "LangGraph uses less memory", "LangGraph has better LLM integrations"],
              correct_answer_index: 1,
              explanation: "Sequential chains execute once left to right. LangGraph graphs can loop (agent retries with different approach), branch (different paths based on tool results), and run in parallel (simultaneous tool calls) \u2014 enabling agents that reason and adapt."
            },
            {
              question_text: "Why is tool description quality critical for reliable multi-tool agent behavior?",
              scenario_context: "Your agent consistently selects the wrong tool for tasks.",
              options: ["Tool descriptions affect API latency", "The model uses descriptions to decide when and how to use each tool \u2014 vague descriptions cause incorrect tool selection; precise descriptions enable reliable behavior", "Longer descriptions are always better", "Tool descriptions are ignored by the model"],
              correct_answer_index: 1,
              explanation: "The LLM sees only the tool name and description to decide which tool fits the current step. 'Searches the web' is ambiguous; 'Searches Google for current information about a topic when you need recent news, current events, or real-time data' is precise."
            },
            {
              question_text: "Your AI agent needs to simultaneously retrieve from 3 different data sources to answer a question. What is the most efficient approach?",
              scenario_context: "Sequential retrieval takes 3 seconds; you need sub-1-second response.",
              options: ["Chain retrieval calls sequentially", "Use parallel node execution in LangGraph \u2014 all 3 retrieval nodes execute simultaneously, latency = max(3 retrievals) not sum", "Use only 1 data source", "Pre-cache all possible queries"],
              correct_answer_index: 1,
              explanation: "LangGraph parallel branches execute nodes simultaneously. Three 1-second retrievals run in parallel complete in 1 second total versus 3 seconds sequentially \u2014 critical for user-facing agents."
            },
            {
              question_text: "What is the correct error handling strategy when a critical tool call fails?",
              scenario_context: "Your agent's database query returns an error during production execution.",
              options: ["Log the error and continue as if the query succeeded", "Implement retry with exponential backoff for transient failures; fall back to alternative approaches for persistent failures; never hallucinate results when tools fail", "Immediately return an error to the user", "Silently skip the failed tool call"],
              correct_answer_index: 1,
              explanation: "Tool failure handling: retry transient errors (network timeouts, rate limits) with backoff; for persistent failures, try alternative approaches; always be transparent about unavailability rather than hallucinating results that weren't retrieved."
            }]
        }
      ],
      endQuizQuestions: [            {
              question_text: "Your LangGraph agent state is lost every time the server restarts. Users must restart conversations from scratch. What is the solution?",
              scenario_context: "Production agents must survive process restarts.",
              options: ["Increase server memory", "Implement persistent checkpointing with PostgreSQL checkpointer \u2014 saves complete graph state after each node, enabling resume after restart", "Save state to environment variables", "Increase server instance size"],
              correct_answer_index: 1,
              explanation: "LangGraph checkpointers persist agent state to durable storage. PostgreSQL checkpointer stores state after each node execution. On restart, load the checkpointer and resume from the last checkpoint using the conversation thread ID."
            },
            {
              question_text: "A prompt injection attack successfully makes your tool-using agent execute malicious code by embedding instructions in a retrieved document. What architectural change prevents this?",
              scenario_context: "Security audit found prompt injection vulnerability.",
              options: ["Only retrieve from trusted sources", "Implement structural separation: mark retrieved content as data using XML tags; validate tool call arguments; run tool execution in sandboxed environment; implement output filtering", "Disable code execution tool", "Use a more capable model"],
              correct_answer_index: 1,
              explanation: "Defense in depth: tag retrieved content as <context>...</context> data; validate tool arguments against expected schemas; sandbox code execution; filter outputs for sensitive patterns. No single measure is sufficient."
            }]
    }
  ]
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: existing } = await supabaseClient
      .from("courses").select("id").eq("title", courseData.title).maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({ message: "Course already exists", courseId: existing.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: course, error: courseError } = await supabaseClient
      .from("courses")
      .insert({ title: courseData.title, description: courseData.description, is_published: true })
      .select().single();
    if (courseError) throw courseError;
    for (const chapterData of courseData.chapters) {
      const { data: chapter, error: chErr } = await supabaseClient
        .from("chapters")
        .insert({ course_id: course.id, title: chapterData.title, description: chapterData.description, order_index: chapterData.order_index })
        .select().single();
      if (chErr) throw chErr;
      for (const videoData of chapterData.videos) {
        const transcript = videoData.lessonScript.mainPoints.join("\n\n");
        const { data: video, error: vErr } = await supabaseClient
          .from("videos")
          .insert({ chapter_id: chapter.id, title: videoData.title, description: videoData.description, order_index: videoData.order_index, translations: { en: { title: videoData.title, transcript }, es: { title: videoData.title, transcript }, fr: { title: videoData.title, transcript }, de: { title: videoData.title, transcript }, zh: { title: videoData.title, transcript }, ar: { title: videoData.title, transcript }, ja: { title: videoData.title, transcript } } })
          .select().single();
        if (vErr) throw vErr;
        const { data: quiz, error: qErr } = await supabaseClient
          .from("quizzes")
          .insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 })
          .select().single();
        if (qErr) throw qErr;
        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          await supabaseClient.from("quiz_questions").insert({ quiz_id: quiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
        }
      }
      const { data: endQuiz, error: eqErr } = await supabaseClient
        .from("quizzes")
        .insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 })
        .select().single();
      if (eqErr) throw eqErr;
      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        await supabaseClient.from("quiz_questions").insert({ quiz_id: endQuiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
      }
    }
    return new Response(JSON.stringify({ message: "Course seeded successfully", courseId: course.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
