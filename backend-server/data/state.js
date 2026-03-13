const waterTanks = [
  { id: 'A-GT', tower: 'Tower A', floor: 'Ground', tankName: 'Main Ground Tank', level: 82 },
  { id: 'A-15', tower: 'Tower A', floor: '15', tankName: 'Upper Tank 15', level: 64 },
  { id: 'A-30', tower: 'Tower A', floor: '30', tankName: 'Upper Tank 30', level: 42 },
  { id: 'B-GT', tower: 'Tower B', floor: 'Ground', tankName: 'Main Ground Tank', level: 75 },
  { id: 'B-15', tower: 'Tower B', floor: '15', tankName: 'Upper Tank 15', level: 28 },
  { id: 'B-30', tower: 'Tower B', floor: '30', tankName: 'Upper Tank 30', level: 16 }
];

const energy = {
  totalPiezoEnergyKwh: 1280,
  greenPoints: 3420,
  towerConsumptionKwh: [
    { tower: 'Tower A', value: 420 },
    { tower: 'Tower B', value: 380 },
    { tower: 'Tower C', value: 310 }
  ],
  dailyTrend: [
    { day: 'Mon', generated: 42, consumed: 110 },
    { day: 'Tue', generated: 49, consumed: 118 },
    { day: 'Wed', generated: 53, consumed: 120 },
    { day: 'Thu', generated: 47, consumed: 114 },
    { day: 'Fri', generated: 58, consumed: 126 },
    { day: 'Sat', generated: 62, consumed: 129 },
    { day: 'Sun', generated: 56, consumed: 121 }
  ],
  monthlyTrend: [
    { month: 'Jan', generated: 1120, consumed: 3380 },
    { month: 'Feb', generated: 1180, consumed: 3450 },
    { month: 'Mar', generated: 1280, consumed: 3520 }
  ]
};

const infra = {
  powerConsumptionKw: 185,
  generator: { status: 'Standby', fuelPercent: 76, runtimeHours: 210 },
  lifts: [
    { id: 'A-L1', health: 'Healthy', alert: '' },
    { id: 'A-L2', health: 'Warning', alert: 'Door sensor lag detected' },
    { id: 'B-L1', health: 'Critical', alert: 'Brake temperature high' }
  ],
  fireSystem: [
    { id: 'FS-A1', severity: 'Normal', message: 'All zones clear' },
    { id: 'FS-B3', severity: 'Alert', message: 'Smoke detector maintenance due' }
  ]
};

const parkingSlots = [
  { slotId: 'A1', status: 'Available' },
  { slotId: 'A2', status: 'Occupied' },
  { slotId: 'A3', status: 'Disabled' },
  { slotId: 'B1', status: 'Available' },
  { slotId: 'B2', status: 'Occupied' },
  { slotId: 'B3', status: 'Available' }
];

const evStations = [
  { id: 'EV1', status: 'Available', currentBooking: null },
  { id: 'EV2', status: 'Occupied', currentBooking: 'Resident-A101' },
  { id: 'EV3', status: 'Maintenance', currentBooking: null }
];

const community = {
  notices: [
    { id: 1, title: 'Annual General Meeting', date: '2026-03-20', content: 'Meeting at clubhouse 7 PM.' }
  ],
  polls: [
    {
      id: 1,
      title: 'Weekend Cultural Event Theme',
      options: [
        { text: 'Music Night', votes: 10 },
        { text: 'Food Festival', votes: 7 }
      ]
    }
  ],
  events: [
    { id: 1, title: 'Yoga Session', date: '2026-03-18', location: 'Terrace Deck' }
  ],
  lostFound: [
    {
      id: 1,
      item: 'Car Keychain',
      description: 'Found near Tower B lobby',
      status: 'PendingApproval'
    }
  ]
};

const visitors = [
  {
    id: 1,
    name: 'John Doe',
    type: 'Delivery',
    status: 'Expected',
    date: '2026-03-13',
    time: '14:00',
    tower: 'Tower A'
  }
];

const visitorPasses = [];
const visitorEntryLogs = [];
const blockedEntries = [];

const cctvCameras = [
  { id: 'CAM-ENT-1', area: 'Main Entrance', status: 'Online' },
  { id: 'CAM-PRK-1', area: 'Basement Parking', status: 'Online' },
  { id: 'CAM-LOB-A', area: 'Tower A Lobby', status: 'Online' },
  { id: 'CAM-LOB-B', area: 'Tower B Lobby', status: 'Offline' },
  { id: 'CAM-ELV-A1', area: 'Tower A Elevator', status: 'Online' },
  { id: 'CAM-ELV-B1', area: 'Tower B Elevator', status: 'Online' }
];

const maintenanceRequests = [
  {
    id: 1,
    issue: 'Leaking Pipe',
    location: 'Tower A 101',
    status: 'Pending',
    reportedOn: '2026-03-12',
    requestedBy: 'Resident-A101'
  },
  {
    id: 2,
    issue: 'Elevator Sound',
    location: 'Tower B Lift 1',
    status: 'Resolved',
    reportedOn: '2026-03-11',
    requestedBy: 'Resident-B204'
  }
];

const emergencies = [];

const getWaterStatus = (level) => {
  if (level < 20) return 'Critical';
  if (level < 40) return 'Low';
  return 'Normal';
};

const nextId = (items) => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);

module.exports = {
  waterTanks,
  energy,
  infra,
  parkingSlots,
  evStations,
  community,
  visitors,
  visitorPasses,
  visitorEntryLogs,
  blockedEntries,
  cctvCameras,
  maintenanceRequests,
  emergencies,
  getWaterStatus,
  nextId
};
