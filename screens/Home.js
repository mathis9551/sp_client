import React, {Component, useEffect, useState} from 'react';
import {EXPO_PUBLIC_API_URL} from "../config";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {GlobalStyles} from "../styles/GlobalStyles";
import ProtectedRoute from "../components/ProtectedRoute";

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
    // <-- CHANGEMENT ICI : Un état pour chaque liste
    const [featuredData, setFeaturedData] = useState([]);
    const [promoData, setPromoData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. On prépare les deux requêtes
                const featuredPromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/produits/vedette`,
                    { signal }
                );
                const promoPromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/produits/promotion`,
                    { signal }
                );

                // 2. On attend les DEUX
                const [featuredResponse, promoResponse] = await Promise.all([
                    featuredPromise,
                    promoPromise
                ]);

                // 3. On vérifie les DEUX
                if (!featuredResponse.ok) {
                    const errorData = await featuredResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération des produits vedette.");
                }
                if (!promoResponse.ok) {
                    const errorData = await promoResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération des promotions.");
                }

                // 4. On récupère le JSON des DEUX
                const [featuredList, promoList] = await Promise.all([
                    featuredResponse.json(),
                    promoResponse.json()
                ]);


                setFeaturedData(featuredList); // <-- L'état pour les vedettes
                setPromoData(promoList);     // <-- L'état pour les promos

            } catch(error) {
                if (error.name !== 'AbortError') {
                    console.error("Erreur de fetch produits:", error.message);
                    setError(error.message || "Impossible de charger les produits. Veuillez réessayer.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
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
            <View style={GlobalStyles.container}>
                <Text style={GlobalStyles.errorText}>{error}</Text>
            </View>
        );
    }

    // <-- CHANGEMENT ICI : On vérifie si les DEUX listes sont vides
    if (featuredData.length === 0 && promoData.length === 0) {
        return (
            <View style={GlobalStyles.container}>
                <Text style={GlobalStyles.emptyText}>Aucun produit disponible pour le moment.</Text>
            </View>
        );
    }

    const handleConsult = (item) => {
        navigation.navigate('ProductDetail', { product: item });
    };

    const handleAddToCart = (item) => {
        console.log("Ajout au panier:", item.designation);
        // Logique d'ajout au panier ici
    };

    const cardWidth = screenWidth * 0.85;
    const snapInterval = cardWidth + (styles.cardWrapper.marginRight || 0);

    return (

            <ScrollView style={GlobalStyles.profileScreen}>

                {/*ARTICLE EN Vedette ICIIII */}
                {/* On n'affiche la section que s'il y a des données */}
                {featuredData.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Les articles en Vedette ✨</Text>
                        <FlatList
                            data={featuredData}
                            keyExtractor={(item) => 'feat-' + item.reference.toString()} // Préfixe pour garantir une clé unique
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalFlatListContainer}
                            snapToInterval={snapInterval}
                            decelerationRate="fast"
                            renderItem={({ item }) => (
                                <View style={[styles.cardWrapper, { width: cardWidth }]}>
                                    <TouchableOpacity onPress={() => navigation.navigate("ProductsCard", item)}>
                                        <View style={styles.productCardHorizontal}>
                                            <Image
                                                source={{ uri:`${EXPO_PUBLIC_API_URL}` + "/images/produits/" +  item.imageUrl }}
                                                style={styles.productImageHorizontal}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.productNameHorizontal}>{item.designation}</Text>
                                    <Text style={styles.productPriceHorizontal}>{item.prix_unitaire_HT} €</Text>
                                </View>
                            )}
                        />
                    </View>
                )}

                {/*ARTICLE EN PROMOTION ICIIII */}
                {/* On n'affiche la section que s'il y a des données */}
                {promoData.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Les articles en PROMOTION ✨</Text>
                        <FlatList
                            data={promoData}
                            keyExtractor={(item) => 'promo-' + item.reference.toString()} // Préfixe pour garantir une clé unique
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.horizontalFlatListContainer}
                            snapToInterval={snapInterval}
                            decelerationRate="fast"
                            renderItem={({ item }) => (

                                <View style={[styles.cardWrapper, { width: cardWidth }]}>
                                    <TouchableOpacity onPress={() => navigation.navigate("ProductsCard", item)}>
                                        <View style={styles.productCardHorizontal}>
                                            <Image
                                                source={{ uri:`${EXPO_PUBLIC_API_URL}`+"/images/produits/" + item.imageUrl }}
                                                style={styles.productImageHorizontal}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.productNameHorizontal}>{item.designation}</Text>
                                    {/* J'utilise vos styles de prix barrés que vous aviez déjà préparés */}
                                    <View style={styles.promoPriceContainer}>
                                        <Text style={styles.oldPrice}>{item.prix_initiale} €</Text>
                                        <Text style={styles.newPrice}>{item.nouveau_prix} €</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                )}
            </ScrollView>

    );
};

// Le StyleSheet reste le même
const styles = StyleSheet.create({
    // ... (tous vos styles existants)
    // --- Styles existants (fusionnés) ---
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
        width: '100%',
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
        fontSize: 17,
    },
    descriptionBold: {
        fontWeight: 'bold',
        color: '#555',
    },

    // --- STYLES POUR LA FLATLIST HORIZONTALE ---
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 15,
        marginTop: 20,
        marginBottom: 15,
    },
    horizontalFlatListContainer: {
        paddingHorizontal: 15, // Padding à gauche (pour la 1ère carte) et à droite (pour la dernière)
        paddingBottom: 20,
    },
    cardWrapper: {
        height: 280, // Hauteur fixe (à ajuster si besoin)
        marginRight: 10, // Espace entre les cartes
        // La largeur est définie dynamiquement
    },
    productCardHorizontal: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        height: 220, // Hauteur de la carte blanche
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative',
        overflow: 'hidden',
    },
    productImageHorizontal: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
    },
    productNameHorizontal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        textAlign: 'left',
        paddingHorizontal: 5,
    },
    productPriceHorizontal: { // Style pour le PRIX NORMAL
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3c72',
        marginTop: 5,
        textAlign: 'left',
        paddingHorizontal: 5,
    },
    promoTag: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'white', // Fond blanc comme sur la capture
        borderRadius: 20, // Pour un effet "pilule"
        paddingHorizontal: 12,
        paddingVertical: 6,
        zIndex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000', // Ombre légère
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    promoTagText: {
        color: 'black', // Texte en noir
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4, // (Ajoutez une icône ici si besoin)
    },
    addToCartIcon: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: '#007bff', // Bleu (à ajuster)
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    addToCartIconText: {
        color: 'white',
        fontSize: 24,
        lineHeight: 24, // Centrage du '+'
        fontWeight: 'bold', // Le '+' semble gras
    },
    promoCard: {
        flex: 1, // Prend la moitié de l'espace (grâce à numColumns=2)
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        // Assure que les cartes ne deviennent pas trop larges sur tablettes
        maxWidth: '48%',
    },

    // Styles pour les boutons (de votre premier wireframe)
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
        marginBottom: 8,
    },
    consultButton: {
        backgroundColor: '#6c757d', // Gris
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 5,
        flex: 1,
        marginRight: 4,
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#28a745', // Vert
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 5,
        flex: 1,
        marginLeft: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Styles pour les prix barrés (que j'utilise maintenant)
    promoPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        paddingHorizontal: 5, // Pour aligner avec le nom
    },
    oldPrice: {
        fontSize: 14,
        color: '#6c757d', // Gris
        textDecorationLine: 'line-through', // Barré
        marginRight: 8,
    },
    newPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D90429', // Rouge promo
    },

});