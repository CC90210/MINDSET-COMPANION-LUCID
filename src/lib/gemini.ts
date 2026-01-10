import { GoogleGenerativeAI } from '@google/generative-ai';
import { CC_SYSTEM_PROMPT, DEEP_DIVE_MODIFIER, formatUserContext, formatConversationHistory } from './ai-prompt';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface UserContext {
    name: string;
    onboarding?: {
        currentStruggle?: string;
        desiredOutcome?: string;
    };
    streak?: number;
}

export interface ChatOptions {
    deepDive?: boolean;
    accountability?: boolean;
}

export async function generateCCResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userContext: UserContext,
    options: ChatOptions = {}
): Promise<string> {
    try {
        // Build the complete system prompt
        let systemPrompt = CC_SYSTEM_PROMPT;

        if (options.deepDive) {
            systemPrompt += DEEP_DIVE_MODIFIER;
        }

        // Add user context
        systemPrompt += formatUserContext(userContext);

        // Add conversation history
        systemPrompt += formatConversationHistory(conversationHistory);

        // Initialize the model
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.9,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: options.deepDive ? 1500 : 800,
            },
        });

        // Build the chat history format Gemini expects
        const geminiHistory = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Start chat with history
        const chat = model.startChat({
            history: geminiHistory.length > 0 ? geminiHistory : undefined,
            systemInstruction: systemPrompt,
        });

        // Send the message and get response
        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error('Empty response from AI');
        }

        return text;
    } catch (error) {
        console.error('Error generating CC response:', error);

        // Return a fallback response that stays in character
        return `Hey ${userContext.name || 'there'}, I hit a snag processing that. Mind trying again? Sometimes the best insights come on the second attempt.`;
    }
}

// Check for crisis keywords
export function checkForCrisisKeywords(message: string): boolean {
    const crisisKeywords = [
        'suicide',
        'suicidal',
        'kill myself',
        'end my life',
        'want to die',
        'don\'t want to live',
        'self harm',
        'self-harm',
        'cutting myself',
        'hurt myself',
        'no reason to live',
    ];

    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

// Generate crisis response with resources
export function getCrisisResponse(userName: string): string {
    return `${userName}, I hear you, and I want you to know that what you're feeling right now matters. This is serious, and I'm genuinely glad you said something.

I care about you, but this is bigger than what I can help with in a conversation. Please reach out to someone trained to help:

📞 **National Suicide Prevention Lifeline:** 988 (US)
💬 **Crisis Text Line:** Text HOME to 741741
🌍 **International:** iasp.info/resources/Crisis_Centres

You don't have to face this alone. These people are ready to listen right now.

Are you somewhere safe? Is there someone you trust you could reach out to?`;
}

// Suggest premium upgrade during breakthrough moments
export function detectBreakthroughMoment(conversationHistory: ChatMessage[]): boolean {
    if (conversationHistory.length < 6) return false;

    const recentMessages = conversationHistory.slice(-4);
    const userMessages = recentMessages.filter(m => m.role === 'user');

    // Look for signs of breakthrough
    const breakthroughIndicators = [
        'i never thought of it that way',
        'that makes so much sense',
        'wow',
        'you\'re right',
        'i needed to hear this',
        'this is exactly what',
        'that hit different',
        'holy shit',
        'damn',
        'i get it now',
    ];

    return userMessages.some(m =>
        breakthroughIndicators.some(indicator =>
            m.content.toLowerCase().includes(indicator)
        )
    );
}

// Generate coaching upsell suggestion
export function getCoachingUpsellMessage(userName: string): string {
    return `${userName}, the work you're doing here is real. The insights you're having? That's not small stuff.

If you're feeling called to go deeper — like, really dig into this with personalized guidance — I offer intensive coaching sessions. One conversation sometimes unlocks years of stuck patterns.

[Book a session → /coaching]

No pressure. This is your journey. I'm just pointing out a door if you want to walk through it.`;
}
