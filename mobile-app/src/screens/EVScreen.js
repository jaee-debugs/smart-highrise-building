import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const EVScreen = () => {
    // Simulated state for quick demo
    const [slots, setSlots] = useState([
        { id: 'EV1', status: 'available' },
        { id: 'EV2', status: 'charging' },
        { id: 'EV3', status: 'available' }
    ]);
    const [myBooking, setMyBooking] = useState(null);

    const bookSlot = (id) => {
        setMyBooking(id);
        setSlots(slots.map(s => s.id === id ? { ...s, status: 'booked' } : s));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.pageTitle}>EV Charging Station</Text>

                {myBooking && (
                    <Card style={styles.bookingCard}>
                        <Text style={styles.bookingTitle}>Your Current Booking</Text>
                        <Text style={styles.bookingSlot}>Slot {myBooking}</Text>
                        <Badge text="Booked" status="warning" style={{ alignSelf: 'center', marginTop: spacing.sm }} />
                        <Text style={styles.bookingNotice}>Please plug in your vehicle within 15 minutes.</Text>
                    </Card>
                )}

                <Text style={styles.sectionTitle}>Available Slots (Basement 2)</Text>

                {slots.map(slot => (
                    <Card key={slot.id} style={styles.slotCard}>
                        <View style={styles.slotInfo}>
                            <Text style={styles.slotId}>{slot.id}</Text>
                            <Badge text={slot.status} status={slot.status} />
                        </View>
                        {slot.status === 'available' && !myBooking && (
                            <Button
                                title="Book Slot"
                                variant="outline"
                                onPress={() => bookSlot(slot.id)}
                                style={{ marginTop: spacing.md }}
                            />
                        )}
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
    bookingCard: { backgroundColor: colors.primary, alignItems: 'center', marginBottom: spacing.xl },
    bookingTitle: { color: colors.white, opacity: 0.8, marginBottom: spacing.xs },
    bookingSlot: { color: colors.white, fontSize: 32, fontWeight: 'bold' },
    bookingNotice: { color: colors.surface, fontSize: 12, marginTop: spacing.md, textAlign: 'center' },
    sectionTitle: { ...typography.title, marginBottom: spacing.md },
    slotCard: { marginBottom: spacing.md },
    slotInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    slotId: { ...typography.title, fontSize: 20 },
});

export default EVScreen;
