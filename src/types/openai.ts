// ... (previous imports remain the same)

export interface OpenAIContextType {
  state: OpenAIState;
  connect: (apiKey: string) => Promise<void>;
  disconnect: () => void;
  selectAssistant: (assistant: Assistant) => void;
  goBack: () => void;
  proceedToChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  startResearchPhase: (phase: ResearchPhase, keyword: string) => Promise<boolean>;
  generateArticle: (content: string) => Promise<void>;
  updateUserContent: (content: Partial<UserContent>) => void;
  updateAssistant: (assistantId: string, changes: {
    model?: string;
    instructions?: string;
    tools?: Array<{ type: string }>;
    temperature?: number;
    topP?: number;
  }) => Promise<Assistant>;
}