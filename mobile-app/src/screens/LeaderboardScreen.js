import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { getSustainabilityLeaderboard } from '../services/apiService';

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      const data = await getSustainabilityLeaderboard();
      setLeaders(data);
    } catch (error) {
      setLeaders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadLeaderboard(); }} />}
      >
        <Text style={styles.pageTitle}>Green Points Leaderboard</Text>
        {leaders.map((resident) => (
          <Card key={resident.residentId} style={styles.itemCard}>
            <View style={styles.row}>
              <Text style={styles.rank}>#{resident.rank}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{resident.name}</Text>
                <Text style={styles.meta}>{resident.steps} steps • {resident.energyGeneratedWh} Wh</Text>
              </View>
              <Badge text={`${resident.greenPoints} pts`} status="success" />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
  itemCard: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: { ...typography.title, width: 48, color: colors.primary },
  info: { flex: 1 },
  name: { ...typography.body, fontWeight: 'bold' },
  meta: { ...typography.caption, marginTop: spacing.xs, color: colors.textLight }
});

export default LeaderboardScreen;
