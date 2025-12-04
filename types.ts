export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type BlockType = 'text' | 'code' | 'image' | 'callout';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text content, code string, or image URL
  language?: string; // For code blocks
  caption?: string; // For images
}

export interface Problem {
  id: string;
  title: string;
  link: string;
  difficulty: Difficulty;
  tags: string[];
  blocks: ContentBlock[];
  lastEdited: number;
  isFavorite: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  count?: number;
}
