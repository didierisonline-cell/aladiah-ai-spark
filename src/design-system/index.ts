// =============================================================================
// Aladiah Design System (ADS) — Public API
//
// Import from here, not from individual files:
//   import { Button, Card, Badge, tokens } from '@/design-system'
//   import { color, space, fontSize } from '@/design-system/tokens'
// =============================================================================

// Tokens
export { default as tokens } from './tokens';
export { color, fontSize, fontWeight, lineHeight, fontFamily, space, radius, shadow, transition, zIndex } from './tokens';

// Components
export { default as Button } from './components/Button';
export { default as Card } from './components/Card';
export { default as Badge } from './components/Badge';
export { default as PageHeader } from './components/PageHeader';
export { default as SectionTitle } from './components/SectionTitle';

// Layouts
export { default as PortalPageLayout } from './layouts/PortalPageLayout';
