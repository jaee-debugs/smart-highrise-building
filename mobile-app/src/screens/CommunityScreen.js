import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { colors, spacing, typography } from '../theme/Theme';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { createLostFoundPost, getCommunityData, getPublicLostFoundPosts, votePoll } from '../services/apiService';

const CommunityScreen = () => {
  const residentId = 'Resident-A101';
  const [community, setCommunity] = useState(null);
  const [publicLostFound, setPublicLostFound] = useState([]);
  const [itemType, setItemType] = useState('Lost');
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');

  const loadData = async () => {
    try {
      const [communityData, publicPosts] = await Promise.all([
        getCommunityData(),
        getPublicLostFoundPosts()
      ]);
      setCommunity(communityData);
      setPublicLostFound(publicPosts);
    } catch (error) {
      setCommunity({ notices: [], polls: [], events: [], lostFound: [] });
      setPublicLostFound([]);
    }
  };

  useEffect(() => {
    loadData();

    // Keep poll percentages fresh across active users.
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onVote = async (pollId, optionIndex) => {
    try {
      await votePoll(pollId, optionIndex, 'Resident-A101');
      loadData();
    } catch (error) {
      Alert.alert('Vote Failed', error?.response?.data?.message || 'Unable to submit vote.');
    }
  };

  const onPostLostFound = async () => {
    if (!itemName.trim() || !itemDesc.trim()) {
      Alert.alert('Missing details', 'Please fill item and description.');
      return;
    }

    try {
      await createLostFoundPost({
        item: `${itemType}: ${itemName}`,
        description: itemDesc,
        createdBy: 'Resident-A101'
      });
      setItemName('');
      setItemDesc('');
      Alert.alert('Submitted', 'Post sent to admin for approval.');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Unable to submit lost & found post.');
    }
  };

  if (!community) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Community Hub</Text>

        <Text style={styles.sectionHeader}>Important Notices</Text>
        {community.notices.map((notice) => (
          <Card key={notice.id} style={styles.card}>
            <View style={styles.head}>
              <Badge text="Notice" status="warning" />
              <Text style={styles.date}>{notice.date}</Text>
            </View>
            <Text style={styles.title}>{notice.title}</Text>
            <Text style={styles.body}>{notice.content}</Text>
          </Card>
        ))}

        <Text style={styles.sectionHeader}>Active Polls</Text>
        {community.polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, item) => sum + item.votes, 0) || 1;
          const voted = Array.isArray(poll.voters) && poll.voters.includes(residentId);
          return (
            <Card key={poll.id} style={styles.card}>
              <Text style={styles.title}>{poll.title}</Text>
              {voted && <Badge text="Voted" status="success" style={{ marginBottom: spacing.sm }} />}
              {poll.options.map((option, index) => {
                const percent = Math.round((option.votes / totalVotes) * 100);
                return (
                  <View key={`${poll.id}-${option.text}`} style={styles.pollOption}>
                    <Text style={styles.pollLabel}>{option.text} ({percent}%)</Text>
                    <View style={styles.pollBarBg}><View style={[styles.pollBarFill, { width: `${percent}%` }]} /></View>
                    <Button
                      title={voted ? 'Vote Recorded' : 'Vote'}
                      variant="outline"
                      style={styles.voteBtn}
                      onPress={() => onVote(poll.id, index)}
                      disabled={voted}
                    />
                  </View>
                );
              })}
            </Card>
          );
        })}

        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        {community.events.map((event) => (
          <Card key={event.id} style={styles.card}>
            <View style={styles.head}>
              <Text style={styles.title}>{event.title}</Text>
              <Badge text="RSVP" />
            </View>
            <Text style={styles.body}>{event.location} • {event.date}</Text>
          </Card>
        ))}

        <Text style={styles.sectionHeader}>Lost & Found - Post Item</Text>
        <Card style={styles.card}>
          <View style={styles.toggleRow}>
            <Button title="Lost" style={styles.toggleBtn} variant={itemType === 'Lost' ? 'primary' : 'outline'} onPress={() => setItemType('Lost')} />
            <Button title="Found" style={styles.toggleBtn} variant={itemType === 'Found' ? 'primary' : 'outline'} onPress={() => setItemType('Found')} />
          </View>
          <TextInput style={styles.input} placeholder="Item name" value={itemName} onChangeText={setItemName} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Description / where seen" value={itemDesc} onChangeText={setItemDesc} multiline />
          <Button title="Submit for Admin Approval" onPress={onPostLostFound} />
        </Card>

        <Text style={styles.sectionHeader}>Public Lost & Found (Approved)</Text>
        {publicLostFound.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.head}>
              <Text style={styles.title}>{item.item}</Text>
              <Badge text={item.status} status={item.status === 'Approved' ? 'success' : 'warning'} />
            </View>
            <Text style={styles.body}>{item.description}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  pageTitle: { ...typography.header, color: colors.primary, marginBottom: spacing.xl },
  sectionHeader: { ...typography.title, color: colors.textDark, marginBottom: spacing.sm },
  card: { marginBottom: spacing.xl, padding: spacing.lg },
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  date: { ...typography.caption },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: spacing.xs },
  body: { ...typography.body, color: colors.textLight },
  pollOption: { marginTop: spacing.md },
  pollLabel: { ...typography.body, marginBottom: 4 },
  pollBarBg: { height: 10, backgroundColor: '#E0E0E0', borderRadius: 5 },
  pollBarFill: { height: 10, backgroundColor: colors.primary, borderRadius: 5 },
  voteBtn: { paddingVertical: 8, marginTop: spacing.xs },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  toggleBtn: { width: '48%' },
  input: { borderWidth: 1, borderColor: '#D6E0E8', backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: spacing.sm },
  textArea: { minHeight: 80, textAlignVertical: 'top' }
});

export default CommunityScreen;
