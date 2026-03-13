import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/Theme';
import { AdminActionButton, AdminPill, AdminScreen, AdminPanel, adminColors } from '../components/AdminScaffold';
import { getParkingStatus, updateParkingStatus } from '../services/apiService';

const nextStatus = (status) => {
  if (status === 'Available') return 'Occupied';
  if (status === 'Occupied') return 'Disabled';
  return 'Available';
};

const AdminParkingScreen = () => {
  const [slots, setSlots] = useState([]);

  const loadParking = async () => {
    try {
      const data = await getParkingStatus();
      setSlots(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch parking slots.');
    }
  };

  useEffect(() => {
    loadParking();
  }, []);

  const onUpdateSlot = async (slot) => {
    await updateParkingStatus(slot.slotId, nextStatus(slot.status));
    loadParking();
  };

  return (
    <AdminScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Parking Manager</Text>
        <View style={styles.grid}>
          {slots.map((slot) => (
            <AdminPanel key={slot.slotId} style={styles.slotCard}>
              <Text style={styles.slotId}>{slot.slotId}</Text>
              <AdminPill text={slot.status} tone={slot.status === 'Available' ? 'success' : slot.status === 'Occupied' ? 'warning' : 'error'} />
              <AdminActionButton title="Update" variant="outline" style={styles.btn} onPress={() => onUpdateSlot(slot)} />
            </AdminPanel>
          ))}
        </View>
      </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotCard: { width: '48%', alignItems: 'center', marginBottom: spacing.md },
  slotId: { fontSize: 18, fontWeight: '700', color: adminColors.text, marginBottom: spacing.sm },
  btn: { marginTop: spacing.sm, width: '100%' }
});

export default AdminParkingScreen;
