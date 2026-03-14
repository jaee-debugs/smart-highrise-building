import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEV_MACHINE_IP = '192.168.0.101';

const getApiBaseUrls = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.expoConfig?.extra?.apiHost;

  const detectedHost = hostUri ? hostUri.split(':')[0] : null;
  const candidates = [];

  if (detectedHost && detectedHost !== 'localhost' && detectedHost !== '127.0.0.1') {
    candidates.push(`http://${detectedHost}:5000/api`);
  }

  if (Platform.OS === 'android') {
    candidates.push(`http://${DEV_MACHINE_IP}:5000/api`);
    candidates.push('http://10.0.2.2:5000/api');
  } else {
    candidates.push('http://localhost:5000/api');
    candidates.push(`http://${DEV_MACHINE_IP}:5000/api`);
  }

  return [...new Set(candidates)];
};

const API_BASE_URLS = getApiBaseUrls();

const api = axios.create({
  baseURL: API_BASE_URLS[0],
  timeout: 8000,
});

const request = async (fn, message, options = {}) => {
  const { suppressErrorLog = false } = options;
  const baseUrls = [api.defaults.baseURL, ...API_BASE_URLS.filter((url) => url !== api.defaults.baseURL)].filter(Boolean);
  let lastError;

  for (const baseURL of baseUrls) {
    try {
      api.defaults.baseURL = baseURL;
      const response = await fn();
      return response.data;
    } catch (error) {
      lastError = error;
      if (error?.response) {
        break;
      }
    }
  }

  if (!suppressErrorLog) {
    console.error(message, lastError?.response?.data || lastError?.message);
  }
  throw lastError;
};

export const login = (username, password, options = {}) =>
  request(() => api.post('/auth/login', { username, password }), 'Error logging in', options);

export const getWaterLevels = () => request(() => api.get('/water'), 'Error fetching water levels');
export const updateWaterLevel = (id, payload) =>
  request(() => api.put(`/water/${id}`, payload), 'Error updating water level');

export const getEnergyData = () => request(() => api.get('/energy'), 'Error fetching energy data');

export const getParkingStatus = () => request(() => api.get('/parking'), 'Error fetching parking status');
export const updateParkingStatus = (slotId, status) =>
  request(() => api.put(`/parking/${slotId}`, { status }), 'Error updating parking slot');

export const getInfraStatus = () => request(() => api.get('/admin/infra'), 'Error fetching infra status', { suppressErrorLog: true });
export const updateGeneratorStatus = (payload) =>
  request(() => api.put('/admin/infra/generator', payload), 'Error updating generator');
export const resolveEmergency = (id) =>
  request(() => api.put(`/admin/emergencies/${id}/resolve`), 'Error resolving emergency');

export const triggerEmergencySOS = (payload) =>
  request(() => api.post('/admin/emergency', payload), 'Error triggering SOS');
export const getEmergencyEvents = (sinceId = 0) =>
  request(() => api.get(`/admin/emergencies?sinceId=${sinceId}`), 'Error fetching emergency events', { suppressErrorLog: true });

export const getEVStations = () => request(() => api.get('/charging'), 'Error fetching EV stations');
export const updateEVStation = (id, status, currentBooking = null) =>
  request(() => api.put(`/charging/${id}`, { status, currentBooking }), 'Error updating EV station');
export const resetEVStations = () => request(() => api.post('/charging/reset'), 'Error resetting EV stations');
export const bookEVStation = (stationId, user) =>
  request(() => api.post('/charging/book', { stationId, user }), 'Error booking EV station');

export const getCommunityData = () => request(() => api.get('/community'), 'Error fetching community data');
export const createNotice = (payload) =>
  request(() => api.post('/community/notices', payload), 'Error creating notice');
export const updateNotice = (id, payload) =>
  request(() => api.put(`/community/notices/${id}`, payload), 'Error updating notice');
export const createPoll = (payload) => request(() => api.post('/community/polls', payload), 'Error creating poll');
export const createEvent = (payload) =>
  request(() => api.post('/community/events', payload), 'Error creating event');
export const approveLostFound = (id) =>
  request(() => api.put(`/community/lost-found/${id}/approve`), 'Error approving lost & found post');
export const deleteLostFound = (id) =>
  request(() => api.delete(`/community/lost-found/${id}`), 'Error deleting lost & found post');

export const getVisitors = () => request(() => api.get('/visitor'), 'Error fetching visitors');
export const getCCTVFeeds = () => request(() => api.get('/visitor/cctv'), 'Error fetching CCTV feeds');
export const getVisitorEntryLogs = () => request(() => api.get('/visitor/entry-logs'), 'Error fetching visitor entry logs');
export const blockUnauthorizedEntry = (token, reason) =>
  request(() => api.post('/visitor/block', { token, reason }), 'Error blocking unauthorized entry');
export const createVisitorPass = (payload) =>
  request(() => api.post('/visitor/passes', payload), 'Error creating visitor pass');
export const getVisitorPasses = () => request(() => api.get('/visitor/passes'), 'Error fetching visitor passes');
export const verifyVisitorPass = (passToken) =>
  request(() => api.post('/visitor/verify', { passToken }), 'Error verifying visitor pass');
export const decideVisitorPass = (id, decision) =>
  request(() => api.put(`/visitor/passes/${id}/decision`, { decision }), 'Error deciding visitor pass');

export const getMaintenanceRequests = () =>
  request(() => api.get('/maintenance'), 'Error fetching maintenance requests');
export const createMaintenanceRequest = (payload) =>
  request(() => api.post('/maintenance', payload), 'Error creating maintenance request');
export const updateMaintenanceRequest = (id, payload) =>
  request(() => api.put(`/maintenance/${id}`, payload), 'Error updating maintenance request');

export const votePoll = (pollId, optionIndex, voterId) =>
  request(() => api.post(`/community/polls/${pollId}/vote`, { optionIndex, voterId }), 'Error voting poll');
export const createLostFoundPost = (payload) =>
  request(() => api.post('/community/lost-found', payload), 'Error creating lost & found post');
export const getPublicLostFoundPosts = () =>
  request(() => api.get('/community/lost-found/public'), 'Error fetching public lost & found posts');
export const closeLostFound = (id) =>
  request(() => api.put(`/community/lost-found/${id}/close`), 'Error closing lost & found post');

export const getSustainabilityData = (residentId = 'Resident-A101') =>
  request(() => api.get(`/sustainability?residentId=${encodeURIComponent(residentId)}`), 'Error fetching sustainability data');

export const addSustainabilitySteps = (residentId, steps) =>
  request(() => api.post('/sustainability/add-steps', { residentId, steps }), 'Error updating sustainability steps');

export const getSustainabilityLeaderboard = () =>
  request(() => api.get('/sustainability/leaderboard'), 'Error fetching sustainability leaderboard');
