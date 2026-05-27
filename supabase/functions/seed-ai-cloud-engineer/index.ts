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
      description: "Understand the cloud landscape, core services, and how AI workloads differ from traditional applications. Build the mental models that underpin everything else in this course.",
      order_index: 0,
      videos: [
        {
          title: "1.1 The AI Cloud Engineer: Role, Market, and Career Path",
          description: "Why AI Cloud Engineer is the most in-demand role of the decade, what you'll build, and how to think like a cloud-native AI engineer.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "The AI Cloud Engineer sits at the intersection of cloud infrastructure and artificial intelligence — you build and operate the systems that make AI products possible at scale. This isn't just DevOps with a sprinkle of ML — it's an entirely new discipline commanding $120K–$220K/year globally.",
              "Three forces have created this role: the explosion of foundation models that require massive compute, the shift to cloud-native architectures, and the enterprise demand to move AI from prototype to production reliably. Every company in the Fortune 500 is hiring for this exact skillset right now.",
              "Your primary outputs as an AI Cloud Engineer are: provisioned and secure cloud infrastructure, containerized AI workloads running on Kubernetes, automated CI/CD pipelines for model deployment, and monitoring systems that detect model drift and infra anomalies.",
              "The cloud landscape for AI is dominated by three hyperscalers — AWS (SageMaker, Bedrock, ECS, EKS), Azure (Azure ML, AKS, OpenAI Service), and GCP (Vertex AI, GKE, Cloud Run) — plus a growing ecosystem of AI-native infrastructure providers like CoreWeave, Lambda Labs, and Modal.",
              "In this course you'll master IaC with Terraform and Pulumi, container orchestration with Kubernetes, serverless AI patterns, MLOps pipelines, multi-cloud architectures, and production-grade security. By Module 7 you'll be able to architect and deploy a complete enterprise AI platform from scratch."
            ]
          },
          questions: [
            { question_text: "What best describes the core output of an AI Cloud Engineer?", scenario_context: "You're explaining your role to a non-technical executive.", options: ["Writing machine learning algorithms", "Building and operating infrastructure that makes AI products work at scale", "Managing databases and servers", "Developing front-end AI interfaces"], correct_answer_index: 1, explanation: "AI Cloud Engineers build and operate the infrastructure — compute, networking, storage, pipelines — that enables AI products to function reliably in production." },
            { question_text: "Which three hyperscalers dominate enterprise AI cloud infrastructure?", scenario_context: "A startup CTO asks which platforms you'd recommend evaluating.", options: ["IBM, Oracle, and SAP", "AWS, Azure, and GCP", "Heroku, Netlify, and Vercel", "Digital Ocean, Linode, and Vultr"], correct_answer_index: 1, explanation: "AWS, Azure, and GCP are the three dominant hyperscalers, each offering purpose-built AI services (SageMaker, Azure ML, Vertex AI) alongside foundational infrastructure." },
            { question_text: "What salary range does the AI Cloud Engineer role command globally?", scenario_context: "You're negotiating compensation at a Series B startup.", options: ["$40K–$70K/year", "$80K–$100K/year", "$120K–$220K/year", "$50K–$90K/year"], correct_answer_index: 2, explanation: "AI Cloud Engineers command $120K–$220K/year globally due to the scarcity of professionals who combine cloud infrastructure expertise with AI systems knowledge." },
            { question_text: "What primary force has created demand for AI Cloud Engineers?", scenario_context: "You're writing a LinkedIn post about the role.", options: ["Declining interest in traditional software development", "The need to move AI from prototype to production reliably at enterprise scale", "Government regulation requiring cloud certifications", "The rise of no-code tools"], correct_answer_index: 1, explanation: "Enterprise demand to move AI from promising prototype to reliable, scalable production system is the primary driver — this requires specialized infrastructure expertise." },
            { question_text: "Which infrastructure-as-code tools will you master in this course?", scenario_context: "A team lead asks about your IaC experience.", options: ["CloudFormation and ARM templates only", "Shell scripts and manual console configuration", "Terraform and Pulumi", "Ansible and Chef only"], correct_answer_index: 2, explanation: "Terraform (declarative, provider-agnostic) and Pulumi (IaC in real programming languages) are the primary IaC tools for modern AI cloud engineering." }
          ]
        },
        {
          title: "1.2 Cloud Architecture Fundamentals: VPCs, Compute, and Storage for AI",
          description: "Master the core building blocks — networking, compute tiers, and storage classes — with AI workload requirements in mind.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "Every AI deployment lives inside a Virtual Private Cloud (VPC) — your isolated network environment on the hyperscaler. A well-designed VPC uses public subnets for load balancers and NAT gateways, private subnets for AI compute and databases, and strict security group rules to control traffic. Getting this wrong is the #1 source of AI deployment security incidents.",
              "Compute for AI isn't one-size-fits-all. You'll choose between GPU instances (g4dn, p3, A100-backed) for training and inference, CPU-optimized instances for data preprocessing, memory-optimized instances for large embedding operations, and spot/preemptible instances for cost optimization on non-critical workloads. The right choice can mean 10x cost differences.",
              "Storage architecture for AI has three layers: object storage (S3, GCS, Azure Blob) for datasets, model artifacts, and checkpoints — think petabytes at cents per GB; block storage (EBS, persistent disk) for high-throughput training workloads requiring low latency; and in-memory caching (ElastiCache, Redis) for serving hot embeddings and feature stores.",
              "Content Delivery Networks (CDNs) matter for AI too — serving model endpoints globally through CloudFront, Azure CDN, or Cloud CDN reduces inference latency by 40-60% for geographically distributed users. This is critical for user-facing AI products where response time under 200ms is expected.",
              "Auto-scaling is the superpower of cloud AI. Configure target tracking policies on CPU utilization and custom metrics (GPU utilization, queue depth), set scale-in cooldowns to prevent thrashing, and use predictive scaling for known traffic patterns. An improperly configured auto-scaler can spend 3x your budget in minutes during a traffic spike."
            ]
          },
          questions: [
            { question_text: "Where should AI compute instances be placed in a VPC architecture?", scenario_context: "You're designing a secure VPC for an AI inference service.", options: ["Public subnets with direct internet access", "Private subnets with access controlled via security groups", "Outside the VPC for performance", "In a shared public cloud subnet"], correct_answer_index: 1, explanation: "AI compute should always be in private subnets, inaccessible directly from the internet, with traffic routed through load balancers and NAT gateways in public subnets." },
            { question_text: "Which storage type is best for storing large ML training datasets at lowest cost?", scenario_context: "You need to store 50TB of training data for a foundation model.", options: ["Block storage like EBS", "Object storage like S3 or GCS", "In-memory cache like Redis", "Local NVMe SSD"], correct_answer_index: 1, explanation: "Object storage (S3, GCS, Azure Blob) provides virtually unlimited capacity at cents per GB, making it ideal for large ML datasets and model artifacts." },
            { question_text: "What is the primary benefit of CDNs for AI inference endpoints?", scenario_context: "Your AI product serves users across 30 countries and latency complaints are rising.", options: ["Reducing model training time", "Reducing inference latency by 40-60% for geographically distributed users", "Encrypting model weights", "Reducing the cost of GPUs"], correct_answer_index: 1, explanation: "CDNs cache responses at edge locations globally, reducing round-trip time to AI endpoints by 40-60% — critical for real-time AI products." },
            { question_text: "What metric should a custom auto-scaler use for GPU-based inference?", scenario_context: "Your GPU inference fleet keeps running at 100% utilization before scaling out.", options: ["Default CPU utilization only", "GPU utilization and/or request queue depth", "Memory usage alone", "Network bandwidth"], correct_answer_index: 1, explanation: "GPU utilization and request queue depth are better signals for AI workloads than CPU utilization, which often stays low even when GPUs are fully loaded." },
            { question_text: "Which compute tier is most cost-effective for non-critical ML training jobs that can tolerate interruptions?", scenario_context: "You need to cut your monthly training costs by 60%.", options: ["Reserved instances with 3-year commitment", "On-demand instances", "Spot/preemptible instances", "Dedicated hosts"], correct_answer_index: 2, explanation: "Spot (AWS) and preemptible (GCP) instances offer 60-90% cost savings over on-demand for non-critical training jobs that can checkpoint and resume on interruption." }
          ]
        },
        {
          title: "1.3 Infrastructure as Code with Terraform: Building AI Infrastructure Declaratively",
          description: "Learn Terraform from first principles and apply it to provisioning production-grade AI infrastructure. This is the skill that separates cloud engineers from cloud architects.",
          order_index: 2,
          lessonScript: {
            mainPoints: [
              "Infrastructure as Code (IaC) means your entire cloud environment — VPCs, compute clusters, databases, networking — is defined in version-controlled code files. The golden rule: if it runs in production and isn't in code, it doesn't exist. Terraform is the de facto standard for IaC in AI infrastructure, used by Netflix, Airbnb, Spotify, and virtually every AI-first company.",
              "Terraform's core workflow is init → plan → apply → destroy. You write resource blocks in HCL (HashiCorp Configuration Language) declaring desired state, run terraform plan to see what will change, and terraform apply to make it so. The state file is Terraform's memory — store it in S3 or GCS with locking via DynamoDB/Cloud Storage, never locally in teams.",
              "For AI infrastructure specifically, your Terraform modules should include: an EKS/GKE cluster module for AI workloads, a VPC module with private/public subnet separation, an RDS/Cloud SQL module for metadata, an S3/GCS module for datasets and model artifacts, and an IAM module for least-privilege access. Structure these as reusable modules in a private registry.",
              "Variables and outputs are how you make Terraform DRY (Don't Repeat Yourself). Use variable files (.tfvars) per environment — dev.tfvars, staging.tfvars, prod.tfvars — and outputs to pass values between modules. For secrets (API keys, DB passwords), never put them in .tfvars — use AWS Secrets Manager or HashiCorp Vault, referenced via data sources.",
              "Terraform workspaces or separate state backends per environment prevent the catastrophic mistake of running prod infrastructure changes against dev configs. Combine this with Atlantis or Terraform Cloud for PR-based infrastructure workflows — every infrastructure change goes through code review before it touches production."
            ]
          },
          questions: [
            { question_text: "What is the Terraform golden rule for production infrastructure?", scenario_context: "A new team member manually creates an S3 bucket via the console.", options: ["Manual changes are fine for small resources", "If it runs in production and isn't in code, it doesn't exist", "Terraform is only needed for complex infrastructure", "Manual changes should be documented in a wiki"], correct_answer_index: 1, explanation: "All production infrastructure must be defined in Terraform code. Manual console changes create configuration drift and can't be audited, versioned, or reproduced." },
            { question_text: "Where should Terraform state files be stored in a team environment?", scenario_context: "Your team is growing from 2 to 8 engineers all working with Terraform.", options: ["Each engineer's local machine", "A shared Git repository", "S3 or GCS with DynamoDB/Cloud Storage locking", "In the same directory as the code"], correct_answer_index: 2, explanation: "Remote state in S3/GCS with locking prevents concurrent modifications and state corruption when multiple engineers run Terraform simultaneously." },
            { question_text: "How should database passwords and API keys be handled in Terraform?", scenario_context: "A teammate commits a database password to a .tfvars file in Git.", options: ["It's acceptable if the repo is private", "Use AWS Secrets Manager or HashiCorp Vault, referenced via data sources", "Encrypt the .tfvars file with a password", "Store them as Terraform variables with default values"], correct_answer_index: 1, explanation: "Secrets should never appear in version control. Use Secrets Manager or Vault and reference them via Terraform data sources so secrets stay outside of code." },
            { question_text: "What is the purpose of Terraform modules?", scenario_context: "You're building AI infrastructure that needs to be deployed to 5 different regions.", options: ["To make Terraform run faster", "To create reusable, DRY infrastructure components deployable across environments", "To avoid writing HCL", "To generate documentation automatically"], correct_answer_index: 1, explanation: "Modules encapsulate reusable infrastructure patterns (VPC, EKS cluster, etc.) that can be parameterized and deployed consistently across regions and environments." },
            { question_text: "What does 'terraform plan' do?", scenario_context: "Before deploying changes to your AI training cluster, you run terraform plan.", options: ["Applies changes immediately", "Shows what changes Terraform will make without executing them", "Destroys existing infrastructure", "Creates a backup of current state"], correct_answer_index: 1, explanation: "terraform plan compares your desired state (code) with current state (state file) and shows exactly what will be created, modified, or destroyed — with no changes made." }
          ]
        },
        {
          title: "1.4 IAM and Security for AI Systems: Least Privilege in Practice",
          description: "Security is non-negotiable in production AI. Master IAM policies, service accounts, secrets management, and the security principles that protect AI systems from real-world threats.",
          order_index: 3,
          lessonScript: {
            mainPoints: [
              "The Principle of Least Privilege (PoLP) is the single most important security principle for AI cloud engineers: every service, user, and process gets exactly the permissions needed to do its job — nothing more. A compromised ML training job with admin IAM permissions is a catastrophic breach. One with read-only access to its specific S3 bucket is an isolated incident.",
              "IAM architecture for AI systems involves four layers: IAM users (human engineers, service accounts), IAM roles (assumed by services like EC2, Lambda, EKS pods), IAM policies (JSON documents defining allowed/denied actions), and IAM permission boundaries (hard limits on what any role can ever do). In Kubernetes, this maps to RBAC for workload identity.",
              "Secrets management is a discipline in itself. The pattern: applications never read secrets from environment variables or config files. Instead, your Kubernetes pods use workload identity (IRSA on AWS, Workload Identity on GCP) to authenticate with Secrets Manager and retrieve secrets at runtime. Secrets are rotated automatically every 30-90 days. Audit logs record every secret access.",
              "Network security for AI uses defense-in-depth: VPC security groups (stateful, instance-level), Network ACLs (stateless, subnet-level), private endpoints for AWS services (so traffic stays on AWS backbone, never public internet), and VPN/Direct Connect for on-premises connectivity. AI model artifacts in S3 should have bucket policies blocking public access with a hard deny.",
              "Compliance and audit readiness: enable AWS CloudTrail, GCP Cloud Audit Logs, or Azure Monitor on every account. Set up GuardDuty for anomaly detection. Create Config Rules that auto-remediate non-compliant resources (like an accidentally public S3 bucket). For regulated industries (healthcare, finance), this isn't optional — it's how you avoid million-dollar fines."
            ]
          },
          questions: [
            { question_text: "What is the Principle of Least Privilege?", scenario_context: "You're granting permissions to a new ML training service.", options: ["Give maximum permissions to avoid permission errors", "Grant exactly the permissions needed and nothing more", "Use admin permissions for efficiency", "Permissions can be sorted out after deployment"], correct_answer_index: 1, explanation: "Least Privilege means every entity gets only the minimum permissions required for its specific function, limiting blast radius if credentials are compromised." },
            { question_text: "How should Kubernetes pods authenticate with AWS Secrets Manager?", scenario_context: "Your ML inference pods need to read database credentials at startup.", options: ["Hardcode credentials in the container image", "Use IRSA (IAM Roles for Service Accounts) for workload identity", "Mount credentials as ConfigMaps", "Set credentials as Kubernetes Secrets in plaintext"], correct_answer_index: 1, explanation: "IRSA allows Kubernetes pods to assume IAM roles without static credentials, authenticating with AWS services like Secrets Manager using short-lived tokens." },
            { question_text: "What service detects anomalous API activity and potential security threats in AWS?", scenario_context: "You need to detect if someone is attempting to exfiltrate your AI model artifacts.", options: ["AWS Config", "AWS CloudTrail alone", "Amazon GuardDuty", "AWS Trusted Advisor"], correct_answer_index: 2, explanation: "Amazon GuardDuty uses ML to analyze CloudTrail, VPC Flow Logs, and DNS logs to detect anomalous behavior, compromised credentials, and data exfiltration attempts." },
            { question_text: "What is the difference between VPC Security Groups and Network ACLs?", scenario_context: "You're designing network controls for your AI training cluster.", options: ["They are identical", "Security Groups are stateful instance-level; Network ACLs are stateless subnet-level", "ACLs are newer and replace Security Groups", "Security Groups only work with EC2"], correct_answer_index: 1, explanation: "Security Groups maintain connection state (stateful) and apply to instances; Network ACLs are stateless and apply to subnets — together they provide layered network security." },
            { question_text: "How often should secrets be rotated in production AI systems?", scenario_context: "Your compliance team asks about your secret rotation policy.", options: ["Only when compromised", "Never, rotation causes outages", "Automatically every 30-90 days", "Once per year during audits"], correct_answer_index: 2, explanation: "Automated rotation every 30-90 days is best practice — limiting the window of exposure if a secret is ever compromised, while avoiding manual rotation burden." }
          ]
        },
        {
          title: "1.5 Containers and Docker: Packaging AI Workloads for Portability",
          description: "Containers are the fundamental unit of AI deployment. Master Docker, multi-stage builds, and container best practices that make AI models portable across any cloud.",
          order_index: 4,
          lessonScript: {
            mainPoints: [
              "A container packages your AI application and all its dependencies — Python version, CUDA libraries, model weights, and code — into a single portable artifact that runs identically on your laptop, a CI/CD runner, and a production Kubernetes cluster. The 'it works on my machine' problem disappears forever. This is why Docker revolutionized software deployment and why it's foundational to AI engineering.",
              "Multi-stage builds are essential for AI containers. Stage 1 (builder): a large image with all build tools, pip installs, model downloads. Stage 2 (runtime): a minimal base image that copies only the compiled artifacts and dependencies. This can reduce your image size from 8GB to 800MB, which matters enormously for pull times, cold starts, and storage costs at scale.",
              "GPU containers require the NVIDIA Container Toolkit. Your base image should be nvidia/cuda:12.2-cudnn8-runtime-ubuntu22.04 (not the full devel image in production). Match your CUDA version precisely to your GPU driver version — a mismatch is the most common failure mode when moving AI containers from dev to production. Test with nvidia-smi inside the container before deploying.",
              "Container security: never run AI containers as root. Use a non-root USER in your Dockerfile. Scan images with Trivy or Snyk in your CI pipeline — a model serving container typically has hundreds of packages, each a potential vulnerability surface. Use distroless base images when possible to eliminate the entire OS-level attack surface.",
              "Container registries (ECR, GCR, ACR) are your source of truth for versioned AI artifacts. Tag strategy matters: use semantic versioning (v1.2.3) plus the Git SHA for traceability, never just 'latest' in production. Enable image scanning and signing. Set lifecycle policies to delete old images automatically — AI model images can consume terabytes quickly."
            ]
          },
          questions: [
            { question_text: "What is the core problem that containers solve for AI deployment?", scenario_context: "An ML engineer says 'the model works locally but fails in production'.", options: ["Network latency issues", "The 'it works on my machine' problem — dependency and environment inconsistency", "Insufficient GPU memory", "Poor model accuracy"], correct_answer_index: 1, explanation: "Containers encapsulate the exact runtime environment — Python version, CUDA libraries, dependencies — ensuring identical behavior from laptop to production." },
            { question_text: "What is the primary benefit of multi-stage Docker builds for AI containers?", scenario_context: "Your AI inference image is 8GB and taking 5 minutes to pull on every deployment.", options: ["Faster model training", "Dramatically reduced image size by separating build and runtime stages", "Better GPU utilization", "Improved model accuracy"], correct_answer_index: 1, explanation: "Multi-stage builds separate the heavy build environment from the lean runtime, reducing AI container images from gigabytes to hundreds of megabytes." },
            { question_text: "What is the most common failure mode when moving GPU containers from dev to production?", scenario_context: "Your GPU container runs fine locally but crashes on the production cluster.", options: ["Insufficient CPU cores", "CUDA version mismatch between container and GPU driver", "Wrong Python version", "Missing environment variables"], correct_answer_index: 1, explanation: "CUDA version mismatches between the container's CUDA libraries and the host GPU driver are the #1 cause of GPU container failures in production environments." },
            { question_text: "What container image tagging strategy should you use in production?", scenario_context: "You need to be able to roll back to any previous model version within 30 seconds.", options: ["Use 'latest' for simplicity", "Semantic versioning plus Git SHA (e.g., v1.2.3-abc123def)", "Date-based tags only", "Random UUIDs"], correct_answer_index: 1, explanation: "Combining semantic versioning with Git SHA provides both human-readable version context and exact code traceability for safe rollbacks and debugging." },
            { question_text: "Why should AI containers never run as root?", scenario_context: "A security audit flags your inference containers running as root user.", options: ["Root users use more memory", "Container escape vulnerabilities could give an attacker root access to the host node", "Root processes are slower", "Cloud providers don't support root containers"], correct_answer_index: 1, explanation: "Running as root means a container escape vulnerability gives the attacker full host access. Non-root containers limit blast radius to the container's own filesystem." }
          ]
        },
        {
          title: "1.6 Module 1 Assessment: Cloud Foundations Mastery",
          description: "Comprehensive assessment covering cloud architecture, Terraform, IAM security, and containerization for AI workloads.",
          order_index: 5,
          lessonScript: {
            mainPoints: [
              "Cloud architecture for AI requires deliberate design: private subnets for compute, proper IAM with least privilege, object storage for artifacts, and auto-scaling configured on the right metrics.",
              "Terraform is your infrastructure language — declarative, version-controlled, and modular. State management, secrets handling, and workspace separation are production-critical practices.",
              "Security is built-in, not bolted-on: GuardDuty for threat detection, Secrets Manager for credentials, CloudTrail for audit, and container hardening for every deployment.",
              "Containers are the universal deployment artifact: multi-stage builds for lean images, GPU toolkit for AI workloads, non-root users for security, and registry with semantic versioning.",
              "These foundations underpin every advanced topic in this course — Kubernetes orchestration, serverless AI, MLOps pipelines, and multi-cloud architectures all build on what you've learned here."
            ]
          },
          questions: [
            { question_text: "A company's AI training job was compromised. The attacker accessed the entire AWS account. What security principle was most likely violated?", scenario_context: "Post-incident review of a security breach affecting an AI training job.", options: ["The container wasn't updated", "The training job had admin IAM permissions instead of least-privilege access", "The VPC was misconfigured", "The S3 bucket was private"], correct_answer_index: 1, explanation: "Violating least privilege by granting admin IAM to an AI training job is catastrophic. Proper IAM would limit compromise to the specific resources the job legitimately needs." },
            { question_text: "Your AI inference service experiences a 10x traffic spike. It scaled but costs tripled overnight. What auto-scaling configuration likely caused this?", scenario_context: "Cost alert fires at 3am showing 300% cost increase.", options: ["Scale-out threshold was too aggressive with no scale-in policy", "GPU instances were too expensive", "CDN was not configured", "Terraform didn't apply"], correct_answer_index: 0, explanation: "Aggressive scale-out without proper scale-in cooldowns and policies causes instances to stay running long after traffic normalizes, tripling costs unnecessarily." },
            { question_text: "A teammate runs 'terraform apply' against production using their local state file, overwriting 3 hours of another engineer's changes. How do you prevent this?", scenario_context: "Post-incident review after a 3-hour production outage.", options: ["Only one person should use Terraform", "Use remote state with DynamoDB locking so only one operation runs at a time", "Use local state but email each other before applying", "Terraform apply should be disabled in production"], correct_answer_index: 1, explanation: "Remote state with locking (S3 + DynamoDB on AWS) prevents concurrent applies by acquiring a lock before any state-modifying operation, forcing serialized execution." },
            { question_text: "Your 12GB AI container image takes 8 minutes to pull during deployments, causing SLA violations. What is the most impactful fix?", scenario_context: "Deployments are consistently missing your 2-minute SLA.", options: ["Use a faster internet connection", "Implement multi-stage builds to reduce image size by 60-80%", "Increase Kubernetes node count", "Use a different container registry"], correct_answer_index: 1, explanation: "Multi-stage builds typically reduce AI container sizes from 8-12GB to 1-2GB, cutting pull times from 8+ minutes to under 90 seconds — directly fixing the SLA issue." },
            { question_text: "An audit finds your production S3 buckets containing model artifacts are publicly accessible. What immediate actions do you take?", scenario_context: "Security audit reveals public S3 buckets with proprietary AI models.", options: ["Change bucket names", "Enable S3 Block Public Access, add bucket policies with explicit Deny, enable CloudTrail logging, and run GuardDuty to check if data was accessed", "Delete and recreate the buckets", "Add passwords to the bucket"], correct_answer_index: 1, explanation: "Immediate response: Block Public Access, add explicit-deny bucket policies, enable audit logging to understand what was accessed, and use GuardDuty to detect any ongoing exfiltration." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "What is Infrastructure as Code (IaC)?", scenario_context: "Explaining IaC to a cloud infrastructure newcomer.", options: ["Writing application code in the cloud", "Defining all infrastructure in version-controlled code files", "Using the cloud console to provision resources", "Documentation for cloud systems"], correct_answer_index: 1, explanation: "IaC means defining all cloud infrastructure declaratively in version-controlled code, enabling reproducibility, auditability, and automated provisioning." },
        { question_text: "Why are spot/preemptible instances appropriate for ML training but not inference?", scenario_context: "Architecting a cost-optimized AI platform.", options: ["Training is more expensive", "Training can checkpoint and restart; inference serving cannot tolerate interruption", "Spot instances are faster", "Preemptible instances have better GPUs"], correct_answer_index: 1, explanation: "ML training can be designed to checkpoint progress and resume after interruption; real-time inference requires continuous availability, making spot instances inappropriate." },
        { question_text: "What does 'stateful' mean in the context of VPC Security Groups?", scenario_context: "Designing network security for an AI API service.", options: ["Security Groups store data", "Return traffic for allowed connections is automatically permitted without explicit rules", "Security Groups use databases", "Rules are permanent and can't be changed"], correct_answer_index: 1, explanation: "Stateful means Security Groups track connection state — if outbound traffic is allowed, the corresponding inbound return traffic is automatically allowed." },
        { question_text: "What Terraform command shows infrastructure changes without executing them?", scenario_context: "Before making changes to a production AI cluster.", options: ["terraform apply --dry-run", "terraform plan", "terraform validate", "terraform show"], correct_answer_index: 1, explanation: "terraform plan compares current state with desired state and shows exactly what will change without making any modifications — essential before any production change." },
        { question_text: "Which base image should production GPU AI containers use?", scenario_context: "Building a production-ready inference container for a computer vision model.", options: ["nvidia/cuda:latest (largest available)", "ubuntu:22.04 without CUDA", "nvidia/cuda:12.2-cudnn8-runtime-ubuntu22.04 (runtime, not devel)", "python:3.11-slim only"], correct_answer_index: 2, explanation: "The runtime CUDA image contains only what's needed for inference — cuDNN and CUDA runtime libraries — while the devel image adds gigabytes of build tools unnecessary in production." },
        { question_text: "What is the purpose of a VPC private endpoint for S3?", scenario_context: "Your AI training cluster downloads large datasets from S3 repeatedly.", options: ["Makes S3 faster by using SSD", "Keeps traffic on the AWS backbone network without traversing the public internet", "Provides a static IP for S3", "Enables S3 versioning"], correct_answer_index: 1, explanation: "Private endpoints (VPC endpoints) route traffic between your VPC and S3 through the AWS backbone, improving security by keeping data off the public internet and often reducing transfer costs." },
        { question_text: "What does the Terraform 'state file' represent?", scenario_context: "Explaining Terraform internals to a new team member.", options: ["The .tf configuration files", "Terraform's record of current real-world infrastructure state", "The deployment history log", "A backup of the cloud console"], correct_answer_index: 1, explanation: "The state file is Terraform's memory — it maps your configuration to real infrastructure resources, enabling Terraform to calculate what changes are needed on subsequent applies." },
        { question_text: "What security tool should you run in your Docker CI pipeline?", scenario_context: "Setting up a secure container build pipeline for AI model serving.", options: ["Docker Desktop only", "Trivy or Snyk for automated image vulnerability scanning", "Manual code review only", "AWS Inspector after deployment"], correct_answer_index: 1, explanation: "Trivy and Snyk scan container images for known CVEs in OS packages and Python dependencies — running in CI prevents vulnerable images from ever reaching production." },
        { question_text: "How should a Kubernetes pod authenticate with AWS Secrets Manager without hardcoded credentials?", scenario_context: "Implementing secure secret access for a model serving pod.", options: ["Mount AWS credentials as Kubernetes Secrets", "Use IRSA — IAM Roles for Service Accounts — for keyless authentication", "Set AWS_ACCESS_KEY_ID in environment variables", "Pass credentials via ConfigMap"], correct_answer_index: 1, explanation: "IRSA allows pods to assume IAM roles via OIDC federation, obtaining short-lived credentials dynamically — eliminating the need to store long-lived AWS credentials anywhere." },
        { question_text: "What is the primary purpose of AWS GuardDuty in an AI cloud environment?", scenario_context: "Presenting your security architecture to a CISO.", options: ["Scanning code for vulnerabilities", "Automated threat detection using ML to identify anomalous API calls, compromised credentials, and data exfiltration", "Managing IAM permissions", "Encrypting S3 buckets"], correct_answer_index: 1, explanation: "GuardDuty continuously analyzes CloudTrail API events, VPC flow logs, and DNS logs using ML to detect threats — it's your automated security analyst running 24/7." },
        { question_text: "What is 'container image tag hygiene' and why does it matter for AI systems?", scenario_context: "Your container registry is consuming $2,000/month in storage costs.", options: ["Naming containers clearly", "Versioning strategy, lifecycle policies, and cleanup of old images to control storage costs and maintain traceability", "Using lowercase tag names", "Only using official base images"], correct_answer_index: 1, explanation: "AI containers can be gigabytes each. Without lifecycle policies deleting old images and consistent versioning, registries accumulate terabytes of unused images costing thousands monthly." },
        { question_text: "You need to deploy the same AI infrastructure across 8 AWS regions. What Terraform feature enables this without duplicating code?", scenario_context: "Global AI product expansion requiring identical infrastructure in 8 regions.", options: ["Copy-paste the Terraform files 8 times", "Reusable Terraform modules parameterized with region variables", "Use CloudFormation StackSets instead", "Deploy manually in each region"], correct_answer_index: 1, explanation: "Terraform modules encapsulate infrastructure patterns that can be instantiated multiple times with different variable values — one module definition, 8 regional deployments." },
        { question_text: "What happens if an auto-scaling group scales out aggressively but has no scale-in policy?", scenario_context: "Your AI service traffic drops 90% but costs remain high.", options: ["Instances automatically terminate when idle", "Instances remain running and costs stay high even when traffic drops", "AWS automatically terminates excess instances", "The service crashes"], correct_answer_index: 1, explanation: "Without a scale-in policy (or with overly conservative cooldowns), instances stay running long after traffic drops — the most common cause of unexpected cloud cost overruns." },
        { question_text: "What is the recommended approach to handle multiple Terraform environments (dev/staging/prod)?", scenario_context: "You accidentally applied staging changes to production last week.", options: ["Use one shared state file for all environments", "Separate state backends per environment, with Atlantis or Terraform Cloud for PR-based workflows", "Use environment variables to switch contexts", "Apply changes manually in each environment"], correct_answer_index: 1, explanation: "Separate state backends per environment plus PR-based workflows (Atlantis/TF Cloud) ensure no cross-environment contamination and require code review before any production change." },
        { question_text: "What is the risk of using 'latest' as your container image tag in production?", scenario_context: "Your deployment config uses image: my-model-server:latest", options: ["Latest images are larger", "Non-deterministic deployments — 'latest' changes with every push, making rollbacks and debugging impossible", "Latest images are slower", "Cloud providers charge more for latest tags"], correct_answer_index: 1, explanation: "'latest' is a mutable pointer — each push overwrites it. In production this means you can't reliably roll back to a specific version or know exactly what code is running." },
        { question_text: "What is the difference between IAM Roles and IAM Users in AWS?", scenario_context: "Setting up access for your AI training service.", options: ["Roles are for humans, users are for services", "Users are long-term identities; Roles are temporary identities assumed by services or users", "They are identical concepts", "Roles have more permissions than users"], correct_answer_index: 1, explanation: "IAM Users have long-term credentials (access keys) — appropriate for human engineers. IAM Roles are assumed temporarily with short-lived tokens — the correct choice for services, EC2, Lambda, and EKS workloads." },
        { question_text: "What is 'VPC Flow Logs' and why are they important for AI security?", scenario_context: "Investigating a potential data exfiltration incident from your training cluster.", options: ["Logs of application errors", "Records of all IP traffic to/from network interfaces in your VPC", "Billing logs for VPC usage", "CloudTrail API call logs"], correct_answer_index: 1, explanation: "VPC Flow Logs record source/destination IPs, ports, protocols, and bytes transferred — essential for investigating data exfiltration, lateral movement, and unexpected network connections from AI workloads." },
        { question_text: "How does 'Workload Identity' on GCP differ from hardcoded service account keys?", scenario_context: "Migrating from service account keys to Workload Identity for your GKE AI workloads.", options: ["Workload Identity is slower", "Workload Identity provides keyless authentication via OIDC — no static JSON key files that can be stolen", "They are functionally identical", "Service account keys are more secure"], correct_answer_index: 1, explanation: "Workload Identity federates Kubernetes service accounts with GCP service accounts using OIDC tokens — no JSON key files exist to leak, rotate, or accidentally commit to Git." },
        { question_text: "What is the recommended Docker base image strategy to minimize attack surface in AI production containers?", scenario_context: "Security hardening review of your model serving containers.", options: ["Use ubuntu:latest for maximum compatibility", "Use distroless or minimal runtime images, removing all tools not needed at runtime", "Use the official Python image with all packages", "Use Alpine for all AI containers"], correct_answer_index: 1, explanation: "Distroless images contain only the application and its runtime dependencies — no shell, no package manager, no unnecessary tools. This eliminates most CVE exposure and is Google's recommended production container approach." },
        { question_text: "What Terraform resource block creates an S3 bucket with versioning and encryption?", scenario_context: "Writing Terraform to create a secure model artifact bucket.", options: ["resource 'aws_bucket' with config block", "resource 'aws_s3_bucket' with aws_s3_bucket_versioning and aws_s3_bucket_server_side_encryption_configuration resources", "A single aws_storage resource", "Using data blocks only"], correct_answer_index: 1, explanation: "In modern Terraform AWS provider, S3 bucket features (versioning, encryption, public access block) are separate resources attached to the main aws_s3_bucket resource — enabling fine-grained control and lifecycle management." }
      ]
    },
    {
      title: "Module 2: Kubernetes for AI — Orchestrating Production AI Workloads",
      description: "Kubernetes is the operating system of the cloud. Master cluster architecture, AI-specific workload patterns, autoscaling, and production operations for AI systems.",
      order_index: 1,
      videos: [
        {
          title: "2.1 Kubernetes Architecture: Control Plane, Nodes, and the AI Workload Model",
          description: "Deep dive into Kubernetes internals and how AI workloads — training jobs, inference servers, batch pipelines — map to Kubernetes primitives.",
          order_index: 0,
          lessonScript: {
            mainPoints: [
              "Kubernetes is a distributed system for automating deployment, scaling, and management of containerized workloads. Its control plane consists of the API Server (single source of truth, all communication goes through it), etcd (distributed key-value store for all cluster state), Controller Manager (runs reconciliation loops), and Scheduler (assigns pods to nodes). Worker nodes run kubelet (agent), kube-proxy (networking), and your actual containers via the container runtime.",
              "For AI workloads, nodes are not interchangeable. You'll configure node pools with different instance types: GPU node pools (g4dn.xlarge, A100s) for training and inference, CPU node pools for preprocessing and serving lightweight models, and high-memory pools for large embedding operations. Use node labels (node.kubernetes.io/gpu=true) and nodeSelector or node affinity rules to schedule AI pods on appropriate hardware.",
              "The four primary Kubernetes workload types for AI: Deployments (long-running model servers with rolling updates), Jobs (one-off training runs that complete and terminate), CronJobs (scheduled batch inference or retraining), and StatefulSets (distributed training with persistent identity like Ray clusters or PyTorch DDP). Each has different lifecycle management and resource behavior.",
              "Resource requests and limits are critical for AI workloads. Requests (what Kubernetes uses for scheduling) and limits (what the runtime enforces) must be set precisely. For GPU: nvidia.com/gpu: 1 as both request and limit — GPU resources are non-divisible. For memory: set requests at 80% of expected usage, limits at 110%, to prevent OOMKills that interrupt training jobs mid-run.",
              "The Kubernetes scheduler's bin-packing algorithm places pods to maximize node utilization. For AI clusters with expensive GPU nodes, use Pod Anti-affinity to spread replicas across nodes for HA, and taints/tolerations to ensure only AI workloads land on GPU nodes (preventing cost inefficiency from non-GPU workloads consuming GPU node capacity)."
            ]
          },
          questions: [
            { question_text: "What is the role of the Kubernetes API Server?", scenario_context: "Explaining Kubernetes architecture to a new team member.", options: ["It runs all container workloads", "It is the single source of truth — all cluster communication goes through it", "It manages DNS resolution", "It monitors container health"], correct_answer_index: 1, explanation: "The API Server is Kubernetes' central communication hub — all operations (kubectl commands, controller reads/writes, kubelet reports) go through it, and it validates/persists state to etcd." },
            { question_text: "What Kubernetes workload type is appropriate for a one-off ML training run?", scenario_context: "You need to run a 48-hour BERT fine-tuning job that should terminate when complete.", options: ["Deployment", "Job", "DaemonSet", "StatefulSet"], correct_answer_index: 1, explanation: "Kubernetes Jobs are designed for finite workloads — they create pods, run to completion, and terminate with a success/failure record. Perfect for ML training runs." },
            { question_text: "How do you ensure only AI workloads are scheduled on expensive GPU nodes?", scenario_context: "Non-GPU workloads are being scheduled on your $5/hour GPU instances, wasting budget.", options: ["Use resource limits only", "Apply taints to GPU nodes and tolerations to AI workloads — only pods with the toleration can schedule on tainted nodes", "Manually schedule pods to specific nodes", "Use separate Kubernetes clusters"], correct_answer_index: 1, explanation: "Taints repel pods without matching tolerations. Tainting GPU nodes with gpu=true:NoSchedule ensures only pods with the matching toleration (AI workloads) land on GPU instances." },
            { question_text: "What is the difference between resource requests and limits for Kubernetes GPU allocations?", scenario_context: "Setting resource configs for model training pods.", options: ["They are the same for GPUs", "For GPUs, requests and limits must be equal (1 GPU per pod) since GPUs are non-divisible resources", "Limits are optional for GPUs", "Requests must be higher than limits for GPUs"], correct_answer_index: 1, explanation: "Unlike CPU/memory which can be fractional, GPU resources in Kubernetes are integer-only and non-divisible. nvidia.com/gpu must be set as both request and limit with the same value." },
            { question_text: "What does etcd store in a Kubernetes cluster?", scenario_context: "Planning backup strategy for a production AI cluster.", options: ["Container images", "All cluster state — pod definitions, secrets, config maps, deployments — as the authoritative source of truth", "Application logs", "Node operating system files"], correct_answer_index: 1, explanation: "etcd is Kubernetes' distributed key-value store holding all cluster state. If etcd is lost without backup, the entire cluster state is unrecoverable — etcd backup is the #1 disaster recovery requirement." }
          ]
        },
        {
          title: "2.2 Helm, Operators, and Managing AI Platform Dependencies",
          description: "Production AI platforms have dozens of dependencies. Master Helm for packaging, and Kubernetes Operators for managing stateful AI infrastructure.",
          order_index: 1,
          lessonScript: {
            mainPoints: [
              "Helm is the package manager for Kubernetes. A Helm chart packages all the Kubernetes manifests for an application into a versioned, configurable artifact. Your AI platform will depend on Helm charts for NGINX ingress controller, cert-manager for TLS, Prometheus + Grafana for monitoring, ArgoCD for GitOps, and your own model serving applications. helm install, helm upgrade --atomic, and helm rollback are your daily commands.",
              "Helm values files are how you configure charts per environment. Your ai-inference chart's values.yaml defines defaults, while values-prod.yaml overrides image tags, replica counts, resource limits, and environment-specific secrets references. Never hardcode environment-specific values in charts — always parameterize. Use helm lint and helm template to validate before deploying.",
              "Kubernetes Operators extend Kubernetes with custom resource types and controllers for managing complex stateful applications. The KubeRay Operator lets you define RayCluster resources to manage distributed Ray training clusters. The Spark Operator manages SparkApplication resources. The Prometheus Operator manages PrometheusRule and ServiceMonitor resources. Operators bring the Kubernetes reconciliation model to AI infrastructure management.",
              "Kustomize (built into kubectl) is Helm's alternative for configuration management — instead of templates, it uses patches and overlays. For teams that prefer pure YAML without templating, Kustomize base/ overlays/dev/ overlays/prod/ is an elegant pattern. In practice, many teams use Helm for third-party dependencies and Kustomize for their own application manifests.",
              "Argo CD is the leading GitOps tool for Kubernetes — it continuously syncs your cluster state with your Git repository. An ArgoCD Application resource points to a Git repo and path; ArgoCD detects drift and automatically or manually reconciles. For AI platforms with dozens of microservices and model servers, ArgoCD makes cluster state auditable, version-controlled, and self-healing."
            ]
          },
          questions: [
            { question_text: "What is the primary purpose of a Helm chart?", scenario_context: "Deploying your AI model serving stack to a new Kubernetes cluster.", options: ["To run ML training jobs", "To package all Kubernetes manifests for an application into a versioned, configurable artifact", "To manage Kubernetes clusters", "To store model weights"], correct_answer_index: 1, explanation: "Helm charts bundle all the Kubernetes resources an application needs (Deployments, Services, ConfigMaps, etc.) with templating for configuration, enabling consistent deployment across environments." },
            { question_text: "What does ArgoCD do in a GitOps workflow?", scenario_context: "A team member manually edits a Deployment in production and you want to prevent this.", options: ["Runs CI pipelines", "Continuously syncs cluster state with a Git repository, detecting and reconciling drift", "Manages Helm chart versions", "Monitors container resource usage"], correct_answer_index: 1, explanation: "ArgoCD continuously compares cluster state with the desired state in Git and alerts or auto-corrects drift — making manual kubectl edits in production immediately visible and reversible." },
            { question_text: "What is a Kubernetes Operator?", scenario_context: "You need to manage a distributed Ray training cluster as a first-class Kubernetes resource.", options: ["An operations team member who manages Kubernetes", "A pattern extending Kubernetes with custom resource types and controllers for managing complex applications", "A tool for scaling Kubernetes clusters", "A security audit tool for Kubernetes"], correct_answer_index: 1, explanation: "Operators implement the Kubernetes reconciliation pattern for complex stateful applications — the KubeRay Operator makes distributed Ray clusters manageable via standard kubectl commands." },
            { question_text: "What does 'helm upgrade --atomic' do?", scenario_context: "Deploying a new version of your model server in production.", options: ["Upgrades Helm itself", "Deploys the new version and automatically rolls back if the upgrade fails", "Forces an immediate upgrade ignoring health checks", "Upgrades all charts simultaneously"], correct_answer_index: 1, explanation: "--atomic makes Helm rollback to the previous release automatically if the upgrade fails (pods don't become ready, health checks fail) — preventing broken deployments from staying in production." },
            { question_text: "What is the recommended approach for configuring a Helm chart differently per environment?", scenario_context: "You need different resource limits and replica counts in dev vs. production.", options: ["Hardcode production values in the main values.yaml", "Use separate values files (values-dev.yaml, values-prod.yaml) that override base values", "Create separate Helm charts per environment", "Use environment variables in the chart templates"], correct_answer_index: 1, explanation: "Separate values files per environment enable the same chart to be deployed with environment-appropriate configuration without modifying chart templates — enabling DRY infrastructure code." }
          ]
        },
        {
          title: "2.3 Kubernetes Autoscaling for AI: HPA, VPA, KEDA, and Cluster Autoscaler",
          description: "AI workloads have unique scaling patterns — bursty inference traffic, long training jobs, and scheduled batch workloads. Master every autoscaling mechanism.",
          order_index: 2,
          lessonScript: {
            mainPoints: [
              "Horizontal Pod Autoscaler (HPA) scales the number of pod replicas based on metrics. For AI inference, configure HPA on custom metrics like requests-per-second or GPU utilization (via KEDA or Prometheus Adapter) rather than CPU — CPU often stays low while GPUs are fully loaded. HPA scaleDown stabilization windows (300s default) prevent thrashing during fluctuating load.",
              "Vertical Pod Autoscaler (VPA) automatically adjusts resource requests and limits based on observed usage. For AI training jobs with poorly understood memory requirements, VPA in Recommendation mode gives you sizing suggestions without making changes. In Auto mode, it evicts and reschedules pods with updated resources — powerful but disruptive. Use VPA for right-sizing, HPA for scaling.",
              "KEDA (Kubernetes Event-Driven Autoscaling) extends HPA with 50+ scalers: scale inference pods based on message queue depth (SQS, Kafka, RabbitMQ), HTTP request rate, database query count, or even custom Prometheus queries. For async AI workloads (background inference, batch scoring), KEDA is transformative — scale to zero when queues are empty, scale out when messages arrive.",
              "Cluster Autoscaler adds and removes worker nodes based on pod scheduling status. When a pod is Pending (can't be scheduled due to insufficient resources), Cluster Autoscaler provisions a new node from your node group. When nodes are underutilized for 10+ minutes, it safely drains and terminates them. Configure separate node groups for GPU and CPU to avoid GPU nodes being used for CPU-only workloads.",
              "Karpenter (AWS-native) is the modern evolution of Cluster Autoscaler — it directly provisions EC2 instances matching pod requirements in seconds rather than minutes. For AI workloads with spot instance requirements, GPU instance diversity (p3 vs p4d vs g5), and launch template customization, Karpenter's NodePool and EC2NodeClass resources give fine-grained control impossible with traditional cluster autoscaler."
            ]
          },
          questions: [
            { question_text: "Why is CPU utilization a poor autoscaling metric for GPU AI inference?", scenario_context: "Your inference service is at 100% GPU utilization but HPA isn't scaling.", options: ["CPU metrics are too slow to update", "AI inference primarily uses GPU, which can be 100% loaded while CPU stays low — HPA on CPU won't trigger", "HPA doesn't work with GPU workloads", "CPU autoscaling is disabled for AI services"], correct_answer_index: 1, explanation: "GPU workloads use CPU mainly for preprocessing — GPUs can be fully saturated while CPU stays at 10-20%. Autoscaling on GPU utilization or requests-per-second is far more accurate for AI inference." },
            { question_text: "What is KEDA's primary advantage over standard HPA for AI batch workloads?", scenario_context: "You run batch AI inference jobs triggered by SQS messages and want to scale to zero when idle.", options: ["KEDA is faster than HPA", "KEDA scales based on external event sources (queue depth, HTTP traffic) enabling scale-to-zero for event-driven AI workloads", "KEDA works with more cloud providers", "KEDA requires less configuration"], correct_answer_index: 1, explanation: "KEDA's 50+ event source scalers enable scale-to-zero for event-driven workloads — your batch inference fleet consumes no resources when SQS is empty, dramatically cutting idle costs." },
            { question_text: "What is the VPA 'Recommendation' mode useful for?", scenario_context: "You're unsure what CPU and memory limits to set for a new AI preprocessing service.", options: ["Automatically updating resource limits in production", "Observing actual resource usage and providing sizing recommendations without making changes", "Scaling pods horizontally", "Restarting pods that use too much memory"], correct_answer_index: 1, explanation: "VPA in Recommendation mode analyzes actual resource consumption over time and suggests optimal request/limit values without taking any action — safe for production right-sizing guidance." },
            { question_text: "What triggers Cluster Autoscaler to add a new node?", scenario_context: "Pods are stuck in Pending state during a traffic spike.", options: ["High CPU utilization on existing nodes", "Pod remains in Pending state because no existing node has sufficient resources to schedule it", "A timer expires", "An engineer manually requests it"], correct_answer_index: 1, explanation: "Cluster Autoscaler watches for Pending pods — pods that can't be scheduled because no node has sufficient resources. It then provisions a new node from the appropriate node group." },
            { question_text: "Why is Karpenter preferred over Cluster Autoscaler for modern AWS AI workloads?", scenario_context: "Your ML training jobs take 8 minutes to start while waiting for new GPU nodes.", options: ["Karpenter is free while Cluster Autoscaler costs money", "Karpenter provisions EC2 instances in seconds via direct API calls, supports spot diversification across instance families, and has richer NodePool configuration", "Karpenter works without Kubernetes", "Cluster Autoscaler has been deprecated"], correct_answer_index: 1, explanation: "Karpenter directly calls EC2 APIs to provision instances in ~30 seconds (vs. Cluster Autoscaler's 3-5 minutes via ASG), supports spot instance diversification across families, and offers NodePool configurations for AI workload-specific node requirements." }
          ]
        },
        {
          title: "2.4 Service Mesh, Networking, and Traffic Management for AI APIs",
          description: "Production AI APIs require sophisticated traffic management: canary deployments, A/B testing model versions, circuit breaking, and observability at the network layer.",
          order_index: 3,
          lessonScript: {
            mainPoints: [
              "A service mesh (Istio, Linkerd) adds a sidecar proxy (Envoy) to every pod, creating an mTLS-encrypted, observable network fabric between services. For AI platforms with many microservices (feature servers, model servers, inference routers), the service mesh provides: automatic mTLS encryption between services, fine-grained traffic routing, circuit breaking, retry logic, and request-level observability — all without changing application code.",
              "Canary deployments for AI models: you deploy model-server-v2 alongside model-server-v1, then use Istio VirtualService to send 5% of traffic to v2. Monitor latency, error rate, and business metrics. If healthy, progressively shift — 10%, 25%, 50%, 100%. If anomalies appear, instant rollback by updating the VirtualService weight. This is how Google, Netflix, and every AI-first company safely ships model updates without downtime.",
              "Circuit breaking prevents cascade failures in AI systems. If your ML feature store is slow or down, you don't want every inference request to hang for 30 seconds before timing out. Configure Istio DestinationRules with connectionPool limits and outlierDetection to open the circuit after N consecutive failures — fail fast, return a fallback response, and let the downstream service recover.",
              "Kubernetes Ingress and Gateway API manage external traffic into the cluster. Use NGINX Ingress or Istio Gateway for HTTP/S routing, with cert-manager for automatic TLS certificate provisioning from Let's Encrypt. For AI APIs, configure rate limiting at the ingress layer — not at the application level — to protect model serving capacity from traffic spikes and abuse.",
              "Network policies are Kubernetes' built-in firewall for pod-to-pod communication. Default-deny all: start with a NetworkPolicy that blocks all ingress and egress, then explicitly allow only required communication paths (e.g., inference pods can only talk to feature store and model registry, not directly to databases). This microsegmentation limits blast radius from any compromised AI workload."
            ]
          },
          questions: [
            { question_text: "What is the primary security benefit of a service mesh for AI microservices?", scenario_context: "Presenting your AI platform security architecture to a security team.", options: ["It replaces authentication systems", "Automatic mTLS encryption between all services without requiring application code changes", "It scans containers for vulnerabilities", "It manages IAM permissions"], correct_answer_index: 1, explanation: "Service meshes like Istio automatically provision and rotate mTLS certificates for service-to-service communication — every API call between AI microservices is encrypted and mutually authenticated, zero code changes required." },
            { question_text: "How do canary deployments enable safe AI model updates?", scenario_context: "You need to deploy a new recommendation model without risking a full production outage.", options: ["Canary means deploying to a test environment only", "Send a small percentage (5%) of production traffic to the new model, monitor metrics, and progressively increase if healthy", "Deploy the new model to all users at midnight", "Test the model only in staging for 30 days"], correct_answer_index: 1, explanation: "Canary deployments expose the new model to a controlled percentage of real production traffic, enabling real-world validation with instant rollback capability if metrics degrade." },
            { question_text: "What does circuit breaking do in an AI microservices architecture?", scenario_context: "Your feature store is experiencing latency spikes and it's causing your inference service to queue up thousands of hanging requests.", options: ["Shuts down the entire service", "Fails fast when a downstream service is unhealthy, returning immediate errors instead of hanging", "Routes traffic to a backup cloud provider", "Restarts pods automatically"], correct_answer_index: 1, explanation: "Circuit breaking detects unhealthy downstream services and 'opens the circuit' — immediately returning errors rather than letting requests hang, preventing cascade failures across your AI pipeline." },
            { question_text: "What Kubernetes resource should you configure for automated TLS certificate management?", scenario_context: "Your AI API endpoints need HTTPS with auto-renewing certificates.", options: ["Manually upload certificates to Kubernetes Secrets yearly", "cert-manager with Let's Encrypt ClusterIssuer for automated certificate provisioning and renewal", "Self-signed certificates stored in ConfigMaps", "Pay for certificates manually from a CA"], correct_answer_index: 1, explanation: "cert-manager automates TLS certificate lifecycle — it provisions certificates from Let's Encrypt, stores them as Kubernetes Secrets, and automatically renews them 30 days before expiry." },
            { question_text: "What does a Kubernetes NetworkPolicy 'default-deny' configuration do?", scenario_context: "Setting up microsegmentation for your AI platform's pods.", options: ["Blocks all external internet traffic", "Blocks all pod-to-pod communication by default, requiring explicit allow rules for each required communication path", "Prevents pods from being created", "Disables Kubernetes DNS"], correct_answer_index: 1, explanation: "A default-deny NetworkPolicy blocks all ingress and egress traffic between pods by default. You then add explicit allow rules only for required communication paths — true microsegmentation." }
          ]
        },
        {
          title: "2.5 Observability for AI: Prometheus, Grafana, and OpenTelemetry",
          description: "You can't improve what you can't measure. Build production-grade observability covering metrics, logs, traces, and AI-specific signals like model latency and prediction drift.",
          order_index: 4,
          lessonScript: {
            mainPoints: [
              "The three pillars of observability for AI systems: Metrics (Prometheus) — quantitative measurements over time like inference latency percentiles, GPU utilization, request throughput, error rate, model prediction distribution; Logs (structured JSON to stdout, aggregated by FluentBit/Loki or ELK) — audit trail for every prediction, input validation error, and system event; Traces (OpenTelemetry) — end-to-end request journey from API gateway → feature store → model server → post-processing.",
              "Prometheus scrapes metrics from your services every 15 seconds, storing time-series data in its TSDB. Configure ServiceMonitors (Prometheus Operator) to auto-discover AI services. Critical AI metrics to expose via /metrics endpoint: inference_latency_seconds (histogram — gives p50/p95/p99), predictions_total (counter by model version and label), model_load_time_seconds, feature_retrieval_latency, and gpu_utilization_percent.",
              "Grafana dashboards are your operational command center. Build dashboards for: the Golden Signals (latency, traffic, errors, saturation) per AI service; GPU utilization heatmaps per node; model performance by version (accuracy proxy metrics); and infrastructure cost per AI workload. Use Grafana alerts wired to PagerDuty or Slack — your on-call engineer should know about problems before users do.",
              "OpenTelemetry (OTel) is the CNCF standard for distributed tracing. Instrument your AI pipeline with OTel SDK: every request gets a trace_id that follows it from API gateway through feature retrieval, model inference, postprocessing, and response. When a p99 latency alert fires, traces let you identify exactly where in the pipeline the slowdown occurred — feature store timeout, model warmup, or database query.",
              "Model-specific monitoring goes beyond infrastructure: track prediction score distribution over time (drift detection), input feature distribution (data drift), and business outcome correlation (model drift). Tools like Evidently AI, Arize, and Whylabs integrate with Prometheus to expose these signals as metrics. Set up alerting when prediction distribution shifts more than 2 standard deviations — that's your early warning system for model degradation."
            ]
          },
          questions: [
            { question_text: "What are the three pillars of observability for AI systems?", scenario_context: "Presenting your observability strategy to the platform team.", options: ["Monitoring, alerting, and dashboards", "Metrics, logs, and traces", "CPU, memory, and disk utilization", "Testing, staging, and production"], correct_answer_index: 1, explanation: "The three observability pillars are: Metrics (time-series quantitative data), Logs (discrete event records), and Traces (end-to-end request journeys) — each providing distinct insights into system behavior." },
            { question_text: "Which Prometheus metric type is correct for AI inference latency?", scenario_context: "You need to track p95 inference latency to measure SLA compliance.", options: ["Counter — counts total inferences", "Gauge — current latency value", "Histogram — enables percentile calculations (p50/p95/p99)", "Summary — for rare events"], correct_answer_index: 2, explanation: "Histograms bucket observations into ranges, enabling calculation of percentile latencies (p50, p95, p99) — essential for SLA monitoring. Counters and gauges can't give you percentile distributions." },
            { question_text: "What is OpenTelemetry tracing used for in AI pipelines?", scenario_context: "Your p99 inference latency SLA is being violated but you can't tell which component is slow.", options: ["Counting total requests", "Following a request end-to-end through distributed components to identify where latency originates", "Monitoring GPU memory", "Managing Kubernetes pods"], correct_answer_index: 1, explanation: "Distributed traces attach a trace_id to every request, recording timing at each service hop — letting you identify whether latency comes from feature retrieval, model loading, inference, or post-processing." },
            { question_text: "What is 'prediction drift' in the context of AI monitoring?", scenario_context: "Your model's business metrics have degraded but accuracy metrics look fine.", options: ["Model weights changing during serving", "The model's prediction score distribution shifting over time, indicating potential model staleness or data changes", "GPU temperature increasing", "Container image version changes"], correct_answer_index: 1, explanation: "Prediction drift occurs when the distribution of model outputs changes over time — often the first signal that input data characteristics have changed and the model needs retraining." },
            { question_text: "What Prometheus Operator resource auto-discovers services to scrape metrics from?", scenario_context: "You've deployed 15 AI microservices and need Prometheus to scrape all of them automatically.", options: ["PrometheusRule", "ServiceMonitor", "AlertManager", "RecordingRule"], correct_answer_index: 1, explanation: "ServiceMonitor resources define how Prometheus should discover and scrape metrics from Kubernetes Services matching specified labels — enabling auto-discovery of new AI services without manual Prometheus config updates." }
          ]
        },
        {
          title: "2.6 Module 2 Assessment: Kubernetes for AI Production",
          description: "Comprehensive assessment covering Kubernetes architecture, scaling, service mesh, and observability for AI workloads.",
          order_index: 5,
          lessonScript: {
            mainPoints: [
              "Kubernetes orchestrates AI workloads through pods, deployments, jobs, and statefulsets — each designed for specific AI workload patterns.",
              "Autoscaling AI systems requires HPA on custom metrics, KEDA for event-driven scaling, VPA for right-sizing, and Cluster Autoscaler/Karpenter for node provisioning.",
              "Service meshes provide mTLS, canary deployments, circuit breaking, and traffic management essential for production AI APIs.",
              "Observability requires metrics (Prometheus), logs, and traces (OpenTelemetry) — plus AI-specific model monitoring for drift detection.",
              "These Kubernetes patterns are the foundation for deploying production AI systems at any scale."
            ]
          },
          questions: [
            { question_text: "A model training Job has been running for 72 hours and you need to kill it cleanly. What kubectl command achieves this without data corruption?", scenario_context: "A training job needs to be terminated gracefully to preserve checkpoints.", options: ["kubectl delete pod training-job", "kubectl delete job training-job --grace-period=300 after ensuring the pod's preStop hook saves checkpoints", "kubectl kill training-job", "Terminate the node the pod runs on"], correct_answer_index: 1, explanation: "Deleting the Job with a grace period allows the pod's preStop lifecycle hook and terminationGracePeriodSeconds to run, giving the training process time to save checkpoints before SIGKILL." },
            { question_text: "Your inference Deployment has 10 replicas and you want to ensure maximum 2 pods are unavailable during a rolling update. What Kubernetes field controls this?", scenario_context: "Configuring zero-downtime deployment strategy for an AI model server.", options: ["minReadySeconds", "maxUnavailable in the RollingUpdate strategy", "terminationGracePeriodSeconds", "revisionHistoryLimit"], correct_answer_index: 1, explanation: "spec.strategy.rollingUpdate.maxUnavailable controls how many pods can be unavailable during a rolling update — setting to 2 ensures at least 8/10 replicas serve traffic at all times." },
            { question_text: "You need to run a GPU training job every Sunday at midnight. What Kubernetes resource handles this?", scenario_context: "Automating weekly model retraining on fresh data.", options: ["Deployment with a time-based HPA", "CronJob resource defining the schedule and Job template", "DaemonSet with time check", "StatefulSet with time configuration"], correct_answer_index: 1, explanation: "Kubernetes CronJob creates Job objects on a defined schedule (cron format). The CronJob owns the Job template defining the GPU training pod spec, schedule, concurrency policy, and history limits." },
            { question_text: "Istio reports a 30% error rate on requests to your feature store from the inference service. You configure outlierDetection in the DestinationRule. What happens next?", scenario_context: "Investigating cascade failures in your AI serving pipeline.", options: ["Istio reroutes traffic to a different cluster", "Istio opens the circuit after the configured consecutive error threshold, fast-failing new requests until the feature store recovers", "Istio scales up the feature store automatically", "Istio logs the errors and takes no action"], correct_answer_index: 1, explanation: "Istio's outlierDetection (circuit breaking) monitors error rate and ejection criteria — when thresholds are exceeded, it opens the circuit, immediately failing requests to the unhealthy instance rather than letting them hang." },
            { question_text: "Your Grafana alert fires: model prediction score distribution p50 has shifted from 0.85 to 0.62 over the last 7 days. What does this indicate and what action do you take?", scenario_context: "Responding to a model monitoring alert in production.", options: ["Infrastructure problem — restart the pods", "Model drift — the model's prediction distribution has shifted, investigate input data changes and potentially trigger retraining", "A Prometheus metric collection bug", "Normal variation that can be ignored"], correct_answer_index: 1, explanation: "A sustained shift in prediction score distribution is a classic model drift signal — input feature distributions have likely changed. Investigate data pipeline changes, compare current input distributions against training baselines, and trigger retraining with fresh data if confirmed." }
          ]
        }
      ],
      endQuizQuestions: [
        { question_text: "What Kubernetes object type runs a containerized ML training process that must complete exactly once?", scenario_context: "Designing a Kubernetes job spec for a fine-tuning task.", options: ["Deployment", "Job", "DaemonSet", "ReplicaSet"], correct_answer_index: 1, explanation: "Jobs are Kubernetes objects designed for finite workloads. They create pods, track completion, and provide success/failure records — ideal for ML training runs." },
        { question_text: "What does Karpenter do differently than Cluster Autoscaler?", scenario_context: "GPU nodes are taking 8 minutes to provision, delaying training job starts.", options: ["Karpenter replaces HPA", "Karpenter provisions EC2 instances directly in ~30 seconds vs. 3-5 minutes for Cluster Autoscaler via ASG", "Karpenter manages pod scheduling", "Karpenter is a monitoring tool"], correct_answer_index: 1, explanation: "Karpenter bypasses Auto Scaling Groups to provision EC2 instances directly, reducing node provisioning from 3-5 minutes to ~30 seconds while supporting richer NodePool configurations for GPU diversity." },
        { question_text: "What Helm flag makes a deployment automatically rollback if pods don't become healthy?", scenario_context: "Deploying a new model version to production with automatic safety net.", options: ["--wait", "--atomic", "--force", "--cleanup-on-fail"], correct_answer_index: 1, explanation: "--atomic combines --wait (waits for pods to be ready) with automatic rollback if the timeout is exceeded or any resource fails — your safety net for production deployments." },
        { question_text: "A KEDA ScaledObject scales your inference deployment based on SQS queue depth. The queue reaches 10,000 messages. What determines the max number of pods KEDA creates?", scenario_context: "Configuring KEDA for a batch inference workload with cost constraints.", options: ["The queue size", "The maxReplicaCount field in the ScaledObject spec", "Kubernetes cluster node count", "The SQS message retention period"], correct_answer_index: 1, explanation: "KEDA ScaledObject's maxReplicaCount caps pod count regardless of queue depth — this is your cost guard preventing unbounded scale-out during unexpected traffic spikes." },
        { question_text: "What is the purpose of Istio's VirtualService in model canary deployments?", scenario_context: "Rolling out a new recommendation model to 10% of traffic.", options: ["It creates new pod replicas", "It defines traffic routing rules — directing X% to v1 and Y% to v2 based on weights", "It manages TLS certificates", "It controls pod autoscaling"], correct_answer_index: 1, explanation: "VirtualService defines traffic routing rules for a Kubernetes service — weight-based routing (95% to v1, 5% to v2) is the mechanism for progressive canary releases of new model versions." },
        { question_text: "What Prometheus metric type tracks the total number of predictions made since service start?", scenario_context: "Monitoring prediction throughput for SLA reporting.", options: ["Gauge", "Histogram", "Counter", "Summary"], correct_answer_index: 2, explanation: "Counters only increase (they reset to 0 on restart). They're perfect for tracking cumulative totals like prediction count, request count, and error count — use rate() in PromQL to get per-second rates." },
        { question_text: "Your AI inference pod has resource requests of 4 CPU, 16Gi memory. The Kubernetes scheduler reports no nodes available. What do you check first?", scenario_context: "Pods stuck in Pending state after a deployment.", options: ["Pod log errors", "Node capacity — whether any node has 4+ CPU and 16Gi+ memory available after existing pod requests", "Docker image availability", "Network connectivity"], correct_answer_index: 1, explanation: "Kubernetes schedules based on resource requests, not actual usage. If no node has sufficient remaining requested capacity, pods stay Pending. kubectl describe pod shows 'insufficient cpu/memory' in Events." },
        { question_text: "What is the operational benefit of ArgoCD's 'auto-sync' mode for an AI platform?", scenario_context: "Managing 30 AI microservices across dev/staging/prod clusters.", options: ["It automatically writes code changes", "It continuously reconciles cluster state with Git, automatically applying any configuration drift back to desired state", "It scales pods automatically", "It deploys models from MLflow"], correct_answer_index: 1, explanation: "ArgoCD auto-sync means any manual kubectl changes in production are immediately reverted to match Git — enforcing GitOps and making your cluster state an accurate reflection of the repository." },
        { question_text: "What happens when Istio's circuit breaker detects an unhealthy pod in your inference deployment?", scenario_context: "One of your 5 model server replicas starts returning 500 errors 80% of the time.", options: ["All pods are restarted", "The unhealthy pod is ejected from the load balancing pool for a configurable time, routing traffic only to healthy replicas", "The entire service is taken offline", "Istio sends a PagerDuty alert"], correct_answer_index: 1, explanation: "Outlier detection ejects unhealthy instances from the load balancing pool for a configurable penalty period — traffic goes only to healthy replicas while the ejected pod's Kubernetes health checks work to recover it." },
        { question_text: "What does 'kubectl top pods' show and why is it different from Prometheus metrics?", scenario_context: "Investigating high memory usage in a model serving pod.", options: ["It shows the same data as Prometheus", "It shows current actual resource consumption (from metrics-server) — unlike requests/limits which are configured values, not measured usage", "It shows network traffic statistics", "It shows container image sizes"], correct_answer_index: 1, explanation: "kubectl top pods shows real-time CPU/memory consumption from metrics-server, distinct from configured requests/limits. It's your quick 'what is actually being used right now' view before diving into Prometheus for historical analysis." }
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

    // Create course
    const courseTranslations = {
      es: { title: "Ingeniero de Nube IA", description: "Domina la infraestructura de IA nativa en la nube en AWS, Azure y GCP." },
      fr: { title: "Ingénieur Cloud IA", description: "Maîtrisez l'infrastructure IA native du cloud sur AWS, Azure et GCP." },
      de: { title: "KI-Cloud-Ingenieur", description: "Meistern Sie cloud-native KI-Infrastruktur auf AWS, Azure und GCP." },
      zh: { title: "AI云工程师", description: "掌握AWS、Azure和GCP上的云原生AI基础设施。" },
      ar: { title: "مهندس سحابة الذكاء الاصطناعي", description: "أتقن البنية التحتية السحابية للذكاء الاصطناعي على AWS وAzure وGCP." },
      ja: { title: "AIクラウドエンジニア", description: "AWS、Azure、GCPでクラウドネイティブAIインフラをマスターする。" },
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

    // Create chapters, videos, quizzes
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
        const videoTranslations = {
          en: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
          es: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
          fr: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
          de: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
          zh: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
          ar: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
          ja: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") },
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

      // Chapter end quiz
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
      JSON.stringify({ message: "AI Cloud Engineer course created successfully", courseId: course.id }),
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
