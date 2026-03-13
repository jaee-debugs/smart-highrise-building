import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, typography, spacing } from '../theme/Theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { login } from '../services/apiService';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (role) => {
        // For demonstration, simply redirecting based on role selected if no input is provided
        if (!username || !password) {
            navigation.replace(role === 'Admin' ? 'AdminDashboard' : 'ResidentDashboard');
            return;
        }

        setLoading(true);
        try {
            const data = await login(username, password);
            if (data.role === 'Admin') {
                navigation.replace('AdminDashboard');
            } else {
                navigation.replace('ResidentDashboard');
            }
        } catch (error) {
            Alert.alert('Login Failed', 'Please use "admin/admin" or "resident/resident"');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Smart High-Rise</Text>
                    <Text style={styles.subtitle}>Future Living Ecosystem</Text>
                </View>

                <Card style={styles.card}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username (e.g. resident / admin)"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Login as Resident"
                            onPress={() => handleLogin('Resident')}
                            loading={loading}
                            style={{ marginBottom: spacing.sm }}
                        />
                        <Button
                            title="Login as Admin"
                            variant="secondary"
                            onPress={() => handleLogin('Admin')}
                            loading={loading}
                        />
                    </View>
                </Card>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl * 1.5,
    },
    title: {
        ...typography.header,
        fontSize: 32,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.accent,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        padding: spacing.xl,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.body,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E1E8EE',
        color: colors.textDark,
    },
    buttonContainer: {
        marginTop: spacing.md,
    }
});

export default LoginScreen;
