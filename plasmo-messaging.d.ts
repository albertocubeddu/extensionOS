import "@plasmohq/messaging";

import type {
   RequestBody as CallOpenAIReturnRequestBody,
   RequestResponse as CallOpenAIReturnRequestResponse,
} from "./background/messages/callOpenAIReturn";
import type {
   RequestBody as CopyTextToClipboardRequestBody,
   RequestResponse as CopyTextToClipboardRequestResponse,
} from "./background/messages/copyTextToClipboard";
import type {
   RequestBody as CreateVoiceCallRequestBody,
   RequestResponse as CreateVoiceCallRequestResponse,
} from "./background/messages/createVoiceCall";
import type {
   RequestBody as IdentityRequestBody,
   RequestResponse as IdentityRequestResponse,
} from "./background/messages/identity";
import type {
   RequestBody as InitializeContextMenuItemsRequestBody,
   RequestResponse as InitializeContextMenuItemsRequestResponse,
} from "./background/messages/initializeContextMenuItems";
import type {
   RequestBody as OpenOptionPageRequestBody,
   RequestResponse as OpenOptionPageRequestResponse,
} from "./background/messages/openOptionPage";
import type {
   RequestBody as OpenSidePanelRequestBody,
   RequestResponse as OpenSidePanelRequestResponse,
} from "./background/messages/openSidePanel";
import type {
   RequestBody as RunContextMenuActionRequestBody,
   RequestResponse as RunContextMenuActionRequestResponse,
} from "./background/messages/runContextMenuAction";
import type {
   RequestBody as RunMixtureOfAgentsRequestBody,
   RequestResponse as RunMixtureOfAgentsRequestResponse,
} from "./background/messages/runMixtureOfAgents";
import type {
   RequestBody as SaveContextMenuItemsRequestBody,
   RequestResponse as SaveContextMenuItemsRequestResponse,
} from "./background/messages/saveContextMenuItems";
import type {
   RequestBody as SendLoadingActionRequestBody,
   RequestResponse as SendLoadingActionRequestResponse,
} from "./background/messages/sendLoadingAction";
import type {
   RequestBody as SendToSidepanelRequestBody,
   RequestResponse as SendToSidepanelRequestResponse,
} from "./background/messages/sendToSidepanel";

type MessageContract<RequestBody, ResponseBody> = {
   request: RequestBody;
   response: ResponseBody;
};

declare module "@plasmohq/messaging" {
   interface MessagesMetadata {
      callOpenAIReturn: MessageContract<
         CallOpenAIReturnRequestBody,
         CallOpenAIReturnRequestResponse
      >;
      copyTextToClipboard: MessageContract<
         CopyTextToClipboardRequestBody,
         CopyTextToClipboardRequestResponse
      >;
      createVoiceCall: MessageContract<
         CreateVoiceCallRequestBody,
         CreateVoiceCallRequestResponse
      >;
      identity: MessageContract<IdentityRequestBody, IdentityRequestResponse>;
      initializeContextMenuItems: MessageContract<
         InitializeContextMenuItemsRequestBody,
         InitializeContextMenuItemsRequestResponse
      >;
      openOptionPage: MessageContract<
         OpenOptionPageRequestBody,
         OpenOptionPageRequestResponse
      >;
      openSidePanel: MessageContract<
         OpenSidePanelRequestBody,
         OpenSidePanelRequestResponse
      >;
      runContextMenuAction: MessageContract<
         RunContextMenuActionRequestBody,
         RunContextMenuActionRequestResponse
      >;
      runMixtureOfAgents: MessageContract<
         RunMixtureOfAgentsRequestBody,
         RunMixtureOfAgentsRequestResponse
      >;
      saveContextMenuItems: MessageContract<
         SaveContextMenuItemsRequestBody,
         SaveContextMenuItemsRequestResponse
      >;
      sendLoadingAction: MessageContract<
         SendLoadingActionRequestBody,
         SendLoadingActionRequestResponse
      >;
      sendToSidepanel: MessageContract<
         SendToSidepanelRequestBody,
         SendToSidepanelRequestResponse
      >;
   }
}
