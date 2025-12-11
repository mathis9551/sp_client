import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import * as SecureStore from "expo-secure-store"

export default function CommandeContext() {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Bienvenue sur la page d'accueil ! </Text>
        </View>
    );
}