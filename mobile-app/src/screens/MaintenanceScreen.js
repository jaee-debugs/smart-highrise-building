import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Maintenance Management</Text>

        {requests.map((req) => (
          <Card key={req.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.issue}>{req.issue}</Text>
              <Badge text={req.status} status={req.status === 'Resolved' ? 'success' : req.status === 'In Progress' ? 'warning' : 'pending'} />
            </View>
            <Text style={styles.details}>{req.location} • Reported: {req.reportedOn}</Text>
            <Text style={styles.details}>Requested By: {req.requestedBy}</Text>
            <Button title="Update Status" variant="outline" style={{ marginTop: spacing.sm }} onPress={() => onUpdate(req)} />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.lg },
  card: { marginBottom: spacing.md, padding: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  issue: { ...typography.title, fontWeight: 'bold' },
  details: { ...typography.body, color: colors.textLight, marginTop: spacing.xs }
});

export default MaintenanceScreen;
