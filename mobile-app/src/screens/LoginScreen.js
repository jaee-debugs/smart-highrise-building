import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { spacing } from '../theme/Theme';
import { login } from '../services/apiService';

const BG_IMAGE = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80';

const GlowButton = ({ title, onPress, variant, loading }) => {
    const [hovered, setHovered] = useState(false);
    const isResident = variant === 'resident';

    return (
        <Pressable
            onPress={onPress}
            disabled={loading}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            style={[
                styles.actionButton,
                isResident ? styles.residentBtn : styles.adminBtn,
                hovered && (isResident ? styles.residentGlow : styles.adminGlow),
            ]}
        >
            {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.actionText}>{title}</Text>}
        </Pressable>
    );
};

const FrostedPanel = ({ children, style }) => {
    if (Platform.OS === 'web') {
        return <View style={[styles.webFrosted, style]}>{children}</View>;
    }

    return (
        <BlurView intensity={22} tint="light" style={[styles.nativeFrosted, style]}>
            {children}
        </BlurView>
    );
};

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold, Inter_800ExtraBold });

    if (!fontsLoaded) {
        return <View style={styles.loader}><ActivityIndicator size="large" color="#D8ECFF" /></View>;
    }

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
            const normalizedUser = String(username).trim().toLowerCase();
            const normalizedPass = String(password).trim().toLowerCase();
            const residentUsernames = ['resident', 'resident-a101', 'resident a101'];

            // Offline/mobile fallback keeps demo login usable even if backend URL is unreachable.
            if (role === 'Resident' && residentUsernames.includes(normalizedUser) && normalizedPass === 'resident') {
                navigation.replace('ResidentDashboard');
                return;
            }

            if (role === 'Admin' && normalizedUser === 'admin' && normalizedPass === 'admin') {
                navigation.replace('AdminDashboard');
                return;
            }

            Alert.alert('Login Failed', 'Use admin/admin or resident/resident');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground source={{ uri: BG_IMAGE }} style={styles.bg} resizeMode="cover">
            <View style={styles.dimOverlay} />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                    <FrostedPanel style={styles.headerPanel}>
                        <Text style={styles.title}>Smart High-Rise</Text>
                        <Text style={styles.subtitle}>Future Living Ecosystem</Text>
                    </FrostedPanel>

                    <FrostedPanel style={styles.card}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputShell}>
                                <Text style={styles.iconText}>U</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter username (e.g. resident / admin)"
                                    placeholderTextColor="rgba(225,240,255,0.72)"
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputShell}>
                                <Text style={styles.iconText}>P</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextColor="rgba(225,240,255,0.72)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <GlowButton title="Login as Resident" onPress={() => handleLogin('Resident')} loading={loading} variant="resident" />
                            <GlowButton title="Login as Admin" onPress={() => handleLogin('Admin')} loading={loading} variant="admin" />
                        </View>

                        <Text style={styles.forgot}>Forgot Password?</Text>
                    </FrostedPanel>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0C1C2F',
    },
    bg: {
        flex: 1,
    },
    dimOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(8,18,34,0.46)',
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    webFrosted: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.34)',
        backgroundColor: 'rgba(196,219,246,0.18)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
    },
    nativeFrosted: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.34)',
        backgroundColor: 'rgba(196,219,246,0.16)',
        overflow: 'hidden',
    },
    headerPanel: {
        alignItems: 'center',
        marginBottom: spacing.md,
        width: '100%',
        maxWidth: 520,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    title: {
        fontFamily: 'Inter_800ExtraBold',
        fontSize: 44,
        color: '#0E2B49',
        letterSpacing: 0.4,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Inter_700Bold',
        marginTop: spacing.xs,
        color: '#4DE252',
        textTransform: 'uppercase',
        letterSpacing: 1.3,
        fontSize: 16,
    },
    card: {
        width: '100%',
        maxWidth: 520,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.md,
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 15,
        color: '#E7F0FB',
        marginBottom: spacing.xs,
    },
    inputShell: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.42)',
        backgroundColor: 'rgba(255,255,255,0.12)',
        minHeight: 50,
        paddingHorizontal: spacing.md,
    },
    iconText: {
        fontFamily: 'Inter_700Bold',
        color: '#E7F0FB',
        fontSize: 14,
        width: 20,
    },
    input: {
        fontFamily: 'Inter_400Regular',
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: spacing.sm,
    },
    buttonContainer: {
        marginTop: spacing.md,
    },
    actionButton: {
        minHeight: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.xs,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
    },
    actionText: {
        fontFamily: 'Inter_700Bold',
        color: '#FFFFFF',
        fontSize: 17,
    },
    residentBtn: {
        backgroundColor: '#0A2F5A',
    },
    adminBtn: {
        backgroundColor: '#0D8B3F',
    },
    residentGlow: {
        shadowColor: '#2E8BFF',
        shadowOpacity: 0.55,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
    },
    adminGlow: {
        shadowColor: '#29D668',
        shadowOpacity: 0.55,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 0 },
        elevation: 8,
    },
    forgot: {
        fontFamily: 'Inter_400Regular',
        marginTop: spacing.md,
        textAlign: 'center',
        color: '#E6D2AA',
        textDecorationLine: 'underline',
        fontSize: 15,
    },
});

export default LoginScreen;
