import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
import { getInfraStatus } from '../services/apiService';

const ElevatorScreen = () => {
    const [lifts, setLifts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLifts = async () => {
            try {
                const data = await getInfraStatus();
                setLifts(data.lifts);
            } catch (err) {
            } finally {
                setLoading(false);
            }
        };
        fetchLifts();
    }, []);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.white} /></View>;

    return (
        <MatteScreen>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Elevator Operations</Text>
                <Text style={styles.pageDesc}>Real-time status of all lifts in your tower.</Text>

                {lifts && lifts.map((lift, idx) => (
                    <MattePanel key={idx} style={styles.liftCard}>
                        <View style={styles.liftInfo}>
                            <View>
                                <Text style={styles.liftId}>Lift {lift.id}</Text>
                                <Text style={styles.liftDesc}>High-Speed Passenger</Text>
                            </View>
                        </View>
                        <View style={styles.indicatorWrap}>
                            <View style={[styles.dot, lift.health === 'Healthy' ? styles.dotGreen : styles.dotRed]} />
                            <View style={styles.lineBar}><View style={[styles.lineFill, lift.health === 'Healthy' ? styles.dotGreen : styles.dotRed, { width: lift.health === 'Healthy' ? '78%' : '38%' }]} /></View>
                        </View>
                    </MattePanel>
                ))}
            </ScrollView>
        </MatteScreen>
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08111A' },
    scroll: { padding: spacing.lg },
    pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB' },
    pageDesc: { fontSize: 14, color: 'rgba(236,244,250,0.72)', marginBottom: spacing.xl, marginTop: spacing.xs },
    liftCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, padding: spacing.lg },
    liftInfo: { flexDirection: 'row', alignItems: 'center' },
    liftId: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    liftDesc: { fontSize: 12, color: 'rgba(236,244,250,0.72)' },
    indicatorWrap: { alignItems: 'flex-end' },
    dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 8 },
    dotGreen: { backgroundColor: '#2D6A4F' },
    dotRed: { backgroundColor: '#9B2226' },
    lineBar: { width: 90, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
    lineFill: { height: 4, borderRadius: 4 }
});

export default ElevatorScreen;
