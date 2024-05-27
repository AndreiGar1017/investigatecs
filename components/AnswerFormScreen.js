import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnswerFormScreen = ({ route, navigation }) => {
    const { questions } = route.params;
    const { control, handleSubmit, reset, getValues } = useForm();

    const onSubmit = async () => {
        const data = getValues();
        const formattedData = questions.map((question, qIndex) => {
            const selectedOptions = question.options
                .map((option, oIndex) => {
                    const optionKey = `option${oIndex}`;
                    return { option, selected: data.questions[qIndex][optionKey] };
                })
                .filter(optionObj => optionObj.selected)
                .map(optionObj => optionObj.option);
    
            return {
                question: question.text,
                selectedOptions: selectedOptions,
            };
        });
    
        try {
            const storedData = await AsyncStorage.getItem('surveyResults');
            let surveyResults = storedData ? JSON.parse(storedData) : {};
    
            formattedData.forEach(({ question, selectedOptions }) => {
                if (!surveyResults[question]) {
                    surveyResults[question] = {};
                }
    
                selectedOptions.forEach(option => {
                    if (!surveyResults[question][option]) {
                        surveyResults[question][option] = 0;
                    }
                    surveyResults[question][option] += 1;
                });
            });
    
            await AsyncStorage.setItem('surveyResults', JSON.stringify(surveyResults));
        } catch (error) {
            console.error('Error saving survey results:', error);
        }
        handleReset();
    };
    

    const handleReset = () => {
        const resetValues = {};
        questions.forEach((question, qIndex) => {
            question.options.forEach((option, oIndex) => {
                resetValues[`questions[${qIndex}].option${oIndex}`] = false;
            });
        });
        reset(resetValues);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <Text style={styles.title}>Responder Formulario de Opción Múltiple</Text>

            {questions.map((question, qIndex) => (
                <View key={qIndex} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.text}</Text>
                    {question.options.map((option, oIndex) => (
                        <Controller
                            key={oIndex}
                            name={`questions[${qIndex}].option${oIndex}`}
                            control={control}
                            defaultValue={false}
                            render={({ field: { onChange, value } }) => (
                                <CheckBox
                                    title={option}
                                    checked={value}
                                    onPress={() => onChange(!value)}
                                    checkedIcon='dot-circle-o' 
                                    uncheckedIcon='circle-o'   
                                />
                            )}
                        />
                    ))}
                </View>
            ))}

            <Button
                title="Enviar Respuestas"
                onPress={handleSubmit(onSubmit)}
                containerStyle={styles.submitButton}
            />
            <Button
                title="Restablecer Respuestas"
                onPress={handleReset}
                containerStyle={styles.resetButton}
                buttonStyle={styles.resetButtonStyle}
            />
            <Button
                title="Ver Resultados"
                onPress={() => navigation.navigate('Results')}
                containerStyle={styles.resultsButton}
                buttonStyle={styles.resultsButtonStyle}
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
    submitButton: {
        marginTop: 20,
    },
    resetButton: {
        marginTop: 10,
    },
    resetButtonStyle: {
        backgroundColor: 'grey',
    },
    resultsButton: {
        marginTop: 10,
    },
    resultsButtonStyle: {
        backgroundColor: 'blue',
    }
});

export default AnswerFormScreen;
