import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { spacing } from '../theme/Theme';
import { AdminActionButton, AdminPill, AdminScreen, AdminPanel, adminColors } from '../components/AdminScaffold';
import { getEVStations, resetEVStations, updateEVStation } from '../services/apiService';

const cycleStatus = (status) => {
  if (status === 'Available') return 'Booked';
  if (status === 'Booked') return 'In Use';
  if (status === 'In Use' || status === 'Occupied') return 'Maintenance';
  return 'Available';
};

const AdminEVScreen = () => {
  const [stations, setStations] = useState([]);

  const loadStations = async () => {
    try {
      const data = await getEVStations();
      setStations(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch EV stations.');
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const onUpdateStatus = async (station) => {
    const status = cycleStatus(station.status);
    await updateEVStation(station.id, status);
    loadStations();
  };

  const onReset = async () => {
    await resetEVStations();
    loadStations();
  };

  const summary = {
    available: stations.filter((item) => item.status === 'Available').length,
    occupied: stations.filter((item) => item.status === 'In Use' || item.status === 'Occupied' || item.status === 'Booked').length,
    maintenance: stations.filter((item) => item.status === 'Maintenance').length,
  };

  return (
    <AdminScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>EV Charging Management</Text>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Station Summary</Text>
          <View style={styles.row}><Text style={styles.label}>Available</Text><AdminPill text={`${summary.available}`} tone="success" /></View>
          <View style={styles.row}><Text style={styles.label}>Occupied</Text><AdminPill text={`${summary.occupied}`} tone="warning" /></View>
          <View style={styles.row}><Text style={styles.label}>Maintenance</Text><AdminPill text={`${summary.maintenance}`} tone="error" /></View>
          <AdminActionButton title="Reset All Stations" variant="outline" onPress={onReset} />
        </AdminPanel>

        {stations.map((station) => (
          <AdminPanel key={station.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.stationId}>{station.id}</Text>
              <AdminPill text={station.status} tone={station.status === 'Available' ? 'success' : station.status === 'Maintenance' ? 'error' : 'warning'} />
            </View>
            <Text style={styles.booking}>Current: {station.currentBooking || 'None'}</Text>
            <AdminActionButton title="Change Status" onPress={() => onUpdateStatus(station)} />
          </AdminPanel>
        ))}
      </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm, color: adminColors.text },
  stationId: { fontSize: 18, fontWeight: '700', color: adminColors.text },
  booking: { fontSize: 12, marginVertical: spacing.sm, color: adminColors.subtext },
  label: { color: adminColors.subtext, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }
});

export default AdminEVScreen;
