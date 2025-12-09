import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles } from '../styles/GlobalStyles';
import defaultImage from  '../assets/other.jpg';
import {EXPO_PUBLIC_API_URL} from "../config";

const ProductsCard = () => {
    const route = useRoute();
    const product = route.params;

    if (!product) {
        return (
            <View style={GlobalStyles.container}>
                <Text style={GlobalStyles.errorText}>Produit non trouvé.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.cardScreen}>
            <View style={styles.cardContainer}>

                <Image
                   // prend image ou sinon l'image par defaul
                    source={{ uri: product.imageUrl ? `${EXPO_PUBLIC_API_URL}${product.imageUrl}` : defaultImage }}
                    style={styles.productDetailImage}
                />

                {/* Nom */}
                <Text style={styles.productDetailName}>{product.designation}</Text>

                {/* Prix */}
                <Text style={styles.productDetailPrice}>{product.prix_unitaire_HT} €</Text>

                {/* Description */}
                <Text style={styles.productDetailDescription}>{product.commentaire}
                </Text>

                {/* Bouton d'ajout au panier */}
                <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartButtonText}>Ajouter au panier</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};

// ... (Tes styles restent les mêmes)
const styles = StyleSheet.create({
    cardScreen: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    cardContainer: {
        backgroundColor: '#ffffff',
        margin: 15,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    productDetailImage: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
        borderRadius: 10,
        marginBottom: 20,
    },
    productDetailName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    productDetailPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e3c72',
        marginBottom: 20,
        textAlign: 'center',
    },
    productDetailDescription: {
        fontSize: 16,
        color: '#555',
        textAlign: 'left',
        marginBottom: 20,
        lineHeight: 24,
    },
    addToCartButton: {
        backgroundColor: '#28a745',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
    },
    addToCartButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        width: '100%', // Assure que ça prend toute la largeur
        marginBottom: 20,
    },
    descriptionText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'left',
        lineHeight: 24,
    },
    descriptionTitle: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 17, // Légèrement plus grand
    },
    descriptionBold: {
        fontWeight: 'bold',
        color: '#555',
    },
});

export default ProductsCard;