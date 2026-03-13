import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, spacing } from '../theme/Theme';
import Button from '../components/Button';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
import { createVisitorPass, getVisitorPasses, getVisitors } from '../services/apiService';

const VisitorScreen = () => {
  const [visitors, setVisitors] = useState([]);
  const [passes, setPasses] = useState([]);
  const [name, setName] = useState('Family Guest');
  const [tower, setTower] = useState('Tower A');
  const [flat, setFlat] = useState('101');
  const [visitTime, setVisitTime] = useState(new Date(Date.now() + 15 * 60 * 1000).toISOString());

  const loadData = async () => {
    try {
      const [visitorLog, passData] = await Promise.all([getVisitors(), getVisitorPasses()]);
      setVisitors(visitorLog);
      setPasses(passData);
    } catch (error) {
      Alert.alert('Error', 'Unable to load visitor data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onGenerate = async () => {
    if (!name.trim() || !tower.trim() || !flat.trim()) {
      Alert.alert('Required', 'Please provide visitor, tower and flat details.');
      return;
    }

    try {
      await createVisitorPass({
        visitorName: name.trim(),
        tower: tower.trim(),
        flat: flat.trim(),
        visitTime,
        validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        createdBy: 'Resident-A101'
      });
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Unable to generate visitor pass.');
    }
  };

  const latestPass = passes[0];

  return (
    <MatteScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Visitors Log</Text>
        </View>

        {visitors.map((visitor) => (
          <MattePanel key={visitor.id} style={styles.visitorCard}>
            <View style={styles.vInfo}>
              <Text style={styles.vName}>{visitor.name}</Text>
              <Text style={styles.vType}>{visitor.type} • {visitor.time || '--:--'}</Text>
            </View>
            <View style={[styles.statusPill, visitor.status === 'Entered' ? styles.successPill : styles.warningPill]}><Text style={styles.statusText}>{visitor.status}</Text></View>
          </MattePanel>
        ))}

        <MattePanel style={styles.qrCard}>
          <Text style={styles.qrHeader}>Create Visitor Pass</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Visitor name" placeholderTextColor="rgba(236,244,250,0.62)" />
          <View style={styles.inlineRow}>
            <TextInput style={[styles.input, styles.halfInput]} value={tower} onChangeText={setTower} placeholder="Tower" placeholderTextColor="rgba(236,244,250,0.62)" />
            <TextInput style={[styles.input, styles.halfInput]} value={flat} onChangeText={setFlat} placeholder="Flat" placeholderTextColor="rgba(236,244,250,0.62)" />
          </View>
          <TextInput style={styles.input} value={visitTime} onChangeText={setVisitTime} placeholder="Visit time (ISO)" placeholderTextColor="rgba(236,244,250,0.62)" />
          <Button title="Generate QR Pass" onPress={onGenerate} style={styles.anchorButton} textStyle={styles.actionText} />

          {latestPass && (
            <View style={styles.qrBox}>
              <QRCode value={latestPass.qrPayload || latestPass.passToken} size={140} />
              <Text style={styles.token}>Visitor ID: {latestPass.visitorId}</Text>
              <Text style={styles.token}>Status: {latestPass.status}</Text>
              <Text style={styles.token}>Valid Until: {latestPass.validUntil}</Text>
            </View>
          )}
        </MattePanel>

        <MattePanel style={styles.qrCard}>
          <Text style={styles.qrHeader}>My Visitor Passes</Text>
          {passes.slice(0, 8).map((pass) => (
            <View key={pass.id} style={styles.passRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.passLabel}>{pass.visitorName} • {pass.tower}-{pass.flat}</Text>
                <Text style={styles.token}>{pass.visitorId}</Text>
              </View>
              <View style={[styles.statusPill, pass.status === 'Checked In' ? styles.successPill : pass.status === 'Rejected' || pass.status === 'Expired' ? styles.errorPill : styles.warningPill]}><Text style={styles.statusText}>{pass.status}</Text></View>
            </View>
          ))}
        </MattePanel>
      </ScrollView>
    </MatteScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB' },
  visitorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg, marginBottom: 12 },
  vName: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  vType: { fontSize: 14, color: 'rgba(236,244,250,0.72)' },
  qrCard: { marginTop: spacing.xl, padding: spacing.xl },
  qrHeader: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: spacing.md, color: '#F4F8FB' },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.sm,
    color: '#FFFFFF'
  },
  inlineRow: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  qrBox: { marginTop: spacing.md, alignItems: 'center' },
  token: { fontSize: 12, marginTop: spacing.sm, color: 'rgba(236,244,250,0.72)' },
  passRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  passLabel: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  anchorButton: { backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  actionText: { color: '#FFFFFF' },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  successPill: { backgroundColor: '#2D6A4F' },
  warningPill: { backgroundColor: '#8A6A23' },
  errorPill: { backgroundColor: '#9B2226' },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }
});

export default VisitorScreen;
