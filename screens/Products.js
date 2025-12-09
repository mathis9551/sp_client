import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import ProtectedRoute from "../components/ProtectedRoute";
import { GlobalStyles } from "../styles/GlobalStyles";
import {EXPO_PUBLIC_API_URL} from "../config";

//images

const Products = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // État de chargement
    const [error, setError] = useState(null); // État d'erreur
    const navigation = useNavigation();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchProductsData = async () => {
            setLoading(true); // Démarrer le chargement
            setError(null);   // Effacer les erreurs précédentes
            try {
                const response = await fetch (
                    `${EXPO_PUBLIC_API_URL}/produits/`,
                    { signal: abortController.signal }
                );

                const productsList = await response.json();

                if (!response.ok) {
                    throw new Error(productsList.message || "Erreur lors de la récupération des produits.");
                }

                setData(productsList);

            } catch(error) {
                if (error.name !== 'AbortError') {
                    console.error("Erreur de fetch produits:", error);
                    setError("Impossible de charger les produits. Veuillez réessayer.");
                }
            } finally {
                setLoading(false); // Arrêter le chargement
            }
        };

        fetchProductsData();
        return () => abortController.abort();
    }, []);


    if (loading) {
        return (
            <View style={GlobalStyles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e3c72" />
                <Text style={GlobalStyles.loadingText}>Chargement des produits...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={GlobalStyles.container}> {/* Utilisez GlobalStyles.container pour centrer */}
                <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={GlobalStyles.container}>
                <Text style={GlobalStyles.emptyText}>Aucun produit disponible pour le moment.</Text>
            </View>
        );
    }

    return (

            <FlatList
                data={data}
                keyExtractor={(item) => item.reference.toString()}
                numColumns={2}
                contentContainerStyle={GlobalStyles.productsGridContainer}
                renderItem={({ item }) => (

                    <TouchableOpacity

                        style={GlobalStyles.productGridItem} // Utilisez le nouveau style de carte
                        onPress={() => navigation.navigate("ProductsCard", item)}
                    >

                        <Image
                            source={{ uri:`${EXPO_PUBLIC_API_URL}` +  item.imageUrl }}
                            style={GlobalStyles.productImage}
                        />

                        <Text style={GlobalStyles.productName}>{item.designation}</Text>

                        <Text style={GlobalStyles.productPrice}>{item.prix_unitaire_HT} €</Text>
                    </TouchableOpacity>
                )}
            />

    );
};

export default Products;