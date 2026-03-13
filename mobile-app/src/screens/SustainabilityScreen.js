import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';
import { Pedometer } from 'expo-sensors';
import { addSustainabilitySteps, getSustainabilityData } from '../services/apiService';

const RESIDENT_ID = 'Resident-A101';

const SustainabilityScreen = ({ navigation }) => {
    const [data, setData] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [tracking, setTracking] = useState(false);
    const [sessionSteps, setSessionSteps] = useState(0);
    const [trackerSubscription, setTrackerSubscription] = useState(null);

    const loadData = async () => {
        try {
            const res = await getSustainabilityData(RESIDENT_ID);
            setData(res);
        } catch (error) {
            Alert.alert('Error', 'Unable to load your sustainability data.');
        }
    };

    useEffect(() => {
        loadData();

        return () => {
            if (trackerSubscription) {
                trackerSubscription.remove();
            }
        };
    }, [trackerSubscription]);

    const startStepTracking = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        if (!isAvailable) {
            Alert.alert('Not Supported', 'Step counter is not available on this device.');
            return;
        }

        if (trackerSubscription) {
            trackerSubscription.remove();
        }

        setSessionSteps(0);
        const subscription = Pedometer.watchStepCount((result) => {
            setSessionSteps(result.steps);
        });
        setTrackerSubscription(subscription);
        setTracking(true);
    };

    const stopStepTracking = () => {
        if (trackerSubscription) {
            trackerSubscription.remove();
            setTrackerSubscription(null);
        }
        setTracking(false);
    };

    const syncSessionSteps = async () => {
        if (sessionSteps <= 0) {
            Alert.alert('No Steps', 'Walk a bit first, then sync your session.');
            return;
        }

        try {
            setSyncing(true);
            const updated = await addSustainabilitySteps(RESIDENT_ID, sessionSteps);
            setData(updated);
            setSessionSteps(0);
            stopStepTracking();
        } catch (error) {
            Alert.alert('Sync Failed', 'Could not sync your steps right now.');
        } finally {
            setSyncing(false);
        }
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
                    <Text style={styles.sessionText}>Current Session Steps: {sessionSteps}</Text>
                    <Button
                        title={tracking ? 'Stop Tracking' : 'Start Step Tracking'}
                        variant={tracking ? 'secondary' : 'primary'}
                        onPress={tracking ? stopStepTracking : startStepTracking}
                        style={{ marginTop: spacing.md }}
                    />
                    <Button
                        title="Sync Session to Green Points"
                        variant="outline"
                        onPress={syncSessionSteps}
                        loading={syncing}
                        style={{ marginTop: spacing.sm }}
                    />
                    <Button
                        title="View Leaderboard"
                        variant="outline"
                        onPress={() => navigation.navigate('Leaderboard')}
                        style={{ marginTop: spacing.sm }}
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
    sessionText: { ...typography.caption, marginTop: spacing.sm, color: colors.textLight },
    infoCard: { backgroundColor: colors.surface },
    infoTitle: { ...typography.title, color: colors.primary, marginBottom: spacing.sm },
    infoBody: { ...typography.body, color: colors.textDark, lineHeight: 22 }
});

export default SustainabilityScreen;
