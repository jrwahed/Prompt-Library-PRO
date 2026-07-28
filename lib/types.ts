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
  /** متى تستخدمه — السطر اللي بيظهر على الكارت. */
  whenToUse?: string;
  /** بيعمل إيه — شرح بالعربي البسيط لناتج البرومبت. */
  whatItDoes?: string;
  /** إزاي تستخدمه — خطوات مرقّمة. */
  howToUse: string[];
  /** عشان تطلع بأحسن نتيجة — نصايح عملية. */
  tips: string[];
  /** مثال جاهز لكل متغير — بيظهر كـ placeholder وبيملا الفورم بضغطة. */
  examples: Record<string, string>;
  template: string;
  variables: string[];
  chatCommands: string[];
}

export interface PromptLibrary {
  sections: PromptSection[];
  prompts: PromptEntry[];
  generatedAt: string;
}
