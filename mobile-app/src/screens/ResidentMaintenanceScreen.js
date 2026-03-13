import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import Button from '../components/Button';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
import { createMaintenanceRequest, getMaintenanceRequests } from '../services/apiService';

const ResidentMaintenanceScreen = () => {
  const [requests, setRequests] = useState([]);
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('Tower A 101');

  const loadData = async () => {
    try {
      const data = await getMaintenanceRequests();
      setRequests(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch maintenance requests.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitRequest = async () => {
    if (!issue.trim()) {
      Alert.alert('Issue required', 'Please enter a maintenance issue.');
      return;
    }

    try {
      await createMaintenanceRequest({
        issue,
        location,
        requestedBy: 'Resident-A101'
      });
      setIssue('');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Unable to submit maintenance request.');
    }
  };

  const myRequests = requests.filter((item) => item.requestedBy === 'Resident-A101');

  return (
    <MatteScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>My Maintenance</Text>

        <MattePanel style={styles.card}>
          <Text style={styles.sectionTitle}>Raise New Request</Text>
          <TextInput style={styles.input} placeholder="Describe issue" placeholderTextColor="rgba(236,244,250,0.62)" value={issue} onChangeText={setIssue} />
          <TextInput style={styles.input} placeholder="Location" placeholderTextColor="rgba(236,244,250,0.62)" value={location} onChangeText={setLocation} />
          <Button title="Submit Request" onPress={submitRequest} style={styles.anchorButton} textStyle={styles.actionText} />
        </MattePanel>

        <Text style={styles.sectionTitle}>My Requests</Text>
        {myRequests.map((req) => (
          <MattePanel key={req.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.issue}>{req.issue}</Text>
              <View style={[styles.statusPill, req.status === 'Resolved' ? styles.successPill : req.status === 'In Progress' ? styles.warningPill : styles.warningPill]}><Text style={styles.statusText}>{req.status}</Text></View>
            </View>
            <Text style={styles.meta}>{req.location} • {req.reportedOn}</Text>
          </MattePanel>
        ))}
      </ScrollView>
    </MatteScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.lg },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm, color: '#F3F8FC' },
  card: { marginBottom: spacing.md },
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  issue: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  meta: { fontSize: 12, marginTop: spacing.xs, color: 'rgba(236,244,250,0.72)' },
  anchorButton: { backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  actionText: { color: '#FFFFFF' },
  statusPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  successPill: { backgroundColor: '#2D6A4F' },
  warningPill: { backgroundColor: '#8A6A23' },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }
});

export default ResidentMaintenanceScreen;
