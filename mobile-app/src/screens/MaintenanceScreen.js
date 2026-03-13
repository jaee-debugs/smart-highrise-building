import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { spacing } from '../theme/Theme';
import { AdminActionButton, AdminPill, AdminScreen, AdminPanel, adminColors } from '../components/AdminScaffold';
import { getMaintenanceRequests, updateMaintenanceRequest } from '../services/apiService';

const nextStatus = (status) => {
  if (status === 'Pending') return 'In Progress';
  if (status === 'In Progress') return 'Resolved';
  return 'Pending';
};

const MaintenanceScreen = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const data = await getMaintenanceRequests();
      setRequests(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to load maintenance requests.');
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const onUpdate = async (request) => {
    try {
      await updateMaintenanceRequest(request.id, { status: nextStatus(request.status) });
      loadRequests();
    } catch (error) {
      Alert.alert('Error', 'Failed to update maintenance status.');
    }
  };

  return (
    <AdminScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Maintenance Management</Text>

        {requests.map((req) => (
          <AdminPanel key={req.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.issue}>{req.issue}</Text>
              <AdminPill text={req.status} tone={req.status === 'Resolved' ? 'success' : req.status === 'In Progress' ? 'warning' : 'neutral'} />
            </View>
            <Text style={styles.details}>{req.location} • Reported: {req.reportedOn}</Text>
            <Text style={styles.details}>Requested By: {req.requestedBy}</Text>
            <AdminActionButton title="Update Status" variant="outline" style={{ marginTop: spacing.sm }} onPress={() => onUpdate(req)} />
          </AdminPanel>
        ))}
      </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  issue: { fontSize: 18, fontWeight: '700', color: adminColors.text },
  details: { fontSize: 14, color: adminColors.subtext, marginTop: spacing.xs }
});

export default MaintenanceScreen;
