import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  deleteDoc,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  writeBatch,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// ========== AUTH FUNCTIONS ==========

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { user: null, error: error as Error };
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Email sign in error:', error);
    return { user: null, error: error as Error };
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('Email sign up error:', error);
    return { user: null, error: error as Error };
  }
}

export async function logOut() {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: error as Error };
  }
}

// ========== USER PROFILE FUNCTIONS ==========

export interface UserProfile {
  uid: string;
  name: string;
  displayName: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: Timestamp;
  subscriptionTier: 'free' | 'premium';
  stripeCustomerId?: string;
  streak: number;
  lastActiveDate?: string;
  onboarding?: {
    currentStruggle?: string;
    desiredOutcome?: string;
  };
  messageCount?: number;
  lastMessageDate?: string;
}

export async function createUserProfile(user: User, additionalData?: Partial<UserProfile>) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const profile: UserProfile = {
      uid: user.uid,
      name: user.displayName?.split(' ')[0] || '',
      displayName: user.displayName || '',
      email: user.email || '',
      avatarUrl: user.photoURL || '',
      createdAt: serverTimestamp() as Timestamp,
      subscriptionTier: 'free',
      streak: 0,
      messageCount: 0,
      ...additionalData,
    };
    
    await setDoc(userRef, profile);
    return profile;
  }
  
  return userSnap.data() as UserProfile;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  
  return null;
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
}

// ========== CONVERSATION FUNCTIONS ==========

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
}

export interface Conversation {
  id: string;
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  title?: string;
}

export async function createConversation(userId: string): Promise<string> {
  const conversationsRef = collection(db, 'users', userId, 'conversations');
  const newConversation = await addDoc(conversationsRef, {
    createdAt: serverTimestamp(),
    lastMessageAt: serverTimestamp(),
    title: 'New Conversation',
  });
  return newConversation.id;
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const conversationsRef = collection(db, 'users', userId, 'conversations');
  const q = query(conversationsRef, orderBy('lastMessageAt', 'desc'), limit(50));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Conversation[];
}

export async function getMessages(userId: string, conversationId: string): Promise<Message[]> {
  const messagesRef = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data()) as Message[];
}

export async function addMessage(
  userId: string, 
  conversationId: string, 
  message: Omit<Message, 'timestamp'>
) {
  const messagesRef = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
  await addDoc(messagesRef, {
    ...message,
    timestamp: serverTimestamp(),
  });
  
  // Update conversation
  const conversationRef = doc(db, 'users', userId, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    lastMessageAt: serverTimestamp(),
  });
}

export function subscribeToMessages(
  userId: string, 
  conversationId: string, 
  callback: (messages: Message[]) => void
) {
  const messagesRef = collection(db, 'users', userId, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => doc.data()) as Message[];
    callback(messages);
  });
}

// ========== POST FUNCTIONS ==========

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  imageUrl?: string;
  channel?: string;
  isAnonymous: boolean;
  createdAt: Timestamp;
  likeCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Timestamp;
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'likeCount' | 'commentCount'>) {
  const postsRef = collection(db, 'posts');
  const newPost = await addDoc(postsRef, {
    ...data,
    createdAt: serverTimestamp(),
    likeCount: 0,
    commentCount: 0,
  });
  return newPost.id;
}

export async function getPosts(
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize = 20,
  channel?: string
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const postsRef = collection(db, 'posts');
  let q = query(postsRef, orderBy('createdAt', 'desc'), limit(pageSize));
  
  if (channel) {
    q = query(postsRef, where('channel', '==', channel), orderBy('createdAt', 'desc'), limit(pageSize));
  }
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(q);
  
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
  
  const last = snapshot.docs[snapshot.docs.length - 1] || null;
  
  return { posts, lastDoc: last };
}

export async function getFollowingPosts(
  userId: string,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
  pageSize = 20
): Promise<{ posts: Post[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  // Get following list
  const followingRef = collection(db, 'users', userId, 'following');
  const followingSnap = await getDocs(followingRef);
  const followingIds = followingSnap.docs.map(doc => doc.id);
  
  if (followingIds.length === 0) {
    return { posts: [], lastDoc: null };
  }
  
  // Get posts from followed users
  const postsRef = collection(db, 'posts');
  let q = query(
    postsRef,
    where('authorId', 'in', followingIds.slice(0, 10)), // Firestore limit
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(q);
  
  const posts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Post[];
  
  const last = snapshot.docs[snapshot.docs.length - 1] || null;
  
  return { posts, lastDoc: last };
}

export async function likePost(postId: string, userId: string) {
  const likeRef = doc(db, 'posts', postId, 'likes', userId);
  const likeSnap = await getDoc(likeRef);
  const postRef = doc(db, 'posts', postId);
  
  if (likeSnap.exists()) {
    // Unlike
    await deleteDoc(likeRef);
    await updateDoc(postRef, { likeCount: increment(-1) });
    return false;
  } else {
    // Like
    await setDoc(likeRef, { createdAt: serverTimestamp() });
    await updateDoc(postRef, { likeCount: increment(1) });
    return true;
  }
}

export async function isPostLiked(postId: string, userId: string): Promise<boolean> {
  const likeRef = doc(db, 'posts', postId, 'likes', userId);
  const likeSnap = await getDoc(likeRef);
  return likeSnap.exists();
}

export async function addComment(postId: string, data: Omit<Comment, 'id' | 'createdAt'>) {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const postRef = doc(db, 'posts', postId);
  
  const newComment = await addDoc(commentsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  
  await updateDoc(postRef, { commentCount: increment(1) });
  
  return newComment.id;
}

export async function getComments(postId: string): Promise<Comment[]> {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];
}

// ========== FOLLOW FUNCTIONS ==========

export async function followUser(currentUserId: string, targetUserId: string) {
  const batch = writeBatch(db);
  
  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
  const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
  
  batch.set(followingRef, { createdAt: serverTimestamp() });
  batch.set(followerRef, { createdAt: serverTimestamp() });
  
  await batch.commit();
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  const batch = writeBatch(db);
  
  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
  const followerRef = doc(db, 'users', targetUserId, 'followers', currentUserId);
  
  batch.delete(followingRef);
  batch.delete(followerRef);
  
  await batch.commit();
}

export async function isFollowing(currentUserId: string, targetUserId: string): Promise<boolean> {
  const followingRef = doc(db, 'users', currentUserId, 'following', targetUserId);
  const snap = await getDoc(followingRef);
  return snap.exists();
}

export async function getFollowerCount(userId: string): Promise<number> {
  const followersRef = collection(db, 'users', userId, 'followers');
  const snapshot = await getDocs(followersRef);
  return snapshot.size;
}

export async function getFollowingCount(userId: string): Promise<number> {
  const followingRef = collection(db, 'users', userId, 'following');
  const snapshot = await getDocs(followingRef);
  return snapshot.size;
}

// ========== DIRECT MESSAGES ==========

export interface DirectMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
  read: boolean;
}

export interface DMConversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Timestamp;
}

export async function getOrCreateDMConversation(
  userId1: string,
  userId2: string
): Promise<string> {
  // Check if conversation exists
  const dmsRef = collection(db, 'directMessages');
  const q = query(dmsRef, where('participants', 'array-contains', userId1));
  const snapshot = await getDocs(q);
  
  for (const doc of snapshot.docs) {
    const data = doc.data() as DMConversation;
    if (data.participants.includes(userId2)) {
      return doc.id;
    }
  }
  
  // Create new conversation
  const newDm = await addDoc(dmsRef, {
    participants: [userId1, userId2],
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
  });
  
  return newDm.id;
}

export async function sendDirectMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  const messagesRef = collection(db, 'directMessages', conversationId, 'messages');
  const conversationRef = doc(db, 'directMessages', conversationId);
  
  await addDoc(messagesRef, {
    senderId,
    content,
    createdAt: serverTimestamp(),
    read: false,
  });
  
  await updateDoc(conversationRef, {
    lastMessage: content,
    lastMessageAt: serverTimestamp(),
  });
}

export async function getDMConversations(userId: string): Promise<DMConversation[]> {
  const dmsRef = collection(db, 'directMessages');
  const q = query(
    dmsRef,
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as DMConversation[];
}

export function subscribeToDMMessages(
  conversationId: string,
  callback: (messages: DirectMessage[]) => void
) {
  const messagesRef = collection(db, 'directMessages', conversationId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as DirectMessage[];
    callback(messages);
  });
}

// ========== DAILY CHECK-INS ==========

export async function submitDailyCheckin(userId: string, response: string) {
  const today = new Date().toISOString().split('T')[0];
  const checkinRef = doc(db, 'dailyCheckins', today, 'responses', userId);
  
  await setDoc(checkinRef, {
    response,
    createdAt: serverTimestamp(),
  });
  
  // Update user streak
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const userData = userSnap.data() as UserProfile;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = 1;
    if (userData.lastActiveDate === yesterdayStr) {
      newStreak = (userData.streak || 0) + 1;
    } else if (userData.lastActiveDate === today) {
      newStreak = userData.streak || 1;
    }
    
    await updateDoc(userRef, {
      streak: newStreak,
      lastActiveDate: today,
    });
  }
}

// ========== STORAGE ==========

export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ========== RATE LIMITING ==========

export async function checkMessageLimit(userId: string): Promise<{ canSend: boolean; remaining: number }> {
  const userSnap = await getDoc(doc(db, 'users', userId));
  
  if (!userSnap.exists()) {
    return { canSend: false, remaining: 0 };
  }
  
  const userData = userSnap.data() as UserProfile;
  const today = new Date().toISOString().split('T')[0];
  
  // Premium users have unlimited messages
  if (userData.subscriptionTier === 'premium') {
    return { canSend: true, remaining: Infinity };
  }
  
  // Free tier: 5 messages per day
  const FREE_LIMIT = 5;
  
  if (userData.lastMessageDate !== today) {
    // Reset count for new day
    await updateDoc(doc(db, 'users', userId), {
      messageCount: 0,
      lastMessageDate: today,
    });
    return { canSend: true, remaining: FREE_LIMIT };
  }
  
  const count = userData.messageCount || 0;
  const remaining = Math.max(0, FREE_LIMIT - count);
  
  return { canSend: count < FREE_LIMIT, remaining };
}

export async function incrementMessageCount(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const userRef = doc(db, 'users', userId);
  
  await updateDoc(userRef, {
    messageCount: increment(1),
    lastMessageDate: today,
  });
}

// Exports
export { app, auth, db, storage, onAuthStateChanged };
export type { User };
