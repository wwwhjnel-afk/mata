// Document Types
export type DriverDocumentType =
  | 'license'
  | 'pdp'
  | 'passport'
  | 'medical'
  | 'retest'
  | 'defensive_driving';

export interface DriverDocument {
  id: string;
  driver_id: string;
  document_type: DriverDocumentType;
  document_number?: string | null;
  issuing_authority?: string | null;
  issue_date?: string | null;
  expiry_date: string | null;
  document_url?: string | null;
  verified: boolean;
  verified_at?: string | null;
  verified_by?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentTypeInfo {
  value: DriverDocumentType;
  label: string;
  shortLabel: string;
}

export type ExpiryStatus = "valid" | "expiring" | "expired" | "unknown";

export interface DocumentAlert {
  documentType: DriverDocumentType;
  label: string;
  shortLabel: string;
  expiryDate: string;
  status: ExpiryStatus;
  daysUntilExpiry: number;
}

// Driver Types
export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone?: string | null;
  status?: string | null;
  created_at?: string;
  updated_at?: string;
}