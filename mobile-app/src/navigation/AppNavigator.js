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

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ResidentDashboard" component={ResidentDashboard} options={{ title: 'Resident Dashboard' }} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
            <Stack.Screen name="Parking" component={ParkingScreen} />
            <Stack.Screen name="WaterMonitoring" component={WaterMonitoringScreen} options={{ title: 'Water Monitoring' }} />
            <Stack.Screen name="Energy" component={EnergyScreen} options={{ title: 'Energy Analytics' }} />
            <Stack.Screen name="Visitor" component={VisitorScreen} options={{ title: 'Visitor Management' }} />
            <Stack.Screen name="Community" component={CommunityScreen} />
            <Stack.Screen name="IndoorNavigation" component={IndoorNavigationScreen} options={{ title: 'Indoor Navigation' }} />
        </Stack.Navigator>
    );
}
