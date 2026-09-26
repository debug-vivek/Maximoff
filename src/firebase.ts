import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with exact database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Boot test connection as mandated by Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Check Firebase configuration.');
      return false;
    }
    // If document doesn't exist, connection still succeeded!
    return true;
  }
}

// Types for Firebase entities
export interface ResearchDossierRecord {
  id: string;
  query: string;
  summary: string;
  keyFacts?: string[];
  sources?: { title: string; url: string }[];
  searchQueries?: string[];
  category?: string;
  authorId: string;
  authorEmail?: string;
  createdAt: string;
}

export interface DeviceFileRecord {
  id: string;
  name: string;
  type: 'file' | 'folder';
  extension?: string;
  device: 'Workstation' | 'Mobile' | 'Cloud Enclave' | 'Edge Server';
  size?: string;
  path: string;
  lastModified?: string;
  authorId: string;
  createdAt: string;
}

export interface SecurityAuditRecord {
  id: string;
  eventType: 'LOCKDOWN_ENGAGED' | 'UNLOCK_ATTEMPT' | 'UNLOCK_SUCCESS' | 'GOOGLE_RESEARCH_SYNC' | 'DATABASE_VERIFIED';
  details: string;
  operatorId: string;
  timestamp: string;
}
