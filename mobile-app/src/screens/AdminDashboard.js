import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getEmergencyEvents, getInfraStatus, resolveEmergency } from '../services/apiService';

const AdminDashboard = ({ navigation }) => {
  const [infra, setInfra] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const latestEmergencyId = useRef(0);

  const features = [
    { id: 1, title: 'Water Infra', icon: '💧', route: 'WaterMonitoring' },
    { id: 2, title: 'Energy Analytics', icon: '⚡', route: 'Energy' },
    { id: 3, title: 'Infra Monitor', icon: '🏢', route: 'InfraMonitor' },
    { id: 4, title: 'Security Control', icon: '🛡️', route: 'Security' },
    { id: 5, title: 'Maintenance', icon: '🔧', route: 'Maintenance' },
    { id: 6, title: 'Manage Community', icon: '📢', route: 'AdminCommunity' },
    { id: 7, title: 'Manage EV Slots', icon: '🔋', route: 'AdminEV' },
    { id: 8, title: 'Manage Parking', icon: '🚗', route: 'AdminParking' },
  ];

  const playAlarm = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'
      });
      await sound.playAsync();
      setTimeout(() => {
        sound.unloadAsync();
      }, 1500);
    } catch (error) {
      Alert.alert('Emergency Alert', 'New SOS event received');
    }
  };

  const fetchInfra = async () => {
    try {
      const data = await getInfraStatus();
      setInfra(data);
    } catch (error) {
      // silent retry
    }
  };

  const fetchEmergencyEvents = async () => {
    try {
      const response = await getEmergencyEvents(latestEmergencyId.current);
      if (response.events.length > 0) {
        latestEmergencyId.current = response.latestId;
        setEmergencies((prev) => [...response.events, ...prev].slice(0, 10));
        playAlarm();
      }
    } catch (error) {
      // silent retry
    }
  };

  useEffect(() => {
    fetchInfra();

    const infraTimer = setInterval(fetchInfra, 15000);
    const emergencyTimer = setInterval(fetchEmergencyEvents, 5000);

    return () => {
      clearInterval(infraTimer);
      clearInterval(emergencyTimer);
    };
  }, []);

  const markResolved = async (id) => {
    try {
      await resolveEmergency(id);
      setEmergencies((prev) => prev.map((item) => (item.id === id ? { ...item, resolved: true } : item)));
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve emergency event.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Admin Console</Text>
          <Text style={styles.subtext}>Command Center Active</Text>
        </View>

        {infra && (
          <Card style={styles.statsCard}>
            <Text style={styles.statsTitle}>Live Infrastructure</Text>
            <View style={styles.statsRow}>
              <View>
                <Text style={styles.statLabel}>Water Critical</Text>
                <Text style={styles.statValue}>{infra.water.summary.critical}</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Power</Text>
                <Text style={styles.statValue}>{infra.power.currentConsumptionKw}kW</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Generator</Text>
                <Badge text={infra.generator.status} status={infra.generator.status === 'Running' ? 'warning' : 'success'} />
              </View>
            </View>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Emergency SOS Feed</Text>
        <Card>
          {emergencies.length === 0 && <Text style={styles.empty}>No active emergencies</Text>}
          {emergencies.map((event) => (
            <View key={event.id} style={styles.alertRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{event.residentName} • {event.tower} {event.flat}</Text>
                <Text style={styles.alertText}>Location: {event.location}</Text>
              </View>
              {event.resolved ? (
                <Badge text="Resolved" status="success" />
              ) : (
                <Button title="Resolve" onPress={() => markResolved(event.id)} style={{ paddingHorizontal: 12, paddingVertical: 8 }} />
              )}
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Management Modules</Text>
        <View style={styles.grid}>
          {features.map((item) => (
            <Card key={item.id} style={styles.gridItem} onPress={() => navigation.navigate(item.route)}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
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
  subtext: { ...typography.body, color: colors.success, marginTop: spacing.xs, fontWeight: 'bold' },
  statsCard: { backgroundColor: colors.primary, marginBottom: spacing.lg },
  statsTitle: { color: colors.white, fontSize: 16, fontWeight: 'bold', marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: colors.surface, fontSize: 12, opacity: 0.8 },
  statValue: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
  sectionTitle: { ...typography.title, marginBottom: spacing.md },
  empty: { ...typography.caption },
  alertRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  alertTitle: { ...typography.body, fontWeight: 'bold' },
  alertText: { ...typography.caption },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', alignItems: 'center', paddingVertical: spacing.xl },
  icon: { fontSize: 32, marginBottom: spacing.sm },
  itemTitle: { ...typography.body, fontWeight: 'bold', textAlign: 'center' }
});

export default AdminDashboard;
