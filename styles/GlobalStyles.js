import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
    // ===================================
    // Styles Généraux (existants)
    // ===================================
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5', // Fond gris clair
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666666',
    },
    emptyText: {
        fontSize: 18,
        color: '#FF3B30',
        textAlign: 'center',
    },
    errorText: {
        color: '#d9534f',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 15,
        paddingHorizontal: 10,
    },

    // ===================================
    // Styles de Produits (existants)
    // ===================================
    productItem: {
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        marginVertical: 6,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
    },

    //icone panier
    headerIcon: {
        width: 28,
        height: 28,
        marginRight: 15,
    },
    // ===================================
    // Styles de Formulaire (existants)
    // ===================================
    formWrapper: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        padding: 30,
        borderRadius: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1a1a1a',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    buttonContainer: {
        marginTop: 20,
    },

    // ===================================
    // Styles de Logout (existants)
    // ===================================
    logoutButton: {
        marginTop: 50,
        width: '100%',
        backgroundColor: 'transparent',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    logoutLabel: {
        color: 'white',
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
        borderRadius: 5,
    },

    // ===================================
    // 👇 NOUVEAUX STYLES POUR LE PROFIL
    // ===================================
    profileScreen: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Fond gris très clair pour l'écran
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#f0f2f5',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    profileName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333',
    },
    profileNamee: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
    },
    profileCard: {
        backgroundColor: '#ffffff', // Fond blanc
        borderRadius: 12,
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // Ombre Android
    },
    profileCardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        marginBottom: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileInfoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    profileInfoIcon: {
        marginRight: 15,
        marginTop: 2,
        color: '#1e3c72', // Une couleur d'accent (bleu foncé)
    },
    profileInfoTextContainer: {
        flex: 1,
    },
    profileInfoLabel: {
        fontSize: 14,
        color: '#888', // Label en gris
    },
    profileInfoValue: {
        fontSize: 16,
        color: '#333', // Valeur en noir
        marginTop: 2,
    },
    // ... (vos styles existants) ...

    // ===================================
    // Styles de Produits - NOUVEAUX STYLES POUR LA GRILLE
    // ===================================
    productsGridContainer: {
        paddingHorizontal: 10, // Un peu de padding sur les côtés
        paddingTop: 10,
        backgroundColor: '#f0f2f5', // Fond léger pour la grille
    },
    productGridItem: {
        flex: 1, // Pour que chaque item prenne la moitié de la largeur
        margin: 5, // Espace entre les items
        backgroundColor: '#ffffff',
        borderRadius: 10,
        overflow: 'hidden', // Pour que l'image respecte le borderRadius
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center', // Centre le contenu dans la carte
        paddingBottom: 10, // Espace en bas du texte
    },
    productImage: {
        width: '100%', // L'image prend toute la largeur de la carte
        height: 150, // Hauteur fixe pour les images
        resizeMode: 'cover', // Redimensionne l'image pour couvrir la zone
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
        paddingHorizontal: 10, // Padding pour le texte
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e3c72', // Couleur d'accent
        textAlign: 'center',
    },

// ... (fin de votre StyleSheet) ...

});