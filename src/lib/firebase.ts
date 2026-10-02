import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateAuthProfile,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateAuthProfile,
};
export type { User };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fetch user profile from Firestore
export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const userDocPath = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: userId,
        role: data.role || (data.email === 'otelnetclient@gmail.com' ? 'admin' : 'customer'),
        name: data.name || 'Shopper',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || '',
        memberSince: data.memberSince || 'Today',
        isPro: Boolean(data.isPro),
        proExpiryDate: data.proExpiryDate,
        totalSaved: data.totalSaved || 0,
        dietaryPreferences: data.dietaryPreferences || ['organic'],
        savedAddresses: data.savedAddresses || [],
        savedPaymentMethods: data.savedPaymentMethods || [],
        notifications: data.notifications || {
          email: true,
          sms: true,
          orderUpdates: true,
          promoAlerts: true,
        },
      };
    }
    return null;
  } catch (error) {
    console.warn(`Firestore get profile error for ${userDocPath}:`, error);
    // Use handleFirestoreError if permission error, else return null gracefully
    if (error instanceof Error && error.message.toLowerCase().includes('permission')) {
      handleFirestoreError(error, OperationType.GET, userDocPath);
    }
    return null;
  }
}

// Save or merge user profile to Firestore
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  const userDocPath = `users/${profile.id}`;
  try {
    const docRef = doc(db, 'users', profile.id);
    const payload = {
      userId: profile.id,
      email: profile.email,
      name: profile.name,
      phone: profile.phone || '',
      avatar: profile.avatar || '',
      role: profile.role,
      isPro: Boolean(profile.isPro),
      memberSince: profile.memberSince || 'Today',
      totalSaved: profile.totalSaved || 0,
      dietaryPreferences: profile.dietaryPreferences || [],
      savedAddresses: profile.savedAddresses || [],
      savedPaymentMethods: profile.savedPaymentMethods || [],
      notifications: profile.notifications || {
        email: true,
        sms: true,
        orderUpdates: true,
        promoAlerts: true,
      },
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.warn(`Firestore write profile error for ${userDocPath}:`, error);
    handleFirestoreError(error, OperationType.WRITE, userDocPath);
  }
}

// Test initial connection safely
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore client is offline or initializing.');
    }
  }
}

testFirestoreConnection();

