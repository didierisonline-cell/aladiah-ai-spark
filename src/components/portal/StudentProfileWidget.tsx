import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, Linkedin, Phone, CreditCard, X, ChevronRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface Props {
  user: any;
  onClose: () => void;
}

export default function StudentProfileWidget({ user, onClose }: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone_number || '');
  const [linkedIn, setLinkedIn] = useState(
    user?.user_metadata?.linkedin_url ||
    localStorage.getItem('linkedin-url-' + user?.id) || ''
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, phone_number: phone, linkedin_url: linkedIn }
      });
      if (error) throw error;
      if (linkedIn) localStorage.setItem('linkedin-url-' + user?.id, linkedIn);
      toast({ title: '✅ Profile updated!', description: 'Your changes have been saved.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' }); return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password too short', description: 'Minimum 6 characters.', variant: 'destructive' }); return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: '🔐 Password updated!', description: 'Your new password is active.' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const initials = fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2) || '?';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: '#0a1628', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#1e40af,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: 0 }}>{fullName || 'Student'}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: 0 }}>{user?.email}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400, color: activeTab === tab.id ? '#60a5fa' : 'rgba(255,255,255,0.4)', borderBottom: activeTab === tab.id ? '2px solid #60a5fa' : '2px solid transparent', transition: 'all 0.15s' }}>
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Field label="Full Name" icon={<User className="w-4 h-4" />} value={fullName} onChange={setFullName} placeholder="Your full name" />
                <Field label="Email" icon={<Mail className="w-4 h-4" />} value={user?.email || ''} onChange={()=>{}} placeholder="Email" disabled type="email" hint="Email cannot be changed" />
                <Field label="Phone Number" icon={<Phone className="w-4 h-4" />} value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" type="tel" />
                <Field label="LinkedIn Profile" icon={<Linkedin className="w-4 h-4" />} value={linkedIn} onChange={setLinkedIn} placeholder="https://linkedin.com/in/yourname" type="url" />
                {linkedIn && (
                  <a href={linkedIn.startsWith('http') ? linkedIn : 'https://'+linkedIn} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.3)', borderRadius: '10px', textDecoration: 'none', color: '#60a5fa', fontSize: '13px' }}>
                    <span>💼</span> View LinkedIn Profile <ChevronRight className="w-3 h-3 ml-auto" />
                  </a>
                )}
                <SaveButton loading={loading} onClick={saveProfile} label="Save Profile" />
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '14px', background: 'rgba(59,130,246,0.08)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <p style={{ color: '#60a5fa', fontSize: '12px', fontWeight: 600, margin: '0 0 4px' }}>🔐 Magic Link Verification</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0 }}>Your account is protected with a secure login link sent to your email on every login.</p>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, margin: 0 }}>Change Password</p>
                <div style={{ position: 'relative' }}>
                  <Lock className="w-4 h-4" style={{ position: 'absolute', left: 12, top: 12, color: 'rgba(255,255,255,0.3)' }} />
                  <input type={showPassword ? 'text' : 'password'} placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 40px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                  <button onClick={()=>setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock className="w-4 h-4" style={{ position: 'absolute', left: 12, top: 12, color: 'rgba(255,255,255,0.3)' }} />
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 40px', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <SaveButton loading={loading} onClick={changePassword} label="Update Password" />
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                  <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '0 0 4px' }}>Payment Methods</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>Billing management coming soon.</p>
                </div>
                <div style={{ padding: '14px', background: 'rgba(34,197,94,0.08)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <p style={{ color: '#4ade80', fontSize: '12px', fontWeight: 600, margin: '0 0 2px' }}>✅ Active Subscription</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', margin: 0 }}>Your account is in good standing.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, icon, value, onChange, placeholder, disabled, type='text', hint }: any) {
  return (
    <div>
      <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: 11, color: 'rgba(255,255,255,0.3)' }}>{icon}</span>
        <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
          style={{ width: '100%', background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px 10px 38px', color: disabled ? 'rgba(255,255,255,0.3)' : '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'auto' }} />
      </div>
      {hint && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  );
}

function SaveButton({ loading, onClick, label }: any) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ background: loading ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg,#1e40af,#2563eb)', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', width: '100%', marginTop: '4px' }}>
      {loading ? 'Saving...' : label}
    </button>
  );
}
