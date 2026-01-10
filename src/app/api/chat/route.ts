import { NextRequest, NextResponse } from 'next/server';
import { generateCCResponse, checkForCrisisKeywords, getCrisisResponse } from '@/lib/gemini';

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
