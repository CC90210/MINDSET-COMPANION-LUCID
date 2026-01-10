# CC Mindset Companion App

A mindset transformation platform — part AI companion, part community. Users can talk to "CC" (an AI embodying CC's philosophy and voice) AND connect with others on the same journey.

![CC Mindset](https://via.placeholder.com/1200x600/0a0a0a/8b5cf6?text=CC+Mindset+Companion)

## ✨ Features

### 🤖 AI Companion (CC)
- Talk to CC — get sharp, personal insight with no fluff
- Crisis detection with automatic resource routing
- Conversation history and memory
- Deep Dive mode for longer, more thorough responses
- Rate limiting for free tier (5 messages/day)

### 👥 Community
- Feed with "For You" and "Following" views
- Channel-based organization (#mindset, #wins, #accountability, #questions)
- Daily check-ins with streak tracking
- Post, comment, and like functionality
- Anonymous posting option
- Direct messages (Premium feature)

### 💳 Subscription Tiers
- **Free**: 5 AI messages/day, browse community
- **Premium** ($19/mo): Unlimited AI, full community access, DMs, Deep Dive mode
- **Coaching** ($497): 1:1 call with CC

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini API
- **Payments**: Stripe
- **State Management**: Zustand
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
   \`\`\`bash
   git clone https://github.com/CC90210/MINDSET-COMPANION-APP.git
   cd MINDSET-COMPANION-APP/cc-mindset
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   - Copy \`ENV_TEMPLATE.txt\` to \`.env.local\`
   - Fill in your Firebase, Google AI, and Stripe credentials

4. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password + Google)
   - Create a Firestore database
   - Enable Storage
   - Download your service account key for admin SDK

5. **Set up Stripe**
   - Create products and prices in Stripe Dashboard
   - Set up webhook endpoint: \`/api/webhook/stripe\`
   - Add webhook secret to environment variables

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

\`\`\`
src/
├── app/
│   ├── (app)/           # Protected app routes
│   │   ├── feed/        # Community feed
│   │   ├── chat/        # AI chat
│   │   ├── messages/    # DMs
│   │   ├── post/        # Create post
│   │   └── profile/     # User profile
│   ├── api/             # API routes
│   │   ├── chat/        # AI chat endpoint
│   │   ├── subscribe/   # Stripe checkout
│   │   └── webhook/     # Stripe webhooks
│   ├── auth/            # Authentication
│   ├── onboarding/      # User onboarding
│   └── pricing/         # Pricing page
├── components/
│   ├── auth/            # Auth components
│   ├── chat/            # Chat components
│   ├── feed/            # Feed components
│   ├── navigation/      # Nav components
│   └── ui/              # Shared UI components
├── contexts/
│   └── AuthContext.tsx  # Auth state provider
└── lib/
    ├── firebase.ts      # Firebase client
    ├── firebase-admin.ts # Firebase admin SDK
    ├── gemini.ts        # Gemini AI client
    ├── ai-prompt.ts     # CC's personality
    └── store.ts         # Zustand stores
\`\`\`

## 🔧 Configuration

### Firebase Security Rules

Add these Firestore security rules:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth.uid == userId;
      }
    }
    
    // Posts are readable by all, writable by author
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
      
      match /likes/{userId} {
        allow read: if request.auth != null;
        allow write: if request.auth.uid == userId;
      }
      
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
    
    // DMs accessible only by participants
    match /directMessages/{conversationId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }
  }
}
\`\`\`

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Firebase Hosting

\`\`\`bash
npm run build
firebase deploy
\`\`\`

## 📋 Roadmap

- [x] Phase 1: MVP (Auth, AI Chat, Basic Community)
- [ ] Phase 2: DMs, Accountability Matching, Push Notifications
- [ ] Phase 3: Voice Input/Output, Guided Programs
- [ ] Phase 4: Mobile Apps, White-label

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details.

---

**Build this as if the person using it is one conversation away from changing their life. Because they might be.**
