import { motion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ArchitectureDiagramViewerProps {
  storyId: string;
  storyTitle: string;
  onClose: () => void;
}

const DIAGRAMS: Record<string, { title: string; description: string; render: () => JSX.Element }> = {
  "NEB-101": {
    title: "VPC Architecture — Public Subnets",
    description: "AWS VPC layout with public subnets, internet gateway, and route tables for Project Nebula web-facing services.",
    render: () => (
      <svg viewBox="0 0 900 520" className="w-full h-full">
        {/* AWS Cloud boundary */}
        <rect x="20" y="10" width="860" height="500" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(220, 60%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(220, 60%, 40%)">☁️ AWS Cloud — us-east-1</text>

        {/* VPC */}
        <rect x="50" y="55" width="800" height="440" rx="8" fill="hsl(220, 30%, 95%)" stroke="hsl(220, 50%, 60%)" strokeWidth="1.5" />
        <text x="70" y="80" fontSize="13" fontWeight="bold" fill="hsl(220, 50%, 40%)">VPC: 10.0.0.0/16 — nebula-prod-vpc</text>

        {/* Internet Gateway */}
        <rect x="370" y="65" width="160" height="40" rx="6" fill="hsl(35, 90%, 55%)" stroke="hsl(35, 80%, 40%)" strokeWidth="1" />
        <text x="380" y="90" fontSize="11" fontWeight="bold" fill="white">🌐 Internet Gateway</text>

        {/* Public Subnet AZ-a */}
        <rect x="80" y="130" width="340" height="340" rx="6" fill="hsl(145, 40%, 95%)" stroke="hsl(145, 50%, 50%)" strokeWidth="1.5" />
        <text x="100" y="155" fontSize="12" fontWeight="bold" fill="hsl(145, 50%, 35%)">Public Subnet — AZ us-east-1a</text>
        <text x="100" y="172" fontSize="10" fill="hsl(145, 40%, 45%)">10.0.1.0/24</text>

        {/* ALB */}
        <rect x="110" y="190" width="280" height="50" rx="6" fill="hsl(210, 70%, 50%)" stroke="hsl(210, 60%, 40%)" strokeWidth="1" />
        <text x="130" y="215" fontSize="11" fontWeight="bold" fill="white">⚖️ Application Load Balancer</text>
        <text x="130" y="230" fontSize="9" fill="hsl(210, 90%, 90%)">nebula-alb — HTTP/HTTPS listeners</text>

        {/* ECS Tasks */}
        <rect x="110" y="260" width="130" height="60" rx="5" fill="hsl(270, 50%, 55%)" stroke="hsl(270, 40%, 40%)" strokeWidth="1" />
        <text x="120" y="282" fontSize="10" fontWeight="bold" fill="white">🐳 ECS Task</text>
        <text x="120" y="296" fontSize="9" fill="hsl(270, 80%, 90%)">Auth Service</text>
        <text x="120" y="308" fontSize="8" fill="hsl(270, 70%, 85%)">Port 8080</text>

        <rect x="260" y="260" width="130" height="60" rx="5" fill="hsl(270, 50%, 55%)" stroke="hsl(270, 40%, 40%)" strokeWidth="1" />
        <text x="270" y="282" fontSize="10" fontWeight="bold" fill="white">🐳 ECS Task</text>
        <text x="270" y="296" fontSize="9" fill="hsl(270, 80%, 90%)">API Gateway</text>
        <text x="270" y="308" fontSize="8" fill="hsl(270, 70%, 85%)">Port 3000</text>

        {/* Security Group */}
        <rect x="100" y="340" width="300" height="50" rx="5" fill="hsl(0, 0%, 97%)" stroke="hsl(0, 60%, 50%)" strokeWidth="1" strokeDasharray="4,2" />
        <text x="110" y="360" fontSize="10" fontWeight="bold" fill="hsl(0, 50%, 45%)">🔒 Security Group: sg-nebula-public</text>
        <text x="110" y="375" fontSize="9" fill="hsl(0, 40%, 55%)">Inbound: 80, 443 | Outbound: All</text>

        {/* Route Table */}
        <rect x="100" y="405" width="300" height="45" rx="5" fill="hsl(45, 80%, 95%)" stroke="hsl(45, 60%, 50%)" strokeWidth="1" />
        <text x="110" y="425" fontSize="10" fontWeight="bold" fill="hsl(45, 50%, 35%)">📋 Route Table: rt-public</text>
        <text x="110" y="438" fontSize="9" fill="hsl(45, 40%, 45%)">0.0.0.0/0 → igw-xxxxx</text>

        {/* Public Subnet AZ-b */}
        <rect x="480" y="130" width="340" height="340" rx="6" fill="hsl(145, 40%, 95%)" stroke="hsl(145, 50%, 50%)" strokeWidth="1.5" />
        <text x="500" y="155" fontSize="12" fontWeight="bold" fill="hsl(145, 50%, 35%)">Public Subnet — AZ us-east-1b</text>
        <text x="500" y="172" fontSize="10" fill="hsl(145, 40%, 45%)">10.0.2.0/24</text>

        {/* NAT Gateway placeholder */}
        <rect x="510" y="190" width="280" height="50" rx="6" fill="hsl(35, 70%, 55%)" stroke="hsl(35, 60%, 40%)" strokeWidth="1" />
        <text x="530" y="215" fontSize="11" fontWeight="bold" fill="white">🔀 NAT Gateway</text>
        <text x="530" y="230" fontSize="9" fill="hsl(35, 90%, 90%)">Elastic IP: 52.xx.xx.xx</text>

        {/* Bastion */}
        <rect x="510" y="260" width="130" height="60" rx="5" fill="hsl(200, 50%, 50%)" stroke="hsl(200, 40%, 40%)" strokeWidth="1" />
        <text x="520" y="282" fontSize="10" fontWeight="bold" fill="white">🖥️ Bastion Host</text>
        <text x="520" y="296" fontSize="9" fill="hsl(200, 80%, 90%)">t3.micro</text>
        <text x="520" y="308" fontSize="8" fill="hsl(200, 70%, 85%)">SSH Port 22</text>

        {/* Redundant ECS */}
        <rect x="660" y="260" width="130" height="60" rx="5" fill="hsl(270, 50%, 55%)" stroke="hsl(270, 40%, 40%)" strokeWidth="1" />
        <text x="670" y="282" fontSize="10" fontWeight="bold" fill="white">🐳 ECS Task</text>
        <text x="670" y="296" fontSize="9" fill="hsl(270, 80%, 90%)">Auth (replica)</text>
        <text x="670" y="308" fontSize="8" fill="hsl(270, 70%, 85%)">Port 8080</text>

        {/* SG for AZ-b */}
        <rect x="500" y="340" width="300" height="50" rx="5" fill="hsl(0, 0%, 97%)" stroke="hsl(0, 60%, 50%)" strokeWidth="1" strokeDasharray="4,2" />
        <text x="510" y="360" fontSize="10" fontWeight="bold" fill="hsl(0, 50%, 45%)">🔒 Security Group: sg-nebula-public</text>
        <text x="510" y="375" fontSize="9" fill="hsl(0, 40%, 55%)">Inbound: 80, 443 | Outbound: All</text>

        {/* Arrows */}
        <line x1="450" y1="105" x2="250" y2="190" stroke="hsl(35, 70%, 50%)" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="450" y1="105" x2="650" y2="190" stroke="hsl(35, 70%, 50%)" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(35, 70%, 50%)" />
          </marker>
        </defs>
      </svg>
    )
  },
  "NEB-101b": {
    title: "VPC Architecture — Private Subnets & NAT",
    description: "Private subnet configuration with NAT gateway for internal services that need outbound internet access.",
    render: () => (
      <svg viewBox="0 0 900 480" className="w-full h-full">
        <rect x="20" y="10" width="860" height="460" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(220, 60%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(220, 60%, 40%)">☁️ AWS Cloud — us-east-1</text>

        <rect x="50" y="55" width="800" height="400" rx="8" fill="hsl(220, 30%, 95%)" stroke="hsl(220, 50%, 60%)" strokeWidth="1.5" />
        <text x="70" y="80" fontSize="13" fontWeight="bold" fill="hsl(220, 50%, 40%)">VPC: 10.0.0.0/16</text>

        {/* Public subnet with NAT */}
        <rect x="80" y="95" width="350" height="100" rx="6" fill="hsl(145, 40%, 95%)" stroke="hsl(145, 50%, 50%)" strokeWidth="1.5" />
        <text x="100" y="115" fontSize="11" fontWeight="bold" fill="hsl(145, 50%, 35%)">Public Subnet — 10.0.1.0/24</text>
        <rect x="110" y="130" width="140" height="45" rx="5" fill="hsl(35, 70%, 55%)" stroke="hsl(35, 60%, 40%)" strokeWidth="1" />
        <text x="120" y="152" fontSize="10" fontWeight="bold" fill="white">🔀 NAT Gateway</text>
        <text x="120" y="165" fontSize="8" fill="hsl(35, 90%, 90%)">EIP: 52.xx.xx.xx</text>
        <rect x="270" y="130" width="140" height="45" rx="5" fill="hsl(35, 90%, 55%)" stroke="hsl(35, 80%, 40%)" strokeWidth="1" />
        <text x="280" y="152" fontSize="10" fontWeight="bold" fill="white">🌐 IGW</text>

        {/* Private Subnet AZ-a */}
        <rect x="80" y="215" width="350" height="220" rx="6" fill="hsl(270, 30%, 95%)" stroke="hsl(270, 40%, 60%)" strokeWidth="1.5" />
        <text x="100" y="240" fontSize="12" fontWeight="bold" fill="hsl(270, 40%, 40%)">🔒 Private Subnet — AZ 1a</text>
        <text x="100" y="255" fontSize="10" fill="hsl(270, 30%, 50%)">10.0.10.0/24</text>

        <rect x="100" y="270" width="140" height="55" rx="5" fill="hsl(270, 50%, 55%)" stroke="hsl(270, 40%, 40%)" strokeWidth="1" />
        <text x="110" y="292" fontSize="10" fontWeight="bold" fill="white">🐳 Auth Service</text>
        <text x="110" y="306" fontSize="9" fill="hsl(270, 80%, 90%)">ECS Fargate</text>
        <text x="110" y="318" fontSize="8" fill="hsl(270, 70%, 85%)">10.0.10.x:8080</text>

        <rect x="260" y="270" width="140" height="55" rx="5" fill="hsl(200, 50%, 50%)" stroke="hsl(200, 40%, 40%)" strokeWidth="1" />
        <text x="270" y="292" fontSize="10" fontWeight="bold" fill="white">🗄️ RDS Primary</text>
        <text x="270" y="306" fontSize="9" fill="hsl(200, 80%, 90%)">PostgreSQL 15</text>
        <text x="270" y="318" fontSize="8" fill="hsl(200, 70%, 85%)">10.0.10.x:5432</text>

        <rect x="100" y="345" width="300" height="40" rx="5" fill="hsl(45, 80%, 95%)" stroke="hsl(45, 60%, 50%)" strokeWidth="1" />
        <text x="110" y="365" fontSize="10" fontWeight="bold" fill="hsl(45, 50%, 35%)">📋 Route: 0.0.0.0/0 → nat-gw-xxxxx</text>
        <text x="110" y="378" fontSize="9" fill="hsl(45, 40%, 45%)">10.0.0.0/16 → local</text>

        {/* Private Subnet AZ-b */}
        <rect x="480" y="215" width="350" height="220" rx="6" fill="hsl(270, 30%, 95%)" stroke="hsl(270, 40%, 60%)" strokeWidth="1.5" />
        <text x="500" y="240" fontSize="12" fontWeight="bold" fill="hsl(270, 40%, 40%)">🔒 Private Subnet — AZ 1b</text>
        <text x="500" y="255" fontSize="10" fill="hsl(270, 30%, 50%)">10.0.11.0/24</text>

        <rect x="500" y="270" width="140" height="55" rx="5" fill="hsl(270, 50%, 55%)" stroke="hsl(270, 40%, 40%)" strokeWidth="1" />
        <text x="510" y="292" fontSize="10" fontWeight="bold" fill="white">🐳 Auth Replica</text>
        <text x="510" y="306" fontSize="9" fill="hsl(270, 80%, 90%)">ECS Fargate</text>

        <rect x="660" y="270" width="140" height="55" rx="5" fill="hsl(200, 50%, 50%)" stroke="hsl(200, 40%, 40%)" strokeWidth="1" />
        <text x="670" y="292" fontSize="10" fontWeight="bold" fill="white">🗄️ RDS Standby</text>
        <text x="670" y="306" fontSize="9" fill="hsl(200, 80%, 90%)">Multi-AZ replica</text>

        {/* Arrow NAT to private */}
        <line x1="180" y1="175" x2="180" y2="215" stroke="hsl(270, 40%, 50%)" strokeWidth="2" strokeDasharray="4,2" />
        <line x1="180" y1="175" x2="580" y2="215" stroke="hsl(270, 40%, 50%)" strokeWidth="1.5" strokeDasharray="4,2" />
      </svg>
    )
  },
  "NEB-102": {
    title: "IAM Roles & Policies Architecture",
    description: "Least-privilege IAM role structure for Project Nebula migration teams with cross-account access.",
    render: () => (
      <svg viewBox="0 0 900 450" className="w-full h-full">
        <rect x="20" y="10" width="860" height="430" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(0, 60%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(0, 60%, 40%)">🔐 IAM Architecture — Project Nebula</text>

        {/* Root Account */}
        <rect x="330" y="50" width="240" height="45" rx="6" fill="hsl(0, 70%, 50%)" stroke="hsl(0, 60%, 40%)" strokeWidth="1" />
        <text x="350" y="75" fontSize="12" fontWeight="bold" fill="white">👑 AWS Root Account (locked)</text>
        <text x="350" y="88" fontSize="9" fill="hsl(0, 90%, 90%)">MFA Enforced — No daily use</text>

        {/* Roles */}
        {[
          { x: 50, label: "NebulaCICD-Role", desc: "CodePipeline, CodeBuild,\nECR push, S3 artifacts", color: "hsl(210, 60%, 50%)", icon: "⚙️" },
          { x: 230, label: "NebulaECS-TaskRole", desc: "Secrets Manager, CloudWatch\nLogs, S3 read", color: "hsl(270, 50%, 55%)", icon: "🐳" },
          { x: 410, label: "NebulaDB-MigrationRole", desc: "RDS full, DMS, S3\nbackup read/write", color: "hsl(200, 50%, 50%)", icon: "🗄️" },
          { x: 590, label: "NebulaSecurity-AuditRole", desc: "IAM read, CloudTrail,\nGuardDuty, Config", color: "hsl(0, 60%, 50%)", icon: "🔍" },
        ].map((role, i) => (
          <g key={i}>
            <rect x={role.x} y="130" width="170" height="70" rx="6" fill={role.color} stroke="hsl(0, 0%, 80%)" strokeWidth="1" />
            <text x={role.x + 10} y="152" fontSize="10" fontWeight="bold" fill="white">{role.icon} {role.label}</text>
            <text x={role.x + 10} y="168" fontSize="8" fill="hsl(0, 0%, 90%)">{role.desc.split('\n')[0]}</text>
            <text x={role.x + 10} y="180" fontSize="8" fill="hsl(0, 0%, 90%)">{role.desc.split('\n')[1]}</text>
            <line x1="450" y1="95" x2={role.x + 85} y2="130" stroke="hsl(0, 0%, 70%)" strokeWidth="1" strokeDasharray="3,2" />
          </g>
        ))}

        {/* Team members mapped to roles */}
        <text x="50" y="235" fontSize="12" fontWeight="bold" fill="hsl(220, 40%, 40%)">👥 Team → Role Mapping</text>
        {[
          { name: "Carlos (DevOps)", role: "NebulaCICD-Role", x: 50 },
          { name: "James (Backend)", role: "NebulaECS-TaskRole + DB-Migration", x: 250 },
          { name: "Maya (Cloud Eng)", role: "NebulaCICD-Role + ECS-Task", x: 450 },
          { name: "Priya (Security)", role: "NebulaSecurity-AuditRole", x: 650 },
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x} y="250" width="180" height="50" rx="5" fill="hsl(220, 30%, 95%)" stroke="hsl(220, 40%, 60%)" strokeWidth="1" />
            <text x={m.x + 10} y="270" fontSize="10" fontWeight="bold" fill="hsl(220, 40%, 35%)">{m.name}</text>
            <text x={m.x + 10} y="285" fontSize="8" fill="hsl(220, 30%, 50%)">{m.role}</text>
          </g>
        ))}

        {/* Policies */}
        <text x="50" y="335" fontSize="12" fontWeight="bold" fill="hsl(220, 40%, 40%)">📜 Key Policies</text>
        {[
          { label: "DenyDelete-Prod", desc: "Prevents deletion of prod resources", color: "hsl(0, 60%, 95%)" },
          { label: "EnforceMFA", desc: "Require MFA for all console access", color: "hsl(45, 80%, 95%)" },
          { label: "RestrictRegion", desc: "Limit to us-east-1 only", color: "hsl(145, 40%, 95%)" },
          { label: "CrossAccount-Trust", desc: "Allow CI/CD from shared-services acct", color: "hsl(270, 30%, 95%)" },
        ].map((p, i) => (
          <g key={i}>
            <rect x={50 + i * 200} y="350" width="185" height="55" rx="5" fill={p.color} stroke="hsl(0, 0%, 80%)" strokeWidth="1" />
            <text x={60 + i * 200} y="370" fontSize="10" fontWeight="bold" fill="hsl(220, 40%, 30%)">{p.label}</text>
            <text x={60 + i * 200} y="385" fontSize="8" fill="hsl(220, 30%, 50%)">{p.desc}</text>
          </g>
        ))}
      </svg>
    )
  },
  "NEB-103": {
    title: "CI/CD Pipeline — Build Stage",
    description: "CodePipeline architecture with source, build, and artifact stages for Project Nebula.",
    render: () => (
      <svg viewBox="0 0 900 350" className="w-full h-full">
        <rect x="20" y="10" width="860" height="330" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(210, 60%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(210, 60%, 40%)">⚙️ CI/CD Pipeline — Build Stage</text>

        {/* Pipeline stages */}
        {[
          { x: 50, w: 150, label: "Source", icon: "📦", items: ["GitHub Repo", "main branch", "Webhook trigger"], color: "hsl(220, 50%, 50%)" },
          { x: 240, w: 180, label: "Build", icon: "🔨", items: ["CodeBuild", "Docker build", "Unit tests", "SAST scan"], color: "hsl(35, 70%, 50%)" },
          { x: 460, w: 160, label: "Artifacts", icon: "📋", items: ["S3 bucket", "Docker image → ECR", "Test reports"], color: "hsl(145, 50%, 45%)" },
          { x: 660, w: 170, label: "Notification", icon: "🔔", items: ["SNS Topic", "Slack webhook", "Build status badge"], color: "hsl(270, 50%, 50%)" },
        ].map((stage, i) => (
          <g key={i}>
            <rect x={stage.x} y="60" width={stage.w} height="130" rx="8" fill={stage.color} fillOpacity="0.1" stroke={stage.color} strokeWidth="1.5" />
            <text x={stage.x + 10} y="85" fontSize="12" fontWeight="bold" fill={stage.color}>{stage.icon} {stage.label}</text>
            {stage.items.map((item, j) => (
              <text key={j} x={stage.x + 15} y={105 + j * 18} fontSize="10" fill="hsl(220, 30%, 40%)">• {item}</text>
            ))}
            {i < 3 && <line x1={stage.x + stage.w + 5} y1="125" x2={stage.x + stage.w + 30} y2="125" stroke="hsl(220, 40%, 50%)" strokeWidth="2" markerEnd="url(#arrow2)" />}
          </g>
        ))}

        {/* buildspec.yml */}
        <rect x="50" y="220" width="780" height="100" rx="6" fill="hsl(220, 20%, 15%)" stroke="hsl(220, 30%, 30%)" strokeWidth="1" />
        <text x="70" y="245" fontSize="11" fontWeight="bold" fill="hsl(145, 70%, 60%)">📄 buildspec.yml</text>
        <text x="70" y="265" fontSize="10" fontFamily="monospace" fill="hsl(45, 80%, 70%)">phases:</text>
        <text x="90" y="280" fontSize="10" fontFamily="monospace" fill="hsl(200, 70%, 70%)">  build: docker build -t nebula-auth:$CODEBUILD_BUILD_NUMBER .</text>
        <text x="90" y="295" fontSize="10" fontFamily="monospace" fill="hsl(200, 70%, 70%)">  post_build: docker push $ECR_REPO:$TAG</text>
        <text x="90" y="310" fontSize="10" fontFamily="monospace" fill="hsl(270, 60%, 70%)">artifacts: imagedefinitions.json → S3</text>

        <defs>
          <marker id="arrow2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(220, 40%, 50%)" />
          </marker>
        </defs>
      </svg>
    )
  },
  "NEB-104": {
    title: "Auth Service — Container Architecture",
    description: "Docker container design for the authentication service including ECS task definition and networking.",
    render: () => (
      <svg viewBox="0 0 900 420" className="w-full h-full">
        <rect x="20" y="10" width="860" height="400" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(270, 50%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(270, 50%, 40%)">🐳 Auth Service — Container Architecture</text>

        {/* Docker container */}
        <rect x="50" y="55" width="380" height="330" rx="8" fill="hsl(210, 30%, 95%)" stroke="hsl(210, 50%, 50%)" strokeWidth="1.5" />
        <text x="70" y="80" fontSize="12" fontWeight="bold" fill="hsl(210, 50%, 40%)">📦 Docker Container: nebula-auth</text>

        <rect x="70" y="95" width="340" height="40" rx="4" fill="hsl(210, 60%, 50%)" stroke="hsl(210, 50%, 40%)" strokeWidth="1" />
        <text x="85" y="115" fontSize="10" fontWeight="bold" fill="white">Base: node:20-alpine</text>
        <text x="85" y="128" fontSize="8" fill="hsl(210, 90%, 90%)">Multi-stage build — 45MB final image</text>

        <rect x="70" y="145" width="160" height="50" rx="4" fill="hsl(270, 40%, 95%)" stroke="hsl(270, 40%, 60%)" strokeWidth="1" />
        <text x="80" y="165" fontSize="10" fontWeight="bold" fill="hsl(270, 40%, 40%)">Express.js Server</text>
        <text x="80" y="180" fontSize="8" fill="hsl(270, 30%, 50%)">Port 8080</text>

        <rect x="250" y="145" width="160" height="50" rx="4" fill="hsl(145, 40%, 95%)" stroke="hsl(145, 40%, 60%)" strokeWidth="1" />
        <text x="260" y="165" fontSize="10" fontWeight="bold" fill="hsl(145, 40%, 40%)">JWT / OAuth2</text>
        <text x="260" y="180" fontSize="8" fill="hsl(145, 30%, 50%)">Passport.js middleware</text>

        <rect x="70" y="210" width="340" height="35" rx="4" fill="hsl(45, 80%, 95%)" stroke="hsl(45, 60%, 50%)" strokeWidth="1" />
        <text x="80" y="230" fontSize="10" fontWeight="bold" fill="hsl(45, 50%, 35%)">🔑 Env: Secrets Manager → DB_URL, JWT_SECRET</text>

        <rect x="70" y="260" width="340" height="35" rx="4" fill="hsl(0, 0%, 95%)" stroke="hsl(0, 0%, 70%)" strokeWidth="1" />
        <text x="80" y="280" fontSize="10" fontWeight="bold" fill="hsl(0, 0%, 35%)">📊 Health: /health → 200 OK</text>

        <rect x="70" y="310" width="340" height="55" rx="4" fill="hsl(220, 20%, 15%)" stroke="hsl(220, 30%, 30%)" strokeWidth="1" />
        <text x="85" y="330" fontSize="10" fontFamily="monospace" fill="hsl(145, 70%, 60%)">EXPOSE 8080</text>
        <text x="85" y="345" fontSize="10" fontFamily="monospace" fill="hsl(200, 70%, 70%)">CMD ["node", "dist/server.js"]</text>
        <text x="85" y="358" fontSize="10" fontFamily="monospace" fill="hsl(45, 70%, 70%)">HEALTHCHECK --interval=30s /health</text>

        {/* ECS Task Def */}
        <rect x="480" y="55" width="370" height="330" rx="8" fill="hsl(270, 20%, 95%)" stroke="hsl(270, 40%, 50%)" strokeWidth="1.5" />
        <text x="500" y="80" fontSize="12" fontWeight="bold" fill="hsl(270, 40%, 40%)">⚡ ECS Task Definition</text>

        {[
          { label: "Family", value: "nebula-auth-task" },
          { label: "CPU", value: "512 (0.5 vCPU)" },
          { label: "Memory", value: "1024 MB" },
          { label: "Network", value: "awsvpc" },
          { label: "Launch Type", value: "FARGATE" },
          { label: "Log Driver", value: "awslogs → /ecs/nebula-auth" },
          { label: "Service", value: "Desired: 2, Min: 1, Max: 4" },
          { label: "LB Target", value: "ALB → Port 8080" },
          { label: "Auto-Scale", value: "CPU > 70% → scale out" },
        ].map((item, i) => (
          <g key={i}>
            <text x="500" y={105 + i * 30} fontSize="10" fontWeight="bold" fill="hsl(270, 30%, 40%)">{item.label}:</text>
            <text x="610" y={105 + i * 30} fontSize="10" fill="hsl(270, 20%, 50%)">{item.value}</text>
          </g>
        ))}
      </svg>
    )
  },
  "NEB-105": {
    title: "CloudWatch Monitoring & Alerting",
    description: "Observability architecture with CloudWatch dashboards, custom metrics, and SNS alerting pipeline.",
    render: () => (
      <svg viewBox="0 0 900 400" className="w-full h-full">
        <rect x="20" y="10" width="860" height="380" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(145, 50%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(145, 50%, 40%)">📊 CloudWatch Monitoring — Project Nebula</text>

        {/* Sources */}
        <text x="50" y="65" fontSize="11" fontWeight="bold" fill="hsl(220, 40%, 40%)">Data Sources</text>
        {[
          { label: "ECS Auth Service", y: 80 },
          { label: "ALB Metrics", y: 110 },
          { label: "RDS PostgreSQL", y: 140 },
          { label: "NAT Gateway", y: 170 },
        ].map((s, i) => (
          <g key={i}>
            <rect x="50" y={s.y} width="150" height="25" rx="4" fill="hsl(270, 50%, 55%)" stroke="hsl(270, 40%, 40%)" strokeWidth="1" />
            <text x="60" y={s.y + 17} fontSize="9" fontWeight="bold" fill="white">{s.label}</text>
            <line x1="200" y1={s.y + 12} x2="260" y2="160" stroke="hsl(220, 40%, 60%)" strokeWidth="1" />
          </g>
        ))}

        {/* CloudWatch */}
        <rect x="260" y="70" width="200" height="180" rx="8" fill="hsl(145, 40%, 95%)" stroke="hsl(145, 50%, 50%)" strokeWidth="2" />
        <text x="280" y="95" fontSize="12" fontWeight="bold" fill="hsl(145, 50%, 35%)">☁️ CloudWatch</text>
        <text x="280" y="115" fontSize="9" fill="hsl(145, 30%, 50%)">• Custom Metrics</text>
        <text x="280" y="130" fontSize="9" fill="hsl(145, 30%, 50%)">• Log Groups</text>
        <text x="280" y="145" fontSize="9" fill="hsl(145, 30%, 50%)">• Dashboards</text>
        <text x="280" y="160" fontSize="9" fill="hsl(145, 30%, 50%)">• Alarms</text>
        <text x="280" y="180" fontSize="9" fontWeight="bold" fill="hsl(0, 60%, 50%)">⚠️ Alarm Rules:</text>
        <text x="280" y="195" fontSize="8" fill="hsl(0, 40%, 50%)">{"CPU > 80% for 5 min"}</text>
        <text x="280" y="208" fontSize="8" fill="hsl(0, 40%, 50%)">{"5xx errors > 10/min"}</text>
        <text x="280" y="221" fontSize="8" fill="hsl(0, 40%, 50%)">{"Latency p99 > 2s"}</text>
        <text x="280" y="234" fontSize="8" fill="hsl(0, 40%, 50%)">{"DB connections > 80%"}</text>

        {/* SNS */}
        <rect x="520" y="80" width="160" height="60" rx="6" fill="hsl(35, 70%, 55%)" stroke="hsl(35, 60%, 40%)" strokeWidth="1" />
        <text x="535" y="105" fontSize="11" fontWeight="bold" fill="white">🔔 SNS Topic</text>
        <text x="535" y="120" fontSize="9" fill="hsl(35, 90%, 90%)">nebula-alerts</text>
        <line x1="460" y1="120" x2="520" y2="110" stroke="hsl(35, 60%, 50%)" strokeWidth="2" markerEnd="url(#arrow3)" />

        {/* Destinations */}
        {[
          { label: "📧 Email: oncall@nebula.io", y: 80 },
          { label: "💬 Slack: #nebula-alerts", y: 115 },
          { label: "📱 PagerDuty", y: 150 },
        ].map((d, i) => (
          <g key={i}>
            <rect x="720" y={d.y} width="140" height="28" rx="4" fill="hsl(220, 30%, 95%)" stroke="hsl(220, 40%, 60%)" strokeWidth="1" />
            <text x="730" y={d.y + 18} fontSize="9" fill="hsl(220, 40%, 35%)">{d.label}</text>
            <line x1="680" y1="110" x2="720" y2={d.y + 14} stroke="hsl(220, 40%, 60%)" strokeWidth="1" />
          </g>
        ))}

        {/* Dashboard preview */}
        <rect x="260" y="280" width="600" height="90" rx="6" fill="hsl(220, 20%, 15%)" stroke="hsl(220, 30%, 30%)" strokeWidth="1" />
        <text x="280" y="300" fontSize="11" fontWeight="bold" fill="hsl(145, 70%, 60%)">📈 Nebula Dashboard Widgets</text>
        {["CPU Utilization", "Request Count", "Error Rate", "P99 Latency", "DB Connections"].map((w, i) => (
          <g key={i}>
            <rect x={280 + i * 110} y="310" width="100" height="45" rx="3" fill="hsl(220, 30%, 20%)" stroke="hsl(220, 30%, 35%)" strokeWidth="0.5" />
            <text x={285 + i * 110} y="328" fontSize="8" fill="hsl(145, 60%, 60%)">{w}</text>
            <text x={285 + i * 110} y="345" fontSize="14" fontWeight="bold" fill="white">{["23%", "1.2K", "0.3%", "145ms", "12/100"][i]}</text>
          </g>
        ))}

        <defs>
          <marker id="arrow3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(35, 60%, 50%)" />
          </marker>
        </defs>
      </svg>
    )
  },
  "NEB-112": {
    title: "Network Peering & Firewall Rules",
    description: "VPC peering, security groups, and NACLs for cross-service communication in the Nebula architecture.",
    render: () => (
      <svg viewBox="0 0 900 420" className="w-full h-full">
        <rect x="20" y="10" width="860" height="400" rx="12" fill="hsl(220, 20%, 97%)" stroke="hsl(220, 60%, 50%)" strokeWidth="2" strokeDasharray="8,4" />
        <text x="40" y="35" fontSize="14" fontWeight="bold" fill="hsl(220, 60%, 40%)">🔗 Network Peering & Firewall — Project Nebula</text>

        {/* VPC A */}
        <rect x="50" y="55" width="350" height="330" rx="8" fill="hsl(210, 30%, 95%)" stroke="hsl(210, 50%, 50%)" strokeWidth="1.5" />
        <text x="70" y="80" fontSize="12" fontWeight="bold" fill="hsl(210, 50%, 40%)">VPC-A: Nebula Prod (10.0.0.0/16)</text>

        <rect x="70" y="100" width="310" height="60" rx="5" fill="hsl(270, 40%, 95%)" stroke="hsl(270, 40%, 60%)" strokeWidth="1" />
        <text x="80" y="120" fontSize="10" fontWeight="bold" fill="hsl(270, 40%, 40%)">Auth Service Subnet (10.0.10.0/24)</text>
        <text x="80" y="135" fontSize="9" fill="hsl(270, 30%, 50%)">ECS Fargate — 2 tasks running</text>
        <text x="80" y="148" fontSize="8" fill="hsl(0, 50%, 50%)">SG: Allow 8080 from ALB only</text>

        <rect x="70" y="175" width="310" height="60" rx="5" fill="hsl(200, 40%, 95%)" stroke="hsl(200, 40%, 60%)" strokeWidth="1" />
        <text x="80" y="195" fontSize="10" fontWeight="bold" fill="hsl(200, 40%, 40%)">Database Subnet (10.0.20.0/24)</text>
        <text x="80" y="210" fontSize="9" fill="hsl(200, 30%, 50%)">RDS PostgreSQL — Multi-AZ</text>
        <text x="80" y="223" fontSize="8" fill="hsl(0, 50%, 50%)">SG: Allow 5432 from Auth SG only</text>

        <rect x="70" y="250" width="310" height="55" rx="5" fill="hsl(0, 0%, 97%)" stroke="hsl(0, 60%, 50%)" strokeWidth="1" strokeDasharray="4,2" />
        <text x="80" y="270" fontSize="10" fontWeight="bold" fill="hsl(0, 50%, 40%)">📋 NACL: nacl-prod</text>
        <text x="80" y="285" fontSize="8" fill="hsl(0, 40%, 55%)">Inbound: 443, 8080, 5432 from 10.0.0.0/8</text>
        <text x="80" y="297" fontSize="8" fill="hsl(0, 40%, 55%)">Outbound: Ephemeral (1024-65535)</text>

        {/* Peering connection */}
        <rect x="360" y="180" width="180" height="50" rx="20" fill="hsl(35, 70%, 55%)" stroke="hsl(35, 60%, 40%)" strokeWidth="2" />
        <text x="385" y="205" fontSize="11" fontWeight="bold" fill="white">🔗 VPC Peering</text>
        <text x="385" y="220" fontSize="8" fill="hsl(35, 90%, 90%)">pcx-nebula-shared</text>

        {/* VPC B */}
        <rect x="500" y="55" width="350" height="330" rx="8" fill="hsl(145, 30%, 95%)" stroke="hsl(145, 50%, 50%)" strokeWidth="1.5" />
        <text x="520" y="80" fontSize="12" fontWeight="bold" fill="hsl(145, 50%, 40%)">VPC-B: Shared Services (10.1.0.0/16)</text>

        <rect x="520" y="100" width="310" height="60" rx="5" fill="hsl(210, 40%, 95%)" stroke="hsl(210, 40%, 60%)" strokeWidth="1" />
        <text x="530" y="120" fontSize="10" fontWeight="bold" fill="hsl(210, 40%, 40%)">CI/CD Subnet (10.1.1.0/24)</text>
        <text x="530" y="135" fontSize="9" fill="hsl(210, 30%, 50%)">CodeBuild, CodePipeline agents</text>
        <text x="530" y="148" fontSize="8" fill="hsl(0, 50%, 50%)">SG: Allow outbound to VPC-A</text>

        <rect x="520" y="175" width="310" height="60" rx="5" fill="hsl(35, 40%, 95%)" stroke="hsl(35, 40%, 60%)" strokeWidth="1" />
        <text x="530" y="195" fontSize="10" fontWeight="bold" fill="hsl(35, 40%, 40%)">Monitoring Subnet (10.1.2.0/24)</text>
        <text x="530" y="210" fontSize="9" fill="hsl(35, 30%, 50%)">Prometheus, Grafana stack</text>
        <text x="530" y="223" fontSize="8" fill="hsl(0, 50%, 50%)">SG: Allow 9090, 3000 internal</text>

        <rect x="520" y="250" width="310" height="55" rx="5" fill="hsl(0, 0%, 97%)" stroke="hsl(0, 60%, 50%)" strokeWidth="1" strokeDasharray="4,2" />
        <text x="530" y="270" fontSize="10" fontWeight="bold" fill="hsl(0, 50%, 40%)">📋 NACL: nacl-shared</text>
        <text x="530" y="285" fontSize="8" fill="hsl(0, 40%, 55%)">Inbound: 443 from 10.0.0.0/16</text>
        <text x="530" y="297" fontSize="8" fill="hsl(0, 40%, 55%)">Outbound: 8080, 5432 to 10.0.0.0/16</text>

        {/* Route tables */}
        <rect x="70" y="320" width="310" height="45" rx="4" fill="hsl(45, 80%, 95%)" stroke="hsl(45, 60%, 50%)" strokeWidth="1" />
        <text x="80" y="340" fontSize="9" fontWeight="bold" fill="hsl(45, 50%, 35%)">Route: 10.1.0.0/16 → pcx-nebula-shared</text>
        <text x="80" y="355" fontSize="8" fill="hsl(45, 40%, 45%)">10.0.0.0/16 → local</text>

        <rect x="520" y="320" width="310" height="45" rx="4" fill="hsl(45, 80%, 95%)" stroke="hsl(45, 60%, 50%)" strokeWidth="1" />
        <text x="530" y="340" fontSize="9" fontWeight="bold" fill="hsl(45, 50%, 35%)">Route: 10.0.0.0/16 → pcx-nebula-shared</text>
        <text x="530" y="355" fontSize="8" fill="hsl(45, 40%, 45%)">10.1.0.0/16 → local</text>
      </svg>
    )
  },
};

// Map stories to their closest diagram
const STORY_DIAGRAM_MAP: Record<string, string> = {
  "NEB-101": "NEB-101",
  "NEB-101b": "NEB-101b",
  "NEB-102": "NEB-102",
  "NEB-103": "NEB-103",
  "NEB-103b": "NEB-103",
  "NEB-104": "NEB-104",
  "NEB-104b": "NEB-104",
  "NEB-104c": "NEB-104",
  "NEB-105": "NEB-105",
  "NEB-106": "NEB-102",
  "NEB-106b": "NEB-102",
  "NEB-107": "NEB-112",
  "NEB-108": "NEB-101b",
  "NEB-108b": "NEB-101b",
  "NEB-109": "NEB-105",
  "NEB-110": "NEB-101b",
  "NEB-110b": "NEB-101b",
  "NEB-111": "NEB-104",
  "NEB-112": "NEB-112",
};

export const getDiagramForStory = (storyId: string) => {
  const diagramId = STORY_DIAGRAM_MAP[storyId] || storyId;
  return DIAGRAMS[diagramId] || null;
};

const ArchitectureDiagramViewer = ({ storyId, storyTitle, onClose }: ArchitectureDiagramViewerProps) => {
  const [zoom, setZoom] = useState(1);
  const diagram = getDiagramForStory(storyId);

  if (!diagram) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{storyId}</span>
              <span className="text-xs text-muted-foreground">Architecture Diagram</span>
            </div>
            <h2 className="text-base font-display font-bold">{diagram.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{diagram.description}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => setZoom(z => Math.min(2, z + 0.25))}>
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => setZoom(1)}>
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 ml-2" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Diagram */}
        <div className="flex-1 overflow-auto p-6 bg-muted/20">
          <div
            className="mx-auto transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', maxWidth: '100%' }}
          >
            {diagram.render()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-muted/30 flex items-center justify-between shrink-0">
          <p className="text-[10px] text-muted-foreground">
            📐 Project Nebula — Infrastructure Design Document v2.1 • Nebula Core Team
          </p>
          <p className="text-[10px] text-muted-foreground">
            Related: {storyTitle}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArchitectureDiagramViewer;
