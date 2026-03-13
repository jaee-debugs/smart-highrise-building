import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getParkingStatus } from '../services/apiService';

const ParkingScreen = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
  carIcon: { fontSize: 48, marginVertical: spacing.sm }
});

export default ParkingScreen;
