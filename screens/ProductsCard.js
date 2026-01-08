import React, { useState } from 'react'; // Ajout de useState ici
import { usePanier } from './store';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GlobalStyles } from '../styles/GlobalStyles';
import defaultImage from '../assets/other.jpg';
import { EXPO_PUBLIC_API_URL } from "../config";


const ProductsCard = () => {
    const route = useRoute();
    const product = route.params;
    const { ajouterAuPanier } = usePanier();

    // --- ÉTAT POUR L'ANIMATION DU BOUTON ---
    const [isAdded, setIsAdded] = useState(false);

    const prixNormal = Number(product.prix_unitaire_HT || product.prix_initiale || 0);
    const nouveauPrix = Number(product.nouveau_prix || 0);
    const hasPromotion = (prixNormal > 0 && nouveauPrix > 0) && (prixNormal > nouveauPrix);
    const prixAffiche = hasPromotion ? nouveauPrix : prixNormal;

    const formatPrice = (price) => {
        if (isNaN(price)) return 'N/D';
        return price.toFixed(2).replace('.', ',');
    };

    // --- FONCTION DE GESTION DU CLIC ---
    const handlePress = () => {
        ajouterAuPanier({
            id: product.reference,
            designation: product.designation,
            prix: prixAffiche, // Correction ici (pas de product. devant)
            imageUrl: product.imageUrl
        });

        // Déclenche l'effet visuel
        setIsAdded(true);

        // Remet à l'état initial après 2 secondes
        setTimeout(() => {
            setIsAdded(false);
        }, 2000);
    };

    return (
        <ScrollView style={styles.cardScreen}>
            <View style={styles.cardContainer}>
                <Image
                    source={{ uri: product.imageUrl ? `${EXPO_PUBLIC_API_URL}/images/produits/${product.imageUrl}` : defaultImage }}
                    style={styles.productDetailImage}
                />

                <Text style={styles.productDetailName}>{product.designation}</Text>

                <View style={styles.priceContainer}>
                    {hasPromotion && (
                        <Text style={styles.oldPrice}>{formatPrice(prixNormal)} €</Text>
                    )}
                    <Text style={[styles.productDetailPrice, hasPromotion && styles.promoPriceText]}>
                        {formatPrice(prixAffiche)} €
                    </Text>
                </View>

                <Text style={styles.productDetailDescription}>{product.commentaire}</Text>

                {/* --- BOUTON DYNAMIQUE --- */}
                <TouchableOpacity
                    style={[
                        styles.btnAjouter,
                        isAdded && { backgroundColor: '#28a745' } // Devient vert au clic
                    ]}
                    onPress={handlePress}
                    disabled={isAdded} // Empêche le spam pendant les 2 secondes
                >
                    <Text style={styles.btnAjouterText}>
                        {isAdded ? "Article ajouté ✅" : "Ajouter au panier"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardScreen: { flex: 1, backgroundColor: '#f0f2f5' },
    cardContainer: {
        backgroundColor: '#ffffff',
        margin: 15,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
    },
    productDetailImage: { width: '100%', height: 250, resizeMode: 'contain', marginBottom: 20 },
    productDetailName: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10, textAlign: 'center' },
    productDetailPrice: { fontSize: 28, fontWeight: 'bold', color: '#1e3c72', marginBottom: 20 },
    productDetailDescription: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 },
    oldPrice: { fontSize: 14, color: '#6c757d', textDecorationLine: 'line-through', marginRight: 8 },
    priceContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'baseline', marginBottom: 20 },
    btnAjouter: {
        backgroundColor: '#1e3c72',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30,
        width: '100%',
        elevation: 4,
    },
    btnAjouterText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    promoPriceText: { color: '#d9534f' }
});

export default ProductsCard;