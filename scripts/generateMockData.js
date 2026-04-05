const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const NUM_RECORDS = 1500;
// Timeline: 12 months back from today
const END_DATE = new Date().getTime();
const START_DATE = END_DATE - (365 * 24 * 60 * 60 * 1000);

const regionsAndCurrencies = {
  'US-EAST': ['USD'],
  'US-WEST': ['USD'],
  'EU-CENTRAL': ['EUR'],
  'APAC': ['USD', 'GBP']
};

// Adjusted to guarantee realistic, highly profitable enterprise figures
const counterpartiesAndCategories = {
  // REVENUES (~65% of total value despite fewer records)
  'ENTERPRISE_CONTRACT': { names: ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Wayne Ent'], amountRange: [150000, 500000], type: 'REVENUE', weight: 0.15 },
  'SAAS_SUBSCRIPTION': { names: ['Retail Client A', 'B2B Client Tier', 'Enterprise Tier'], amountRange: [5000, 45000], type: 'REVENUE', weight: 0.35 },
  
  // EXPENSES
  'PAYROLL': { names: ['Gusto', 'ADP', 'Rippling', 'Workday'], amountRange: [40000, 90000], type: 'EXPENSE', weight: 0.20 },
  'INFRASTRUCTURE': { names: ['AWS Cloud Services', 'Google Cloud Platform', 'Microsoft Azure', 'Cloudflare'], amountRange: [15000, 45000], type: 'EXPENSE', weight: 0.15 },
  'MARKETING': { names: ['Google Ads', 'Meta Ads', 'LinkedIn', 'HubSpot'], amountRange: [2000, 18000], type: 'EXPENSE', weight: 0.10 },
  'SAAS': { names: ['Salesforce', 'Slack', 'Zoom', 'Atlassian', 'Zendesk'], amountRange: [500, 3000], type: 'EXPENSE', weight: 0.05 }
};

const statuses = ['COMPLETED', 'PENDING', 'FAILED'];
const statusWeights = [0.90, 0.08, 0.02]; 

function weightedRandomCategory(obj) {
  let random = Math.random();
  for (const key in obj) {
    if (random < obj[key].weight) return key;
    random -= obj[key].weight;
  }
  return Object.keys(obj)[0];
}

function weightedRandom(items, weights) {
  let random = Math.random();
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) return items[i];
    random -= weights[i];
  }
  return items[0];
}

let seed = 9999;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomItem(arr) {
  return arr[Math.floor(random() * arr.length)];
}

function generateData() {
  const data = [];
  const timeStep = (END_DATE - START_DATE) / NUM_RECORDS;
  
  for (let i = 0; i < NUM_RECORDS; i++) {
    const jitter = (random() * 0.8 + 0.2) * timeStep;
    const timestamp = new Date(START_DATE + (i * timeStep) + jitter).toISOString();
    
    const category = weightedRandomCategory(counterpartiesAndCategories);
    const catDetails = counterpartiesAndCategories[category];
    
    const min = catDetails.amountRange[0];
    const max = catDetails.amountRange[1];
    let amount = parseFloat((random() * (max - min) + min).toFixed(2));
    
    const region = getRandomItem(Object.keys(regionsAndCurrencies));
    const currency = getRandomItem(regionsAndCurrencies[region]);
    
    data.push({
      transaction_id: `TXN-${uuidv4().split('-')[0].toUpperCase()}-${uuidv4().split('-')[1].toUpperCase()}`,
      timestamp,
      amount,
      currency,
      type: catDetails.type,
      status: weightedRandom(statuses, statusWeights),
      merchant_category: category,
      counterparty: getRandomItem(catDetails.names),
      compliance_risk_score: parseFloat((random() * 0.15).toFixed(2)),
      region
    });
  }

  // Anomalies: large corporate deal signings (REVENUE) to ensure highly positive outcome mapping
  for (let i = 0; i < 30; i++) {
    const timestamp = new Date(START_DATE + (random() * (END_DATE - START_DATE))).toISOString();
    data.push({
      transaction_id: `TXN-DEAL-${uuidv4().split('-')[0].toUpperCase()}`,
      timestamp,
      amount: parseFloat((random() * 1000000 + 400000).toFixed(2)), // Enormous revenue spikes
      currency: 'USD',
      type: 'REVENUE',
      status: 'COMPLETED',
      merchant_category: 'ENTERPRISE_CONTRACT',
      counterparty: 'Acme Corp',
      compliance_risk_score: parseFloat((random() * 0.05).toFixed(2)),
      region: 'US-EAST'
    });
  }

  data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return data;
}

const mockData = generateData();

const dir = path.join(__dirname, '../src/lib');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

// Output as a native JS module to avoid Turbopack HMR issues with large JSON imports
const jsContent = `// Auto-generated financial ledger — DO NOT EDIT MANUALLY\n// Generated: ${new Date().toISOString()}\n// Records: ${mockData.length}\n\nconst mockData = ${JSON.stringify(mockData, null, 2)};\n\nexport default mockData;\n`;

fs.writeFileSync(path.join(dir, 'mockData.js'), jsContent, 'utf8');

// Also keep a JSON copy for API route read/write operations
fs.writeFileSync(path.join(dir, 'mockData.json'), JSON.stringify(mockData, null, 2), 'utf8');

console.log(`✅ Synchronized ${mockData.length} records to src/lib/mockData.js (module) + mockData.json (API)`);

