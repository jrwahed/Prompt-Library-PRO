export interface PromptSection {
  id: string;
  number: number;
  emoji: string;
  name: string;
  intro?: string;
}

export interface PromptEntry {
  id: string;
  code: string;
  sectionId: string;
  title: string;
  whenToUse?: string;
  template: string;
  variables: string[];
  chatCommands: string[];
}

export interface PromptLibrary {
  sections: PromptSection[];
  prompts: PromptEntry[];
  generatedAt: string;
}
