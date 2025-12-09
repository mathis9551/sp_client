import React, { useState } from 'react';
// 1. Importer les nouveaux composants
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { GlobalStyles } from "../styles/GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
// 2. Importer les icônes
import Icon from 'react-native-vector-icons/Feather';
import {EXPO_PUBLIC_API_URL} from "../config";

export default function Login() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // 3. Ajouter un état de chargement
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const { login } = useAuth();

    const handleLogin = async () => {
        // Cacher l'erreur précédente
        setError(null);
        // Démarrer le chargement
        setLoading(true);

        try {
            const abortController = new AbortController();

            const response = await fetch(`${EXPO_PUBLIC_API_URL}/client/login`, {
                signal: abortController.signal,
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify( { mail: mail, password: password})
            });

            const data = await response.json();

            if (response.ok) {
                const userData = { nom : data.nom };
                login(data.token, userData);

                setTimeout(() => {
                    navigation.navigate("Home");
                }, 100);

            } else {
                if ( response.status === 401){
                    setError(data.message); // data.message vient de l'API
                }
            }

        } catch (error) {
            setError("Erreur de serveur, veuillez réssayer plus tard.");
        } finally {
            // Arrêter le chargement dans tous les cas
            setLoading(false);
        }
    }

    // --- 4. Le JSX (totalement restylisé) ---
    return (
        // Gère le clavier qui passe par-dessus les champs
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.screen}
        >
            {/* Permet de scroller si l'écran est petit */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* En-tête */}
                <View style={styles.header}>
                    <Text style={styles.title}>Bienvenue</Text>
                    <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
                </View>

                {/* On réutilise la carte blanche de GlobalStyles */}
                <View style={GlobalStyles.formWrapper}>

                    {/* GROUPE EMAIL (avec icône) */}
                    <Text style={GlobalStyles.label}>Adresse mail :</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="mail" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputField}
                            placeholder={"Saisir email"}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={mail}
                            onChangeText={(text) => setMail(text)}
                        />
                    </View>

                    {/* GROUPE MOT DE PASSE (avec icône) */}
                    <Text style={GlobalStyles.label}>Mot de passe :</Text>
                    <View style={styles.inputWrapper}>
                        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputField}
                            placeholder={"Saisir mot de passe"}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>

                    {/* AFFICHAGE DE L'ERREUR */}
                    {error ? (
                        <Text style={GlobalStyles.errorText}>{error}</Text>
                    ) :  null}

                    {/* BOUTON (remplace le <Button> moche) */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading} // Désactive le bouton pendant le chargement
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Connexion</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// --- 5. Les Nouveaux Styles Locaux (Version "Minimaliste Chic") ---
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Un fond blanc pur et net
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 30, // Plus de padding
    },
    header: {
        alignItems: 'flex-start', // Alignement à gauche
        marginBottom: 40,
    },
    title: {
        fontSize: 42, // Beaucoup plus grand
        fontWeight: 'bold', // Très gras
        color: '#222222', // Presque noir
    },
    subtitle: {
        fontSize: 18,
        color: '#888', // Gris clair
        marginTop: 8,
    },

    // --- Les champs (très minimalistes) ---
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6', // Fond gris très clair
        borderRadius: 14, // Plus arrondi
        height: 60, // Plus haut
        marginBottom: 20, // Plus d'espace
        paddingHorizontal: 20,
        borderWidth: 1, // Bordure très subtile
        borderColor: '#EFEFEF',
    },
    inputIcon: {
        marginRight: 15,
        color: '#AAAAAA', // Icône gris neutre
    },
    inputField: {
        flex: 1,
        fontSize: 17,
        color: '#333',
        fontWeight: '500', // Un peu plus gras que la normale
    },

    // --- Le nouveau bouton (le point fort) ---
    button: {
        backgroundColor: '#2C5F2D', // 🔥 Vert forêt profond
        height: 60,
        borderRadius: 30, // Forme "Pilule"
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        // Ombre subtile
        shadowColor: '#2C5F2D',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: '#FFFFFF', // Texte blanc
        fontSize: 18,
        fontWeight: 'bold',
    },
});