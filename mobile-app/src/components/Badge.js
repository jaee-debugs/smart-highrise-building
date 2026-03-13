import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/Theme';

const Badge = ({ text, status = 'default', style }) => {
    let backgroundColor = colors.primary;
    if (status === 'success' || status === 'available') backgroundColor = colors.success;
    if (status === 'warning' || status === 'pending' || status === 'charging') backgroundColor = colors.warning;
    if (status === 'error' || status === 'occupied' || status === 'booked') backgroundColor = colors.error;

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
