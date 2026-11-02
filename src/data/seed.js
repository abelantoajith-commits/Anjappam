/**
 * Seed data for Anjappam
 * Generates dynamic dates relative to today so seed items are always fresh and active.
 */

// Helper to format date as YYYY-MM-DD
function getRelativeDateStr(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// SHA-256 hash for password 'demo1234'
const DEMO_PASSWORD_HASH = '0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d';

export function getInitialSeedData() {
  const today = getRelativeDateStr(0);
  const tomorrow = getRelativeDateStr(1);
  const dayAfter = getRelativeDateStr(2);
  const threeDays = getRelativeDateStr(3);

  const users = [
    {
      id: 'usr_donor_1',
      institutionName: 'Malabar Palace Caterers',
      contactName: 'Thomas Mathew',
      phone: '+91 98471 23456',
      userType: 'donor',
      username: 'donor_demo',
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_donor_2',
      institutionName: 'Cochin Breadworks & Bakery',
      contactName: 'Mariam Varghese',
      phone: '+91 94470 56789',
      userType: 'donor',
      username: 'cochin_breads',
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_receiver_1',
      institutionName: "St. Joseph's Children's Home & Shelter",
      contactName: 'Sr. Gracy Joseph',
      phone: '+91 94951 88220',
      userType: 'receiver',
      username: 'receiver_demo',
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_receiver_2',
      institutionName: 'Snehabhavan Old Age Care Home',
      contactName: 'Fr. Paulson Kurian',
      phone: '+91 97455 33441',
      userType: 'receiver',
      username: 'snehabhavan',
      passwordHash: DEMO_PASSWORD_HASH,
      createdAt: new Date().toISOString(),
    },
  ];

  const donations = [
    {
      id: 'don_1',
      donorId: 'usr_donor_1',
      item: 'Thalassery Chicken Biriyani',
      quantity: 50,
      unit: 'Plates',
      date: today,
      time: '19:30',
      location: 'Edappally Toll, Kochi',
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'don_2',
      donorId: 'usr_donor_2',
      item: 'Fresh Whole Wheat Bread Loaves & Buns',
      quantity: 80,
      unit: 'Packets',
      date: today,
      time: '20:00',
      location: 'Palarivattom Bypass, Kochi',
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'don_3',
      donorId: 'usr_donor_1',
      item: 'Kerala Rice & Sambar Feast Set',
      quantity: 40,
      unit: 'Plates',
      date: tomorrow,
      time: '13:00',
      location: 'Kaloor Stadium Road, Kochi',
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: 'don_4',
      donorId: 'usr_donor_1',
      item: 'Ghee Rice & Vegetable Kurma',
      quantity: 65,
      unit: 'Plates',
      date: tomorrow,
      time: '19:00',
      location: 'Civil Station, Kakkanad, Kochi',
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'don_5',
      donorId: 'usr_donor_2',
      item: 'Soft Wheat Chapatis & Dal Curry',
      quantity: 120,
      unit: 'Packets',
      date: dayAfter,
      time: '20:30',
      location: 'Round North, Thrissur',
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'don_6',
      donorId: 'usr_donor_1',
      item: 'Mixed Vegetable Pulao & Raita',
      quantity: 35,
      unit: 'Plates',
      date: threeDays,
      time: '14:00',
      location: 'Beach Road, Kozhikode',
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
    {
      id: 'don_7',
      donorId: 'usr_donor_1',
      item: 'Appam & Vegetable Stew',
      quantity: 30,
      unit: 'Plates',
      date: today,
      time: '18:00',
      location: 'Aluva Railway Station Road, Kochi',
      status: 'accepted',
      acceptedBy: 'usr_receiver_1',
      acceptedByName: "St. Joseph's Children's Home & Shelter",
      acceptedByPhone: '+91 94951 88220',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];

  // OVERRIDE: Food requests are sized by NUMBER OF PEOPLE, not plates.
  // Fields: item, numberOfPeople, location, neededByDate, neededByTime
  const requests = [
    {
      id: 'req_1',
      receiverId: 'usr_receiver_1',
      item: 'Biriyani or Pulao for Evening Dinner',
      numberOfPeople: 50,
      location: 'Kakkanad, Kochi',
      neededByDate: today,
      neededByTime: '19:00',
      status: 'open',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'req_2',
      receiverId: 'usr_receiver_2',
      item: 'Soft Rice and Vegetable Curry',
      numberOfPeople: 35,
      location: 'Kaloor, Kochi',
      neededByDate: tomorrow,
      neededByTime: '12:30',
      status: 'open',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'req_3',
      receiverId: 'usr_receiver_1',
      item: 'Chapatis and Dal for Children',
      numberOfPeople: 45,
      location: 'Thevara, Kochi',
      neededByDate: tomorrow,
      neededByTime: '19:30',
      status: 'open',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 9).toISOString(),
    },
    {
      id: 'req_4',
      receiverId: 'usr_receiver_2',
      item: 'Nutritious Breakfast Bread & Milk Meals',
      numberOfPeople: 60,
      location: 'Round West, Thrissur',
      neededByDate: dayAfter,
      neededByTime: '08:00',
      status: 'open',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    },
  ];

  return { users, donations, requests };
}

