import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ParkingSlotCard = ({ slotId, status }) => {
    const isAvailable = status === 'available';
    const displayStatus = status ? status.toUpperCase() : 'UNKNOWN';

    return (
        <View style={[styles.card, isAvailable ? styles.available : styles.occupied]}>
            <Text style={styles.slotId}>{slotId}</Text>
            <Text style={styles.status}>{displayStatus}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        margin: 10,
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    available: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
    },
    occupied: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
    },
    slotId: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    status: {
        fontSize: 12,
        fontWeight: '600',
    }
});

export default ParkingSlotCard;
