// Import des composants du drawer de React Navigation
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
// Import des écrans de l'application
import Home from "../screens/Home";
import Products from "../screens/Products";
import Login from "../screens/Login";
import {GlobalStyles} from "../styles/GlobalStyles";
import useAuth from "../hooks/useAuth";
import Profil from "../screens/Profil";
import CommandeContext from "../screens/commandeContext";
import {Alert, Text, View, Image, TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { usePanier } from '../screens/store';

// Création du drawer navigator
const Drawer = createDrawerNavigator();

/**
 * CustomDrawerContent - Composant personnalisé pour le contenu du drawer
 * Ce composant gère l'affichage dynamique du menu drawer avec un bouton de déconnexion
 *
 * @param {object} props - Les props transmises par le Drawer Navigator
 */

function CustomDrawerContent(props) {

    const { isAuthenticated, logout, user } = useAuth();


    /**
     * handleLogout - Fonction de déconnexion
     * - Supprime le token du stockage sécurisé
     * - Met à jour l'état local
     * - Affiche un message de confirmation
     * - Redirige vers l'écran de connexion après un délai
     */

    const handleLogout = async () => {
        try {

            await logout();

            // Affichage d'un message de confirmation
            Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès");

            // Petit délai pour laisser le drawer se mettre à jour avant de naviguer
            // Le délai de 600ms est légèrement supérieur à l'intervalle de vérification (500ms)
            // pour s'assurer que l'écran Login est bien ajouté au drawer avant la navigation
            setTimeout(() => {
                props.navigation.navigate("Login");
            }, 600);
        } catch (error) {
            // En cas d'erreur, affiche un message d'erreur
            Alert.alert("Erreur", "Erreur lors de la déconnexion");
        }
    };

    return (
        <DrawerContentScrollView {...props}>

            {isAuthenticated && user && ( <View>
                <Text> {user.nom}</Text>
            </View> )}

            {/* DrawerItemList affiche tous les écrans définis dans le Drawer.Navigator */}
            <DrawerItemList {...props} />

            {/* Bouton de déconnexion - Affiché uniquement si l'utilisateur est connecté */}
            {isAuthenticated && (
                <DrawerItem
                    label="Déconnexion"
                    onPress={handleLogout}
                    labelStyle={GlobalStyles.logoutLabel} // Style du texte (rouge)
                    style={GlobalStyles.logoutButton} // Style du bouton (bordure, espacement)
                />
            )}
        </DrawerContentScrollView>
    );
}


/**
 * PrincipalDrawer - Composant principal du drawer
 * Configure le Drawer Navigator avec les écrans de l'application
 * Gère l'affichage conditionnel de l'écran Login selon l'état de connexion
 */

export default function PrincipalDrawer() {
    // État local pour savoir si l'utilisateur est connecté

    const {isAuthenticated} = useAuth()
    const { panier } = usePanier();
    const nombreArticles = panier.reduce((acc, item) => acc + item.quantite, 0);

    return (
        <Drawer.Navigator

            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({ // <--- On récupère navigation ici
                headerTitleAlign: 'center',

                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Commande')}
                        style={{ marginRight: 15 }}
                    >
                        <View>
                            <Image
                                source={require('../assets/panier.jpg')}
                                style={GlobalStyles.headerIcon}
                            />

                            {/* INSERER CE BLOC ICI : */}
                            {nombreArticles > 0 && (
                                <View style={{
                                    position: 'absolute',
                                    right: -5,
                                    top: -5,
                                    backgroundColor: '#FF3B30',
                                    borderRadius: 10,
                                    width: 18,
                                    height: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 1.5,
                                    borderColor: 'white'
                                }}>
                                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                                        {nombreArticles}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ),
            })}
        >
            {/* Écran d'accueil - Toujours visible */}
            <Drawer.Screen name="Home" component={Home} options={{title: "Accueil"}}/>

            {/* Écran de la liste des produits - Toujours visible */}
            <Drawer.Screen name="Produits" component={Products} options={{title: "Liste des produits"}}/>

            <Drawer.Screen name="Profil" component={Profil} options={{title: "Profil"}}/>

            <Drawer.Screen name="Commande" component={CommandeContext} options={{title: "Commande"}}/>

            {/* Écran de connexion - Visible UNIQUEMENT si l'utilisateur n'est PAS connecté (!isLogin) */}
            {!isAuthenticated && <Drawer.Screen name="Login" component={Login} options={{title: "Connexion"}}/>}
        </Drawer.Navigator>
    );
}

