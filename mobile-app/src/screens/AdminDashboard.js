import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { spacing } from '../theme/Theme';
import { AdminActionButton, AdminPanel, AdminPill, AdminScreen, LivePanel, SegmentedBar, StatusLED, adminColors } from '../components/AdminScaffold';
import { getEmergencyEvents, getInfraStatus, resolveEmergency } from '../services/apiService';

const AdminDashboard = ({ navigation }) => {
  const [infra, setInfra] = useState(null);
  const [emergencies, setEmergencies] = useState([]);
  const latestEmergencyId = useRef(0);

  const features = [
    { id: 1, title: 'Water Infra', icon: 'WT', route: 'WaterMonitoring' },
    { id: 2, title: 'Energy Analytics', icon: 'EN', route: 'Energy' },
    { id: 3, title: 'Infra Monitor', icon: 'IF', route: 'InfraMonitor' },
    { id: 4, title: 'Security Control', icon: 'SC', route: 'Security' },
    { id: 5, title: 'Maintenance', icon: 'MT', route: 'Maintenance' },
    { id: 6, title: 'Manage Community', icon: 'CM', route: 'AdminCommunity' },
    { id: 7, title: 'Manage EV Slots', icon: 'EV', route: 'AdminEV' },
    { id: 8, title: 'Manage Parking', icon: 'PK', route: 'AdminParking' },
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
        setEmergencies((prev) => {
          const merged = [...response.events, ...prev];
          const unique = merged.filter((event, index, list) => index === list.findIndex((item) => item.id === event.id));
          return unique.slice(0, 10);
        });
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
    <AdminScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Admin Console</Text>
          <Text style={styles.subtext}>Command Center Active</Text>
        </View>

        {infra && (
          <LivePanel style={styles.statsCard}>
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
                <View style={styles.liveRow}><StatusLED online={infra.generator.status !== 'Running'} /><AdminPill text={infra.generator.status} tone={infra.generator.status === 'Running' ? 'warning' : 'success'} /></View>
              </View>
            </View>
            <SegmentedBar value={100 - infra.water.summary.critical * 10} tone="success" />
          </LivePanel>
        )}

        <Text style={styles.sectionTitle}>Emergency SOS Feed</Text>
        <AdminPanel style={styles.panel}>
          {emergencies.length === 0 && <Text style={styles.empty}>No active emergencies</Text>}
          {emergencies.map((event) => (
            <View key={event.id} style={styles.alertRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{event.residentName} • {event.tower} {event.flat}</Text>
                <Text style={styles.alertText}>Location: {event.location}</Text>
              </View>
              {event.resolved ? (
                <AdminPill text="Resolved" tone="success" />
              ) : (
                <AdminActionButton title="Resolve" onPress={() => markResolved(event.id)} style={styles.smallAction} />
              )}
            </View>
          ))}
        </AdminPanel>

        <Text style={styles.sectionTitle}>Management Modules</Text>
        <View style={styles.grid}>
          {features.map((item) => (
            <View key={item.id} style={styles.gridCell}>
              <AdminPanel style={styles.gridItem} onPress={() => navigation.navigate(item.route)}>
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              </AdminPanel>
            </View>
          ))}
        </View>
      </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  header: { marginBottom: spacing.lg },
  greeting: { fontSize: 30, fontWeight: '800', color: adminColors.text },
  subtext: { fontSize: 14, color: adminColors.commandGreen, marginTop: spacing.xs, fontWeight: '700' },
  statsCard: { marginBottom: spacing.lg },
  statsTitle: { color: adminColors.text, fontSize: 16, fontWeight: '700', marginBottom: spacing.md },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: adminColors.subtext, fontSize: 12, marginBottom: 4 },
  statValue: { color: adminColors.text, fontSize: 20, fontWeight: '700', fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }) },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: adminColors.text, marginBottom: spacing.md },
  panel: { padding: spacing.md },
  empty: { color: adminColors.subtext, fontSize: 12 },
  alertRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: spacing.sm },
  alertTitle: { color: adminColors.text, fontSize: 14, fontWeight: '700' },
  alertText: { color: adminColors.subtext, fontSize: 12 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  smallAction: { minWidth: 94 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCell: { width: '48%', marginBottom: spacing.md },
  gridItem: {
    width: '100%',
    minHeight: 118,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: { fontSize: 38, fontWeight: '800', color: adminColors.commandGreen, marginBottom: spacing.xs, textAlign: 'center' },
  itemTitle: { fontSize: 19, fontWeight: '700', textAlign: 'center', color: adminColors.text, lineHeight: 26 }
});

export default AdminDashboard;
