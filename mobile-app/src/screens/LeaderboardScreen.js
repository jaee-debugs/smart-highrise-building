import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { spacing } from '../theme/Theme';
import { MatteScreen } from '../components/MatteScaffold';
import { getSustainabilityLeaderboard } from '../services/apiService';

// ── Medal configuration ───────────────────────────────────────────────────────
const MEDAL = {
  1: { border: 'rgba(212,175,55,0.4)',  icon: '♛', tint: '#D4AF37' },
  2: { border: 'rgba(192,192,192,0.4)', icon: '★', tint: '#C0C0C0' },
  3: { border: 'rgba(205,127,50,0.4)',  icon: '★', tint: '#CD7F32' },
};

// ── Glass card primitive ──────────────────────────────────────────────────────
const GlassCard = ({ children, borderColor, style }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webCard, { borderColor }, style]}>
        {children}
      </View>
    );
  }
  return (
    <View style={[styles.nativeCardWrapper, { borderColor }, style]}>
      <BlurView intensity={25} tint="dark" style={styles.blurFill}>
        {children}
      </BlurView>
    </View>
  );
};

// ── Micro progress bar ────────────────────────────────────────────────────────
const MicroBar = ({ value, max }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100).toFixed(1) : '0';
  return (
    <View style={styles.barTrack}>
      <View style={[styles.barFill, { width: `${pct}%` }]} />
    </View>
  );
};

// ── Podium card (rank 1–3) ────────────────────────────────────────────────────
const PodiumCard = ({ resident, allTimeHigh, isChamp }) => {
  const medal = MEDAL[resident.rank] || MEDAL[3];
  const pct   = allTimeHigh > 0 ? Math.round((resident.greenPoints / allTimeHigh) * 100) : 0;
  return (
    <GlassCard
      borderColor={medal.border}
      style={[styles.podiumCard, isChamp && styles.champCard]}
    >
      <View style={[styles.podiumContent, isChamp && styles.champContent]}>
        <Text style={[styles.rankIcon, { color: medal.tint }]}>{medal.icon}</Text>
        <Text style={styles.podiumRank}>#{resident.rank} Rank</Text>
        <Text style={[styles.podiumName, isChamp && styles.champName]} numberOfLines={2}>
          {resident.name}
        </Text>
        <View style={styles.ptsBadge}>
          <Text style={styles.ptsText}>{resident.greenPoints} PTS</Text>
        </View>
        <Text style={styles.metaText}>
          {resident.greenPoints} PTS · {resident.energyGeneratedWh} WH
        </Text>
        <MicroBar value={resident.greenPoints} max={allTimeHigh} />
        <Text style={styles.pctText}>{pct}%</Text>
      </View>
    </GlassCard>
  );
};

// ── Contender card (rank 4+) ──────────────────────────────────────────────────
const ContenderCard = ({ resident }) => (
  <GlassCard borderColor="rgba(255,255,255,0.08)" style={styles.contenderCard}>
    <View style={styles.contenderContent}>
      <Text style={styles.contenderRank}>#{resident.rank}</Text>
      <Text style={styles.contenderName} numberOfLines={1}>{resident.name}</Text>
      <Text style={styles.contenderMeta}>
        {resident.steps} steps · {resident.energyGeneratedWh} Wh
      </Text>
      <View style={styles.contenderBadge}>
        <Text style={styles.contenderPts}>{resident.greenPoints} PTS</Text>
      </View>
    </View>
  </GlassCard>
);

// ── Main screen ───────────────────────────────────────────────────────────────
const LeaderboardScreen = ({ navigation }) => {
  const [leaders,    setLeaders]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = async () => {
    try {
      const data = await getSustainabilityLeaderboard();
      setLeaders(data);
    } catch {
      setLeaders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { loadLeaderboard(); }, []));

  if (loading) {
    return (
      <MatteScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#50C878" />
        </View>
      </MatteScreen>
    );
  }

  const allTimeHigh = leaders[0]?.greenPoints || 1;

  // Arrange podium left-to-right: #2 · #1 · #3
  const podium = [
    leaders.find(r => r.rank === 2),
    leaders.find(r => r.rank === 1),
    leaders.find(r => r.rank === 3),
  ].filter(Boolean);

  const contenders = leaders.filter(r => r.rank > 3);

  // Pair contenders into rows of 2
  const contenderRows = [];
  for (let i = 0; i < contenders.length; i += 2) {
    contenderRows.push(contenders.slice(i, i + 2));
  }

  return (
    <MatteScreen>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadLeaderboard(); }}
            tintColor="#50C878"
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RANKINGS: GREEN POINTS LEADERBOARD</Text>
          <Text style={styles.headerSub}>HALL OF FAME</Text>
        </View>

        {/* ── Podium ── */}
        {podium.length > 0 && (
          <View style={styles.podiumRow}>
            {podium.map(resident => (
              <PodiumCard
                key={resident.residentId}
                resident={resident}
                allTimeHigh={allTimeHigh}
                isChamp={resident.rank === 1}
              />
            ))}
          </View>
        )}

        {/* ── Contenders grid ── */}
        {contenderRows.length > 0 && (
          <View style={styles.contenderSection}>
            {contenderRows.map((row, i) => (
              <View key={i} style={styles.contenderRow}>
                {row.map(resident => (
                  <ContenderCard key={resident.residentId} resident={resident} />
                ))}
                {row.length < 2 && <View style={styles.contenderPlaceholder} />}
              </View>
            ))}
          </View>
        )}

        {/* ── Back link ── */}
        <Pressable
          onPress={() => navigation.navigate('Sustainability')}
          style={styles.backLink}
        >
          <Text style={styles.backLinkText}>Back to Sustainability Dashboard</Text>
        </Pressable>
      </ScrollView>
    </MatteScreen>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { paddingBottom: 56 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Glass card — web
  webCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(15,35,50,0.82)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  // Glass card — native
  nativeCardWrapper: {
    borderWidth: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 12,
  },
  blurFill: { flex: 1 },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F5FAFF',
    letterSpacing: 2,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '700',
    color: '#50C878',
    letterSpacing: 5,
    marginTop: 6,
  },

  // Podium row
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  podiumCard: {
    flex: 1,
    minHeight: 185,
    marginHorizontal: 4,
  },
  champCard: {
    minHeight: 230,
    transform: [{ translateY: -20 }],
  },
  podiumContent: {
    padding: 12,
    alignItems: 'center',
  },
  champContent: {
    padding: 16,
  },
  rankIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  podiumRank: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(225,236,247,0.62)',
    letterSpacing: 1,
    marginBottom: 4,
  },
  podiumName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F5FAFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  champName: {
    fontSize: 18,
  },
  ptsBadge: {
    backgroundColor: 'rgba(80,200,120,0.16)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(80,200,120,0.38)',
    marginBottom: 6,
  },
  ptsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#50C878',
    letterSpacing: 1,
  },
  metaText: {
    fontSize: 10,
    color: 'rgba(225,236,247,0.52)',
    marginBottom: 8,
    textAlign: 'center',
  },

  // Micro bar
  barTrack: {
    width: '90%',
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    backgroundColor: '#50C878',
    borderRadius: 2,
  },
  pctText: {
    fontSize: 9,
    color: 'rgba(225,236,247,0.45)',
    alignSelf: 'flex-end',
    paddingRight: '5%',
  },

  // Contenders
  contenderSection: {
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  contenderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contenderCard: {
    flex: 1,
    minHeight: 92,
    marginHorizontal: 4,
  },
  contenderPlaceholder: { flex: 1, marginHorizontal: 4 },
  contenderContent: { padding: 12 },
  contenderRank: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(225,236,247,0.5)',
    marginBottom: 3,
  },
  contenderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F5FAFF',
    marginBottom: 3,
  },
  contenderMeta: {
    fontSize: 10,
    color: 'rgba(225,236,247,0.45)',
    marginBottom: 7,
  },
  contenderBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(80,200,120,0.14)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(80,200,120,0.28)',
  },
  contenderPts: {
    fontSize: 11,
    fontWeight: '700',
    color: '#50C878',
  },

  // Back link
  backLink: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  backLinkText: {
    fontSize: 12,
    color: 'rgba(225,236,247,0.45)',
    textDecorationLine: 'underline',
  },
});

export default LeaderboardScreen;
