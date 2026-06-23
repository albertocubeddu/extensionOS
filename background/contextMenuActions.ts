import { openOptionsPageHandler } from "~background/messages/openOptionPage";
import { copyTextToClipboardHandler } from "~background/messages/copyTextToClipboard";
import { sendLoadingActionHandler } from "~background/messages/sendLoadingAction";
import {
   isChromeApiError,
   sendRuntimeMessage,
   type ChromeApiResult,
} from "~lib/chromeApi";
import {
   normalizeContextMenuItems,
   type ContextMenuItem,
} from "~lib/configurations/contextMenuItems";
import { callOpenAIReturn, type ApiResponse } from "~lib/openAITypeCall";
import { extensionStorage, STORAGE_KEYS } from "~lib/storage";
import { createCall, type CreateCallResponse } from "~lib/vapiOutbound";

export type ContextMenuActionResponse =
   | {
        ok: true;
        action:
           | "copyToClipboard"
           | "openOptionsPage"
           | "openSidePanel"
           | "voiceCall";
        data?: unknown;
     }
   | {
        ok: false;
        error: string;
     };

function toErrorResponse(error: unknown): ContextMenuActionResponse {
   return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
   };
}

async function executeContextMenuAction(
   element: ContextMenuItem,
   selectedText?: string
): Promise<ContextMenuActionResponse> {
   try {
      if (element.id === "configuration") {
         const result = await openOptionsPageHandler();
         return {
            ok: true,
            action: "openOptionsPage",
            data: result,
         };
      }

      let response: ApiResponse<string> | undefined;
      let chromeResult: ChromeApiResult<void> | undefined;
      let voiceResult: CreateCallResponse | undefined;

      switch (element.functionType) {
         case "callAI-copyClipboard":
            await sendLoadingActionHandler();
            response = await callOpenAIReturn(element.prompt ?? "", selectedText);
            chromeResult = await copyTextToClipboardHandler(response);

            if (isChromeApiError(chromeResult)) {
               return {
                  ok: false,
                  error: chromeResult.error,
               };
            }

            return {
               ok: true,
               action: "copyToClipboard",
               data: response,
            };

         case "callVoice-ExternalNumber":
            voiceResult = await createCall(
               element.prompt ?? "",
               selectedText ?? "",
               element.extraArgs?.vapiRecipientPhoneNumber ??
                  "Hi, this is your assistant calling. How can I help you?",
               element.extraArgs?.vapiFirstMessage ?? ""
            );

            if (voiceResult.ok === false) {
               return voiceResult;
            }

            return {
               ok: true,
               action: "voiceCall",
               data: voiceResult.data,
            };

         case "callAI-openSideBar":
            response = await callOpenAIReturn(element.prompt ?? "", selectedText);
            chromeResult = await sendRuntimeMessage({
               action: "send_to_sidepanel",
               payload: response.data,
            });

            if (isChromeApiError(chromeResult)) {
               return {
                  ok: false,
                  error: chromeResult.error,
               };
            }

            return {
               ok: true,
               action: "openSidePanel",
               data: response,
            };

         default:
            return {
               ok: false,
               error: `Unhandled function type: ${element.functionType}`,
            };
      }
   } catch (error) {
      return toErrorResponse(error);
   }
}

export async function runContextMenuActionById(
   itemId: unknown,
   selectedText?: string
): Promise<ContextMenuActionResponse> {
   const items = normalizeContextMenuItems(
      await extensionStorage.get(STORAGE_KEYS.contextMenuItems)
   );
   const element = items.find((item) => item.id === itemId);

   if (!element) {
      return {
         ok: false,
         error: `Unhandled menu item: ${String(itemId)}`,
      };
   }

   return executeContextMenuAction(element, selectedText);
}
