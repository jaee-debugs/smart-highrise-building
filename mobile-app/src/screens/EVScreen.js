import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import Button from '../components/Button';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
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
    <MatteScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>EV Charging Station</Text>

        {myStation && (
          <MattePanel style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>Your Current Booking</Text>
            <Text style={styles.bookingSlot}>Slot {myStation.id}</Text>
            <View style={[styles.statusPill, myStation.status === 'Available' ? styles.successPill : myStation.status === 'Maintenance' ? styles.errorPill : styles.warningPill, { alignSelf: 'center', marginTop: spacing.sm }]}>
              <Text style={styles.statusText}>{myStation.status}</Text>
            </View>
            {myStation.status === 'Booked' && (
              <Button title="Start Charging" onPress={onStartCharging} loading={updating} style={styles.primaryAction} textStyle={styles.actionText} />
            )}
            {myStation.status === 'In Use' && (
              <Button title="Release Slot" variant="outline" onPress={onReleaseSlot} loading={updating} style={styles.secondaryAction} textStyle={styles.actionText} />
            )}
          </MattePanel>
        )}

        <Text style={styles.sectionTitle}>Live Stations</Text>
        {stations.map((station) => (
          <MattePanel key={station.id} style={[styles.slotCard, station.currentBooking === RESIDENT_ID && styles.currentBookingPanel]}>
            <View style={styles.slotInfo}>
              <Text style={styles.slotId}>{station.id}</Text>
              <View style={[styles.statusPill, station.status === 'Available' ? styles.successPill : station.status === 'Maintenance' ? styles.errorPill : styles.warningPill]}>
                <Text style={styles.statusText}>{station.status}</Text>
              </View>
            </View>
            <Text style={styles.meta}>Current: {station.currentBooking || 'None'}</Text>
            {station.status === 'Available' && !myStation && (
              <Button title="Book Slot" variant="outline" onPress={() => onBook(station.id)} loading={updating} style={styles.secondaryAction} textStyle={styles.actionText} />
            )}
          </MattePanel>
        ))}
      </ScrollView>
    </MatteScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.lg },
  bookingCard: { alignItems: 'center', marginBottom: spacing.xl, padding: spacing.lg, borderColor: 'rgba(255,255,255,0.16)' },
  bookingTitle: { color: 'rgba(255,255,255,0.78)', marginBottom: spacing.xs, fontSize: 14 },
  bookingSlot: { color: colors.white, fontSize: 32, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#F3F8FC', marginBottom: spacing.md },
  slotCard: { marginBottom: spacing.md },
  currentBookingPanel: { backgroundColor: 'rgba(9,22,34,0.86)' },
  slotInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slotId: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  meta: { fontSize: 12, marginTop: spacing.sm, color: 'rgba(236,244,250,0.72)' },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  successPill: { backgroundColor: '#2D6A4F' },
  warningPill: { backgroundColor: '#8A6A23' },
  errorPill: { backgroundColor: '#9B2226' },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  primaryAction: { marginTop: spacing.md, width: '100%', backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  secondaryAction: { marginTop: spacing.md, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  actionText: { color: '#FFFFFF' }
});

export default EVScreen;
