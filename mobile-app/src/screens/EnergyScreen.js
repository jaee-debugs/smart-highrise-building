import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import { getEnergyData } from '../services/apiService';

const Bar = ({ label, value, maxValue, color = colors.primary }) => {
  const width = `${Math.round((value / Math.max(maxValue, 1)) * 100)}%`;
  return (
    <View style={styles.barWrap}>
      <View style={styles.barLabelRow}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>{value}</Text>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width, backgroundColor: color }]} />
      </View>
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
    return <ActivityIndicator style={styles.center} size="large" color={colors.primary} />;
  }

  if (!energyData) {
    return <Text style={styles.center}>No energy data available.</Text>;
  }

  const dailyMax = Math.max(...energyData.dailyTrend.map((item) => item.consumed));
  const monthlyMax = Math.max(...energyData.monthlyTrend.map((item) => item.consumed));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Energy Analytics Dashboard</Text>

      <View style={styles.summaryRow}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Piezo Energy (Total)</Text>
          <Text style={styles.summaryValue}>{energyData.overview.totalPiezoEnergyKwh} kWh</Text>
        </Card>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Green Points</Text>
          <Text style={styles.summaryValue}>{energyData.overview.greenPoints}</Text>
        </Card>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>Tower-wise Consumption (kWh)</Text>
        {energyData.towerConsumptionKwh.map((item) => (
          <Bar
            key={item.tower}
            label={item.tower}
            value={item.value}
            maxValue={Math.max(...energyData.towerConsumptionKwh.map((t) => t.value))}
          />
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Daily Trend (Generated vs Consumed)</Text>
        {energyData.dailyTrend.map((item) => (
          <View key={item.day} style={{ marginBottom: spacing.md }}>
            <Bar label={`${item.day} Generated`} value={item.generated} maxValue={dailyMax} color={colors.success} />
            <Bar label={`${item.day} Consumed`} value={item.consumed} maxValue={dailyMax} color={colors.error} />
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Monthly Trend</Text>
        {energyData.monthlyTrend.map((item) => (
          <Bar key={item.month} label={item.month} value={item.generated} maxValue={monthlyMax} color={colors.accent} />
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { ...typography.header, color: colors.primary, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryCard: { width: '48%' },
  summaryLabel: { ...typography.caption },
  summaryValue: { ...typography.title, marginTop: spacing.xs, color: colors.textDark },
  sectionTitle: { ...typography.title, marginBottom: spacing.sm },
  barWrap: { marginBottom: spacing.sm },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { ...typography.caption, color: colors.textDark },
  barValue: { ...typography.caption, fontWeight: 'bold' },
  barBg: { backgroundColor: '#E5EDF3', height: 12, borderRadius: 10, marginTop: 4 },
  barFill: { height: '100%', borderRadius: 10 }
});

export default EnergyScreen;
