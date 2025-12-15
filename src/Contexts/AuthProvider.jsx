import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import { userApi } from '../api/clubifyApi';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const createUser = async (email, password) => {
        try {
            setError(null);
            // Clean the email by removing any spaces
            const cleanEmail = email.trim();
            const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);

            // Create user document in MongoDB with default role 'member'
            await userApi.createUser({
                email: cleanEmail,
                name: cleanEmail.split('@')[0], // Use part of email as default name
                photoURL: '',
            });

            return userCredential;
        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.message || 'Failed to create user');
            throw error;
        }
    };

    const signInUser = async (email, password) => {
        try {
            setError(null);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential;
        } catch (error) {
            console.error('Error signing in user:', error);
            setError(error.message || 'Failed to sign in');
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            setError(null);
            const userCredential = await signInWithPopup(auth, googleProvider);

            // Check if user exists in MongoDB, if not create with default role
            try {
                await userApi.getUserByEmail(userCredential.user.email);
            } catch (error) {
                // User doesn't exist in MongoDB, create with default role
                if (error.response?.status === 404) {
                    await userApi.createUser({
                        email: userCredential.user.email,
                        name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
                        photoURL: userCredential.user.photoURL || '',
                    });
                }
            }

            return userCredential;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError(error.message || 'Failed to sign in with Google');
            throw error;
        }
    };

    const signOutUser = () => {
        return signOut(auth).finally(() => setLoading(false));
    };

    // Function to refresh user data from MongoDB
    const refreshUserData = async () => {
        try {
            const authUser = auth.currentUser; // Get current Firebase user
            if (authUser) {
                setError(null);
                // Fetch user data from MongoDB to get the role
                const userData = await userApi.getUserByEmail(authUser.email);

                // Update the user object with role information from MongoDB
                const userWithRole = {
                    ...authUser,
                    role: userData.role,
                    name: userData.name,
                    photoURL: userData.photoURL,
                    createdAt: userData.createdAt
                };

                setUser(userWithRole);
            }
        } catch (error) {
            console.error('Error refreshing user data:', error);
            setError(error.message || 'Failed to refresh user data');
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (authUser) {
                try {
                    setError(null);
                    // Fetch user data from MongoDB to get the role
                    const userData = await userApi.getUserByEmail(authUser.email);

                    // Update the user object with role information from MongoDB
                    const userWithRole = {
                        ...authUser,
                        role: userData.role,
                        name: userData.name,
                        photoURL: userData.photoURL,
                        createdAt: userData.createdAt
                    };

                    setUser(userWithRole);
                } catch (error) {
                    console.error('Error fetching user data:', error);

                    // If user doesn't exist in MongoDB, create with default role
                    if (error.response?.status === 404) {
                        await userApi.createUser({
                            email: authUser.email,
                            name: authUser.displayName || authUser.email.split('@')[0],
                            photoURL: authUser.photoURL || '',
                        });

                        // Now fetch the user data again
                        const userData = await userApi.getUserByEmail(authUser.email);

                        const userWithRole = {
                            ...authUser,
                            role: userData.role,
                            name: userData.name,
                            photoURL: userData.photoURL,
                            createdAt: userData.createdAt
                        };

                        setUser(userWithRole);
                    } else {
                        // If there's a different error, set user with default role
                        const userWithRole = {
                            ...authUser,
                            role: 'member'
                        };

                        setUser(userWithRole);
                    }
                }
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
        error,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        refreshUserData, // Add the function to refresh user data
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;