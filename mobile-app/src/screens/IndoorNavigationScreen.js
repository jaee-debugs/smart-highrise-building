import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const IndoorNavigationScreen = () => {
    const [showMap, setShowMap] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Indoor 3D Map (Placeholder)</Text>
            <Text style={styles.subtitle}>This screen will integrate Archicad models in the future.</Text>

            {!showMap ? (
                <TouchableOpacity style={styles.button} onPress={() => setShowMap(true)}>
                    <Text style={styles.buttonText}>View 3D Map</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.mapContainer}>
                    {/* Using a local asset if available, fallback to a local require */}
                    <Image
                        source={{ uri: 'https://via.placeholder.com/400x400.png?text=Floorplan+Placeholder' }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
    button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    mapContainer: { width: '100%', height: 400, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: '100%', backgroundColor: '#eee' }
});

export default IndoorNavigationScreen;
