import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Visitors Log</Text>
        </View>

        {visitors.map((visitor) => (
          <Card key={visitor.id} style={styles.visitorCard}>
            <View style={styles.vInfo}>
              <Text style={styles.vName}>{visitor.name}</Text>
              <Text style={styles.vType}>{visitor.type} • {visitor.time || '--:--'}</Text>
            </View>
            <Badge text={visitor.status} status={visitor.status === 'Entered' ? 'success' : 'pending'} />
          </Card>
        ))}

        <Card style={styles.qrCard}>
          <Text style={styles.qrHeader}>Create Visitor Pass</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Visitor name" />
          <View style={styles.inlineRow}>
            <TextInput style={[styles.input, styles.halfInput]} value={tower} onChangeText={setTower} placeholder="Tower" />
            <TextInput style={[styles.input, styles.halfInput]} value={flat} onChangeText={setFlat} placeholder="Flat" />
          </View>
          <TextInput style={styles.input} value={visitTime} onChangeText={setVisitTime} placeholder="Visit time (ISO)" />
          <Button title="Generate QR Pass" onPress={onGenerate} />

          {latestPass && (
            <View style={styles.qrBox}>
              <QRCode value={latestPass.qrPayload || latestPass.passToken} size={140} />
              <Text style={styles.token}>Visitor ID: {latestPass.visitorId}</Text>
              <Text style={styles.token}>Status: {latestPass.status}</Text>
              <Text style={styles.token}>Valid Until: {latestPass.validUntil}</Text>
            </View>
          )}
        </Card>

        <Card style={styles.qrCard}>
          <Text style={styles.qrHeader}>My Visitor Passes</Text>
          {passes.slice(0, 8).map((pass) => (
            <View key={pass.id} style={styles.passRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.passLabel}>{pass.visitorName} • {pass.tower}-{pass.flat}</Text>
                <Text style={styles.token}>{pass.visitorId}</Text>
              </View>
              <Badge text={pass.status} status={pass.status === 'Checked In' ? 'success' : pass.status === 'Rejected' || pass.status === 'Expired' ? 'error' : 'warning'} />
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  pageTitle: { ...typography.header, color: colors.primary },
  visitorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.lg },
  vName: { ...typography.title },
  vType: { ...typography.body, color: colors.textLight },
  qrCard: { marginTop: spacing.xl, padding: spacing.xl },
  qrHeader: { ...typography.title, textAlign: 'center', marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: '#D6E0E8',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.sm
  },
  inlineRow: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { width: '48%' },
  qrBox: { marginTop: spacing.md, alignItems: 'center' },
  token: { ...typography.caption, marginTop: spacing.sm }
  ,passRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  passLabel: { ...typography.body, fontWeight: 'bold' }
});

export default VisitorScreen;
