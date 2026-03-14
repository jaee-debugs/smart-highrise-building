import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';

const ADMIN_BG = 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80';

export const adminColors = {
  obsidian: 'rgba(5, 15, 25, 0.95)',
  obsidianSoft: 'rgba(10, 22, 35, 0.92)',
  panelBorder: 'rgba(255,255,255,0.1)',
  commandGreen: '#00FF41',
  crimson: '#9B2226',
  warning: '#8A6A23',
  text: '#F5FAFF',
  subtext: 'rgba(225,236,247,0.72)',
  muted: 'rgba(255,255,255,0.08)',
  input: 'rgba(0,0,0,0.24)',
};

export const AdminScreen = ({ children, contentStyle }) => (
  <ImageBackground source={{ uri: ADMIN_BG }} style={styles.background} resizeMode="cover">
    <View style={styles.overlay} />
    <SafeAreaView style={[styles.safeArea, contentStyle]}>{children}</SafeAreaView>
  </ImageBackground>
);

export const AdminPanel = ({ children, style, sharp = false, onPress }) => {
  const Wrapper = onPress ? Pressable : View;
  if (Platform.OS === 'web') {
    return <Wrapper style={[styles.webPanel, sharp && styles.sharpPanel, style]} onPress={onPress}>{children}</Wrapper>;
  }

  if (onPress) {
    return (
      <Wrapper onPress={onPress} style={style}>
        <BlurView intensity={sharp ? 12 : 10} tint="dark" style={[styles.nativePanel, sharp && styles.sharpPanel, styles.pressableFill]}>
          {children}
        </BlurView>
      </Wrapper>
    );
  }

  return (
    <BlurView intensity={sharp ? 12 : 10} tint="dark" style={[styles.nativePanel, sharp && styles.sharpPanel, style]}>
      {children}
    </BlurView>
  );
};

export const LivePanel = ({ children, style, critical = false }) => {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.7, duration: 1800, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0.35, duration: 1800, useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const borderColor = critical
    ? adminColors.crimson
    : pulse.interpolate({
        inputRange: [0.35, 0.7],
        outputRange: ['rgba(0,255,65,0.22)', 'rgba(0,255,65,0.48)'],
      });

  return (
    <Animated.View style={[styles.liveWrap, { borderColor }, critical && styles.criticalBorder, style]}>
      <AdminPanel sharp>{children}</AdminPanel>
    </Animated.View>
  );
};

export const AdminPill = ({ text, tone = 'neutral', style }) => {
  const backgroundColor =
    tone === 'success'
      ? adminColors.commandGreen
      : tone === 'error'
        ? adminColors.crimson
        : tone === 'warning'
          ? adminColors.warning
          : 'rgba(255,255,255,0.08)';

  const textColor = tone === 'success' ? '#04110B' : '#FFFFFF';

  return (
    <View style={[styles.pill, { backgroundColor }, style]}>
      <Text style={[styles.pillText, { color: textColor }]}>{text}</Text>
    </View>
  );
};

export const StatusLED = ({ online = true }) => (
  <View style={[styles.led, { backgroundColor: online ? adminColors.commandGreen : adminColors.crimson }]} />
);

export const SegmentedBar = ({ value = 0, segments = 18, tone = 'success' }) => {
  const activeCount = Math.round((Math.max(0, Math.min(100, value)) / 100) * segments);
  const segmentColor = tone === 'error' ? adminColors.crimson : tone === 'warning' ? adminColors.warning : adminColors.commandGreen;

  return (
    <View style={styles.segmentedRow}>
      {Array.from({ length: segments }).map((_, index) => (
        <View
          key={`seg-${index}`}
          style={[
            styles.segment,
            { backgroundColor: index < activeCount ? segmentColor : 'rgba(255,255,255,0.08)' },
          ]}
        />
      ))}
    </View>
  );
};

export const AdminActionButton = ({ title, onPress, variant = 'solid', style, textStyle, disabled = false }) => (
  <Pressable onPress={disabled ? undefined : onPress} style={[styles.actionWrap, style, disabled && styles.disabled]}>
    <Text style={[styles.actionButton, variant === 'outline' ? styles.outlineAction : styles.solidAction, textStyle]}>
      {title}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#030912' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(3,9,15,0.62)' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  webPanel: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: adminColors.panelBorder,
    backgroundColor: adminColors.obsidian,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 45px rgba(0,0,0,0.34)',
  },
  nativePanel: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: adminColors.panelBorder,
    backgroundColor: adminColors.obsidian,
    overflow: 'hidden',
  },
  pressableFill: {
    width: '100%',
  },
  sharpPanel: {
    borderRadius: 16,
  },
  liveWrap: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 1,
  },
  criticalBorder: {
    borderColor: adminColors.crimson,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  led: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  segment: {
    flex: 1,
    height: 14,
    borderRadius: 3,
  },
  actionWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#102131',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 0,
  },
  solidAction: {
    backgroundColor: '#102131',
    color: adminColors.text,
  },
  outlineAction: {
    backgroundColor: 'transparent',
    color: adminColors.text,
  },
  actionButton: {
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '700',
  },
  disabled: { opacity: 0.5 },
});

export default AdminScreen;