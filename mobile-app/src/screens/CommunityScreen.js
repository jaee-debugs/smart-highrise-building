import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const NOTICES = [
    { id: '1', title: 'Fire Drill Scheduled', date: '2026-03-10', content: 'There will be a mandatory fire drill at 10 AM.' },
    { id: '2', title: 'Pool Maintenance', date: '2026-03-12', content: 'The community pool will be closed for cleaning.' },
];

const CommunityScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Community Notices</Text>
            <FlatList
                data={NOTICES}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text style={styles.content}>{item.content}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
    cardTitle: { fontSize: 18, fontWeight: '600' },
    date: { fontSize: 12, color: '#888', marginBottom: 8 },
    content: { fontSize: 14, color: '#444' }
});

export default CommunityScreen;
