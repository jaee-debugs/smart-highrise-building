import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { spacing } from '../theme/Theme';
import Button from '../components/Button';
import { Pedometer } from 'expo-sensors';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
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
        <MatteScreen>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>My Impact</Text>

                {data && (
                    <View style={styles.grid}>
                        <MattePanel style={styles.statCard}>
                            <Text style={styles.icon}>ST</Text>
                            <Text style={styles.statLabel}>Steps Today</Text>
                            <Text style={styles.statValue}>{data.steps}</Text>
                        </MattePanel>
                        <MattePanel style={styles.statCard}>
                            <Text style={styles.icon}>EG</Text>
                            <Text style={styles.statLabel}>Energy Gen</Text>
                            <Text style={styles.statValue}>{data.energyGeneratedWh} Wh</Text>
                        </MattePanel>
                    </View>
                )}

                <MattePanel style={styles.mainCard}>
                    <Text style={styles.cardHeader}>Green Points Score</Text>
                    <Text style={styles.scoreText}>{data ? data.greenPoints : 0}</Text>
                    <Text style={styles.rankText}>Leaderboard Rank: #{data ? data.leaderboardRank : '-'}</Text>
                    <Text style={styles.sessionText}>Current Session Steps: {sessionSteps}</Text>
                    <Button
                        title={tracking ? 'Stop Tracking' : 'Start Step Tracking'}
                        variant={tracking ? 'secondary' : 'primary'}
                        onPress={tracking ? stopStepTracking : startStepTracking}
                        style={styles.primaryButton}
                        textStyle={styles.actionText}
                    />
                    <Button
                        title="Sync Session to Green Points"
                        variant="outline"
                        onPress={syncSessionSteps}
                        loading={syncing}
                        style={styles.secondaryButton}
                        textStyle={styles.actionText}
                    />
                    <Button
                        title="View Leaderboard"
                        variant="outline"
                        onPress={() => navigation.navigate('Leaderboard')}
                        style={styles.secondaryButton}
                        textStyle={styles.actionText}
                    />
                </MattePanel>

                <MattePanel style={styles.infoCard}>
                    <Text style={styles.infoTitle}>How it works?</Text>
                    <Text style={styles.infoBody}>By walking in smart-tiled areas inside the building, kinetic energy is converted into electricity. The more you walk, the more power you feed into the building grid, earning you Green Points which can be redeemed against maintenance bills!</Text>
                </MattePanel>
            </ScrollView>
        </MatteScreen>
    );
};

const styles = StyleSheet.create({
    scroll: { padding: spacing.lg },
    pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.lg },
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
    statCard: { width: '48%', alignItems: 'center' },
    icon: { fontSize: 18, marginBottom: spacing.xs, color: '#F4F8FB', fontWeight: '700' },
    statLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(236,244,250,0.72)' },
    statValue: { fontSize: 18, fontWeight: '700', color: '#2D6A4F', marginTop: spacing.xs },
    mainCard: { alignItems: 'center', marginBottom: spacing.md },
    cardHeader: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, color: '#F4F8FB' },
    scoreText: { fontSize: 48, fontWeight: 'bold', color: '#2D6A4F', marginBottom: spacing.xs },
    rankText: { fontSize: 14, color: 'rgba(236,244,250,0.72)' },
    sessionText: { fontSize: 12, marginTop: spacing.sm, color: 'rgba(236,244,250,0.72)' },
    infoCard: {},
    infoTitle: { fontSize: 20, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.sm },
    infoBody: { fontSize: 14, color: 'rgba(236,244,250,0.82)', lineHeight: 22 },
    primaryButton: { marginTop: spacing.md, backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
    secondaryButton: { marginTop: spacing.sm, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
    actionText: { color: '#FFFFFF' }
});

export default SustainabilityScreen;
