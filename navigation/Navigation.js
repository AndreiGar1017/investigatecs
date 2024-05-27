import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateFormScreen from '../components/CreateFormScreen';
import AnswerFormScreen from '../components/AnswerFormScreen';
import ResultsScreen from '../components/ResultScreen';
import Home from '../components/Home';

const Stack = createStackNavigator();

const Navigation = () => {
    return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="CreateForm" component={CreateFormScreen} options={{ title: 'Crear Formulario' }} />
            <Stack.Screen name="AnswerForm" component={AnswerFormScreen} options={{ title: 'Responder Formulario' }} />
            <Stack.Screen name="Results" component={ResultsScreen} />
        </Stack.Navigator>
    </NavigationContainer>
    );
};

export default Navigation;
