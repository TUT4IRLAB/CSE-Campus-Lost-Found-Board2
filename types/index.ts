export type UserRole = 'student' | 'cps_officer' | 'admin';

export type CampusName =
  | 'Pretoria Campus'
  | 'Soshanguve South'
  | 'Soshanguve North'
  | 'Ga-Rankuwa'
  | 'Arcadia Campus'
  | 'Arts Campus'
  | 'eMalahleni Campus'
  | 'Polokwane Campus';

export interface User {
  id: string;
  studentNumber: string;
  name: string;
  email: string;
  phone: string;
  campus: CampusName;
  faculty?: string;
  role: UserRole;
  avatar?: string;
  badgeNumber?: string; // For CPS officers
}

export type ItemCategory =
  | 'Electronics'
  | 'Student Cards & IDs'
  | 'Books & Study Material'
  | 'Bags & Backpacks'
  | 'Keys'
  | 'Clothing & Accessories'
  | 'Wallets & Purses'
  | 'Other';

export type ItemStatus =
  | 'in_cps_custody'
  | 'claim_pending'
  | 'claimed_resolved'
  | 'disposed';

export interface FoundItem {
  id: string;
  referenceNumber: string; // e.g., TUT-LF-2026-0012
  title: string;
  category: ItemCategory;
  campus: CampusName;
  specificLocation: string; // e.g., "Library Level 3, Study Pod 4"
  dateFound: string; // YYYY-MM-DD
  publicDescription: string;
  confidentialDetails: string; // Hidden from student cards (e.g., serial number, lockscreen wallpaper, internal marks)
  storageLocation: string; // CPS locker/vault reference e.g., "Pretoria CPS Vault Shelf B-3"
  imageUrl?: string;
  imageCategory: ItemCategory;
  status: ItemStatus;
  loggedBy: string; // Officer or Good Samaritan name
  createdAt: string;
}

export type ClaimStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Completed';

export interface Claim {
  id: string;
  claimNumber: string; // e.g., CLM-2026-0045
  itemId: string;
  itemTitle: string;
  itemCategory: ItemCategory;
  itemCampus: CampusName;
  claimantId: string;
  claimantName: string;
  claimantStudentId: string;
  claimantEmail: string;
  claimantPhone: string;
  evidenceDescription: string;
  serialNumberOrIMEI?: string;
  distinctiveMarks?: string;
  proofFileNames: string[];
  status: ClaimStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedByOfficer?: string;
  reviewNotes?: string;
  handoverLocation?: string;
  handoverScheduledDate?: string;
  handoverCompletedAt?: string;
  officerSignatureNote?: string;
}

export type LostReportStatus = 'Active' | 'Potential Match' | 'Resolved' | 'Cancelled';

export interface LostReport {
  id: string;
  referenceNumber: string; // e.g., TUT-LR-2026-0092
  studentId: string;
  studentName: string;
  studentNumber: string;
  title: string;
  category: ItemCategory;
  campus: CampusName;
  specificLocation: string;
  dateLost: string;
  description: string;
  distinctiveMarks: string;
  contactEmail: string;
  contactPhone: string;
  status: LostReportStatus;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  timestamp: string;
  link?: string;
}
