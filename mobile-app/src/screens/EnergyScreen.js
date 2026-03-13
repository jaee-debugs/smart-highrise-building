import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert, Platform } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import { AdminPanel, AdminScreen, LivePanel, SegmentedBar, adminColors } from '../components/AdminScaffold';
import { getEnergyData } from '../services/apiService';

const Bar = ({ label, value, maxValue, tone = 'success' }) => {
  const percent = Math.round((value / Math.max(maxValue, 1)) * 100);
  return (
    <View style={styles.barWrap}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <SegmentedBar value={percent} tone={tone} />
    </View>
  );
};

const EnergyScreen = () => {
  const [energyData, setEnergyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnergy = async () => {
      try {
        const data = await getEnergyData();
        setEnergyData(data);
      } catch (error) {
        Alert.alert('Error', 'Unable to load energy analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnergy();
  }, []);

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" color={colors.white} />;
  }

  if (!energyData) {
    return <Text style={styles.center}>No energy data available.</Text>;
  }

  const dailyMax = Math.max(...energyData.dailyTrend.map((item) => item.consumed));
  const monthlyMax = Math.max(...energyData.monthlyTrend.map((item) => item.consumed));

  return (
    <AdminScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Energy Analytics Dashboard</Text>

      <View style={styles.summaryRow}>
        <AdminPanel style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Piezo Energy (Total)</Text>
          <Text style={styles.summaryValue}>{energyData.overview.totalPiezoEnergyKwh} kWh</Text>
        </AdminPanel>
        <AdminPanel style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Green Points</Text>
          <Text style={styles.summaryValue}>{energyData.overview.greenPoints}</Text>
        </AdminPanel>
      </View>

      <LivePanel style={styles.panel}>
        <Text style={styles.sectionTitle}>Tower-wise Consumption (kWh)</Text>
        {energyData.towerConsumptionKwh.map((item) => (
          <Bar
            key={item.tower}
            label={item.tower}
            value={item.value}
            maxValue={Math.max(...energyData.towerConsumptionKwh.map((t) => t.value))}
            tone="success"
          />
        ))}
      </LivePanel>

      <AdminPanel style={styles.panel}>
        <Text style={styles.sectionTitle}>Daily Trend (Generated vs Consumed)</Text>
        {energyData.dailyTrend.map((item) => (
          <View key={item.day} style={{ marginBottom: spacing.md }}>
            <Bar label={`${item.day} Generated`} value={item.generated} maxValue={dailyMax} tone="success" />
            <Bar label={`${item.day} Consumed`} value={item.consumed} maxValue={dailyMax} tone="error" />
          </View>
        ))}
      </AdminPanel>

      <AdminPanel style={styles.panel}>
        <Text style={styles.sectionTitle}>Monthly Trend</Text>
        {energyData.monthlyTrend.map((item) => (
          <Bar key={item.month} label={item.month} value={item.generated} maxValue={monthlyMax} tone="warning" />
        ))}
      </AdminPanel>
    </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#030912' },
  title: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryCard: { width: '48%' },
  summaryLabel: { fontSize: 12, color: adminColors.subtext },
  summaryValue: { fontSize: 20, marginTop: spacing.xs, color: adminColors.text, fontWeight: '700', fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }) },
  sectionTitle: { fontSize: 18, marginBottom: spacing.sm, color: adminColors.text, fontWeight: '700' },
  panel: { marginTop: spacing.md },
  barWrap: { marginBottom: spacing.sm },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 12, color: adminColors.subtext },
  barValue: { fontSize: 12, fontWeight: '700', color: adminColors.text, fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }) },
});

export default EnergyScreen;
