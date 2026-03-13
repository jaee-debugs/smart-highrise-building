import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { spacing } from '../theme/Theme';
import { AdminActionButton, AdminPanel, AdminPill, AdminScreen, adminColors } from '../components/AdminScaffold';
import {
  approveLostFound,
  closeLostFound,
  createEvent,
  createNotice,
  createPoll,
  deleteLostFound,
  getCommunityData
} from '../services/apiService';

const AdminCommunityScreen = () => {
  const [community, setCommunity] = useState({ notices: [], polls: [], events: [], lostFound: [] });
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option A', 'Option B']);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-03-20');
  const [eventLocation, setEventLocation] = useState('Clubhouse');

  const loadData = async () => {
    try {
      const data = await getCommunityData();
      setCommunity(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to load community module data.');
    }
  };

  useEffect(() => {
    loadData();

    // Keep poll result cards updated while admin stays on this screen.
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onCreateNotice = async () => {
    try {
      await createNotice({ title: noticeTitle, content: noticeBody, date: new Date().toISOString().split('T')[0] });
      setNoticeTitle('');
      setNoticeBody('');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Notice could not be created.');
    }
  };

  const onCreatePoll = async () => {
    try {
      const options = pollOptions.map((item) => item.trim()).filter(Boolean);
      if (!pollTitle.trim()) {
        Alert.alert('Validation', 'Poll title is required.');
        return;
      }
      if (options.length < 2) {
        Alert.alert('Validation', 'Add at least 2 options.');
        return;
      }

      await createPoll({ title: pollTitle.trim(), options });
      setPollTitle('');
      setPollOptions(['Option A', 'Option B']);
      loadData();
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Poll could not be created.');
    }
  };

  const updatePollOption = (index, value) => {
    const next = [...pollOptions];
    next[index] = value;
    setPollOptions(next);
  };

  const addPollOption = () => {
    setPollOptions((prev) => [...prev, `Option ${prev.length + 1}`]);
  };

  const removePollOption = (index) => {
    if (pollOptions.length <= 2) {
      Alert.alert('Validation', 'A poll needs at least 2 options.');
      return;
    }
    setPollOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const onCreateEvent = async () => {
    try {
      await createEvent({ title: eventTitle, date: eventDate, location: eventLocation });
      setEventTitle('');
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Event could not be created.');
    }
  };

  const onApproveLostFound = async (id) => {
    await approveLostFound(id);
    loadData();
  };

  const onCloseLostFound = async (id) => {
    await closeLostFound(id);
    loadData();
  };

  const onRemoveLostFound = async (id) => {
    await deleteLostFound(id);
    loadData();
  };

  return (
    <AdminScreen>
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>Community Management</Text>

      <AdminPanel style={styles.card}>
        <Text style={styles.sectionTitle}>Add Notice</Text>
        <TextInput style={styles.input} placeholder="Notice title" placeholderTextColor="rgba(225,236,247,0.5)" value={noticeTitle} onChangeText={setNoticeTitle} />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Notice details" placeholderTextColor="rgba(225,236,247,0.5)" value={noticeBody} onChangeText={setNoticeBody} multiline />
        <AdminActionButton title="Publish Notice" onPress={onCreateNotice} />
      </AdminPanel>

      <AdminPanel style={styles.card}>
        <Text style={styles.sectionTitle}>Create Poll</Text>
        <TextInput style={styles.input} placeholder="Poll title" placeholderTextColor="rgba(225,236,247,0.5)" value={pollTitle} onChangeText={setPollTitle} />
        {pollOptions.map((option, index) => (
          <View key={`poll-option-${index}`} style={styles.optionRow}>
            <TextInput
              style={[styles.input, styles.optionInput]}
              placeholder={`Option ${index + 1}`}
              placeholderTextColor="rgba(225,236,247,0.5)"
              value={option}
              onChangeText={(value) => updatePollOption(index, value)}
            />
            <AdminActionButton title="Remove" variant="outline" style={styles.optionButton} onPress={() => removePollOption(index)} />
          </View>
        ))}
        <AdminActionButton title="+ Add Option" variant="outline" onPress={addPollOption} />
        <AdminActionButton title="Create Poll" onPress={onCreatePoll} />
      </AdminPanel>

      <AdminPanel style={styles.card}>
        <Text style={styles.sectionTitle}>Live Poll Results</Text>
        {community.polls.length === 0 && <Text style={styles.lostDesc}>No polls yet.</Text>}
        {community.polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
          const safeTotal = totalVotes || 1;

          return (
            <View key={poll.id} style={styles.resultBlock}>
              <View style={styles.resultHead}>
                <Text style={styles.resultTitle}>{poll.title}</Text>
                <AdminPill text={`${totalVotes} Votes`} tone="success" />
              </View>

              {poll.options.map((option) => {
                const percent = Math.round((option.votes / safeTotal) * 100);
                return (
                  <View key={`${poll.id}-${option.text}`} style={styles.resultOption}>
                    <View style={styles.resultLabelRow}>
                      <Text style={styles.lostDesc}>{option.text}</Text>
                      <Text style={styles.lostDesc}>{option.votes} ({percent}%)</Text>
                    </View>
                    <View style={styles.resultBarBg}>
                      <View style={[styles.resultBarFill, { width: `${percent}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </AdminPanel>

      <AdminPanel style={styles.card}>
        <Text style={styles.sectionTitle}>Create Event</Text>
        <TextInput style={styles.input} placeholder="Event title" placeholderTextColor="rgba(225,236,247,0.5)" value={eventTitle} onChangeText={setEventTitle} />
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="rgba(225,236,247,0.5)" value={eventDate} onChangeText={setEventDate} />
        <TextInput style={styles.input} placeholder="Location" placeholderTextColor="rgba(225,236,247,0.5)" value={eventLocation} onChangeText={setEventLocation} />
        <AdminActionButton title="Create Event" onPress={onCreateEvent} />
      </AdminPanel>

      <AdminPanel style={styles.card}>
        <Text style={styles.sectionTitle}>Lost & Found Moderation</Text>
        {community.lostFound.map((item) => (
          <View key={item.id} style={styles.lostRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lostTitle}>{item.item}</Text>
              <Text style={styles.lostDesc}>{item.description}</Text>
              <Text style={styles.lostDesc}>Posted by: {item.createdBy || 'Resident'}</Text>
            </View>
            <View style={styles.lostActions}>
              <AdminPill text={item.status} tone={item.status === 'Approved' ? 'success' : item.status === 'Closed' ? 'error' : 'warning'} />
              {item.status === 'PendingApproval' && <AdminActionButton title="Approve" style={styles.smallBtn} onPress={() => onApproveLostFound(item.id)} />}
              {item.status === 'Approved' && <AdminActionButton title="Close" variant="outline" style={styles.smallBtn} onPress={() => onCloseLostFound(item.id)} />}
              <AdminActionButton title="Remove" variant="outline" style={styles.smallBtn} onPress={() => onRemoveLostFound(item.id)} />
            </View>
          </View>
        ))}
      </AdminPanel>
    </ScrollView>
    </AdminScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scroll: { padding: spacing.lg },
  pageTitle: { fontSize: 28, fontWeight: '800', color: adminColors.text, marginBottom: spacing.lg },
  card: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.sm, color: adminColors.text },
  input: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#09131D', color: adminColors.text, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: spacing.sm },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  optionInput: { flex: 1, marginRight: spacing.sm },
  optionButton: { minWidth: 86 },
  resultBlock: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: spacing.sm, marginBottom: spacing.sm },
  resultHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  resultTitle: { color: adminColors.text, fontSize: 14, fontWeight: '700' },
  resultOption: { marginTop: spacing.xs },
  resultLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  resultBarBg: { marginTop: 4, height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' },
  resultBarFill: { height: '100%', backgroundColor: '#11283A' },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  lostRow: { marginBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', paddingBottom: spacing.sm },
  lostActions: { marginTop: spacing.xs },
  lostTitle: { color: adminColors.text, fontSize: 14, fontWeight: '700' },
  lostDesc: { color: adminColors.subtext, fontSize: 12, marginBottom: spacing.xs },
  smallBtn: { marginTop: spacing.xs }
});

export default AdminCommunityScreen;
