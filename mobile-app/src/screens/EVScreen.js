import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { bookEVStation, getEVStations } from '../services/apiService';

const EVScreen = () => {
  const [stations, setStations] = useState([]);
  const [myBooking, setMyBooking] = useState(null);

  const loadStations = async () => {
    try {
      const data = await getEVStations();
      setStations(data);
      const mine = data.find((item) => item.currentBooking === 'Resident-A101');
      setMyBooking(mine ? mine.id : null);
    } catch (error) {
      Alert.alert('Error', 'Failed to load EV stations.');
    }
  };

  useEffect(() => {
    loadStations();
  }, []);

  const onBook = async (id) => {
    try {
      await bookEVStation(id, 'Resident-A101');
      loadStations();
    } catch (error) {
      Alert.alert('Booking Failed', 'This station is not available.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>EV Charging Station</Text>

        {myBooking && (
          <Card style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>Your Current Booking</Text>
            <Text style={styles.bookingSlot}>Slot {myBooking}</Text>
            <Badge text="Occupied" status="warning" style={{ alignSelf: 'center', marginTop: spacing.sm }} />
          </Card>
        )}

        <Text style={styles.sectionTitle}>Live Stations</Text>
        {stations.map((station) => (
          <Card key={station.id} style={styles.slotCard}>
            <View style={styles.slotInfo}>
              <Text style={styles.slotId}>{station.id}</Text>
              <Badge
                text={station.status}
                status={station.status === 'Available' ? 'success' : station.status === 'Occupied' ? 'warning' : 'error'}
              />
            </View>
            <Text style={styles.meta}>Current: {station.currentBooking || 'None'}</Text>
            {station.status === 'Available' && !myBooking && (
              <Button title="Book Slot" variant="outline" onPress={() => onBook(station.id)} style={{ marginTop: spacing.md }} />
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
