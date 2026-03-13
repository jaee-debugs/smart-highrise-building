import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getSustainabilityData } from '../services/apiService';

const ResidentDashboard = ({ navigation }) => {
    const [susData, setSusData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSustainabilityData();
                setSusData(data);
            } catch (err) { }
        };
        fetchData();
    }, []);

    const features = [
        { id: 1, title: 'Smart Parking', icon: '🚗', route: 'Parking', status: 'Available' },
        { id: 2, title: 'Visitor Control', icon: '👤', route: 'Visitor', status: null },
        { id: 3, title: 'Indoor Map', icon: '🗺️', route: 'IndoorNavigation', status: null },
        { id: 4, title: 'Sustainability', icon: '🌱', route: 'Sustainability', status: susData ? `${susData.greenPoints} pts` : null },
        { id: 5, title: 'Community', icon: '💬', route: 'Community', status: '1 New' },
        { id: 6, title: 'EV Charging', icon: '⚡', route: 'EVCharging', status: 'Slot Free' },
        { id: 7, title: 'Elevators', icon: '🛗', route: 'Elevator', status: 'Operational' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hello, Resident</Text>
                    <Text style={styles.subtext}>Tower A • Flat 101</Text>
                </View>

                {/* Emergency SOS */}
                <Card style={styles.sosCard} onPress={() => alert('Emergency Services Contacted!')}>
                    <Text style={styles.sosText}>🚨 EMERGENCY SOS</Text>
                </Card>

                <Text style={styles.sectionTitle}>Quick Access</Text>
                <View style={styles.grid}>
                    {features.map((item) => (
                        <Card key={item.id} style={styles.gridItem} onPress={() => navigation.navigate(item.route)}>
                            <Text style={styles.icon}>{item.icon}</Text>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            {item.status && <Badge text={item.status} style={{ marginTop: spacing.sm }} />}
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
        color: colors.textLight,
        marginTop: spacing.xs,
    },
    sosCard: {
        backgroundColor: colors.error,
        alignItems: 'center',
        paddingVertical: spacing.md,
        marginBottom: spacing.lg,
    },
    sosText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 18,
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

export default ResidentDashboard;
