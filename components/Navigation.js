import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator} from "@react-navigation/native-stack";
import Products from "../screens/Products";
import ProductsCard from "../screens/ProductsCard";
import PrincipalDrawer from "./PrincipalDrawer";
import useAuth from "../hooks/useAuth";
import {ActivityIndicator, Text, View} from "react-native";
import {GlobalStyles} from "../styles/GlobalStyles";



const Stack = createNativeStackNavigator();

export default function Navigation() {

// Récuperation de l'etat de chargement (et donc d'authentification)
const {loading} = useAuth();


if(loading) {
    return (
        <View style={GlobalStyles.container}>
            <ActivityIndicator size={"large"} color={"#0000ff"}></ActivityIndicator>
        </View>
    )
}

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={"Drawer"}>
                {/* Le Drawer devient l'écran principal */}
                <Stack.Screen
                    name="Drawer"
                    component={PrincipalDrawer}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="Liste des produits" // Nom à l'écran pour la navigation
                    component={Products} // Composant à afficher
                    options={{title: "Liste des produits"}} // Options : titre dans la barre de nav
                />

                <Stack.Screen
                    name="ProductsCard" // Nom à l'écran pour la navigation
                    component={ProductsCard} // Composant à afficher
                    options={{title: "Fiche produit"}} // Options : titre dans la barre de nav
                />


            </Stack.Navigator>
        </NavigationContainer>
    );
}