import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { bookEVStation, getEVStations, updateEVStation } from '../services/apiService';

const RESIDENT_ID = 'Resident-A101';

const EVScreen = () => {
  const [stations, setStations] = useState([]);
  const [myStation, setMyStation] = useState(null);
  const [updating, setUpdating] = useState(false);

  const loadStations = async () => {
    try {
      const data = await getEVStations();
      setStations(data);
      const mine = data.find((item) => item.currentBooking === RESIDENT_ID);
      setMyStation(mine || null);
    } catch (error) {
      Alert.alert('Error', 'Failed to load EV stations.');
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const onBook = async (id) => {
    try {
      setUpdating(true);
      await bookEVStation(id, RESIDENT_ID);
      await loadStations();
    } catch (error) {
      Alert.alert('Booking Failed', 'This station is not available.');
    } finally {
      setUpdating(false);
    }
  };

  const onStartCharging = async () => {
    if (!myStation) return;
    try {
      setUpdating(true);
      await updateEVStation(myStation.id, 'In Use', RESIDENT_ID);
      await loadStations();
    } catch (error) {
      Alert.alert('Update Failed', 'Unable to mark station as in use.');
    } finally {
      setUpdating(false);
    }
  };

  const onReleaseSlot = async () => {
    if (!myStation) return;
    try {
      setUpdating(true);
      await updateEVStation(myStation.id, 'Available');
      await loadStations();
    } catch (error) {
      Alert.alert('Update Failed', 'Unable to release station right now.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>EV Charging Station</Text>

        {myStation && (
          <Card style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>Your Current Booking</Text>
            <Text style={styles.bookingSlot}>Slot {myStation.id}</Text>
            <Badge text={myStation.status} status={myStation.status === 'Booked' ? 'warning' : myStation.status === 'In Use' ? 'warning' : myStation.status} style={{ alignSelf: 'center', marginTop: spacing.sm }} />
            {myStation.status === 'Booked' && (
              <Button title="Start Charging" onPress={onStartCharging} loading={updating} style={{ marginTop: spacing.md, width: '100%' }} />
            )}
            {myStation.status === 'In Use' && (
              <Button title="Release Slot" variant="outline" onPress={onReleaseSlot} loading={updating} style={{ marginTop: spacing.md, width: '100%' }} />
            )}
          </Card>
        )}

        <Text style={styles.sectionTitle}>Live Stations</Text>
        {stations.map((station) => (
          <Card key={station.id} style={styles.slotCard}>
            <View style={styles.slotInfo}>
              <Text style={styles.slotId}>{station.id}</Text>
              <Badge
                text={station.status}
                status={station.status === 'Available' ? 'success' : station.status === 'Maintenance' ? 'error' : 'warning'}
              />
            </View>
            <Text style={styles.meta}>Current: {station.currentBooking || 'None'}</Text>
            {station.status === 'Available' && !myStation && (
              <Button title="Book Slot" variant="outline" onPress={() => onBook(station.id)} loading={updating} style={{ marginTop: spacing.md }} />
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
  sectionTitle: { ...typography.title, marginBottom: spacing.md },
  slotCard: { marginBottom: spacing.md },
  slotInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slotId: { ...typography.title, fontSize: 20 },
  meta: { ...typography.caption, marginTop: spacing.sm }
});

export default EVScreen;
