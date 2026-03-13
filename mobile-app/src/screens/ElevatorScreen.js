import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
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

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Elevator Operations</Text>
                <Text style={styles.pageDesc}>Real-time status of all lifts in your tower.</Text>

                {lifts && lifts.map((lift, idx) => (
                    <Card key={idx} style={styles.liftCard}>
                        <View style={styles.liftInfo}>
                            <Text style={styles.liftIcon}>🛗</Text>
                            <View>
                                <Text style={styles.liftId}>Lift {lift.id}</Text>
                                <Text style={styles.liftDesc}>High-Speed Passenger</Text>
                            </View>
                        </View>
                        <Badge
                            text={lift.status}
                            status={lift.status === 'Operational' ? 'success' : 'error'}
                        />
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary },
    pageDesc: { ...typography.body, color: colors.textLight, marginBottom: spacing.xl, marginTop: spacing.xs },
    liftCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, padding: spacing.lg },
    liftInfo: { flexDirection: 'row', alignItems: 'center' },
    liftIcon: { fontSize: 32, marginRight: spacing.md },
    liftId: { ...typography.title, fontWeight: 'bold' },
    liftDesc: { ...typography.caption, color: colors.textLight }
});

export default ElevatorScreen;
