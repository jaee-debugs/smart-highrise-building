import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getCommunityData, getEVStations, getParkingStatus, getSustainabilityData, triggerEmergencySOS } from '../services/apiService';

const ResidentDashboard = ({ navigation }) => {
  const [susData, setSusData] = useState(null);
  const [communityCount, setCommunityCount] = useState(0);
  const [evFree, setEvFree] = useState(0);
  const [parkingFree, setParkingFree] = useState(0);

  const refreshData = async () => {
    try {
      const [sustainability, community, evStations, parking] = await Promise.all([
        getSustainabilityData(),
        getCommunityData(),
        getEVStations(),
        getParkingStatus()
      ]);

      setSusData(sustainability);
      setCommunityCount((community.notices?.length || 0) + (community.events?.length || 0));
      setEvFree(evStations.filter((item) => item.status === 'Available').length);
      setParkingFree(parking.filter((item) => item.status === 'Available').length);
    } catch (error) {
      // keep dashboard usable even if one call fails
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const onSOS = async () => {
    try {
      await triggerEmergencySOS({
        residentName: 'Resident User',
        tower: 'Tower A',
        floor: '10',
        flat: '101',
        location: 'Tower A, Flat 101'
      });
      Alert.alert('SOS Sent', 'Emergency team and admin have been notified.');
    } catch (error) {
      Alert.alert('Failed', 'Unable to trigger SOS at the moment.');
    }
  };

  const features = [
    { id: 1, title: 'Smart Parking', icon: '🚗', route: 'Parking', status: `${parkingFree} Free` },
    { id: 2, title: 'Visitor Control', icon: '👤', route: 'Visitor', status: null },
    { id: 3, title: 'Indoor Map', icon: '🗺️', route: 'IndoorNavigation', status: null },
    { id: 4, title: 'Sustainability', icon: '🌱', route: 'Sustainability', status: susData ? `${susData.greenPoints} pts` : null },
    { id: 5, title: 'Community', icon: '💬', route: 'Community', status: `${communityCount} Updates` },
    { id: 6, title: 'EV Charging', icon: '⚡', route: 'EVCharging', status: `${evFree} Open` },
    { id: 7, title: 'Elevators', icon: '🛗', route: 'Elevator', status: 'Operational' },
    { id: 8, title: 'Maintenance', icon: '🛠️', route: 'ResidentMaintenance', status: 'Track' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Resident</Text>
          <Text style={styles.subtext}>Tower A • Flat 101</Text>
        </View>

        <Card style={styles.sosCard} onPress={onSOS}>
          <Text style={styles.sosText}>🚨 EMERGENCY SOS</Text>
        </Card>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {features.map((item) => (
            <Card key={item.id} style={styles.gridItem} onPress={() => navigation.navigate(item.route)}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.status && <Badge text={item.status} style={{ marginTop: spacing.sm }} />}
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
  header: { marginBottom: spacing.lg },
  greeting: { ...typography.header, color: colors.primary },
  subtext: { ...typography.body, color: colors.textLight, marginTop: spacing.xs },
  sosCard: { backgroundColor: colors.error, alignItems: 'center', paddingVertical: spacing.md, marginBottom: spacing.lg },
  sosText: { color: colors.white, fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { ...typography.title, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', alignItems: 'center', paddingVertical: spacing.xl },
  icon: { fontSize: 32, marginBottom: spacing.sm },
  itemTitle: { ...typography.body, fontWeight: 'bold', textAlign: 'center' }
});

export default ResidentDashboard;
