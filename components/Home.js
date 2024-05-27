import React from 'react';
import { StyleSheet, Text, View, Button, Image, StatusBar } from 'react-native';

export default function Home({navigation}) {
    return (
        <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <Image 
            source={require('../assets/logo.png')} 
            style={styles.logo}
        />
        <Text style={styles.subtitle}>Bienvenido a la plataforma de investigación</Text>
        <Button 
            title="Comenzar"
            onPress={() => navigation.navigate('CreateForm')}
        />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: '100%',
        height: '25%',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        marginBottom: 20,
        textAlign: 'center',
    },
});
