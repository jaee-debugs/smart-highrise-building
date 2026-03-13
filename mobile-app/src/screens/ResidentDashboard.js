import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, Text } from 'react-native';
import DashboardCard from '../components/DashboardCard';

const ResidentDashboard = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Welcome, Resident!</Text>

                <DashboardCard
                    title="Smart Parking"
                    value="Check available slots"
                    backgroundColor="#e3f2fd"
                    onPress={() => navigation.navigate('Parking')}
                />

                <DashboardCard
                    title="Sustainability"
                    value="View your energy contributions"
                    backgroundColor="#e8f5e9"
                    onPress={() => navigation.navigate('Energy')}
                />

                <DashboardCard
                    title="Community"
                    value="Notices and events"
                    backgroundColor="#fff3e0"
                    onPress={() => navigation.navigate('Community')}
                />

                <DashboardCard
                    title="Visitors"
                    value="Manage guest passes"
                    backgroundColor="#f3e5f5"
                    onPress={() => navigation.navigate('Visitor')}
                />

                <DashboardCard
                    title="Indoor Navigation"
                    value="View 3D map of the estate"
                    backgroundColor="#eceff1"
                    onPress={() => navigation.navigate('IndoorNavigation')}
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

export default ResidentDashboard;
