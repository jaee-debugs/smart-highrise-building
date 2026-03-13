import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import ResidentDashboard from '../screens/ResidentDashboard';
import AdminDashboard from '../screens/AdminDashboard';
import ParkingScreen from '../screens/ParkingScreen';
import WaterMonitoringScreen from '../screens/WaterMonitoringScreen';
import EnergyScreen from '../screens/EnergyScreen';
import VisitorScreen from '../screens/VisitorScreen';
import CommunityScreen from '../screens/CommunityScreen';
import IndoorNavigationScreen from '../screens/IndoorNavigationScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerStyle: { backgroundColor: '#F4F7F6' }, headerTintColor: '#0A3B5C', headerTitleStyle: { fontWeight: 'bold' } }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

            {/* Resident Screens */}
            <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} options={{ title: 'My Home' }} />
            <Stack.Screen name="Parking" component={ParkingScreen} options={{ title: 'Smart Parking' }} />
            <Stack.Screen name="Visitor" component={VisitorScreen} options={{ title: 'Visitor Control' }} />
            <Stack.Screen name="Community" component={CommunityScreen} options={{ title: 'Community' }} />
            <Stack.Screen name="IndoorNavigation" component={IndoorNavigationScreen} options={{ title: 'Indoor Map' }} />
            <Stack.Screen name="Sustainability" component={require('../screens/SustainabilityScreen').default} options={{ title: 'Sustainability' }} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
            <Stack.Screen name="EVCharging" component={require('../screens/EVScreen').default} options={{ title: 'EV Charging' }} />
            <Stack.Screen name="Elevator" component={require('../screens/ElevatorScreen').default} options={{ title: 'Elevators' }} />
            <Stack.Screen name="ResidentMaintenance" component={require('../screens/ResidentMaintenanceScreen').default} options={{ title: 'My Maintenance' }} />

            {/* Admin Screens */}
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Console' }} />
            <Stack.Screen name="WaterMonitoring" component={WaterMonitoringScreen} options={{ title: 'Water Infra' }} />
            <Stack.Screen name="Energy" component={EnergyScreen} options={{ title: 'Energy Analytics' }} />
            <Stack.Screen name="InfraMonitor" component={require('../screens/InfraMonitorScreen').default} options={{ title: 'Infra Monitor' }} />
            <Stack.Screen name="Security" component={require('../screens/SecurityScreen').default} options={{ title: 'Security Control' }} />
            <Stack.Screen name="Maintenance" component={require('../screens/MaintenanceScreen').default} options={{ title: 'Maintenance' }} />
            <Stack.Screen name="AdminCommunity" component={require('../screens/AdminCommunityScreen').default} options={{ title: 'Manage Community' }} />
            <Stack.Screen name="AdminEV" component={require('../screens/AdminEVScreen').default} options={{ title: 'Manage EV Slots' }} />
            <Stack.Screen name="AdminParking" component={require('../screens/AdminParkingScreen').default} options={{ title: 'Manage Parking' }} />
        </Stack.Navigator>
    );
}
