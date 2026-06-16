import { create } from 'zustand';
import { AppUser } from '../types';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { fetchAllRoles, storeAdminCredentials } from '../modules/system/services/systemService';

type AuthState = {
  user: AppUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: AppUser | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  login: async (email: string, password: string) => {
    if (!auth) {
      // Mock mode: create a mock user
      const mockUser: AppUser = {
        uid: 'mock-uid',
        email,
        role: 'super_admin',
        schoolId: 'school_001',
      };
      console.log('[Auth] Mock mode: created mock user', { email, role: mockUser.role });
      set({ user: mockUser });
      return;
    }

    set({ loading: true });
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      console.log('[Auth] Firebase authenticated user:', { uid: firebaseUser.uid, email: firebaseUser.email });

      // Look up user in `users` collection
      let role = 'school_admin';
      let schoolId = 'school_001';
      let name = firebaseUser.displayName || email.split('@')[0];

      if (db) {
        console.log('[Auth] Fetching user document from Firestore collection: users');
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log('[Auth] User document found in Firestore:', { uid: firebaseUser.uid, data });
          role = data.role || role;
          schoolId = data.schoolId || schoolId;
          name = data.name || name;
          console.log('[Auth] User role resolved:', { role, schoolId });
        } else {
          console.warn('[Auth] No user document found in Firestore for uid:', firebaseUser.uid);
        }
      } else {
        console.warn('[Auth] Firestore db not available, using defaults');
      }

      const appUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        role: role as AppUser['role'],
        schoolId,
        name,
      };

      // Store admin credentials for session restoration when creating other users
      storeAdminCredentials(email, password);

      console.log('[Auth] Login successful, setting user:', { uid: appUser.uid, role: appUser.role, schoolId: appUser.schoolId, name: appUser.name });
      set({ user: appUser, loading: false });
    } catch (error) {
      console.error('[Auth] Login failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    console.log('[Auth] User logged out');
    set({ user: null });
  },

  initialize: async () => {
    if (get().initialized) return;

    if (!auth) {
      console.log('[Auth] No Firebase Auth available, skipping initialization');
      set({ initialized: true });
      return;
    }

    set({ loading: true });

    return new Promise<void>((resolve) => {
      const currentAuth = auth;
      if (!currentAuth) {
        set({ initialized: true, loading: false });
        resolve();
        return;
      }
      onAuthStateChanged(currentAuth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            console.log('[Auth] Auth state changed - user detected:', { uid: firebaseUser.uid, email: firebaseUser.email });

            let role = 'school_admin';
            let schoolId = 'school_001';
            let name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '';

            if (db) {
              console.log('[Auth] Fetching user document from Firestore collection: users');
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists()) {
                const data = userDoc.data();
                console.log('[Auth] User document found in Firestore:', { uid: firebaseUser.uid, data });
                role = data.role || role;
                schoolId = data.schoolId || schoolId;
                name = data.name || name;
                console.log('[Auth] User role resolved:', { role, schoolId });
              } else {
                console.warn('[Auth] No user document found in Firestore for uid:', firebaseUser.uid);
              }
            } else {
              console.warn('[Auth] Firestore db not available, using defaults');
            }

            const appUser: AppUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: role as AppUser['role'],
              schoolId,
              name,
            };

            console.log('[Auth] Auth initialization complete, user set:', { uid: appUser.uid, role: appUser.role, schoolId: appUser.schoolId, name: appUser.name });
            set({ user: appUser, loading: false, initialized: true });
          } catch (err) {
            console.error('[Auth] Error loading user data:', err);
            set({ loading: false, initialized: true });
          }
        } else {
          console.log('[Auth] Auth state changed - no user (logged out)');
          set({ user: null, loading: false, initialized: true });
        }
        resolve();
      });
    });
  },
}));