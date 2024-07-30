import { Storage } from "@plasmohq/storage";

const storage = new Storage();

//This will allow us to do setter/getter for dynamic function.
export async function initializeStorage() {
   //   https://unicode-table.com/

   //   Check if we already have something memorised;
   // TODO: CHECK THIS TRIPLE, it was already late at night!
   const initState = await storage.get("contextMenuItems");

   //   if (initState) {
   //     console.log(initState)
   //     return initState
   //   }

   const contextMenuItems: { [key: string]: Object } = {
      linkedinPostComment: {
         id: "linkedinPostComment",
         title: "💬 Comment Post",
         contexts: ["selection"],
         prompt:
            "You're a helpful assistant expert in replying to LinkedIn posts in the form of a comment. It needs to be short, sweet, and coherent to the message. Do not reply with any text, only the fixed sentence, and without any quotation marks. This is the message:",
         functionType: "callAI-copyClipboard",
      },
      grammarFixer: {
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
      side_summariseText: {
         id: "side_summariseText",
         title: "🔥 Summarise Text",
         contexts: ["selection"],
         prompt: `You're expert in summarising snippet of text; Give me only the summarisation of this text:`,
         functionType: "callAI-openSideBar",
      },
      callPhoneToTalkAboutSelection: {
         id: "callPhoneToTalkAboutSelection",
         title: "📱 Let's Talk about this",
         contexts: ["selection"],
         prompt: ``,
         functionType: "callVoice-ExternalNumber",
      },
      separator1: {
         id: "separator1",
         type: "separator",
         contexts: ["all"],
      },
      linkedinPostEmoji: {
         id: "linkedinPostEmoji",
         title: "Comment using only Emoji",
         contexts: ["selection"],
         functionType: "callAI-copyClipboard",
         prompt: `Respond to a LinkedIn post only using emojis but avoid hashtags`,
      },
      separator2: {
         id: "separator2",
         type: "separator",
         contexts: ["all"],
      },
      side_myOwnPromptSelection: {
         id: "side_myOwnPromptSelection",
         title: "Your Prompt",
         contexts: ["selection"],
         prompt: `Please provide your own prompt;`,
         functionType: "callAI-openSideBar",
      },
   };
   await storage.set("contextMenuItems", contextMenuItems);
   return await storage.get("contextMenuItems");
}
