import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, shadows, spacing } from '../theme/Theme';

const Card = ({ children, style, onPress }) => {
    const Component = onPress ? TouchableOpacity : View;
    return (
        <Component style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
            {children}
        </Component>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.md,
        marginVertical: spacing.sm,
        ...shadows.soft,
    }
});

export default Card;
