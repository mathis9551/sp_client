import React from 'react';
import {Text, TouchableOpacity, View, ScrollView, Image, StyleSheet} from 'react-native';
import { usePanier } from './store';
import { EXPO_PUBLIC_API_URL } from "../config";
import { GlobalStyles } from '../styles/GlobalStyles';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';

const CommandeContext = () => {
    const { panier, supprimerDuPanier } = usePanier();

    // Calcul du total si nécessaire
    const totalGeneral = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

    const tva = totalGeneral * 1.2 - totalGeneral;

    return (
        <ScrollView style={GlobalStyles.profileScreen}>
            <View style={{ paddingVertical: 20 }}>
                <Text style={[GlobalStyles.profileCardTitle, { marginHorizontal: 20, borderBottomWidth: 0 }]}>
                    Mon Panier ({panier.length} articles)
                </Text>

                {panier.length === 0 ? (
                    <View style={GlobalStyles.profileCard}>
                        <Text style={GlobalStyles.emptyText}>Votre panier est vide.</Text>
                    </View>
                ) : (
                    <>
                        {panier.map((item) => (
                            <View key={item.id} style={GlobalStyles.profileCard}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* 1. Image utilisant ton style productImage (adapté) */}
                                    <Image
                                        source={{ uri: `${EXPO_PUBLIC_API_URL}/images/produits/${item.imageUrl}` }}
                                        style={{ width: 70, height: 70, borderRadius: 8, marginRight: 15 }}
                                    />

                                    {/* 2. Infos utilisant tes styles de texte */}
                                    <View style={{ flex: 1 }}>
                                        <Text style={GlobalStyles.productName}>{item.designation}</Text>
                                        <Text style={GlobalStyles.profileInfoLabel}>Quantité : {item.quantite}</Text>
                                        <Text style={GlobalStyles.productPrice}>{item.prix} €</Text>
                                    </View>

                                    {/* 3. Action Supprimer */}
                                    <TouchableOpacity
                                        onPress={() => supprimerDuPanier(item.id)}

                                    >
                                        <Image
                                            source={require('../assets/poubelle.jpg')}
                                            style={styles.btnSupprimerr}
                                        />

                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        {/* Recapitulatif Total utilisant profileCard */}
                        <View style={GlobalStyles.profileCard}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={GlobalStyles.profileName}>Total :</Text>
                                <Text style={GlobalStyles.productPrice}>{totalGeneral.toFixed(2)} €</Text>
                            </View>

                            <TouchableOpacity style={[GlobalStyles.buttonContainer, { backgroundColor: '#1e3c72', borderRadius: 8, padding: 15, marginTop: 20 }]}>
                                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
                                    Valider la commande
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default CommandeContext;

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
    promoPriceText: { color: '#d9534f' },


    btnSupprimer: {
        backgroundColor: '#FF3B30', // Le rouge "iOS" utilisé dans ton GlobalStyles
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,           // Forme arrondie cohérente avec tes autres boutons
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 2,               // Légère ombre
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
            shadowRadius: 1.41,
    },
    btnSupprimerText: {
        color: '#ffffff',           // Texte blanc
            fontSize: 12,
            fontWeight: 'bold',
            textTransform: 'uppercase', // Majuscules pour le style "bouton d'action"
    },

    btnSupprimerr: {
        // Taille du bouton
        width: 40,
        height: 40,

        // Centrage de l'icône poubelle
        justifyContent: 'center',
        alignItems: 'center',

        // Design
        backgroundColor: '#fff', // Fond blanc
        borderWidth: 1,
        borderColor: '#ff4d4d', // Bordure rouge discret
        borderRadius: 8,        // Coins arrondis

        // Positionnement (optionnel)
        padding: 5,
    },
    iconPoubelle: {
        fontSize: 20,
        color: '#ff4d4d',
    }

    });