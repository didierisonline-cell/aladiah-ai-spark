import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import BackToPortal from '@/components/portal/BackToPortal';
import { Save, Download, Sparkles, CheckCircle, Loader2, FileText, LayoutTemplate } from 'lucide-react';

interface ResumeData {
  fullName: string; email: string; phone: string; location: string;
  summary: string; experience: string; education: string;
  skills: string; certifications: string; projects: string;
}

const EMPTY: ResumeData = {
  fullName:'', email:'', phone:'', location:'',
  summary:'', experience:'', education:'',
  skills:'', certifications:'', projects:'',
};

const TEMPLATES = [
  {
    id:'prestige', name:'Prestige', accent:'#1B2A4A',
    desc:'Two-column navy sidebar — top choice for C-Suite & VP roles',
    render:(d:ResumeData)=>`
      <div style="font-family:'Georgia',serif;max-width:780px;margin:0 auto;background:#fff;display:flex;min-height:1000px;">
        <div style="width:220px;background:#1B2A4A;color:#fff;padding:28px 20px;flex-shrink:0;">
          <div style="width:70px;height:70px;border-radius:50%;background:#C4A44A;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;margin:0 auto 16px;">${(d.fullName||'YN').split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</div>
          <h1 style="font-size:16px;font-weight:700;text-align:center;margin:0 0 4px;letter-spacing:.5px;">${d.fullName||'Your Name'}</h1>
          <p style="font-size:10px;text-align:center;color:#C4A44A;margin:0 0 20px;letter-spacing:1px;text-transform:uppercase;">AI Professional</p>
          ${d.email||d.phone||d.location?`<div style="margin-bottom:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.15);">
            <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#C4A44A;margin:0 0 8px;">Contact</p>
            ${d.email?`<p style="font-size:10px;margin:0 0 4px;word-break:break-all;">${d.email}</p>`:''}
            ${d.phone?`<p style="font-size:10px;margin:0 0 4px;">${d.phone}</p>`:''}
            ${d.location?`<p style="font-size:10px;margin:0;">${d.location}</p>`:''}
          </div>`:''}
          ${d.skills?`<div style="margin-bottom:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.15);">
            <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#C4A44A;margin:0 0 8px;">Core Skills</p>
            ${d.skills.replace(/\n/g,',').split(',').filter((s:string)=>s.trim()).map((s:string)=>`<span style="display:inline-block;background:rgba(255,255,255,.1);border-radius:3px;padding:2px 7px;font-size:9px;margin:2px 2px 0 0;">${s.trim()}</span>`).join('')}
          </div>`:''}
          ${d.certifications?`<div style="padding-top:16px;border-top:1px solid rgba(255,255,255,.15);">
            <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#C4A44A;margin:0 0 8px;">Certifications</p>
            <p style="font-size:10px;line-height:1.7;margin:0;">${d.certifications}</p>
          </div>`:''}
        </div>
        <div style="flex:1;padding:32px 28px;">
          ${d.summary?`<div style="margin-bottom:22px;padding-bottom:16px;border-bottom:2px solid #1B2A4A;">
            <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1B2A4A;margin:0 0 10px;">Executive Profile</h2>
            <p style="font-size:13px;line-height:1.8;margin:0;color:#333;font-style:italic;">${d.summary}</p>
          </div>`:''}
          ${d.experience?`<div style="margin-bottom:22px;">
            <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1B2A4A;margin:0 0 10px;">Professional Experience</h2>
            <p style="font-size:13px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
          </div>`:''}
          ${d.education?`<div style="margin-bottom:22px;">
            <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1B2A4A;margin:0 0 10px;">Education</h2>
            <p style="font-size:13px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.education}</p>
          </div>`:''}
          ${d.projects?`<div>
            <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1B2A4A;margin:0 0 10px;">Key Achievements</h2>
            <p style="font-size:13px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.projects}</p>
          </div>`:''}
        </div>
      </div>`
  },
  {
    id:'manhattan', name:'Manhattan', accent:'#0D1F3C',
    desc:'Bold centered header, clean lines — Fortune 500 standard',
    render:(d:ResumeData)=>`
      <div style="font-family:'Arial',sans-serif;max-width:760px;margin:0 auto;background:#fff;padding:40px;">
        <div style="text-align:center;margin-bottom:24px;">
          <h1 style="font-size:32px;font-weight:900;letter-spacing:4px;text-transform:uppercase;margin:0 0 6px;color:#0D1F3C;">${d.fullName||'YOUR NAME'}</h1>
          <div style="width:80px;height:3px;background:#C4A44A;margin:0 auto 10px;"></div>
          <p style="font-size:12px;color:#666;letter-spacing:1px;">${[d.email,d.phone,d.location].filter(Boolean).join('  ·  ')}</p>
        </div>
        ${d.summary?`<div style="background:#f8f9fa;border-left:4px solid #C4A44A;padding:14px 18px;margin-bottom:22px;">
          <p style="font-size:13px;line-height:1.8;margin:0;color:#333;font-style:italic;">${d.summary}</p>
        </div>`:''}
        ${d.experience?`<div style="margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0D1F3C;margin:0;">Professional Experience</h2>
            <div style="flex:1;height:1px;background:#0D1F3C;"></div>
          </div>
          <p style="font-size:13px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
        </div>`:''}
        ${d.education?`<div style="margin-bottom:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0D1F3C;margin:0;">Education</h2>
            <div style="flex:1;height:1px;background:#0D1F3C;"></div>
          </div>
          <p style="font-size:13px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.education}</p>
        </div>`:''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          ${d.skills?`<div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
              <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0D1F3C;margin:0;">Skills</h2>
              <div style="flex:1;height:1px;background:#0D1F3C;"></div>
            </div>
            <p style="font-size:12px;line-height:1.8;margin:0;color:#333;">${d.skills}</p>
          </div>`:''}
          ${d.certifications?`<div>
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
              <h2 style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#0D1F3C;margin:0;">Certifications</h2>
              <div style="flex:1;height:1px;background:#0D1F3C;"></div>
            </div>
            <p style="font-size:12px;line-height:1.8;margin:0;color:#333;">${d.certifications}</p>
          </div>`:''}
        </div>
      </div>`
  },
  {
    id:'sovereign', name:'Sovereign', accent:'#2C1810',
    desc:'Dark brown luxury header — ideal for board-level positions',
    render:(d:ResumeData)=>`
      <div style="font-family:'Times New Roman',serif;max-width:760px;margin:0 auto;background:#fff;">
        <div style="background:#2C1810;color:#fff;padding:36px 44px;text-align:center;">
          <h1 style="font-size:28px;font-weight:700;letter-spacing:5px;text-transform:uppercase;margin:0 0 8px;">${d.fullName||'YOUR NAME'}</h1>
          <div style="width:60px;height:1px;background:#C4A44A;margin:0 auto 10px;"></div>
          <p style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,.7);margin:0;">${[d.email,d.phone,d.location].filter(Boolean).join('   |   ')}</p>
        </div>
        <div style="padding:32px 44px;">
          ${d.summary?`<div style="margin-bottom:24px;text-align:center;">
            <p style="font-size:14px;line-height:1.9;color:#444;font-style:italic;margin:0;border-top:1px solid #C4A44A;border-bottom:1px solid #C4A44A;padding:14px 0;">"${d.summary}"</p>
          </div>`:''}
          ${d.experience?`<div style="margin-bottom:22px;">
            <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#2C1810;border-bottom:2px solid #C4A44A;padding-bottom:6px;margin-bottom:12px;">Career History</h2>
            <p style="font-size:13px;line-height:1.9;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
          </div>`:''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
            <div>
              ${d.education?`<div style="margin-bottom:18px;">
                <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#2C1810;border-bottom:2px solid #C4A44A;padding-bottom:6px;margin-bottom:10px;">Education</h2>
                <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.education}</p>
              </div>`:''}
              ${d.projects?`<div>
                <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#2C1810;border-bottom:2px solid #C4A44A;padding-bottom:6px;margin-bottom:10px;">Key Projects</h2>
                <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.projects}</p>
              </div>`:''}
            </div>
            <div>
              ${d.skills?`<div style="margin-bottom:18px;">
                <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#2C1810;border-bottom:2px solid #C4A44A;padding-bottom:6px;margin-bottom:10px;">Core Competencies</h2>
                <p style="font-size:12px;line-height:1.8;margin:0;color:#333;">${d.skills}</p>
              </div>`:''}
              ${d.certifications?`<div>
                <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#2C1810;border-bottom:2px solid #C4A44A;padding-bottom:6px;margin-bottom:10px;">Credentials</h2>
                <p style="font-size:12px;line-height:1.8;margin:0;color:#333;">${d.certifications}</p>
              </div>`:''}
            </div>
          </div>
        </div>
      </div>`
  },
  {
    id:'apex', name:'Apex', accent:'#1E3A5F',
    desc:'Metrics-forward layout — quantify achievements prominently',
    render:(d:ResumeData)=>`
      <div style="font-family:'Calibri',sans-serif;max-width:760px;margin:0 auto;background:#fff;padding:0;">
        <div style="background:linear-gradient(135deg,#1E3A5F 0%,#2E5A8F 100%);padding:30px 36px;color:#fff;">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;">
            <div>
              <h1 style="font-size:30px;font-weight:800;margin:0 0 4px;letter-spacing:1px;">${d.fullName||'Your Name'}</h1>
              <p style="margin:0;font-size:12px;opacity:.8;letter-spacing:.5px;">${d.location||''}</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0 0 3px;font-size:11px;opacity:.85;">${d.email||''}</p>
              <p style="margin:0;font-size:11px;opacity:.85;">${d.phone||''}</p>
            </div>
          </div>
        </div>
        <div style="background:#F0F4F8;padding:14px 36px;">
          ${d.summary?`<p style="font-size:13px;line-height:1.7;margin:0;color:#1E3A5F;font-weight:500;">${d.summary}</p>`:''}
        </div>
        <div style="padding:24px 36px;">
          ${d.experience?`<div style="margin-bottom:20px;">
            <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1E3A5F;margin:0 0 10px;padding-bottom:5px;border-bottom:2px solid #1E3A5F;">Experience & Impact</h2>
            <p style="font-size:13px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
          </div>`:''}
          <div style="display:grid;grid-template-columns:3fr 2fr;gap:20px;">
            <div>
              ${d.education?`<div style="margin-bottom:16px;">
                <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1E3A5F;margin:0 0 8px;padding-bottom:5px;border-bottom:2px solid #1E3A5F;">Education</h2>
                <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.education}</p>
              </div>`:''}
              ${d.projects?`<div>
                <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1E3A5F;margin:0 0 8px;padding-bottom:5px;border-bottom:2px solid #1E3A5F;">Notable Projects</h2>
                <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.projects}</p>
              </div>`:''}
            </div>
            <div>
              ${d.skills?`<div style="margin-bottom:16px;background:#EEF2F7;padding:14px;border-radius:6px;">
                <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1E3A5F;margin:0 0 8px;">Skills</h2>
                <p style="font-size:11px;line-height:1.8;margin:0;color:#333;">${d.skills}</p>
              </div>`:''}
              ${d.certifications?`<div style="background:#EEF2F7;padding:14px;border-radius:6px;">
                <h2 style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#1E3A5F;margin:0 0 8px;">Certifications</h2>
                <p style="font-size:11px;line-height:1.8;margin:0;color:#333;">${d.certifications}</p>
              </div>`:''}
            </div>
          </div>
        </div>
      </div>`
  },
  {
    id:'zenith', name:'Zenith', accent:'#B8860B',
    desc:'Gold accent, serif elegance — for C-Suite & Director roles',
    render:(d:ResumeData)=>`
      <div style="font-family:'Palatino Linotype','Book Antiqua',serif;max-width:760px;margin:0 auto;background:#FEFEFE;padding:44px;">
        <div style="border-top:3px double #B8860B;border-bottom:3px double #B8860B;padding:20px 0;margin-bottom:28px;text-align:center;">
          <h1 style="font-size:26px;font-weight:700;letter-spacing:6px;text-transform:uppercase;margin:0 0 6px;color:#1a1a1a;">${d.fullName||'YOUR NAME'}</h1>
          <p style="font-size:11px;letter-spacing:2px;color:#B8860B;margin:0;">${[d.email,d.phone,d.location].filter(Boolean).join('  ✦  ')}</p>
        </div>
        ${d.summary?`<div style="margin-bottom:24px;">
          <p style="font-size:14px;line-height:2;color:#444;text-align:center;font-style:italic;margin:0;">${d.summary}</p>
        </div>`:''}
        ${d.experience?`<div style="margin-bottom:22px;">
          <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#B8860B;text-align:center;margin:0 0 12px;">— Professional Experience —</h2>
          <p style="font-size:13px;line-height:1.9;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
        </div>`:''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:22px;">
          ${d.education?`<div>
            <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#B8860B;text-align:center;margin:0 0 10px;">— Education —</h2>
            <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.education}</p>
          </div>`:''}
          ${d.certifications?`<div>
            <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#B8860B;text-align:center;margin:0 0 10px;">— Credentials —</h2>
            <p style="font-size:12px;line-height:1.8;margin:0;color:#444;">${d.certifications}</p>
          </div>`:''}
        </div>
        ${d.skills?`<div style="border-top:1px solid #B8860B;padding-top:16px;">
          <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#B8860B;text-align:center;margin:0 0 10px;">— Core Competencies —</h2>
          <p style="font-size:12px;line-height:1.8;text-align:center;margin:0;color:#444;">${d.skills}</p>
        </div>`:''}
      </div>`
  },
  {
    id:'catalyst', name:'Catalyst', accent:'#1A6B3C',
    desc:'Green tech executive — perfect for AI & digital leaders',
    render:(d:ResumeData)=>`
      <div style="font-family:'Trebuchet MS',sans-serif;max-width:760px;margin:0 auto;background:#fff;">
        <div style="background:#1A6B3C;padding:28px 36px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <h1 style="font-size:26px;font-weight:700;color:#fff;margin:0 0 4px;letter-spacing:1px;">${d.fullName||'Your Name'}</h1>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,.75);letter-spacing:.5px;">${d.location||''}</p>
          </div>
          <div style="text-align:right;color:rgba(255,255,255,.85);">
            <p style="margin:0 0 3px;font-size:11px;">${d.email||''}</p>
            <p style="margin:0;font-size:11px;">${d.phone||''}</p>
          </div>
        </div>
        <div style="height:4px;background:linear-gradient(90deg,#1A6B3C,#52C47C,#F5B81A);"></div>
        <div style="display:grid;grid-template-columns:2fr 1fr;gap:0;">
          <div style="padding:24px 28px;border-right:1px solid #e5e5e5;">
            ${d.summary?`<div style="margin-bottom:20px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1A6B3C;margin:0 0 8px;">Professional Profile</h2>
              <p style="font-size:13px;line-height:1.8;margin:0;color:#333;">${d.summary}</p>
            </div>`:''}
            ${d.experience?`<div style="margin-bottom:20px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1A6B3C;margin:0 0 8px;">Experience</h2>
              <p style="font-size:12px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
            </div>`:''}
            ${d.projects?`<div>
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1A6B3C;margin:0 0 8px;">Key Projects</h2>
              <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.projects}</p>
            </div>`:''}
          </div>
          <div style="padding:24px 20px;background:#F7FBF8;">
            ${d.skills?`<div style="margin-bottom:16px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1A6B3C;margin:0 0 8px;">Skills</h2>
              ${d.skills.replace(/\n/g,',').split(',').filter((s:string)=>s.trim()).map((s:string)=>`<span style="display:block;font-size:11px;padding:3px 0;border-bottom:1px solid #d4edda;color:#333;">${s.trim()}</span>`).join('')}
            </div>`:''}
            ${d.certifications?`<div style="margin-bottom:16px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1A6B3C;margin:0 0 8px;">Certifications</h2>
              <p style="font-size:11px;line-height:1.7;margin:0;color:#333;">${d.certifications}</p>
            </div>`:''}
            ${d.education?`<div>
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#1A6B3C;margin:0 0 8px;">Education</h2>
              <p style="font-size:11px;line-height:1.7;white-space:pre-wrap;margin:0;color:#333;">${d.education}</p>
            </div>`:''}
          </div>
        </div>
      </div>`
  },
  {
    id:'obsidian', name:'Obsidian', accent:'#212121',
    desc:'All-black ultra-premium — for top consulting & finance roles',
    render:(d:ResumeData)=>`
      <div style="font-family:'Garamond','Didot',serif;max-width:760px;margin:0 auto;background:#fff;padding:0;">
        <div style="background:#212121;padding:36px 44px;">
          <h1 style="font-size:28px;font-weight:400;letter-spacing:8px;text-transform:uppercase;color:#fff;margin:0 0 8px;">${d.fullName||'YOUR NAME'}</h1>
          <div style="display:flex;gap:6px;align-items:center;">
            <div style="width:40px;height:1px;background:#C4A44A;"></div>
            <p style="margin:0;font-size:11px;color:#C4A44A;letter-spacing:2px;">${[d.email,d.phone,d.location].filter(Boolean).join('  /  ')}</p>
          </div>
        </div>
        <div style="padding:32px 44px;">
          ${d.summary?`<div style="margin-bottom:24px;border-left:3px solid #C4A44A;padding-left:16px;">
            <p style="font-size:14px;line-height:1.9;color:#222;font-style:italic;margin:0;">${d.summary}</p>
          </div>`:''}
          ${d.experience?`<div style="margin-bottom:22px;">
            <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#212121;margin:0;white-space:nowrap;">Career</h2>
              <div style="flex:1;height:1px;background:#C4A44A;"></div>
            </div>
            <p style="font-size:13px;line-height:1.9;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
          </div>`:''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
            <div>
              ${d.education?`<div style="margin-bottom:18px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                  <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#212121;margin:0;white-space:nowrap;">Education</h2>
                  <div style="flex:1;height:1px;background:#C4A44A;"></div>
                </div>
                <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.education}</p>
              </div>`:''}
              ${d.projects?`<div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                  <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#212121;margin:0;white-space:nowrap;">Projects</h2>
                  <div style="flex:1;height:1px;background:#C4A44A;"></div>
                </div>
                <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.projects}</p>
              </div>`:''}
            </div>
            <div>
              ${d.skills?`<div style="margin-bottom:18px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                  <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#212121;margin:0;white-space:nowrap;">Expertise</h2>
                  <div style="flex:1;height:1px;background:#C4A44A;"></div>
                </div>
                <p style="font-size:12px;line-height:1.8;margin:0;color:#444;">${d.skills}</p>
              </div>`:''}
              ${d.certifications?`<div>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
                  <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#212121;margin:0;white-space:nowrap;">Credentials</h2>
                  <div style="flex:1;height:1px;background:#C4A44A;"></div>
                </div>
                <p style="font-size:12px;line-height:1.8;margin:0;color:#444;">${d.certifications}</p>
              </div>`:''}
            </div>
          </div>
        </div>
      </div>`
  },
  {
    id:'blueprint', name:'Blueprint', accent:'#003366',
    desc:'Technical leader template — AI, Engineering & CTO roles',
    render:(d:ResumeData)=>`
      <div style="font-family:'Verdana',sans-serif;max-width:760px;margin:0 auto;background:#fff;">
        <div style="background:#003366;padding:24px 32px;display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;">
          <div style="width:64px;height:64px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#003366;">${(d.fullName||'YN').split(' ').map((n:string)=>n[0]).join('').slice(0,2)}</div>
          <div>
            <h1 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 3px;">${d.fullName||'Your Name'}</h1>
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,.75);">${[d.email,d.phone,d.location].filter(Boolean).join('  |  ')}</p>
          </div>
        </div>
        <div style="background:#E8F0F8;padding:12px 32px;">
          ${d.summary?`<p style="font-size:12px;line-height:1.7;margin:0;color:#003366;">${d.summary}</p>`:''}
        </div>
        <div style="padding:24px 32px;display:grid;grid-template-columns:2fr 1fr;gap:24px;">
          <div>
            ${d.experience?`<div style="margin-bottom:18px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fff;background:#003366;padding:4px 10px;display:inline-block;margin:0 0 10px;border-radius:2px;">Experience</h2>
              <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
            </div>`:''}
            ${d.projects?`<div>
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fff;background:#003366;padding:4px 10px;display:inline-block;margin:0 0 10px;border-radius:2px;">Projects</h2>
              <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.projects}</p>
            </div>`:''}
          </div>
          <div>
            ${d.skills?`<div style="margin-bottom:16px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fff;background:#003366;padding:4px 10px;display:inline-block;margin:0 0 10px;border-radius:2px;">Skills</h2>
              <p style="font-size:11px;line-height:1.8;margin:0;color:#333;">${d.skills}</p>
            </div>`:''}
            ${d.certifications?`<div style="margin-bottom:16px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fff;background:#003366;padding:4px 10px;display:inline-block;margin:0 0 10px;border-radius:2px;">Certs</h2>
              <p style="font-size:11px;line-height:1.8;margin:0;color:#333;">${d.certifications}</p>
            </div>`:''}
            ${d.education?`<div>
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#fff;background:#003366;padding:4px 10px;display:inline-block;margin:0 0 10px;border-radius:2px;">Education</h2>
              <p style="font-size:11px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.education}</p>
            </div>`:''}
          </div>
        </div>
      </div>`
  },
  {
    id:'cardinal', name:'Cardinal', accent:'#8B0000',
    desc:'Deep red authority — law, healthcare & government leaders',
    render:(d:ResumeData)=>`
      <div style="font-family:'Book Antiqua','Palatino',serif;max-width:760px;margin:0 auto;background:#fff;padding:40px;">
        <div style="border-bottom:3px solid #8B0000;padding-bottom:18px;margin-bottom:22px;">
          <h1 style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 4px;letter-spacing:1px;">${d.fullName||'Your Name'}</h1>
          <p style="font-size:11px;color:#8B0000;margin:0;letter-spacing:.5px;">${[d.email,d.phone,d.location].filter(Boolean).join('  ◆  ')}</p>
        </div>
        ${d.summary?`<div style="margin-bottom:22px;background:#FFF5F5;border-left:4px solid #8B0000;padding:14px 18px;">
          <p style="font-size:13px;line-height:1.8;margin:0;color:#333;">${d.summary}</p>
        </div>`:''}
        ${d.experience?`<div style="margin-bottom:20px;">
          <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8B0000;margin:0 0 10px;">Professional History</h2>
          <p style="font-size:13px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
        </div>`:''}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;">
          <div>
            ${d.education?`<div style="margin-bottom:16px;">
              <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8B0000;margin:0 0 8px;">Education</h2>
              <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.education}</p>
            </div>`:''}
            ${d.projects?`<div>
              <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8B0000;margin:0 0 8px;">Notable Work</h2>
              <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#444;">${d.projects}</p>
            </div>`:''}
          </div>
          <div>
            ${d.skills?`<div style="margin-bottom:16px;">
              <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8B0000;margin:0 0 8px;">Areas of Expertise</h2>
              <p style="font-size:12px;line-height:1.8;margin:0;color:#444;">${d.skills}</p>
            </div>`:''}
            ${d.certifications?`<div>
              <h2 style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#8B0000;margin:0 0 8px;">Credentials</h2>
              <p style="font-size:12px;line-height:1.8;margin:0;color:#444;">${d.certifications}</p>
            </div>`:''}
          </div>
        </div>
      </div>`
  },
  {
    id:'visionary', name:'Visionary', accent:'#4B0082',
    desc:'Purple innovation — creative directors & brand strategists',
    render:(d:ResumeData)=>`
      <div style="font-family:'Century Gothic','Futura',sans-serif;max-width:760px;margin:0 auto;background:#fff;">
        <div style="background:linear-gradient(135deg,#4B0082,#7B2FBE);padding:32px 36px;color:#fff;position:relative;overflow:hidden;">
          <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.05);"></div>
          <div style="position:absolute;bottom:-30px;right:60px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.07);"></div>
          <h1 style="font-size:26px;font-weight:700;margin:0 0 4px;letter-spacing:2px;position:relative;">${d.fullName||'Your Name'}</h1>
          <p style="margin:0;font-size:11px;opacity:.8;letter-spacing:1px;position:relative;">${[d.email,d.phone,d.location].filter(Boolean).join('  ·  ')}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr 280px;gap:0;">
          <div style="padding:26px 28px;">
            ${d.summary?`<div style="margin-bottom:20px;border-bottom:1px solid #e8e8e8;padding-bottom:18px;">
              <p style="font-size:13px;line-height:1.8;margin:0;color:#333;">${d.summary}</p>
            </div>`:''}
            ${d.experience?`<div style="margin-bottom:18px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4B0082;margin:0 0 10px;">Experience</h2>
              <p style="font-size:12px;line-height:1.85;white-space:pre-wrap;margin:0;color:#333;">${d.experience}</p>
            </div>`:''}
            ${d.projects?`<div>
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4B0082;margin:0 0 10px;">Projects</h2>
              <p style="font-size:12px;line-height:1.8;white-space:pre-wrap;margin:0;color:#333;">${d.projects}</p>
            </div>`:''}
          </div>
          <div style="background:#F8F4FF;padding:26px 20px;border-left:1px solid #e5d6ff;">
            ${d.skills?`<div style="margin-bottom:18px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4B0082;margin:0 0 10px;">Skills</h2>
              ${d.skills.replace(/\n/g,',').split(',').filter((s:string)=>s.trim()).map((s:string)=>`<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;"><div style="width:6px;height:6px;border-radius:50%;background:#4B0082;flex-shrink:0;"></div><span style="font-size:11px;color:#333;">${s.trim()}</span></div>`).join('')}
            </div>`:''}
            ${d.certifications?`<div style="margin-bottom:18px;">
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4B0082;margin:0 0 10px;">Certifications</h2>
              <p style="font-size:11px;line-height:1.7;margin:0;color:#444;">${d.certifications}</p>
            </div>`:''}
            ${d.education?`<div>
              <h2 style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#4B0082;margin:0 0 10px;">Education</h2>
              <p style="font-size:11px;line-height:1.7;white-space:pre-wrap;margin:0;color:#444;">${d.education}</p>
            </div>`:''}
          </div>
        </div>
      </div>`
  },
];

const MOCK: ResumeData = {
  fullName: 'Alexandra Chen',
  email: 'alexandra.chen@email.com',
  phone: '+1 (212) 555-0182',
  location: 'New York, NY',
  summary: 'Seasoned AI Program Director with 12+ years leading enterprise digital transformation. Proven track record delivering $80M+ in operational savings. Expert in Agile at scale, cross-functional leadership, and building high-performance engineering teams.',
  experience: 'AI Program Director — Goldman Sachs (2021–Present)\\n• Led 6 Scrum teams (48 engineers) on AI risk platform\\n• Reduced validation cycle 92% — 14 days to 36 hours\\n• Managed $12M budget with 98% on-time delivery\\n\\nSenior Scrum Master — JPMorgan Chase (2018–2021)\\n• Coached 4 agile teams across 3 time zones\\n• Increased sprint velocity by 45%\\n\\nScrum Master — Deloitte Digital (2015–2018)\\n• Implemented SAFe across 200-person division',
  education: 'M.S. Computer Science — Columbia University (2013)\\nB.S. Information Systems — NYU Stern (2011)\\nExecutive Leadership — Harvard Business School (2022)',
  skills: 'Scrum, SAFe, Kanban, AI Strategy, Program Management, Agile Coaching, Risk Management, OKR Facilitation, Jira, Azure DevOps, Data Analytics',
  certifications: 'PSM III (Scrum.org 2023) · SAFe 6 Program Consultant · PMP · AI Certificate MIT · Aladiah Academy Certified',
  projects: 'AI Risk Platform: $8M initiative reducing false positives 67%\\nDigital Transformation: 18-month Agile adoption for 1,200 employees\\nPredictive Analytics: Real-time KPI system used by 40+ executives',
};

const TABS = [
  { id:'personal', label:'Personal', icon:'👤', fields:[
    {key:'fullName', label:'Full Name', ph:'John Doe', type:'input'},
    {key:'email', label:'Email', ph:'john@example.com', type:'input'},
    {key:'phone', label:'Phone', ph:'+1 (555) 000-0000', type:'input'},
    {key:'location', label:'Location', ph:'New York, NY', type:'input'},
  ]},
  { id:'summary', label:'Summary', icon:'📝', fields:[
    {key:'summary', label:'Professional Summary', ph:'Write a compelling 2-3 sentence summary highlighting your Scrum Master qualifications, years of experience, and key achievements...', type:'textarea'},
  ]},
  { id:'experience', label:'Experience', icon:'💼', fields:[
    {key:'experience', label:'Work Experience', ph:'Scrum Master @ Company (2022-Present)\n• Led 3 cross-functional squads of 8-12 engineers\n• Reduced sprint velocity variance by 40%\n• Facilitated 200+ sprint ceremonies\n\nJunior Scrum Master @ Company (2020-2022)\n• Coached 2 teams in Agile transformation...', type:'textarea'},
  ]},
  { id:'education', label:'Education', icon:'🎓', fields:[
    {key:'education', label:'Education', ph:'B.S. Computer Science — University Name (2020)\nAgile Project Management Certificate — Aladiah Academy (2024)', type:'textarea'},
    {key:'projects', label:'Key Projects', ph:'AI-Powered Sprint Planning Tool\n• Built dashboard for tracking sprint velocity across 5 teams\n• Technologies: React, Python, Jira API', type:'textarea'},
  ]},
  { id:'skills', label:'Skills & Certs', icon:'🏅', fields:[
    {key:'skills', label:'Skills', ph:'Scrum, Kanban, SAFe, Jira, Confluence, Azure DevOps, Facilitation, Stakeholder Management, Risk Management, Agile Coaching', type:'textarea'},
    {key:'certifications', label:'Certifications', ph:'PSM I (Scrum.org, 2024), CSM (Scrum Alliance, 2023), PMI-ACP, SAFe 6 Agilist, Aladiah Academy Certified™', type:'textarea'},
  ]},
];

const DS = { bg:'#0B111E', card:'#111D30', border:'#1E2D47', fg:'#EDF2F7', fm:'#8596AD', blue:'#4A90F5' };

const ResumeStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeData>(EMPTY);
  const [template, setTemplate] = useState('modern');
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Student';
  const tpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[1];

  useEffect(() => { if (user) loadResume(); }, [user]);

  const loadResume = async () => {
    const { data } = await (supabase as any)
      .from('ai_conversations')
      .select('content')
      .eq('user_id', user!.id)
      .eq('role', 'resume_data')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data?.content) {
      try { 
        const parsed = JSON.parse(data.content);
        setResume({ ...EMPTY, ...parsed });
        if (parsed._template) setTemplate(parsed._template);
      } catch {}
    }
  };

  const saveResume = async () => {
    if (!user) return;
    setSaving(true);
    await (supabase as any).from('ai_conversations').upsert({
      user_id: user.id, role: 'resume_data',
      content: JSON.stringify({ ...resume, _template: template }),
      session_id: 'resume_' + user.id,
    }, { onConflict: 'user_id,role,session_id' });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const downloadResume = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${resume.fullName || 'Resume'}</title><style>@media print{body{margin:0}}</style></head><body>${tpl.render(resume)}</body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(resume.fullName || 'resume').replace(/ /g,'_')}_resume.html`;
    a.click();
  };

  const aiSuggest = async (field: string) => {
    setAiLoading(true); setAiMsg('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:500,
          messages:[{ role:'user', content:`You are an expert resume writer. Write a strong ${field} for a Scrum Master resume. The person's name is ${resume.fullName||'the student'}. Their experience: ${resume.experience||'not provided yet'}. Return ONLY the ${field} text, no preamble.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      setResume(r => ({ ...r, [field === 'Professional Summary' ? 'summary' : field.toLowerCase()]: text }));
      setAiMsg(`✓ AI generated ${field}`);
    } catch { setAiMsg('AI suggestion failed — try again'); }
    setAiLoading(false);
    setTimeout(() => setAiMsg(''), 4000);
  };

  const update = (key: keyof ResumeData, val: string) => setResume(r => ({ ...r, [key]: val }));

  const currentTab = TABS.find(t => t.id === activeTab)!;

  return (
    <div style={{ minHeight:'100vh', background:DS.bg, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <Header />
      <div style={{ maxWidth:1400, margin:'0 auto', padding:'80px 1.5rem 2rem' }}>
        <BackToPortal />

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <div>
            <h1 style={{ fontSize:'1.6rem', fontWeight:800, color:DS.fg, margin:0 }}>Resume Builder Studio</h1>
            <p style={{ fontSize:13, color:DS.fm, margin:'4px 0 0' }}>AI-powered resume builder for {firstName}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setShowTemplates(!showTemplates)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:showTemplates?DS.blue+'22':'transparent', border:'1px solid '+(showTemplates?DS.blue:DS.border), borderRadius:'.5rem', color:showTemplates?DS.blue:DS.fm, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              <LayoutTemplate size={15}/> Templates
            </button>
            <button onClick={saveResume} disabled={saving}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:saved?'#22C98A22':DS.card, border:'1px solid '+(saved?'#22C98A':DS.border), borderRadius:'.5rem', color:saved?'#22C98A':DS.fm, fontSize:13, fontWeight:600, cursor:'pointer' }}>
              {saving?<Loader2 size={14} className="animate-spin"/>:saved?<CheckCircle size={14}/>:<Save size={14}/>}
              {saved?'Saved!':'Save'}
            </button>
            <button onClick={downloadResume}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', background:DS.blue, border:'none', borderRadius:'.5rem', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              <Download size={14}/> Download
            </button>
          </div>
        </div>

        {/* Template picker */}
        {showTemplates && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12, marginBottom:'1.5rem' }}>
            {TEMPLATES.map(t => (
              <div key={t.id} onClick={() => { setTemplate(t.id); setShowTemplates(false); }}
                style={{ border:'2px solid '+(template===t.id?t.accent:DS.border), borderRadius:'.75rem', overflow:'hidden', cursor:'pointer', background:template===t.id?t.accent+'11':DS.card }}>
                <div style={{ padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${DS.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:12, height:12, borderRadius:3, background:t.accent }}/>
                    <span style={{ fontSize:12, fontWeight:700, color:DS.fg }}>{t.name}</span>
                  </div>
                  {template===t.id ? <span style={{ fontSize:9, color:t.accent, fontWeight:800, padding:'1px 6px', borderRadius:99, background:t.accent+'22' }}>ACTIVE</span> : <span style={{ fontSize:10, color:DS.blue }}>Select</span>}
                </div>
                <div style={{ height:220, overflow:'hidden', background:'#f5f4f0' }}>
                  <div style={{ transform:'scale(0.38)', transformOrigin:'top left', width:'263%', pointerEvents:'none' as const }}>
                    <div dangerouslySetInnerHTML={{ __html: t.render(MOCK) }}/>
                  </div>
                </div>
                <div style={{ padding:'6px 12px', borderTop:`1px solid ${DS.border}` }}>
                  <p style={{ fontSize:9, color:DS.fm, margin:0 }}>{t.desc}</p>
                </div>
              </div>
            ))})
          </div>
        )}

        {/* Main 2-col layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', alignItems:'start' }}>

          {/* LEFT: Editor */}
          <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden' }}>
            {/* Tab bar */}
            <div style={{ display:'flex', borderBottom:`1px solid ${DS.border}`, overflowX:'auto' as const }}>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{ flex:1, padding:'10px 8px', background:activeTab===tab.id?DS.blue+'22':'transparent', border:'none', borderBottom:activeTab===tab.id?`2px solid ${DS.blue}`:'2px solid transparent', color:activeTab===tab.id?DS.blue:DS.fm, fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' as const, transition:'all .15s' }}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column' as const, gap:'1rem' }}>
              {currentTab.fields.map(f => (
                <div key={f.key}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:DS.fm, textTransform:'uppercase' as const, letterSpacing:'.5px' }}>{f.label}</label>
                    {f.type==='textarea' && (
                      <button onClick={() => aiSuggest(f.label)} disabled={aiLoading}
                        style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, fontWeight:700, color:DS.blue, background:DS.blue+'15', border:'none', borderRadius:99, padding:'3px 9px', cursor:'pointer' }}>
                        {aiLoading?<Loader2 size={10} className="animate-spin"/>:<Sparkles size={10}/>} AI Suggest
                      </button>
                    )}
                  </div>
                  {f.type==='input' ? (
                    <input value={resume[f.key as keyof ResumeData]} onChange={e => update(f.key as keyof ResumeData, e.target.value)}
                      placeholder={f.ph}
                      style={{ width:'100%', background:'#0B111E', border:`1px solid ${DS.border}`, borderRadius:'.45rem', padding:'9px 12px', color:DS.fg, fontSize:13, outline:'none', boxSizing:'border-box' as const, fontFamily:'inherit' }}/>
                  ) : (
                    <textarea value={resume[f.key as keyof ResumeData]} onChange={e => update(f.key as keyof ResumeData, e.target.value)}
                      placeholder={f.ph} rows={f.key==='summary'?4:6}
                      style={{ width:'100%', background:'#0B111E', border:`1px solid ${DS.border}`, borderRadius:'.45rem', padding:'9px 12px', color:DS.fg, fontSize:13, outline:'none', resize:'vertical' as const, boxSizing:'border-box' as const, fontFamily:'inherit', lineHeight:1.6 }}/>
                  )}
                </div>
              ))}
              {aiMsg && <p style={{ fontSize:12, color:'#22C98A', margin:0 }}>{aiMsg}</p>}

              {/* Tab navigation */}
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                {TABS.findIndex(t=>t.id===activeTab) > 0 && (
                  <button onClick={() => setActiveTab(TABS[TABS.findIndex(t=>t.id===activeTab)-1].id)}
                    style={{ fontSize:12, color:DS.fm, background:'transparent', border:`1px solid ${DS.border}`, borderRadius:'.4rem', padding:'6px 14px', cursor:'pointer' }}>
                    ← Back
                  </button>
                )}
                {TABS.findIndex(t=>t.id===activeTab) < TABS.length-1 && (
                  <button onClick={() => setActiveTab(TABS[TABS.findIndex(t=>t.id===activeTab)+1].id)}
                    style={{ fontSize:12, color:'#fff', background:DS.blue, border:'none', borderRadius:'.4rem', padding:'6px 14px', cursor:'pointer', marginLeft:'auto' }}>
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Live Preview */}
          <div style={{ background:DS.card, border:`1px solid ${DS.border}`, borderRadius:'.75rem', overflow:'hidden', position:'sticky' as const, top:'5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:`1px solid ${DS.border}`, background:'rgba(255,255,255,.02)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <FileText size={13} color={DS.fm}/>
                <span style={{ fontSize:12, fontWeight:700, color:DS.fm, textTransform:'uppercase' as const, letterSpacing:'.5px' }}>Live Preview</span>
                <span style={{ fontSize:10, color:tpl.accent, fontWeight:700, padding:'1px 7px', borderRadius:99, background:tpl.accent+'22', border:`1px solid ${tpl.accent}40` }}>{tpl.name}</span>
              </div>
              <span style={{ fontSize:10, color:DS.fm }}>Updates as you type</span>
            </div>
            <div style={{ height:'70vh', overflowY:'auto' as const, background:'#f5f5f0' }}>
              <div dangerouslySetInnerHTML={{ __html: tpl.render(resume) }}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumeStudio;
