import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';

const AdminEVScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>EV Slot Management</Text>

                <Card style={styles.card}>
                    <Text style={styles.title}>All Station Status</Text>
                    <View style={styles.row}>
                        <Text style={styles.statLabel}>Available</Text>
                        <Text style={styles.statValue}>2</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.statLabel}>Charging</Text>
                        <Text style={styles.statValue}>1</Text>
                    </View>
                    <Button title="Reset Stations" variant="outline" style={{ marginTop: 15 }} onPress={() => { }} />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
    card: { padding: spacing.xl },
    title: { ...typography.title, marginBottom: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    statLabel: { ...typography.body },
    statValue: { ...typography.title, fontWeight: 'bold' }
});
export default AdminEVScreen;
