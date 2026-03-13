import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const VisitorScreen = () => {
    const [visitorName, setVisitorName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [visitTime, setVisitTime] = useState('');

    const generatePass = () => {
        if (!visitorName || !flatNumber || !visitTime) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        Alert.alert('Success', `Visitor pass generated for ${visitorName}`);
        setVisitorName('');
        setFlatNumber('');
        setVisitTime('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register a Visitor</Text>

            <TextInput
                style={styles.input}
                placeholder="Visitor Name"
                value={visitorName}
                onChangeText={setVisitorName}
            />
            <TextInput
                style={styles.input}
                placeholder="Flat Number"
                value={flatNumber}
                onChangeText={setFlatNumber}
            />
            <TextInput
                style={styles.input}
                placeholder="Time of Visit"
                value={visitTime}
                onChangeText={setVisitTime}
            />

            <TouchableOpacity style={styles.button} onPress={generatePass}>
                <Text style={styles.buttonText}>Generate Mock Visitor Pass</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, marginBottom: 16 },
    button: { backgroundColor: '#9c27b0', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default VisitorScreen;
