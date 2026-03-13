import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { spacing } from '../theme/Theme';
import { AdminActionButton, AdminPanel, AdminPill, AdminScreen, LivePanel, StatusLED, adminColors } from '../components/AdminScaffold';
import {
  blockUnauthorizedEntry,
  decideVisitorPass,
  getCCTVFeeds,
  getVisitorEntryLogs,
  getVisitorPasses,
  verifyVisitorPass
} from '../services/apiService';

const SecurityScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanLock, setScanLock] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [activeCameraId, setActiveCameraId] = useState(null);
  const [passes, setPasses] = useState([]);
  const [entryLogs, setEntryLogs] = useState([]);
  const [scanned, setScanned] = useState(null);
  const [manualToken, setManualToken] = useState('');

  const activeCamera = useMemo(
    () => cameras.find((cam) => cam.id === activeCameraId) || cameras[0],
    [cameras, activeCameraId]
  );

  const loadData = async () => {
    try {
      const [feeds, passData, logs] = await Promise.all([
        getCCTVFeeds(),
        getVisitorPasses(),
        getVisitorEntryLogs()
      ]);
      setCameras(feeds);
      setActiveCameraId(feeds[0]?.id || null);
      setPasses(passData);
      setEntryLogs(logs);
    } catch (error) {
      Alert.alert('Error', 'Unable to load security dashboard data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openScanner = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert('Camera required', 'Please allow camera permission for QR scanning.');
        return;
      }
    }
    setScannerVisible(true);
  };

  const blockToken = async (token, reason) => {
    const value = String(token || '').trim();
    if (!value) {
      Alert.alert('Token required', 'Provide a token to block unauthorized entry.');
      return;
    }
    try {
      await blockUnauthorizedEntry(value, reason);
      setManualToken('');
      setScanned(null);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Unable to block entry token.');
    }
  };

  const onBarcodeScanned = async ({ data }) => {
    if (scanLock) return;
    setScanLock(true);
    const raw = String(data || '').trim();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = null;
    }
    const token = String(parsed?.passToken || raw).trim();

    try {
      const result = await verifyVisitorPass(token);
      setScanned(result.pass);
      Alert.alert('Entry Granted', `${result.pass.visitorName} • ${result.pass.tower}-${result.pass.flat}`);
    } catch (error) {
      const payload = error?.response?.data || {};
      Alert.alert('Entry Denied - Invalid QR Code');
      if (payload.pass) {
        setScanned(payload.pass);
      } else {
        setScanned({ passToken: token, status: 'Denied' });
      }
    } finally {
      setTimeout(() => setScanLock(false), 1200);
      loadData();
    }
  };

  const decideEntry = async (decision) => {
    if (!scanned?.id) return;
    try {
      await decideVisitorPass(scanned.id, decision);
      Alert.alert('Access Control', decision === 'approve' ? 'Entry approved' : 'Entry denied');
      setScanned(null);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Unable to apply access decision.');
    }
  };

  return (
    <AdminScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Security Control Panel</Text>

        <LivePanel style={styles.card}>
          <Text style={styles.sectionTitle}>CCTV Monitoring</Text>
          <View style={styles.grid}>
            {cameras.map((camera) => (
              <AdminPanel key={camera.id} style={[styles.camThumb, activeCamera?.id === camera.id && styles.camSelected]} onPress={() => setActiveCameraId(camera.id)}>
                <View style={styles.mockFeed}><Text style={styles.mockText}>{camera.area}</Text></View>
                <View style={styles.rowBetween}>
                  <View style={styles.cameraMeta}><StatusLED online={camera.status === 'Online'} /><Text style={styles.cameraId}>{camera.id}</Text></View>
                  <Text style={styles.cameraStatus}>{camera.status}</Text>
                </View>
              </AdminPanel>
            ))}
          </View>

          {activeCamera && (
            <View style={styles.detailView}>
              <Text style={styles.detailTitle}>Detailed View: {activeCamera.area}</Text>
              <View style={styles.detailFeed}>
                <Text style={styles.mockTextLarge}>{activeCamera.id} LIVE FEED</Text>
              </View>
            </View>
          )}
        </LivePanel>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Visitor Verification (QR Scan)</Text>
          {!scannerVisible ? (
            <AdminActionButton title="Open Camera Scanner" onPress={openScanner} />
          ) : (
            <>
              <View style={styles.cameraWrap}>
                <CameraView style={styles.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={onBarcodeScanned} />
              </View>
              <AdminActionButton title="Close Scanner" variant="outline" onPress={() => setScannerVisible(false)} />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Manual token for unauthorized block"
            placeholderTextColor="rgba(225,236,247,0.5)"
            value={manualToken}
            onChangeText={setManualToken}
          />
          <View style={styles.actionTray}>
            <AdminActionButton title="Block Unauthorized Entry" variant="outline" onPress={() => blockToken(manualToken, 'Blocked by security operator')} />
          </View>

          {scanned && (
            <View style={styles.scanCard}>
              <Text style={styles.scanTitle}>Scanned Token: {scanned.passToken || '-'}</Text>
              <Text style={styles.scanMeta}>Visitor ID: {scanned.visitorId || '-'}</Text>
              <Text style={styles.scanMeta}>Visitor: {scanned.visitorName || 'Unknown'}</Text>
              <Text style={styles.scanMeta}>Location: {scanned.tower || '-'} {scanned.flat || ''}</Text>
              <Text style={styles.scanMeta}>Visit Time: {scanned.visitTime || '-'}</Text>
              <AdminPill text={scanned.status || 'Scanned'} tone={scanned.status === 'Checked In' ? 'success' : scanned.status === 'Denied' || scanned.status === 'Rejected' || scanned.status === 'Expired' ? 'error' : 'warning'} />
              {scanned.id ? (
                <View style={styles.actionRow}>
                  <AdminActionButton title="Manual Approve" style={styles.actionBtn} onPress={() => decideEntry('approve')} />
                  <AdminActionButton title="Manual Deny" variant="outline" style={styles.actionBtn} onPress={() => decideEntry('reject')} />
                </View>
              ) : (
                <AdminActionButton title="Block This Token" variant="outline" onPress={() => blockToken(scanned.passToken, 'Unauthorized scan')} />
              )}
            </View>
          )}
        </AdminPanel>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Access Control Logs</Text>
          {entryLogs.slice(0, 10).map((log) => (
            <View key={log.id} style={styles.logRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.logTitle}>{log.visitorName || log.token}</Text>
                <Text style={styles.logText}>{log.reason}</Text>
              </View>
              <AdminPill text={log.status} tone={log.status === 'Verified' ? 'success' : log.status === 'Blocked' || log.status === 'Unauthorized' || log.status === 'Rejected' ? 'error' : 'warning'} />
            </View>
          ))}
        </AdminPanel>

        <AdminPanel style={styles.card}>
          <Text style={styles.sectionTitle}>Pre-Registered Guests</Text>
          {passes.slice(0, 6).map((pass) => (
            <View key={pass.id} style={styles.logRow}>
              <Text style={styles.logTitle}>{pass.visitorName} ({pass.tower}-{pass.flat})</Text>
              <AdminPill text={pass.status} tone={pass.status === 'Verified' ? 'success' : pass.status === 'Rejected' ? 'error' : 'warning'} />
            </View>
          ))}
        </AdminPanel>
      </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.md, color: adminColors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  camThumb: { width: '48%', marginBottom: spacing.sm, padding: spacing.sm },
  camSelected: { borderWidth: 1, borderColor: 'rgba(0,255,65,0.35)' },
  mockFeed: { height: 80, backgroundColor: '#0A1118', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  mockText: { color: '#D8E2EE', fontSize: 12, fontWeight: 'bold' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  cameraMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cameraId: { color: adminColors.text, fontSize: 12, fontWeight: '700' },
  cameraStatus: { color: adminColors.subtext, fontSize: 12 },
  detailView: { marginTop: spacing.md },
  detailTitle: { color: adminColors.text, marginBottom: spacing.sm, fontWeight: '700', fontSize: 14 },
  detailFeed: { height: 170, borderRadius: 10, backgroundColor: '#0D131A', justifyContent: 'center', alignItems: 'center' },
  mockTextLarge: { color: '#D8E2EE', fontWeight: 'bold', fontSize: 16 },
  cameraWrap: { height: 260, overflow: 'hidden', borderRadius: 12, marginBottom: spacing.md },
  camera: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: '#09131D',
    color: adminColors.text,
  },
  actionTray: { marginTop: spacing.sm, padding: spacing.md, borderRadius: 14, backgroundColor: '#08131D' },
  scanCard: { marginTop: spacing.md, padding: spacing.sm, backgroundColor: '#0A141E', borderRadius: 10 },
  scanTitle: { color: adminColors.text, fontWeight: '700', fontSize: 14 },
  scanMeta: { color: adminColors.subtext, fontSize: 12, marginTop: 3 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  actionBtn: { width: '48%' },
  logRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  logTitle: { color: adminColors.text, fontSize: 14, fontWeight: '700' },
  logText: { color: adminColors.subtext, fontSize: 12 }
});

export default SecurityScreen;
