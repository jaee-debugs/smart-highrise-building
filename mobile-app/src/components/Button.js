import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, shadows } from '../theme/Theme';

const Button = ({ title, onPress, style, textStyle, variant = 'primary', loading = false, disabled = false }) => {
    const isPrimary = variant === 'primary';
    const isSecondary = variant === 'secondary';
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary && styles.primary,
                isSecondary && styles.secondary,
                isOutline && styles.outline,
                disabled && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
            ) : (
                <Text style={[
                    styles.text,
                    isPrimary && styles.textPrimary,
                    isSecondary && styles.textPrimary,
                    isOutline && styles.textOutline,
                    textStyle
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.sm,
        ...shadows.soft
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.accent,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
        ...shadows.soft,
        shadowOpacity: 0,
        elevation: 0,
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    textPrimary: {
        color: colors.white,
    },
    textOutline: {
        color: colors.primary,
    }
});

export default Button;
