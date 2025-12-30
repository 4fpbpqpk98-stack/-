export enum Category {
  ALL = '総合',
  MENTAL = 'メンタルヘルス',
  BEHAVIOR = '行動心理学',
  LOVE = '恋愛心理学',
  WORK = '仕事・人間関係',
  BRAIN = '脳科学',
  SOCIAL = '社会心理学'
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface GeneratedArticle {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown-like content
  category: Category;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  sources: GroundingSource[];
  viewCount: number;
}

export interface GenerationRequest {
  topic: string;
  category: Category;
}