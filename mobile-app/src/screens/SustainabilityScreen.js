import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { getSustainabilityData } from '../services/apiService';

const SustainabilityScreen = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSusData = async () => {
            try {
                const res = await getSustainabilityData();
                setData(res);
            } catch (error) { }
        };
        fetchSusData();
    }, []);

    const simulateWalking = () => {
        setLoading(true);
        setTimeout(() => {
            if (data) {
                setData({
                    ...data,
                    steps: data.steps + 500,
                    energyGeneratedWh: (data.energyGeneratedWh + 7.5).toFixed(1),
                    greenPoints: data.greenPoints + 10
                });
            }
            setLoading(false);
        }, 800);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>My Impact</Text>

                {data && (
                    <View style={styles.grid}>
                        <Card style={styles.statCard}>
                            <Text style={styles.icon}>👣</Text>
                            <Text style={styles.statLabel}>Steps Today</Text>
                            <Text style={styles.statValue}>{data.steps}</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Text style={styles.icon}>🔋</Text>
                            <Text style={styles.statLabel}>Energy Gen</Text>
                            <Text style={styles.statValue}>{data.energyGeneratedWh} Wh</Text>
                        </Card>
                    </View>
                )}

                <Card style={styles.mainCard}>
                    <Text style={styles.cardHeader}>Green Points Score</Text>
                    <Text style={styles.scoreText}>{data ? data.greenPoints : 0}</Text>
                    <Text style={styles.rankText}>Leaderboard Rank: #{data ? data.leaderboardRank : '-'}</Text>
                    <Button
                        title="Simulate Walk (+500 steps)"
                        variant="primary"
                        onPress={simulateWalking}
                        loading={loading}
                        style={{ marginTop: spacing.md }}
                    />
                </Card>

                <Card style={styles.infoCard}>
                    <Text style={styles.infoTitle}>How it works?</Text>
                    <Text style={styles.infoBody}>By walking in smart-tiled areas inside the building, kinetic energy is converted into electricity. The more you walk, the more power you feed into the building grid, earning you Green Points which can be redeemed against maintenance bills!</Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
    statCard: { width: '48%', alignItems: 'center' },
    icon: { fontSize: 32, marginBottom: spacing.xs },
    statLabel: { ...typography.caption, fontWeight: 'bold' },
    statValue: { ...typography.title, color: colors.accent, marginTop: spacing.xs },
    mainCard: { alignItems: 'center', marginBottom: spacing.md },
    cardHeader: { ...typography.title, marginBottom: spacing.sm },
    scoreText: { fontSize: 48, fontWeight: 'bold', color: colors.success, marginBottom: spacing.xs },
    rankText: { ...typography.body, color: colors.textLight },
    infoCard: { backgroundColor: colors.surface },
    infoTitle: { ...typography.title, color: colors.primary, marginBottom: spacing.sm },
    infoBody: { ...typography.body, color: colors.textDark, lineHeight: 22 }
});

export default SustainabilityScreen;
