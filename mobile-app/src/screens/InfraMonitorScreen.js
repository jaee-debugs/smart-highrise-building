import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { getInfraStatus } from '../services/apiService';

const InfraMonitorScreen = () => {
    const [infra, setInfra] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfra = async () => {
            try {
                const data = await getInfraStatus();
                setInfra(data);
            } catch (err) { }
            setLoading(false);
        };
        fetchInfra();
    }, []);

    if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator /></View>;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Infrastructure Command</Text>

                {infra && (
                    <>
                        <Card style={styles.card}>
                            <Text style={styles.sectionTitle}>Backup Power</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Main Generator</Text>
                                <Badge text={infra.generator.status} status="success" />
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Fuel Level</Text>
                                <Text style={styles.val}>{infra.generator.fuel}</Text>
                            </View>
                            <Button title="Test Start Generator" variant="outline" onPress={() => { }} style={{ marginTop: 10 }} />
                        </Card>

                        <Card style={styles.card}>
                            <Text style={styles.sectionTitle}>Fire Safety System</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>System Status</Text>
                                <Badge text={infra.fire.status} status="success" />
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Last Inspected</Text>
                                <Text style={styles.val}>{infra.fire.lastChecked}</Text>
                            </View>
                            <Button title="Trigger Fire Drill Alarm" variant="primary" style={{ backgroundColor: colors.error, marginTop: 10 }} onPress={() => { }} />
                        </Card>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
    card: { marginBottom: spacing.lg, padding: spacing.lg },
    sectionTitle: { ...typography.title, marginBottom: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    label: { ...typography.body, color: colors.textDark },
    val: { ...typography.body, fontWeight: 'bold' }
});

export default InfraMonitorScreen;
