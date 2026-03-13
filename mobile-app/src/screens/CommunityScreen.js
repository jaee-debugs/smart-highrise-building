import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme/Theme';
import Button from '../components/Button';
import { MatteScreen, MattePanel } from '../components/MatteScaffold';
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
    return <ActivityIndicator style={{ flex: 1, backgroundColor: '#08111A' }} size="large" color={colors.white} />;
  }

  return (
    <MatteScreen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Community Hub</Text>

        <Text style={styles.sectionHeader}>Important Notices</Text>
        {community.notices.map((notice) => (
          <MattePanel key={notice.id} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.noticeTag}><Text style={styles.noticeText}>NOTICE</Text></View>
              <Text style={styles.date}>{notice.date}</Text>
            </View>
            <Text style={styles.title}>{notice.title}</Text>
            <Text style={styles.body}>{notice.content}</Text>
          </MattePanel>
        ))}

        <Text style={styles.sectionHeader}>Active Polls</Text>
        {community.polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, item) => sum + item.votes, 0) || 1;
          const voted = Array.isArray(poll.voters) && poll.voters.includes(residentId);
          return (
            <MattePanel key={poll.id} style={styles.card}>
              <Text style={styles.title}>{poll.title}</Text>
              {voted && <View style={[styles.statusPill, styles.successPill, { marginBottom: spacing.sm }]}><Text style={styles.statusText}>VOTED</Text></View>}
              {poll.options.map((option, index) => {
                const percent = Math.round((option.votes / totalVotes) * 100);
                const isWinning = option.votes === Math.max(...poll.options.map((item) => item.votes));
                return (
                  <View key={`${poll.id}-${option.text}`} style={styles.pollOption}>
                    <Text style={styles.pollLabel}>{option.text} ({percent}%)</Text>
                    <View style={styles.pollBarBg}><View style={[styles.pollBarFill, isWinning ? styles.pollBarWinning : styles.pollBarDefault, { width: `${percent}%` }]} /></View>
                    <Button
                      title={voted ? 'Vote Recorded' : 'Vote'}
                      variant="outline"
                      style={styles.voteBtn}
                      textStyle={styles.actionText}
                      onPress={() => onVote(poll.id, index)}
                      disabled={voted}
                    />
                  </View>
                );
              })}
            </MattePanel>
          );
        })}

        <Text style={styles.sectionHeader}>Upcoming Events</Text>
        {community.events.map((event) => (
          <MattePanel key={event.id} style={styles.card}>
            <View style={styles.head}>
              <Text style={styles.title}>{event.title}</Text>
              <View style={styles.statusPill}><Text style={styles.statusText}>RSVP</Text></View>
            </View>
            <Text style={styles.body}>{event.location} • {event.date}</Text>
          </MattePanel>
        ))}

        <Text style={styles.sectionHeader}>Lost & Found - Post Item</Text>
        <MattePanel style={styles.card}>
          <View style={styles.toggleRow}>
            <Button title="Lost" style={[styles.toggleBtn, itemType === 'Lost' && styles.primaryToggle]} textStyle={styles.actionText} variant={itemType === 'Lost' ? 'primary' : 'outline'} onPress={() => setItemType('Lost')} />
            <Button title="Found" style={[styles.toggleBtn, itemType === 'Found' && styles.primaryToggle]} textStyle={styles.actionText} variant={itemType === 'Found' ? 'primary' : 'outline'} onPress={() => setItemType('Found')} />
          </View>
          <TextInput style={styles.input} placeholder="Item name" placeholderTextColor="rgba(236,244,250,0.62)" value={itemName} onChangeText={setItemName} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Description / where seen" placeholderTextColor="rgba(236,244,250,0.62)" value={itemDesc} onChangeText={setItemDesc} multiline />
          <Button title="Submit for Admin Approval" onPress={onPostLostFound} style={styles.anchorButton} textStyle={styles.actionText} />
        </MattePanel>

        <Text style={styles.sectionHeader}>Public Lost & Found (Approved)</Text>
        {publicLostFound.map((item) => (
          <MattePanel key={item.id} style={styles.card}>
            <View style={styles.head}>
              <Text style={styles.title}>{item.item}</Text>
              <View style={[styles.statusPill, item.status === 'Approved' ? styles.successPill : styles.warningPill]}><Text style={styles.statusText}>{item.status}</Text></View>
            </View>
            <Text style={styles.body}>{item.description}</Text>
          </MattePanel>
        ))}
      </ScrollView>
    </MatteScreen>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#F4F8FB', marginBottom: spacing.xl },
  sectionHeader: { fontSize: 20, fontWeight: '700', color: '#F3F8FC', marginBottom: spacing.sm },
  card: { marginBottom: spacing.xl, padding: spacing.lg },
  head: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  date: { fontSize: 12, color: 'rgba(236,244,250,0.72)' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#F4F8FB', marginBottom: spacing.xs },
  body: { fontSize: 14, color: 'rgba(236,244,250,0.72)' },
  pollOption: { marginTop: spacing.md },
  pollLabel: { fontSize: 14, marginBottom: 4, color: '#FFFFFF' },
  pollBarBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5 },
  pollBarFill: { height: 10, borderRadius: 5 },
  pollBarWinning: { backgroundColor: '#11283A' },
  pollBarDefault: { backgroundColor: '#2D6A4F' },
  voteBtn: { paddingVertical: 8, marginTop: spacing.xs, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  toggleBtn: { width: '48%', backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  primaryToggle: { backgroundColor: '#11283A' },
  input: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: spacing.sm, color: '#FFFFFF' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  noticeTag: { backgroundColor: '#B88A24', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  noticeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  statusPill: { backgroundColor: 'rgba(8,16,24,0.88)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  successPill: { backgroundColor: '#2D6A4F' },
  warningPill: { backgroundColor: '#8A6A23' },
  statusText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  anchorButton: { backgroundColor: '#11283A', borderColor: 'rgba(255,255,255,0.1)', shadowOpacity: 0, elevation: 0 },
  actionText: { color: '#FFFFFF' }
});

export default CommunityScreen;
