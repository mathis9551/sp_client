import React,{useContext, useEffect, createContext} from 'react';
import {Text, View} from 'react-native';
import {AuthContext} from "../contexts/AuthContext";

//hook personnalis& pour accèder au context d'authentification
    export default function useAuth() {

    const context = useContext(AuthContext);

        if(context === undefined) {
            throw new Error('erreur de context')
        }
        //retourne tout du context
        return context;
    }
