import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    CC_SYSTEM_PROMPT,
    DEEP_DIVE_MODIFIER,
    formatUserContext,
    formatConversationHistory,
    checkForCrisis,
    CRISIS_RESPONSE
} from './ai-prompt';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export interface UserContext {
    name: string;
    lucidScores?: {
        selfAwareness: number;
        resilience: number;
        growthOrientation: number;
        emotionalRegulation: number;
        innerDialogue: number;
        confidence: number;
        discipline: number;
        presence: number;
        authenticity: number;
        purposeClarity: number;
        overall: number;
    };
    archetype?: string;
    currentStruggle?: string;
    desiredOutcome?: string;
    streak?: number;
    level?: number;
    xp?: number;
    daysInApp?: number;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatOptions {
    deepDive?: boolean;
}

// Check for crisis keywords
export function checkForCrisisKeywords(message: string): boolean {
    return checkForCrisis(message);
}

// Get crisis response
export function getCrisisResponse(name: string): string {
    return CRISIS_RESPONSE(name);
}

// Generate CC response
export async function generateCCResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userContext: UserContext,
    options: ChatOptions = {}
): Promise<string> {
    try {
        // Check for crisis keywords first
        if (checkForCrisis(userMessage)) {
            return CRISIS_RESPONSE(userContext.name);
        }

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

        // Format chat history for Gemini
        const history = conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Start chat with system prompt
        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: 'You are Lucid, the AI companion. Here is your complete system context and personality guide:\n\n' + systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: `Got it. I'm Lucid. Ready to help ${userContext.name || 'this person'} get lucid. What's on their mind?` }],
                },
                ...history.slice(0, -1), // Don't include the current message in history
            ],
        });

        // Send the current message
        const result = await chat.sendMessage(userMessage);
        const response = result.response.text();

        return response;
    } catch (error) {
        console.error('Error generating CC response:', error);
        // Return a fallback response that stays in character
        return `${userContext.name || 'Hey'}, something's off on my end. Mind trying that again? Sometimes the best insights come on the second attempt.`;
    }
}

// Detect breakthrough moment for coaching upsell
export function detectBreakthroughMoment(
    messages: ChatMessage[],
    currentResponse: string
): boolean {
    if (messages.length < 6) return false; // Need enough conversation

    const breakthroughIndicators = [
        'never thought of it that way',
        'you\'re right',
        'that makes so much sense',
        'i didn\'t realize',
        'i see it now',
        'that hit different',
        'okay wow',
        'this is exactly what i needed',
    ];

    const recentUserMessages = messages
        .filter(m => m.role === 'user')
        .slice(-3)
        .map(m => m.content.toLowerCase());

    return recentUserMessages.some(msg =>
        breakthroughIndicators.some(indicator => msg.includes(indicator))
    );
}

// Generate coaching suggestion based on context
export function generateCoachingUpsell(userContext: UserContext): string {
    const archetype = userContext.archetype || '';

    const upsells: Record<string, string> = {
        'The Overthinker': `${userContext.name}, you're doing real work here. The clarity you're finding in these conversations — imagine going even deeper. If you ever want to break through the overthinking pattern with a real conversation, I do 1:1 calls. No sales pitch, just genuine exploration.`,
        'The Grinder': `${userContext.name}, you've got the work ethic. What you might need is direction. If you want to make sure you're building toward the right things, I offer 1:1 calls. Could be worth exploring.`,
        'The Reactor': `${userContext.name}, your energy is your asset. Learning to channel it? That's the unlock. If you want personalized strategies for that, I do 1:1 calls. Something to consider.`,
        default: `${userContext.name}, you're showing up differently now than when we started. If you want to accelerate that shift with a real conversation, I offer 1:1 calls. Just putting it on your radar.`,
    };

    return upsells[archetype] || upsells.default;
}

// Format upgrade prompt for rate-limited users
export function getRateLimitMessage(name: string, messagesRemaining: number): string {
    if (messagesRemaining === 0) {
        return `${name}, we've hit the daily limit for free accounts. Tomorrow's a new day — or Lucid Premium unlocks unlimited conversations. Either way, I'll be here.`;
    }
    if (messagesRemaining === 1) {
        return `One message left today, ${name}. Make it count. Or, you know, Premium is always an option.`;
    }
    return '';
}
