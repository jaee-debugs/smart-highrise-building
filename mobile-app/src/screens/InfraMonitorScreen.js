import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Infrastructure Command Center</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Water Tank Status</Text>
          <View style={styles.row}><Text>Normal</Text><Badge text={`${infra.water.summary.normal}`} status="success" /></View>
          <View style={styles.row}><Text>Low</Text><Badge text={`${infra.water.summary.low}`} status="warning" /></View>
          <View style={styles.row}><Text>Critical</Text><Badge text={`${infra.water.summary.critical}`} status="error" /></View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Power Consumption</Text>
          <Text style={styles.bigValue}>{infra.power.currentConsumptionKw} kW</Text>
          <Text style={styles.help}>Current total building demand</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Generator</Text>
          <View style={styles.row}><Text>Status</Text><Badge text={infra.generator.status} status={infra.generator.status === 'Running' ? 'warning' : 'success'} /></View>
          <View style={styles.row}><Text>Fuel</Text><Text style={styles.val}>{infra.generator.fuelPercent}%</Text></View>
          <Button title="Test Start Generator" variant="outline" onPress={runGenerator} style={{ marginTop: spacing.sm }} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Lift Health Alerts</Text>
          {infra.lifts.map((lift) => (
            <View key={lift.id} style={styles.alertRow}>
              <Text style={styles.alertTitle}>{lift.id}</Text>
              <Badge text={lift.health} status={lift.health === 'Critical' ? 'error' : lift.health === 'Warning' ? 'warning' : 'success'} />
              {!!lift.alert && <Text style={styles.alertText}>{lift.alert}</Text>}
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Fire System Alerts</Text>
          {infra.fireSystem.map((item) => (
            <View key={item.id} style={styles.alertRow}>
              <Text style={styles.alertTitle}>{item.id}</Text>
              <Badge text={item.severity} status={item.severity === 'Alert' ? 'error' : 'success'} />
              <Text style={styles.alertText}>{item.message}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.title, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs, alignItems: 'center' },
  bigValue: { ...typography.header, color: colors.primary },
  help: { ...typography.caption },
  val: { ...typography.body, fontWeight: 'bold' },
  alertRow: { marginBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#E7EEF4', paddingBottom: spacing.sm },
  alertTitle: { ...typography.body, fontWeight: 'bold' },
  alertText: { ...typography.caption, marginTop: 4 }
});

export default InfraMonitorScreen;
