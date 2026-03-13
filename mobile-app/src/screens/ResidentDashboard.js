import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ImageBackground,
  Platform,
  Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { colors, spacing } from '../theme/Theme';
import { getCommunityData, getEVStations, getParkingStatus, getSustainabilityData, triggerEmergencySOS } from '../services/apiService';

const DASHBOARD_BG = 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80';

const MattePanel = ({ children, style }) => {
  if (Platform.OS === 'web') {
    return <View style={[styles.webPanel, style]}>{children}</View>;
  }

  return (
    <BlurView intensity={30} tint="dark" style={[styles.nativePanel, style]}>
      {children}
    </BlurView>
  );
};

const ResidentDashboard = ({ navigation }) => {
  const [susData, setSusData] = useState(null);
  const [communityCount, setCommunityCount] = useState(0);
  const [evFree, setEvFree] = useState(0);
  const [parkingFree, setParkingFree] = useState(0);
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold, Inter_800ExtraBold });

  const refreshData = async () => {
    try {
      const [sustainability, community, evStations, parking] = await Promise.all([
        getSustainabilityData(),
        getCommunityData(),
        getEVStations(),
        getParkingStatus()
      ]);

      setSusData(sustainability);
      setCommunityCount((community.notices?.length || 0) + (community.events?.length || 0));
      setEvFree(evStations.filter((item) => item.status === 'Available').length);
      setParkingFree(parking.filter((item) => item.status === 'Available').length);
    } catch (error) {
      // keep dashboard usable even if one call fails
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const onSOS = async () => {
    try {
      await triggerEmergencySOS({
        residentName: 'Resident User',
        tower: 'Tower A',
        floor: '10',
        flat: '101',
        location: 'Tower A, Flat 101'
      });
      Alert.alert('SOS Sent', 'Emergency team and admin have been notified.');
    } catch (error) {
      Alert.alert('Failed', 'Unable to trigger SOS at the moment.');
    }
  };

  const features = [
    { id: 1, title: 'Smart Parking', icon: 'PK', route: 'Parking', status: `${parkingFree} FREE`, tone: 'default' },
    { id: 2, title: 'Visitor Control', icon: 'VC', route: 'Visitor', status: null, tone: 'default' },
    { id: 3, title: 'Indoor Map', icon: 'IM', route: 'IndoorNavigation', status: null, tone: 'default' },
    { id: 4, title: 'Sustainability', icon: 'SU', route: 'Sustainability', status: susData ? `${susData.greenPoints} PTS` : null, tone: 'accent' },
    { id: 5, title: 'Community', icon: 'CM', route: 'Community', status: `${communityCount} UPDATES`, tone: 'default' },
    { id: 6, title: 'EV Charging', icon: 'EV', route: 'EVCharging', status: `${evFree} OPEN`, tone: 'default' },
    { id: 7, title: 'Elevators', icon: 'EL', route: 'Elevator', status: 'OPERATIONAL', tone: 'default' },
    { id: 8, title: 'Maintenance', icon: 'MT', route: 'ResidentMaintenance', status: 'TRACK', tone: 'default' },
  ];

  if (!fontsLoaded) {
    return <SafeAreaView style={styles.loader} />;
  }

  return (
    <ImageBackground source={{ uri: DASHBOARD_BG }} style={styles.background} resizeMode="cover">
      <View style={styles.backdrop} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <MattePanel style={styles.topBar}>
            <View>
              <Text style={styles.greeting}>Hello, Resident</Text>
              <Text style={styles.subtext}>Tower A • Flat 101</Text>
            </View>
            <View style={styles.towerBadge}>
              <Text style={styles.towerBadgeText}>HOME</Text>
            </View>
          </MattePanel>

          <Pressable onPress={onSOS} style={styles.sosWrap}>
            <View style={styles.sosCard}>
              <Text style={styles.sosText}>EMERGENCY SOS</Text>
            </View>
          </Pressable>

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <Text style={styles.sectionMeta}>Resident Dashboard</Text>
          </View>

          <View style={styles.grid}>
            {features.map((item) => (
              <Pressable key={item.id} style={styles.gridItemWrap} onPress={() => navigation.navigate(item.route)}>
                <MattePanel style={styles.gridItem}>
                  {item.status && (
                    <View style={styles.statusPill}>
                      <Text style={styles.statusPillText}>{item.status}</Text>
                    </View>
                  )}
                  <View style={[styles.iconShell, item.tone === 'accent' && styles.iconShellAccent]}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                  </View>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </MattePanel>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, backgroundColor: '#0B1721' },
  background: { flex: 1, backgroundColor: '#08111A' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,11,18,0.46)' },
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.lg, paddingTop: spacing.md },
  webPanel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15, 35, 50, 0.7)',
    backdropFilter: 'blur(28px)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
  },
  nativePanel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15, 35, 50, 0.7)',
    overflow: 'hidden',
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: { fontFamily: 'Inter_800ExtraBold', fontSize: 30, color: '#F8FBFF' },
  subtext: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(236,244,250,0.72)', marginTop: spacing.xs },
  towerBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
  },
  towerBadgeText: { fontFamily: 'Inter_700Bold', color: '#EEF6FF', fontSize: 12, letterSpacing: 1.1 },
  sosWrap: { marginBottom: spacing.lg },
  sosCard: {
    backgroundColor: '#9B2226',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  sosText: { color: colors.white, fontFamily: 'Inter_800ExtraBold', fontSize: 18, letterSpacing: 0.8 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: '#F3F8FC' },
  sectionMeta: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(236,244,250,0.64)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItemWrap: { width: '48%', marginBottom: spacing.md },
  gridItem: {
    minHeight: 168,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusPill: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(8,16,24,0.88)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillText: {
    fontFamily: 'Inter_700Bold',
    color: '#F4F8FB',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  iconShell: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  iconShellAccent: {
    borderColor: 'rgba(45,106,79,0.65)',
    backgroundColor: 'rgba(45,106,79,0.18)',
  },
  iconText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  itemTitle: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 21,
  },
});

export default ResidentDashboard;
