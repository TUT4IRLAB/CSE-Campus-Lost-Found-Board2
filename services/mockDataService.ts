import {
  FoundItem,
  Claim,
  LostReport,
  CampusName,
  ItemCategory,
  ItemStatus,
  ClaimStatus,
} from '@/types';
import {
  MOCK_FOUND_ITEMS,
  MOCK_CLAIMS,
  MOCK_LOST_REPORTS,
} from '@/data/mockData';

export interface ItemFilterOptions {
  query?: string;
  category?: ItemCategory | 'All';
  campus?: CampusName | 'All';
  status?: ItemStatus | 'All';
  sortBy?: 'newest' | 'oldest';
}

export class MockDataService {
  private static items: FoundItem[] = [...MOCK_FOUND_ITEMS];
  private static claims: Claim[] = [...MOCK_CLAIMS];
  private static reports: LostReport[] = [...MOCK_LOST_REPORTS];

  // Items
  static getItems(filters: ItemFilterOptions = {}): FoundItem[] {
    let list = [...this.items];

    if (filters.category && filters.category !== 'All') {
      list = list.filter((i) => i.category === filters.category);
    }

    if (filters.campus && filters.campus !== 'All') {
      list = list.filter((i) => i.campus === filters.campus);
    }

    if (filters.status && filters.status !== 'All') {
      list = list.filter((i) => i.status === filters.status);
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.publicDescription.toLowerCase().includes(q) ||
          i.specificLocation.toLowerCase().includes(q) ||
          i.referenceNumber.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime());
    } else {
      list.sort((a, b) => new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime());
    }

    return list;
  }

  static getItemById(id: string): FoundItem | undefined {
    return this.items.find((i) => i.id === id);
  }

  static createFoundItem(item: Omit<FoundItem, 'id' | 'referenceNumber' | 'createdAt'>): FoundItem {
    const num = String(this.items.length + 1).padStart(4, '0');
    const newItem: FoundItem = {
      ...item,
      id: `item-${Date.now()}`,
      referenceNumber: `TUT-LF-2026-${num}`,
      createdAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  // Claims
  static getClaims(studentId?: string): Claim[] {
    if (studentId) {
      return this.claims.filter((c) => c.claimantId === studentId);
    }
    return [...this.claims];
  }

  static getClaimById(id: string): Claim | undefined {
    return this.claims.find((c) => c.id === id);
  }

  static submitClaim(
    data: Omit<Claim, 'id' | 'claimNumber' | 'status' | 'submittedAt'>
  ): Claim {
    const claimNum = String(this.claims.length + 46).padStart(4, '0');
    const newClaim: Claim = {
      ...data,
      id: `clm-${Date.now()}`,
      claimNumber: `CLM-2026-${claimNum}`,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };
    this.claims.unshift(newClaim);

    // Update item status to claim_pending
    const targetItem = this.items.find((i) => i.id === data.itemId);
    if (targetItem && targetItem.status === 'in_cps_custody') {
      targetItem.status = 'claim_pending';
    }

    return newClaim;
  }

  static updateClaimStatus(
    claimId: string,
    status: ClaimStatus,
    notes?: string,
    officerName?: string,
    handoverDate?: string,
    handoverLocation?: string
  ): Claim | undefined {
    const claim = this.claims.find((c) => c.id === claimId);
    if (!claim) return undefined;

    claim.status = status;
    claim.reviewedAt = new Date().toISOString();
    if (notes) claim.reviewNotes = notes;
    if (officerName) claim.reviewedByOfficer = officerName;
    if (handoverDate) claim.handoverScheduledDate = handoverDate;
    if (handoverLocation) claim.handoverLocation = handoverLocation;

    if (status === 'Completed') {
      claim.handoverCompletedAt = new Date().toISOString();
      const targetItem = this.items.find((i) => i.id === claim.itemId);
      if (targetItem) targetItem.status = 'claimed_resolved';
    } else if (status === 'Rejected') {
      const targetItem = this.items.find((i) => i.id === claim.itemId);
      if (targetItem) targetItem.status = 'in_cps_custody';
    }

    return claim;
  }

  // Lost Reports
  static getLostReports(studentId?: string): LostReport[] {
    if (studentId) {
      return this.reports.filter((r) => r.studentId === studentId);
    }
    return [...this.reports];
  }

  static submitLostReport(
    report: Omit<LostReport, 'id' | 'referenceNumber' | 'status' | 'createdAt'>
  ): LostReport {
    const reportNum = String(this.reports.length + 90).padStart(4, '0');
    const newReport: LostReport = {
      ...report,
      id: `lr-${Date.now()}`,
      referenceNumber: `TUT-LR-2026-${reportNum}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(newReport);
    return newReport;
  }

  // Overview stats
  static getStats() {
    return {
      totalFound: this.items.length,
      inCustody: this.items.filter((i) => i.status === 'in_cps_custody').length,
      claimsPending: this.claims.filter((c) => c.status === 'Pending').length,
      claimsUnderReview: this.claims.filter((c) => c.status === 'Under Review').length,
      claimsApproved: this.claims.filter((c) => c.status === 'Approved').length,
      resolvedItems: this.claims.filter((c) => c.status === 'Completed').length,
    };
  }
}
