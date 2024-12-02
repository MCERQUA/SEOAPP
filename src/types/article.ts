export interface ArticleSection {
  heading: string;
  content: string;
  subsections: ArticleSection[];
}

export interface ArticleStructure {
  title: string;
  sections: ArticleSection[];
}

export interface ResearchContent {
  topic?: {
    messages: Array<{ content: string }>;
  };
  intent?: {
    messages: Array<{ content: string }>;
  };
  structure?: {
    messages: Array<{ content: string }>;
  };
  tone?: {
    messages: Array<{ content: string }>;
  };
  outline?: {
    messages: Array<{ content: string }>;
  };
  visual?: {
    messages: Array<{ content: string }>;
  };
}