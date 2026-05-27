import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const courseData = {
  title: "AI Cloud Engineer",
  description: "Master cloud-native AI infrastructure across AWS, Azure, and GCP. Build, deploy, and operate production-grade AI systems using IaC, Kubernetes, serverless AI patterns, and MLOps pipelines used by Fortune 500 engineering teams.",
  chapters: [
    {
      title: "Module 1: Cloud Foundations for AI Engineers",
      description: "The mental models, architecture patterns, and engineering principles that separate cloud engineers from cloud architects. Drawn from the AWS Well-Architected Framework, Google SRE Book, and production war stories from Netflix, Airbnb, and Spotify.",
      order_index: 0,
      videos: [
        {
          title: "1.1 The AI Cloud Engineer: Role, Market, and Mental Models",
          description: "What the role actually is, why it commands $120K-$220K globally, and the mental models that separate engineers who build for demos from those who build for production.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "The AI Cloud Engineer is the person who makes AI products actually work in production — not just in a Jupyter notebook, not just in a demo environment, but at scale, under load, at 3am when things break. The role sits at the intersection of three disciplines: distributed systems engineering (building systems that don't fail), cloud infrastructure (AWS/Azure/GCP primitives and how to compose them), and ML systems (the unique operational characteristics of probabilistic, stateful AI workloads). This intersection is why the role is both rare and highly compensated — most engineers are strong in one or two areas, not all three simultaneously. According to LinkedIn's 2024 Emerging Jobs Report, AI Cloud Engineer and ML Infrastructure Engineer grew 74% YoY, faster than any other technical role. The global median compensation is $145K base with total comp reaching $220K at top-tier companies — driven purely by supply/demand imbalance.",

              "Before writing a single line of Terraform or a single Kubernetes manifest, you need to internalize the mental models that govern all good cloud architecture decisions. The first and most important is the 'pets vs. cattle' model, coined by Bill Baker at Microsoft in 2011 and popularized by Randy Bias at CloudScaling. Pets are servers you name, care for individually, and nurse back to health when sick — your on-premises database server 'Fluffy' that has been running for 8 years. Cattle are servers you number, treat as interchangeable, and replace when broken — auto-scaling group instance i-0a2b3c4d5e6f. Cloud-native AI infrastructure is cattle-oriented: your training job pod crashes, Kubernetes replaces it with a new one in 30 seconds. Your model server instance gets terminated for spot reclamation, your auto-scaling group provisions a fresh one. Building for cattle means designing for failure at the instance level so the system survives at the fleet level.",

              "The second mental model is 'immutable infrastructure' — pioneered by Chad Fowler in 2013 and now the default pattern at every cloud-native company. Mutable infrastructure means you SSH into a server and make changes in place: upgrade a library, change a config file, patch a vulnerability. The server drifts from its documented state over months, becoming a unique snowflake that nobody fully understands. Immutable infrastructure means: when you need to change something, you build a new artifact (Docker image, AMI), deploy it, and terminate the old one. The old instance is never modified — it's replaced. For AI systems: when you need to upgrade CUDA libraries on your GPU instances, you build a new base Docker image with the new CUDA version, redeploy all model serving containers using the new image, and retire the old containers. Zero SSH, zero drift, full auditability.",

              "The third model is the 'distributed systems fallacies' — eight assumptions that developers new to distributed systems incorrectly make, first articulated by Peter Deutsch and James Gosling at Sun Microsystems in 1994. Fallacy 1: The network is reliable. In cloud environments, you'll experience network partitions, packet loss, DNS failures, and TLS handshake timeouts regularly — design every API call with retry logic and circuit breakers. Fallacy 2: Latency is zero. An inter-AZ call in AWS adds 1-2ms; a cross-region call adds 20-80ms; a call to an on-premises system can add 200ms+. For AI inference where you're calling feature stores, model servers, and post-processing services, these latencies compound — architect to minimize network hops in the critical path. Fallacy 8 (the most violated): The network is homogeneous. Your AI pipeline will call Python services, Go microservices, managed AWS services, and third-party APIs — each with different protocols, timeouts, and failure modes.",

              "The AWS Well-Architected Framework (WAF) is the canonical reference for production cloud architecture — 500+ pages of hard-won lessons from thousands of AWS customer reviews. It organizes architectural best practices into six pillars: Operational Excellence (run and monitor systems to deliver business value), Security (protect data and systems), Reliability (recover from failures automatically), Performance Efficiency (use resources efficiently), Cost Optimization (eliminate waste), and Sustainability (minimize environmental impact). For AI cloud engineers, the Reliability and Performance Efficiency pillars are most critical to master first. The Reliability pillar introduces the concept of 'design for failure' — assuming every component will fail and engineering the system to degrade gracefully rather than catastrophically. Netflix's Chaos Monkey, which deliberately kills random production services to test resilience, is the implementation of this pillar at scale. The Performance Efficiency pillar drives the selection decisions between GPU types, instance families, and storage classes that can mean 10x cost differences for identical workloads.",

              "Understanding the economics of cloud computing is as important as understanding the technology. The 'unit economics' mental model asks: what is the cost per unit of value delivered? For AI inference, the unit might be cost-per-1000-predictions. For training, it might be cost-per-model-trained. These unit economics drive architecture decisions: if your cost-per-prediction is $0.01 and your SLA allows 500ms latency, you can use a $0.10/hour CPU instance serving cached predictions. If your cost-per-prediction must be $0.001, you need GPU instances, batching, and model optimization. The FinOps Foundation (finops.org) defines three phases of cloud financial management: Inform (understand what you're spending), Optimize (right-size and eliminate waste), and Operate (build cost-awareness into engineering culture). Companies that master FinOps for AI — like Cloudflare, which reduced their AI inference costs 96% through worker-based batching — create massive competitive moats. Those that don't, like many AI startups that burned through Series A funding on AWS bills, don't survive.",

              "The production mindset is the final mental model — and the hardest to teach. Junior engineers ask 'does it work?'. Senior engineers ask 'what happens when it fails?'. Production-grade AI systems require answering: What happens when the model returns a prediction with 40% confidence instead of the expected 95%? What happens when the feature store is 10 minutes stale? What happens when GPU memory is exhausted mid-inference? What happens when the training data pipeline delivers 30% fewer records than expected? Answering these questions before deployment — not after the 3am incident — is what distinguishes engineering from hacking. The Google SRE Book calls this 'embracing risk': quantifying acceptable unreliability, defining SLOs (Service Level Objectives), and building systems that degrade gracefully when those SLOs are approached. In this course, every architecture decision we make will be evaluated not just on 'does it work in the happy path' but 'what is the blast radius when this component fails'."
            ]
          },
          questions: [
            {
              question_text: "What three disciplines intersect in the AI Cloud Engineer role?",
              scenario_context: "You're writing a job description for an AI Cloud Engineer position.",
              options: ["Python, SQL, and Machine Learning", "Distributed systems engineering, cloud infrastructure, and ML systems operations", "DevOps, data science, and product management", "AWS, Docker, and TensorFlow"],
              correct_answer_index: 1,
              explanation: "The AI Cloud Engineer uniquely combines distributed systems engineering (resilient system design), cloud infrastructure (AWS/Azure/GCP), and ML systems (the operational characteristics of AI workloads). This intersection is exactly why the role is both rare and highly compensated."
            },
            {
              question_text: "What does 'immutable infrastructure' mean in practice?",
              scenario_context: "Your team needs to upgrade CUDA libraries across all GPU model servers.",
              options: ["Lock servers so no one can change them", "Build a new Docker image with the upgraded libraries, redeploy all containers from the new image, retire the old containers — never SSH and modify in-place", "Use read-only file systems on all instances", "Document all changes in a wiki before making them"],
              correct_answer_index: 1,
              explanation: "Immutable infrastructure means when something changes, you build a new artifact and replace the old one — never modify running instances. This eliminates configuration drift, creates full auditability, and enables reliable rollbacks."
            },
            {
              question_text: "What does the 'pets vs. cattle' mental model mean for AI infrastructure?",
              scenario_context: "A training job pod crashes on your Kubernetes cluster.",
              options: ["Treat all servers as unique and irreplaceable", "Treat compute instances as interchangeable and numbered — when one fails, replace it automatically rather than repairing it", "Name your servers after animals for team morale", "Only apply to database servers, not AI workloads"],
              correct_answer_index: 1,
              explanation: "Cattle-oriented infrastructure means instances are interchangeable. A crashed training pod is replaced by Kubernetes in 30 seconds. Auto-scaling terminates and replaces unhealthy instances automatically. The system survives at the fleet level by designing for failure at the instance level."
            },
            {
              question_text: "Which two AWS Well-Architected Framework pillars are most critical for AI cloud engineers to master first?",
              scenario_context: "Prioritizing your study plan for the AWS Solutions Architect exam.",
              options: ["Cost Optimization and Sustainability", "Reliability and Performance Efficiency", "Security and Operational Excellence", "All six pillars equally"],
              correct_answer_index: 1,
              explanation: "Reliability teaches you to design for failure — every AI component will fail, and your system must recover automatically. Performance Efficiency drives the GPU/instance selection decisions that mean 10x cost differences for identical AI workloads. These two pillars have the highest impact on AI system quality."
            },
            {
              question_text: "What is the 'unit economics' mental model for AI inference?",
              scenario_context: "Your CTO asks you to justify the GPU instance selection for your model serving fleet.",
              options: ["The total monthly cloud bill", "Cost per unit of value delivered — e.g., cost-per-1000-predictions — driving architecture decisions like instance type, batching strategy, and caching", "The number of GPU units per instance", "Revenue per engineering hour"],
              correct_answer_index: 1,
              explanation: "Unit economics (cost-per-prediction, cost-per-training-run) translate architecture decisions into business impact. The right instance type, batching strategy, and optimization approach are determined by the required unit economics — not by what's technically impressive."
            }
          ]
        },
        {
          title: "1.2 VPCs, Subnets, and Network Architecture for Production AI",
          description: "Design cloud network architecture that keeps AI systems secure, performant, and resilient. Drawing from AWS networking best practices, the Capital One breach post-mortem, and real multi-region AI platform architectures.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "The Virtual Private Cloud (VPC) is your isolated network environment on the cloud provider — your own private slice of AWS, GCP, or Azure where you control IP addressing, routing, and access control. Understanding VPC architecture deeply is non-negotiable for AI cloud engineers because almost every catastrophic cloud security incident traces back to network misconfiguration. The Capital One breach of 2019 — 106 million customer records compromised — was caused not by a sophisticated zero-day exploit but by a misconfigured WAF that allowed an SSRF attack to reach the EC2 metadata service, which then returned IAM credentials for an overly permissive role. The lesson: network architecture and IAM are your first and second lines of defense, and they must be designed together.",

              "A production VPC for AI systems uses a three-tier subnet architecture, a pattern described in the AWS Well-Architected Framework's Security Pillar and used by companies like Stripe, Square, and every financial services firm on AWS. Tier 1 — Public subnets: contain only resources that need direct internet connectivity — Application Load Balancers (ALBs), NAT Gateways, and bastion hosts for emergency access. Nothing else belongs here. Tier 2 — Private subnets: contain your actual AI compute — EC2 GPU instances, EKS worker nodes, SageMaker training instances, Lambda functions. These have no direct internet route; outbound internet traffic routes through NAT Gateways in the public subnet. Tier 3 — Data subnets (or isolated subnets): contain databases, ElastiCache clusters, and sensitive data stores. No internet access in any direction — not inbound, not outbound. Your ML training data in RDS or ElastiCache should live here.",

              "Availability Zone (AZ) design is the mechanism for high availability in cloud architecture. AWS Regions contain 3-6 AZs — physically separate data centers within approximately 60 miles of each other, connected by low-latency fiber. The AWS reliability guidance is to deploy production workloads across a minimum of 3 AZs. If one AZ fails (AWS has had AZ-level failures in us-east-1, eu-west-1, and ap-southeast-1 in recent years), your application continues serving from the remaining two. For AI inference fleets: your model serving Deployment should have replicas spread across all three AZs using Pod Topology Spread Constraints in Kubernetes. For training jobs that can't be interrupted: use EFA-enabled instances in a single AZ (inter-AZ network latency disrupts distributed training) but checkpoint frequently to S3.",

              "Security Groups are AWS's stateful, instance-level firewalls — the most important network security primitive you'll use. 'Stateful' means if you allow outbound traffic on port 443, the return traffic is automatically allowed without an explicit inbound rule. Every EC2 instance, RDS database, and EKS node should have its own Security Group with carefully crafted rules. The golden rule for AI systems: never use 0.0.0.0/0 as a source in inbound rules unless it's port 443 on an internet-facing load balancer. Your GPU training instances should only accept connections from the EKS control plane Security Group. Your model serving pods should only accept connections from the load balancer Security Group. Your S3 VPC Endpoint should only be accessible from specific Security Groups. Build Security Groups as a whitelist, not a blacklist — start with deny-all and explicitly allow only required connections.",

              "VPC Endpoints are the single most impactful network architecture decision for AI systems that access AWS services like S3, SageMaker, and Secrets Manager. Without VPC Endpoints, traffic from your private subnet to S3 traverses the public internet — it exits your VPC via NAT Gateway, hits the public S3 endpoint, and returns. This means: you pay NAT Gateway data processing fees ($0.045/GB), your traffic traverses the public internet (security risk), and you're subject to internet routing variability. With a VPC Gateway Endpoint for S3, traffic stays entirely within the AWS network — zero data transfer costs, lower latency, and the traffic never touches the public internet. For AI training jobs that download terabytes of training data from S3, this can reduce costs by thousands of dollars per month and eliminate a major attack surface.",

              "Network ACLs (NACLs) operate at the subnet level and are stateless — unlike Security Groups, they don't track connection state, so you must explicitly allow both inbound and outbound traffic for each connection. NACLs are your defense-in-depth layer below Security Groups: even if a Security Group is misconfigured, a correctly configured NACL provides a backstop. Use NACLs to: block specific IP ranges you know are malicious (threat intelligence feeds), prevent any traffic from leaving your data subnets to the internet, and as a subnet-level emergency shutoff during security incidents. The AWS Security Pillar guidance recommends using NACLs as 'coarse-grained controls' and Security Groups as 'fine-grained controls' — together they implement the principle of defense-in-depth.",

              "Multi-region AI architecture introduces significant complexity but may be required for global products, regulatory compliance (GDPR data residency), or disaster recovery. The key pattern is 'active-active' vs 'active-passive'. Active-passive: your AI service runs in us-east-1, and eu-west-1 is a warm standby that takes over only during failure — simpler, cheaper, but with failover time measured in minutes. Active-active: your AI service runs in both regions simultaneously, with Route 53 latency-based routing directing users to the nearest region — highest availability, but requires: model artifact replication across regions (S3 Cross-Region Replication), data residency compliance verification per region, multi-region secrets management, and consistent model versioning across regions. For most AI products, start with a single well-architected region with multi-AZ redundancy, and add regions only when regulatory or latency requirements demand it."
            ]
          },
          questions: [
            {
              question_text: "What caused the Capital One 2019 breach and what does it teach AI cloud engineers?",
              scenario_context: "You're conducting a security review of your AI platform's network architecture.",
              options: ["A sophisticated zero-day exploit requiring advanced nation-state capabilities", "A misconfigured WAF allowed SSRF access to the EC2 metadata service, returning IAM credentials for an overly permissive role — teaching that network architecture and IAM must be designed together", "Weak passwords on root accounts", "Unencrypted S3 buckets containing customer data"],
              correct_answer_index: 1,
              explanation: "Capital One's breach required no sophisticated exploit — just a WAF misconfiguration + an overly permissive IAM role. The 106M record breach teaches that defense-in-depth (proper network architecture + least-privilege IAM) is non-optional. Both layers must be correct."
            },
            {
              question_text: "In a three-tier VPC architecture, what belongs in public subnets?",
              scenario_context: "Designing the VPC architecture for a new AI inference platform.",
              options: ["GPU training instances and model servers", "Only resources requiring direct internet connectivity: ALBs, NAT Gateways, and bastion hosts", "All compute resources for maximum performance", "Databases and sensitive data stores"],
              correct_answer_index: 1,
              explanation: "Public subnets should contain only what needs direct internet access: load balancers (to receive internet traffic), NAT Gateways (to give private instances outbound internet), and emergency bastion hosts. AI compute and data stores never belong in public subnets."
            },
            {
              question_text: "Why should production AI inference fleets spread replicas across 3 Availability Zones?",
              scenario_context: "Your model serving Deployment has all 10 pods in us-east-1a, which just experienced an AZ failure.",
              options: ["To reduce GPU costs through geographic distribution", "AWS has had real AZ-level failures — multi-AZ deployment means one AZ failing doesn't take down your entire inference fleet", "To improve model accuracy through geographic diversity", "Required by AWS terms of service"],
              correct_answer_index: 1,
              explanation: "AWS AZ failures happen — us-east-1 has had multiple documented AZ-level incidents. With all pods in one AZ, an AZ failure kills 100% of capacity. With pods spread across 3 AZs, one AZ failure only kills ~33% of capacity, and remaining AZs absorb the load."
            },
            {
              question_text: "What is the primary business benefit of VPC Endpoints for AI training jobs?",
              scenario_context: "Your training jobs download 50TB of training data from S3 monthly.",
              options: ["Faster internet speed", "Eliminate NAT Gateway data processing costs ($0.045/GB), keep traffic on AWS backbone (never public internet), and reduce latency — saving thousands monthly on large training data transfers", "Better GPU performance", "Simplified IAM configuration"],
              correct_answer_index: 1,
              explanation: "At 50TB/month through NAT Gateway: 50,000GB × $0.045 = $2,250/month just in data processing fees. VPC Endpoints eliminate this cost entirely, keep traffic off the public internet, and reduce latency. The ROI is immediate for any significant training data volumes."
            },
            {
              question_text: "What is the key difference between Security Groups and Network ACLs?",
              scenario_context: "Implementing defense-in-depth network security for your AI platform.",
              options: ["Security Groups are more expensive", "Security Groups are stateful (tracks connections) and instance-level; NACLs are stateless (both directions must be explicitly allowed) and subnet-level — use both as defense-in-depth layers", "NACLs are newer and should replace Security Groups", "They provide identical security but at different price points"],
              correct_answer_index: 1,
              explanation: "Defense-in-depth means using both: Security Groups provide fine-grained, stateful instance-level control; NACLs provide coarse-grained, stateless subnet-level backstop. If a Security Group is misconfigured, a correctly configured NACL provides the second line of defense."
            }
          ]
        },
        {
          title: "1.3 Infrastructure as Code with Terraform: From Zero to Production",
          description: "Master Terraform from first principles through production patterns. Covering the HashiCorp Configuration Language, state management, module architecture, and the GitOps-based workflow used at Stripe, HashiCorp, and Airbnb.",
          order_index: 2,
          lessonScript: {
            mainPoints: [
              "Infrastructure as Code is one of the three foundational practices of DevOps — alongside continuous integration and continuous delivery — and it has transformed how production systems are built and operated. The core insight, articulated in Kief Morris's 'Infrastructure as Code' (O'Reilly, 2021) and operationalized at companies like Netflix and Airbnb, is profound: if your infrastructure isn't in code, it doesn't exist in any meaningful sense. You can't audit it, you can't reproduce it, you can't review it, you can't test it, and you can't recover it reliably after a disaster. Terraform, created by HashiCorp in 2014, has become the dominant IaC tool precisely because it handles all major cloud providers with a single, declarative language — you describe what you want, not how to get there.",

              "The HashiCorp Configuration Language (HCL) is designed to be readable by both humans and machines — unlike YAML or JSON, it has native support for comments, expressions, and references. A Terraform resource block has three components: the resource type (aws_s3_bucket), the local name (training_data), and the configuration body. The resource type tells Terraform which provider API to call; the local name is how you reference this resource in other parts of your configuration. The most powerful feature of HCL is the reference system: instead of hardcoding resource IDs, you reference other resources as aws_s3_bucket.training_data.id — Terraform automatically builds a dependency graph and provisions resources in the correct order. This dependency graph is what makes Terraform safe for parallel provisioning: independent resources are created simultaneously, dependent resources wait for their dependencies.",

              "The Terraform state file is the most misunderstood and most dangerous component in the Terraform workflow. State is Terraform's memory — a JSON file that maps your configuration resources to the real infrastructure they represent. When you run terraform apply, Terraform reads the state to understand what currently exists, compares it to your desired configuration, and determines what changes to make. The catastrophic mistake that has caused production outages at dozens of companies: storing state locally. Two engineers both running terraform apply with local state will corrupt each other's changes — each engineer's state file becomes inconsistent with reality, leading to resource duplication, unexpected deletions, or state corruption. Production standard: store state in S3 (or GCS/Azure Blob) with DynamoDB locking to prevent concurrent modifications. Enable S3 versioning on the state bucket so you can recover from accidental corruption.",

              "Terraform modules are the mechanism for building reusable, composable infrastructure components — the equivalent of functions in programming. A module is a directory of Terraform files with defined inputs (variables) and outputs. Your AI platform likely needs: a vpc module (creates VPC, subnets, route tables, NACLs), an eks_cluster module (creates EKS cluster, node groups, IAM roles), a model_serving module (creates Kubernetes deployment, service, HPA, Ingress), and a monitoring module (creates Prometheus, Grafana, AlertManager). The module registry at registry.terraform.io contains thousands of community modules — but be selective: use official HashiCorp modules and well-maintained community modules, audit third-party modules before use (supply chain attacks on IaC modules are a real threat vector).",

              "Terraform workspaces and the environment separation pattern prevent the most common and most devastating IaC mistake: accidentally running a production change against a staging config, or vice versa. The Terragrunt pattern (a Terraform wrapper by Gruntwork) uses separate state backends per environment: environments/dev/terraform.tfvars points to a dev state backend; environments/prod/terraform.tfvars points to a prod state backend. Even if a misconfigured script targets the wrong directory, the separate state backends prevent cross-environment contamination. The Atlantis approach goes further: all Terraform changes go through a GitHub PR, Atlantis comments the terraform plan output on the PR, a second engineer approves it, and only then does Atlantis run terraform apply. This brings the rigor of code review to infrastructure changes — the practice that prevented countless production incidents at Lyft, Coinbase, and dozens of Gruntwork clients.",

              "Terraform import and the 'legacy infrastructure' challenge is the reality every AI cloud engineer faces: you join a company that has manually provisioned infrastructure, and you need to bring it under Terraform management without destroying and recreating it. terraform import {resource_type}.{name} {resource_id} reads the existing resource and creates a state entry for it — but it does NOT generate the HCL configuration. You must write the configuration manually to match the imported state, then run terraform plan to verify zero diff. The modern solution: terraform's -generate-config-out flag (available in Terraform 1.5+) automatically generates HCL for imported resources. For large legacy environments, the Terraformer tool (github.com/GoogleCloudPlatform/terraformer) can reverse-engineer entire cloud accounts into Terraform configurations — a critical capability when inheriting technical debt.",

              "Testing Terraform code is non-negotiable for production IaC — yet many teams skip it entirely and discover bugs only when they've already destroyed a production database. The testing pyramid for Terraform: Unit tests using terraform validate (syntax checking) and tflint (semantic linting, e.g., catches when you use a deprecated resource type), Integration tests using Terratest (Go testing framework that actually provisions real infrastructure in a test account, runs assertions, and tears it down), and End-to-end tests that verify the full stack. Checkov and tfsec scan Terraform code for security misconfigurations before any infrastructure is provisioned — they catch 'allow 0.0.0.0/0 in Security Group' issues that would be catastrophic in production. These tools integrate into GitHub Actions: every PR runs the security scanners, linters, and potentially full integration tests in a test account before the PR can merge."
            ]
          },
          questions: [
            {
              question_text: "Why is storing Terraform state locally catastrophic in a team environment?",
              scenario_context: "Two engineers on your team both run terraform apply simultaneously with local state files.",
              options: ["It uses too much disk space", "Both engineers have inconsistent state — each sees a different view of reality, leading to resource duplication, unexpected deletions, or state corruption with no recovery path", "Local state runs slower", "It violates AWS terms of service"],
              correct_answer_index: 1,
              explanation: "Local state means each engineer has their own record of what infrastructure exists. Concurrent applies produce conflicting state, leading to resources being created twice, deleted unexpectedly, or state files becoming permanently inconsistent. Remote state with DynamoDB locking serializes all operations."
            },
            {
              question_text: "What does the Atlantis GitOps workflow add to Terraform that prevents production incidents?",
              scenario_context: "Your team wants to apply the same code review rigor to infrastructure changes as application code.",
              options: ["Automatic cost estimation", "All infrastructure changes go through GitHub PR review — Atlantis shows the terraform plan as a PR comment, a second engineer approves it, and only then is terraform apply executed", "Faster Terraform execution", "Multi-cloud support"],
              correct_answer_index: 1,
              explanation: "Atlantis brings peer review to infrastructure changes. The plan output in the PR shows exactly what will change — a second engineer can catch 'this will delete the production database' before it happens. This is how Lyft, Coinbase, and others prevent infrastructure incidents."
            },
            {
              question_text: "What is the dependency graph in Terraform and why does it matter?",
              scenario_context: "Your configuration creates an EKS cluster, an IAM role for the cluster, and a node group that depends on both.",
              options: ["A visualization tool for debugging", "Terraform's automatic analysis of resource references (aws_eks_cluster.main.id) to determine creation order — resources are provisioned in dependency order, independent resources in parallel", "A cost tracking feature", "The relationship between Terraform modules"],
              correct_answer_index: 1,
              explanation: "Terraform builds a dependency graph from resource references. Your node group references the EKS cluster ID, so Terraform knows: create IAM role and EKS cluster first (possibly in parallel since they're independent of each other), then create the node group after both exist. Correct ordering without manual management."
            },
            {
              question_text: "What do Checkov and tfsec do in a Terraform CI/CD pipeline?",
              scenario_context: "A PR adds a Security Group rule allowing 0.0.0.0/0 inbound on port 22.",
              options: ["They test model accuracy", "Static analysis tools that scan Terraform code for security misconfigurations before any infrastructure is provisioned — catching issues like open Security Groups, public S3 buckets, and unencrypted databases at PR review time", "They estimate infrastructure costs", "They format Terraform code"],
              correct_answer_index: 1,
              explanation: "Checkov and tfsec scan your .tf files for hundreds of security rules — they would immediately flag the 0.0.0.0/0 SSH rule as a critical finding, blocking the PR before a misconfigured Security Group ever reaches production."
            },
            {
              question_text: "What is Terratest used for?",
              scenario_context: "You want to verify your vpc module actually creates subnets with the correct CIDR blocks and routing.",
              options: ["Testing Terraform syntax", "A Go testing framework that provisions real cloud infrastructure in a test account, runs programmatic assertions against it, then tears it down — providing true integration testing for IaC", "Mocking cloud APIs for unit tests", "Performance testing cloud infrastructure"],
              correct_answer_index: 1,
              explanation: "Terratest is the integration testing standard for Terraform — it actually provisions infrastructure in a test AWS account, runs Go assertions (does the VPC have 3 private subnets? is internet gateway attached?), and destroys everything when done. True confidence that your IaC works correctly."
            }
          ]
        },
        {
          title: "1.4 IAM and Security: Zero Trust, Least Privilege, and Defense-in-Depth",
          description: "The security architecture of production AI systems — IAM policy design, IRSA, secrets management, KMS encryption, and lessons from the Capital One breach and Tesla cryptojacking incident.",
          order_index: 3,
          lessonScript: {
            mainPoints: [
              "The Principle of Least Privilege traces back to Saltzer and Schroeder's landmark 1975 paper 'The Protection of Information in Computer Systems' — one of the most cited security papers ever written. Their insight: every program and every user should operate using the least set of privileges necessary to complete the job. In 2024, this principle is codified in NIST SP 800-207 (Zero Trust Architecture), the DoD Zero Trust Reference Architecture, and the AWS Well-Architected Security Pillar. Zero Trust extends least privilege to its logical conclusion: never trust, always verify — regardless of whether a request comes from inside or outside your network perimeter. For AI cloud engineers, least privilege has specific implications: an ML training job that reads customer data should have IAM permissions to read exactly that S3 prefix for that specific bucket — nothing else. Not s3:* on *, which is what you see in 40% of misconfigured cloud environments according to the 2024 Wiz State of Cloud Security report.",

              "AWS IAM has two fundamentally different identity types with different security profiles. IAM Users are persistent identities with long-term credentials — access keys that have an explicit creation date but no expiration date unless you set one. A 2023 analysis of public GitHub repositories by Truffle Security found over 4,000 valid AWS access keys committed to public repos, most of them IAM User access keys. IAM Roles are temporary identities — when a service assumes a role, AWS STS (Security Token Service) issues credentials that expire in 1-12 hours. The automatic expiration means that even if credentials are somehow leaked, the window of exploit is bounded. AWS's own security guidance: never create IAM User access keys for services running on AWS infrastructure. EC2 instances, Lambda functions, EKS pods, SageMaker jobs — all should use IAM Roles with automatic credential rotation via the instance metadata service (IMDS) or OIDC federation.",

              "IAM policy anatomy is something every AI cloud engineer must master — not just understand conceptually. An IAM policy is a JSON document with five elements: Effect (Allow or Deny), Action (the API operation, e.g., s3:GetObject, sagemaker:CreateTrainingJob), Resource (the ARN of the specific resource, e.g., arn:aws:s3:::my-training-data/*), Condition (context constraints — source IP, MFA required, time of day, VPC source), and Principal (who the policy applies to — only in resource-based policies). The most powerful security feature in IAM is the explicit Deny — unlike Allow, an explicit Deny cannot be overridden by any other Allow statement anywhere in the permission evaluation chain. Use explicit Denies to create absolute security boundaries: 'this IAM role can NEVER perform s3:DeleteBucket regardless of any other policy that might be attached'. This is the mechanism that prevents 'privilege escalation' attacks where an attacker gains access to an IAM role and uses it to grant themselves more permissions.",

              "IAM Roles for Service Accounts (IRSA) is the production standard for Kubernetes workloads accessing AWS services — solving the credential management challenge without any static secrets. The mechanism: Kubernetes associates a Kubernetes ServiceAccount with an IAM Role via an annotation. When a pod using that ServiceAccount starts, the pod's projected service account token is mounted. When the pod calls AWS APIs, the AWS SDK automatically exchanges the Kubernetes token for AWS credentials via OIDC federation — the entire process is transparent to the application. The security properties are remarkable: no static credentials ever exist, each pod gets credentials scoped exactly to its ServiceAccount's associated IAM Role, credentials auto-rotate every hour, and if a pod is compromised the credentials expire in an hour with no manual rotation needed. Companies like Affirm, Brex, and Robinhood use IRSA for all Kubernetes workloads accessing AWS APIs.",

              "AWS Secrets Manager represents the modern approach to secrets management for AI systems — eliminating the category of 'hardcoded credentials in source code' that causes 14% of all security incidents according to the Verizon 2024 Data Breach Investigations Report. The architecture: secrets (database passwords, API keys, ML model API keys) are stored encrypted with KMS in Secrets Manager. Applications retrieve secrets at runtime via the AWS SDK — never at build time into environment variables. Secret rotation is automatic: for supported databases (RDS, Redshift, DocumentDB), Secrets Manager rotates the password, updates the database, and tests the new credentials — all without application downtime. For AI systems that call external APIs (OpenAI, Cohere, Anthropic), storing API keys in Secrets Manager means: keys are audited (every retrieval is CloudTrail-logged), rotated automatically on schedule, and never appear in application code, Dockerfile, or environment variables. The cost: $0.40/secret/month — essentially free for the security it provides.",

              "AWS KMS (Key Management Service) provides envelope encryption for AI artifacts — training data, model weights, embeddings, and feature stores. Envelope encryption works as follows: your actual data (model weights, training corpus) is encrypted with a data encryption key (DEK) using AES-256-GCM. The DEK itself is encrypted with a KMS Customer Master Key (CMK) and stored alongside the data. When you need to decrypt, KMS decrypts the DEK using the CMK (only authorized IAM identities can call kms:Decrypt), and you use the decrypted DEK to decrypt the data. The power: even if an attacker obtains your encrypted S3 bucket contents, they cannot decrypt without KMS access — and KMS access is controlled by IAM policies with full CloudTrail auditing. For regulated industries (HIPAA healthcare AI, PCI financial AI), KMS with Customer Managed Keys and automatic annual rotation satisfies the encryption-at-rest requirements of virtually every compliance framework.",

              "The Tesla cryptojacking incident of 2018 and the Uber data breach of 2022 illustrate what happens when these security principles aren't followed. Tesla: a Kubernetes dashboard was left exposed to the internet without authentication. Attackers found it, deployed a cryptomining container to the cluster, configured it to run at low CPU utilization to avoid detection, and used Tesla's cloud compute for months. The mining pool address was hidden behind CloudFlare to avoid IP-based detection. Root causes: no network-level access control on the Kubernetes API server, no pod security policies preventing privileged containers, no anomaly detection on cloud spend. Uber 2022: a contractor's credentials were compromised via MFA fatigue attack. The attacker found network share credentials hardcoded in a PowerShell script. Those credentials gave access to Thycotic (privileged access management) which contained credentials for AWS, GCP, and internal systems. Root cause: hardcoded credentials, insufficient MFA implementation, over-privileged service accounts. Both incidents were preventable with the practices in this lesson."
            ]
          },
          questions: [
            {
              question_text: "Why do IAM Roles provide fundamentally better security than IAM User access keys for AWS services?",
              scenario_context: "You're deciding how your ML training jobs on EKS should authenticate with S3 and SageMaker.",
              options: ["Roles are cheaper than user access keys", "IAM Roles issue temporary credentials that automatically expire (1-12 hours) via AWS STS — even if credentials are leaked, the exploit window is bounded. IAM User access keys are permanent until explicitly rotated.", "Roles are easier to configure", "Roles have higher API rate limits"],
              correct_answer_index: 1,
              explanation: "The automatic expiration of role credentials is the fundamental security advantage. A leaked IAM User access key is a persistent credential that works indefinitely until someone discovers and rotates it. A leaked role credential expires within hours automatically."
            },
            {
              question_text: "What is IRSA and what security property makes it ideal for Kubernetes workloads?",
              scenario_context: "Your ML inference pods need to read model artifacts from S3 and write predictions to DynamoDB.",
              options: ["A load balancing algorithm for Kubernetes", "IAM Roles for Service Accounts — associates Kubernetes ServiceAccounts with IAM Roles via OIDC federation, providing pod-level, automatically-rotating AWS credentials with no static secrets", "An intrusion detection system for Kubernetes", "A Kubernetes storage interface"],
              correct_answer_index: 1,
              explanation: "IRSA provides pod-level IAM credentials via OIDC federation — no static access keys exist anywhere, credentials rotate automatically every hour, and each pod gets exactly the permissions its ServiceAccount's IAM Role defines. The gold standard for Kubernetes-AWS integration."
            },
            {
              question_text: "What was the root cause of the Tesla cryptojacking attack in 2018?",
              scenario_context: "Conducting a security post-mortem to prevent similar incidents.",
              options: ["Tesla's AI models were hacked to mine cryptocurrency", "The Kubernetes dashboard was exposed to the internet without authentication, combined with no pod security policies or cloud spend anomaly detection", "An employee stole Tesla's cloud credentials", "A vulnerability in the Kubernetes codebase"],
              correct_answer_index: 1,
              explanation: "Tesla's incident required no sophisticated attack — just an exposed Kubernetes dashboard. Defense-in-depth would have prevented it: network controls blocking public API server access, pod security policies preventing privileged containers, and anomaly detection on cloud spend catching the mining traffic."
            },
            {
              question_text: "How does envelope encryption with KMS protect AI model artifacts?",
              scenario_context: "An attacker obtains a copy of your S3 bucket containing encrypted model weights.",
              options: ["The attacker can decrypt with a password brute-force", "Data is encrypted with a data encryption key (DEK), which is itself encrypted with a KMS CMK — the attacker cannot decrypt without KMS access, which is controlled by IAM with full audit logging", "The attacker could use the model weights without decrypting", "Encryption only applies to databases, not S3"],
              correct_answer_index: 1,
              explanation: "Envelope encryption means two layers: the data is encrypted with a DEK, the DEK is encrypted with KMS. An attacker with the encrypted S3 data still cannot decrypt without KMS access — controlled by IAM policies and fully audited by CloudTrail."
            },
            {
              question_text: "What does an explicit Deny in an IAM policy do that a missing Allow cannot achieve?",
              scenario_context: "You need to ensure a training job IAM role can NEVER delete S3 objects, regardless of any future policy changes.",
              options: ["Nothing — same as not having an Allow", "An explicit Deny cannot be overridden by any Allow — even if another policy later grants the permission, the explicit Deny wins. It creates an absolute security boundary.", "Explicit Denies are only for administrators", "Explicit Denies apply only to root users"],
              correct_answer_index: 1,
              explanation: "In AWS IAM evaluation logic, explicit Deny always wins over Allow, regardless of policy source or permission boundary. An explicit Deny on s3:DeleteObject cannot be overridden by any Allow — it's a permanent, uncircumventable restriction. Use it for absolute security boundaries."
            }
          ]
        },
        {
          title: "1.5 Containers, Docker, and Container Security: From Dockerfile to Production",
          description: "Master Docker from build to production deployment — multi-stage builds, GPU containers, image security scanning, registry management, and the supply chain security practices used at Google, Stripe, and Netflix.",
          order_index: 4,
          lessonScript: {
            mainPoints: [
              "The container revolution began with Solomon Hykes' now-legendary demonstration at PyCon 2013, where he showed Docker running a process in 45 seconds with total isolation. In the 11 years since, containers have become the universal deployment artifact for cloud-native applications — and for very good reason. The fundamental problem containers solve is the 'it works on my machine' problem, technically known as environmental inconsistency. When a data scientist trains a model on Python 3.11 with PyTorch 2.0 and specific CUDA 12.1 libraries, and deploys to a server with Python 3.9 and PyTorch 1.13, the model fails — not because of a bug, but because of environmental mismatch. A container packages the application, its runtime, all dependencies, and environment configuration into a single portable artifact using Linux namespaces and cgroups for isolation. The exact same container image runs identically on a MacBook Pro, a CI runner, a Kubernetes cluster in AWS, and an on-premises GPU server.",

              "Understanding Docker's layered image architecture is essential for building efficient AI containers. Each instruction in a Dockerfile creates a new read-only layer — the final image is a stack of layers. Docker caches each layer, and crucially, if a layer's inputs haven't changed, it reuses the cached layer. This caching behavior is the single biggest optimization lever for AI container build times. The rule that senior engineers internalize: put instructions that change rarely at the top of the Dockerfile, instructions that change frequently at the bottom. For AI containers: installing system packages (apt-get install) at the top (changes monthly), installing Python packages (pip install -r requirements.txt) in the middle (changes weekly), copying application code (COPY . .) at the bottom (changes daily). Violating this order — copying code before installing packages — means pip install reruns on every code change, turning 30-second builds into 20-minute builds.",

              "Multi-stage Docker builds are the most impactful practice for reducing AI container image sizes — and image size directly impacts deployment velocity, cold start times, and registry storage costs. The pattern: Stage 1 (builder) installs all build tools, compiles dependencies from source, downloads model weights from a registry. Stage 2 (runtime) starts from a minimal base image and copies only the compiled artifacts from Stage 1. The build stage might be 12GB — CUDA development toolkit, GCC compiler, build tools. The runtime stage is 2-3GB — only CUDA runtime libraries and the compiled Python packages. At Netflix, multi-stage builds reduced container image sizes by 60-80%, which at their scale of thousands of deployments per day translated to terabytes of reduced data transfer and minutes saved per deployment across the fleet.",

              "GPU containers require the NVIDIA Container Toolkit (formerly nvidia-docker) to expose GPU devices to containers. The toolkit intercepts container runtime calls and mounts the appropriate NVIDIA drivers from the host into the container — this is why the CUDA version in your container must be compatible with the driver version on the host. The compatibility matrix is: host driver version determines the maximum CUDA version supported in containers. Driver 525 supports CUDA up to 12.1; Driver 535 supports CUDA up to 12.2. Using a container with CUDA 12.2 on a host with Driver 525 will fail with 'CUDA driver version insufficient'. The practical guidance: lock your Docker base image to a specific CUDA/cuDNN version (FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04), pin the host GPU driver version in your EKS launch template, and test the combination in your CI pipeline before deploying. Mismatched CUDA/driver versions are the #1 cause of GPU container failures in production.",

              "Container security is a discipline that most teams discover too late — after a container compromise. The attack surface of a container includes: the application code, all installed packages (Python packages have had numerous critical CVEs — PyTorch, Pillow, NumPy), the OS base image (Ubuntu 22.04 has hundreds of packages, each a potential vulnerability), and the container runtime configuration (running as root, with privileged mode, with dangerous capabilities). The security controls: (1) Non-root user — add 'RUN useradd -m appuser && USER appuser' to your Dockerfile; a container escape with a non-root process only gives filesystem access, not host root access. (2) Read-only root filesystem — '--read-only' flag prevents malware from writing to the container filesystem. (3) Capability dropping — drop all capabilities with '--cap-drop ALL' and add back only what's needed. (4) Seccomp profiles — restrict which system calls the container can make. (5) Image scanning — Trivy, Snyk, and AWS ECR image scanning detect known CVEs in container images before deployment.",

              "Container registry management is where image security and operational efficiency intersect. AWS Elastic Container Registry (ECR), Google Container Registry (GCR/Artifact Registry), and Azure Container Registry (ACR) are the three major managed registries. ECR has features that directly impact AI platform security: immutable image tags (once pushed, a versioned tag cannot be overwritten — preventing silent substitution of production images), basic and enhanced image scanning (enhanced scanning uses Amazon Inspector with real-time CVE monitoring — alerts when new CVEs are discovered for already-deployed images), replication (automatic cross-region replication for multi-region deployments), and lifecycle policies (automatically delete untagged images older than 7 days, retain last 10 semantic versions). A note on tag hygiene: the 'latest' tag is a mutable pointer — it's fine for development, but using 'latest' in a Kubernetes Deployment means you have no idea what code is actually running in production. Production deployments must reference specific, immutable tags (image: myapp:v1.2.3-sha-abc123def).",

              "The container supply chain attack is an emerging threat vector that every AI cloud engineer must understand. In 2021, the SolarWinds-inspired 'dependency confusion' attack technique was demonstrated against hundreds of companies including Microsoft and Uber — attacker-controlled packages with the same name as internal packages were published to public PyPI, automatically pulled into builds. In 2022, the Python package 'ctx' and 'PHPass' were hijacked to steal AWS credentials from any machine that imported them. For AI containers that install dozens of Python packages, the mitigation strategy is: pin all dependency versions exactly (use pip-compile or poetry.lock), use a private artifact repository (AWS CodeArtifact, JFrog Artifactory) to cache approved packages, scan all packages with Snyk before allowing them into your private registry, and verify package checksums in your build pipeline. Never run pip install {package_name}==latest in production containers — always pin to the exact version you've audited."
            ]
          },
          questions: [
            {
              question_text: "What Docker layer caching rule maximizes build speed for AI containers?",
              scenario_context: "Your AI container builds take 25 minutes because pip install runs on every code change.",
              options: ["Copy application code before installing packages so Docker can cache them together", "Put rarely-changing instructions (system packages, pip install) early in the Dockerfile and frequently-changing code (COPY . .) last — pip install caches until requirements.txt changes", "Use --no-cache on every build for consistency", "Always build from scratch for security"],
              correct_answer_index: 1,
              explanation: "Docker caches layers until their inputs change. pip install depends on requirements.txt — if requirements.txt is copied and pip runs before COPY . ., the pip layer is only invalidated when requirements change (rarely), not on every code change. This cuts builds from 25 minutes to 30 seconds."
            },
            {
              question_text: "What causes GPU container failures when moving from development to production?",
              scenario_context: "Your GPU container runs perfectly locally but fails on the production EKS cluster with 'CUDA driver version insufficient'.",
              options: ["The container is too large", "CUDA version mismatch — the container's CUDA version exceeds what the host GPU driver supports. The driver version on EKS nodes must be compatible with the CUDA version in your Docker base image.", "Missing environment variables", "Kubernetes GPU plugin not installed"],
              correct_answer_index: 1,
              explanation: "CUDA/driver compatibility is strictly versioned — each driver version supports CUDA up to a specific version. Running CUDA 12.2 on a host with Driver 525 (max CUDA 12.1) fails immediately. Pin both the Docker base image CUDA version AND the EKS node driver version, test the combination in CI."
            },
            {
              question_text: "What did the 'dependency confusion' supply chain attack demonstrate about container security?",
              scenario_context: "Reviewing your AI container build pipeline for supply chain risks.",
              options: ["Containers are fundamentally insecure", "Public package registries can be weaponized — attackers publish malicious packages with names matching internal packages, automatically pulled into builds. Mitigation: version pinning, private registries with audited packages, and checksum verification.", "Only npm packages are affected", "Docker prevents dependency confusion attacks"],
              correct_answer_index: 1,
              explanation: "Dependency confusion exploits package manager resolution — public packages with internal names get pulled instead of internal packages. For AI containers installing PyPI packages, this is a critical risk mitigated by exact version pinning, private artifact repositories, and build pipeline package verification."
            },
            {
              question_text: "Why is 'latest' a dangerous container image tag in production Kubernetes deployments?",
              scenario_context: "Your Deployment spec uses image: my-model-server:latest. A new image is pushed and pods are replaced.",
              options: ["'latest' images are larger", "'latest' is a mutable pointer — it changes with every push, meaning you lose deployment determinism, can't reliably rollback, and can't determine what code is actually running in production", "Kubernetes doesn't support 'latest' tags", "It causes higher memory usage"],
              correct_answer_index: 1,
              explanation: "'latest' gives up all determinism. In production, you need to know exactly what code is running (for debugging), be able to roll back to a specific known-good version, and ensure that 'redeploy from the same manifest' produces the same result. Only immutable, specific tags (v1.2.3-sha-abc123) provide these properties."
            },
            {
              question_text: "What does running a container as root enable that makes it a critical security risk?",
              scenario_context: "Security audit finds all your model serving containers run as root.",
              options: ["Root uses more CPU", "A container escape vulnerability (which exist in container runtimes) with a root container process gives the attacker root access to the host node — potentially compromising all workloads on that node and the entire Kubernetes cluster", "Root containers can't read secrets", "It violates Kubernetes policies"],
              correct_answer_index: 1,
              explanation: "Container escapes (like CVE-2019-5736 in runc) do occur. With a non-root process, escape gives filesystem access but not host root. With a root container process, escape gives full host root — from there, an attacker can read all pod secrets on the node, escalate to cluster admin, and compromise the entire platform."
            }
          ]
        },
        {
          title: "1.6 Module 1 Capstone: Architecting a Production AI Cloud Platform",
          description: "Synthesize everything from Module 1 into a production-grade AI cloud architecture. Apply the Well-Architected Framework, security principles, and operational patterns to design an end-to-end platform that can scale from startup to enterprise.",
          order_index: 5,
          lessonScript: {
            mainPoints: [
              "Architecture synthesis is the highest-order skill in cloud engineering — moving from 'I know these components' to 'I can design a coherent system that uses them appropriately for a given set of requirements.' The best mental model for this synthesis comes from the Well-Architected Framework's review process, used in AWS architecture reviews to evaluate thousands of production systems. Start with requirements: what are the SLOs (availability, latency, throughput)? What is the security and compliance posture (HIPAA, SOC2, PCI)? What is the team size and operational maturity? What is the cost budget? What are the growth projections? Architecture is always requirements-driven — there is no universally 'correct' architecture, only architectures that meet or fail to meet specific requirements.",

              "A reference architecture for a production AI inference platform illustrates how Module 1 components fit together. The network layer: a three-tier VPC (us-east-1) spanning 3 AZs, with VPC Endpoints for S3, SageMaker, Secrets Manager, and ECR. The compute layer: an EKS cluster with separate node groups — 'system' node group (m5.large, on-demand, for Kubernetes system components), 'cpu-inference' node group (c5.4xlarge, mixed on-demand/spot, for lightweight models), 'gpu-inference' node group (g4dn.xlarge, on-demand, for heavy models), 'training' node group (p3.8xlarge, Spot with checkpointing, for model training). The security layer: all pods use IRSA for AWS API access, all secrets in Secrets Manager with automatic rotation, all S3 buckets encrypted with KMS CMKs, all inter-service communication authenticated with service mesh mTLS. The observability layer: Prometheus for metrics, Loki for logs, Jaeger for traces, Grafana for dashboards, PagerDuty for alerting.",

              "Cost architecture is as important as security architecture for production AI systems. The 'AI tax' — the additional cost created by running AI workloads compared to traditional software — includes GPU instance costs, training data storage, model registry storage, and the scale of data transfer. Optimization strategies applied at each layer: Compute — use Spot instances for interruptible training (60-90% savings), use Graviton instances for CPU inference (40% better price/performance than x86 for many models), use Karpenter for precise instance selection matching workload requirements. Storage — use S3 Intelligent-Tiering for training datasets (automatically moves infrequently accessed data to cheaper tiers), set lifecycle policies to transition old model checkpoints to Glacier. Network — VPC Endpoints eliminate NAT Gateway costs for AWS API calls, CloudFront reduces egress costs for globally served models. At scale, these optimizations compound: Netflix reported 40% reduction in streaming costs through systematic unit economics optimization.",

              "Disaster Recovery for AI systems has unique considerations beyond standard application DR. The Recovery Time Objective (RTO) — how long the system can be down — and Recovery Point Objective (RPO) — how much data loss is acceptable — define the DR strategy. For AI inference: can you tolerate 15 minutes of degraded service (model serving degraded accuracy from a cached prediction) while restoring the primary model server? That defines a different architecture than 'zero inference downtime required.' Model-specific DR considerations: model artifacts in S3 with Cross-Region Replication to the DR region, feature store with multi-region reads for real-time features, MLflow model registry replicated across regions, and 'model freshness SLO' — how stale can predictions be before the business is impacted? The AWS Elastic Disaster Recovery service can reduce RTO for infrastructure from hours to minutes, but model retraining pipelines that take days have no technical DR shortcut.",

              "The operational runbook is the artifact that determines whether you can sleep through the night or get paged at 3am. For every alert you configure, write the runbook first — the alert is only as good as the response it enables. Runbook structure: what is this alert measuring, what threshold triggers it, what are the likely causes (in order of probability), what are the diagnostic steps for each cause, what are the remediation steps, who to escalate to if you can't resolve in 30 minutes. For AI-specific alerts: 'Model prediction distribution p50 shifted > 2σ from baseline' — likely causes: (1) feature pipeline staleness, (2) upstream data distribution change, (3) model was silently replaced. Diagnostics: check feature freshness in the feature store dashboard, compare input feature distributions in Grafana, verify the deployed model version in the model registry. Runbooks stored in the same Git repository as the code — tested quarterly, updated after every incident.",

              "The Platform Engineering movement — championed by Spotify (creators of Backstage) and formalized by the CNCF — represents the next evolution of cloud engineering. Instead of each development team managing their own cloud infrastructure, a Platform Engineering team builds an Internal Developer Platform (IDP): a self-service system where developers can deploy models, provision training clusters, and access data pipelines through a UI or API without needing deep cloud expertise. For AI teams, an IDP means: a data scientist provisions a 16-GPU training cluster by filling out a form (not learning Kubernetes and Terraform), a model gets deployed to production by clicking a button (not writing Helm charts), a new AI product team is onboarded in an afternoon (not three weeks of infrastructure setup). Spotify's Backstage has become the open-source standard for IDPs, with integrations for 100+ cloud services and a plugin ecosystem for ML-specific capabilities. Building an IDP is the highest-leverage platform engineering investment for AI organizations."
            ]
          },
          questions: [
            {
              question_text: "Why is there no universally 'correct' cloud architecture for AI systems?",
              scenario_context: "A colleague insists you should use the same architecture as Netflix for your 5-person startup.",
              options: ["Because cloud technology changes too rapidly", "Architecture is requirements-driven — availability SLOs, compliance posture, team size, cost budget, and growth projections define the correct architecture for a specific context. Netflix's architecture for 230M users is wrong for a startup.", "Because cloud providers have different capabilities", "Because AI models differ too much"],
              correct_answer_index: 1,
              explanation: "The Well-Architected Framework review starts with requirements, not prescriptions. Netflix's architecture serves 230M concurrent users with hundreds of engineers. Applying it to a 5-person startup creates operational complexity without corresponding benefit — the 'correct' architecture matches the actual requirements."
            },
            {
              question_text: "What determines the Disaster Recovery strategy for an AI inference platform?",
              scenario_context: "Setting DR requirements for a customer-facing recommendation model.",
              options: ["Always use active-active multi-region for maximum availability", "RTO (how long down is acceptable) and RPO (how much data loss/staleness is acceptable) for this specific use case — these requirements determine whether you need hot standby, warm standby, or pilot light DR", "Use the cheapest DR option available", "DR is only needed for databases, not model serving"],
              correct_answer_index: 1,
              explanation: "RTO and RPO are the requirements that drive DR architecture. A recommendation model that can serve slightly stale predictions for 15 minutes during failover has very different DR requirements than a fraud detection model where every missed prediction means financial loss. Requirements first, architecture second."
            },
            {
              question_text: "What is an Internal Developer Platform (IDP) and why is it transformative for AI organizations?",
              scenario_context: "Your data scientists spend 3 weeks waiting for infrastructure before starting each new model project.",
              options: ["A programming language for AI", "A self-service platform where developers provision training clusters, deploy models, and access data pipelines without deep cloud expertise — reducing onboarding from weeks to hours and letting data scientists focus on ML", "A model serving framework", "An internal documentation system"],
              correct_answer_index: 1,
              explanation: "IDPs eliminate the 'infrastructure ticket' bottleneck — data scientists self-serve GPU clusters and model deployments through a UI. This directly accelerates ML velocity. Spotify's Backstage has become the open-source standard, with ML-specific plugins enabling end-to-end model lifecycle management."
            },
            {
              question_text: "In the reference AI inference platform architecture, why is the training node group configured with Spot instances?",
              scenario_context: "Justifying the use of Spot instances for ML training to a risk-averse CTO.",
              options: ["Spot is always faster than on-demand", "Training jobs can be designed to checkpoint progress to S3 and resume after Spot interruption — enabling 60-90% cost savings while accepting the operational complexity of interruption handling", "Spot instances have better GPUs", "On-demand instances don't support GPU workloads"],
              correct_answer_index: 1,
              explanation: "Spot instances can be reclaimed by AWS with 2-minute warning — training jobs handle this by checkpointing model state to S3. On interruption, Kubernetes reschedules the job on a new Spot instance which resumes from the last checkpoint. 60-90% cost savings for the price of checkpointing complexity."
            },
            {
              question_text: "What is the operational runbook and why must it be written before the alert it responds to?",
              scenario_context: "It's 3am, your phone is going off, and the alert says 'Model prediction distribution shifted > 2σ'.",
              options: ["A deployment guide for new services", "Step-by-step response documentation — what the alert means, likely causes in order of probability, diagnostic steps, remediation steps, and escalation path. Written before the alert so the 3am responder has a clear path without needing to think from scratch.", "A code review checklist", "A post-incident report template"],
              correct_answer_index: 1,
              explanation: "Runbooks written before incidents capture diagnostic knowledge from the calm mind of the engineer who built the system. At 3am under pressure, that structured guidance is the difference between a 10-minute resolution and a 3-hour outage. The alert is only as good as the runbook it triggers."
            }
          ]
        }
      ],
      endQuizQuestions: [
        {
          question_text: "What is the fundamental difference between the 'pets' and 'cattle' infrastructure models?",
          scenario_context: "Explaining cloud-native design philosophy to an engineer from a traditional ops background.",
          options: ["Pets are more expensive", "Pets are named, unique servers maintained through illness; cattle are numbered, interchangeable instances replaced when broken. Cloud-native AI uses cattle to achieve auto-scaling and fault tolerance.", "Cattle are older technology", "Pets scale better"],
          correct_answer_index: 1,
          explanation: "Pets require individual attention and can't be replaced without service disruption. Cattle are designed for replacement — a failed GPU instance is terminated and replaced by auto-scaling in minutes. This model enables the self-healing infrastructure that production AI requires."
        },
        {
          question_text: "The Capital One 2019 breach compromised 106M records. What two security controls, if implemented, would have prevented it?",
          scenario_context: "Security architecture review of an AI platform with similar patterns to Capital One's architecture.",
          options: ["Better passwords and 2FA", "Network-level SSRF protection (WAF configured to block metadata service requests) combined with least-privilege IAM (the role shouldn't have had S3 GetObject on all buckets)", "Encrypted S3 buckets and regular audits", "Multi-factor authentication and VPN"],
          correct_answer_index: 1,
          explanation: "Capital One's SSRF allowed access to 169.254.169.254 (EC2 metadata service) which returned IAM role credentials. Defense 1: configure WAF to block SSRF to metadata service. Defense 2: the IAM role should only have accessed specific buckets, not all S3 buckets in the account."
        },
        {
          question_text: "Why does Terraform's dependency graph matter for complex AI infrastructure?",
          scenario_context: "Provisioning an EKS cluster, IAM roles, and node groups that have dependencies on each other.",
          options: ["It makes Terraform faster", "Terraform automatically determines creation order from resource references — IAM roles before clusters that reference them, clusters before node groups that reference cluster IDs — without any manual ordering specification", "It visualizes the infrastructure", "It detects circular dependencies"],
          correct_answer_index: 1,
          explanation: "The dependency graph eliminates manual ordering — you declare what you want, Terraform figures out the order from which resources reference others. It also enables maximum parallelism — independent resources (IAM role + VPC) are created simultaneously, reducing provisioning time."
        },
        {
          question_text: "What NAT Gateway cost optimization saves thousands monthly for AI training jobs?",
          scenario_context: "Your training jobs download 100TB of training data from S3 monthly and your NAT Gateway bill is $4,500.",
          options: ["Use smaller training batches", "VPC Gateway Endpoints for S3 route traffic within the AWS backbone, eliminating NAT Gateway data processing fees ($0.045/GB × 100,000GB = $4,500/month) entirely", "Compress training data", "Use fewer training jobs"],
          correct_answer_index: 1,
          explanation: "At 100TB/month, NAT Gateway costs $4,500 in data processing fees alone. A VPC Gateway Endpoint for S3 routes traffic within AWS backbone — zero data processing cost, lower latency, improved security. This single configuration change pays for months of engineer time."
        },
        {
          question_text: "What Docker build pattern reduces a 20-minute build to 30 seconds for code-only changes?",
          scenario_context: "Every code change triggers a 20-minute pip install, blocking rapid iteration.",
          options: ["Use a faster internet connection", "Copy requirements.txt before copying application code — pip install is cached until requirements.txt changes, not until any code changes. Code changes only invalidate the final COPY . . layer.", "Build in parallel", "Use Alpine Linux base image"],
          correct_answer_index: 1,
          explanation: "Layer caching is Docker's key optimization. pip install depends only on requirements.txt — by copying requirements.txt first and running pip, that layer is cached for all future builds where requirements don't change. COPY . . at the end means only code is re-added."
        },
        {
          question_text: "What does 'stateful' mean for Security Groups in AWS networking?",
          scenario_context: "Configuring Security Groups for an AI inference API that receives requests and makes outbound calls to a feature store.",
          options: ["Security Groups save state to a database", "Security Groups track connection state — if outbound traffic to port 443 is allowed, return traffic is automatically permitted without an explicit inbound rule for that connection", "Security Groups require manual state synchronization", "Stateful means they persist across reboots"],
          correct_answer_index: 1,
          explanation: "Stateful tracking means you don't need symmetric rules. Allowing outbound HTTPS (443) automatically allows the corresponding inbound response traffic. This is why Security Groups are simpler to configure than Network ACLs (stateless), which require both directions explicitly."
        },
        {
          question_text: "Why should AI model artifacts never be stored with 'latest' as the image tag?",
          scenario_context: "Investigating why today's model deployment behaves differently than yesterday's despite the manifest being unchanged.",
          options: ["'latest' takes more storage", "'latest' is mutable — each push overwrites it. Identical manifests produce different deployments, making it impossible to know what code runs in production, roll back reliably, or reproduce past behavior.", "Kubernetes doesn't support 'latest'", "'latest' is slower to pull"],
          correct_answer_index: 1,
          explanation: "Mutable tags destroy deployment determinism. Production requires knowing exactly what code is deployed (for debugging), the ability to roll back to a known-good version (for incident response), and reproducible deployments (for compliance). Only immutable versioned tags (v1.2.3-sha-abc) provide these properties."
        },
        {
          question_text: "What is the role of AWS STS in IAM Role-based authentication?",
          scenario_context: "Explaining to a security auditor how your ML training jobs authenticate with S3 without static credentials.",
          options: ["STS manages IAM user passwords", "STS (Security Token Service) issues temporary, time-limited credentials when a service assumes an IAM Role — these credentials automatically expire (1-12 hours), eliminating the risk of long-lived credential compromise", "STS is a monitoring service", "STS manages VPC routing"],
          correct_answer_index: 1,
          explanation: "When EC2, Lambda, or an EKS pod assumes an IAM Role, STS issues temporary credentials (access key + secret + session token) that expire automatically. This automatic expiration means leaked credentials have a bounded exploit window — a fundamental security advantage over IAM User access keys."
        },
        {
          question_text: "What are the RTO and RPO metrics and how do they determine AI inference DR architecture?",
          scenario_context: "Designing disaster recovery for a real-time fraud detection model.",
          options: ["Metrics for measuring model accuracy", "Recovery Time Objective (maximum acceptable downtime) and Recovery Point Objective (maximum acceptable data/model staleness) — for fraud detection with zero tolerance for downtime, these require active-active multi-region, not warm standby", "Cloud billing metrics", "Container resource metrics"],
          correct_answer_index: 1,
          explanation: "For fraud detection, every minute of downtime means missed fraud. RTO near zero requires active-active multi-region with automatic failover. For a non-critical recommendation model, RTO of 15 minutes might be acceptable, enabling a simpler warm standby approach. Requirements determine architecture."
        },
        {
          question_text: "What is the FinOps 'Inform, Optimize, Operate' cycle and why does it matter for AI cloud costs?",
          scenario_context: "Your AI infrastructure bill is $200K/month and the CTO asks you to reduce it by 30%.",
          options: ["A project management methodology", "Inform: understand current spend at service/team/workload level. Optimize: right-size instances, use Spot, implement lifecycle policies. Operate: build cost-awareness into engineering culture with per-team budgets. AI cost optimization requires all three phases.", "A security compliance framework", "A staffing model for cloud teams"],
          correct_answer_index: 1,
          explanation: "Cloudflare achieved 96% AI cost reduction through systematic FinOps: first understanding exactly what was expensive (Inform), then optimizing compute choices and batching strategies (Optimize), then building cost metrics into team SLOs (Operate). Ad-hoc cost cutting misses the compounding improvements of the full cycle."
        },
        {
          question_text: "How does envelope encryption differ from simple AES encryption for AI model protection?",
          scenario_context: "Explaining KMS encryption architecture to a compliance auditor.",
          options: ["Envelope encryption is less secure", "Envelope encryption uses two keys: a data encryption key (DEK) encrypts the data, a KMS Customer Master Key (CMK) encrypts the DEK. The CMK never leaves KMS, providing key management, rotation, and access auditing independent of the data itself.", "Envelope encryption is only for large files", "They provide identical security"],
          correct_answer_index: 1,
          explanation: "Envelope encryption separates data encryption from key management. The CMK never leaves KMS hardware — all encryption/decryption of DEKs happens inside KMS with full IAM access control and CloudTrail auditing. Even AWS employees cannot access your CMK or the data it protects."
        },
        {
          question_text: "What does Terratest provide that terraform validate cannot?",
          scenario_context: "A Terraform module passed all linting checks but created subnets with wrong CIDR blocks when deployed.",
          options: ["Better error messages","Actual infrastructure provisioning in a real AWS test account with programmatic assertions — validating that the Terraform code produces the correct real-world resources, not just that the syntax is valid","Cost estimation for the infrastructure","Documentation generation"],
          correct_answer_index: 1,
          explanation: "terraform validate checks syntax and semantic correctness of HCL. Terratest provisions actual infrastructure and asserts on real AWS resource properties (does the VPC have the right CIDR? are private subnets routing through NAT Gateway?). Integration testing catches bugs that static analysis misses."
        },
        {
          question_text: "What is the Platform Engineering 'paved road' concept?",
          scenario_context: "Your data scientists are spending 40% of their time on infrastructure setup instead of ML work.",
          options: ["A networking architecture pattern", "Well-supported, optimized paths for common tasks (deploy model, provision training, create feature store) that incorporate security, observability, and cost controls by default — teams use the paved road for 80% of cases without needing infrastructure expertise", "A code review process", "A documentation standard"],
          correct_answer_index: 1,
          explanation: "Paved roads are the platform team's output — opinionated, production-ready templates for common AI infrastructure tasks. A data scientist uses the paved road to get a GPU training cluster in 5 minutes instead of spending days learning Kubernetes and Terraform. This is the highest-leverage investment in AI organizational velocity."
        },
        {
          question_text: "What is the security risk of Docker containers running with --privileged mode?",
          scenario_context: "A developer added --privileged to fix a GPU access issue in a model training container.",
          options: ["Privileged mode uses more GPU memory", "Privileged mode disables all container isolation — the container has full root access to the host kernel, all devices, and can escape to the host filesystem. It's equivalent to running as root on the host node.", "Privileged mode is slower", "It only affects CPU containers, not GPU ones"],
          correct_answer_index: 1,
          explanation: "--privileged removes all namespace and capability restrictions, giving the container root-equivalent access to the host. If the training container is compromised (malicious dependency, model file), the attacker has full host access. The correct fix for GPU access is the nvidia-device-plugin, not --privileged."
        },
        {
          question_text: "How does Karpenter improve on Cluster Autoscaler for AI workloads with heterogeneous compute requirements?",
          scenario_context: "Your AI platform needs different instance types for different workloads — GPU training (p3.8xlarge), GPU inference (g4dn.xlarge), CPU preprocessing (c5.4xlarge) — and current node provisioning takes 8 minutes.",
          options: ["Karpenter is free while Cluster Autoscaler costs money","Karpenter provisions EC2 instances directly (bypassing ASGs) in ~30 seconds, selects the optimal instance type per workload requirements from NodePool configs, supports instance diversification for Spot, and right-sizes nodes — vs. Cluster Autoscaler's 3-5 minute ASG-based scaling with pre-defined instance types","Karpenter only works with on-demand instances","Cluster Autoscaler has better multi-cloud support"],
          correct_answer_index: 1,
          explanation: "Karpenter's direct EC2 provisioning (30s vs 3-5 min), workload-aware instance selection (picks the cheapest instance that satisfies pod resource requests), and Spot diversification (tries 5 instance families to find available Spot capacity) make it dramatically better for heterogeneous AI compute requirements."
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: existingCourse } = await supabase
      .from("courses")
      .select("id")
      .eq("title", courseData.title)
      .maybeSingle();

    if (existingCourse) {
      // Delete existing course and re-seed with rich content
      await supabase.from("courses").delete().eq("id", existingCourse.id);
    }

    const courseTranslations = {
      es: { title: "Ingeniero de Nube IA", description: "Domina la infraestructura de IA nativa en la nube en AWS, Azure y GCP." },
      fr: { title: "Ingénieur Cloud IA", description: "Maîtrisez l'infrastructure IA native du cloud sur AWS, Azure et GCP." },
      de: { title: "KI-Cloud-Ingenieur", description: "Meistern Sie cloud-native KI-Infrastruktur auf AWS, Azure und GCP." },
      zh: { title: "AI云工程师", description: "掌握AWS、Azure和GCP上的云原生AI基础设施。" },
      ar: { title: "مهندس سحابة الذكاء الاصطناعي", description: "أتقن البنية التحتية السحابية للذكاء الاصطناعي." },
      ja: { title: "AIクラウドエンジニア", description: "クラウドネイティブAIインフラをマスターする。" },
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

    for (const chapterData of courseData.chapters) {
      const { data: chapter, error: chapterError } = await supabase
        .from("chapters")
        .insert({
          course_id: course.id,
          title: chapterData.title,
          description: chapterData.description,
          order_index: chapterData.order_index,
          translations: {},
        })
        .select()
        .single();

      if (chapterError) throw chapterError;

      for (const videoData of chapterData.videos) {
        const transcript = videoData.lessonScript.mainPoints.join("\n\n");
        const videoTranslations = {
          en: { title: videoData.title, transcript },
          es: { title: videoData.title, transcript },
          fr: { title: videoData.title, transcript },
          de: { title: videoData.title, transcript },
          zh: { title: videoData.title, transcript },
          ar: { title: videoData.title, transcript },
          ja: { title: videoData.title, transcript },
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

        const { data: quiz, error: quizError } = await supabase
          .from("quizzes")
          .insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 })
          .select()
          .single();

        if (quizError) throw quizError;

        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          await supabase.from("quiz_questions").insert({
            quiz_id: quiz.id,
            question_text: q.question_text,
            scenario_context: q.scenario_context,
            options: q.options,
            correct_answer_index: q.correct_answer_index,
            explanation: q.explanation,
            order_index: i,
          });
        }
      }

      const { data: endQuiz, error: endQuizError } = await supabase
        .from("quizzes")
        .insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 })
        .select()
        .single();

      if (endQuizError) throw endQuizError;

      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        await supabase.from("quiz_questions").insert({
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
      JSON.stringify({ message: "AI Cloud Engineer — rich version seeded", courseId: course.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
