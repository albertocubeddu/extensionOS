export type ContextMenuFunctionType =
   | "callAI-copyClipboard"
   | "callAI-openSideBar"
   | "callVoice-ExternalNumber";

export type ChromeContextType = `${chrome.contextMenus.ContextType}`;
export type ChromeItemType = `${chrome.contextMenus.ItemType}`;

export type ContextMenuExtraArgs = {
   vapiFirstMessage?: string;
   vapiRecipientPhoneNumber?: string;
};

export type ContextMenuItem = {
   id: string;
   title?: string;
   contexts: [ChromeContextType, ...ChromeContextType[]];
   prompt?: string;
   functionType?: ContextMenuFunctionType;
   type?: ChromeItemType;
   extraArgs?: ContextMenuExtraArgs;
};

const SIDEBAR_PREFIX = "side_";
export const CONFIGURATION_MENU_ITEM_ID = "configuration";
export const DEACTIVATE_SELECTION_MENU_ITEM_ID = "deactivateSelectionMenu";

const BUILT_IN_UTILITY_MENU_ITEM_IDS = [
   CONFIGURATION_MENU_ITEM_ID,
   DEACTIVATE_SELECTION_MENU_ITEM_ID,
] as const;

const FUNCTION_TYPES: ContextMenuFunctionType[] = [
   "callAI-copyClipboard",
   "callAI-openSideBar",
   "callVoice-ExternalNumber",
];

const VALID_CONTEXTS: ChromeContextType[] = [
   "all",
   "page",
   "frame",
   "selection",
   "link",
   "editable",
   "image",
   "video",
   "audio",
   "launcher",
   "browser_action",
   "page_action",
   "action",
];

export const DEFAULT_CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
   {
      id: "postComment",
      title: "💬 Comment Post",
      contexts: ["selection"],
      prompt:
         "You're a helpful assistant expert in replying to Social Media posts in the form of a comment. It needs to be short, sweet, and coherent to the message. Do not reply with any text, only the fixed sentence, and without any quotation marks. This is the message:",
      functionType: "callAI-copyClipboard",
   },
   {
      id: "grammarFixer",
      title: "❗Grammar Fixer",
      contexts: ["selection"],
      prompt: `You're an expert teacher and you specialising in fixing grammar mistakes. Starting from an input phrase, you then think and fix it writing in English (Australian), and make the sentence fluent without changing the style or the tone of voice. Your goal is to provide only the fixed sentence.
  
         # Examples
        'I did go everyday to the gym' -> I go to the gym everyday
        
        Do not reply with any text, only the fixed sentence, and without any quotation marks.

        This is the sentence i want you to fix:`,
      functionType: "callAI-copyClipboard",
   },
   {
      id: "side_summariseText",
      title: "🔥 Summarise Text",
      contexts: ["selection"],
      prompt: `You're expert in summarising snippet of text; Give me only the summarisation of this text:`,
      functionType: "callAI-openSideBar",
   },
   {
      id: "callPhoneToTalkAboutSelection",
      title: "📱 Let's Talk about this",
      contexts: ["selection"],
      prompt: `You're an helpful assistent, specialised in analyse and discuss articles, papers and text in general; Your role is to engange in a conversation with me, where we can discuss about the text, i can ask for question and task such as summarisation, follow-up questions, explainations and much more.

## 1. Clarification and Understanding
- **Interpretation:** Help clarify and interpret the text provided, ensuring a clear understanding of its content and context.
- **Explanation:** Explain complex concepts or terms within the text, making them easier to grasp.

## 2. Discussion and Analysis
- **Critical Analysis:** Analyze the text's themes, arguments, and implications, offering a critical perspective.
- **Debate:** Engage in constructive debate, presenting different viewpoints and challenging assumptions to deepen the discussion.

## 3. Problem-Solving and Brainstorming
- **Idea Generation:** Generate ideas and solutions based on the text, whether for a project, strategy, or creative endeavor.
- **Strategic Planning:** Assist in creating action plans or strategies derived from the text's insights.

## 4. Support and Resources
- **Resource Provision:** Provide additional information, references, and resources to supplement the conversation.
- **Technical Support:** Offer explanations and practical advice if the text involves technical aspects.

## 5. Feedback and Improvement
- **Constructive Feedback:** Give feedback on thoughts, interpretations, or plans, helping to refine and improve them.
- **Iterative Improvement:** Iterate on ideas and drafts, continually improving them through collaborative discussion.

Adopt these roles to create a productive and enriching conversation that leverages our combined knowledge and perspectives.

# Text`,
      functionType: "callVoice-ExternalNumber",
   },
   {
      id: "linkedinPostEmoji",
      title: "👀 Comment using only Emoji",
      contexts: ["selection"],
      functionType: "callAI-copyClipboard",
      prompt: `Respond to a LinkedIn post only using emojis but avoid hashtags`,
   },
   {
      id: "separator1",
      type: "separator",
      contexts: ["all"],
   },
   {
      id: CONFIGURATION_MENU_ITEM_ID,
      title: "Setup Your Own Prompt",
      contexts: ["all"],
   },
   {
      id: DEACTIVATE_SELECTION_MENU_ITEM_ID,
      title: "Deactivate this menu",
      contexts: ["all"],
   },
];

export function isSidebarMenuId(id: unknown): id is string {
   return typeof id === "string" && id.startsWith(SIDEBAR_PREFIX);
}

export function isBuiltInUtilityMenuId(id: unknown): id is string {
   return (
      typeof id === "string" &&
      BUILT_IN_UTILITY_MENU_ITEM_IDS.includes(
         id as (typeof BUILT_IN_UTILITY_MENU_ITEM_IDS)[number]
      )
   );
}

export function withSidebarMenuPrefix(id: string): string {
   return isSidebarMenuId(id) ? id : `${SIDEBAR_PREFIX}${id}`;
}

export function withoutSidebarMenuPrefix(id: string): string {
   return id.replace(new RegExp(`^${SIDEBAR_PREFIX}`), "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
   return typeof value === "object" && value !== null;
}

function normalizeContexts(
   contexts: unknown
): [ChromeContextType, ...ChromeContextType[]] {
   if (!Array.isArray(contexts)) {
      return ["selection"];
   }

   const validContexts = contexts.filter(
      (context): context is ChromeContextType =>
         typeof context === "string" &&
         VALID_CONTEXTS.includes(context as ChromeContextType)
   );

   return validContexts.length
      ? [validContexts[0], ...validContexts.slice(1)]
      : ["selection"];
}

function normalizeFunctionType(
   functionType: unknown
): ContextMenuFunctionType | undefined {
   if (
      typeof functionType === "string" &&
      FUNCTION_TYPES.includes(functionType as ContextMenuFunctionType)
   ) {
      return functionType as ContextMenuFunctionType;
   }

   return undefined;
}

function normalizeExtraArgs(extraArgs: unknown): ContextMenuExtraArgs | undefined {
   if (!isRecord(extraArgs)) {
      return undefined;
   }

   return {
      vapiFirstMessage:
         typeof extraArgs.vapiFirstMessage === "string"
            ? extraArgs.vapiFirstMessage
            : undefined,
      vapiRecipientPhoneNumber:
         typeof extraArgs.vapiRecipientPhoneNumber === "string"
            ? extraArgs.vapiRecipientPhoneNumber
            : undefined,
   };
}

function normalizeItem(value: unknown): ContextMenuItem | undefined {
   if (!isRecord(value) || typeof value.id !== "string") {
      return undefined;
   }

   const functionType = normalizeFunctionType(value.functionType);
   const type = value.type === "separator" ? "separator" : undefined;

   if (
      !type &&
      !isBuiltInUtilityMenuId(value.id) &&
      !functionType
   ) {
      return undefined;
   }

   let id = value.id;
   if (functionType === "callAI-openSideBar") {
      id = withSidebarMenuPrefix(id);
   } else {
      id = withoutSidebarMenuPrefix(id);
   }

   return {
      id,
      title: typeof value.title === "string" ? value.title : undefined,
      contexts: normalizeContexts(value.contexts),
      prompt: typeof value.prompt === "string" ? value.prompt : undefined,
      functionType,
      type,
      extraArgs: normalizeExtraArgs(value.extraArgs),
   };
}

function getDefaultContextMenuItem(id: string) {
   const item = DEFAULT_CONTEXT_MENU_ITEMS.find((item) => item.id === id);

   if (!item) {
      throw new Error(`Missing default context menu item: ${id}`);
   }

   return { ...item };
}

function insertAfterMenuItem(
   items: ContextMenuItem[],
   targetId: string,
   item: ContextMenuItem
) {
   const targetIndex = items.findIndex((candidate) => candidate.id === targetId);

   if (targetIndex === -1) {
      return [...items, item];
   }

   return [
      ...items.slice(0, targetIndex + 1),
      item,
      ...items.slice(targetIndex + 1),
   ];
}

function withBuiltInUtilityMenuItems(items: ContextMenuItem[]) {
   let normalizedItems = items;

   if (
      !normalizedItems.some(
         (item) => item.id === CONFIGURATION_MENU_ITEM_ID
      )
   ) {
      normalizedItems = [
         ...normalizedItems,
         getDefaultContextMenuItem(CONFIGURATION_MENU_ITEM_ID),
      ];
   }

   if (
      !normalizedItems.some(
         (item) => item.id === DEACTIVATE_SELECTION_MENU_ITEM_ID
      )
   ) {
      normalizedItems = insertAfterMenuItem(
         normalizedItems,
         CONFIGURATION_MENU_ITEM_ID,
         getDefaultContextMenuItem(DEACTIVATE_SELECTION_MENU_ITEM_ID)
      );
   }

   return normalizedItems;
}

export function normalizeContextMenuItems(value: unknown): ContextMenuItem[] {
   const candidateItems = Array.isArray(value) ? value : Object.values(value ?? {});
   const normalizedItems = candidateItems
      .map(normalizeItem)
      .filter((item): item is ContextMenuItem => Boolean(item));

   return normalizedItems.length
      ? withBuiltInUtilityMenuItems(normalizedItems)
      : DEFAULT_CONTEXT_MENU_ITEMS.map((item) => ({ ...item }));
}

export function toChromeContextMenuItems(
   items: unknown
): chrome.contextMenus.CreateProperties[] {
   return normalizeContextMenuItems(items).map((item) => {
      const chromeItem: chrome.contextMenus.CreateProperties = {
         id: item.id,
         contexts: item.contexts,
      };

      if (item.title) {
         chromeItem.title = item.title;
      }

      if (item.type) {
         chromeItem.type = item.type;
      }

      return chromeItem;
   });
}
