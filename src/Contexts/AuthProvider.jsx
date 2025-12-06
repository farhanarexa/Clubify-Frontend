import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

// Mock user roles database - In a real app, this would come from Firestore or your backend
const mockUserRoles = {
  'admin@example.com': 'admin',
  'manager@example.com': 'clubManager',
  'member@example.com': 'member',
  // Add more mock users as needed
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // In a real app, you would create a user document in Firestore with default role
        return userCredential;
    };

    const signInUser = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // In a real app, you would fetch user role from Firestore
        return userCredential;
    };

    const signInWithGoogle = async () => {
        const userCredential = await signInWithPopup(auth, googleProvider);
        // In a real app, you would fetch user role from Firestore
        return userCredential;
    };

    const signOutUser = () => {
        return signOut(auth).finally(() => setLoading(false));
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                // Fetch user role from mock data (or Firestore in a real app)
                const role = mockUserRoles[authUser.email] || 'member';

                // Update the user object with role information
                const userWithRole = {
                    ...authUser,
                    role: role
                };

                setUser(userWithRole);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [])

    const authInfo = {
        user,
        loading,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;