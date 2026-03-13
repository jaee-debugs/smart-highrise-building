import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getWaterLevels } from '../services/apiService';

const WaterMonitoringScreen = () => {
    const [waterData, setWaterData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWater();
    }, []);

    const fetchWater = async () => {
        try {
            const data = await getWaterLevels();
            setWaterData(data);
        } catch (error) {
            console.log('Error fetching water', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.center} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Live Water Tank Levels</Text>
            <FlatList
                data={waterData}
                keyExtractor={(item) => item.tower}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.towerName}>{item.tower}</Text>
                        <View style={styles.barContainer}>
                            <View style={[styles.barFill, { width: `${item.tankLevel}%`, backgroundColor: item.tankLevel < 30 ? 'red' : '#29b6f6' }]} />
                        </View>
                        <Text style={styles.levelText}>{item.tankLevel}% Full</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { padding: 16, marginBottom: 16, backgroundColor: '#e1f5fe', borderRadius: 8 },
    towerName: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
    barContainer: { height: 20, backgroundColor: '#ccc', borderRadius: 10, overflow: 'hidden' },
    barFill: { height: '100%' },
    levelText: { marginTop: 8, fontSize: 14, color: '#555', textAlign: 'right' }
});

export default WaterMonitoringScreen;
