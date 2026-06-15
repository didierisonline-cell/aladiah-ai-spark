import Header from '@/components/Header';
import PortalSidebar from '@/components/PortalSidebar';
import ResourcesLibrary from '@/components/ResourcesLibrary';

export default function PortalResources() {
  return (
    <div style={{ background: '#060E1C', minHeight: '100vh', fontFamily: '"Inter",system-ui,sans-serif' }}>
      <Header />
      <div className="portal-shell" style={{ display: 'flex' }}>
        <PortalSidebar />
        <div style={{ flex: 1, minHeight: 'calc(100vh - 70px)', overflowX: 'hidden', padding: '32px 40px' }}>
          <ResourcesLibrary />
        </div>
      </div>
    </div>
  );
}
