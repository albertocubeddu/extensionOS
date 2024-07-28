import { Storage } from "@plasmohq/storage"

const systemPrompt = `
You're an helpful assistent, specialised in analyse and discuss articles, papers and text in general; Your role is to engange in a conversation with me, where we can discuss about the text, i can ask for question and task such as summarisation, follow-up questions, explainations and much more.

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

# Text
`


export const createCall = async (message: string) => {
  const storage = new Storage()

  // Your Vapi API Authorization token
  const authToken = await storage.get("voice_outbound_authToken")
  // The Phone Number ID, and the Customer details for the call
  const phoneNumberId = await storage.get("voice_outbound_phoneNumberId")
  const customerNumber = await storage.get(
    "voice_outbound_recipientPhoneNumber"
  )

  // Create the header with Authorization token
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json"
  }

  const data = {
    assistant: {
      firstMessage:
        "Hey, let's talk about the text you have selected; Ask me anything!",
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt + message
          }
        ]
      },
      voice: "jennifer-playht"
    },
    phoneNumberId: phoneNumberId,
    customer: {
      number: customerNumber
    }
  }

  try {
    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    })

    if (response.status === 201) {
      const responseData = await response.json()
      console.log("Call created successfully")
      console.log(responseData)
    } else {
      const errorData = await response.text()
      console.log("Failed to create call")
      console.log(errorData)
    }
  } catch (error) {
    console.error("Error creating call:", error)
  }
}

