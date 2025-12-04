
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type BlockType = 'text' | 'code' | 'image' | 'callout';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string; // Text content, or primary code string, or image URL
  language?: string; // For code blocks (default/active language)
  codeSnippets?: Record<string, string>; // Map of language -> code
  caption?: string; // For images
}

export type MasteryStatus = 'learning' | 'mastered';

export interface Problem {
  id: string;
  title: string;
  link: string;
  difficulty: Difficulty;
  tags: string[];
  blocks: ContentBlock[];
  lastEdited: number;
  isFavorite: boolean;
  status: MasteryStatus;
}

export interface ActivityLog {
  id: string;
  problemId: string;
  problemTitle: string;
  type: 'create' | 'master'; // 'create' = added (learning), 'master' = mastered
  timestamp: number;
}

export interface NavItem {
  id: string;
  label: string;
  count?: number;
}
