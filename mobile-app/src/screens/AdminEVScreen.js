import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { getEVStations, resetEVStations, updateEVStation } from '../services/apiService';

const cycleStatus = (status) => {
  if (status === 'Available') return 'Occupied';
  if (status === 'Occupied') return 'Maintenance';
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
    occupied: stations.filter((item) => item.status === 'Occupied').length,
    maintenance: stations.filter((item) => item.status === 'Maintenance').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>EV Charging Management</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Station Summary</Text>
          <View style={styles.row}><Text>Available</Text><Badge text={`${summary.available}`} status="success" /></View>
          <View style={styles.row}><Text>Occupied</Text><Badge text={`${summary.occupied}`} status="warning" /></View>
          <View style={styles.row}><Text>Maintenance</Text><Badge text={`${summary.maintenance}`} status="error" /></View>
          <Button title="Reset All Stations" variant="outline" onPress={onReset} />
        </Card>

        {stations.map((station) => (
          <Card key={station.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.stationId}>{station.id}</Text>
              <Badge text={station.status} status={station.status === 'Available' ? 'success' : station.status === 'Occupied' ? 'warning' : 'error'} />
            </View>
            <Text style={styles.booking}>Current: {station.currentBooking || 'None'}</Text>
            <Button title="Change Status" onPress={() => onUpdateStatus(station)} />
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
  card: { marginBottom: spacing.md },
  sectionTitle: { ...typography.title, marginBottom: spacing.sm },
  stationId: { ...typography.title },
  booking: { ...typography.caption, marginVertical: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }
});

export default AdminEVScreen;
