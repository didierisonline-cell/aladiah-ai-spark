import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/portal/courses', { replace: true }); }, []);
  return null;
}
