import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';

const SecurityScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>Security Operations</Text>

                <Card style={styles.camCard}>
                    <View style={styles.camFeed}>
                        <Text style={styles.camText}>Main Gate CCTV Feed</Text>
                        <Text style={styles.camTextSignal}>Live 🔴</Text>
                    </View>
                    <View style={styles.camControls}>
                        <Button title="Open Gate" variant="outline" style={{ flex: 1, marginRight: 5 }} onPress={() => { }} />
                        <Button title="Sound Alarm" style={{ flex: 1, marginLeft: 5, backgroundColor: colors.error }} onPress={() => { }} />
                    </View>
                </Card>

                <Text style={styles.sectionTitle}>Visitor Verification</Text>
                <Card style={styles.verifyCard}>
                    <Text style={{ textAlign: 'center', marginBottom: 15 }}>Scan Guest QR code from their mobile device to grant entry.</Text>
                    <Button title="Open Camera Scanner" onPress={() => { }} />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
    camCard: { marginBottom: spacing.xl },
    camFeed: { height: 180, backgroundColor: '#000', borderRadius: 8, justifyContent: 'space-between', padding: 10 },
    camText: { color: '#FFF', fontWeight: 'bold' },
    camTextSignal: { color: 'red', fontWeight: 'bold', alignSelf: 'flex-end' },
    camControls: { flexDirection: 'row', marginTop: spacing.md },
    sectionTitle: { ...typography.title, marginBottom: spacing.md },
    verifyCard: { padding: spacing.xl }
});

export default SecurityScreen;
