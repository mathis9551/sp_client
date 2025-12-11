import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import ProtectedRoute from "../components/ProtectedRoute";
import useAuth from "../hooks/useAuth";
import Icon from 'react-native-vector-icons/Feather'; // Importer les icônes
import { GlobalStyles } from '../styles/GlobalStyles'; // Importer vos styles
import {EXPO_PUBLIC_API_URL} from "../config";
// --- Images ---
import maleIcon from '../assets/male.jpg';
import femaleIcon from '../assets/female.jpg';
import otherIcon from '../assets/other.jpg';

// --- Composant d'aide pour les lignes d'info (utilise les GlobalStyles) ---
const InfoRow = ({ icon, label, value }) => (
    <View style={GlobalStyles.profileInfoRow}>
        <Icon name={icon} size={22} style={GlobalStyles.profileInfoIcon} />
        <View style={GlobalStyles.profileInfoTextContainer}>
            <Text style={GlobalStyles.profileInfoLabel}>{label}</Text>
            <Text style={GlobalStyles.profileInfoValue}>{value}</Text>
        </View>
    </View>
);

const Profil = () => {
    const { token, loading: isAuthLoading } = useAuth();


    const [data, setData] = useState(null);
    const [depenseData, setDepenseData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [topArticleData, setTopArticleData] = useState(null);

    const [DerniereCommandeData, setDerniereCommandeData] = useState(null);

    const [NombreCommandeData, setNombreCommandeData] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const fetchProfileData = async (token) => {
            setLoading(true);
            setError(null);
            try {
                // Etape 1: On PRÉPARE les deux promesses
                const profilePromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/profil`,
                    {
                        signal,
                        headers: {'Authorization': `Bearer ${token}`}
                    }
                );

                const expensePromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/profil/depense`,
                    {
                        signal,
                        headers: {'Authorization': `Bearer ${token}`}
                    }
                );

                const TopArticlePromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/profil/topArticle`,
                    {
                        signal,
                        headers: {'Authorization': `Bearer ${token}`}
                    }
                );

                const DerniereCommandePromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/profil/derniereCommande`,
                    {
                        signal,
                        headers: {'Authorization': `Bearer ${token}`}
                    }
                );

                const nombreCommandePromise = fetch(
                    `${EXPO_PUBLIC_API_URL}/profil/nombreCommande`,
                    {
                        signal,
                        headers: {'Authorization': `Bearer ${token}`}
                    }
                );


                // Etape 2: On attend les DEUX
                const [profileResponse, expenseResponse,TopArticleResponse,DerniereCommandeResponse,NombreCommandeResponse] = await Promise.all([
                    profilePromise,
                    expensePromise,
                    TopArticlePromise,
                    DerniereCommandePromise,
                    nombreCommandePromise
                ]);

                // Etape 3: On vérifie les DEUX
                if (!profileResponse.ok) {
                    const errorData = await profileResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération du profil.");
                }
                if (!expenseResponse.ok) {
                    const errorData = await expenseResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération des dépenses.");
                }
                if (!TopArticleResponse.ok) {
                    const errorData = await TopArticleResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération de l'artcicle préféré.");
                }
                if (!DerniereCommandeResponse.ok) {
                    const errorData = await DerniereCommandeResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération de la dernière commande.");
                }
                if (!NombreCommandeResponse.ok) {
                    const errorData = await NombreCommandeResponse.json().catch(() => ({}));
                    throw new Error(errorData.message || "Erreur lors de la récupération du nombre de  commande.");
                }


                // Etape 4: On récupère le JSON des DEUX
                const [profileData, expenseData,TopArticleData,DerniereCommandeData, NombreCommandeData] = await Promise.all([
                    profileResponse.json(),
                    expenseResponse.json(),
                    TopArticleResponse.json(),
                    DerniereCommandeResponse.json(),
                    NombreCommandeResponse.json()

                ]);

                // Etape 5: On met à jour les BONS états
                setData(profileData);
                setDepenseData(expenseData);
                setTopArticleData(TopArticleData);
                setDerniereCommandeData(DerniereCommandeData);
                setNombreCommandeData(NombreCommandeData);

            } catch(error) {
                if (error.name !== 'AbortError') {
                    console.error("Erreur de fetch profil:", error.message);
                    setError(error.message || "Impossible de charger les données. Veuillez réessayer.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (isAuthLoading) {
            setLoading(true);
        }
        else if (token) {
            fetchProfileData(token);
        }
        else {
            setLoading(false);
            setError("Vous n'êtes pas connecté.");
        }

        return () => abortController.abort();

    }, [token, isAuthLoading]);

    const getGenreImage = (genre) => {
        switch (genre) {
            case 'M': return maleIcon;
            case 'F': return femaleIcon;
            case 'A': return otherIcon;
            default: return otherIcon;
        }
    };

    // --- Gestion des états ---
    if (loading) {
        return (
            <View style={GlobalStyles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={GlobalStyles.loadingText}>Chargement...</Text>
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

    // Si on n'a pas les données du profil OU les données de dépense, on affiche l'erreur
    if (!data) {
        return (
            <View style={GlobalStyles.container}>
                {/* L'erreur peut venir de l'API, donc on l'affiche si elle existe */}
                <Text style={GlobalStyles.emptyText}>{error || "Aucun profil trouvé."}</Text>
            </View>
        );
    }

// --- Rendu (utilise les GlobalStyles) ---
    return (
        <ProtectedRoute>
            <ScrollView style={GlobalStyles.profileScreen}>

                {/* --- En-tête --- */}
                <View style={GlobalStyles.profileHeader}>

                    <Image
                        source={getGenreImage(data.genre)}
                        style={GlobalStyles.profileImage}
                    />
                    <Text style={GlobalStyles.profileName}>{data.nom}</Text>
                </View>

                {/* --- Carte d'informations --- */}

                <View style={GlobalStyles.profileCard}>

                    <Text style={GlobalStyles.profileCardTitle}>Informations du compte</Text>
                    <InfoRow icon="mail" label="Email" value={data.mail} />
                    <InfoRow icon="map-pin" label="Adresse" value={data.adresse} />
                    <InfoRow icon="map" label="Localisation" value={`${data.cp} ${data.ville}`} />
                    <InfoRow icon="telephone" label="Telephone" value={data.telephone} />
                </View>

                {DerniereCommandeData && DerniereCommandeData.length > 0 ? (
                    <View style={GlobalStyles.profileCard}>


                        <Text style={GlobalStyles.profileCardTitle}>Dernière commande</Text>


                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 15 }}>
                            Le {new Date(DerniereCommandeData[0].date_commande).toLocaleDateString('fr-FR')}
                        </Text>

                        {/* 3. Liste des articles */}

                        {DerniereCommandeData
                            .filter(article => article.date_commande === DerniereCommandeData[0].date_commande)
                            .map((article, index) => (
                                <View key={index} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <Image
                                        source={{ uri: `${EXPO_PUBLIC_API_URL}`+ "/images/produits/" + article.imageUrl }}

                                        style={{ width: 40, height: 40, borderRadius: 5, marginRight: 10 }}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{article.designation}  </Text>
                                        {/* On n'affiche pas le prix ici, car c'est le total */}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Quantité : {article.quantite_demandee} </Text>
                                        {/* On n'affiche pas le prix ici, car c'est le total */}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold' }}>{article.total_ligne_HT} €</Text>
                                        {/* On n'affiche pas le prix ici, car c'est le total */}
                                    </View>

                                </View>

                            ))}
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                            Total TVA : {DerniereCommandeData[0].tva} €
                        </Text>

                        {/* Ligne de séparation */}

                        <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 15 }} />

                        {/* 4. Pied de carte (Prix et Bouton) */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>

                            {/* Prix total (en bas à gauche) - On le prend du premier article */}
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                                Total TTC: {DerniereCommandeData[0].total_commande_TTC} €
                            </Text>

                            {/* Bouton (en bas à droite) */}
                            <TouchableOpacity
                                onPress={() => alert(`Re-commander les articles du ${new Date(DerniereCommandeData[0].dateCommande).toLocaleDateString('fr-FR')}`)}
                                style={{
                                    backgroundColor: '#007bff', // Un bleu exemple
                                    paddingVertical: 8,
                                    paddingHorizontal: 15,
                                    borderRadius: 5
                                }}
                            >
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Re-commander</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :

                    <View style={GlobalStyles.profileCard}>

                    </View>
                }

                {/* --- Carte Statistiques --- */}

                <View style={GlobalStyles.profileCard}>

                    <Text style={GlobalStyles.profileCardTitle}>Mes Statistiques</Text>

                    <InfoRow
                        icon="package"
                        label="Argent dépensé"
                        value={depenseData && depenseData[0] && depenseData[0].total ? `${depenseData[0].total} €` : '0 €'}
                    />
                    <InfoRow
                        icon="package"
                        label="Article préféré"
                        value={topArticleData && topArticleData[0] && topArticleData[0].designation ? `${topArticleData[0].designation} ` : 'pas encore d/article préféré'}
                    />
                    <InfoRow
                        icon="package"
                        label="Nombre de commande "
                        value={NombreCommandeData && NombreCommandeData[0] && NombreCommandeData[0].date ? `${NombreCommandeData[0].date} ` : 'Aucune commande'}
                    />
                </View>

            </ScrollView>
        </ProtectedRoute>
    );

};

export default Profil;