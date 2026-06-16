import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import FounderShell from '@/components/founder/FounderShell';
import AcademyReadinessPanel from '@/components/admin/curriculum/AcademyReadinessPanel';
import CurriculumExcellenceDashboard from '@/components/admin/curriculum/CurriculumExcellenceDashboard';

/** /admin/curriculum-excellence — Curriculum Excellence Authority. */
const CurriculumExcellence = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate('/auth'); }, [loading, user, navigate]);
  return (
    <FounderShell>
        <AcademyReadinessPanel />
        <CurriculumExcellenceDashboard />
      </FounderShell>
  );
};

export default CurriculumExcellence;
