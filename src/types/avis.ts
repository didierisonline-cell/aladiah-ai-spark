export type AvisAssetType =
  | 'hero_diagram'
  | 'framework'
  | 'process_flow'
  | 'knowledge_map'
  | 'timeline'
  | 'decision_tree'
  | 'architecture'
  | 'attack_chain'
  | 'roadmap';

export type AvisFormat = 'svg' | 'rive' | 'react_flow' | 'image';

export type AvisAsset = {
  id: string;
  courseId: string;           // curriculum_version e.g. 'cyber-v1'
  moduleIndex: number;        // chapter order_index (1-based)
  lessonIndex?: number;       // video order_index (1-based); undefined = module-level
  title: string;
  type: AvisAssetType;
  format: AvisFormat;
  description: string;
  learningObjective: string;
  svgKey: string;             // key into AVIS_SVG_REGISTRY
  interactiveConfig?: object;
  transcriptAnchor?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
