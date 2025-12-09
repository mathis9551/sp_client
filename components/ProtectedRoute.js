import React, {Component, useEffect} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import useAuth from "../hooks/useAuth";
import {useNavigation} from "@react-navigation/native";
import {GlobalStyles} from "../styles/GlobalStyles";

        export default function ProtectedRoute({children}) {
            // Récuperation l'etat d'authentification

            const {isAuthenticated, loading} = useAuth();

            // Recup de l'objet navigation
            const navigation = useNavigation();

            useEffect(() => {
                // on att que le chargement fini
                if(!loading && !isAuthenticated) {
                    // on utilise try/catch car la navig peut echouer
                    try {
                        navigation.navigate('Drawer', {screen: 'login'})
                    }catch (error) {
                        console.error('Erreur de navigation', error)
                    }
                }
            }, [isAuthenticated, loading, navigation]);

            // return si en cours de chargement
            if(loading) {
                return (
                    <View style={GlobalStyles.container}>
                        <ActivityIndicator size={"large"} color={"#0000ff"}></ActivityIndicator>
                        <Text style={GlobalStyles.text}> Vérification de l'authentification</Text>
                    </View>
                )
            }
            // return si non auth
            if (!isAuthenticated) {
                return (
                    <View style={GlobalStyles.container}>
                        <Text style={GlobalStyles.text}>Veuillez vous connecter pour accéder à cette page</Text>
                    </View>
                )
            }
            // return si en cours de chargement

            // on affiche le contenue protégé
    return (
    <>{children}</>
    );
}