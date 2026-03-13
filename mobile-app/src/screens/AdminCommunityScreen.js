import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';

const AdminCommunityScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Community Moderation</Text>
                <Card style={styles.card}>
                    <Text>Manage notices, polls, events, and lost & found requests from residents.</Text>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
    card: { padding: spacing.lg },
});
export default AdminCommunityScreen;
