import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '../theme/Theme';
import Button from '../components/Button';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';

const IndoorNavigationScreen = () => {
    return (
        <MatteScreen>
            <View style={styles.content}>
                <MattePanel style={styles.mapCard}>
                    <View style={styles.placeholderBox}>
                        <Text style={styles.placeholderIcon}>3D</Text>
                        <Text style={styles.placeholderTitle}>3D Digital Twin Map</Text>
                        <Text style={styles.placeholderDesc}>Interactive building layout mapping your path to amenities.</Text>
                    </View>
                    <Button title="View 3D Map" onPress={() => alert('Static map display ready for 3D render engine integration.')} style={styles.mapButton} textStyle={styles.actionText} />
                </MattePanel>

                <MattePanel style={styles.routingInfo}>
                    <Text style={styles.routeHeader}>Smart Routing</Text>
                    <Text style={styles.routeDetail}>• Fastest route to Gym: Lift 2, Floor 5</Text>
                    <Text style={styles.routeDetail}>• Nearest Emergency Exit: Stairwell B (50m)</Text>
                </MattePanel>
            </View>
        </MatteScreen>
    );
};

const styles = StyleSheet.create({
    content: { padding: spacing.lg, flex: 1, justifyContent: 'center' },
    mapCard: { padding: spacing.lg, marginBottom: spacing.xl },
    placeholderBox: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        height: 250,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        padding: spacing.md
    },
    placeholderIcon: { fontSize: 32, marginBottom: spacing.sm, color: '#F4F8FB', fontWeight: '700' },
    placeholderTitle: { fontSize: 20, fontWeight: '700', color: '#F4F8FB' },
    placeholderDesc: { fontSize: 14, textAlign: 'center', color: 'rgba(236,244,250,0.72)', marginTop: spacing.sm },
    routingInfo: { padding: spacing.md },
    routeHeader: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, color: '#F4F8FB' },
    routeDetail: { fontSize: 14, marginBottom: spacing.xs, color: 'rgba(236,244,250,0.82)' },
    mapButton: { backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
    actionText: { color: '#FFFFFF' }
});

export default IndoorNavigationScreen;
