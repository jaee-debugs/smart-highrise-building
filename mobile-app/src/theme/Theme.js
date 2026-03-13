export const colors = {
    primary: '#0A3B5C', // Deep Blue/Teal
    secondary: '#1C5B7D',
    accent: '#28A745', // Sustainability Green
    background: '#F4F7F6', // Light Background
    surface: '#FFFFFF',
    textDark: '#1E2A32',
    textLight: '#7A8C99',
    white: '#FFFFFF',
    error: '#DC3545',
    warning: '#FFC107',
    success: '#28A745',
};

export const typography = {
    header: { fontSize: 24, fontWeight: 'bold', color: colors.textDark },
    title: { fontSize: 18, fontWeight: '600', color: colors.textDark },
    body: { fontSize: 14, color: colors.textDark },
    caption: { fontSize: 12, color: colors.textLight },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const shadows = {
    soft: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }
};
