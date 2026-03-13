import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';

const IndoorNavigationScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Card style={styles.mapCard}>
                    <View style={styles.placeholderBox}>
                        <Text style={styles.placeholderIcon}>🗺️</Text>
                        <Text style={styles.placeholderTitle}>3D Digital Twin Map</Text>
                        <Text style={styles.placeholderDesc}>Interactive building layout mapping your path to amenities.</Text>
                    </View>
                    <Button title="View 3D Map" onPress={() => alert('Static map display ready for 3D render engine integration.')} />
                </Card>

                <View style={styles.routingInfo}>
                    <Text style={styles.routeHeader}>Smart Routing</Text>
                    <Text style={styles.routeDetail}>• Fastest route to Gym: Lift 2, Floor 5</Text>
                    <Text style={styles.routeDetail}>• Nearest Emergency Exit: Stairwell B (50m)</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, flex: 1, justifyContent: 'center' },
    mapCard: { padding: spacing.lg, marginBottom: spacing.xl },
    placeholderBox: {
        backgroundColor: '#EAEAEA',
        height: 250,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        padding: spacing.md
    },
    placeholderIcon: { fontSize: 48, marginBottom: spacing.sm },
    placeholderTitle: { ...typography.title, fontWeight: 'bold' },
    placeholderDesc: { ...typography.body, textAlign: 'center', color: colors.textLight, marginTop: spacing.sm },
    routingInfo: { padding: spacing.md },
    routeHeader: { ...typography.title, marginBottom: spacing.sm },
    routeDetail: { ...typography.body, marginBottom: spacing.xs, color: colors.textDark }
});

export default IndoorNavigationScreen;
