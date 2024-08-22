import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export interface IContextConfigItems {
   id: string; //The internal ID
   title?: string; //The display name
   contexts?: string[]; //Chrome Context (https://developer.chrome.com/docs/extensions/reference/api/contextMenus#enum)
   prompt?: string; //The prompt to be executed
   functionType?: string; //The functionality when you press the item (copyToClipboard, etc.)
   type?: string; //Used for the "separator"
   extraArgs?: any; //Used for the future
}

export async function initializeStorage() {
   //   https://unicode-table.com/

   if (process.env.NODE_ENV === "development") {
      //Useful to test a fresh-install
      // storage.removeAll();
   }

   const initState = await storage.get("contextMenuItems");

   if (initState) {
      return initState;
   }

   const contextMenuItems: IContextConfigItems[] = [
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
         id: "configuration",
         title: "Setup Your Own Prompt",
         contexts: ["all"],
      },
   ];
   await storage.set("contextMenuItems", contextMenuItems);
   return await storage.get("contextMenuItems");
}
