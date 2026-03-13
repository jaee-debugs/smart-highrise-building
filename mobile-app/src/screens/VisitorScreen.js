import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const VisitorScreen = () => {
    const visitors = [
        { id: 1, name: 'John Doe', type: 'Delivery', status: 'Expected', time: '14:00' },
        { id: 2, name: 'Jane Smith', type: 'Guest', status: 'Entered', time: '10:30' }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.headerRow}>
                    <Text style={styles.pageTitle}>Visitors Log</Text>
                    <Button title="+ Add" onPress={() => { }} style={styles.addBtn} />
                </View>

                {visitors.map(v => (
                    <Card key={v.id} style={styles.visitorCard}>
                        <View style={styles.vInfo}>
                            <Text style={styles.vName}>{v.name}</Text>
                            <Text style={styles.vType}>{v.type} • {v.time}</Text>
                        </View>
                        <Badge text={v.status} status={v.status === 'Entered' ? 'success' : 'pending'} />
                    </Card>
                ))}

                <Card style={styles.qrCard}>
                    <Text style={styles.qrHeader}>Share Entry Pass</Text>
                    <View style={styles.qrBox}>
                        <Text style={styles.qrPlaceholder}>QR Code Config</Text>
                        <Text style={{ textAlign: 'center', marginTop: 10 }}>Show this QR code at main gate security scanner</Text>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
    pageTitle: { ...typography.header, color: colors.primary },
    addBtn: { paddingVertical: 8, paddingHorizontal: 16 },
    visitorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
    vName: { ...typography.title },
    vType: { ...typography.body, color: colors.textLight },
    qrCard: { marginTop: spacing.xl, padding: spacing.xl },
    qrHeader: { ...typography.title, textAlign: 'center', marginBottom: spacing.md },
    qrBox: { backgroundColor: '#EAEAEA', borderRadius: 8, height: 200, justifyContent: 'center', alignItems: 'center' },
    qrPlaceholder: { fontSize: 24, fontWeight: 'bold', color: '#999' }
});

export default VisitorScreen;
