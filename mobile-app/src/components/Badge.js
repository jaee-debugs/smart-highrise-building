import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/Theme';

const Badge = ({ text, status = 'default', style }) => {
    const normalized = String(status).toLowerCase();
    let backgroundColor = colors.primary;
    if (normalized === 'success' || normalized === 'available' || normalized === 'normal' || normalized === 'verified' || normalized === 'healthy') backgroundColor = colors.success;
    if (normalized === 'warning' || normalized === 'pending' || normalized === 'charging' || normalized === 'occupied' || normalized === 'booked' || normalized === 'in use' || normalized === 'low') backgroundColor = colors.warning;
    if (normalized === 'error' || normalized === 'critical' || normalized === 'disabled' || normalized === 'alert' || normalized === 'rejected') backgroundColor = colors.error;

    return (
        <View style={[styles.badge, { backgroundColor }, style]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    text: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    }
});

export default Badge;
