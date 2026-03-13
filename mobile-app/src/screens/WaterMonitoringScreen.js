import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getWaterLevels, updateWaterLevel } from '../services/apiService';

const getStatusColor = (status) => {
  if (status === 'Critical') return colors.error;
  if (status === 'Low') return colors.warning;
  return colors.success;
};

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
    return <ActivityIndicator style={styles.center} size="large" color={colors.primary} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Levels Monitoring</Text>
      <Text style={styles.subtitle}>Tower and floor-wise tank status</Text>
      <FlatList
        data={waterData}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWater(); }} />}
        renderItem={({ item }) => {
          const width = `${Math.min(100, Math.max(0, item.level))}%`;
          return (
            <Card style={styles.card} onPress={() => bumpTankLevel(item)}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.tankName}>{item.tankName}</Text>
                  <Text style={styles.meta}>{item.tower} • Floor {item.floor}</Text>
                </View>
                <Badge text={item.status} status={item.status === 'Critical' ? 'error' : item.status === 'Low' ? 'warning' : 'success'} />
              </View>

              <View style={styles.barContainer}>
                <View style={[styles.barFill, { width, backgroundColor: getStatusColor(item.status) }]} />
              </View>

              <View style={styles.rowBetween}>
                <Text style={styles.levelText}>{item.level}%</Text>
                <Text style={styles.hint}>Tap card to simulate +5% refill</Text>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  title: { ...typography.header, color: colors.primary },
  subtitle: { ...typography.body, marginBottom: spacing.md, color: colors.textLight },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { marginBottom: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tankName: { ...typography.title, color: colors.textDark },
  meta: { ...typography.caption, marginTop: 2 },
  barContainer: {
    marginTop: spacing.md,
    backgroundColor: '#DCE4EA',
    borderRadius: 10,
    height: 16,
    overflow: 'hidden'
  },
  barFill: { height: '100%', borderRadius: 10 },
  levelText: { ...typography.title, marginTop: spacing.sm },
  hint: { ...typography.caption, marginTop: spacing.sm }
});

export default WaterMonitoringScreen;
