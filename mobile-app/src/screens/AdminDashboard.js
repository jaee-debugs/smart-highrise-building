import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getInfraStatus } from '../services/apiService';

const AdminDashboard = ({ navigation }) => {
    const [infra, setInfra] = useState(null);

    useEffect(() => {
        const fetchInfra = async () => {
            try {
                const data = await getInfraStatus();
                setInfra(data);
            } catch (err) { }
        };
        fetchInfra();
    }, []);

    const features = [
        { id: 1, title: 'Water Infra', icon: '💧', route: 'WaterMonitoring' },
        { id: 2, title: 'Energy Analytics', icon: '⚡', route: 'Energy' },
        { id: 3, title: 'Infra Monitor', icon: '🏢', route: 'InfraMonitor' },
        { id: 4, title: 'Security Control', icon: '🛡️', route: 'Security' },
        { id: 5, title: 'Maintenance', icon: '🔧', route: 'Maintenance' },
        { id: 6, title: 'Manage Community', icon: '📢', route: 'AdminCommunity' },
        { id: 7, title: 'Manage EV Slots', icon: '🔋', route: 'AdminEV' },
        { id: 8, title: 'Manage Parking', icon: '🚗', route: 'AdminParking' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Admin Console</Text>
                    <Text style={styles.subtext}>System Health: Good</Text>
                </View>

                {/* Quick Stats Card */}
                {infra && (
                    <Card style={styles.statsCard}>
                        <Text style={styles.statsTitle}>Live Infrastructure</Text>
                        <View style={styles.statsRow}>
                            <View>
                                <Text style={styles.statLabel}>Water A</Text>
                                <Text style={styles.statValue}>{infra.water.TowerA.level}%</Text>
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Water B</Text>
                                <Text style={styles.statValue}>{infra.water.TowerB.level}%</Text>
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Generator</Text>
                                <Badge text={infra.generator.status} status={infra.generator.status === 'Standby' ? 'success' : 'warning'} />
                            </View>
                        </View>
                    </Card>
                )}

                <Text style={styles.sectionTitle}>Management Modules</Text>
                <View style={styles.grid}>
                    {features.map((item) => (
                        <Card key={item.id} style={styles.gridItem} onPress={() => navigation.navigate(item.route)}>
                            <Text style={styles.icon}>{item.icon}</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </Card>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
    },
    greeting: {
        ...typography.header,
        color: colors.primary,
    },
    subtext: {
        ...typography.body,
        color: colors.success,
        marginTop: spacing.xs,
        fontWeight: 'bold'
    },
    statsCard: {
        backgroundColor: colors.primary,
        marginBottom: spacing.lg,
    },
    statsTitle: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: {
        color: colors.surface,
        fontSize: 12,
        opacity: 0.8,
    },
    statValue: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionTitle: {
        ...typography.title,
        marginBottom: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    icon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    itemTitle: {
        ...typography.body,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default AdminDashboard;
