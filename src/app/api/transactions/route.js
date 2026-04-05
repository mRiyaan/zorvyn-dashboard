import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'src/lib/mockData.json');

// In-Memory Store: Persists for the lifecycle of the container instance
// This bypasses the read-only filesystem issues in Cloud Run / Vercel
let inMemoryStore = null;

function getStore() {
  if (inMemoryStore === null) {
    try {
      const raw = fs.readFileSync(DATA_PATH, 'utf8');
      inMemoryStore = JSON.parse(raw);
      console.log('API: In-memory store initialized from mockData.json');
    } catch (err) {
      console.error('API Error: Failed to load initial mock data', err);
      inMemoryStore = [];
    }
  }
  return inMemoryStore;
}

export async function GET() {
  try {
    const data = getStore();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = getStore();

    if (!body.transaction_id || body.amount === undefined || !body.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add to memory
    inMemoryStore = [body, ...data];

    return NextResponse.json({ success: true, total: inMemoryStore.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { transaction_id } = body;
    const data = getStore();

    if (!transaction_id) {
      return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 });
    }

    const originalLen = data.length;
    inMemoryStore = data.filter(txn => txn.transaction_id !== transaction_id);

    if (inMemoryStore.length === originalLen) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deleted: transaction_id, total: inMemoryStore.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { transaction_id, ...updates } = body;
    const data = getStore();

    if (!transaction_id) {
      return NextResponse.json({ error: 'Missing transaction_id' }, { status: 400 });
    }

    const index = data.findIndex(txn => txn.transaction_id === transaction_id);
    if (index === -1) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Merge updates in memory
    data[index] = { ...data[index], ...updates };
    inMemoryStore = [...data];

    return NextResponse.json({ success: true, updated: transaction_id });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

