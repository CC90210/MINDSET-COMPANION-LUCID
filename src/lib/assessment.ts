// ===== LUCID MINDSET ASSESSMENT =====
// Questions, scoring logic, and archetypes

export interface AssessmentQuestion {
    id: string;
    question: string;
    options: {
        text: string;
        scores: {
            selfAwareness?: number;
            resilience?: number;
            growthOrientation?: number;
            emotionalRegulation?: number;
            innerDialogue?: number;
        };
    }[];
}

export interface LucidScores {
    selfAwareness: number;
    resilience: number;
    growthOrientation: number;
    emotionalRegulation: number;
    innerDialogue: number;
    overall: number;
}

export type MindsetArchetype =
    | 'The Overthinker'
    | 'The Grinder'
    | 'The Reactor'
    | 'The Dormant'
    | 'The Integrated';

export interface AssessmentResult {
    scores: LucidScores;
    archetype: MindsetArchetype;
    archetypeDescription: string;
    insight: string;
}

// Assessment questions with weighted scoring
export const assessmentQuestions: AssessmentQuestion[] = [
    {
        id: 'q1',
        question: "When something goes wrong, your first thought is usually...",
        options: [
            { text: "This always happens to me", scores: { selfAwareness: 2, resilience: 1, innerDialogue: 1 } },
            { text: "What can I learn from this?", scores: { selfAwareness: 5, growthOrientation: 5, resilience: 4 } },
            { text: "Who's to blame?", scores: { selfAwareness: 2, emotionalRegulation: 2, innerDialogue: 2 } },
            { text: "How do I fix it?", scores: { resilience: 5, growthOrientation: 4, selfAwareness: 3 } },
        ],
    },
    {
        id: 'q2',
        question: "How often do you compare yourself to others?",
        options: [
            { text: "Constantly — it's exhausting", scores: { selfAwareness: 3, innerDialogue: 1, emotionalRegulation: 2 } },
            { text: "Sometimes, but I catch myself", scores: { selfAwareness: 5, innerDialogue: 4, emotionalRegulation: 4 } },
            { text: "Rarely — I'm focused on my own path", scores: { selfAwareness: 5, innerDialogue: 5, emotionalRegulation: 5 } },
            { text: "Never thought about it", scores: { selfAwareness: 2, innerDialogue: 3, emotionalRegulation: 3 } },
        ],
    },
    {
        id: 'q3',
        question: "When you set a goal, you typically...",
        options: [
            { text: "Start strong, lose momentum", scores: { growthOrientation: 3, resilience: 2, emotionalRegulation: 3 } },
            { text: "Overthink and never start", scores: { selfAwareness: 4, resilience: 1, innerDialogue: 2, emotionalRegulation: 2 } },
            { text: "Grind until it's done", scores: { resilience: 5, growthOrientation: 4, selfAwareness: 2 } },
            { text: "Adjust as I go", scores: { resilience: 4, growthOrientation: 5, emotionalRegulation: 5, selfAwareness: 4 } },
        ],
    },
    {
        id: 'q4',
        question: "Your inner voice is usually...",
        options: [
            { text: "My biggest critic", scores: { innerDialogue: 1, emotionalRegulation: 2, selfAwareness: 4 } },
            { text: "Background noise I ignore", scores: { innerDialogue: 2, selfAwareness: 2, emotionalRegulation: 3 } },
            { text: "Supportive but realistic", scores: { innerDialogue: 5, selfAwareness: 5, emotionalRegulation: 5 } },
            { text: "My best coach", scores: { innerDialogue: 5, resilience: 4, growthOrientation: 5 } },
        ],
    },
    {
        id: 'q5',
        question: "When someone criticizes you...",
        options: [
            { text: "I shut down", scores: { emotionalRegulation: 1, resilience: 2, innerDialogue: 2 } },
            { text: "I get defensive", scores: { emotionalRegulation: 2, resilience: 3, innerDialogue: 2, selfAwareness: 3 } },
            { text: "I consider if it's valid", scores: { emotionalRegulation: 5, resilience: 4, selfAwareness: 5, growthOrientation: 5 } },
            { text: "I use it as fuel", scores: { resilience: 5, growthOrientation: 5, emotionalRegulation: 4 } },
        ],
    },
    {
        id: 'q6',
        question: "When facing a new challenge, you feel mostly...",
        options: [
            { text: "Anxious — what if I fail?", scores: { emotionalRegulation: 2, resilience: 2, innerDialogue: 2, growthOrientation: 3 } },
            { text: "Curious — this could be interesting", scores: { growthOrientation: 5, resilience: 4, emotionalRegulation: 4 } },
            { text: "Confident — I've handled worse", scores: { resilience: 5, innerDialogue: 4, emotionalRegulation: 4 } },
            { text: "Overwhelmed — where do I even start?", scores: { emotionalRegulation: 2, resilience: 2, selfAwareness: 3 } },
        ],
    },
    {
        id: 'q7',
        question: "How well do you understand why you react the way you do?",
        options: [
            { text: "Very well — I know my triggers", scores: { selfAwareness: 5, emotionalRegulation: 4, innerDialogue: 4 } },
            { text: "Sometimes it surprises me", scores: { selfAwareness: 3, emotionalRegulation: 3, innerDialogue: 3 } },
            { text: "I react first, understand later", scores: { selfAwareness: 2, emotionalRegulation: 2, innerDialogue: 2 } },
            { text: "I don't really think about it", scores: { selfAwareness: 1, emotionalRegulation: 2, innerDialogue: 2 } },
        ],
    },
    {
        id: 'q8',
        question: "After a hard day, you typically...",
        options: [
            { text: "Spiral into negative thoughts", scores: { emotionalRegulation: 1, innerDialogue: 1, resilience: 2 } },
            { text: "Distract myself completely", scores: { emotionalRegulation: 2, selfAwareness: 2, resilience: 3 } },
            { text: "Process it and let it go", scores: { emotionalRegulation: 5, innerDialogue: 5, resilience: 5, selfAwareness: 4 } },
            { text: "Push through — no time for feelings", scores: { resilience: 4, emotionalRegulation: 2, selfAwareness: 2 } },
        ],
    },
    {
        id: 'q9',
        question: "When thinking about your potential, you believe...",
        options: [
            { text: "I'm limited by who I am", scores: { growthOrientation: 1, innerDialogue: 2, resilience: 2 } },
            { text: "I could be more, but it's hard", scores: { growthOrientation: 3, selfAwareness: 4, resilience: 3 } },
            { text: "I'm actively becoming better", scores: { growthOrientation: 5, resilience: 4, innerDialogue: 4 } },
            { text: "I haven't really thought about it", scores: { growthOrientation: 2, selfAwareness: 2, innerDialogue: 2 } },
        ],
    },
    {
        id: 'q10',
        question: "Right now, you would describe yourself as...",
        options: [
            { text: "Stuck but wanting to change", scores: { selfAwareness: 4, growthOrientation: 4, resilience: 3, innerDialogue: 3, emotionalRegulation: 3 } },
            { text: "Generally fine, could be better", scores: { selfAwareness: 3, growthOrientation: 3, resilience: 4, innerDialogue: 4, emotionalRegulation: 4 } },
            { text: "Actively growing", scores: { selfAwareness: 5, growthOrientation: 5, resilience: 5, innerDialogue: 4, emotionalRegulation: 4 } },
            { text: "Struggling significantly", scores: { selfAwareness: 4, growthOrientation: 3, resilience: 2, innerDialogue: 2, emotionalRegulation: 2 } },
        ],
    },
];

// Calculate scores from answers
export function calculateScores(answers: number[]): LucidScores {
    const rawScores = {
        selfAwareness: 0,
        resilience: 0,
        growthOrientation: 0,
        emotionalRegulation: 0,
        innerDialogue: 0,
    };

    const counts = {
        selfAwareness: 0,
        resilience: 0,
        growthOrientation: 0,
        emotionalRegulation: 0,
        innerDialogue: 0,
    };

    // Sum up all scores from answers
    answers.forEach((answerIndex, questionIndex) => {
        const question = assessmentQuestions[questionIndex];
        const selectedOption = question.options[answerIndex];

        Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
            rawScores[dimension as keyof typeof rawScores] += score;
            counts[dimension as keyof typeof counts]++;
        });
    });

    // Normalize to 0-100 with floor of 35 and ceiling of 95
    const normalize = (score: number, count: number): number => {
        if (count === 0) return 50;
        const maxPossible = count * 5;
        const percentage = (score / maxPossible) * 100;
        // Apply floor and ceiling
        const normalized = Math.max(35, Math.min(95, percentage * 0.8 + 20));
        return Math.round(normalized);
    };

    const scores: LucidScores = {
        selfAwareness: normalize(rawScores.selfAwareness, counts.selfAwareness),
        resilience: normalize(rawScores.resilience, counts.resilience),
        growthOrientation: normalize(rawScores.growthOrientation, counts.growthOrientation),
        emotionalRegulation: normalize(rawScores.emotionalRegulation, counts.emotionalRegulation),
        innerDialogue: normalize(rawScores.innerDialogue, counts.innerDialogue),
        overall: 0,
    };

    // Calculate overall as weighted average
    scores.overall = Math.round(
        (scores.selfAwareness * 0.2 +
            scores.resilience * 0.2 +
            scores.growthOrientation * 0.2 +
            scores.emotionalRegulation * 0.2 +
            scores.innerDialogue * 0.2)
    );

    return scores;
}

// Determine archetype from scores
export function determineArchetype(scores: LucidScores): MindsetArchetype {
    const { selfAwareness, resilience, growthOrientation, emotionalRegulation, innerDialogue } = scores;

    // The Integrated: All dimensions above 70
    if (selfAwareness >= 70 && resilience >= 70 && growthOrientation >= 70 &&
        emotionalRegulation >= 70 && innerDialogue >= 70) {
        return 'The Integrated';
    }

    // The Dormant: All dimensions below 55
    if (selfAwareness < 55 && resilience < 55 && growthOrientation < 55 &&
        emotionalRegulation < 55 && innerDialogue < 55) {
        return 'The Dormant';
    }

    // The Overthinker: High awareness + Low regulation
    if (selfAwareness >= 65 && emotionalRegulation < 55) {
        return 'The Overthinker';
    }

    // The Grinder: High resilience + Low awareness
    if (resilience >= 65 && selfAwareness < 55) {
        return 'The Grinder';
    }

    // The Reactor: High growth orientation + Low regulation
    if (growthOrientation >= 65 && emotionalRegulation < 55) {
        return 'The Reactor';
    }

    // Default based on lowest dimension
    const min = Math.min(selfAwareness, resilience, growthOrientation, emotionalRegulation, innerDialogue);

    if (min === emotionalRegulation) return 'The Reactor';
    if (min === selfAwareness) return 'The Grinder';
    if (min === resilience) return 'The Overthinker';
    if (min === innerDialogue) return 'The Overthinker';

    return 'The Dormant';
}

// Get archetype details
export function getArchetypeDetails(archetype: MindsetArchetype): { description: string; insight: string } {
    const details: Record<MindsetArchetype, { description: string; insight: string }> = {
        'The Overthinker': {
            description: "High awareness, but you get stuck in your head. You see everything clearly — except the exit from your own mind.",
            insight: "You see everything clearly — except the exit from your own head.",
        },
        'The Grinder': {
            description: "You push through anything, but you might be pushing blind. Resilience without awareness can lead to burnout or building the wrong things.",
            insight: "You can survive anything. But are you building the right things?",
        },
        'The Reactor': {
            description: "You want to grow and you take action, but your emotions drive the bus. Learning to pause before acting is your edge.",
            insight: "Your fire is real. Learning to direct it? That's the next level.",
        },
        'The Dormant': {
            description: "There's potential here, waiting to be activated. You're not broken — you just haven't been shown the way yet.",
            insight: "You're not behind. You're just getting started.",
        },
        'The Integrated': {
            description: "Rare balance across all dimensions. You've done the work. Now it's about maintaining and going deeper.",
            insight: "You've built something real. The question now is: what do you do with it?",
        },
    };

    return details[archetype];
}

// Generate full assessment result
export function generateAssessmentResult(answers: number[]): AssessmentResult {
    const scores = calculateScores(answers);
    const archetype = determineArchetype(scores);
    const { description, insight } = getArchetypeDetails(archetype);

    return {
        scores,
        archetype,
        archetypeDescription: description,
        insight,
    };
}

// Get score level for styling
export function getScoreLevel(score: number): 'low' | 'medium' | 'high' | 'excellent' {
    if (score < 45) return 'low';
    if (score < 60) return 'medium';
    if (score < 75) return 'high';
    return 'excellent';
}

// Format dimension name for display
export function formatDimensionName(dimension: keyof Omit<LucidScores, 'overall'>): string {
    const names: Record<keyof Omit<LucidScores, 'overall'>, string> = {
        selfAwareness: 'Self-Awareness',
        resilience: 'Resilience',
        growthOrientation: 'Growth Orientation',
        emotionalRegulation: 'Emotional Regulation',
        innerDialogue: 'Inner Dialogue',
    };
    return names[dimension];
}

// Get dimension emoji
export function getDimensionEmoji(dimension: keyof Omit<LucidScores, 'overall'>): string {
    const emojis: Record<keyof Omit<LucidScores, 'overall'>, string> = {
        selfAwareness: '🧠',
        resilience: '💪',
        growthOrientation: '📈',
        emotionalRegulation: '🧘',
        innerDialogue: '💬',
    };
    return emojis[dimension];
}
