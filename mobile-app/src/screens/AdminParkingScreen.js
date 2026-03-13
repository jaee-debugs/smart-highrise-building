import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';

const AdminParkingScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Parking Manager</Text>
                <Card style={styles.card}>
                    <Text style={styles.title}>Slot Override</Text>
                    <Text style={styles.body}>Admin controls to release illegally occupied parking slots or block slots for maintenance.</Text>
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
    title: { ...typography.title, marginBottom: spacing.sm },
    body: { ...typography.body, color: colors.textLight }
});
export default AdminParkingScreen;
