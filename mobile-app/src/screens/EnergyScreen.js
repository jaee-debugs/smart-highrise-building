import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getEnergyData } from '../services/apiService';

const EnergyScreen = () => {
    const [energyData, setEnergyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnergy();
    }, []);

    const fetchEnergy = async () => {
        try {
            const data = await getEnergyData();
            setEnergyData(data);
        } catch (error) {
            console.log('Error fetching energy', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.center} size="large" />;
    }

    if (!energyData) {
        return <Text style={styles.center}>No Energy data available.</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sustainability Report</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Total Steps Today</Text>
                <Text style={styles.value}>{energyData.steps}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Energy Generated</Text>
                <Text style={styles.value}>{energyData.energyGenerated}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Your Green Points</Text>
                <Text style={styles.value}>{energyData.greenPoints}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { padding: 24, marginBottom: 16, backgroundColor: '#e8f5e9', borderRadius: 12, alignItems: 'center' },
    label: { fontSize: 16, color: '#555', marginBottom: 8 },
    value: { fontSize: 32, fontWeight: 'bold', color: '#2e7d32' }
});

export default EnergyScreen;
