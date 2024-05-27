import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultsScreen = () => {
    const [surveyResults, setSurveyResults] = useState({});

    useEffect(() => {
        const fetchSurveyResults = async () => {
        try {
            const storedData = await AsyncStorage.getItem('surveyResults');
            const results = storedData ? JSON.parse(storedData) : {};
            setSurveyResults(results);
        } catch (error) {
            console.error('Error fetching survey results:', error);
        }
        };

        fetchSurveyResults();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Text style={styles.title}>Resultados de la Encuesta</Text>
        {Object.entries(surveyResults).map(([question, options], qIndex) => (
            <View key={qIndex} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question}</Text>
            {Object.entries(options).map(([option, count], oIndex) => (
                <Text key={oIndex} style={styles.optionText}>{`${option}: ${count}`}</Text>
            ))}
            </View>
        ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    questionContainer: {
        marginBottom: 20,
    },
    questionText: {
        fontSize: 16,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 14,
        marginBottom: 5,
    },
});

export default ResultsScreen;
