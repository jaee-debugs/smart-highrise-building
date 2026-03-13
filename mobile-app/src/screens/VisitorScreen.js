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
    await createVisitorPass({
      visitorName: name,
      tower: 'Tower A',
      flat: '101',
      validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    });
    loadData();
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
          <Button title="Generate QR Pass" onPress={onGenerate} />

          {latestPass && (
            <View style={styles.qrBox}>
              <QRCode value={latestPass.passToken} size={140} />
              <Text style={styles.token}>{latestPass.passToken}</Text>
            </View>
          )}
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
  qrBox: { marginTop: spacing.md, alignItems: 'center' },
  token: { ...typography.caption, marginTop: spacing.sm }
});

export default VisitorScreen;
