import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>My Maintenance</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Raise New Request</Text>
          <TextInput style={styles.input} placeholder="Describe issue" value={issue} onChangeText={setIssue} />
          <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
          <Button title="Submit Request" onPress={submitRequest} />
        </Card>

        <Text style={styles.sectionTitle}>My Requests</Text>
        {myRequests.map((req) => (
          <Card key={req.id} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.issue}>{req.issue}</Text>
              <Badge text={req.status} status={req.status === 'Resolved' ? 'success' : req.status === 'In Progress' ? 'warning' : 'pending'} />
            </View>
            <Text style={styles.meta}>{req.location} • {req.reportedOn}</Text>
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
  sectionTitle: { ...typography.title, marginBottom: spacing.sm },
  card: { marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: '#D6E0E8',
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.sm
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  issue: { ...typography.body, fontWeight: 'bold' },
  meta: { ...typography.caption, marginTop: spacing.xs }
});

export default ResidentMaintenanceScreen;
