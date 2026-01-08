import React, { createContext, useState, useContext } from 'react';

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
    const [panier, setPanier] = useState([]);

    const ajouterAuPanier = (produit) => {
        setPanier((prevPanier) => {
            const existe = prevPanier.find(item => item.id === produit.id);
            if (existe) {
                // Si l'article existe, on augmente la quantité
                return prevPanier.map(item =>
                    item.id === produit.id ? { ...item, quantite: item.quantite + 1 } : item
                );
            }
            // Sinon on l'ajoute avec quantité 1
            return [...prevPanier, { ...produit, quantite: 1 }];
        });
    };

    const supprimerDuPanier = (id) => {
        setPanier(prevPanier => prevPanier.filter(item => item.id !== id));
    };

    return (
        <PanierContext.Provider value={{ panier, ajouterAuPanier, supprimerDuPanier }}>
            {children}
        </PanierContext.Provider>
    );
};

export const usePanier = () => useContext(PanierContext);