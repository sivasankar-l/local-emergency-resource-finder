const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { EmergencyResource } = require('../models/EmergencyResource');

// Comprehensive seed dataset for Vellore & surrounding regions, covering all 7 categories
const SEED_RESOURCES = [
  // 1. HOSPITALS
  {
    name: 'Christian Medical College (CMC) Hospital [DEMO]',
    category: 'Hospitals',
    description: 'Demonstration Record: Multispeciality hospital and major emergency trauma center in Vellore.',
    address: 'Ida Scudder Road, Vellore Town',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632004',
    latitude: 12.9246,
    longitude: 79.1352,
    phone: '+91-416-2281000',
    email: 'demo-emergency@cmch-vellore.edu',
    operatingHours: '24/7 Trauma & Emergency Center',
    services: ['24/7 Trauma Care', 'ICU', 'Emergency Surgery', 'Cardiac Care', 'Pediatric Emergency'],
    availabilityStatus: {
      status: 'Operational (Demonstration)',
      source: 'VIT IIP Academic Demo Catalog',
      timestamp: new Date()
    },
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed (Academic Reference)'
  },
  {
    name: 'Government Vellore Medical College Hospital (Adukkamparai) [DEMO]',
    category: 'Hospitals',
    description: 'Demonstration Record: State tertiary healthcare center and emergency casualty department.',
    address: 'NH 48, Adukkamparai',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632011',
    latitude: 12.8617,
    longitude: 79.1355,
    phone: '+91-416-2260900',
    email: 'demo-gvmc@tn.gov.in',
    operatingHours: '24/7 Casualty & Emergency Ward',
    services: ['Emergency Casualty', 'Trauma Ward', 'Free Government Healthcare', 'Blood Storage'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Naruvi Hospitals [DEMO]',
    category: 'Hospitals',
    description: 'Demonstration Record: Quaternary care hospital with acute emergency and critical care response.',
    address: 'Collectorate Junction, Bangalore-Chennai National Highway',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632009',
    latitude: 12.9405,
    longitude: 79.1764,
    phone: '+91-416-6696666',
    email: 'demo-care@naruvihospitals.com',
    operatingHours: '24/7 Critical Emergency Response',
    services: ['24/7 Emergency Medicine', 'Cath Lab', 'Neuro Intensive Care', 'Stroke Response Unit'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },

  // 2. AMBULANCE SERVICES
  {
    name: 'Tamil Nadu 108 Emergency Ambulance (Katpadi Base) [DEMO]',
    category: 'Ambulance Services',
    description: 'Demonstration Record: Government state centralized emergency medical response ambulance unit.',
    address: 'Katpadi Railway Station Road',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632007',
    latitude: 12.9782,
    longitude: 79.1384,
    phone: '108',
    email: 'demo-108@emri.in',
    operatingHours: '24/7 Rapid Emergency Dispatch',
    services: ['Advanced Life Support (ALS)', 'Basic Life Support (BLS)', 'Oxygen Support', 'Cardiac Defibrillator'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'VIT Campus Emergency Ambulance Response [DEMO]',
    category: 'Ambulance Services',
    description: 'Demonstration Record: Rapid-dispatch campus ambulance serving VIT university students and Katpadi locality.',
    address: 'Health Centre, Vellore Institute of Technology, Katpadi',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632014',
    latitude: 12.9692,
    longitude: 79.1565,
    phone: '+91-416-2202100',
    email: 'demo-healthcentre@vit.ac.in',
    operatingHours: '24/7 Campus Emergency Standby',
    services: ['Paramedic Team', 'Patient Transport', 'Immediate Trauma Triage', 'Stretcher & Oxygen Unit'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Academic Demo Catalog'
  },
  {
    name: 'Red Cross Emergency Ambulance Wing Vellore [DEMO]',
    category: 'Ambulance Services',
    description: 'Demonstration Record: Humanitarian emergency patient transport and disaster transit.',
    address: 'Officers Line, Near District Court',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632001',
    latitude: 12.9192,
    longitude: 79.1315,
    phone: '+91-416-2224500',
    email: 'demo-redcross@vellore.org',
    operatingHours: '24/7 On-Call Support',
    services: ['Inter-Hospital Transfer', 'Oxygen Ambulance', 'Wheelchair Lift Support'],
    verificationStatus: 'pending',
    dataSource: 'VIT IIP Demonstration Seed'
  },

  // 3. POLICE STATIONS
  {
    name: 'Katpadi Police Station [DEMO]',
    category: 'Police Stations',
    description: 'Demonstration Record: Law enforcement, highway patrolling, and immediate public safety desk.',
    address: 'Chittoor High Road, Near Katpadi Junction',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632007',
    latitude: 12.9815,
    longitude: 79.1412,
    phone: '100 / +91-416-2295240',
    email: 'demo-katpadips@tnpolice.gov.in',
    operatingHours: '24/7 Duty Officer & Emergency Patrol',
    services: ['24/7 Control Room', 'Highway Patrol', 'Women Helpline Desk', 'Accident Response'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Vellore North Police Station [DEMO]',
    category: 'Police Stations',
    description: 'Demonstration Record: Municipal emergency response and community police control.',
    address: 'Sarathi Mansion Road, Near Old Bus Stand',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632004',
    latitude: 12.9288,
    longitude: 79.1378,
    phone: '100 / +91-416-2220100',
    email: 'demo-northps@tnpolice.gov.in',
    operatingHours: '24/7 Operations Desk',
    services: ['Emergency First Response', 'Cyber Crime Desk', 'Child & Women Protection Unit'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Sathuvachari Police Station [DEMO]',
    category: 'Police Stations',
    description: 'Demonstration Record: National Highway corridor control and district headquarters patrol.',
    address: 'Phase 2, Sathuvachari Main Road',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632009',
    latitude: 12.9348,
    longitude: 79.1722,
    phone: '+91-416-2252100',
    email: 'demo-sathuvalps@tnpolice.gov.in',
    operatingHours: '24/7 Operations Desk',
    services: ['Traffic Emergency Division', 'Community Safety', 'Emergency Patrol'],
    verificationStatus: 'unverified',
    dataSource: 'VIT IIP Demonstration Seed'
  },

  // 4. FIRE STATIONS
  {
    name: 'Vellore District Fire and Rescue Station [DEMO]',
    category: 'Fire Stations',
    description: 'Demonstration Record: Headquarters fire rescue service with ladder trucks, water tenders and disaster cutters.',
    address: 'Officers Line, Near Old Collector Office',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632001',
    latitude: 12.9215,
    longitude: 79.1294,
    phone: '101 / +91-416-2220101',
    email: 'demo-firerescue@tnfrs.tn.gov.in',
    operatingHours: '24/7 Fire & Disaster Emergency Call-out',
    services: ['Fire Suppression', 'Road Accident Extrication', 'Urban Search & Rescue', 'Hazardous Spill Control'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Katpadi Fire & Emergency Response Post [DEMO]',
    category: 'Fire Stations',
    description: 'Demonstration Record: Suburban fire unit specialized in industrial fire control and railway rescue.',
    address: 'Near Katpadi Industrial Estate, Chittoor Main Road',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632007',
    latitude: 12.9865,
    longitude: 79.1462,
    phone: '101 / +91-416-2297101',
    email: 'demo-katpadifire@tnfrs.tn.gov.in',
    operatingHours: '24/7 Emergency Dispatch',
    services: ['Chemical Hazard Response', 'Building Evacuation', 'Water Foam Tender'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },

  // 5. PHARMACIES
  {
    name: 'Apollo 24/7 Pharmacy - Katpadi Branch [DEMO]',
    category: 'Pharmacies',
    description: 'Demonstration Record: Around-the-clock pharmacy stocked with emergency medicines and surgical supplies.',
    address: 'Shop No 14, Gandhi Road, Katpadi',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632007',
    latitude: 12.9742,
    longitude: 79.1438,
    phone: '+91-416-2244888',
    email: 'demo-apollo.katpadi@apollo.org',
    operatingHours: '24 Hours Open Every Day',
    services: ['Emergency Inhalers', 'Insulin Cold Storage', 'Cardiovascular Drugs', 'First Aid Kits', 'Home Delivery'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'MedPlus 24x7 Pharmacy - Bagayam [DEMO]',
    category: 'Pharmacies',
    description: 'Demonstration Record: Licensed continuous dispensing chemist near medical college campus.',
    address: 'Main Bazaar Road, Bagayam',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632002',
    latitude: 12.8735,
    longitude: 79.1382,
    phone: '+91-416-2267711',
    email: 'demo-bagayam@medplus.org',
    operatingHours: '24 Hours Open Every Day',
    services: ['Emergency Antibiotics', 'Surgical Dressings', 'Nebulization Units', 'Prescription Verification'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Vellore Central Night Chemist & Surgical Store [DEMO]',
    category: 'Pharmacies',
    description: 'Demonstration Record: Essential night chemist providing pediatric and geriatric emergency medications.',
    address: 'Anna Salai, Near CMC Town Gate',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632004',
    latitude: 12.9255,
    longitude: 79.1360,
    phone: '+91-416-2228945',
    email: 'demo-chemist@vellorepharma.org',
    operatingHours: '8:00 PM - 8:00 AM (Night Service)',
    services: ['Emergency Antivenom Inquiries', 'Critical Medications', 'Oxygen Canisters'],
    verificationStatus: 'pending',
    dataSource: 'VIT IIP Demonstration Seed'
  },

  // 6. BLOOD BANKS
  {
    name: 'CMC Hospital Blood Bank & Transfusion Medicine [DEMO]',
    category: 'Blood Banks',
    description: 'Demonstration Record: State-of-the-art apheresis and component separation facility.',
    address: 'Department of Transfusion Medicine, CMC Hospital Campus, Ida Scudder Road',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632004',
    latitude: 12.9242,
    longitude: 79.1348,
    phone: '+91-416-2282050',
    email: 'demo-transfusion@cmch-vellore.edu',
    operatingHours: '24/7 Emergency Blood Issue & Screening',
    services: ['Packed Red Cells (PRBC)', 'Platelet Apheresis', 'Fresh Frozen Plasma (FFP)', 'Cryoprecipitate'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Rotary Central Blood Bank & Component Centre [DEMO]',
    category: 'Blood Banks',
    description: 'Demonstration Record: Community non-profit donor bank coordinating voluntary emergency blood drives.',
    address: 'Near District Health Officer Office, Arni Road',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632001',
    latitude: 12.9124,
    longitude: 79.1398,
    phone: '+91-416-2212345',
    email: 'demo-rotaryblood@vellore.org',
    operatingHours: '24/7 Voluntary Blood Center',
    services: ['Universal Donor O-Neg Stock Management', 'Rare Blood Type Registry', 'Platelet Extraction'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Red Cross Society Blood Bank [DEMO]',
    category: 'Blood Banks',
    description: 'Demonstration Record: Humanitarian blood donation center with cold-chain storage logistics.',
    address: 'Officers Line, Vellore Cantonment',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632001',
    latitude: 12.9188,
    longitude: 79.1285,
    phone: '+91-416-2224599',
    email: 'demo-redcrossblood@vellore.org',
    operatingHours: '9:00 AM - 9:00 PM (Emergency Call Support)',
    services: ['Whole Blood', 'Mobile Donation Camps', 'Blood Group Cross-Matching'],
    verificationStatus: 'unverified',
    dataSource: 'VIT IIP Demonstration Seed'
  },

  // 7. EMERGENCY SHELTERS
  {
    name: 'VIT Community Disaster Relief & Cyclone Shelter [DEMO]',
    category: 'Emergency Shelters',
    description: 'Demonstration Record: Designated campus disaster response facility equipped for heavy rain and storm contingencies.',
    address: 'Indoor Sports Complex, Vellore Institute of Technology',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632014',
    latitude: 12.9715,
    longitude: 79.1602,
    phone: '+91-416-2202020',
    email: 'demo-disastershelter@vit.ac.in',
    operatingHours: 'Activated during weather alerts and civic emergencies',
    services: ['Temporary Bedding', 'Emergency Generator Power', 'Filtered Drinking Water', 'Community Kitchen', 'Medical Aid Post'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed (Academic Context)'
  },
  {
    name: 'Vellore District Revenue Disaster Relief Center [DEMO]',
    category: 'Emergency Shelters',
    description: 'Demonstration Record: Civic multipurpose shelter managed by District Disaster Management Authority (DDMA).',
    address: 'District Collectorate Complex, Sathuvachari',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632009',
    latitude: 12.9378,
    longitude: 79.1745,
    phone: '1077 / +91-416-2253001',
    email: 'demo-ddma@tn.gov.in',
    operatingHours: '24/7 Civic Emergency Activation',
    services: ['Food Distribution', 'Sanitary Facilities', 'Communication Center', 'First Aid Station'],
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    dataSource: 'VIT IIP Demonstration Seed'
  },
  {
    name: 'Katpadi Municipal Community Relief Hall [DEMO]',
    category: 'Emergency Shelters',
    description: 'Demonstration Record: Civic municipal hall with standby flood protection, sleeping bays, and ration storage.',
    address: 'Near Old Katpadi Bus Stand',
    city: 'Vellore',
    state: 'Tamil Nadu',
    postalCode: '632007',
    latitude: 12.9798,
    longitude: 79.1425,
    phone: '+91-416-2296500',
    email: 'demo-katpadicivic@vellorecorp.tn.gov.in',
    operatingHours: 'Open during localized flood or infrastructure emergencies',
    services: ['Safe Dry Shelter', 'Hot Meals Provision', 'Family Sleeping Zones', 'Clean Water'],
    verificationStatus: 'pending',
    dataSource: 'VIT IIP Demonstration Seed'
  }
];

async function seedDatabase() {
  console.log('[Seed] Seeding demonstration emergency resources...');
  await EmergencyResource.deleteMany({});
  const inserted = await EmergencyResource.insertMany(SEED_RESOURCES);
  console.log(`[Seed] Successfully inserted ${inserted.length} demonstration emergency resources across all 7 categories.`);
  return inserted;
}

async function seedIfEmpty() {
  const count = await EmergencyResource.countDocuments();
  if (count === 0) {
    console.log('[Seed] Database is empty. Seeding initial demonstration resources...');
    return await seedDatabase();
  }
  return null;
}

// Standalone runner
if (require.main === module) {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/emergency_resource_finder';
  mongoose
    .connect(uri)
    .then(async () => {
      console.log(`[Seed] Connected to MongoDB at ${uri}`);
      await seedDatabase();
      await mongoose.disconnect();
      console.log('[Seed] Done. Connection closed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed] Error during seeding:', err.message);
      process.exit(1);
    });
}

module.exports = {
  seedDatabase,
  seedIfEmpty,
  SEED_RESOURCES
};
