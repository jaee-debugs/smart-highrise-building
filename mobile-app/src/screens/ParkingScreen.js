import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getParkingStatus } from '../services/apiService';
import ParkingSlotCard from '../components/ParkingSlotCard';

const ParkingScreen = () => {
    const [parkingData, setParkingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchParking();
    }, []);

    const fetchParking = async () => {
        try {
            const data = await getParkingStatus();
            setParkingData(data);
        } catch (error) {
            console.log('Error fetching parking', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.center} size="large" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Parking Slots Overview</Text>
            <FlatList
                data={parkingData}
                keyExtractor={(item) => item.slotId}
                numColumns={2}
                renderItem={({ item }) => (
                    <ParkingSlotCard slotId={item.slotId} status={item.status} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ParkingScreen;
