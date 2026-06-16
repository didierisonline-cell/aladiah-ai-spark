import PortalShell from '@/components/portal/PortalShell';
import ResourcesLibrary from '@/components/ResourcesLibrary';

export default function PortalResources() {
  return (
    <PortalShell background="#060E1C">
        <div style={{ flex: 1, minHeight: 'calc(100vh - 70px)', overflowX: 'hidden', padding: '32px 40px' }}>
          <ResourcesLibrary />
        </div>
    </PortalShell>
  );
}
