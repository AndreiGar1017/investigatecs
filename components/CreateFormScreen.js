import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const CreateFormScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([{ id: 1, text: '', options: [''] }]);

    const addQuestion = () => {
        const newId = questions.length + 1;
        setQuestions([...questions, { id: newId, text: '', options: [''] }]);
    };

    const removeQuestion = (id) => {
        setQuestions(questions.filter(question => question.id !== id));
    };

    const handleQuestionChange = (id, text) => {
        setQuestions(questions.map(question => 
        question.id === id ? { ...question, text } : question
        ));
    };

    const handleOptionChange = (questionId, optionIndex, text) => {
        setQuestions(questions.map(question =>
        question.id === questionId ? {
            ...question,
            options: question.options.map((option, index) => index === optionIndex ? text : option)
        } : question
        ));
    };

    const addOption = (questionId) => {
        setQuestions(questions.map(question =>
        question.id === questionId ? {
            ...question,
            options: [...question.options, '']
        } : question
        ));
    };

    const removeOption = (questionId, optionIndex) => {
        setQuestions(questions.map(question =>
        question.id === questionId ? {
            ...question,
            options: question.options.filter((option, index) => index !== optionIndex)
        } : question
        ));
    };

    const saveForm = () => {
        navigation.navigate('AnswerForm', { questions });
    };

    useFocusEffect(
        React.useCallback(() => {
            const clearForm = async () => {
                await AsyncStorage.removeItem('surveyResults');
            };
            clearForm();
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Text style={styles.title}>Crear Formulario de Opción Múltiple</Text>
        
        {questions.map((question, index) => (
            <View key={question.id} style={styles.questionContainer}>
            <Input
                placeholder={`Pregunta ${question.id}`}
                value={question.text}
                onChangeText={(text) => handleQuestionChange(question.id, text)}
            />
            {question.options.map((option, optionIndex) => (
                <View key={optionIndex} style={styles.optionContainer}>
                <Input
                    placeholder={`Opción ${optionIndex + 1}`}
                    value={option}
                    onChangeText={(text) => handleOptionChange(question.id, optionIndex, text)}
                    containerStyle={styles.optionInput}
                />
                <Button
                    title="X"
                    buttonStyle={styles.deleteButton}
                    onPress={() => removeOption(question.id, optionIndex)}
                />
                </View>
            ))}
            <Button
                title="Agregar Opción"
                onPress={() => addOption(question.id)}
                containerStyle={styles.addButton}
            />
            <Button
                title="Eliminar Pregunta"
                buttonStyle={styles.deleteButton}
                onPress={() => removeQuestion(question.id)}
                containerStyle={styles.deleteQuestionButton}
            />
            </View>
        ))}
        
        <Button
            title="Agregar Pregunta"
            onPress={addQuestion}
            containerStyle={styles.addButton}
        />
        
        <Button
            title="Guardar Formulario"
            onPress={saveForm}
            containerStyle={styles.submitButton}
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
        textAlign: 'center',
    },
    questionContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionInput: {
        flex: 1,
    },
    deleteButton: {
        backgroundColor: 'red',
        marginLeft: 10,
    },
    deleteQuestionButton: {
        marginTop: 10,
        backgroundColor: 'red',
    },
    addButton: {
        marginTop: 20,
    },
    submitButton: {
        marginTop: 20,
    },
});

export default CreateFormScreen;
