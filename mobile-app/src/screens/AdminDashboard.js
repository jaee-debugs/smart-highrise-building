import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import DashboardCard from '../components/DashboardCard';

const AdminDashboard = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Admin Control Center</Text>

                <DashboardCard
                    title="Water Tank Monitoring"
                    value="Live tank levels"
                    backgroundColor="#e1f5fe"
                    onPress={() => navigation.navigate('WaterMonitoring')}
                />

                <DashboardCard
                    title="Parking Overview"
                    value="Total capacity & utilization"
                    backgroundColor="#fff8e1"
                    onPress={() => navigation.navigate('Parking')}
                />

                <DashboardCard
                    title="Energy Analytics"
                    value="Building-wide sustainability"
                    backgroundColor="#e8f5e9"
                    onPress={() => navigation.navigate('Energy')}
                />

                <DashboardCard
                    title="Infrastructure Alerts"
                    value="Low water warning (Mock)"
                    backgroundColor="#ffebee"
                    onPress={() => alert('Mock Alert: Water pressure low in Tower A')}
                />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333'
    }
});

export default AdminDashboard;
