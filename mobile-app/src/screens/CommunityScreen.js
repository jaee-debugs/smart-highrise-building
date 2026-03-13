import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';

const CommunityScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Community Hub</Text>

                <Text style={styles.sectionHeader}>Important Notices</Text>
                <Card style={styles.card}>
                    <View style={styles.head}>
                        <Badge text="Alert" status="error" />
                        <Text style={styles.date}>2023-10-30</Text>
                    </View>
                    <Text style={styles.title}>Water Tank Cleaning</Text>
                    <Text style={styles.body}>No water supply from 10 AM to 2 PM today.</Text>
                </Card>

                <Text style={styles.sectionHeader}>Active Polls</Text>
                <Card style={styles.card}>
                    <Text style={styles.title}>New Gym Equipment?</Text>
                    <View style={styles.pollOption}>
                        <Text style={styles.pollLabel}>Treadmill ( 70% )</Text>
                        <View style={styles.pollBarBg}><View style={[styles.pollBarFill, { width: '70%' }]} /></View>
                    </View>
                    <View style={styles.pollOption}>
                        <Text style={styles.pollLabel}>Dumbbells ( 30% )</Text>
                        <View style={styles.pollBarBg}><View style={[styles.pollBarFill, { width: '30%' }]} /></View>
                    </View>
                </Card>

                <Text style={styles.sectionHeader}>Upcoming Events</Text>
                <Card style={styles.card}>
                    <View style={styles.head}>
                        <Text style={styles.title}>Diwali Celebration</Text>
                        <Badge text="RSVP" />
                    </View>
                    <Text style={styles.body}>Central Lawn • 12 Nov, 6:00 PM</Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.xl },
    sectionHeader: { ...typography.title, color: colors.textDark, marginBottom: spacing.sm },
    card: { marginBottom: spacing.xl, padding: spacing.lg },
    head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    date: { ...typography.caption },
    title: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.xs },
    body: { ...typography.body, color: colors.textLight },
    pollOption: { marginTop: spacing.md },
    pollLabel: { ...typography.body, marginBottom: 4 },
    pollBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5 },
    pollBarFill: { height: 10, backgroundColor: colors.primary, borderRadius: 5 }
});

export default CommunityScreen;
