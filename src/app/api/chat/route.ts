import { NextRequest, NextResponse } from 'next/server';
import { generateCCResponse, checkForCrisisKeywords, getCrisisResponse } from '@/lib/gemini';

// Check if AI is configured
const isAIConfigured = !!process.env.GOOGLE_AI_API_KEY;

// Mock responses when AI isn't configured
const MOCK_RESPONSES = [
    "That's a good start. What's actually underneath that feeling?",
    "You already know the answer. You're just not ready to admit it yet.",
    "Interesting. Tell me more about why that matters to you.",
    "What would the version of you who's figured this out do right now?",
    "That tracks. What's the one thing you could do today to move forward?",
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, conversationHistory, userContext, options } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        if (!userContext?.name) {
            return NextResponse.json(
                { error: 'User context with name is required' },
                { status: 400 }
            );
        }

        // Check if AI is configured
        if (!isAIConfigured) {
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
            const personalizedResponse = userContext.name
                ? `${userContext.name}, ${randomResponse.toLowerCase()}`
                : randomResponse;

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            return NextResponse.json({
                response: personalizedResponse,
                isCrisis: false,
                isDemo: true
            });
        }

        // Check for crisis keywords first
        if (checkForCrisisKeywords(message)) {
            const crisisResponse = getCrisisResponse(userContext.name);
            return NextResponse.json({
                response: crisisResponse,
                isCrisis: true,
            });
        }

        // Generate AI response
        const response = await generateCCResponse(
            message,
            conversationHistory || [],
            userContext,
            options || {}
        );

        return NextResponse.json({
            response,
            isCrisis: false,
        });

    } catch (error) {
        console.error('Chat API error:', error);

        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}
