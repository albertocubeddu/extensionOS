import "@plasmohq/messaging";

declare module "@plasmohq/messaging" {
   interface MessagesMetadata {
      callOpenAIReturn: {};
      copyTextToClipboard: {};
      identity: {};
      openOptionPage: {};
      openSidePanel: {};
      sendLoadingAction: {};
      sendToSidepanel: {};
   }
}
