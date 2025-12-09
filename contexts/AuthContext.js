import React, { useState, useEffect, createContext} from 'react';
import {Text, View} from 'react-native';
import * as SecureStore from 'expo-secure-store'

// Création du contexte d'authentification
export const AuthContext = createContext();


/**
 * AuthProvider = Composant fournisseur du contexte d'authentification
 *
 * Ce composant doit englober toute l'application dans App.js
 * Le contexte d'authentification est alors disponible partout
 *
 * @param {object} - Les props
 * @param {ReactNode} props.children - Les composants enfants qui auront accès au contexte
 */
export default function AuthProvider({children}) {
    // État pour savoir si login ou non
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // État pour le chargement de l'application. Attend la vérification du token
    const [loading, setLoading] = useState(true);
    // État pour stocker le token
    const [token, setToken] = useState(null);
    // État pour stocker les informations de l'utilisateur (nom, email, etc...)
    const [user, setUser] = useState(null);


    /**
     * checkAuth = Vérifie si un token est présent dans le secure store (sous-entendu, si l'utilisateur est connecté)
     *
     * Cette fonction est appellée :
     * - au démarrage de l'app
     * - après la connexion
     * - à la déconnexion
     * - depuis n'importe quel composant où l'authentification est nécessaire
     */
    const checkAuth = async () => {
        try {
            // Récupération du token et des données user
            const storedToken = await SecureStore.getItemAsync("token");
            const storedUser = await SecureStore.getItemAsync("user");

            // Mise à jour des états...
            if (storedToken){
                setIsAuthenticated(true);
                setToken(storedToken);

                if(storedUser){
                    setUser(JSON.parse(storedUser))
                }

            } else {
                setIsAuthenticated(false);
                setToken(null);
                setUser(null);
            }

        } catch(error){
            console.error('Erreur lors de la vérification du token', error);
            setIsAuthenticated(false);
            setToken(null);
            setUser(null);

        } finally {
            // Chargement terminé, même en cas d'erreur
            setLoading(false);
        }
    }

    // Fonction pour connecter l'utilisateur
    const login = async (userToken, userData = null) => {
        try {
            // Sauvegarde du token
            await SecureStore.setItemAsync("token", userToken);

            if (userData){
                await SecureStore.setItemAsync("user", JSON.stringify(userData));
                setUser(userData);
            }

            setToken(userToken);
            setIsAuthenticated(true);
        } catch (error){
            console.error('Erreur lors de la connexion', error);
            throw error;
        }
    }

    // Fonction pour déconnecter un utilisateur
    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');

            // RAZ des états
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);

        } catch (error){
            console.error('Erreur lors de la déconnexion', error);
            throw error; // On relance l'erreur pour la gérer dans le composant qui a appelé la fonction
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                token,
                user,
                login,
                logout,
                checkAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}