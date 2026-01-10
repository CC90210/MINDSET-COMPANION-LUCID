'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Trash2, MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { TypingIndicator } from '@/components/ui/Loading';
import { useChatStore, useSubscriptionStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import {
    createConversation,
    getConversations,
    getMessages,
    addMessage,
    Conversation,
    checkMessageLimit,
    incrementMessageCount
} from '@/lib/firebase';
import { generateCCResponse, checkForCrisisKeywords, getCrisisResponse } from '@/lib/gemini';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatContainer() {
    const { user, profile } = useAuth();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const {
        currentConversationId,
        messages,
        isTyping,
        deepDiveMode,
        setCurrentConversation,
        setMessages,
        addMessage: addLocalMessage,
        setIsLoading,
        setIsTyping,
        clearChat
    } = useChatStore();

    const { tier, setMessagesRemaining, decrementMessages } = useSubscriptionStore();

    // Load conversations on mount
    useEffect(() => {
        if (user) {
            loadConversations();
            checkAndSetRateLimit();
        }
    }, [user]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const loadConversations = async () => {
        if (!user) return;
        const convos = await getConversations(user.uid);
        setConversations(convos);

        // Load most recent conversation if exists
        if (convos.length > 0 && !currentConversationId) {
            await loadConversation(convos[0].id);
        }
    };

    const loadConversation = async (conversationId: string) => {
        if (!user) return;

        setCurrentConversation(conversationId);
        const msgs = await getMessages(user.uid, conversationId);

        setMessages(msgs.map((m, i) => ({
            id: `msg-${i}`,
            role: m.role,
            content: m.content,
            timestamp: (m.timestamp as any)?.toDate ? (m.timestamp as any).toDate() :
                (m.timestamp as any)?.seconds ? new Date((m.timestamp as any).seconds * 1000) :
                    new Date(),
        })));

        setShowHistory(false);
    };

    const checkAndSetRateLimit = async () => {
        if (!user) return;
        const { remaining } = await checkMessageLimit(user.uid);
        setMessagesRemaining(remaining === Infinity ? 999 : remaining);
    };

    const startNewConversation = async () => {
        if (!user) return;

        const newConvoId = await createConversation(user.uid);
        setCurrentConversation(newConvoId);
        clearChat();
        setShowHistory(false);

        // Reload conversations
        loadConversations();
    };

    const handleSendMessage = async (content: string) => {
        if (!user || !profile) return;

        setIsLoading(true);

        // Create conversation if doesn't exist
        let convoId = currentConversationId;
        if (!convoId) {
            convoId = await createConversation(user.uid);
            setCurrentConversation(convoId);
        }

        // Add user message locally
        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: 'user',
            content,
            timestamp: new Date(),
        };
        addLocalMessage(userMessage);

        // Save to Firebase
        await addMessage(user.uid, convoId, { role: 'user', content });

        // Check for crisis
        if (checkForCrisisKeywords(content)) {
            const crisisResponse = getCrisisResponse(profile.name || 'there');
            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: crisisResponse,
                timestamp: new Date(),
            };
            addLocalMessage(assistantMessage);
            await addMessage(user.uid, convoId, { role: 'assistant', content: crisisResponse });
            setIsLoading(false);
            return;
        }

        // Show typing indicator
        setIsTyping(true);

        try {
            // Check rate limit for free tier
            if (tier === 'free') {
                const { canSend } = await checkMessageLimit(user.uid);
                if (!canSend) {
                    setIsTyping(false);
                    setIsLoading(false);
                    return;
                }
                await incrementMessageCount(user.uid);
                decrementMessages();
            }

            // Generate AI response
            const aiResponse = await generateCCResponse(
                content,
                messages.map(m => ({ role: m.role, content: m.content })),
                {
                    name: profile.name || 'there',
                    lucidScores: profile.lucidScores,
                    archetype: profile.archetype,
                    currentStruggle: profile.onboarding?.currentStruggle,
                    streak: profile.streak,
                    level: profile.level,
                    xp: profile.xp,
                },
                { deepDive: deepDiveMode }
            );

            // Add assistant message
            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
            };
            addLocalMessage(assistantMessage);

            // Save to Firebase
            await addMessage(user.uid, convoId, { role: 'assistant', content: aiResponse });

        } catch (error) {
            console.error('Error generating response:', error);

            const errorMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: `Hey ${profile.name || 'there'}, something went wrong on my end. Mind trying that again?`,
                timestamp: new Date(),
            };
            addLocalMessage(errorMessage);
        } finally {
            setIsTyping(false);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background-elevated/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
                    >
                        <span className="text-sm font-bold text-white">CC</span>
                    </motion.div>
                    <div>
                        <h1 className="font-semibold text-foreground">CC</h1>
                        <p className="text-xs text-foreground-muted">Your mindset companion</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* History button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowHistory(!showHistory)}
                        className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                    >
                        <Clock size={20} />
                    </motion.button>

                    {/* New conversation button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startNewConversation}
                        className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                    >
                        <Plus size={20} />
                    </motion.button>
                </div>
            </header>

            {/* Conversation History Sidebar */}
            <AnimatePresence>
                {showHistory && (
                    <motion.div
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="absolute top-14 left-0 w-72 h-[calc(100%-3.5rem)] bg-background-elevated border-r border-border z-20 overflow-y-auto"
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold text-foreground-muted mb-4">Conversations</h2>

                            <button
                                onClick={startNewConversation}
                                className="w-full flex items-center gap-2 px-4 py-3 mb-4 rounded-xl border border-dashed border-border text-foreground-muted hover:text-foreground hover:border-border-hover transition-colors"
                            >
                                <Plus size={18} />
                                <span>New Conversation</span>
                            </button>

                            <div className="space-y-2">
                                {conversations.map((convo) => (
                                    <motion.button
                                        key={convo.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => loadConversation(convo.id)}
                                        className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors
                      ${currentConversationId === convo.id
                                                ? 'bg-accent-primary/10 text-accent-primary'
                                                : 'hover:bg-background-hover text-foreground-muted hover:text-foreground'
                                            }
                    `}
                                    >
                                        <MessageCircle size={18} />
                                        <span className="truncate text-sm">{convo.title || 'Conversation'}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">
                    {/* Welcome message for new conversations */}
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(139, 92, 246, 0.3)',
                                        '0 0 40px rgba(139, 92, 246, 0.5)',
                                        '0 0 20px rgba(139, 92, 246, 0.3)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <span className="text-3xl font-bold text-white">CC</span>
                            </motion.div>

                            <h2 className="text-2xl font-semibold text-foreground mb-2">
                                Hey{profile?.name ? `, ${profile.name}` : ' there'}.
                            </h2>
                            <p className="text-foreground-muted max-w-md mx-auto leading-relaxed">
                                What's weighing on you? What are you trying to figure out?
                                <br />
                                <span className="text-foreground-subtle">No judgment. Just clarity.</span>
                            </p>
                        </motion.div>
                    )}

                    {/* Messages */}
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={index}
                            role={message.role}
                            content={message.content}
                            timestamp={message.timestamp}
                        />
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="mr-8 sm:mr-12">
                            <TypingIndicator />
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSendMessage} />
        </div>
    );
}
