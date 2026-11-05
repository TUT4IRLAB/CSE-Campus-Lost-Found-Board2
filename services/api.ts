const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// --- AUTH SERVICES ---

/**
 * Register a new student or CPS officer in real-time.
 */
export async function registerUser(userData: {
  name: string;
  email: string;
  studentNumber: string;
  campus?: string;
  password?: string;
  role?: string;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

/**
 * Log in a user using their email or student number.
 */
export async function loginUser(credentials: {
  identifier: string; // Email or Student Number
  password?: string;
}) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// --- ITEM SERVICES ---

/**
 * Fetch found items from the database with optional search, category, status, and campus filters.
 */
export async function fetchItems(filters: {
  search?: string;
  category?: string;
  status?: string;
  campus?: string;
} = {}) {
  // Filter out empty parameters
  const activeParams = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
  );
  
  const params = new URLSearchParams(activeParams as Record<string, string>);
  const res = await fetch(`${API_URL}/items?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch items from backend');
  return res.json();
}

/**
 * Register a new found item into inventory (CPS Officer portal).
 */
export async function createItem(itemData: {
  name: string;
  category: string;
  description: string;
  confidentialDetails?: string;
  dateFound: string;
  location: string;
  imageUrl?: string;
  campus?: string;
  reportedBy?: string;
}) {
  const res = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create item');
  return data;
}

// --- CLAIM SERVICES ---

/**
 * Fetch submitted ownership claims for a specific student or all claims (for CPS review).
 */
export async function fetchClaims(studentId?: string, status?: string) {
  const params = new URLSearchParams();
  if (studentId) params.append('studentId', studentId);
  if (status) params.append('status', status);

  const res = await fetch(`${API_URL}/claims?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch claims');
  return res.json();
}

/**
 * Submit an ownership claim for a lost item with distinctive proof/identifying marks.
 */
export async function submitClaim(claimData: {
  itemId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  proofDescription: string;
}) {
  const res = await fetch(`${API_URL}/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claimData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit claim');
  return data;
}