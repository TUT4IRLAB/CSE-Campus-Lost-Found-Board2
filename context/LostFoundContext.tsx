'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  FoundItem,
  Claim,
  LostReport,
  User,
  AppNotification,
  ClaimStatus,
  ItemCategory,
  CampusName,
} from '@/types';
import {
  MOCK_FOUND_ITEMS,
  MOCK_CLAIMS,
  MOCK_LOST_REPORTS,
  MOCK_USERS,
  MOCK_NOTIFICATIONS,
} from '@/data/mockData';

interface LostFoundContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: 'student' | 'cps_officer') => void;
  items: FoundItem[];
  claims: Claim[];
  lostReports: LostReport[];
  notifications: AppNotification[];
  getItemById: (id: string) => FoundItem | undefined;
  getClaimById: (id: string) => Claim | undefined;
  submitClaim: (data: {
    itemId: string;
    itemTitle: string;
    itemCategory: ItemCategory;
    itemCampus: CampusName;
    evidenceDescription: string;
    serialNumberOrIMEI?: string;
    distinctiveMarks?: string;
    proofFileNames: string[];
  }) => Claim;
  updateClaimStatus: (
    claimId: string,
    status: ClaimStatus,
    reviewNotes?: string,
    handoverDate?: string,
    handoverLocation?: string
  ) => void;
  submitLostReport: (data: {
    title: string;
    category: ItemCategory;
    campus: CampusName;
    specificLocation: string;
    dateLost: string;
    description: string;
    distinctiveMarks: string;
    contactEmail: string;
    contactPhone: string;
  }) => LostReport;
  submitFoundItem: (data: {
    title: string;
    category: ItemCategory;
    campus: CampusName;
    specificLocation: string;
    dateFound: string;
    publicDescription: string;
    confidentialDetails: string;
    storageLocation: string;
  }) => FoundItem;
  markNotificationRead: (id: string) => void;
}

const LostFoundContext = createContext<LostFoundContextType | undefined>(undefined);

export function LostFoundProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Thabo Moloi (Student)
  const [items, setItems] = useState<FoundItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tut_items');
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return MOCK_FOUND_ITEMS;
  });

  const [claims, setClaims] = useState<Claim[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tut_claims');
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return MOCK_CLAIMS;
  });

  const [lostReports, setLostReports] = useState<LostReport[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('tut_reports');
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return MOCK_LOST_REPORTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  const saveToStorage = (newItems?: FoundItem[], newClaims?: Claim[], newReports?: LostReport[]) => {
    try {
      if (newItems) localStorage.setItem('tut_items', JSON.stringify(newItems));
      if (newClaims) localStorage.setItem('tut_claims', JSON.stringify(newClaims));
      if (newReports) localStorage.setItem('tut_reports', JSON.stringify(newReports));
    } catch {
      // Storage quota or SSR safe ignore
    }
  };

  const switchUserRole = (role: 'student' | 'cps_officer') => {
    if (role === 'student') {
      setCurrentUser(MOCK_USERS[0]);
    } else {
      setCurrentUser(MOCK_USERS[2]); // Sgt. Dlamini
    }
  };

  const getItemById = (id: string) => items.find((i) => i.id === id);
  const getClaimById = (id: string) => claims.find((c) => c.id === id);

  const submitClaim = (data: {
    itemId: string;
    itemTitle: string;
    itemCategory: ItemCategory;
    itemCampus: CampusName;
    evidenceDescription: string;
    serialNumberOrIMEI?: string;
    distinctiveMarks?: string;
    proofFileNames: string[];
  }): Claim => {
    const claimNum = String(claims.length + 46).padStart(4, '0');
    const newClaim: Claim = {
      id: `clm-${Date.now()}`,
      claimNumber: `CLM-2026-${claimNum}`,
      itemId: data.itemId,
      itemTitle: data.itemTitle,
      itemCategory: data.itemCategory,
      itemCampus: data.itemCampus,
      claimantId: currentUser.id,
      claimantName: currentUser.name,
      claimantStudentId: currentUser.studentNumber,
      claimantEmail: currentUser.email,
      claimantPhone: currentUser.phone,
      evidenceDescription: data.evidenceDescription,
      serialNumberOrIMEI: data.serialNumberOrIMEI,
      distinctiveMarks: data.distinctiveMarks,
      proofFileNames: data.proofFileNames.length > 0 ? data.proofFileNames : ['student_affidavit.pdf'],
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    const updatedClaims = [newClaim, ...claims];
    const updatedItems = items.map((item) =>
      item.id === data.itemId && item.status === 'in_cps_custody'
        ? { ...item, status: 'claim_pending' as const }
        : item
    );

    setClaims(updatedClaims);
    setItems(updatedItems);
    saveToStorage(updatedItems, updatedClaims);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Claim Submitted Successfully',
      message: `Your claim #${newClaim.claimNumber} for ${data.itemTitle} was submitted to CPS for ownership verification.`,
      type: 'info',
      read: false,
      timestamp: 'Just now',
      link: '/my-claims',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newClaim;
  };

  const updateClaimStatus = (
    claimId: string,
    status: ClaimStatus,
    reviewNotes?: string,
    handoverDate?: string,
    handoverLocation?: string
  ) => {
    let affectedItemId: string | undefined;

    const updatedClaims = claims.map((c) => {
      if (c.id === claimId) {
        affectedItemId = c.itemId;
        return {
          ...c,
          status,
          reviewedAt: new Date().toISOString(),
          reviewedByOfficer: currentUser.name,
          reviewNotes: reviewNotes || c.reviewNotes,
          handoverScheduledDate: handoverDate || c.handoverScheduledDate,
          handoverLocation: handoverLocation || c.handoverLocation,
          ...(status === 'Completed' ? { handoverCompletedAt: new Date().toISOString() } : {}),
        };
      }
      return c;
    });

    let updatedItems = [...items];
    if (affectedItemId) {
      updatedItems = items.map((item) => {
        if (item.id === affectedItemId) {
          if (status === 'Completed') {
            return { ...item, status: 'claimed_resolved' as const };
          }
          if (status === 'Rejected') {
            return { ...item, status: 'in_cps_custody' as const };
          }
        }
        return item;
      });
    }

    setClaims(updatedClaims);
    setItems(updatedItems);
    saveToStorage(updatedItems, updatedClaims);
  };

  const submitLostReport = (data: {
    title: string;
    category: ItemCategory;
    campus: CampusName;
    specificLocation: string;
    dateLost: string;
    description: string;
    distinctiveMarks: string;
    contactEmail: string;
    contactPhone: string;
  }): LostReport => {
    const reportNum = String(lostReports.length + 90).padStart(4, '0');
    const newReport: LostReport = {
      id: `lr-${Date.now()}`,
      referenceNumber: `TUT-LR-2026-${reportNum}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentNumber: currentUser.studentNumber,
      title: data.title,
      category: data.category,
      campus: data.campus,
      specificLocation: data.specificLocation,
      dateLost: data.dateLost,
      description: data.description,
      distinctiveMarks: data.distinctiveMarks,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const updatedReports = [newReport, ...lostReports];
    setLostReports(updatedReports);
    saveToStorage(undefined, undefined, updatedReports);

    return newReport;
  };

  const submitFoundItem = (data: {
    title: string;
    category: ItemCategory;
    campus: CampusName;
    specificLocation: string;
    dateFound: string;
    publicDescription: string;
    confidentialDetails: string;
    storageLocation: string;
  }): FoundItem => {
    const num = String(items.length + 42).padStart(4, '0');
    const newItem: FoundItem = {
      id: `item-${Date.now()}`,
      referenceNumber: `TUT-LF-2026-${num}`,
      title: data.title,
      category: data.category,
      campus: data.campus,
      specificLocation: data.specificLocation,
      dateFound: data.dateFound,
      publicDescription: data.publicDescription,
      confidentialDetails: data.confidentialDetails,
      storageLocation: data.storageLocation,
      imageCategory: data.category,
      status: 'in_cps_custody',
      loggedBy: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    saveToStorage(updatedItems);

    return newItem;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <LostFoundContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        items,
        claims,
        lostReports,
        notifications,
        getItemById,
        getClaimById,
        submitClaim,
        updateClaimStatus,
        submitLostReport,
        submitFoundItem,
        markNotificationRead,
      }}
    >
      {children}
    </LostFoundContext.Provider>
  );
}

export function useLostFound() {
  const context = useContext(LostFoundContext);
  if (!context) {
    throw new Error('useLostFound must be used within a LostFoundProvider');
  }
  return context;
}
