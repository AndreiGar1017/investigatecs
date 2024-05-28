import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

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

    const createAndSaveExcelFile = async () => {
        const wb = XLSX.utils.book_new();
        const wsData = [["Pregunta", "Opción", "Contador"]];

        Object.entries(surveyResults).forEach(([question, options]) => {
            Object.entries(options).forEach(([option, count]) => {
                wsData.push([question, option, count]);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Resultados");

        const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

        const downloadDir = RNFS.DownloadDirectoryPath;
        const filePath = `${downloadDir}/resultados_encuesta.xlsx`;

        try {
            await RNFS.writeFile(filePath, wbout, 'ascii');
            Alert.alert("Éxito", "El archivo Excel ha sido guardado en la carpeta de descargas.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo guardar el archivo Excel.");
        }
    };

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
            <Button
                title="Descargar Resultados"
                onPress={createAndSaveExcelFile}
                containerStyle={styles.downloadButton}
                buttonStyle={styles.downloadButtonStyle}
            />
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
    downloadButton: {
        marginTop: 20,
    },
    downloadButtonStyle: {
        backgroundColor: 'green',
    },
});

export default ResultsScreen;
