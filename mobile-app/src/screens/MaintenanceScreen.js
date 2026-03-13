import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';

const MaintenanceScreen = () => {
    const complaints = [
        { id: 1, issue: 'Leaking Pipe', location: 'Tower A 101', status: 'Pending', reportedOn: '2023-10-26' },
        { id: 2, issue: 'Elevator sound', location: 'Tower B Lift 1', status: 'Resolved', reportedOn: '2023-10-25' }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Maintenance Request Queue</Text>

                {complaints.map(req => (
                    <Card key={req.id} style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.issue}>{req.issue}</Text>
                            <Badge text={req.status} status={req.status === 'Pending' ? 'warning' : 'success'} />
                        </View>
                        <Text style={styles.details}>{req.location} • Reported: {req.reportedOn}</Text>
                    </Card>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
    card: { marginBottom: spacing.md, padding: spacing.lg },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    issue: { ...typography.title, fontWeight: 'bold' },
    details: { ...typography.body, color: colors.textLight, marginTop: spacing.sm }
});

export default MaintenanceScreen;
