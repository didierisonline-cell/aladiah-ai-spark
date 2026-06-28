-- =============================================================================
-- ⚠️  DO NOT APPLY — 10-MODULE STRUCTURE ONLY (SUPERSEDED)
-- This file targets the original 10-module DA structure.
-- The DA course was rebuilt as 18 modules. Use 20260628100000_seed_da_quiz_m01_m09.sql
-- and 20260628110000_seed_da_quiz_m10_m18.sql instead.
-- =============================================================================
-- DA Quiz Questions — Modules 6–10 (10-module structure, superseded)
-- Course: AI Data Analyst & Decision Intelligence Professional (da-v1)
-- 15 questions per module × 5 modules = 75 questions total
-- Competency slugs (§8 COMPETENCY_TAXONOMY.md):
--   M6  order_index=6  da:forecasting
--   M7  order_index=7  da:ai-analytics
--   M8  order_index=8  da:decision-support
--   M9  order_index=9  da:data-storytelling
--   M10 order_index=10 da:data-ethics
-- Apply: paste into Supabase SQL Editor → Run
-- =============================================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 6 — Forecasting & Predictive Analytics  (da:forecasting)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 6 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 6'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 6 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1  Foundational — time series components
  (qz, 'Which component of a time series captures the long-run direction of a metric over many years?',
   'A retail analyst is examining five years of monthly sales data and notices the overall revenue level has climbed steadily despite seasonal swings.',
   '["Seasonality","Cyclical component","Trend","Irregular (residual) component"]'::jsonb,
   2, 'Trend is the smooth, long-run direction of the series — an upward or downward drift sustained across many periods. Seasonality repeats on a fixed calendar schedule (e.g., every December), so it would not explain a multi-year directional climb. Cyclical movements are tied to business-cycle expansions/contractions and are typically longer and less regular than seasons. Irregular components are random one-time shocks.', 1, 'da:forecasting', '{}'::jsonb),

  -- Q2  Foundational — seasonality
  (qz, 'A coffee chain sees revenue spike every December and dip every January, repeating the same pattern each year. This is best described as which time series component?',
   'The chain has operated for eight years and the same December-January revenue swing has occurred every single year without exception.',
   '["Trend","Seasonality","Cyclical variation","Forecast bias"]'::jsonb,
   1, 'Seasonality is a regular, predictable pattern that repeats within a fixed period — typically a calendar year. The consistent December spike followed by a January dip fits this definition exactly. Cyclical variation is longer-term and tied to economic cycles rather than calendar periods. Trend refers to the overall direction over many years. Forecast bias is a systematic error in predictions, not a data pattern.', 2, 'da:forecasting', '{}'::jsonb),

  -- Q3  Foundational — moving averages
  (qz, 'What is the primary purpose of applying a moving average to a time series?',
   'A supply-chain analyst is trying to identify whether weekly shipment volumes have an underlying upward trend, but the raw data looks very noisy.',
   '["To increase the accuracy of individual data point measurements","To smooth out short-term fluctuations and highlight the underlying trend","To forecast future values with the smallest possible error","To remove cyclical effects from the series"]'::jsonb,
   1, 'Moving averages are a smoothing technique: by averaging adjacent data points, they dampen random noise and short-term swings, making the underlying trend easier to see. They do not improve the accuracy of individual measurements, and they are a poor direct forecasting tool because they lag the series. They do not specifically target cyclical removal, which requires more sophisticated decomposition.', 3, 'da:forecasting', '{}'::jsonb),

  -- Q4  Foundational — exponential smoothing
  (qz, 'Compared with a simple moving average, what distinguishes exponential smoothing?',
   'An e-commerce analyst needs to track daily active users and wants a smoothed baseline that reacts faster to recent changes than a 30-day moving average.',
   '["It assigns equal weight to all historical observations","It assigns greater weight to more recent observations and less weight to older ones","It requires the series to have no trend or seasonality","It always produces a lower forecast error than a moving average"]'::jsonb,
   1, 'Exponential smoothing applies a decay factor so that recent observations receive higher weight and older observations receive exponentially lower weight — allowing the smoothed value to respond faster to genuine shifts than a simple moving average. A simple moving average weights all included periods equally. Exponential smoothing can be extended (Holt-Winters) to handle trend and seasonality. Neither method guarantees the lowest forecast error for all series.', 4, 'da:forecasting', '{}'::jsonb),

  -- Q5  Foundational — forecast error metrics
  (qz, 'A forecast model produces a Mean Absolute Error (MAE) of 500 units. What does this tell the analyst?',
   'A demand planner is comparing two forecasting models for monthly product demand. Model A has MAE = 500; Model B has MAE = 700.',
   '["The forecast is off by 500 units on average, in absolute terms","The forecast is wrong 500% of the time","The model has a systematic upward bias of 500 units","The model''s worst-case error is 500 units"]'::jsonb,
   0, 'MAE is the average of the absolute differences between forecasted and actual values. An MAE of 500 means the forecast is, on average, 500 units away from the actual value — ignoring direction. It does not measure the percentage of time a forecast is wrong. Systematic bias is captured by Mean Error (ME) or forecast bias, not MAE. MAE is an average, not a maximum-error metric — for the worst case you would use Max AE or look at the residual distribution.', 5, 'da:forecasting', '{}'::jsonb),

  -- Q6  Applied — RMSE vs MAE
  (qz, 'Why might a business prefer Root Mean Squared Error (RMSE) over MAE when evaluating a demand forecast?',
   'A pharmaceutical company is forecasting vaccine demand. Stockout errors of 10,000 doses are far more costly than typical errors of 500 doses.',
   '["RMSE is always smaller than MAE, making the model look better","RMSE penalizes large errors more heavily due to squaring, making it more sensitive to costly outlier errors","RMSE is easier to explain to non-technical stakeholders","RMSE does not require a holdout test set"]'::jsonb,
   1, 'Squaring the errors before averaging (then taking the square root) means RMSE disproportionately penalizes large errors. When a single large error is far more damaging than many small ones — as with vaccine stockouts — RMSE aligns the error metric with business cost. MAE treats all error magnitudes equally. RMSE is often larger than MAE (not smaller) when large errors are present. Both metrics require actual vs. predicted comparison, and RMSE is typically harder to explain to lay audiences.', 6, 'da:forecasting', '{}'::jsonb),

  -- Q7  Applied — regression for forecasting
  (qz, 'An analyst uses linear regression to forecast next quarter''s revenue based on marketing spend and headcount. What key assumption must hold for the regression forecast to be valid?',
   'A SaaS company has 12 quarters of data. The analyst builds a multiple linear regression model with marketing spend and headcount as predictors.',
   '["The independent variables must be perfectly correlated with each other","The relationship between predictors and revenue must be approximately linear across the data range","Revenue must follow a normal distribution in the raw data","The model must produce an R-squared of at least 0.95"]'::jsonb,
   1, 'Linear regression assumes a linear relationship between each predictor and the dependent variable. If the true relationship is non-linear (e.g., diminishing returns on marketing spend), a linear model will produce biased forecasts. High collinearity between predictors (option A) violates a different assumption and inflates standard errors. The normality assumption in regression applies to residuals, not the raw dependent variable. R-squared thresholds are domain-specific — a 0.95 requirement is not a universal validity criterion.', 7, 'da:forecasting', '{}'::jsonb),

  -- Q8  Applied — scenario planning
  (qz, 'In a scenario planning exercise, what distinguishes a "bear case" from a simple downside sensitivity?',
   'A CFO asks the analytics team to produce three revenue scenarios for the coming fiscal year ahead of a board presentation.',
   '["A bear case is the same as a worst-case scenario with the single most pessimistic variable","A bear case is a coherent, internally consistent narrative of conditions (macro, market, operational) that would together produce a low-growth outcome — not just one variable moved to its floor","A bear case uses Monte Carlo simulation while a sensitivity uses a single-variable tweak","A bear case always results in negative revenue growth"]'::jsonb,
   1, 'A well-constructed scenario is a story: a set of mutually consistent conditions (e.g., market contraction + key customer churn + delayed product launch) that together produce the modeled outcome. A simple downside sensitivity moves one variable while holding everything else constant. Bear cases do not require Monte Carlo and do not always imply negative growth — they represent the plausible low end.', 8, 'da:forecasting', '{}'::jsonb),

  -- Q9  Applied — communicating uncertainty
  (qz, 'When presenting a revenue forecast to the board, how should the analyst best communicate uncertainty?',
   'The forecast model has a 90% prediction interval of $80M–$120M around a point estimate of $100M. The CFO asks "what is next year''s revenue?"',
   '["Report only the point estimate ($100M) to avoid confusing the board","State the point estimate is $100M and explain that under the model''s assumptions, 90% of outcomes are expected to fall between $80M and $120M, then discuss which scenarios push toward each end","Refuse to give a number until the prediction interval narrows below 10%","Report only the floor ($80M) to set conservative expectations"]'::jsonb,
   1, 'Honest forecast communication requires both the central estimate and the uncertainty range. Reporting only the point estimate misleads the board about precision. Reporting only the floor is equally distorted. Refusing to provide a number until uncertainty is eliminated ignores that all forecasts carry uncertainty — the analyst''s value is in quantifying and explaining that uncertainty, not eliminating it. A 90% prediction interval ($80M–$120M) gives the board the full picture they need to plan contingencies.', 9, 'da:forecasting', '{}'::jsonb),

  -- Q10  Applied — when NOT to forecast
  (qz, 'Under which condition is historical time-series forecasting LEAST appropriate?',
   'A strategic planner is evaluating whether to use a time-series model to forecast demand for a brand-new product category the company has never offered before.',
   '["When at least 24 months of historical data are available","When the series has a clear seasonal pattern","When there is no historical data because the product category is entirely new","When the series has a discernible trend"]'::jsonb,
   2, 'Time-series forecasting relies on historical patterns to project the future. When there is no historical data — as with a genuinely new product — the method has nothing to learn from. An analyst should instead use market research, analogous product adoption curves, or expert elicitation. Having 24 months of data, a seasonal pattern, or a trend are all conditions that support time-series use, not contra-indications.', 10, 'da:forecasting', '{}'::jsonb),

  -- Q11  Expert — forecast bias
  (qz, 'An analyst notices that over 12 quarters the forecast has consistently underestimated actual sales by an average of 8%. What is the most likely cause and correct action?',
   'The forecasting model has been in production for three years. A post-mortem reveals systematic under-forecasting every single quarter, never random.',
   '["The model has high RMSE — retrain it on more recent data only","The model has systematic positive forecast bias — investigate whether the input assumptions (growth rate, market size) are consistently conservative and adjust accordingly, then add a bias correction factor","The model is overfit to training data — reduce the number of predictors","The error is within acceptable range and no action is needed"]'::jsonb,
   1, 'A consistent directional error (always under by ~8%) is forecast bias, not random error. This suggests a structural problem with model inputs or assumptions — for example, a market growth assumption that is too conservative. The fix is to diagnose the source of the bias, adjust the assumption, and optionally apply a bias correction term. High RMSE addresses variance, not systematic direction. Overfitting produces different symptoms (good training error, poor test error). An 8% systematic miss quarter after quarter is not acceptable for planning purposes.', 11, 'da:forecasting', '{}'::jsonb),

  -- Q12  Expert — sensitivity analysis
  (qz, 'In a sensitivity analysis, an analyst finds that a 1% change in customer churn rate changes 5-year NPV by $12M, while a 10% change in marketing spend changes NPV by only $2M. What should the analyst recommend?',
   'A SaaS company is deciding where to focus operational investment. The executive team wants to know which variables most materially drive long-term value.',
   '["Double the marketing budget because it has a larger absolute change","Prioritize retention initiatives — churn is 60× more NPV-sensitive per unit of change than marketing spend, making it the highest-leverage lever","Ignore both variables because NPV is only affected by revenue growth","Run a Monte Carlo simulation before making any recommendation"]'::jsonb,
   1, 'Sensitivity analysis ranks the variables by their influence on the outcome per unit of change. Churn is 60× more impactful per percentage point than marketing spend per 10-point increase ($12M vs. $0.2M per equivalent unit), making it the highest-leverage investment target. The goal of sensitivity analysis is exactly this prioritization. Monte Carlo simulation adds probabilistic depth but is a follow-on step — the sensitivity finding already points clearly to churn. Marketing spend sensitivity ($2M for a 10% change) is small relative to churn.', 12, 'da:forecasting', '{}'::jsonb),

  -- Q13  Expert — decomposition
  (qz, 'An analyst decomposes monthly sales data using STL (Seasonal-Trend decomposition using LOESS). After removing the seasonal and trend components, the remaining residuals still show a large unexplained spike in March 2022. What should the analyst do first?',
   'The company launched an emergency promotion in March 2022 following a competitor''s recall. The event was never recorded in the analysis dataset.',
   '["Discard the residuals and proceed with the trend forecast","Investigate the spike: identify that the March 2022 promotion is an external event not captured in the model, add it as a dummy variable or outlier treatment, and rerun the decomposition","Increase the seasonal window in the LOESS smoother to absorb the spike","Accept the residuals as normal statistical noise"]'::jsonb,
   1, 'Unexplained residual spikes after decomposition are signals, not noise to be dismissed. The correct first action is to investigate the cause. Here, a known external event (the promotion) was not encoded — adding a dummy variable or applying an outlier treatment before redecomposition will produce a cleaner model. Widening the LOESS smoother would distort the seasonal estimate by absorbing a legitimate outlier into the seasonal component. Residuals from a known structural event should never be labeled "normal noise."', 13, 'da:forecasting', '{}'::jsonb),

  -- Q14  Expert — selecting forecast horizon
  (qz, 'A logistics manager asks the analyst to produce a "precise" 18-month weekly demand forecast. What is the most important professional caution to communicate?',
   'The analyst''s best model has a 1-month MAE of 3% but the error compounds significantly beyond 8 weeks.',
   '["Agree to produce the forecast and deliver it without caveats to maintain stakeholder confidence","Explain that forecast accuracy degrades with horizon length — the 18-month weekly forecast will carry substantially wider uncertainty bands than the near-term forecast, and present it with explicit confidence intervals that widen over time","Refuse to produce any forecast beyond 4 weeks","Increase the training data window to reduce long-horizon error"]'::jsonb,
   1, 'Forecast accuracy universally declines as the horizon extends, because small errors compound and structural conditions change. The professional obligation is to deliver the forecast the business needs while being explicit about degrading precision over time — showing widening confidence intervals at 3, 6, 12, and 18 months. Suppressing the uncertainty to appear confident is analytically dishonest and creates planning risk. Refusal is unhelpful when a hedged long-range forecast is genuinely better than no forecast.', 14, 'da:forecasting', '{}'::jsonb),

  -- Q15  Expert — integrated scenario
  (qz, 'A retailer''s forecast model predicts $95M in Q4 revenue. The model uses only 18 months of data and was built before a new competitor entered the market. A senior analyst reviews it and flags two risks. What is the most appropriate recommendation?',
   'The Q4 revenue forecast is the basis for inventory purchasing commitments totaling $30M. The competitor entered six weeks ago and has captured an estimated 5–8% market share in early data.',
   '["Accept the model as-is because the competitor''s effect is too recent to quantify","Rebuild the forecast incorporating the competitor impact as a demand reduction assumption (5–8% range), extend the training data if available, present three scenarios (base/bull/bear) with explicit assumptions, and flag that $30M inventory commitments should be staggered to preserve flexibility until Q4 visibility improves","Lower the point forecast to $85M without explanation to be conservative","Halt the purchasing decision until a new model can be built from scratch with 5 years of data"]'::jsonb,
   1, 'This scenario tests integrated forecasting judgment. The right answer is to update the model with available competitive impact data, present a range of scenarios rather than a single point, and explicitly recommend that the purchasing decision be staged to preserve optionality given the uncertainty. Ignoring the competitor ignores knowable risk. Arbitrarily lowering the forecast without explanation is intellectually dishonest. Halting the purchasing decision entirely is impractical. The analyst''s role is to quantify uncertainty and recommend decision structures that are robust to it.', 15, 'da:forecasting', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 7 — AI-Augmented Analytics  (da:ai-analytics)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 7 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 7'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 7 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1  Foundational — NL-to-SQL concept
  (qz, 'What is a Natural Language-to-SQL (NL-to-SQL) tool?',
   'A business stakeholder without SQL skills wants to query the company''s sales database by typing questions in plain English.',
   '["A tool that automatically builds the database schema from English descriptions","A system that translates plain-English questions into executable SQL queries using a language model","A reporting tool that labels chart axes with plain English","A tool that converts SQL error messages into plain English explanations"]'::jsonb,
   1, 'NL-to-SQL tools use language models to interpret a natural-language question and generate a syntactically and semantically correct SQL query against a known schema. They allow non-technical users to query databases directly. They do not design schemas from descriptions, label charts, or translate error messages — those are distinct use cases.', 1, 'da:ai-analytics', '{}'::jsonb),

  -- Q2  Foundational — validating AI-generated SQL
  (qz, 'An analyst uses an AI tool to generate a SQL query and receives results instantly. What is the MOST important next step before sharing the results with stakeholders?',
   'The AI produced a complex multi-table join query in seconds. The results look plausible and the numbers feel about right.',
   '["Share the results immediately — the AI would not produce incorrect SQL","Ask the AI to explain the query in plain English and then verify the logic against the schema definition, join keys, and expected row counts using a known control dataset","Only check the formatting of the output table","Ask a second AI tool to generate the same query and compare"]'::jsonb,
   1, 'AI-generated SQL can be syntactically correct but semantically wrong — joining on the wrong keys, aggregating at the wrong grain, or silently excluding rows. The analyst must validate the query logic against the actual schema, inspect join cardinality, and compare against a known control. Feeling "about right" is not validation. Using a second AI to cross-check adds a layer but does not replace schema-level verification.', 2, 'da:ai-analytics', '{}'::jsonb),

  -- Q3  Foundational — AI hallucination in analytics
  (qz, 'In an analytical context, what is an "AI hallucination"?',
   'An analyst uses an LLM to summarize key findings from a 50-page industry report. The summary contains a statistic that cannot be found anywhere in the source document.',
   '["When the AI produces a result that is correct but formatted differently than expected","When the AI generates a confident, plausible-sounding but factually incorrect or unsupported claim","When the AI takes longer than expected to produce a response","When the AI refuses to answer a question"]'::jsonb,
   1, 'AI hallucination occurs when a language model generates text that is confidently stated but factually incorrect, fabricated, or not supported by the source material. In analytics, this is high-stakes because a fabricated statistic in a report or AI-generated SQL can propagate into decisions. Formatting differences and slow responses are not hallucinations. Refusals are a different model behavior entirely.', 3, 'da:ai-analytics', '{}'::jsonb),

  -- Q4  Foundational — supervised vs unsupervised ML
  (qz, 'What is the key distinction between supervised and unsupervised machine learning?',
   'A data science team proposes two ML approaches: one to predict customer churn (yes/no), and another to discover hidden customer segments with no predefined labels.',
   '["Supervised learning uses more data; unsupervised learning uses less","Supervised learning trains on labeled examples where the correct output is known; unsupervised learning finds patterns in data without predefined labels","Supervised learning only works for classification; unsupervised only works for regression","Supervised learning runs on the cloud; unsupervised learning runs locally"]'::jsonb,
   1, 'The defining difference is labels: supervised learning uses labeled training examples (e.g., historical churn = yes/no) to learn a mapping from inputs to outputs. Unsupervised learning discovers structure in data with no predefined labels — such as customer segmentation via clustering. The distinction is about label availability, not data volume, task type, or compute location.', 4, 'da:ai-analytics', '{}'::jsonb),

  -- Q5  Foundational — augmented analytics platforms
  (qz, 'Which of the following best describes "augmented analytics"?',
   'A BI team is evaluating whether to adopt an AI-powered feature that automatically surfaces insights, flags anomalies, and suggests visualizations within their dashboard tool.',
   '["Analytics performed exclusively by AI with no human involvement","The use of AI and machine learning to automate data preparation, insight discovery, and explanation, augmenting — not replacing — the human analyst","Augmented reality dashboards displayed on mixed-reality headsets","Traditional BI dashboards that are larger and more detailed than standard reports"]'::jsonb,
   1, 'Augmented analytics is a Gartner-defined concept: embedding AI/ML into the analytics workflow to automate routine tasks (data prep, anomaly detection, insight suggestion) so the human analyst can focus on higher-order interpretation and decision-making. The keyword is "augmenting" — the analyst remains in the loop. It has nothing to do with AR/VR headsets or larger dashboards.', 5, 'da:ai-analytics', '{}'::jsonb),

  -- Q6  Applied — prompt engineering for data tasks
  (qz, 'An analyst wants an LLM to write a SQL query to calculate 30-day rolling retention by cohort. Which prompt approach will produce the most reliable output?',
   'The database has three tables: users (user_id, signup_date), events (user_id, event_date, event_type), and cohorts (user_id, cohort_month).',
   '["Ask: ''Write a SQL query for retention''","Ask: ''Write a SQL query that calculates the percentage of users from each monthly signup cohort who performed any event in the 30 days following their signup date. Tables: users (user_id, signup_date), events (user_id, event_date, event_type), cohorts (user_id, cohort_month). Use BigQuery SQL syntax. Return cohort_month, total_users, retained_users, and retention_rate.''","Ask: ''Make a retention dashboard''","Ask: ''Is retention good for this company?''"]'::jsonb,
   1, 'Effective prompt engineering for data tasks requires specificity: the exact calculation needed, the table schema, dialect, and desired output columns. Vague prompts like "write a SQL query for retention" produce generic, often incorrect SQL because the model must guess the schema, the retention definition, and the SQL dialect. The detailed prompt eliminates ambiguity and gives the model everything it needs to produce accurate, runnable SQL.', 6, 'da:ai-analytics', '{}'::jsonb),

  -- Q7  Applied — anomaly detection
  (qz, 'An AI anomaly detection tool flags 47 transactions as suspicious in a week where the business processed 50,000 transactions. The analyst investigates and finds that 40 of the 47 flags are false positives. What should the analyst conclude?',
   'The tool was implemented without tuning two weeks ago. The threshold sensitivity setting is at its default maximum.',
   '["The tool is working perfectly — all 47 flags should be escalated","The tool''s precision is low (~15%) at the current threshold; the analyst should tune the sensitivity threshold, review the feature weights, and establish a feedback loop so confirmed false positives improve the model","AI anomaly detection is fundamentally unreliable and should be abandoned","The 40 false positives are acceptable because the 7 true positives justify the tool"]'::jsonb,
   1, 'Precision = true positives / (true positives + false positives) = 7/47 ≈ 15%. A 15% precision rate means investigators spend 85% of their time on false alarms — a serious operational cost. The correct action is threshold tuning (lowering sensitivity to reduce false positives) and establishing a feedback loop. Accepting 85% false positive rates as "good enough" ignores investigator burden. Abandoning AI anomaly detection discards genuine value; tuning is the right path.', 7, 'da:ai-analytics', '{}'::jsonb),

  -- Q8  Applied — AI vs analyst judgment boundary
  (qz, 'An AI analytics tool recommends discontinuing a product line based on declining revenue data. The analyst knows that the product is a strategic loss-leader that drives premium upsells. What should the analyst do?',
   'The AI tool has no visibility into the upsell revenue stream because it sits in a separate system of record that was excluded from the analysis dataset.',
   '["Accept the AI recommendation because it is based on data","Override the AI recommendation with qualitative judgment and escalate for a full analysis that includes upsell revenue — documenting why the AI conclusion was incomplete","Implement the discontinuation immediately to demonstrate data-driven decision-making","Ask the AI to run the analysis again with a different time window"]'::jsonb,
   1, 'AI tools analyze the data they are given — they cannot know what is excluded. The analyst has contextual knowledge the model lacks: the upsell relationship. The correct action is to recognize the model''s data limitation, override the recommendation, and commission a complete analysis that includes upsell revenue. Blindly following an AI recommendation despite knowing the data is incomplete is a professional failure. Re-running the same incomplete analysis produces the same incomplete answer.', 8, 'da:ai-analytics', '{}'::jsonb),

  -- Q9  Applied — responsible AI use
  (qz, 'A data analyst is asked to use an AI tool to analyze customer complaint data. The tool requires uploading the raw dataset, which contains names, emails, and account numbers. What is the responsible action?',
   'The company''s data governance policy prohibits sending personally identifiable information (PII) to third-party SaaS tools without a signed Data Processing Agreement.',
   '["Upload the data because the analysis is urgent and the AI tool is well-known","Anonymize or pseudonymize the PII fields before uploading — or obtain a signed DPA and confirm the tool is compliant — before proceeding","Ask the AI tool to anonymize the data after upload","Proceed and delete the upload immediately after analysis"]'::jsonb,
   1, 'Data governance and privacy obligations apply regardless of urgency or tool reputation. PII must be protected before being sent outside the organization''s control boundary. The correct action is to either anonymize/pseudonymize the data first, or ensure a DPA is in place and the tool is policy-compliant. Asking the tool to anonymize after upload means PII has already left the perimeter. Deleting after upload does not undo the privacy exposure.', 9, 'da:ai-analytics', '{}'::jsonb),

  -- Q10  Applied — evaluating AI-generated SQL quality
  (qz, 'An AI generates a SQL query using a LEFT JOIN to combine a customers table with an orders table. The result shows 2,000 customer rows, but only 800 have order data. What should the analyst verify before using these results?',
   'The analyst expects approximately 1,500 customers to have placed at least one order based on prior reports.',
   '["Assume the AI is correct and proceed — the 800 rows must reflect customers who never ordered","Verify the join key and join direction: confirm that customer_id is the correct join key, that no customers are being dropped due to key mismatches, and investigate why only 800 rows have order data when ~1,500 are expected","Change the LEFT JOIN to an INNER JOIN to get only matched rows","Ask the AI to rewrite the query until the number reaches 1,500"]'::jsonb,
   1, 'When AI-generated query results differ from expected values, the analyst must investigate the join logic: wrong key, wrong table direction, or data quality issues (e.g., orders using a different ID format). 800 vs. 1,500 expected matched rows is a significant discrepancy that warrants investigation before the results are used. Blindly accepting the output risks downstream analytical errors. Changing to INNER JOIN would hide the mismatches rather than explain them. Iterating the prompt without verifying the root cause is not a reliable fix.', 10, 'da:ai-analytics', '{}'::jsonb),

  -- Q11  Expert — ML fundamentals: classification vs clustering
  (qz, 'A marketing team wants to identify distinct behavioral groups among 500,000 customers without any predefined segment definitions. Which ML approach is most appropriate?',
   'The company has never formally defined customer segments and wants the data to reveal natural groupings based on purchase frequency, average order value, and product category mix.',
   '["Logistic regression — to predict which segment each customer belongs to","K-means or hierarchical clustering — unsupervised methods that discover natural groupings without predefined labels","A/B testing — to compare two proposed segment definitions","Decision trees — to classify customers into segments based on labeled training data"]'::jsonb,
   1, 'When no predefined labels exist and the goal is to discover natural groupings, unsupervised clustering (K-means, hierarchical clustering) is the correct approach. Logistic regression and decision trees require labeled training data — they classify into known categories. A/B testing compares two known alternatives and is not a segmentation discovery method.', 11, 'da:ai-analytics', '{}'::jsonb),

  -- Q12  Expert — evaluating augmented analytics output
  (qz, 'A Power BI Copilot feature automatically surfaces the insight: "Revenue is up 23% driven by the Western region." Before presenting this to the CFO, what should the analyst verify?',
   'The CFO will base a regional investment decision on this finding. The Western region recently onboarded a large enterprise account.',
   '["Present it immediately — Copilot is a Microsoft product and is reliable","Verify the calculation (compare to raw data), check the time period used, confirm whether the large enterprise account is excluded from ''organic'' growth, and understand whether Copilot controlled for the account-size effect before attributing growth to the region","Ask Copilot to generate the same insight a second time to confirm consistency","Only verify if the CFO asks questions"]'::jsonb,
   1, 'AI-surfaced insights must be validated before executive use. The specific risks here: the large enterprise account may be inflating the regional metric, the time period may not match the CFO''s intended comparison window, and Copilot may not have controlled for account size. The analyst is responsible for the accuracy of what they present — AI auto-generated insights are starting points, not finished analysis.', 12, 'da:ai-analytics', '{}'::jsonb),

  -- Q13  Expert — prompt iteration and context
  (qz, 'An analyst prompts an LLM three times with the same data task and receives three different SQL queries, all syntactically valid but logically different. What is the most likely cause and correct action?',
   'The original prompt was: "Analyze our sales data and give me useful insights." The analyst is using a temperature setting of 0.9.',
   '["The LLM is broken — replace it with a different tool","The vague prompt allows multiple valid interpretations, and the high temperature setting introduces randomness. The correct action is to write a specific, constrained prompt with exact table names, the precise metric definition, and reduce temperature to near zero for deterministic analytical output","Randomly select one of the three queries and use it","Average the three query results"]'::jsonb,
   1, 'Two compounding problems: a vague prompt (many valid interpretations exist) and high temperature (0.9 introduces randomness that causes different outputs each run). For analytical SQL tasks, prompts must be specific and deterministic (temperature near 0). Vague prompts combined with high temperature are particularly problematic because the model has both latitude to interpret differently AND randomness to vary execution. Selecting or averaging without understanding the queries would produce unreliable results.', 13, 'da:ai-analytics', '{}'::jsonb),

  -- Q14  Expert — AI analyst boundary in regulated industry
  (qz, 'A healthcare analytics team uses an AI tool to flag patient records most likely to be readmitted within 30 days. A clinician challenges a specific flag, saying the patient''s clinical context makes readmission unlikely. Who should have the final say?',
   'The AI model has an AUC of 0.78 and was validated on historical data. The clinician has 15 years of experience with this patient population.',
   '["The AI — its AUC score is high and it is unbiased","The clinician — AI in clinical settings must operate as a decision-support tool, not a final arbiter; the clinician''s contextual knowledge of the specific patient is authoritative and the AI flag is an input to clinical judgment, not a replacement for it","The hospital administrator — to resolve disputes between AI and clinicians","Whoever has seniority on the care team"]'::jsonb,
   1, 'AI clinical tools are decision-support systems — they augment, not replace, clinical judgment. An AUC of 0.78 means the model is wrong roughly 22% of the time in ranked ordering; it will make errors on individual cases. The clinician''s contextual knowledge of a specific patient is not captured in the model''s training data. In regulated healthcare settings, liability and patient safety require that a qualified clinician holds final decision authority. The AI flag is a prompt to look closely, not a clinical order.', 14, 'da:ai-analytics', '{}'::jsonb),

  -- Q15  Expert — integrated AI analytics scenario
  (qz, 'An analyst uses NL-to-SQL to answer the question "Which products had the highest return rate last quarter?" The AI generates a query that joins orders and returns tables, producing a top-10 list. The #1 product has a return rate of 87%. Before escalating to the product team, what integrated verification steps should the analyst take?',
   'The analyst suspects the 87% figure is unusually high. The returns table was migrated to a new schema six weeks ago and the migration notes mention some null handling changes.',
   '["Escalate immediately — an 87% return rate is clearly a product defect","Verify the SQL join logic and key columns against the new schema, check for null handling differences post-migration that might be inflating the return count, confirm the denominator (total orders for the product) is correct, and compare against a manual count for the top product before escalating","Accept the result — the AI generated the query from the correct tables","Ask the AI to run the query again to confirm"]'::jsonb,
   1, 'An 87% return rate is a red flag that demands verification before escalation. The schema migration and null handling change are prime suspects for data quality issues. The analyst must: (1) read the new schema documentation, (2) check whether null returns are being counted as actual returns, (3) verify the denominator (order count), and (4) spot-check with a manual count. Escalating an unverified anomaly to the product team wastes their time and undermines analytical credibility. Re-running the same query against potentially corrupt data produces the same incorrect result.', 15, 'da:ai-analytics', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 8 — Executive Decision Support  (da:decision-support)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 8 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 8'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 8 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1  Foundational — decision types
  (qz, 'What distinguishes a reversible decision from an irreversible one in a business context?',
   'A CEO must choose between testing a new pricing model with a 90-day pilot (which can be rolled back) and permanently restructuring the company''s pricing architecture.',
   '["Reversible decisions are made by junior staff; irreversible ones by executives","A reversible decision can be undone at low cost if it proves wrong; an irreversible decision (or one with very high reversal cost) commits the organization to a path that is very difficult to undo","Reversible decisions are always lower-value; irreversible ones are always higher-value","Reversible decisions require less data analysis to make"]'::jsonb,
   1, 'The reversible/irreversible distinction matters for decision process design. Low-cost-to-reverse decisions (Amazon calls them "two-way doors") can be made faster with less data — the ability to course-correct reduces downside risk. High-reversal-cost decisions ("one-way doors") warrant more deliberation, deeper analysis, and broader stakeholder alignment because mistakes are expensive to undo. The distinction is about reversal cost, not organizational level or decision value.', 1, 'da:decision-support', '{}'::jsonb),

  -- Q2  Foundational — structured vs unstructured decisions
  (qz, 'Which type of decision is most appropriate for rules-based automation or a standardized decision tree?',
   'A bank must decide whether to approve thousands of routine small-business loan applications each day based on defined credit criteria.',
   '["Unstructured decisions — they require unique judgment each time","Strategic decisions — they affect the company''s direction","Structured decisions — they follow defined criteria, repeat frequently, and can be evaluated with consistent rules","Creative decisions — they require novel thinking"]'::jsonb,
   2, 'Structured decisions are repetitive, well-defined, and follow consistent criteria that can be encoded in rules or models — making them ideal candidates for automation or standardized decision trees. Loan approvals with defined credit criteria fit this exactly. Unstructured decisions (e.g., entering a new market) require unique judgment and contextual understanding that rules cannot capture. Strategic and creative are not standard decision-type classifications in decision intelligence.', 2, 'da:decision-support', '{}'::jsonb),

  -- Q3  Foundational — MECE framing
  (qz, 'What does "MECE" mean and why is it important in decision framing?',
   'A strategy analyst is structuring the options for a market expansion decision. The list currently has overlapping categories and a missing alternative.',
   '["Most Efficient Current Evaluation — a speed-focused analysis method","Mutually Exclusive, Collectively Exhaustive — a structuring principle that ensures options do not overlap and together cover all meaningful alternatives","Minimum Evidence for Confident Evaluation — a data sufficiency standard","Multiple Executives Confirming Each other — a governance review process"]'::jsonb,
   1, 'MECE (Mutually Exclusive, Collectively Exhaustive) is a McKinsey-originated structuring principle. Mutually Exclusive means no overlap between options — choosing one does not partially choose another. Collectively Exhaustive means the set covers all meaningful alternatives — no important option is missing. Violations of MECE produce confused deliberation: overlap causes double-counting, and gaps mean the actual best option may never be considered.', 3, 'da:decision-support', '{}'::jsonb),

  -- Q4  Foundational — expected value
  (qz, 'A company is choosing between two options. Option A has a 70% chance of generating $1M profit and a 30% chance of losing $500K. Option B guarantees $400K profit. Based purely on expected value, which option should the company choose?',
   'The company''s risk appetite is neutral for this investment scale, and the decision will be made once with no opportunity to average across multiple trials.',
   '["Option B — it is guaranteed and has no downside","Option A — its expected value ($550K) exceeds Option B''s guaranteed $400K","Both options are equivalent","Option B — expected value analysis does not apply to one-time decisions"]'::jsonb,
   1, 'Expected Value (Option A) = (0.70 × $1,000,000) + (0.30 × -$500,000) = $700,000 - $150,000 = $550,000. This exceeds Option B''s certain $400,000. Under risk-neutral assumptions, EV maximization is the correct decision rule. Option B is preferred only if the company is risk-averse and the potential $500K loss is existentially threatening — which the scenario excludes by stating neutral risk appetite. EV analysis applies to all decisions, including one-time events.', 4, 'da:decision-support', '{}'::jsonb),

  -- Q5  Foundational — cognitive biases
  (qz, 'A marketing team champions a new campaign strategy because it matches their recent successful campaign. They dismiss data showing the new market is fundamentally different. Which cognitive bias is most likely at work?',
   'The team''s last three campaigns used a similar approach and all succeeded. They are now applying the same strategy to a new demographic without adjusting for the different context.',
   '["Anchoring bias — they are stuck on the initial price estimate","Availability heuristic — they are overweighting the easily recalled successful examples rather than seeking disconfirming evidence","Confirmation bias — they are only looking for data that supports their preferred approach","Sunk cost fallacy — they feel they must recover prior investment"]'::jsonb,
   1, 'The availability heuristic occurs when people judge probability or quality based on how easily examples come to mind. Three recent successes are highly memorable, so the team overestimates how likely this approach is to work again. Confirmation bias would be filtering data to support a pre-existing conclusion. Anchoring refers to over-relying on an initial reference number. Sunk cost involves justifying ongoing investment due to past spending.', 5, 'da:decision-support', '{}'::jsonb),

  -- Q6  Applied — decision trees
  (qz, 'A decision tree shows that launching a product in Market A has an expected value of $2.1M, while launching in Market B has an expected value of $1.7M. However, Market A requires $800K upfront investment while Market B requires $200K. Which consideration is the decision tree alone NOT capturing?',
   'The company has $300K in available capital. Market A requires a capital raise or debt, while Market B can be self-funded from current reserves.',
   '["The probability of success in each market","The expected payoff of each option","Cash flow constraints and capital availability — the $800K Market A requirement may be infeasible given only $300K in available capital","The time required to enter each market"]'::jsonb,
   2, 'Decision trees model expected values based on probabilities and payoffs, but standard trees do not account for capital constraints, cash-flow timing, or feasibility. A company with $300K available cannot simply choose a path requiring $800K without additional analysis of financing options. The decision tree correctly calculates that Market A has higher EV — but the practical constraint means Market B may be the only executable option without a capital raise. Analysts must always check whether the EV-maximizing option is actually implementable.', 6, 'da:decision-support', '{}'::jsonb),

  -- Q7  Applied — confirmation bias
  (qz, 'An executive has already decided to acquire a target company and asks the analyst to "find the data that supports the deal." What is the professional risk and correct analyst response?',
   'The deal has not been formally approved, but the executive has announced their intent internally. The analyst is the only person doing the financial due diligence.',
   '["Accept the assignment — serving the executive is the analyst''s primary duty","The risk is confirmation bias at the organizational level; the analyst should conduct a full, balanced analysis including risks and contra-indications, clearly label which data supports the deal and which raises concerns, and present both to the executive and the approval committee","Only find supporting data — the executive''s confidence signals the deal is correct","Refuse to conduct any analysis on the deal"]'::jsonb,
   1, 'When an analyst is asked to cherry-pick supporting evidence, the organization is exposed to confirmation bias at the institutional level — the deal may proceed based on incomplete information. The analyst''s professional obligation is to provide complete, balanced analysis: both evidence that supports the deal and evidence that challenges it. Presenting only supporting data is analytically dishonest and exposes the company to real financial risk if the deal fails. The analyst should present both sides and let the decision-makers decide.', 7, 'da:decision-support', '{}'::jsonb),

  -- Q8  Applied — decision quality vs outcome quality
  (qz, 'A company made a well-researched, carefully analyzed decision to enter Market X. Due to an unexpected global event, the market collapsed and the decision produced a large loss. How should the quality of the original decision be assessed?',
   'The decision was made six months ago with the best available data. The global event (a sudden trade restriction) was not foreseeable by any reasonable analysis at the time.',
   '["The decision was bad — it resulted in a large loss","The decision should be assessed on the quality of the process and information available at the time, not the outcome — an unforeseeable event does not retroactively make a well-made decision a bad one","The decision was acceptable because global events are beyond control","Future decisions should always be more conservative to avoid such losses"]'::jsonb,
   1, 'Decision quality and outcome quality are distinct. A high-quality decision process (clear framing, thorough analysis, consideration of risks) can still produce a bad outcome due to events outside the model''s scope. Judging decisions purely by outcomes is known as "resulting" — a logical error that punishes good processes for bad luck and rewards bad processes for good luck. The correct evaluation framework is process quality, not result quality. Post-hoc blanket conservatism from one unforeseeable event is itself a poor decision.', 8, 'da:decision-support', '{}'::jsonb),

  -- Q9  Applied — the decision brief
  (qz, 'What are the five core components of a well-structured decision brief for executives?',
   'A senior analyst must present a make-vs-buy recommendation on a new software platform in a single-page format within 48 hours.',
   '["Company history, product roadmap, team bios, financial statements, and appendices","Situation (current state and problem), Options (the MECE set of alternatives with pros/cons), Recommendation (the preferred option with rationale), Risks and mitigations, and the Ask (specific decision or approval requested)","Executive summary, table of contents, methodology, detailed data tables, and references","Vision statement, mission statement, values, SWOT analysis, and next steps"]'::jsonb,
   1, 'The decision brief is a precision instrument. Situation grounds the reader in context. Options lays out the MECE alternative set. Recommendation commits to a position with reasoning. Risks ensures the decision-maker understands downside. The Ask specifies exactly what decision or action is needed from the executive. This structure respects executive time and drives decisions. Academic formats (methodology, references) or strategic planning formats (vision, values) are not appropriate for operational decision briefs.', 9, 'da:decision-support', '{}'::jsonb),

  -- Q10  Applied — anchoring bias
  (qz, 'During budget negotiations, an executive opens by proposing a $2M ceiling for a new analytics platform. Subsequent discussion focuses entirely on whether the real cost is $1.8M or $1.9M. What cognitive bias is likely distorting this negotiation?',
   'An independent market analysis found that comparable platforms typically cost $800K–$1.2M. This information was shared but quickly dismissed after the executive''s opening proposal.',
   '["Availability heuristic — the team is recalling memorable past purchases","Anchoring bias — the $2M opening proposal has anchored the discussion range, causing participants to adjust from that number rather than independently evaluating market-rate costs","Confirmation bias — the team is seeking data that supports $2M","Sunk cost fallacy — they feel committed to the $2M level"]'::jsonb,
   1, 'Anchoring bias occurs when an initial reference number (the anchor) disproportionately influences subsequent judgments. Once $2M was stated, all discussion adjusted from that anchor — even though independent market data ($800K–$1.2M) was available. The correct approach is to explicitly name the anchor, return to the market-rate evidence, and evaluate cost independently before any anchor is set. This is why good negotiation practice often involves presenting independent benchmarks before any opening offer is made.', 10, 'da:decision-support', '{}'::jsonb),

  -- Q11  Expert — when data alone is not enough
  (qz, 'All available data shows that Option A maximizes short-term profitability. The CEO is hesitant and says there is a "strategic reason" to consider Option B. How should the analyst handle this?',
   'The company is considering whether to maintain a legacy product (Option A: highest near-term margin) or invest in a next-generation platform (Option B: lower near-term margin but positions the company for a future market shift the CEO anticipates).',
   '["Override the CEO''s hesitation with the data — Option A is clearly optimal","Recognize that the CEO''s strategic foresight about a market shift is a legitimate, data-relevant input; ask the CEO to articulate the assumption explicitly, then model it — quantify what Option B''s payoff would be IF the market shift occurs, and present both scenarios with explicit assumptions","Automatically choose Option B because the CEO prefers it","Declare the decision cannot be made until more data is available"]'::jsonb,
   1, 'Data captures the past and present; strategic judgment addresses anticipated futures that data does not yet reflect. The analyst''s role is to bridge the gap: elicit the CEO''s assumption (the market shift), make it explicit, model its financial implications, and present both scenarios with transparent assumptions. "Data alone is not enough" does not mean abandoning analysis — it means expanding the analysis to include forward-looking strategic assumptions. Overriding the CEO ignores legitimate strategic context; automatically deferring abandons analytical value.', 11, 'da:decision-support', '{}'::jsonb),

  -- Q12  Expert — handling uncertainty in decisions
  (qz, 'A company must decide whether to build a new warehouse before demand certainty is established. Delaying costs $500K/month in lost capacity. Building immediately requires $10M and may be unnecessary if demand does not materialize. What decision-support framework is most appropriate?',
   'Management wants to decide within two weeks but will not have demand certainty for four months. The $500K/month opportunity cost is real and accumulating.',
   '["Wait four months for demand certainty before making any decision","Apply a real options framework: evaluate the option to delay (value of waiting × time × cost), the option to build in phases (lower immediate commitment), and the option to build now (largest upside if demand materializes) — model expected value under each path and recommend the approach that minimizes regret across scenarios","Build immediately — the $500K/month opportunity cost always justifies action","Hire a consultant to make the decision"]'::jsonb,
   1, 'When decisions must be made under uncertainty with asymmetric costs of action vs. inaction, a real options or scenario-based framework is most appropriate. The analyst models: (1) cost of waiting ($500K/month × delay period), (2) cost of building unnecessarily ($10M minus salvage value), (3) cost of delayed build if demand materializes (revenue lost while waiting). Phased building may offer a middle path. The goal is to identify the decision with the best expected outcome and minimum regret across scenarios. Binary "wait vs. build now" framing misses the structured analysis opportunity.', 12, 'da:decision-support', '{}'::jsonb),

  -- Q13  Expert — multi-criteria decision analysis
  (qz, 'A city government is choosing between three vendors for a public safety analytics platform. Price, reliability, data privacy compliance, and vendor support quality all matter. Which approach gives the most defensible and transparent decision?',
   'The evaluation committee has six members with different priorities. There is no agreed weighting of the four criteria.',
   '["Choose the cheapest vendor — public money demands cost minimization","Build a weighted scoring model: agree on criteria weights through structured deliberation, score each vendor on each criterion with documented evidence, calculate weighted totals, and present the full matrix to the committee — then make the recommendation transparent to the public","Choose the vendor the majority of committee members personally prefer","Require all vendors to reduce their price and then choose the cheapest"]'::jsonb,
   1, 'Multi-criteria decisions in public settings require transparency and defensibility. A weighted scoring matrix makes explicit: which criteria matter (and how much), how each vendor performs on each, and how the final recommendation follows from those inputs. This is auditable and explainable to the public. Pure cost minimization ignores the other three material criteria (reliability, privacy compliance, support quality). Preference voting without structured evidence is opaque and inconsistent. Price competition alone ignores non-price criteria that public safety depends on.', 13, 'da:decision-support', '{}'::jsonb),

  -- Q14  Expert — decision quality framework
  (qz, 'The Decision Quality framework identifies six elements of a high-quality decision. Which combination represents the MINIMUM required for a decision to be considered "high quality"?',
   'A project team debates whether to proceed before completing a stakeholder alignment step, arguing they already have good data and clear options.',
   '["Good data and clear options are sufficient for a high-quality decision","All six elements must be present: appropriate frame, creative alternatives (MECE), meaningful reliable information, clear values and trade-offs, logically correct reasoning, and commitment to action — weakness in any one element limits overall decision quality","Only the framing and the final recommendation matter","High quality only requires that executives agree on the outcome"]'::jsonb,
   1, 'The Stanford Decision Quality chain treats decision quality as a chain — as strong as its weakest link. Having good data (information quality) and MECE options (creative alternatives) but missing stakeholder alignment (commitment to action) or shared values means the decision will not be implemented effectively. All six elements must meet a threshold. This is why the team''s argument — "we have data and options" — is incomplete. Skipping stakeholder alignment guarantees implementation resistance.', 14, 'da:decision-support', '{}'::jsonb),

  -- Q15  Expert — integrated decision support scenario
  (qz, 'An analyst is asked to recommend whether to discontinue a product. The product has declining revenue (-18% YoY) but serves a loyal customer segment that buys 3× more of the company''s other products. Finance wants it cut; the sales team wants it retained. What is the analytically correct approach?',
   'The analyst has access to revenue data, customer purchase history across all products, and churn data for the loyal segment.',
   '["Cut the product because revenue is declining — the data is clear","Retain the product because the sales team argues for it","Quantify the full economic contribution: model what happens to cross-sell revenue if the loyal segment churns post-discontinuation, calculate total lifetime value at risk, and present a full economic decision brief showing the net impact of discontinuation vs. retention vs. alternative interventions (e.g., cost reduction) — let the decision rest on total economic contribution, not one metric","Ask both teams to compromise and discontinue the product in 12 months instead of now"]'::jsonb,
   2, 'Evaluating product discontinuation on a single revenue metric (-18% YoY) ignores the product''s indirect economic value as a retention anchor for high-LTV customers. The analyst must model total economic contribution: direct product revenue + cross-sell revenue at risk if loyal customers churn. This requires joining product revenue data with customer purchase history and churn probability modeling. Only then can the decision brief present a complete picture. The delay compromise is a political solution that defers the analytical question rather than answering it.', 15, 'da:decision-support', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 9 — Data Storytelling & Communication  (da:data-storytelling)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 9 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 9'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 9 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1  Foundational — Pyramid Principle
  (qz, 'What is the core principle of the Pyramid Principle for analytical communication?',
   'An analyst must present six months of marketing performance findings to a VP who has 10 minutes and wants to know whether to reallocate budget.',
   '["Present all findings in chronological order so the audience understands the analysis journey","Lead with the governing conclusion (the "so what"), then support it with grouped evidence and detailed data — moving from most important to least important","Begin with methodology to establish analytical credibility before revealing conclusions","Present all data first so the audience can form their own conclusion"]'::jsonb,
   1, 'The Pyramid Principle (Barbara Minto, McKinsey) structures communication so the most important conclusion comes first, supported by grouped evidence below. This respects executive time: the decision-maker hears the answer immediately and can decide how deeply to engage with the evidence. Leading with methodology buries the insight and consumes executive patience. Presenting raw data first and asking the audience to form their own conclusion is the "data dump" anti-pattern — the analyst abdicates their interpretation role.', 1, 'da:data-storytelling', '{}'::jsonb),

  -- Q2  Foundational — SCR structure
  (qz, 'In the Situation-Complication-Resolution (SCR) narrative structure, what is the role of the "Complication"?',
   'An analyst is structuring a presentation on declining customer retention. The situation is established; the audience understands the current state.',
   '["The complication is the solution the analyst recommends","The complication is the data source used for the analysis","The complication is the tension or problem that breaks the status quo and makes the resolution necessary — the reason the audience needs to act","The complication is the methodology section explaining how the data was analyzed"]'::jsonb,
   2, 'In SCR (also called the Story Spine), the Complication introduces the conflict: why is the current situation a problem? Why does the audience need to change something? Without a clear complication, there is no compelling reason to act. It is the narrative tension that makes the resolution meaningful. The complication is never the solution (that is the Resolution), the data source, or the methodology.', 2, 'da:data-storytelling', '{}'::jsonb),

  -- Q3  Foundational — the data dump anti-pattern
  (qz, 'What is the "data dump" anti-pattern in analytical presentations?',
   'An analyst presents 45 slides of charts, tables, and metrics to a leadership team meeting. After 30 minutes, no decision has been made and the VP says "I''m not sure what you want us to do."',
   '["Presenting too little data for the audience to make an informed decision","Presenting all the data the analyst collected without a clear insight hierarchy, without leading with the main conclusion, and without guiding the audience to the action that is needed","Using too many colors in charts","Sharing the raw dataset in an Excel attachment"]'::jsonb,
   1, 'The data dump is the most common analytical communication failure: presenting everything the analyst found in the order they found it, without synthesis, without a leading insight, and without directing the audience to a decision. The audience is left to do the analyst''s job — synthesizing the data into a conclusion. The correct pattern is to do the synthesis first and lead with the insight. A data dump is about structure and synthesis failure, not data volume, color choices, or file attachments.', 3, 'da:data-storytelling', '{}'::jsonb),

  -- Q4  Foundational — choosing the right insight to lead with
  (qz, 'An analyst has found five significant insights from a sales analysis. How should they determine which insight to lead with in an executive presentation?',
   'The executive team needs to make a budget allocation decision next week. Three insights are operationally interesting; two directly inform the budget decision.',
   '["Lead with the most statistically significant finding","Lead with the insight that most directly answers the decision the audience needs to make — in this case, the budget allocation","Lead with the insight the analyst found most interesting","Lead with the finding that is easiest to explain"]'::jsonb,
   1, 'The leading insight should be determined by audience need, not by statistical significance, analyst interest, or ease of explanation. The executive audience has a specific decision to make — budget allocation. Any insight not directly bearing on that decision is secondary. Failing to lead with decision-relevant findings forces executives to wade through less relevant material before reaching what they actually need.', 4, 'da:data-storytelling', '{}'::jsonb),

  -- Q5  Foundational — pre-attentive attributes
  (qz, 'Which of the following is a pre-attentive visual attribute that the human brain processes before conscious effort?',
   'An analyst is designing a chart to help executives instantly identify which product category is underperforming without reading labels.',
   '["The title text of the chart","Color hue — a distinctly different color on one bar draws the eye immediately before the viewer reads any text","The footnote explaining the data source","The gridline spacing"]'::jsonb,
   1, 'Pre-attentive attributes are visual properties processed by the brain in under 250 milliseconds before focused attention — they "pop out" automatically. Color hue is among the strongest pre-attentive attributes. When one bar in a chart is a distinctly different color, viewers notice it instantly without reading labels. Chart titles, footnotes, and gridline spacing require focused reading and are not pre-attentive.', 5, 'da:data-storytelling', '{}'::jsonb),

  -- Q6  Applied — executive vs operational audience
  (qz, 'An analyst must present the same customer satisfaction findings to both the CEO and the Customer Success Manager. How should the two presentations differ?',
   'The analysis covers CSAT scores, root-cause drivers, resolution time trends, and support ticket categories. The CEO presentation is 15 minutes; the CSM meeting is 60 minutes.',
   '["Use identical presentations — the same data is relevant to both","For the CEO: lead with the business impact (revenue at risk, customer retention effect) and a 1-2 slide recommendation; for the CSM: include the operational detail (resolution time trends, ticket categories, root causes) that enables action at the team level","For the CEO: present all technical detail; for the CSM: present only the summary","For both: present all 40 slides and let each person take what they need"]'::jsonb,
   1, 'Executive and operational audiences have fundamentally different information needs. CEOs make strategic decisions and need business impact framing — revenue at risk, retention risk, and the recommended action. Customer Success Managers make operational decisions and need the granular data — ticket categories, resolution time trends, root causes — to drive team behavior. Tailoring content to decision context is core to data storytelling craft. Presenting all 40 slides to the CEO wastes their time and dilutes the strategic message.', 6, 'da:data-storytelling', '{}'::jsonb),

  -- Q7  Applied — handling "the data is wrong" pushback
  (qz, 'An analyst presents findings showing a 22% drop in sales conversion. A sales director says "that data is wrong — our team closed more deals this quarter." How should the analyst respond?',
   'The analyst used confirmed CRM data. The sales director''s claim is based on their subjective experience of team energy, not a specific data counter-example.',
   '["Immediately retract the finding and apologize","Defend the finding aggressively without listening to the director''s concern","Acknowledge the director''s perspective, ask them to share any specific data that might explain the discrepancy, explain the data source and how conversion was defined, and offer to investigate whether the definition or timeframe could account for the difference — while standing behind the finding unless a specific data error is identified","Change the number to something the director finds acceptable to avoid conflict"]'::jsonb,
   2, 'Data pushback must be handled with both analytical confidence and intellectual openness. The analyst should acknowledge the concern (validating the director''s experience), explain the data source and metric definition (establishing credibility), invite specific counter-evidence (demonstrating openness), and investigate any legitimate discrepancy. But the analyst must not capitulate to emotional pushback without a specific, verifiable data error. Retracting without evidence or changing numbers to please stakeholders undermines analytical integrity.', 7, 'da:data-storytelling', '{}'::jsonb),

  -- Q8  Applied — annotation and callouts
  (qz, 'When is it most important to add an annotation or callout to a chart in a data story?',
   'An analyst''s line chart shows a sharp dip in March 2023. The dip was caused by a 10-day system outage that made transactions impossible.',
   '["Annotate every data point to make the chart more detailed","Annotate when an event caused a data anomaly that the audience would otherwise misinterpret — here, the March dip should be annotated ''System outage (10 days)'' so the audience does not incorrectly conclude sales declined","Only annotate charts in technical reports, never in executive presentations","Avoid annotations because they distract from the visual"]'::jsonb,
   1, 'Annotations are most valuable when contextual information is needed to correctly interpret an anomaly. Without the annotation, executives might conclude there was a sales execution failure in March — triggering a misguided response. With the annotation, they immediately understand it was operational, not behavioral. Annotating every data point clutters the chart. Annotations belong in executive presentations when they prevent misinterpretation. Avoiding all annotations sacrifices crucial interpretive context.', 8, 'da:data-storytelling', '{}'::jsonb),

  -- Q9  Applied — one-page report design
  (qz, 'What is the most important design principle for a one-page executive report?',
   'A finance director wants a monthly one-page summary of business performance that she can review in under 5 minutes before the leadership meeting.',
   '["Include all KPIs tracked by the business to ensure comprehensiveness","Prioritize ruthlessly: show only the 4-6 metrics that directly reflect business health and require leadership attention, organized from most strategic to most operational, with space for a one-sentence insight or alert","Use the smallest possible font to fit more data on one page","Reproduce the full monthly dashboard on a single sheet"]'::jsonb,
   1, 'A one-page report is a deliberate design constraint that forces analytical prioritization. The analyst must select only the metrics that matter at the leadership level, organize them by decision relevance, and use white space and hierarchy to guide the eye. Including all KPIs defeats the purpose — it produces a compressed data dump. Tiny fonts degrade readability. A one-page report is not a compressed dashboard — it is a curated leadership instrument.', 9, 'da:data-storytelling', '{}'::jsonb),

  -- Q10  Applied — visual hierarchy in storytelling
  (qz, 'An analyst builds a slide with 12 different metrics shown in equal-sized boxes. The CMO says "I can''t tell what to focus on." What storytelling principle is being violated?',
   'The slide is for a monthly marketing review. The most critical metric — customer acquisition cost trending 40% above target — is in the bottom-right corner in the same format as all other metrics.',
   '["The Pyramid Principle — the conclusion should come first","Visual hierarchy — the most important information should be visually dominant (larger, bolder, or differently colored) so the audience''s eye is drawn to it first, before engaging with supporting details","Data minimization — too many metrics are shown","MECE framing — the metrics should be mutually exclusive"]'::jsonb,
   1, 'Visual hierarchy is the use of size, weight, color, and position to signal importance. When all 12 metrics are displayed identically, the eye has no guide — the audience must read everything to find what matters. The CAC trend (40% above target) demands visual prominence: it should be larger, bolder, or in a contrasting color to draw attention first. The Pyramid Principle governs content order; visual hierarchy governs visual emphasis — both are needed together but this question tests the visual dimension.', 10, 'da:data-storytelling', '{}'::jsonb),

  -- Q11  Expert — Pyramid Principle for complex analysis
  (qz, 'An analyst has conducted a 3-month supply chain analysis with 8 major findings. How should they structure a 20-minute executive presentation using the Pyramid Principle?',
   'The analysis supports a recommendation to reorganize the supplier base. Some findings are supportive; two findings are risks that partially complicate the recommendation.',
   '["Present all 8 findings sequentially in the order they were discovered, then reveal the recommendation at the end","Lead with the recommendation and its business impact, then group the 8 findings into 2-3 supporting themes, present each theme with its evidence — including the 2 complicating findings as risks with mitigations — and close with the specific ask","Present only the 6 supporting findings and omit the 2 complicating ones to maintain a clear message","Present the complicating findings first to build credibility, then reveal the recommendation"]'::jsonb,
   1, 'At the expert level, the Pyramid Principle is not just about leading with the conclusion — it also requires honest integration of complicating evidence. The 2 risks should be included as acknowledged risks with mitigations, not omitted. Omitting contra-evidence destroys credibility when executives discover it. Revealing the conclusion last (journalistic narrative) is appropriate for some contexts but wrong for executive decision-making. Grouping 8 findings into themes prevents cognitive overload.', 11, 'da:data-storytelling', '{}'::jsonb),

  -- Q12  Expert — audience-centered framing
  (qz, 'A data analyst presents a technically rigorous analysis showing that the proposed pricing change has a positive expected value. The sales team says they "don''t trust the model." What is the most likely storytelling failure?',
   'The presentation used statistical terminology, regression output tables, and p-values. The sales team has no quantitative background.',
   '["The analysis is incorrect — rebuild it","The analyst communicated for an analytical audience rather than the actual audience: statistical output tables and p-values are not meaningful to a sales team. The fix is to translate the analysis into business language — expected revenue uplift, risk scenarios, examples from analogous markets — without dumbing down the conclusion","The sales team is being irrational and should be overruled","Add a glossary of statistical terms to the next presentation"]'::jsonb,
   1, 'Trust in data is often lost when the communication fails to meet the audience where they are. The sales team''s "we don''t trust the model" is often a signal that they do not understand it — not that the analysis is wrong. The analyst''s job is to translate rigorous analysis into the language of the audience''s domain (revenue, customer scenarios, competitive analogies). A glossary is a weak patch on a communication architecture problem. Overruling non-technical stakeholders without rebuilding trust produces resistance, not adoption.', 12, 'da:data-storytelling', '{}'::jsonb),

  -- Q13  Expert — handling conflicting stakeholder narratives
  (qz, 'The data clearly shows that online channel revenue has declined 15% while the head of e-commerce argues it has grown. An investigation reveals the head of e-commerce is measuring revenue differently (excluding returns). How should the analyst handle this in the executive presentation?',
   'Both metrics are defensible depending on the definition. The executive team needs a consistent definition for strategic decisions.',
   '["Use the analyst''s definition and ignore the e-commerce head''s objection","Adopt the e-commerce head''s definition to avoid conflict","Before the executive presentation, resolve the metric definition conflict: propose a single agreed definition (e.g., net revenue after returns), present both gross and net figures for transparency, and recommend that the company standardize this definition going forward — then present the unified view to the executive team","Present both conflicting numbers without explanation and let executives decide which to use"]'::jsonb,
   2, 'Metric definition conflicts are common and must be resolved before executive presentations, not during them. The analyst''s role is to broker a single definition (here, net revenue after returns is more economically meaningful), gain pre-meeting alignment, and present a unified view. Presenting conflicting numbers without resolution puts executives in the uncomfortable position of choosing sides. Ignoring the e-commerce head''s legitimate concern will cause them to reject the analysis entirely.', 13, 'da:data-storytelling', '{}'::jsonb),

  -- Q14  Expert — insight leading in narrative
  (qz, 'An analyst finds that customer lifetime value for cohorts acquired through paid social has declined 35% over 18 months while all other acquisition channels are stable. How should this insight be positioned in a board-level story?',
   'The company spends $4M per year on paid social acquisition. The board meeting agenda includes a marketing budget review.',
   '["Place this finding on slide 22 after all other channel performance data is presented","Lead the presentation with: ''We have identified a significant and growing capital allocation risk in our paid social channel — customer lifetime value has declined 35% in 18 months, putting $4M in annual spend at risk of negative ROI'' — then support it with the channel comparison data, root cause hypotheses, and a clear recommendation","Present this finding only in the appendix to avoid alarming the board","Do not present negative findings at board level — only share positive results"]'::jsonb,
   1, 'A 35% LTV decline in the company''s largest acquisition spend is the highest-stakes finding in the analysis — it should lead the board-level story, not be buried. Leading with the business impact framing ("capital allocation risk," "$4M at risk") immediately orients the board to the decision relevance. Burying it in slide 22 means the board may never reach it in a time-limited meeting. Appendix-only treatment ensures it is ignored. Hiding negative findings from the board is a governance failure.', 14, 'da:data-storytelling', '{}'::jsonb),

  -- Q15  Expert — integrated storytelling scenario
  (qz, 'An analyst must deliver a 15-minute presentation to a CEO recommending a $2M investment in a new analytics platform. The CEO is known to be skeptical of technology investments. Which approach is most likely to succeed?',
   'Three previous technology pitches were rejected because they led with features and costs. The CEO''s stated priority is reducing operational overhead and improving decision speed.',
   '["Lead with the platform''s technical capabilities and feature list, then reveal the cost","Lead with a one-sentence bottom line tied to the CEO''s priorities (''This platform will cut decision cycle time by 40% and save $600K/year in analyst overhead''), support it with two or three evidence points, pre-empt the top objection (''You might ask why not use our existing tools — here is why they cannot scale to this need''), and close with a specific ask and next steps","Present a detailed ROI model with 50 assumptions for the CEO to scrutinize","Let the CFO present the financial case while the analyst presents the technical case"]'::jsonb,
   1, 'This scenario integrates every storytelling principle: lead with the CEO''s priority (not the product features), use the Pyramid Principle (conclusion first, evidence second), pre-empt the known objection (anticipatory structure), and make a specific ask. The CEO''s pattern of rejecting feature-led pitches is a clear signal: business value framing wins, feature listing loses. A 50-assumption ROI model invites scrutiny and creates doubt rather than confidence. Splitting the presentation between two presenters without a unified narrative weakens the story.', 15, 'da:data-storytelling', '{}'::jsonb);

END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- MODULE 10 — Data Governance, Quality & Ethics  (da:data-ethics)
-- ─────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cid UUID; qz UUID; n INT;
BEGIN
  SELECT id INTO cid FROM public.courses WHERE title = 'AI Data Analyst & Decision Intelligence Professional';
  IF cid IS NULL THEN RAISE EXCEPTION 'DA course not found'; END IF;

  SELECT q.id INTO qz FROM public.quizzes q
    JOIN public.chapters c ON c.id = q.chapter_id
    WHERE c.course_id = cid AND c.order_index = 10 AND q.quiz_type = 'chapter_end' LIMIT 1;
  IF qz IS NULL THEN RAISE EXCEPTION 'Quiz shell not found at order_index 10'; END IF;

  SELECT count(*) INTO n FROM public.quiz_questions WHERE quiz_id = qz;
  IF n > 0 THEN RAISE EXCEPTION 'Module 10 already has % question(s) — aborting', n; END IF;

  INSERT INTO public.quiz_questions(quiz_id, question_text, scenario_context, options, correct_answer_index, explanation, order_index, competency, translations) VALUES

  -- Q1  Foundational — GDPR vs CCPA
  (qz, 'What is the primary difference between GDPR and CCPA regarding consumer rights over their data?',
   'A global company with customers in both the EU and California must configure its data deletion workflows to satisfy both regulations.',
   '["GDPR applies only to financial data; CCPA applies only to health data","GDPR grants EU residents a broad right to erasure (''right to be forgotten'') and requires affirmative consent for data processing; CCPA grants California residents the right to know, delete, and opt out of the sale of personal data, but does not always require opt-in consent before collection","CCPA is stricter than GDPR in all respects","GDPR and CCPA are identical in their requirements"]'::jsonb,
   1, 'Both GDPR and CCPA protect consumer data rights, but differ significantly. GDPR (EU) is opt-in: companies must obtain affirmative consent for most data processing and provide robust data subject rights including the right to erasure. CCPA (California) is primarily opt-out: companies can collect data but must disclose what they collect, allow deletion requests, and let consumers opt out of the sale of their data. GDPR is generally considered broader and stricter on consent. Neither is limited to a specific data category.', 1, 'da:data-ethics', '{}'::jsonb),

  -- Q2  Foundational — DAMA data quality dimensions
  (qz, 'According to the DAMA-DMBOK framework, which data quality dimension measures whether data values fall within an acceptable domain (e.g., a date field contains actual dates, not text strings)?',
   'A data quality audit finds that 3% of rows in the birth_date column contain the value "N/A" stored as a string in a DATE-typed field.',
   '["Completeness — whether all required fields are populated","Validity — whether data conforms to the defined format, range, or business rules","Timeliness — whether data is available when needed","Uniqueness — whether records are free of duplicates"]'::jsonb,
   1, 'Validity (also called conformity) measures whether data values conform to defined formats, ranges, data types, and business rules. "N/A" in a DATE field violates the data type definition — it is an invalid value. Completeness measures whether required fields are populated (not whether values are correct). Timeliness measures data freshness. Uniqueness measures deduplication. Validity is the dimension most directly concerned with whether values make sense given the field''s definition.', 2, 'da:data-ethics', '{}'::jsonb),

  -- Q3  Foundational — data lineage
  (qz, 'What is data lineage and why is it important in analytical governance?',
   'A CFO questions a reported revenue figure and asks: "Where does this number come from, and has anyone changed the source data since it was pulled?"',
   '["Data lineage is the legal chain of custody for paper documents","Data lineage documents the origin of a data element, all transformations it has undergone, and the systems it has passed through — enabling analysts to trace a metric back to its source, identify where errors were introduced, and demonstrate data trustworthiness","Data lineage is a synonym for data backup","Data lineage only applies to data that is shared externally"]'::jsonb,
   1, 'Data lineage is an end-to-end record of where data came from, how it was transformed, and where it went. It is essential for trust and governance: when a stakeholder challenges a number, lineage allows the analyst to trace the metric from report to transformation to source table to original data collection. Without lineage, errors are impossible to audit and correct. Lineage is not a document custody concept, not a backup, and applies to all analytical data — not just externally shared data.', 3, 'da:data-ethics', '{}'::jsonb),

  -- Q4  Foundational — governance roles
  (qz, 'What is the primary difference between a Data Steward and a Data Owner in a governance framework?',
   'A company is formalizing its data governance structure. The HR Director manages all headcount data, while a data analyst ensures the quality and consistency of that data day-to-day.',
   '["There is no meaningful difference — both roles do the same work","The Data Owner is accountable for the business decisions about a data domain (what data is collected, who can access it, how it is used) and carries organizational accountability; the Data Steward is responsible for the day-to-day quality management, definition enforcement, and issue resolution within that domain","The Data Steward approves all data purchases; the Data Owner manages data backups","The Data Owner writes SQL queries; the Data Steward manages dashboards"]'::jsonb,
   1, 'In DAMA governance frameworks, the Data Owner is an accountable business role — typically a senior leader — responsible for strategic decisions about a data domain. The Data Steward is an operational role responsible for quality, consistency, definitions, and issue resolution within the domain. In the scenario, the HR Director is the Data Owner (accountable for headcount data decisions) and the analyst is the Data Steward (managing quality and consistency). The distinction is accountability level and nature of responsibility.', 4, 'da:data-ethics', '{}'::jsonb),

  -- Q5  Foundational — algorithmic bias types
  (qz, 'A hiring algorithm trained on 10 years of historical hiring data systematically downscores candidates from certain universities because those universities were underrepresented in the company''s historical hires. What type of algorithmic bias is this?',
   'The company historically hired predominantly from three Ivy League schools. Candidates from other universities — including those with equivalent or better academic programs — receive lower algorithmic scores.',
   '["Measurement bias — the data was measured incorrectly","Historical bias — the model learned and replicated a past human bias encoded in historical decisions, perpetuating the discrimination the algorithm was supposed to make more objective","Selection bias — the training data was randomly sampled incorrectly","Confirmation bias — analysts confirmed the algorithm''s outputs without questioning them"]'::jsonb,
   1, 'Historical bias occurs when training data encodes past human prejudices or structural inequalities, and the model learns to replicate them. If 10 years of historical hires reflect a preference for certain universities — whether intentional or systemic — the model learns this preference as a "signal" of success and applies it to future candidates. This perpetuates the original bias algorithmically, often at greater scale. Measurement bias involves incorrect data collection methods. Selection bias involves non-random training set construction. Confirmation bias is a human cognitive pattern.', 5, 'da:data-ethics', '{}'::jsonb),

  -- Q6  Applied — privacy by design
  (qz, 'A product team is building a new customer analytics feature that requires access to individual-level purchase history. What does "Privacy by Design" require at this stage?',
   'The feature is in the design phase. No code has been written yet. The team is defining the data fields the feature will access.',
   '["Collect all available data now and add privacy controls later if required by auditors","Build privacy protections into the design from the start: collect only the minimum data needed (data minimization), pseudonymize where full identification is unnecessary, define data retention limits, document the purpose limitation, and conduct a privacy impact assessment before development begins","Wait for a data breach to occur before implementing privacy controls","Only apply privacy controls to data shared with third parties"]'::jsonb,
   1, 'Privacy by Design (Ann Cavoukian, embedded in GDPR Article 25) requires that privacy protections are built into systems from the initial design phase — not bolted on afterward. At the design stage, this means: collect only what is needed (minimization), pseudonymize where possible, define retention and purpose, and assess privacy risk proactively. Retrofitting privacy controls is more expensive, more error-prone, and may already have created compliance violations. Privacy by Design applies to all data, not only externally shared data.', 6, 'da:data-ethics', '{}'::jsonb),

  -- Q7  Applied — data minimization
  (qz, 'A marketing team requests that the analytics platform collect and store full customer browsing history, purchase history, demographic data, email engagement, and location data for a campaign targeting customers likely to buy winter coats. What principle should the analyst apply?',
   'The campaign model requires only purchase history (to identify winter coat buyers) and zip code (to identify cold climates). The other data fields are requested "in case they''re useful later."',
   '["Collect all available data to maximize future analytical flexibility","Apply data minimization: collect and store only the data that is necessary and proportionate to the specific purpose (purchase history and zip code for this campaign) — collecting ''just in case'' data creates privacy risk, compliance liability, and data management cost without a justified purpose","Collect all data but encrypt it to neutralize the risk","Defer to the marketing team''s request — they know best what they need"]'::jsonb,
   1, 'Data minimization is a core GDPR principle (Article 5(1)(c)) and a fundamental data ethics practice: collect only what is necessary for the stated purpose. "Just in case" data collection creates: (1) privacy risk (more data = larger breach surface), (2) compliance liability (collecting without stated purpose violates purpose limitation), and (3) operational cost (more data to manage, secure, and govern). The analyst''s role is to push back on scope creep in data collection, not just fulfill requests. Encryption reduces breach impact but does not address the minimization violation.', 7, 'da:data-ethics', '{}'::jsonb),

  -- Q8  Applied — selection bias in data
  (qz, 'An analyst builds a customer satisfaction model using survey responses from customers who completed a post-purchase survey. The survey completion rate is 12%. What data quality concern should the analyst flag?',
   'The analyst is asked to use the model''s outputs to characterize the satisfaction of the entire customer base.',
   '["No concern — any data is better than no data","Selection bias: customers who voluntarily complete surveys may systematically differ from non-respondents (e.g., they may be more satisfied or more dissatisfied), meaning the 12% sample may not represent the full customer base — the model''s outputs should not be generalized to all customers without addressing this limitation","Timeliness bias — the surveys were completed too slowly","Confirmation bias — the analyst chose to use this data because it supports a positive narrative"]'::jsonb,
   1, 'A 12% survey completion rate creates significant selection bias risk. Voluntary survey respondents are not a random sample — they tend to be either highly satisfied (brand advocates) or highly dissatisfied (complainants), while the majority of the customer base (neutral/moderately satisfied) does not respond. Generalizing from this sample to the full customer population produces misleading characterizations. The analyst must flag this limitation and recommend supplementing with behavioral data or a stratified random sample.', 8, 'da:data-ethics', '{}'::jsonb),

  -- Q9  Applied — responsible disclosure
  (qz, 'An analyst discovers that a data pipeline bug has been producing incorrect metrics in the company''s executive dashboard for the past six months. The incorrect metrics were used in a board presentation to justify a $5M investment. What is the responsible action?',
   'The investment has been approved but not yet deployed. The analyst is the first person to discover the bug.',
   '["Fix the bug quietly without telling anyone to avoid embarrassment","Document the bug, notify the direct manager and relevant data governance stakeholders immediately, quantify how the affected metrics changed when corrected, assess whether the investment decision would have differed under the correct metrics, and escalate appropriately so leadership can determine whether the investment decision needs to be revisited","Fix the bug and only disclose if asked directly","Wait until the next dashboard review meeting to mention it casually"]'::jsonb,
   1, 'Responsible disclosure is a core data ethics obligation. A six-month data error that influenced a $5M investment decision is material — it must be disclosed promptly to enable informed decision-making by leadership. Concealing it: (1) allows the investment to proceed on a false premise, (2) creates liability if discovered later, and (3) violates the trust relationship between analyst and organization. The analyst is not responsible for the bug existing — they are responsible for what they do with the discovery. Immediate escalation is the only professionally ethical response.', 9, 'da:data-ethics', '{}'::jsonb),

  -- Q10  Applied — data governance: custodian role
  (qz, 'Which role in a data governance framework is responsible for the technical implementation of data security controls, backup procedures, and access management — without making business decisions about the data?',
   'A company is assigning governance responsibilities across IT, business, and data teams. They need to clarify who manages the database security vs. who decides who gets access.',
   '["Data Owner — they are accountable for all aspects of the data","Data Steward — they manage data quality and definitions","Data Custodian — typically an IT/infrastructure role responsible for the technical security, storage, and access control implementation of data assets","Chief Data Officer — they are responsible for all data governance activities personally"]'::jsonb,
   2, 'The Data Custodian is the technical implementation role in governance frameworks: they manage database security controls, access provisioning, backup and recovery, and storage — but do not make business decisions about who should have access or how data should be defined. The Data Owner makes the business decisions; the Custodian implements them technically. The Data Steward manages quality and definitions. The CDO governs the overall program but does not personally execute technical controls.', 10, 'da:data-ethics', '{}'::jsonb),

  -- Q11  Expert — measurement bias
  (qz, 'A bank uses customer income as a feature in a credit-scoring model. However, income data is self-reported and systematically underreported by customers in certain demographic groups due to cultural norms around financial disclosure. What type of bias does this create?',
   'The model''s accuracy is 89% overall, but approval rates for the affected demographic groups are 30 percentage points lower than for groups who accurately report income.',
   '["Historical bias — the model learned from past prejudiced decisions","Selection bias — the training set excluded certain demographic groups","Measurement bias — the income variable is measured differently across demographic groups, introducing systematic error that disadvantages groups with income underreporting norms","Confirmation bias — the analyst verified the model without questioning the income variable"]'::jsonb,
   2, 'Measurement bias occurs when the method of data collection produces systematically different results across groups, not because of genuine differences in the underlying reality, but because of how the measurement is taken. Income underreporting in specific demographic groups is not a true signal of lower creditworthiness — it is a measurement artifact. The model interprets this artifact as a legitimate credit risk signal, producing discriminatory outcomes. The fix is to validate income through alternative means or use a more reliably measured proxy.', 11, 'da:data-ethics', '{}'::jsonb),

  -- Q12  Expert — data governance program design
  (qz, 'A company has 15 different definitions of "active customer" across 8 business units, each calculating the metric differently. What is the highest-priority governance intervention?',
   'The 15 definitions produce numbers ranging from 180,000 to 340,000 "active customers" depending on which team''s metric is used. Leadership cannot agree on company performance.',
   '["Build a dashboard that averages the 15 definitions","Mandate that only one business unit''s definition is correct without a structured process","Initiate a business-led definition standardization process: convene data stewards and business owners, define the canonical ''active customer'' definition based on business meaning (not technical convenience), document it in the business glossary, and govern its implementation in all reporting systems — then retire all variant definitions","Accept that different business units will always use different definitions"]'::jsonb,
   2, 'Inconsistent metric definitions are among the most destructive governance failures — they prevent coherent performance measurement at the organizational level. The fix is not technical (averaging is wrong; one unit winning is political). The fix is governance: a structured, business-led definition process that establishes the authoritative business meaning of "active customer," documents it in the official business glossary, and enforces it across systems. This is exactly the role of data stewardship and data governance programs.', 12, 'da:data-ethics', '{}'::jsonb),

  -- Q13  Expert — whistleblowing and analyst ethics
  (qz, 'An analyst discovers that their manager has been manually adjusting data in the CRM to make the sales team''s performance metrics look better before board presentations. The adjustments are material and misleading. What is the analyst''s ethical obligation?',
   'The analyst has direct evidence of the manipulation in audit logs. The manager is well-liked and is unlikely to face internal complaints. The board makes compensation decisions based on these metrics.',
   '["Stay silent — it is not the analyst''s place to report on a manager","Adjust their own analysis to match the manager''s figures to avoid conflict","Document the evidence, consult the company''s data governance or ethics policy (and legal counsel if needed), and escalate through the appropriate internal channel (compliance, internal audit, or board audit committee) — and if internal channels are compromised, understand their external whistleblower obligations under applicable law","Mention it informally to a colleague and take no formal action"]'::jsonb,
   2, 'Data manipulation that materially misleads the board on which compensation decisions are based is a serious ethical and potentially legal violation. The analyst has both a professional obligation and, in many jurisdictions, legal protection for reporting it through proper channels. The governance response is: document evidence, consult ethics/governance policy, escalate through internal audit or compliance, and if internal channels are themselves compromised, understand external whistleblower rights (e.g., under Sarbanes-Oxley for public companies). Staying silent or adjusting one''s own analysis to match makes the analyst complicit.', 13, 'da:data-ethics', '{}'::jsonb),

  -- Q14  Expert — algorithmic fairness intervention
  (qz, 'A predictive policing model trained on historical arrest data is found to recommend higher patrol levels in neighborhoods with predominantly minority populations, even after controlling for reported crime rates. The city''s data team is asked to "fix" the bias. What is the most responsible approach?',
   'The model was trained on arrest data that reflects decades of differential enforcement. Arrest data is not the same as crime data — it reflects who was policed, not who committed crimes.',
   '["Retrain the model with more recent data to fix the bias","Add a fairness constraint that equalizes prediction rates across racial groups regardless of other factors","Recognize that the underlying training data (arrests) is itself biased — it reflects historic over-policing of minority neighborhoods rather than objective crime incidence. The responsible approach is to critically question whether predictive policing from arrest data can be made fair, consult affected communities, and consider whether alternative data sources or a fundamentally different analytical framework is required","Apply post-hoc demographic parity correction and redeploy the model"]'::jsonb,
   2, 'This is an expert-level ethics question about the limits of technical bias correction. Arrest data encodes historical enforcement patterns — which communities were surveilled and policed. This is structural (historical) bias that cannot be corrected by retraining on more of the same data or by applying fairness constraints. The constraints would simply mask the underlying data problem. The responsible path is to question the validity of the data source for the purpose, engage affected communities in governance, and consider whether the problem is technically solvable or whether a fundamentally different approach is needed. Technical optimism in the face of structurally biased training data is itself an ethical failure.', 14, 'da:data-ethics', '{}'::jsonb),

  -- Q15  Expert — integrated ethics scenario
  (qz, 'A retail analyst is asked to build a model that predicts which customers are likely to become pregnant, using purchase history, to target them with baby product promotions before competitors. The model achieves 85% accuracy. Leadership is excited. What ethical concerns should the analyst raise before deployment?',
   'The model infers a sensitive health condition from behavioral data. Customers did not consent to this inference. The company''s privacy policy does not disclose predictive health inferencing.',
   '["None — the model is accurate and profitable, so it should be deployed","Raise multiple concerns: (1) Customers did not consent to health-status inference from purchase data — this violates privacy by design and likely GDPR/CCPA purpose limitation; (2) A false positive (targeting a non-pregnant customer with baby promotions) can cause significant emotional harm, particularly for those who have experienced pregnancy loss; (3) The company''s privacy policy must be updated and legal review obtained before deployment; (4) The appropriate path is to disclose the inferencing, obtain consent, or limit personalization to less sensitive data","Deploy the model but reduce the targeting list to 50% of predictions to reduce error rate","Simply add a disclaimer to the promotional emails"]'::jsonb,
   1, 'This scenario integrates privacy law, data ethics, algorithmic fairness, and responsible disclosure. The concerns are not minor: (1) Purpose limitation — customers shared purchase data for transactions, not health inference; (2) Consent — no disclosure of health-status prediction; (3) Harm potential — false positives on pregnancy inference have caused documented real-world emotional harm (the famous Target case); (4) Legal exposure — sensitive health inference without consent may violate GDPR''s special category data rules or CCPA''s sensitive data provisions. Model accuracy does not resolve ethical and legal exposure. The analyst''s obligation is to surface all of these concerns before deployment, not after.', 15, 'da:data-ethics', '{}'::jsonb);

END $$;


-- =============================================================================
-- VERIFICATION — question counts per module (order_index 6–10)
-- Expected: 15 questions per module = 75 total
-- =============================================================================
SELECT
  c.order_index                               AS module,
  c.title                                     AS module_title,
  count(qq.id)                                AS total_questions
FROM public.chapters c
JOIN public.courses co ON co.id = c.course_id
LEFT JOIN public.quizzes qz
       ON qz.chapter_id = c.id AND qz.quiz_type = 'chapter_end'
LEFT JOIN public.quiz_questions qq ON qq.quiz_id = qz.id
WHERE co.title = 'AI Data Analyst & Decision Intelligence Professional'
  AND c.order_index BETWEEN 6 AND 10
GROUP BY c.order_index, c.title
ORDER BY c.order_index;
