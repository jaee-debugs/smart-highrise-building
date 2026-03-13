import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import { AdminActionButton, AdminPanel, AdminPill, AdminScreen, LivePanel, StatusLED, adminColors } from '../components/AdminScaffold';
import { getInfraStatus, updateGeneratorStatus } from '../services/apiService';

const InfraMonitorScreen = () => {
  const [infra, setInfra] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInfra = async () => {
    try {
      const data = await getInfraStatus();
      setInfra(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch infrastructure status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfra();
  }, []);

  const runGenerator = async () => {
    try {
      await updateGeneratorStatus({ status: 'Running' });
      fetchInfra();
    } catch (error) {
      Alert.alert('Error', 'Could not update generator status.');
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.white} /></View>;

  return (
    <AdminScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Infrastructure Command Center</Text>

        <LivePanel style={styles.card} critical={infra.water.summary.critical > 0}>
          <Text style={styles.sectionTitle}>Water Tank Status</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Normal</Text><AdminPill text={`${infra.water.summary.normal}`} tone="success" /></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Low</Text><AdminPill text={`${infra.water.summary.low}`} tone="warning" /></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Critical</Text><AdminPill text={`${infra.water.summary.critical}`} tone="error" style={styles.criticalBadge} /></View>
        </LivePanel>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Power Consumption</Text>
          <Text style={styles.bigValue}>{infra.power.currentConsumptionKw} kW</Text>
          <Text style={styles.help}>Current total building demand</Text>
        </AdminPanel>

        <LivePanel style={styles.card}>
          <Text style={styles.sectionTitle}>Generator</Text>
          <View style={styles.row}><Text style={styles.rowLabel}>Status</Text><View style={styles.inline}><StatusLED online={infra.generator.status !== 'Running'} /><AdminPill text={infra.generator.status} tone={infra.generator.status === 'Running' ? 'warning' : 'success'} /></View></View>
          <View style={styles.row}><Text style={styles.rowLabel}>Fuel</Text><Text style={styles.val}>{infra.generator.fuelPercent}%</Text></View>
          <AdminActionButton title="Test Start Generator" variant="outline" onPress={runGenerator} style={{ marginTop: spacing.sm }} />
        </LivePanel>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Lift Health Alerts</Text>
          {infra.lifts.map((lift) => (
            <View key={lift.id} style={styles.alertRow}>
              <Text style={styles.alertTitle}>{lift.id}</Text>
              <AdminPill text={lift.health} tone={lift.health === 'Critical' ? 'error' : lift.health === 'Warning' ? 'warning' : 'success'} />
              {!!lift.alert && <Text style={styles.alertText}>{lift.alert}</Text>}
            </View>
          ))}
        </AdminPanel>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Fire System Alerts</Text>
          {infra.fireSystem.map((item) => (
            <View key={item.id} style={styles.alertRow}>
              <Text style={styles.alertTitle}>{item.id}</Text>
              <AdminPill text={item.severity} tone={item.severity === 'Alert' ? 'error' : 'success'} />
              <Text style={styles.alertText}>{item.message}</Text>
            </View>
          ))}
        </AdminPanel>
      </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#030912' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm, color: adminColors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs, alignItems: 'center' },
  rowLabel: { color: adminColors.subtext, fontSize: 13 },
  bigValue: { fontSize: 30, color: adminColors.text, fontWeight: '800', fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }) },
  help: { fontSize: 12, color: adminColors.subtext },
  val: { color: adminColors.text, fontWeight: '700', fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }) },
  alertRow: { marginBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: spacing.sm },
  alertTitle: { color: adminColors.text, fontSize: 14, fontWeight: '700' },
  alertText: { color: adminColors.subtext, fontSize: 12, marginTop: 4 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  criticalBadge: { backgroundColor: '#FFFFFF' }
});

export default InfraMonitorScreen;
