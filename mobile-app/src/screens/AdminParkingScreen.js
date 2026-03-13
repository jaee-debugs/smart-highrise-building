import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Parking Manager</Text>
        <View style={styles.grid}>
          {slots.map((slot) => (
            <Card key={slot.slotId} style={styles.slotCard}>
              <Text style={styles.slotId}>{slot.slotId}</Text>
              <Badge
                text={slot.status}
                status={slot.status === 'Available' ? 'success' : slot.status === 'Occupied' ? 'warning' : 'error'}
              />
              <Button title="Update" variant="outline" style={styles.btn} onPress={() => onUpdateSlot(slot)} />
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  slotCard: { width: '48%', alignItems: 'center', marginBottom: spacing.md },
  slotId: { ...typography.title, marginBottom: spacing.sm },
  btn: { paddingVertical: 8, marginTop: spacing.sm }
});

export default AdminParkingScreen;
