import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import Button from '../components/Button';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
import { getParkingStatus, updateParkingStatus } from '../services/apiService';

const RESIDENT_SLOT_ID = 'A1';

const ParkingScreen = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadParking = async () => {
    try {
      const data = await getParkingStatus();
      setSlots(data);
    } catch (error) {
      // ignore to keep page usable
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadParking();
  }, []);

  const updateMySlotStatus = async (slot) => {
    if (!slot || slot.status === 'Disabled') {
      Alert.alert('Unavailable', 'Your slot cannot be updated at the moment.');
      return;
    }

    const nextStatus = slot.status === 'Available' ? 'Occupied' : 'Available';
    try {
      setUpdating(true);
      await updateParkingStatus(RESIDENT_SLOT_ID, nextStatus);
      await loadParking();
    } catch (error) {
      Alert.alert('Update Failed', 'Could not update your parking status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.white} /></View>;

  return (
    <MatteScreen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadParking(); }} />}
      >
        <Text style={styles.pageTitle}>Smart Parking</Text>

        <View style={styles.grid}>
          {slots.map((slot) => (
            <MattePanel key={slot.slotId} style={[styles.slotCard, slot.status === 'Available' ? styles.availableCard : styles.occupiedCard]}>
              {slot.status !== 'Available' && slot.status !== 'Disabled' && <View style={styles.slotOverlay} />}
              <Text style={styles.slotId}>{slot.slotId}</Text>
              <View style={[styles.statusPill, slot.status === 'Available' ? styles.successPill : slot.status === 'Occupied' ? styles.warningPill : styles.errorPill]}>
                <Text style={styles.statusText}>{slot.status}</Text>
              </View>
              {slot.slotId === RESIDENT_SLOT_ID && slot.status !== 'Disabled' && (
                <Button
                  title={slot.status === 'Available' ? 'Mark as Occupied' : 'Mark as Available'}
                  onPress={() => updateMySlotStatus(slot)}
                  loading={updating}
                  style={styles.slotActionBtn}
                  textStyle={styles.actionText}
                />
              )}
              {slot.slotId === RESIDENT_SLOT_ID && (
                <Text style={styles.mySlotHint}>Your Assigned Slot</Text>
              )}
            </MattePanel>
          ))}
        </View>
      </ScrollView>
    </MatteScreen>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#08111A' },
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotCard: { width: '48%', alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.md, marginBottom: spacing.md, position: 'relative' },
  availableCard: { borderColor: 'rgba(45,106,79,0.55)' },
  occupiedCard: { borderColor: 'rgba(255,255,255,0.08)' },
  slotOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(4,8,14,0.4)', borderRadius: 22 },
  slotId: { fontSize: 20, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.md },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginBottom: spacing.md },
  successPill: { backgroundColor: '#2D6A4F' },
  warningPill: { backgroundColor: '#8A6A23' },
  errorPill: { backgroundColor: '#9B2226' },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  slotActionBtn: { marginTop: spacing.sm, width: '100%', backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  actionText: { color: '#FFFFFF' },
  mySlotHint: { fontSize: 12, marginTop: spacing.xs, color: 'rgba(236,244,250,0.72)' }
});

export default ParkingScreen;
