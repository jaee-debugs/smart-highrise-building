import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert, Platform } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import { AdminPanel, AdminPill, AdminScreen, LivePanel, SegmentedBar, adminColors } from '../components/AdminScaffold';
import { getWaterLevels, updateWaterLevel } from '../services/apiService';

const getTone = (status) => (status === 'Critical' ? 'error' : status === 'Low' ? 'warning' : 'success');

const WaterMonitoringScreen = () => {
  const [waterData, setWaterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWater = useCallback(async () => {
    try {
      const data = await getWaterLevels();
      setWaterData(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch water tank data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWater();
  }, [fetchWater]);

  const bumpTankLevel = async (item) => {
    try {
      const nextLevel = item.level < 95 ? item.level + 5 : 100;
      await updateWaterLevel(item.id, { level: nextLevel });
      fetchWater();
    } catch (error) {
      Alert.alert('Update failed', 'Could not update tank level.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.center} size="large" color={colors.white} />;
  }

  return (
    <AdminScreen>
      <Text style={styles.title}>Water Levels Monitoring</Text>
      <Text style={styles.subtitle}>Tower and floor-wise tank status</Text>
      <FlatList
        contentContainerStyle={styles.list}
        data={waterData}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWater(); }} />}
        renderItem={({ item }) => {
          return (
            <LivePanel style={styles.liveCard} critical={item.status === 'Critical'}>
              <AdminPanel sharp onPress={() => bumpTankLevel(item)} style={styles.innerPressArea}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.tankName}>{item.tankName}</Text>
                  <Text style={styles.meta}>{item.tower} • Floor {item.floor}</Text>
                </View>
                <AdminPill text={item.status} tone={getTone(item.status)} style={item.status === 'Critical' ? styles.criticalPill : null} />
              </View>

              <SegmentedBar value={item.level} tone={getTone(item.status)} />

              <View style={styles.rowBetween}>
                <Text style={styles.levelText}>{item.level}%</Text>
                <Text style={styles.hint}>Tap card to simulate +5% refill</Text>
              </View>
              </AdminPanel>
            </LivePanel>
          );
        }}
      />
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginHorizontal: spacing.md, marginTop: spacing.md },
  subtitle: { fontSize: 14, marginBottom: spacing.md, color: adminColors.subtext, marginHorizontal: spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#030912' },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg },
  liveCard: { marginBottom: spacing.md },
  innerPressArea: { padding: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tankName: { fontSize: 18, fontWeight: '700', color: adminColors.text },
  meta: { fontSize: 12, marginTop: 2, color: adminColors.subtext },
  levelText: { fontSize: 20, marginTop: spacing.sm, color: adminColors.text, fontWeight: '700', fontFamily: Platform.select({ ios: 'Courier', android: 'monospace', web: 'monospace' }) },
  hint: { fontSize: 12, marginTop: spacing.sm, color: adminColors.subtext },
  criticalPill: { backgroundColor: '#FFFFFF' }
});

export default WaterMonitoringScreen;
