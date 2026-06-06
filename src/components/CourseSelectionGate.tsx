import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  title: string;
  description: string;
}

interface Props {
  userId: string;
  onCourseSelected: () => void;
}

const COURSE_ICONS: Record<string, string> = {
  'Scrum': '🏃',
  'Project Management': '📋',
  'PMP': '📋',
  'AI': '🤖',
  'Data': '📊',
  'Cyber': '🔒',
  'Solution': '🏗️',
  'DevOps': '⚙️',
  'Business': '💼',
};

const getCourseIcon = (title: string) => {
  for (const [key, icon] of Object.entries(COURSE_ICONS)) {
    if (title.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '📚';
};

export const CourseSelectionGate = ({ userId, onCourseSelected }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [switchUsed, setSwitchUsed] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
    checkCurrentSelection();
  }, []);

  const sbFetch = <T,>(promise: Promise<{ data: T | null; error: any }>, fallback: T, ms = 5000): Promise<T> =>
    Promise.race([
      promise.then(r => r.data ?? fallback),
      new Promise<T>(res => setTimeout(() => res(fallback), ms)),
    ]);

  const loadCourses = async () => {
    const data = await sbFetch(
      supabase.from('courses').select('id, title, description').eq('is_published', true).order('title'),
      []
    );
    setCourses(data);
  };

  const checkCurrentSelection = async () => {
    const data = await sbFetch(
      supabase.from('profiles').select('free_course_id, free_switch_used').eq('user_id', userId).maybeSingle(),
      null
    );
    if (data?.free_course_id) setCurrentSelection(data.free_course_id);
    if (data?.free_switch_used) setSwitchUsed(data.free_switch_used);
  };

  const handleConfirm = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    setSaveError(null);
    try {
      const updateData: any = { user_id: userId, free_course_id: selectedCourse, tier: 'starter' };
      if (currentSelection) updateData.free_switch_used = true;
      // supabase-js returns DB/RLS errors in `error` (it does NOT throw) — check it, and
      // only close the gate on success. Closing on a failed write caused the redirect loop.
      const { error } = await supabase.from('profiles').upsert(updateData, { onConflict: 'user_id' });
      if (error) {
        console.error('Course selection save failed:', error);
        setSaveError('Could not save your course selection. Please try again.');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error('Course selection save exception:', e);
      setSaveError('Could not save your course selection. Please try again.');
      setLoading(false);
      return;
    }
    onCourseSelected();
  };

  const selectedCourseName = courses.find(c => c.id === selectedCourse)?.title;

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a0f1e 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <GraduationCap className="w-8 h-8" style={{ color: '#818cf8' }} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Choose Your Free Course
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', maxWidth: '400px', margin: '0 auto' }}>
            Pick one course to explore with full Module 1 access. You can change your selection once before you start.
          </p>
          {currentSelection && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '100px', padding: '4px 14px' }}>
              <RefreshCw style={{ width: '12px', height: '12px', color: '#f59e0b' }} />
              <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>
                {switchUsed ? 'Switch already used — this is your locked course' : 'You can change this one more time'}
              </span>
            </div>
          )}
        </div>

        {/* Course Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {courses.map(course => {
            const isSelected = selectedCourse === course.id;
            const isCurrent = currentSelection === course.id;
            return (
              <div
                key={course.id}
                onClick={() => {
                  if (switchUsed && isCurrent) return; // locked
                  if (switchUsed && currentSelection && !isCurrent) return; // can't switch anymore
                  setSelectedCourse(course.id);
                }}
                style={{
                  border: isSelected ? '2px solid rgba(99,102,241,0.9)' : isCurrent ? '2px solid rgba(245,158,11,0.6)' : '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: (switchUsed && currentSelection && !isCurrent) ? 'not-allowed' : 'pointer',
                  background: isSelected ? 'rgba(99,102,241,0.12)' : isCurrent ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                  transition: 'all 0.2s',
                  opacity: (switchUsed && currentSelection && !isCurrent) ? 0.4 : 1,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '24px', flexShrink: 0 }}>{getCourseIcon(course.title)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>
                      {course.title}
                    </p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>
                      Module 1 free · Full access with All-Access Pass
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#6366f1', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle style={{ width: '12px', height: '12px', color: '#fff' }} />
                  </div>
                )}
                {isCurrent && !isSelected && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#f59e0b', borderRadius: '100px', padding: '2px 8px' }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#000' }}>CURRENT</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Confirm Button */}
        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={handleConfirm}
            disabled={!selectedCourse || loading}
            style={{ minWidth: '200px', height: '48px', fontSize: '15px', fontWeight: 700 }}
          >
            {loading ? 'Saving...' : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedCourseName ? `Start with ${selectedCourseName.split(':')[0]}` : 'Select a Course'}
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </span>
            )}
          </Button>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>
            Want all 8 courses? Upgrade to All-Access Pass for $99.99/month
          </p>
          {saveError && (
            <p style={{ fontSize: '12px', color: '#f87171', marginTop: '10px' }}>{saveError}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseSelectionGate;
