// ===== LUCID MINDSET ASSESSMENT =====
// Questions, scoring logic, and archetypes based on Master Build Specification

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
            confidence?: number;
            discipline?: number;
            presence?: number;
            authenticity?: number;
            purposeClarity?: number;
        };
    }[];
}

export interface LucidScores {
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
}

export type MindsetArchetype =
    | 'The Overthinker'
    | 'The Grinder'
    | 'The Reactor'
    | 'The Performer'
    | 'The Drifter'
    | 'The Dormant'
    | 'The Phoenix'
    | 'The Integrated';

export interface AssessmentResult {
    scores: LucidScores;
    archetype: MindsetArchetype;
    archetypeDescription: string;
    insight: string;
}

// Assessment questions with weighted scoring mapping to 10 dimensions
export const assessmentQuestions: AssessmentQuestion[] = [
    {
        id: 'q1',
        question: "When something goes wrong, what's your first instinct?",
        options: [
            { text: "Figure out what I did wrong", scores: { selfAwareness: 4, innerDialogue: 2, confidence: 2 } },
            { text: "Get frustrated or shut down", scores: { resilience: 2, emotionalRegulation: 2, innerDialogue: 2 } },
            { text: "Look for who to blame", scores: { selfAwareness: 1, emotionalRegulation: 2, authenticity: 2 } },
            { text: "Accept it and move on", scores: { resilience: 5, emotionalRegulation: 5, presence: 4 } },
            { text: "Depends on the situation", scores: { selfAwareness: 3, emotionalRegulation: 3, presence: 3 } },
        ],
    },
    {
        id: 'q2',
        question: "How often does your mind replay conversations from the past?",
        options: [
            { text: "Constantly — I can't stop", scores: { presence: 1, innerDialogue: 1, emotionalRegulation: 2, selfAwareness: 4 } },
            { text: "Often, especially before sleep", scores: { presence: 2, innerDialogue: 2, emotionalRegulation: 3 } },
            { text: "Sometimes when triggered", scores: { presence: 3, innerDialogue: 3, emotionalRegulation: 4 } },
            { text: "Rarely", scores: { presence: 5, innerDialogue: 4, emotionalRegulation: 5 } },
            { text: "Almost never", scores: { presence: 5, innerDialogue: 5, emotionalRegulation: 5 } },
        ],
    },
    {
        id: 'q3',
        question: "When you look in the mirror, what's the first thought?",
        options: [
            { text: "Critical — something needs fixing", scores: { innerDialogue: 2, confidence: 2, authenticity: 2 } },
            { text: "Neutral — it is what it is", scores: { innerDialogue: 4, confidence: 4, authenticity: 4 } },
            { text: "Depends on the day", scores: { innerDialogue: 3, confidence: 3, emotionalRegulation: 3 } },
            { text: "Generally positive", scores: { innerDialogue: 5, confidence: 5, selfAwareness: 4 } },
            { text: "I don't really think about it", scores: { selfAwareness: 2, presence: 4, authenticity: 3 } },
        ],
    },
    {
        id: 'q4',
        question: "Someone gives you critical feedback. Your gut reaction?",
        options: [
            { text: "Defensive — they don't understand", scores: { growthOrientation: 2, emotionalRegulation: 2, authenticity: 3 } },
            { text: "Hurt — it feels personal", scores: { resilience: 2, confidence: 2, emotionalRegulation: 2 } },
            { text: "Curious — I want to understand", scores: { growthOrientation: 5, emotionalRegulation: 5, selfAwareness: 5 } },
            { text: "Grateful — I can use this", scores: { growthOrientation: 5, resilience: 5, purposeClarity: 4 } },
            { text: "Skeptical — are they qualified?", scores: { confidence: 4, growthOrientation: 3, authenticity: 4 } },
        ],
    },
    {
        id: 'q5',
        question: "You set a goal. Three weeks later, where are you?",
        options: [
            { text: "Haven't started — something comes up", scores: { discipline: 1, purposeClarity: 2, resilience: 2 } },
            { text: "Started strong, then faded", scores: { discipline: 2, resilience: 2, growthOrientation: 3 } },
            { text: "Making progress but inconsistent", scores: { discipline: 3, resilience: 3, growthOrientation: 4 } },
            { text: "On track — I do what I say", scores: { discipline: 5, authenticity: 5, purposeClarity: 5 } },
            { text: "Already pivoted to a different goal", scores: { purposeClarity: 2, growthOrientation: 4, resilience: 3 } },
        ],
    },
    {
        id: 'q6',
        question: "When you're alone with your thoughts, what's the vibe?",
        options: [
            { text: "Anxious — won't quiet down", scores: { innerDialogue: 1, presence: 1, emotionalRegulation: 2 } },
            { text: "Restless — I need distraction", scores: { presence: 2, discipline: 2, emotionalRegulation: 2 } },
            { text: "Neutral — just thinking", scores: { presence: 3, innerDialogue: 3, emotionalRegulation: 3 } },
            { text: "Peaceful — I enjoy the silence", scores: { presence: 5, innerDialogue: 5, emotionalRegulation: 5, selfAwareness: 5 } },
            { text: "Depends heavily on the day", scores: { emotionalRegulation: 3, presence: 3, innerDialogue: 3 } },
        ],
    },
    {
        id: 'q7',
        question: "How often do you say yes when you mean no?",
        options: [
            { text: "All the time — I can't help it", scores: { authenticity: 1, confidence: 2, emotionalRegulation: 2 } },
            { text: "Often — I hate disappointing people", scores: { authenticity: 2, confidence: 2, innerDialogue: 2 } },
            { text: "Sometimes — depends who's asking", scores: { authenticity: 3, confidence: 3, emotionalRegulation: 3 } },
            { text: "Rarely — I know my limits", scores: { authenticity: 4, confidence: 5, presence: 4 } },
            { text: "Almost never — my time is my time", scores: { authenticity: 5, confidence: 5, purposeClarity: 5 } },
        ],
    },
    // Adding 3 more to round out to 10 questions and ensure coverage for Purpose, Discipline, etc.
    {
        id: 'q8',
        question: "Do you know exactly what you're building toward in the next 3 years?",
        options: [
            { text: "No idea — I take it day by day", scores: { purposeClarity: 1, growthOrientation: 2, discipline: 2 } },
            { text: "Vague idea, but no plan", scores: { purposeClarity: 3, growthOrientation: 3, discipline: 2 } },
            { text: "I have a plan but feel stuck", scores: { purposeClarity: 4, growthOrientation: 3, discipline: 3 } },
            { text: "Crystal clear — I'm executing", scores: { purposeClarity: 5, growthOrientation: 5, discipline: 5 } },
            { text: "I suspect the plan is wrong", scores: { purposeClarity: 2, selfAwareness: 4, authenticity: 4 } },
        ],
    },
    {
        id: 'q9',
        question: "When you feel an uncomfortable emotion, you typically...",
        options: [
            { text: "Numb it (phone, food, etc)", scores: { emotionalRegulation: 1, selfAwareness: 2, discipline: 1 } },
            { text: "Spiral into it", scores: { emotionalRegulation: 2, resilience: 2, innerDialogue: 1 } },
            { text: "Analyze it intellectually", scores: { emotionalRegulation: 3, selfAwareness: 5, presence: 3 } },
            { text: "Feel it and let it pass", scores: { emotionalRegulation: 5, presence: 5, resilience: 5 } },
        ],
    },
    {
        id: 'q10',
        question: "How much of your daily life feels like 'performing' for others?",
        options: [
            { text: "Most of it — I wear a mask", scores: { authenticity: 1, confidence: 2, presence: 1 } },
            { text: "Some parts — work or social", scores: { authenticity: 3, confidence: 3, presence: 3 } },
            { text: "Very little — what you see is what you get", scores: { authenticity: 5, confidence: 5, presence: 5 } },
            { text: "I don't know who the 'real' me is", scores: { authenticity: 1, selfAwareness: 4, purposeClarity: 1 } },
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
        confidence: 0,
        discipline: 0,
        presence: 0,
        authenticity: 0,
        purposeClarity: 0,
    };

    const counts = {
        selfAwareness: 0,
        resilience: 0,
        growthOrientation: 0,
        emotionalRegulation: 0,
        innerDialogue: 0,
        confidence: 0,
        discipline: 0,
        presence: 0,
        authenticity: 0,
        purposeClarity: 0,
    };

    // Sum up all scores from answers
    answers.forEach((answerIndex, questionIndex) => {
        const question = assessmentQuestions[questionIndex];
        const selectedOption = question.options[answerIndex];

        Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
            if (rawScores.hasOwnProperty(dimension)) {
                rawScores[dimension as keyof typeof rawScores] += score;
                counts[dimension as keyof typeof counts]++;
            }
        });
    });

    // Normalize to 0-100 with floor of 35 and ceiling of 92
    const normalize = (score: number, count: number): number => {
        if (count === 0) return 50; // Default if no data points
        const maxPossible = count * 5;
        const percentage = (score / maxPossible) * 100;
        // Apply floor of 35 and ceiling of 92 as per spec
        const normalized = Math.max(35, Math.min(92, percentage));
        return Math.round(normalized);
    };

    const scores: LucidScores = {
        selfAwareness: normalize(rawScores.selfAwareness, counts.selfAwareness),
        resilience: normalize(rawScores.resilience, counts.resilience),
        growthOrientation: normalize(rawScores.growthOrientation, counts.growthOrientation),
        emotionalRegulation: normalize(rawScores.emotionalRegulation, counts.emotionalRegulation),
        innerDialogue: normalize(rawScores.innerDialogue, counts.innerDialogue),
        confidence: normalize(rawScores.confidence, counts.confidence),
        discipline: normalize(rawScores.discipline, counts.discipline),
        presence: normalize(rawScores.presence, counts.presence),
        authenticity: normalize(rawScores.authenticity, counts.authenticity),
        purposeClarity: normalize(rawScores.purposeClarity, counts.purposeClarity),
        overall: 0,
    };

    // Calculate overall as weighted average of all 10 dimensions
    const sum = Object.values(scores).reduce((a, b) => a + b, 0) - scores.overall; // subtract 0 initialized overall
    scores.overall = Math.round(sum / 10);

    return scores;
}

// Determine archetype from scores based on spec logic
export function determineArchetype(scores: LucidScores): MindsetArchetype {
    const {
        selfAwareness, resilience, growthOrientation, emotionalRegulation,
        innerDialogue, confidence, discipline, presence, authenticity, purposeClarity
    } = scores;

    // The Integrated: All dimensions above 70
    const allAbove70 = Object.values(scores).every(val => val >= 70);
    if (allAbove70) return 'The Integrated';

    // The Dormant: All dimensions below 55 (Spec says "All below 55")
    const allBelow55 = Object.values(scores).every(val => val < 55);
    if (allBelow55) return 'The Dormant';

    // The Overthinker: High awareness, low confidence, low presence
    if (selfAwareness >= 65 && presence < 55) return 'The Overthinker';

    // The Grinder: High discipline, low self-awareness, low authenticity
    if (discipline >= 65 && selfAwareness < 55) return 'The Grinder';

    // The Reactor: High growth orientation, low regulation, low presence
    if (growthOrientation >= 65 && emotionalRegulation < 55) return 'The Reactor';

    // The Performer: High confidence, low authenticity, low inner dialogue
    if (confidence >= 65 && authenticity < 55) return 'The Performer';

    // The Drifter: Low purpose, low discipline, medium awareness
    if (purposeClarity < 50 && discipline < 50 && selfAwareness > 50) return 'The Drifter';

    // The Phoenix: Rapid improvement (hard to measure in static, require history) -> Fallback or generic logic
    // For static assessment, we might map high Growth + Resilience but low others?
    if (growthOrientation > 75 && resilience > 75) return 'The Phoenix';

    // Fallbacks based on lowest/highest dominants
    if (emotionalRegulation < 45) return 'The Reactor';
    if (presence < 45) return 'The Overthinker';
    if (purposeClarity < 45) return 'The Drifter';

    return 'The Dormant';
}

// Get archetype details
export function getArchetypeDetails(archetype: MindsetArchetype): { description: string; insight: string } {
    const details: Record<MindsetArchetype, { description: string; insight: string }> = {
        'The Overthinker': {
            description: "High awareness, but you get stuck in your head. You analyze everything to death.",
            insight: "You see everything clearly — except the exit from your own head.",
        },
        'The Grinder': {
            description: "High discipline and resilience, but often at the cost of your true self. You push through blindly.",
            insight: "You're crushing it — but for whose dream?",
        },
        'The Reactor': {
            description: "High energy and growth desire, but emotions drive the bus. You react before you can choose.",
            insight: "All gas, no steering wheel.",
        },
        'The Performer': {
            description: "High confidence on the outside, but hiding who you really are. The mask is getting heavy.",
            insight: "The mask is getting heavy.",
        },
        'The Drifter': {
            description: "You feel like you're floating without an anchor. You know something's off but can't name it.",
            insight: "You know something's off but can't name it.",
        },
        'The Dormant': {
            description: "You have massive potential that is currently sleeping. You aren't broken, just inactive.",
            insight: "There's so much in there waiting to wake up.",
        },
        'The Phoenix': {
            description: "You've been through the fire and you're rebuilding. Your growth is your strongest asset.",
            insight: "You've been through hell. Now you're building.",
        },
        'The Integrated': {
            description: "You have found balance across the board. The work now is maintenance and depth.",
            insight: "You've done the work. Keep going.",
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
    if (score < 55) return 'low';
    if (score < 70) return 'medium';
    if (score < 85) return 'high';
    return 'excellent';
}

// Format dimension name for display
export function formatDimensionName(dimension: keyof Omit<LucidScores, 'overall'>): string {
    // Convert camelCase to Title Case
    // e.g. selfAwareness -> Self Awareness
    const result = dimension.replace(/([A-Z])/g, " $1");
    const final = result.charAt(0).toUpperCase() + result.slice(1);
    return final;
}

// Get dimension emoji
export function getDimensionEmoji(dimension: keyof Omit<LucidScores, 'overall'>): string {
    const emojis: Record<keyof Omit<LucidScores, 'overall'>, string> = {
        selfAwareness: '🧠',
        resilience: '🛡️',
        growthOrientation: '📈',
        emotionalRegulation: '🧘',
        innerDialogue: '💬',
        confidence: '🦁',
        discipline: '⚡',
        presence: '👁️',
        authenticity: '🎭',
        purposeClarity: '🧭',
    };
    return emojis[dimension] || '✨';
}
