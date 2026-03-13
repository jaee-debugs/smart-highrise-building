import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadParking(); }} />}
      >
        <Text style={styles.pageTitle}>Smart Parking</Text>

        <View style={styles.grid}>
          {slots.map((slot) => (
            <Card key={slot.slotId} style={styles.slotCard}>
              <Text style={styles.slotId}>{slot.slotId}</Text>
              <Text style={styles.carIcon}>{slot.status === 'Occupied' ? '🚗' : slot.status === 'Disabled' ? '⛔' : '🅿️'}</Text>
              <Badge
                text={slot.status}
                status={slot.status === 'Available' ? 'success' : slot.status === 'Occupied' ? 'warning' : 'error'}
              />
              {slot.slotId === RESIDENT_SLOT_ID && slot.status !== 'Disabled' && (
                <Button
                  title={slot.status === 'Available' ? 'Mark as Occupied' : 'Mark as Available'}
                  onPress={() => updateMySlotStatus(slot)}
                  loading={updating}
                  style={styles.slotActionBtn}
                />
              )}
              {slot.slotId === RESIDENT_SLOT_ID && (
                <Text style={styles.mySlotHint}>Your Assigned Slot</Text>
              )}
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: spacing.lg },
  pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotCard: { width: '48%', alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md },
  slotId: { ...typography.title, fontWeight: 'bold', marginBottom: spacing.xs },
  carIcon: { fontSize: 48, marginVertical: spacing.sm },
  slotActionBtn: { marginTop: spacing.sm, width: '100%' },
  mySlotHint: { ...typography.caption, marginTop: spacing.xs, color: colors.textLight }
});

export default ParkingScreen;
