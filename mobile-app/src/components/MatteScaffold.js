import React from 'react';
import { ImageBackground, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';

const MATTE_BG = 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80';

export const MatteScreen = ({ children, contentStyle }) => (
  <ImageBackground source={{ uri: MATTE_BG }} style={styles.background} resizeMode="cover">
    <View style={styles.overlay} />
    <SafeAreaView style={[styles.safeArea, contentStyle]}>{children}</SafeAreaView>
  </ImageBackground>
);

export const MattePanel = ({ children, style, intensity = 28 }) => {
  if (Platform.OS === 'web') {
    return <View style={[styles.webPanel, style]}>{children}</View>;
  }

  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.nativePanel, style]}>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#08111A',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5,11,18,0.48)',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webPanel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15, 35, 50, 0.7)',
    backdropFilter: 'blur(28px)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.28)',
  },
  nativePanel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15, 35, 50, 0.7)',
    overflow: 'hidden',
  },
});

export default MatteScreen;