# Lucid — Get Lucid

A mindset transformation platform — AI companion + community + gamified growth. Take the assessment. Know your score. Talk to CC. Join people doing the real work.

![Lucid](https://via.placeholder.com/1200x600/0A0A0A/6366F1?text=LUCID)

## ✨ Core Features

### 🎯 Mindset Assessment (The Hook)
- **10 questions, 2 minutes** — no signup required
- Score across 5 dimensions: Self-Awareness, Resilience, Growth Orientation, Emotional Regulation, Inner Dialogue
- **Overall Lucid Score** (0-100)
- **Archetype assignment**: The Overthinker, The Grinder, The Reactor, The Dormant, The Integrated
- **Shareable results card** for social media virality
- Retake weekly to track progress

### 🤖 AI Companion (CC)
- Sharp, personal insight — not generic chatbot responses
- **Context-aware**: Uses Lucid scores, archetype, conversation history
- **Deep Dive mode** for premium users (longer, more exploratory responses)
- **Crisis detection** with automatic resource routing
- Rate-limited for free tier (5 messages/day)

### 👥 Community
- Feed with "For You" and "Following" views
- Channels: #mindset, #wins, #accountability, #questions
- Anonymous posting option
- Daily check-ins with prompts
- Direct messages (Premium only)

### 🎮 Gamification System
- **XP** for every action (assessment +100, check-in +20, post +15, etc.)
- **10 Levels**: Awakening → Aware → Rising → Focused → Disciplined → Integrated → Elevated → Mastering → Transcendent → Unlocked
- **Streaks** with milestone badges (7, 30, 90, 365 days)
- **Weekly challenges** posted by CC
- **Achievements** for milestones

### 💳 Monetization
- **Free**: 5 AI messages/day, browse community, XP/leveling
- **Premium** ($12/mo): Unlimited AI, full community, DMs, Deep Dive mode
- **Coaching** ($497): 1:1 call with CC

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini API
- **Payments**: Stripe
- **State Management**: Zustand (with persistence)
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Google AI API key
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CC90210/MINDSET-COMPANION-APP.git
   cd MINDSET-COMPANION-APP/cc-mindset
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `ENV_TEMPLATE.txt` to `.env.local`
   - Fill in your Firebase, Google AI, and Stripe credentials

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password + Google)
   - Create a Firestore database
   - Enable Storage
   - Download your service account key for admin SDK

5. **Set up Stripe**
   - Create products and prices in Stripe Dashboard
   - Set up webhook endpoint: `/api/webhook/stripe`
   - Add webhook secret to environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/              # Protected app routes
│   │   ├── home/           # Dashboard
│   │   ├── chat/           # AI chat
│   │   ├── feed/           # Community feed
│   │   ├── messages/       # DMs
│   │   └── profile/        # User profile
│   ├── api/                # API routes
│   │   ├── chat/           # AI chat endpoint
│   │   ├── subscribe/      # Stripe checkout
│   │   └── webhook/        # Stripe webhooks
│   ├── auth/               # Authentication
│   └── onboarding/         # User onboarding
├── components/
│   ├── assessment/         # Assessment flow
│   ├── auth/               # Auth components
│   ├── chat/               # Chat components
│   ├── feed/               # Feed components
│   ├── navigation/         # Nav components
│   └── ui/                 # Shared UI components
├── contexts/
│   └── AuthContext.tsx     # Auth state provider
└── lib/
    ├── assessment.ts       # Assessment logic
    ├── gamification.ts     # XP/Level system
    ├── firebase.ts         # Firebase client
    ├── gemini.ts           # Gemini AI client
    ├── ai-prompt.ts        # CC's personality
    └── store.ts            # Zustand stores
```

## 🎯 Key Implementation Notes

1. **Assessment Flow is the hook** — Users can take it before signup. Results stored in localStorage, then saved to profile on auth
2. **AI personality is everything** — The `ai-prompt.ts` file defines CC's voice. Archetype-specific approaches built in
3. **Gamification should feel earned** — XP for real actions only, not empty engagement
4. **Mobile-first, always** — Test every screen on phone first
5. **Dark mode default** — The vibe matters

## 🔧 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }
    
    match /directMessages/{conversationId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }
  }
}
```

## 📋 Roadmap

- [x] Phase 1: Assessment, AI Chat, Basic Community, Gamification
- [ ] Phase 2: DMs, Accountability Matching, Push Notifications
- [ ] Phase 3: Voice Input/Output, Guided Programs
- [ ] Phase 4: Mobile Apps, White-label

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| DAU/MAU Ratio | > 40% |
| Day 1 Retention | > 60% |
| Day 7 Retention | > 35% |
| Free → Premium Conversion | > 5% |
| Lucid Score Shares per User | > 0.3 |

---

## Brand Identity

- **Name**: Lucid
- **Tagline**: "Get lucid."
- **Colors**: Indigo (#6366F1), Purple (#8B5CF6), Near-black (#0A0A0A)
- **Voice**: Direct, warm, challenging but not aggressive

---

**Build something that makes people better. That's the only metric that matters in the end.**
