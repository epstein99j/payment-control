import React, { useState } from 'react';
import {
  Bell, Shield, Clock, Users, FileText, Settings, Send, CheckCircle,
  XCircle, AlertTriangle, ChevronRight, Plus, Search, Download,
  Zap, Activity, Eye, Edit, Trash2, Copy, Mail, MessageSquare,
  Webhook, ToggleLeft, ToggleRight, Calendar, DollarSign, ArrowUpRight,
  RefreshCw, Power, Router, Building2, Hash, Loader2, UserCheck, Briefcase,
  Lock, Fingerprint, Phone, PenTool
} from 'lucide-react';

// Mock Data
const mockPayments = [
  { id: 'PAY-001', recipient: 'Acme Corp', recipientRtn: '021000021', recipientAccount: '****4521', fromAccount: 'Operating - ****1234', amount: 125000, rail: 'FedNow', status: 'pending_approval', requiredApprovers: 2, currentApprovers: 1, initiator: 'John Smith', timestamp: '2024-01-18 09:30:22', type: 'one-time', instructionType: 'bank_initiated' },
  { id: 'PAY-002', recipient: 'TechFlow Inc', recipientRtn: '021000089', recipientAccount: '****7832', fromAccount: 'Payroll - ****5678', amount: 8500, rail: 'RTP', status: 'approved', requiredApprovers: 1, currentApprovers: 1, initiator: 'Sarah Johnson', timestamp: '2024-01-17 14:22:00', type: 'recurring', instructionType: 'bank_initiated' },
  { id: 'PAY-003', recipient: 'Global Services LLC', recipientRtn: '026009593', recipientAccount: '****9012', fromAccount: 'Operating - ****1234', amount: 450000, rail: 'FedNow', status: 'pending_approval', requiredApprovers: 3, currentApprovers: 0, initiator: 'Mike Chen', timestamp: '2024-01-18 08:15:33', type: 'one-time', instructionType: 'bank_initiated' },
  { id: 'PAY-004', recipient: 'DataSync Partners', recipientRtn: '021000021', recipientAccount: '****3456', fromAccount: 'GL-50100', amount: 2500, rail: 'RTP', status: 'completed', requiredApprovers: 1, currentApprovers: 1, initiator: 'Emily Davis', timestamp: '2024-01-16 11:45:00', type: 'template', instructionType: 'bank_initiated' },
  { id: 'PAY-005', recipient: 'CloudNet Systems', recipientRtn: '021000089', recipientAccount: '****7890', fromAccount: 'Operating - ****1234', amount: 75000, rail: 'FedNow', status: 'rejected', requiredApprovers: 2, currentApprovers: 0, initiator: 'Alex Turner', timestamp: '2024-01-12 15:20:15', type: 'one-time', instructionType: 'bank_initiated' },
  // Account holder request — customer initiated, pending approval
  {
    id: 'PAY-006', recipient: 'Pinnacle Supplies Co', recipientRtn: '031101279', recipientAccount: '****6644', fromAccount: 'Riverside Mfg - ****3301', amount: 185000, rail: 'FedNow', status: 'pending_approval', requiredApprovers: 2, currentApprovers: 1, initiator: 'Teller - Branch 04', timestamp: '2024-01-18 10:05:00', type: 'one-time',
    instructionType: 'account_holder',
    accountHolder: {
      id: 'CUS-001', name: 'Riverside Manufacturing LLC', type: 'commercial',
      contactName: 'Margaret Chen', contactTitle: 'CFO',
      accountNumber: '****3301', accountName: 'Primary Operating',
      authorizationMethod: 'in_person', authorizationRef: 'AUTH-8845',
      authorizationTimestamp: '2024-01-18 10:02:00',
      kycStatus: 'verified',
    },
    approvalHistory: [
      { approver: 'Maria Garcia', role: 'Treasury Manager', timestamp: '2024-01-18 10:42:22', action: 'approved' },
    ]
  },
  // Account holder request — completed
  {
    id: 'PAY-009', recipient: 'Northwest Medical Group', recipientRtn: '021000089', recipientAccount: '****4455', fromAccount: 'Whitfield - ****7710', amount: 42000, rail: 'RTP', status: 'completed', requiredApprovers: 1, currentApprovers: 1, initiator: 'Online Banking', timestamp: '2024-01-10 16:45:00', type: 'one-time',
    instructionType: 'account_holder',
    accountHolder: {
      id: 'CUS-002', name: 'Dr. Sarah Whitfield', type: 'individual',
      contactName: 'Sarah Whitfield', contactTitle: null,
      accountNumber: '****7710', accountName: 'Personal Checking',
      authorizationMethod: 'authenticated_digital', authorizationRef: 'AUTH-8838',
      authorizationTimestamp: '2024-01-10 16:42:00',
      kycStatus: 'verified',
    },
    approvalHistory: [
      { approver: 'Robert Chen', role: 'Senior Analyst', timestamp: '2024-01-10 17:15:12', action: 'approved' },
    ]
  },
  // 3 approvals required, 2 received so far — still pending
  { id: 'PAY-007', recipient: 'Meridian Capital Group', recipientRtn: '021000021', recipientAccount: '****8877', fromAccount: 'Operating - ****1234', amount: 385000, rail: 'FedNow', status: 'pending_approval', requiredApprovers: 3, currentApprovers: 2, initiator: 'David Kim', timestamp: '2024-01-17 07:22:00', type: 'one-time', instructionType: 'bank_initiated', approvalHistory: [
    { approver: 'Maria Garcia', role: 'Treasury Manager', timestamp: '2024-01-17 09:15:12', action: 'approved' },
    { approver: 'Robert Chen', role: 'Senior Analyst', timestamp: '2024-01-17 14:32:34', action: 'approved' },
  ]},
  // 3 approvals required, all 3 received — completed successfully
  { id: 'PAY-008', recipient: 'Titan Industrial Corp', recipientRtn: '026009593', recipientAccount: '****2299', fromAccount: 'Operating - ****1234', amount: 520000, rail: 'FedNow', status: 'completed', requiredApprovers: 3, currentApprovers: 3, initiator: 'Jennifer Walsh', timestamp: '2024-01-08 14:30:00', type: 'one-time', instructionType: 'bank_initiated', approvalHistory: [
    { approver: 'Maria Garcia', role: 'Treasury Manager', timestamp: '2024-01-08 15:45:22', action: 'approved' },
    { approver: 'Robert Chen', role: 'Senior Analyst', timestamp: '2024-01-09 09:22:18', action: 'approved' },
    { approver: 'Patricia Moore', role: 'Treasury Director', timestamp: '2024-01-09 11:08:45', action: 'approved' },
  ]},
];

const mockTemplates = [
  { id: 'TPL-001', name: 'Monthly Vendor Payment - Acme', recipient: 'Acme Corp', recipientRtn: '021000021', recipientAccount: '****4521', fromAccount: 'Operating - ****1234', defaultAmount: 25000, frequency: 'Monthly', rail: 'FedNow', nextRun: '2024-02-01', status: 'active', controls: { maxAmount: 30000, requireApproval: true }, editableFields: ['amount', 'memo'], createdBy: 'Sarah Johnson', createdAt: '2023-09-15' },
  { id: 'TPL-002', name: 'Weekly Payroll Transfer', recipient: 'Payroll Account', recipientRtn: '021000089', recipientAccount: '****7832', fromAccount: 'Payroll - ****5678', defaultAmount: 150000, frequency: 'Weekly', rail: 'RTP', nextRun: '2024-01-19', status: 'active', controls: { maxAmount: 200000, requireApproval: true }, editableFields: ['amount', 'memo'], createdBy: 'Mike Chen', createdAt: '2023-06-01' },
  { id: 'TPL-003', name: 'Quarterly Tax Payment', recipient: 'IRS', recipientRtn: '021000021', recipientAccount: '****9999', fromAccount: 'GL-50100', defaultAmount: 85000, frequency: 'Quarterly', rail: 'FedNow', nextRun: '2024-04-15', status: 'paused', controls: { maxAmount: 100000, requireApproval: true }, editableFields: ['amount', 'memo'], createdBy: 'Emily Davis', createdAt: '2023-03-20' },
];

const mockAuditLogs = [
  { id: 'LOG-001', action: 'Payment Initiated', user: 'John Smith', details: 'PAY-001 created for $125,000 to Acme Corp', timestamp: '2024-01-18 09:30:22', ip: '192.168.1.45', category: 'payment' },
  { id: 'LOG-002', action: 'Payment Approved', user: 'Maria Garcia', details: 'PAY-001 approved (1 of 2 required)', timestamp: '2024-01-18 10:15:10', ip: '192.168.1.67', category: 'approval' },
  { id: 'LOG-003', action: 'Control Modified', user: 'Admin User', details: 'Daily limit increased from $500K to $750K', timestamp: '2024-01-18 08:00:00', ip: '192.168.1.10', category: 'config' },
  { id: 'LOG-004', action: 'Template Created', user: 'Sarah Johnson', details: 'TPL-002 Weekly Payroll Transfer created', timestamp: '2023-06-01 14:45:00', ip: '192.168.1.23', category: 'template' },
  { id: 'LOG-005', action: 'Payment Rejected', user: 'David Wilson', details: 'PAY-005 rejected - Exceeds velocity limit', timestamp: '2024-01-12 16:05:00', ip: '192.168.1.89', category: 'approval' },
  { id: 'LOG-006', action: 'Payment Approved', user: 'Robert Chen', details: 'PAY-007 approved (2 of 3 required) - Meridian Capital Group $385,000', timestamp: '2024-01-17 14:32:34', ip: '192.168.1.52', category: 'approval' },
  { id: 'LOG-007', action: 'Payment Approved', user: 'Maria Garcia', details: 'PAY-007 approved (1 of 3 required) - Meridian Capital Group $385,000', timestamp: '2024-01-17 09:15:12', ip: '192.168.1.67', category: 'approval' },
  { id: 'LOG-008', action: 'Payment Initiated', user: 'David Kim', details: 'PAY-007 created for $385,000 to Meridian Capital Group', timestamp: '2024-01-17 07:22:00', ip: '192.168.1.33', category: 'payment' },
  { id: 'LOG-009', action: 'Payment Completed', user: 'System', details: 'PAY-008 completed - $520,000 to Titan Industrial Corp via FedNow', timestamp: '2024-01-09 11:12:00', ip: '10.0.0.1', category: 'payment' },
  { id: 'LOG-010', action: 'Payment Approved', user: 'Patricia Moore', details: 'PAY-008 approved (3 of 3 required) - Final approval', timestamp: '2024-01-09 11:08:45', ip: '192.168.1.78', category: 'approval' },
  { id: 'LOG-011', action: 'Payment Approved', user: 'Robert Chen', details: 'PAY-008 approved (2 of 3 required) - Titan Industrial Corp', timestamp: '2024-01-09 09:22:18', ip: '192.168.1.52', category: 'approval' },
  { id: 'LOG-012', action: 'Payment Approved', user: 'Maria Garcia', details: 'PAY-008 approved (1 of 3 required) - Titan Industrial Corp', timestamp: '2024-01-08 15:45:22', ip: '192.168.1.67', category: 'approval' },
  { id: 'LOG-013', action: 'Payment Initiated', user: 'Jennifer Walsh', details: 'PAY-008 created for $520,000 to Titan Industrial Corp', timestamp: '2024-01-08 14:30:00', ip: '192.168.1.41', category: 'payment' },
  { id: 'LOG-014', action: 'Acct Holder Payment Initiated', user: 'Teller - Branch 04', details: 'PAY-006 created for $185,000 on behalf of Riverside Manufacturing LLC (CUS-001) to Pinnacle Supplies Co. Auth: In-Person AUTH-8845', timestamp: '2024-01-18 10:05:00', ip: '192.168.4.12', category: 'payment' },
  { id: 'LOG-015', action: 'Payment Approved', user: 'Maria Garcia', details: 'PAY-006 approved (1 of 2 required) - Account holder request, Riverside Mfg $185,000', timestamp: '2024-01-18 10:42:22', ip: '192.168.1.67', category: 'approval' },
  { id: 'LOG-016', action: 'Acct Holder Payment Initiated', user: 'Online Banking', details: 'PAY-009 created for $42,000 on behalf of Dr. Sarah Whitfield (CUS-002) to Northwest Medical Group. Auth: Authenticated Digital AUTH-8838', timestamp: '2024-01-10 16:45:00', ip: '10.0.2.55', category: 'payment' },
  { id: 'LOG-017', action: 'Payment Approved', user: 'Robert Chen', details: 'PAY-009 approved (1 of 1 required) - Account holder request', timestamp: '2024-01-10 17:15:12', ip: '192.168.1.52', category: 'approval' },
  { id: 'LOG-018', action: 'Payment Completed', user: 'System', details: 'PAY-009 completed - $42,000 to Northwest Medical Group via RTP on behalf of Dr. Sarah Whitfield', timestamp: '2024-01-10 17:16:00', ip: '10.0.0.1', category: 'payment' },
];

const mockNotifications = [
  { id: 'NOT-001', type: 'approval', title: 'Approval Required', message: 'PAY-001 ($125,000) requires your approval', timestamp: '2 min ago', read: false },
  { id: 'NOT-002', type: 'completed', title: 'Payment Completed', message: 'PAY-004 to DataSync Partners completed successfully', timestamp: '15 min ago', read: false },
  { id: 'NOT-003', type: 'alert', title: 'Velocity Alert', message: 'Daily transaction count approaching limit (18/20)', timestamp: '30 min ago', read: true },
];

// Institution's RTN (always the same for FROM)
const INSTITUTION_RTN = '021000021';
const INSTITUTION_NAME = 'Payfinia Bank';

// Instruction type constants
const INSTRUCTION_TYPES = {
  bank_initiated: { label: 'Bank-Initiated', desc: 'Internal treasury or operations payment', icon: 'Building2', color: 'blue' },
  account_holder: { label: 'Account Holder Request', desc: 'Payment requested by an account holder', icon: 'UserCheck', color: 'violet' },
};

// Mock account holder (customer) database
const mockAccountHolders = [
  {
    id: 'CUS-001', name: 'Riverside Manufacturing LLC', type: 'commercial',
    kycStatus: 'verified', kycExpiry: '2025-06-15', accountStanding: 'good',
    contactName: 'Margaret Chen', contactTitle: 'CFO', contactPhone: '(555) 234-5678', contactEmail: 'mchen@riverside-mfg.com',
    accounts: [
      { number: '****3301', name: 'Primary Operating', balance: 1850000, status: 'active', dailyLimit: 500000, usedToday: 125000 },
      { number: '****3302', name: 'Vendor Payments', balance: 420000, status: 'active', dailyLimit: 200000, usedToday: 0 },
    ],
    authHistory: [
      { method: 'authenticated_digital', date: '2024-01-14', ref: 'AUTH-8821' },
      { method: 'in_person', date: '2024-01-10', ref: 'AUTH-8790' },
    ]
  },
  {
    id: 'CUS-002', name: 'Dr. Sarah Whitfield', type: 'individual',
    kycStatus: 'verified', kycExpiry: '2025-03-22', accountStanding: 'good',
    contactName: 'Sarah Whitfield', contactTitle: null, contactPhone: '(555) 876-5432', contactEmail: 'swhitfield@email.com',
    accounts: [
      { number: '****7710', name: 'Personal Checking', balance: 285000, status: 'active', dailyLimit: 100000, usedToday: 0 },
      { number: '****7711', name: 'Business Account', balance: 92000, status: 'active', dailyLimit: 50000, usedToday: 15000 },
    ],
    authHistory: [
      { method: 'phone_verified', date: '2024-01-12', ref: 'AUTH-8805' },
    ]
  },
  {
    id: 'CUS-003', name: 'Greenfield Partners Inc', type: 'commercial',
    kycStatus: 'expired', kycExpiry: '2024-01-01', accountStanding: 'review',
    contactName: 'Thomas Park', contactTitle: 'Treasurer', contactPhone: '(555) 345-6789', contactEmail: 'tpark@greenfieldpartners.com',
    accounts: [
      { number: '****5501', name: 'Corporate Account', balance: 3200000, status: 'active', dailyLimit: 750000, usedToday: 200000 },
    ],
    authHistory: []
  },
  {
    id: 'CUS-004', name: 'Apex Logistics Corp', type: 'commercial',
    kycStatus: 'verified', kycExpiry: '2025-09-30', accountStanding: 'good',
    contactName: 'James Rodriguez', contactTitle: 'VP Finance', contactPhone: '(555) 456-7890', contactEmail: 'jrodriguez@apexlogistics.com',
    accounts: [
      { number: '****8820', name: 'Operating Account', balance: 4100000, status: 'active', dailyLimit: 1000000, usedToday: 350000 },
      { number: '****8821', name: 'Payroll Account', balance: 920000, status: 'active', dailyLimit: 500000, usedToday: 0 },
      { number: '****8822', name: 'Escrow Holding', balance: 750000, status: 'restricted', dailyLimit: 0, usedToday: 0 },
    ],
    authHistory: [
      { method: 'authenticated_digital', date: '2024-01-15', ref: 'AUTH-8830' },
      { method: 'authenticated_digital', date: '2024-01-13', ref: 'AUTH-8818' },
      { method: 'in_person', date: '2024-01-08', ref: 'AUTH-8785' },
    ]
  },
];

// Authorization method definitions
const AUTHORIZATION_METHODS = {
  in_person: { label: 'In-Person (Branch)', desc: 'Account holder present with valid ID', icon: 'UserCheck' },
  authenticated_digital: { label: 'Authenticated Digital', desc: 'Verified via online banking or secure portal', icon: 'Fingerprint' },
  phone_verified: { label: 'Phone (Verified)', desc: 'Phone request with identity verification', icon: 'Phone' },
  written_request: { label: 'Written Request', desc: 'Signed letter or fax with authorization', icon: 'PenTool' },
};

// Mock accounts for FROM selection
const fromAccounts = [
  { id: 'ACC-001', type: 'account', name: 'Operating Account', number: '****1234', balance: 2500000 },
  { id: 'ACC-002', type: 'account', name: 'Payroll Account', number: '****5678', balance: 850000 },
  { id: 'ACC-003', type: 'account', name: 'Reserve Account', number: '****9012', balance: 5000000 },
  { id: 'GL-001', type: 'gl', name: 'GL-50100 - Accounts Payable', number: 'GL-50100', balance: null },
  { id: 'GL-002', type: 'gl', name: 'GL-50200 - Vendor Payments', number: 'GL-50200', balance: null },
];

// Mock RTN database for validation
const rtnDatabase = {
  '021000021': { name: 'JPMorgan Chase', fedNow: true, rtp: true, status: 'active' },
  '021000089': { name: 'Citibank', fedNow: true, rtp: true, status: 'active' },
  '026009593': { name: 'Bank of America', fedNow: true, rtp: false, status: 'active' },
  '031101279': { name: 'Capital One', fedNow: true, rtp: true, status: 'active' },
  '071000013': { name: 'First National Bank', fedNow: false, rtp: true, status: 'active' },
  '999999999': { name: 'Test Bank', fedNow: false, rtp: false, status: 'inactive' },
};

// Recent beneficiaries with transaction history
const recentBeneficiaries = [
  {
    id: 'BEN-001', name: 'Acme Corp', rtn: '021000021', account: '****4521', bank: 'JPMorgan Chase',
    lastPayment: '2024-01-10', totalSent: 450000, transactionCount: 12,
    history: [
      { id: 'PAY-101', amount: 25000, date: '2024-01-10', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-089', amount: 25000, date: '2023-12-08', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-076', amount: 30000, date: '2023-11-03', status: 'completed', rail: 'RTP' },
      { id: 'PAY-054', amount: 25000, date: '2023-09-22', status: 'rejected', rail: 'FedNow', reason: 'Exceeds daily limit' },
    ]
  },
  {
    id: 'BEN-002', name: 'TechFlow Inc', rtn: '021000089', account: '****7832', bank: 'Citibank',
    lastPayment: '2024-01-12', totalSent: 127500, transactionCount: 8,
    history: [
      { id: 'PAY-098', amount: 8500, date: '2024-01-12', status: 'completed', rail: 'RTP' },
      { id: 'PAY-085', amount: 12000, date: '2023-11-28', status: 'completed', rail: 'RTP' },
      { id: 'PAY-071', amount: 8500, date: '2023-10-14', status: 'cancelled', rail: 'RTP', reason: 'Duplicate payment' },
    ]
  },
  {
    id: 'BEN-003', name: 'Global Services LLC', rtn: '026009593', account: '****9012', bank: 'Bank of America',
    lastPayment: '2024-01-05', totalSent: 1250000, transactionCount: 5,
    history: [
      { id: 'PAY-095', amount: 450000, date: '2024-01-05', status: 'pending_approval', rail: 'FedNow' },
      { id: 'PAY-062', amount: 200000, date: '2023-10-18', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-048', amount: 350000, date: '2023-08-25', status: 'completed', rail: 'FedNow' },
    ]
  },
  {
    id: 'BEN-004', name: 'DataSync Partners', rtn: '021000021', account: '****3456', bank: 'JPMorgan Chase',
    lastPayment: '2024-01-16', totalSent: 45000, transactionCount: 18,
    history: [
      { id: 'PAY-004', amount: 2500, date: '2024-01-16', status: 'completed', rail: 'RTP' },
      { id: 'PAY-099', amount: 2500, date: '2024-01-02', status: 'completed', rail: 'RTP' },
      { id: 'PAY-092', amount: 2500, date: '2023-12-18', status: 'completed', rail: 'RTP' },
    ]
  },
  {
    id: 'BEN-005', name: 'CloudNet Systems', rtn: '021000089', account: '****7890', bank: 'Citibank',
    lastPayment: '2024-01-12', totalSent: 225000, transactionCount: 4,
    history: [
      { id: 'PAY-005', amount: 75000, date: '2024-01-12', status: 'rejected', rail: 'FedNow', reason: 'Exceeds velocity limit' },
      { id: 'PAY-067', amount: 50000, date: '2023-10-20', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-045', amount: 100000, date: '2023-08-05', status: 'cancelled', rail: 'RTP', reason: 'Incorrect amount' },
    ]
  },
  {
    id: 'BEN-006', name: 'Meridian Capital Group', rtn: '021000021', account: '****8877', bank: 'JPMorgan Chase',
    lastPayment: '2024-01-17', totalSent: 1540000, transactionCount: 6,
    history: [
      { id: 'PAY-007', amount: 385000, date: '2024-01-17', status: 'pending_approval', rail: 'FedNow' },
      { id: 'PAY-072', amount: 320000, date: '2023-11-22', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-058', amount: 285000, date: '2023-09-18', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-041', amount: 250000, date: '2023-07-12', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-029', amount: 300000, date: '2023-05-08', status: 'completed', rail: 'FedNow' },
    ]
  },
  {
    id: 'BEN-007', name: 'Titan Industrial Corp', rtn: '026009593', account: '****2299', bank: 'Bank of America',
    lastPayment: '2024-01-09', totalSent: 2850000, transactionCount: 8,
    history: [
      { id: 'PAY-008', amount: 520000, date: '2024-01-09', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-068', amount: 480000, date: '2023-11-10', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-055', amount: 350000, date: '2023-09-15', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-042', amount: 420000, date: '2023-07-28', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-033', amount: 380000, date: '2023-06-02', status: 'rejected', rail: 'FedNow', reason: 'Insufficient funds in source account' },
      { id: 'PAY-021', amount: 700000, date: '2023-04-10', status: 'completed', rail: 'FedNow' },
    ]
  },
  {
    id: 'BEN-008', name: 'Pinnacle Supplies Co', rtn: '031101279', account: '****6644', bank: 'Capital One',
    lastPayment: '2024-01-18', totalSent: 620000, transactionCount: 5,
    history: [
      { id: 'PAY-006', amount: 185000, date: '2024-01-15', status: 'pending_approval', rail: 'FedNow' },
      { id: 'PAY-082', amount: 145000, date: '2023-12-05', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-064', amount: 130000, date: '2023-11-01', status: 'completed', rail: 'FedNow' },
      { id: 'PAY-051', amount: 160000, date: '2023-09-28', status: 'completed', rail: 'FedNow' },
    ]
  },
  {
    id: 'BEN-009', name: 'Northwest Medical Group', rtn: '021000089', account: '****4455', bank: 'Citibank',
    lastPayment: '2024-01-14', totalSent: 126000, transactionCount: 3,
    history: [
      { id: 'PAY-009', amount: 42000, date: '2024-01-14', status: 'completed', rail: 'RTP' },
      { id: 'PAY-078', amount: 42000, date: '2023-12-14', status: 'completed', rail: 'RTP' },
      { id: 'PAY-059', amount: 42000, date: '2023-11-14', status: 'completed', rail: 'RTP' },
    ]
  },
];

// Utility Components
const StatusBadge = ({ status }) => {
  const styles = {
    pending_approval: 'bg-amber-100 text-amber-800 border-amber-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    paused: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const labels = {
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    completed: 'Completed',
    rejected: 'Rejected',
    active: 'Active',
    paused: 'Paused',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

const RailBadge = ({ rail }) => {
  const isRTP = rail === 'RTP';
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded ${isRTP ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
      {rail}
    </span>
  );
};

const InstructionTypeBadge = ({ type }) => {
  const isAccountHolder = type === 'account_holder';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
      isAccountHolder
        ? 'bg-violet-50 text-violet-700 border-violet-200'
        : 'bg-slate-50 text-slate-600 border-slate-200'
    }`}>
      {isAccountHolder ? <UserCheck className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
      {isAccountHolder ? 'Acct Holder' : 'Bank-Initiated'}
    </span>
  );
};

// Main Application
export default function PaymentControlModule() {
  const [activeTab, setActiveTab] = useState('payments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [approvalPayment, setApprovalPayment] = useState(null);
  const [rejectPayment, setRejectPayment] = useState(null);
  const [dismissingDetail, setDismissingDetail] = useState(false);
  const [notifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle opening approval modal (appears behind detail modal, then detail fades)
  const handleOpenApproval = (payment, verificationType) => {
    setApprovalPayment({ payment, verificationType });
    setDismissingDetail(true);
    setTimeout(() => { setSelectedPayment(null); setDismissingDetail(false); }, 400);
  };

  // Handle opening reject modal (appears behind detail modal, then detail fades)
  const handleOpenReject = (payment) => {
    setRejectPayment(payment);
    setDismissingDetail(true);
    setTimeout(() => { setSelectedPayment(null); setDismissingDetail(false); }, 400);
  };

  // Handle closing approval modal
  const handleCloseApproval = () => {
    setApprovalPayment(null);
  };

  // Handle closing reject modal
  const handleCloseReject = () => {
    setRejectPayment(null);
  };

  // Handle approval complete
  const handleApprovalComplete = () => {
    setApprovalPayment(null);
  };

  // Handle reject complete
  const handleRejectComplete = () => {
    setRejectPayment(null);
  };

  const cpmSubTabs = [
    { id: 'payments', label: 'Payments', icon: Send },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'controls', label: 'Controls', icon: Shield },
    { id: 'audit', label: 'Audit Log', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg">PayControl</h1>
              <p className="text-xs text-slate-400">Payment Module</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <div className="mb-2 px-3 py-2">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">CPM</span>
            </div>
          </div>
          <ul className="space-y-1 ml-2">
            {cpmSubTabs.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                    activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Justin Davis</p>
              <p className="text-xs text-slate-400">Treasury Admin</p>
            </div>
            <Settings className="w-5 h-5 text-slate-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                CPM — {cpmSubTabs.find(n => n.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-500">FedNow & RTP Payment Control System</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewPayment(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                New Payment
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700">Mark all read</button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              notif.type === 'approval' ? 'bg-amber-100' : notif.type === 'completed' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {notif.type === 'approval' && <Clock className="w-4 h-4 text-amber-600" />}
                              {notif.type === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {notif.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                              <p className="text-sm text-gray-500">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'payments' && <PaymentsList payments={mockPayments} onSelectPayment={setSelectedPayment} />}
          {activeTab === 'templates' && <TemplatesView />}
          {activeTab === 'controls' && <ControlsPanel />}
          {activeTab === 'audit' && <AuditLog logs={mockAuditLogs} />}
          {activeTab === 'notifications' && <NotificationSettings />}
        </div>
      </main>

      {showNewPayment && <NewPaymentModal onClose={() => setShowNewPayment(false)} />}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => { setSelectedPayment(null); setDismissingDetail(false); }}
          onOpenApproval={handleOpenApproval}
          onOpenReject={handleOpenReject}
          dismissing={dismissingDetail}
        />
      )}
      {approvalPayment && (
        <ApprovalVerificationModal
          payment={approvalPayment.payment}
          verificationType={approvalPayment.verificationType}
          onClose={handleCloseApproval}
          onApprove={handleApprovalComplete}
        />
      )}
      {rejectPayment && (
        <RejectModal
          payment={rejectPayment}
          onClose={handleCloseReject}
          onReject={handleRejectComplete}
        />
      )}
    </div>
  );
}

// Templates View Component with full modal functionality
function TemplatesView() {
  const [templates, setTemplates] = useState(mockTemplates);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleToggleStatus = (id) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, status: t.status === 'active' ? 'paused' : 'active' } : t
    ));
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSaveEdit = (updatedTemplate) => {
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setShowEditModal(null);
  };

  const handleCreate = (newTemplate) => {
    const id = `TPL-${String(templates.length + 1).padStart(3, '0')}`;
    setTemplates([...templates, { ...newTemplate, id, status: 'active' }]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    <StatusBadge status={template.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{template.recipient}{template.defaultAmount ? ` • $${template.defaultAmount.toLocaleString()} (default)` : ''} • {template.frequency}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-gray-400">ID: {template.id}</span>
                    <RailBadge rail={template.rail} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowViewModal(template)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                <button onClick={() => setShowEditModal(template)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Copy className="w-4 h-4" /></button>
                <button onClick={() => handleToggleStatus(template.id)} className={`p-2 rounded-lg ${template.status === 'active' ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                  {template.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => setShowDeleteConfirm(template)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{template.controls.maxAmount ? `Max: $${template.controls.maxAmount.toLocaleString()}` : 'No max limit'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{template.controls.requireApproval ? 'Approval Required' : 'Auto-approve'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Editable:</span>
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Amount</span>
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Memo</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && <TemplateModal mode="create" onClose={() => setShowCreateModal(false)} onSave={handleCreate} />}
      {showViewModal && <TemplateModal mode="view" template={showViewModal} onClose={() => setShowViewModal(null)} />}
      {showEditModal && <TemplateModal mode="edit" template={showEditModal} onClose={() => setShowEditModal(null)} onSave={handleSaveEdit} />}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Template</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{showDeleteConfirm.name}"? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Template Modal Component
function TemplateModal({ mode, template, onClose, onSave }) {
  const [formData, setFormData] = useState(template || {
    name: '', recipient: '', recipientRtn: '', recipientAccount: '', fromAccount: '', fromAccountManual: '', defaultAmount: '', rail: 'FedNow', nextRun: '', frequency: 'Monthly', memo: '', controls: { maxAmount: '', requireApproval: true }, editableFields: ['amount', 'memo']
  });
  const [rtnStatus, setRtnStatus] = useState(null);
  const [rtnChecking, setRtnChecking] = useState(false);
  const [fromAccountStatus, setFromAccountStatus] = useState(null);
  const [fromAccountChecking, setFromAccountChecking] = useState(false);
  const [pennyTestStatus, setPennyTestStatus] = useState(null);
  const [pennyTestRunning, setPennyTestRunning] = useState(false);

  const isView = mode === 'view';
  const title = mode === 'create' ? 'Create Template' : mode === 'edit' ? 'Edit Template' : 'Template Details';

  // Check RTN on mount if editing/viewing with existing RTN
  useState(() => {
    if (formData.recipientRtn && formData.recipientRtn.length === 9) {
      const result = rtnDatabase[formData.recipientRtn];
      if (result) setRtnStatus(result);
    }
  });

  const checkRtn = (rtn) => {
    if (rtn.length !== 9) { setRtnStatus(null); return; }
    setRtnChecking(true);
    setTimeout(() => {
      const result = rtnDatabase[rtn];
      setRtnStatus(result || { name: 'Unknown Institution', fedNow: false, rtp: false, status: 'not_found' });
      setRtnChecking(false);
    }, 800);
  };

  const handleRtnChange = (rtn) => {
    setFormData({ ...formData, recipientRtn: rtn });
    setPennyTestStatus(null);
    if (rtn.length === 9) checkRtn(rtn);
    else setRtnStatus(null);
  };

  // FROM account validation (manual entry)
  const validateFromAccount = (accountNum) => {
    if (!accountNum || accountNum.length < 4) { setFromAccountStatus(null); return; }
    setFromAccountChecking(true);
    setTimeout(() => {
      const mockAccounts = {
        '1234': { valid: true, name: 'Operating Account', balance: 2500000, type: 'account' },
        '5678': { valid: true, name: 'Payroll Account', balance: 850000, type: 'account' },
        '9012': { valid: true, name: 'Reserve Account', balance: 5000000, type: 'account' },
        'GL50100': { valid: true, name: 'GL-50100 - Accounts Payable', balance: null, type: 'gl' },
        'GL50200': { valid: true, name: 'GL-50200 - Vendor Payments', balance: null, type: 'gl' },
      };
      const match = Object.entries(mockAccounts).find(([key]) => accountNum.toUpperCase().includes(key));
      if (match) { setFromAccountStatus(match[1]); }
      else { setFromAccountStatus({ valid: false, name: 'Account not found', balance: null }); }
      setFromAccountChecking(false);
    }, 600);
  };

  // Penny test
  const runPennyTest = () => {
    if (!formData.recipientRtn || !formData.recipientAccount) return;
    setPennyTestRunning(true);
    setPennyTestStatus(null);
    setTimeout(() => {
      const isValid = rtnStatus?.status === 'active' && formData.recipientAccount.length >= 4;
      setPennyTestStatus({
        success: isValid,
        message: isValid ? 'Account verified — $0.01 test transaction successful' : 'Account verification failed — unable to reach endpoint',
        timestamp: new Date().toLocaleTimeString()
      });
      setPennyTestRunning(false);
    }, 2000);
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      fromAccount: formData.fromAccount || formData.fromAccountManual,
      defaultAmount: formData.defaultAmount ? (parseFloat(String(formData.defaultAmount).replace(/,/g, '')) || 0) : '',
      controls: {
        ...formData.controls,
        maxAmount: formData.controls.maxAmount ? (parseFloat(String(formData.controls.maxAmount).replace(/,/g, '')) || 0) : ''
      },
      editableFields: ['amount', 'memo']
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>
        <div className="p-6 space-y-4 flex-1 min-h-0 overflow-y-auto">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={isView} placeholder="e.g., Monthly Vendor Payment" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50" />
          </div>

          {/* FROM Section */}
          <div className="p-4 rounded-xl border bg-blue-50 border-blue-100">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4" /> FROM (Originator)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800">{INSTITUTION_NAME}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RTN</label>
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800">{INSTITUTION_RTN}</div>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account / GL</label>
              {isView ? (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800">{formData.fromAccount || formData.fromAccountManual || '—'}</div>
              ) : (
                <div className="space-y-2">
                  <select
                    value={formData.fromAccount}
                    onChange={e => {
                      setFormData({ ...formData, fromAccount: e.target.value, fromAccountManual: '' });
                      setFromAccountStatus(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="">Select from list or enter manually below...</option>
                    <optgroup label="Accounts">
                      {fromAccounts.filter(a => a.type === 'account').map(acc => (
                        <option key={acc.id} value={acc.name}>{acc.name} ({acc.number}){acc.balance !== null ? ` - $${acc.balance.toLocaleString()}` : ''}</option>
                      ))}
                    </optgroup>
                    <optgroup label="General Ledger">
                      {fromAccounts.filter(a => a.type === 'gl').map(acc => (
                        <option key={acc.id} value={acc.name}>{acc.name}</option>
                      ))}
                    </optgroup>
                  </select>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span>or enter manually</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.fromAccountManual}
                      onChange={e => {
                        setFormData({ ...formData, fromAccountManual: e.target.value, fromAccount: '' });
                        validateFromAccount(e.target.value);
                      }}
                      placeholder="Enter account number or GL code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white"
                    />
                    {fromAccountChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
                  </div>
                  {fromAccountStatus && (
                    <div className={`p-2 rounded-lg text-sm ${fromAccountStatus.valid ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {fromAccountStatus.valid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className={fromAccountStatus.valid ? 'text-green-800' : 'text-red-800'}>{fromAccountStatus.name}</span>
                        </div>
                        {fromAccountStatus.valid && fromAccountStatus.balance !== null && (
                          <span className="text-green-700 font-medium">Balance: ${fromAccountStatus.balance.toLocaleString()}</span>
                        )}
                        {fromAccountStatus.valid && fromAccountStatus.type === 'gl' && (
                          <span className="text-green-600 text-xs">General Ledger</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TO Section */}
          <div className="p-4 rounded-xl border bg-green-50 border-green-100">
            <h4 className="font-semibold text-green-800 flex items-center gap-2 mb-3">
              <Send className="w-4 h-4" /> TO (Beneficiary)
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input type="text" value={formData.recipient} onChange={e => setFormData({ ...formData, recipient: e.target.value })} disabled={isView} placeholder="Enter recipient name" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white disabled:bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient RTN</label>
                  {isView ? (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-800">{formData.recipientRtn}</div>
                  ) : (
                    <div className="relative">
                      <input type="text" value={formData.recipientRtn} onChange={e => handleRtnChange(e.target.value)} maxLength={9} placeholder="9-digit RTN" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white" />
                      {rtnChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
                    </div>
                  )}
                  {rtnStatus && !isView && (
                    <div className={`mt-2 p-2 rounded text-xs ${rtnStatus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      <div className="font-medium">{rtnStatus.name}</div>
                      {rtnStatus.status === 'active' && (
                        <div className="flex gap-2 mt-1">
                          {rtnStatus.fedNow && <span className="px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded">FedNow ✓</span>}
                          {rtnStatus.rtp && <span className="px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">RTP ✓</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="text" value={formData.recipientAccount} onChange={e => { setFormData({ ...formData, recipientAccount: e.target.value }); setPennyTestStatus(null); }} disabled={isView} placeholder="Account number" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white disabled:bg-gray-50" />
                </div>
              </div>

              {/* Penny Test */}
              {!isView && formData.recipientRtn && formData.recipientAccount && (
                <div className="border-t border-green-200 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Endpoint Validation</p>
                      <p className="text-xs text-gray-500">Send $0.01 test transaction to verify account</p>
                    </div>
                    <button
                      onClick={runPennyTest}
                      disabled={pennyTestRunning || rtnStatus?.status !== 'active'}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {pennyTestRunning ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Testing...</>
                      ) : (
                        <><Zap className="w-4 h-4" />Run Penny Test</>
                      )}
                    </button>
                  </div>
                  {pennyTestStatus && (
                    <div className={`mt-2 p-3 rounded-lg flex items-start gap-2 ${pennyTestStatus.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                      {pennyTestStatus.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${pennyTestStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                          {pennyTestStatus.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Tested at {pennyTestStatus.timestamp}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Amount <span className="text-xs text-blue-500 font-normal">(editable at payment)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="text" value={formData.defaultAmount} onChange={e => setFormData({ ...formData, defaultAmount: e.target.value })} disabled={isView} placeholder="e.g., 25000" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Pre-filled but can be changed when creating payment</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Rail <span className="text-xs text-gray-400 font-normal">(fixed)</span></label>
              <select value={formData.rail} onChange={e => setFormData({ ...formData, rail: e.target.value })} disabled={isView} className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50">
                <option>FedNow</option><option>RTP</option><option>Auto-route</option>
              </select>
            </div>
          </div>

          {/* Memo field - editable at payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Memo <span className="text-xs text-blue-500 font-normal">(editable at payment)</span>
            </label>
            <input type="text" value={formData.memo || ''} onChange={e => setFormData({ ...formData, memo: e.target.value })} disabled={isView} placeholder="e.g., Monthly invoice payment" className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" />
            <p className="text-xs text-gray-400 mt-1">Pre-filled but can be changed when creating payment</p>
          </div>

          {/* Fixed Fields Notice */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Fixed fields:</span> Recipient, Account, RTN, From Account, Rail, Frequency
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-medium text-blue-600">Editable at payment:</span> Amount, Memo
            </p>
          </div>

          {/* Template Controls */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Template Controls</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Maximum Amount Override <span className="text-xs text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="text" value={formData.controls?.maxAmount || ''} onChange={e => setFormData({ ...formData, controls: { ...formData.controls, maxAmount: e.target.value } })} disabled={isView} placeholder="No limit" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Leave blank for no maximum override</p>
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={formData.controls?.requireApproval} onChange={e => setFormData({ ...formData, controls: { ...formData.controls, requireApproval: e.target.checked } })} disabled={isView} className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Require approval before each execution</span>
              </label>
            </div>
          </div>

          {/* Approval Verification Type */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-800 mb-3">Approval Verification Type</h4>
            <p className="text-xs text-gray-500 mb-3">Override default verification requirements for this template</p>
            <div className="space-y-2">
              {[
                { id: 'default', label: 'Use Default (based on amount thresholds)', desc: 'Apply system-wide verification rules' },
                { id: 'sight', label: 'Sight Approval Only', desc: 'Review and approve without re-entry' },
                { id: 'amount', label: 'Amount Verification', desc: 'Require amount re-entry' },
                { id: 'full', label: 'Full Verification', desc: 'Require amount, account, and RTN re-entry' },
              ].map(opt => (
                <label key={opt.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${formData.controls?.approvalType === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="approvalType" checked={formData.controls?.approvalType === opt.id || (!formData.controls?.approvalType && opt.id === 'default')} onChange={() => setFormData({ ...formData, controls: { ...formData.controls, approvalType: opt.id } })} disabled={isView} className="mt-1 w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">{isView ? 'Close' : 'Cancel'}</button>
          {!isView && <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{mode === 'create' ? 'Create Template' : 'Save Changes'}</button>}
        </div>
      </div>
      </div>
    </div>
  );
}

// Controls Panel - reorganized with side-by-side instruction type comparison
function ControlsPanel() {
  const [activeControlTab, setActiveControlTab] = useState('limits');
  const [timeControlsEnabled, setTimeControlsEnabled] = useState(true);
  const [instructionTypeEnabled, setInstructionTypeEnabled] = useState(true);
  const [editingThreshold, setEditingThreshold] = useState(null); // { typeId, id }
  const [showAddThreshold, setShowAddThreshold] = useState(null); // typeId or null
  const [newThreshold, setNewThreshold] = useState({ minAmount: '', maxAmount: '', approvers: '1', label: '' });

  // --- Constants ---
  const instructionTypes = [
    { id: 'bank_initiated', label: 'Bank-Initiated', short: 'Bank-Init.', icon: Building2 },
    { id: 'acct_commercial', label: 'Acct Holder — Commercial', short: 'Commercial', icon: Hash },
    { id: 'acct_individual', label: 'Acct Holder — Individual', short: 'Individual', icon: Users },
  ];

  const globalType = { id: 'global', label: 'All Instruction Types', short: 'Global', icon: Shield };
  const activeTypes = instructionTypeEnabled ? instructionTypes : [globalType];

  const typeColors = {
    global: { topBorder: 'border-t-gray-400', headerBg: 'bg-gray-100', headerText: 'text-gray-700', headerBorder: 'border-gray-200', dot: 'bg-gray-500', light: 'bg-gray-50 text-gray-700 border-gray-200' },
    bank_initiated: { topBorder: 'border-t-indigo-500', headerBg: 'bg-indigo-50', headerText: 'text-indigo-800', headerBorder: 'border-indigo-100', dot: 'bg-indigo-500', light: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    acct_commercial: { topBorder: 'border-t-emerald-500', headerBg: 'bg-emerald-50', headerText: 'text-emerald-800', headerBorder: 'border-emerald-100', dot: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    acct_individual: { topBorder: 'border-t-violet-500', headerBg: 'bg-violet-50', headerText: 'text-violet-800', headerBorder: 'border-violet-100', dot: 'bg-violet-500', light: 'bg-violet-50 text-violet-700 border-violet-200' },
  };

  const userRoles = [
    { id: 'payments_analyst', label: 'Payments Analyst', short: 'Analyst' },
    { id: 'sr_payments_analyst', label: 'Sr. Payments Analyst', short: 'Sr. Analyst' },
    { id: 'payments_manager', label: 'Payments Manager', short: 'Manager' },
    { id: 'treasury_director', label: 'Treasury Director', short: 'Director' },
    { id: 'cfo', label: 'CFO', short: 'CFO' },
  ];

  // --- Data: Global Amount Limits ---
  const globalLimits = {
    global: { maxSingle: '500,000', daily: '1,000,000', weekly: '5,000,000', monthly: '20,000,000' },
    bank_initiated: { maxSingle: '500,000', daily: '1,000,000', weekly: '5,000,000', monthly: '20,000,000' },
    acct_commercial: { maxSingle: '250,000', daily: '500,000', weekly: '2,000,000', monthly: '8,000,000' },
    acct_individual: { maxSingle: '100,000', daily: '250,000', weekly: '1,000,000', monthly: '4,000,000' },
  };

  // --- Data: Per-Role Initiation Limits ---
  const roleLimitsData = {
    global: [
      { roleId: 'payments_analyst', maxSingle: '50,000', daily: '200,000', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '250,000', daily: '750,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '500,000', daily: '1,000,000', enabled: false },
      { roleId: 'treasury_director', maxSingle: '500,000', daily: '1,000,000', enabled: false },
      { roleId: 'cfo', maxSingle: '500,000', daily: '1,000,000', enabled: false },
    ],
    bank_initiated: [
      { roleId: 'payments_analyst', maxSingle: '50,000', daily: '200,000', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '250,000', daily: '750,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '500,000', daily: '1,000,000', enabled: false },
      { roleId: 'treasury_director', maxSingle: '500,000', daily: '1,000,000', enabled: false },
      { roleId: 'cfo', maxSingle: '500,000', daily: '1,000,000', enabled: false },
    ],
    acct_commercial: [
      { roleId: 'payments_analyst', maxSingle: '25,000', daily: '100,000', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '100,000', daily: '300,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '250,000', daily: '500,000', enabled: false },
      { roleId: 'treasury_director', maxSingle: '250,000', daily: '500,000', enabled: false },
      { roleId: 'cfo', maxSingle: '250,000', daily: '500,000', enabled: false },
    ],
    acct_individual: [
      { roleId: 'payments_analyst', maxSingle: '10,000', daily: '50,000', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '50,000', daily: '150,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '100,000', daily: '250,000', enabled: false },
      { roleId: 'treasury_director', maxSingle: '100,000', daily: '250,000', enabled: false },
      { roleId: 'cfo', maxSingle: '100,000', daily: '250,000', enabled: false },
    ],
  };

  // --- Data: Approval Thresholds (payment-level) ---
  const [approvalThresholds, setApprovalThresholds] = useState({
    global: [
      { id: 1, minAmount: '', maxAmount: '10000', approvers: '0', label: 'Auto-approve' },
      { id: 2, minAmount: '10000', maxAmount: '50000', approvers: '1', label: '' },
      { id: 3, minAmount: '50000', maxAmount: '250000', approvers: '2', label: '' },
      { id: 4, minAmount: '250000', maxAmount: '', approvers: '3', label: 'Treasury Head required' },
    ],
    bank_initiated: [
      { id: 1, minAmount: '', maxAmount: '10000', approvers: '0', label: 'Auto-approve' },
      { id: 2, minAmount: '10000', maxAmount: '50000', approvers: '1', label: '' },
      { id: 3, minAmount: '50000', maxAmount: '250000', approvers: '2', label: '' },
      { id: 4, minAmount: '250000', maxAmount: '', approvers: '3', label: 'Treasury Head required' },
    ],
    acct_commercial: [
      { id: 1, minAmount: '', maxAmount: '5000', approvers: '1', label: 'Manager approval' },
      { id: 2, minAmount: '5000', maxAmount: '50000', approvers: '2', label: '' },
      { id: 3, minAmount: '50000', maxAmount: '', approvers: '3', label: 'Treasury Head + CFO' },
    ],
    acct_individual: [
      { id: 1, minAmount: '', maxAmount: '2500', approvers: '1', label: '' },
      { id: 2, minAmount: '2500', maxAmount: '25000', approvers: '2', label: '' },
      { id: 3, minAmount: '25000', maxAmount: '', approvers: '3', label: 'Treasury Head required' },
    ],
  });

  // --- Data: Per-Role Approval Limits ---
  const roleApprovalLimitsData = {
    global: [
      { roleId: 'payments_analyst', maxSingle: '0', daily: '0', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '50,000', daily: '200,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '250,000', daily: '750,000', enabled: true },
      { roleId: 'treasury_director', maxSingle: '500,000', daily: '1,000,000', enabled: false },
      { roleId: 'cfo', maxSingle: '500,000', daily: '1,000,000', enabled: false },
    ],
    bank_initiated: [
      { roleId: 'payments_analyst', maxSingle: '0', daily: '0', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '50,000', daily: '200,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '250,000', daily: '750,000', enabled: true },
      { roleId: 'treasury_director', maxSingle: '500,000', daily: '1,000,000', enabled: false },
      { roleId: 'cfo', maxSingle: '500,000', daily: '1,000,000', enabled: false },
    ],
    acct_commercial: [
      { roleId: 'payments_analyst', maxSingle: '0', daily: '0', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '25,000', daily: '100,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '100,000', daily: '300,000', enabled: true },
      { roleId: 'treasury_director', maxSingle: '250,000', daily: '500,000', enabled: false },
      { roleId: 'cfo', maxSingle: '250,000', daily: '500,000', enabled: false },
    ],
    acct_individual: [
      { roleId: 'payments_analyst', maxSingle: '0', daily: '0', enabled: true },
      { roleId: 'sr_payments_analyst', maxSingle: '10,000', daily: '50,000', enabled: true },
      { roleId: 'payments_manager', maxSingle: '50,000', daily: '150,000', enabled: true },
      { roleId: 'treasury_director', maxSingle: '100,000', daily: '250,000', enabled: false },
      { roleId: 'cfo', maxSingle: '100,000', daily: '250,000', enabled: false },
    ],
  };

  // --- Data: Velocity Limits ---
  const velocityGlobal = {
    global: { maxHour: '20', maxDay: '100', maxSameRecipient: '5', alertPct: '80', senderMaxHour: '10', senderMaxDay: '50', senderMaxAmount: '500,000' },
    bank_initiated: { maxHour: '10', maxDay: '50', maxSameRecipient: '3', alertPct: '80', senderMaxHour: '8', senderMaxDay: '40', senderMaxAmount: '500,000' },
    acct_commercial: { maxHour: '20', maxDay: '100', maxSameRecipient: '5', alertPct: '80', senderMaxHour: '10', senderMaxDay: '50', senderMaxAmount: '250,000' },
    acct_individual: { maxHour: '30', maxDay: '150', maxSameRecipient: '5', alertPct: '75', senderMaxHour: '5', senderMaxDay: '25', senderMaxAmount: '100,000' },
  };

  const velocityRoleLimits = {
    global: [
      { roleId: 'payments_analyst', maxHour: '10', maxDay: '40', enabled: true },
      { roleId: 'sr_payments_analyst', maxHour: '15', maxDay: '60', enabled: true },
      { roleId: 'payments_manager', maxHour: '20', maxDay: '100', enabled: false },
      { roleId: 'treasury_director', maxHour: '20', maxDay: '100', enabled: false },
      { roleId: 'cfo', maxHour: '20', maxDay: '100', enabled: false },
    ],
    bank_initiated: [
      { roleId: 'payments_analyst', maxHour: '5', maxDay: '20', enabled: true },
      { roleId: 'sr_payments_analyst', maxHour: '10', maxDay: '40', enabled: true },
      { roleId: 'payments_manager', maxHour: '10', maxDay: '50', enabled: false },
      { roleId: 'treasury_director', maxHour: '10', maxDay: '50', enabled: false },
      { roleId: 'cfo', maxHour: '10', maxDay: '50', enabled: false },
    ],
    acct_commercial: [
      { roleId: 'payments_analyst', maxHour: '10', maxDay: '40', enabled: true },
      { roleId: 'sr_payments_analyst', maxHour: '15', maxDay: '60', enabled: true },
      { roleId: 'payments_manager', maxHour: '20', maxDay: '100', enabled: false },
      { roleId: 'treasury_director', maxHour: '20', maxDay: '100', enabled: false },
      { roleId: 'cfo', maxHour: '20', maxDay: '100', enabled: false },
    ],
    acct_individual: [
      { roleId: 'payments_analyst', maxHour: '15', maxDay: '60', enabled: true },
      { roleId: 'sr_payments_analyst', maxHour: '25', maxDay: '100', enabled: true },
      { roleId: 'payments_manager', maxHour: '30', maxDay: '150', enabled: false },
      { roleId: 'treasury_director', maxHour: '30', maxDay: '150', enabled: false },
      { roleId: 'cfo', maxHour: '30', maxDay: '150', enabled: false },
    ],
  };

  // --- Data: Role Permissions ---
  const rolePermissions = {
    global: [
      { role: 'Analyst', initiate: true, approve: false, edit: false, cancel: false, templates: false, controls: false },
      { role: 'Sr. Analyst', initiate: true, approve: true, edit: false, cancel: false, templates: true, controls: false },
      { role: 'Manager', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: false },
      { role: 'Director', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
      { role: 'CFO', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
    ],
    bank_initiated: [
      { role: 'Analyst', initiate: true, approve: false, edit: false, cancel: false, templates: false, controls: false },
      { role: 'Sr. Analyst', initiate: true, approve: true, edit: false, cancel: false, templates: true, controls: false },
      { role: 'Manager', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: false },
      { role: 'Director', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
      { role: 'CFO', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
    ],
    acct_commercial: [
      { role: 'Analyst', initiate: true, approve: false, edit: false, cancel: false, templates: false, controls: false },
      { role: 'Sr. Analyst', initiate: true, approve: true, edit: false, cancel: true, templates: false, controls: false },
      { role: 'Manager', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: false },
      { role: 'Director', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
      { role: 'CFO', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
    ],
    acct_individual: [
      { role: 'Analyst', initiate: true, approve: false, edit: false, cancel: false, templates: false, controls: false },
      { role: 'Sr. Analyst', initiate: true, approve: false, edit: false, cancel: true, templates: false, controls: false },
      { role: 'Manager', initiate: true, approve: true, edit: true, cancel: true, templates: false, controls: false },
      { role: 'Director', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
      { role: 'CFO', initiate: true, approve: true, edit: true, cancel: true, templates: true, controls: true },
    ],
  };

  // --- Data: Time-Based ---
  const timeDefaults = {
    global: { fedStart: '06:00', fedEnd: '22:00', rtpStart: '00:00', rtpEnd: '23:59' },
    bank_initiated: { fedStart: '06:00', fedEnd: '22:00', rtpStart: '00:00', rtpEnd: '23:59' },
    acct_commercial: { fedStart: '08:00', fedEnd: '18:00', rtpStart: '06:00', rtpEnd: '22:00' },
    acct_individual: { fedStart: '08:00', fedEnd: '20:00', rtpStart: '06:00', rtpEnd: '22:00' },
  };

  // --- Helpers ---
  const formatAmount = (val) => {
    if (!val) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
    return `$${num.toLocaleString()}`;
  };

  const getThresholdColor = (approvers) => {
    const n = parseInt(approvers) || 0;
    if (n === 0) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-800' };
    if (n === 1) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' };
    if (n === 2) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' };
  };

  // --- Threshold CRUD (now takes typeId) ---
  const addThresholdForType = (typeId) => {
    const thresholds = [...approvalThresholds[typeId]];
    const id = Math.max(...thresholds.map(t => t.id), 0) + 1;
    const updated = [...thresholds, { ...newThreshold, id }].sort((a, b) => (parseFloat(a.minAmount) || 0) - (parseFloat(b.minAmount) || 0));
    setApprovalThresholds(prev => ({ ...prev, [typeId]: updated }));
    setNewThreshold({ minAmount: '', maxAmount: '', approvers: '1', label: '' });
    setShowAddThreshold(null);
  };

  const updateThreshold = (typeId, id, field, value) => {
    const updated = approvalThresholds[typeId].map(t => t.id === id ? { ...t, [field]: value } : t);
    setApprovalThresholds(prev => ({ ...prev, [typeId]: updated }));
  };

  const removeThreshold = (typeId, id) => {
    if (approvalThresholds[typeId].length <= 1) return;
    const updated = approvalThresholds[typeId].filter(t => t.id !== id);
    setApprovalThresholds(prev => ({ ...prev, [typeId]: updated }));
    if (editingThreshold?.typeId === typeId && editingThreshold?.id === id) setEditingThreshold(null);
  };

  // --- Shared UI Components ---

  // Column card with colored top border and type header
  const TypeCard = ({ typeId, children, compact }) => {
    const type = instructionTypes.find(t => t.id === typeId) || globalType;
    const c = typeColors[typeId];
    const isGlobal = typeId === 'global';
    return (
      <div className={`rounded-xl border border-gray-200 overflow-hidden ${isGlobal ? '' : `border-t-4 ${c.topBorder}`}`}>
        {!isGlobal && (
          <div className={`px-3 py-2 ${c.headerBg} ${c.headerText} border-b ${c.headerBorder} flex items-center gap-2`}>
            <type.icon className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-wide">{type.short}</span>
          </div>
        )}
        <div className={compact ? 'p-3' : 'p-4'}>
          {children}
        </div>
      </div>
    );
  };

  // Section with header + TypeCards (3-col comparison or single global)
  const ComparisonSection = ({ title, description, compact, children }) => (
    <div>
      {title && <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-0.5">{title}</h4>}
      {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
      {!title && !description && <div className="mb-0" />}
      <div className={instructionTypeEnabled ? 'grid grid-cols-3 gap-3' : 'max-w-lg'}>
        {activeTypes.map(type => (
          <TypeCard key={type.id} typeId={type.id} compact={compact}>
            {children(type.id)}
          </TypeCard>
        ))}
      </div>
    </div>
  );

  // Compact labeled input
  const FieldInput = ({ label, defaultValue, prefix, type = 'text', className: cls }) => (
    <div className={cls}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{prefix}</span>}
        <input type={type} defaultValue={defaultValue} className={`w-full ${prefix ? 'pl-6' : 'pl-2.5'} pr-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:border-blue-500`} />
      </div>
    </div>
  );

  // Compact role-limits mini-table within a TypeCard
  const RoleLimitsMini = ({ data, col1Label, col2Label, col1Key, col2Key, col1Prefix, col2Prefix }) => (
    <div className="space-y-0">
      <div className="flex items-center gap-1 pb-1.5 mb-1.5 border-b border-gray-100">
        <span className="flex-1 text-xs font-medium text-gray-400">Role</span>
        <span className="w-20 text-xs font-medium text-gray-400 text-right">{col1Label}</span>
        <span className="w-20 text-xs font-medium text-gray-400 text-right">{col2Label}</span>
        <span className="w-6" />
      </div>
      {data.map(row => {
        const role = userRoles.find(r => r.id === row.roleId);
        return (
          <div key={row.roleId} className={`flex items-center gap-1 py-1 ${!row.enabled ? 'opacity-40' : ''}`}>
            <span className="flex-1 text-xs font-medium text-gray-700 truncate" title={role?.label}>{role?.short}</span>
            {row.enabled ? (
              <>
                <input type="text" defaultValue={row[col1Key]} className="w-20 px-1.5 py-0.5 text-right border border-gray-200 rounded text-xs font-mono" />
                <input type="text" defaultValue={row[col2Key]} className="w-20 px-1.5 py-0.5 text-right border border-gray-200 rounded text-xs font-mono" />
              </>
            ) : (
              <>
                <span className="w-20 text-xs text-gray-400 italic text-right">—</span>
                <span className="w-20 text-xs text-gray-400 italic text-right">—</span>
              </>
            )}
            <div className="w-6 flex justify-center">
              <div className={`w-2 h-2 rounded-full ${row.enabled ? 'bg-blue-500' : 'bg-gray-300'} cursor-pointer`} title={row.enabled ? 'Override enabled' : 'Inherits global'} />
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- Tab Definitions ---
  const controlTabs = [
    { id: 'limits', label: 'Transaction Limits', icon: DollarSign },
    { id: 'approval', label: 'Approval Workflow', icon: Shield },
    { id: 'roles', label: 'Roles & Permissions', icon: Users },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
  ];

  // =======================================================================
  // RENDER
  // =======================================================================
  return (
    <div className="space-y-6">
      {/* Instruction Type Toggle Banner */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${instructionTypeEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Shield className={`w-5 h-5 ${instructionTypeEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Instruction-Type Controls</h4>
              <p className="text-sm text-gray-500">
                {instructionTypeEnabled
                  ? 'Configure separate limits for Bank-Initiated, Commercial, and Individual payments.'
                  : 'Using unified global limits across all instruction types.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${instructionTypeEnabled ? 'text-blue-600' : 'text-gray-500'}`}>
              {instructionTypeEnabled ? 'Per-Type' : 'Global'}
            </span>
            <button
              onClick={() => setInstructionTypeEnabled(!instructionTypeEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${instructionTypeEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${instructionTypeEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
        {instructionTypeEnabled && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
            {instructionTypes.map(type => {
              const c = typeColors[type.id];
              return (
                <div key={type.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${c.light}`}>
                  <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  {type.short}
                </div>
              );
            })}
            <span className="text-xs text-gray-400 ml-2">Side-by-side comparison across all tabs</span>
          </div>
        )}
      </div>

    <div className="flex gap-6">
      {/* Left Sidebar Nav */}
      <div className="w-48 flex-shrink-0 space-y-1.5">
        {controlTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveControlTab(tab.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeControlTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* ═══════════════ TRANSACTION LIMITS ═══════════════ */}
        {activeControlTab === 'limits' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Transaction Limits</h3>
              <p className="text-sm text-gray-500">{instructionTypeEnabled ? 'Amount and velocity limits for each instruction type.' : 'Global amount and velocity limits applied to all payments.'}</p>
            </div>

            {/* Global Amount Limits */}
            <ComparisonSection title="Global Amount Limits" description="Maximum transaction amounts per period.">
              {(typeId) => (
                <div className="space-y-3">
                  <FieldInput label="Max Single Transaction" defaultValue={globalLimits[typeId].maxSingle} prefix="$" />
                  <FieldInput label="Daily Limit" defaultValue={globalLimits[typeId].daily} prefix="$" />
                  <FieldInput label="Weekly Limit" defaultValue={globalLimits[typeId].weekly} prefix="$" />
                  <FieldInput label="Monthly Limit" defaultValue={globalLimits[typeId].monthly} prefix="$" />
                </div>
              )}
            </ComparisonSection>

            {/* Global Velocity Limits */}
            <ComparisonSection title="Global Velocity Limits" description="Maximum transaction counts per time period.">
              {(typeId) => (
                <div className="space-y-3">
                  <FieldInput label="Max Transactions / Hour" defaultValue={velocityGlobal[typeId].maxHour} type="number" />
                  <FieldInput label="Max Transactions / Day" defaultValue={velocityGlobal[typeId].maxDay} type="number" />
                  <FieldInput label="Max Same-Recipient / Day" defaultValue={velocityGlobal[typeId].maxSameRecipient} type="number" />
                  <FieldInput label="Alert at % of Limit" defaultValue={velocityGlobal[typeId].alertPct} type="number" />
                </div>
              )}
            </ComparisonSection>

            {/* Sender Account Velocity */}
            <ComparisonSection title="Sender Account Velocity" description="Per-originating-account limits to prevent excessive outflows from a single source.">
              {(typeId) => (
                <div className="space-y-3">
                  <FieldInput label="Max Txns / Hour (per sender)" defaultValue={velocityGlobal[typeId].senderMaxHour} type="number" />
                  <FieldInput label="Max Txns / Day (per sender)" defaultValue={velocityGlobal[typeId].senderMaxDay} type="number" />
                  <FieldInput label="Max Daily Amount (per sender)" defaultValue={velocityGlobal[typeId].senderMaxAmount} prefix="$" />
                </div>
              )}
            </ComparisonSection>

            {/* Save footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Reset to Defaults</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        )}

        {/* ═══════════════ APPROVAL WORKFLOW ═══════════════ */}
        {activeControlTab === 'approval' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Approval Workflow</h3>
              <p className="text-sm text-gray-500">{instructionTypeEnabled ? 'Approval requirements and verification rules per instruction type.' : 'Approval requirements and verification rules for all payments.'}</p>
            </div>

            {/* Approval Thresholds */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-0.5">Approval Thresholds</h4>
              <p className="text-xs text-gray-500 mb-3">Number of approvers required based on payment amount.</p>
              <div className={instructionTypeEnabled ? 'grid grid-cols-3 gap-3' : 'max-w-lg'}>
                {activeTypes.map(type => {
                  const typeId = type.id;
                  const thresholds = approvalThresholds[typeId];
                  return (
                    <TypeCard key={typeId} typeId={typeId} compact>
                      <div className="space-y-1.5">
                        {thresholds.map(t => {
                          const colors = getThresholdColor(t.approvers);
                          const isEditing = editingThreshold?.typeId === typeId && editingThreshold?.id === t.id;
                          const rangeLabel = `${t.minAmount ? formatAmount(t.minAmount) : '$0'} — ${t.maxAmount ? formatAmount(t.maxAmount) : '∞'}`;
                          const approverCount = parseInt(t.approvers) || 0;
                          const approverLabel = approverCount === 0 ? 'Auto' : `${t.approvers}`;

                          if (isEditing) {
                            return (
                              <div key={t.id} className={`p-2.5 rounded-lg border ${colors.border} ${colors.bg}`}>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <label className="text-xs text-gray-500 mb-0.5 block">Min $</label>
                                    <input type="text" value={t.minAmount} onChange={e => updateThreshold(typeId, t.id, 'minAmount', e.target.value)} placeholder="0" className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white font-mono" />
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-0.5 block">Max $</label>
                                    <input type="text" value={t.maxAmount} onChange={e => updateThreshold(typeId, t.id, 'maxAmount', e.target.value)} placeholder="No limit" className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white font-mono" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                    <label className="text-xs text-gray-500 mb-0.5 block">Approvers</label>
                                    <select value={t.approvers} onChange={e => updateThreshold(typeId, t.id, 'approvers', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white">
                                      <option value="0">0 (Auto)</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-xs text-gray-500 mb-0.5 block">Note</label>
                                    <input type="text" value={t.label} onChange={e => updateThreshold(typeId, t.id, 'label', e.target.value)} placeholder="Optional" className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" />
                                  </div>
                                </div>
                                <div className="flex justify-between pt-1.5 border-t border-gray-200">
                                  <button onClick={() => removeThreshold(typeId, t.id)} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1" disabled={thresholds.length <= 1}>
                                    <Trash2 className="w-3 h-3" /> Remove
                                  </button>
                                  <button onClick={() => setEditingThreshold(null)} className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Done</button>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div key={t.id} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${colors.bg} border ${colors.border} hover:shadow-sm transition-shadow`} onClick={() => setEditingThreshold({ typeId, id: t.id })}>
                              <span className="text-xs font-mono text-gray-600 truncate mr-2">{rangeLabel}</span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${colors.badge}`}>{approverLabel}</span>
                                <Edit className="w-3 h-3 text-gray-400" />
                              </div>
                            </div>
                          );
                        })}

                        {/* Add threshold inline */}
                        {showAddThreshold === typeId ? (
                          <div className="p-2.5 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50">
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <label className="text-xs text-gray-500 mb-0.5 block">Min $</label>
                                <input type="text" value={newThreshold.minAmount} onChange={e => setNewThreshold({ ...newThreshold, minAmount: e.target.value })} placeholder="e.g., 100000" className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white font-mono" />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-0.5 block">Max $</label>
                                <input type="text" value={newThreshold.maxAmount} onChange={e => setNewThreshold({ ...newThreshold, maxAmount: e.target.value })} placeholder="No limit" className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white font-mono" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <label className="text-xs text-gray-500 mb-0.5 block">Approvers</label>
                                <select value={newThreshold.approvers} onChange={e => setNewThreshold({ ...newThreshold, approvers: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white">
                                  <option value="0">0 (Auto)</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 mb-0.5 block">Note</label>
                                <input type="text" value={newThreshold.label} onChange={e => setNewThreshold({ ...newThreshold, label: e.target.value })} placeholder="Optional" className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => { setShowAddThreshold(null); setNewThreshold({ minAmount: '', maxAmount: '', approvers: '1', label: '' }); }} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-600">Cancel</button>
                              <button onClick={() => addThresholdForType(typeId)} className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setShowAddThreshold(typeId)} className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600">+ Add tier</button>
                        )}
                      </div>
                    </TypeCard>
                  );
                })}
              </div>
            </div>

            {/* Verification Requirements */}
            <ComparisonSection title="Verification Requirements" description="What approvers must re-enter to verify transactions." compact>
              {(typeId) => {
                const sightMax = typeId === 'bank_initiated' ? '50,000' : typeId === 'acct_commercial' ? '25,000' : '10,000';
                const fullMin = typeId === 'bank_initiated' ? '250,000' : typeId === 'acct_commercial' ? '100,000' : '50,000';
                return (
                  <div className="space-y-2">
                    <div className="p-2.5 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">Sight Approval</span>
                        <span className="text-xs text-green-600 font-mono">≤ ${sightMax}</span>
                      </div>
                      <p className="text-xs text-gray-400">Review and click approve.</p>
                    </div>
                    <div className="p-2.5 border border-blue-200 bg-blue-50/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">Amount Verify</span>
                        <span className="text-xs text-blue-600 font-mono">${sightMax}–${fullMin}</span>
                      </div>
                      <label className="flex items-center gap-1.5 mt-1.5">
                        <input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" />
                        <span className="text-xs text-gray-600">Re-enter amount</span>
                      </label>
                    </div>
                    <div className="p-2.5 border border-amber-200 bg-amber-50/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">Full Verify</span>
                        <span className="text-xs text-amber-600 font-mono">> ${fullMin}</span>
                      </div>
                      <div className="space-y-1 mt-1.5">
                        <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" /><span className="text-xs text-gray-600">Amount</span></label>
                        <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" /><span className="text-xs text-gray-600">Account number</span></label>
                        <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" /><span className="text-xs text-gray-600">Recipient RTN</span></label>
                      </div>
                    </div>
                    <div className="p-2.5 border border-red-200 bg-red-50/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-700">New Beneficiary</span>
                      </div>
                      <div className="space-y-1 mt-1.5">
                        <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" /><span className="text-xs text-gray-600">Full details verification</span></label>
                        <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" /><span className="text-xs text-gray-600">Secondary approver</span></label>
                        {typeId !== 'bank_initiated' && (
                          <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked className="w-3 h-3 text-blue-600 rounded" /><span className="text-xs text-gray-600">Manager override</span></label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
            </ComparisonSection>

            {/* Dual Control Settings — global */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-0.5">Dual Control Settings</h4>
              <p className="text-xs text-gray-500 mb-3">Separation of duties rules applied across all instruction types.</p>
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-700">Initiator cannot approve their own payments</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-700">Require approvers from different departments for amounts over $100K</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-700">Escalate to CFO if pending approval exceeds 4 hours</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-700">Require reason when cancelling a transaction</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-700">Log all transaction edits with before/after values</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-700">Require secondary verification for account holder payments over $50K</span></label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Reset to Defaults</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        )}

        {/* ═══════════════ ROLES & PERMISSIONS ═══════════════ */}
        {activeControlTab === 'roles' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Roles & Permissions</h3>
              <p className="text-sm text-gray-500">{instructionTypeEnabled ? 'What each role can do and their individual limits per instruction type.' : 'What each role can do and their individual limits.'}</p>
            </div>

            {/* Role Permissions Matrix */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-0.5">Role Permissions</h4>
              <p className="text-xs text-gray-500 mb-3">{instructionTypeEnabled ? 'Actions each role can perform. Differences across types are highlighted.' : 'Actions each role can perform.'}</p>
              <div className={instructionTypeEnabled ? 'grid grid-cols-3 gap-3' : 'max-w-lg'}>
                {activeTypes.map(type => (
                  <TypeCard key={type.id} typeId={type.id} compact>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-1.5 text-left text-xs font-medium text-gray-400 w-16">Role</th>
                          <th className="pb-1.5 text-center text-xs font-medium text-gray-400" title="Initiate">Init</th>
                          <th className="pb-1.5 text-center text-xs font-medium text-gray-400" title="Approve">Appr</th>
                          <th className="pb-1.5 text-center text-xs font-medium text-gray-400" title="Edit Transaction">Edit</th>
                          <th className="pb-1.5 text-center text-xs font-medium text-gray-400" title="Cancel Transaction">Canc</th>
                          <th className="pb-1.5 text-center text-xs font-medium text-gray-400" title="Manage Templates">Tpl</th>
                          <th className="pb-1.5 text-center text-xs font-medium text-gray-400" title="Admin Controls">Ctrl</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rolePermissions[type.id].map(row => (
                          <tr key={row.role} className="border-b border-gray-50 last:border-0">
                            <td className="py-1 text-xs font-medium text-gray-700">{row.role}</td>
                            {['initiate', 'approve', 'edit', 'cancel', 'templates', 'controls'].map(perm => (
                              <td key={perm} className="py-1 text-center">
                                <input type="checkbox" defaultChecked={row[perm]} className="w-3.5 h-3.5 text-blue-600 rounded" />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TypeCard>
                ))}
              </div>
            </div>

            {/* Per-Role Initiation Limits */}
            <ComparisonSection title="Per-Role Initiation Limits" description={instructionTypeEnabled ? 'Maximum amounts each role can initiate. Blue dot = override enabled.' : 'Maximum amounts each role can initiate.'} compact>
              {(typeId) => (
                <RoleLimitsMini
                  data={roleLimitsData[typeId]}
                  col1Label="Max Sngl"
                  col2Label="Daily"
                  col1Key="maxSingle"
                  col2Key="daily"
                  col1Prefix="$"
                  col2Prefix="$"
                />
              )}
            </ComparisonSection>

            {/* Per-Role Approval Limits */}
            <ComparisonSection title="Per-Role Approval Limits" description="Maximum amounts each role can approve. $0 = cannot approve." compact>
              {(typeId) => (
                <RoleLimitsMini
                  data={roleApprovalLimitsData[typeId]}
                  col1Label="Max Appr"
                  col2Label="Daily"
                  col1Key="maxSingle"
                  col2Key="daily"
                />
              )}
            </ComparisonSection>

            {/* Per-Role Velocity Limits */}
            <ComparisonSection title="Per-Role Velocity Limits" description="Transaction count limits per role." compact>
              {(typeId) => (
                <RoleLimitsMini
                  data={velocityRoleLimits[typeId]}
                  col1Label="Max/Hr"
                  col2Label="Max/Day"
                  col1Key="maxHour"
                  col2Key="maxDay"
                />
              )}
            </ComparisonSection>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Reset to Defaults</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        )}

        {/* ═══════════════ SCHEDULING ═══════════════ */}
        {activeControlTab === 'scheduling' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Scheduling</h3>
                <p className="text-sm text-gray-500">{instructionTypeEnabled ? 'Operating windows, time restrictions, and blackout periods per instruction type.' : 'Operating windows, time restrictions, and blackout periods.'}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Time Controls</span>
                <button
                  onClick={() => setTimeControlsEnabled(!timeControlsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors ${timeControlsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${timeControlsEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>

            {!timeControlsEnabled ? (
              <div className="text-center py-16 text-gray-400">
                <Power className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-gray-500">Time-Based Controls Disabled</p>
                <p className="text-sm mt-1">Payments can be processed at any time.</p>
              </div>
            ) : (
              <>
                {/* Operating Windows */}
                <ComparisonSection title="Operating Windows" description="When each rail is available for processing.">
                  {(typeId) => {
                    const times = timeDefaults[typeId];
                    return (
                      <div className="space-y-3">
                        <div className="p-2.5 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-indigo-700">FedNow</span>
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">24/7</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-400 block mb-0.5">Start</label>
                              <input type="time" defaultValue={times.fedStart} className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 block mb-0.5">End</label>
                              <input type="time" defaultValue={times.fedEnd} className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
                            </div>
                          </div>
                        </div>
                        <div className="p-2.5 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-purple-700">RTP</span>
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">24/7</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-400 block mb-0.5">Start</label>
                              <input type="time" defaultValue={times.rtpStart} className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 block mb-0.5">End</label>
                              <input type="time" defaultValue={times.rtpEnd} className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </ComparisonSection>

                {/* Role Time Restrictions */}
                <ComparisonSection title="Role Time Restrictions" description="Restrict certain roles to narrower windows." compact>
                  {(typeId) => (
                    <div className="space-y-1.5">
                      {userRoles.slice(0, 2).map(role => (
                        <div key={role.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-xs font-medium text-gray-700">{role.short}</span>
                          <div className="flex items-center gap-1.5">
                            <input type="time" defaultValue={typeId === 'bank_initiated' ? '08:00' : '09:00'} className="px-1.5 py-0.5 text-xs border border-gray-200 rounded font-mono w-16" />
                            <span className="text-xs text-gray-400">–</span>
                            <input type="time" defaultValue={typeId === 'bank_initiated' ? '18:00' : '17:00'} className="px-1.5 py-0.5 text-xs border border-gray-200 rounded font-mono w-16" />
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          </div>
                        </div>
                      ))}
                      {userRoles.slice(2).map(role => (
                        <div key={role.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg opacity-40">
                          <span className="text-xs text-gray-500">{role.short}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-400 italic">Uses global</span>
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ComparisonSection>

                {/* Blackout Periods — shared */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-0.5">Blackout Periods</h4>
                  <p className="text-xs text-gray-500 mb-3">Dates when payments are blocked.</p>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-700">Christmas Day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {instructionTypeEnabled && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">All Types</span>}
                        <span className="text-sm text-gray-500">Dec 25</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-gray-700">New Year's Day</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {instructionTypeEnabled && <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">All Types</span>}
                        <span className="text-sm text-gray-500">Jan 1</span>
                      </div>
                    </div>
                    <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400">+ Add Blackout Period</button>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Reset to Defaults</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

// Payments List Component
function PaymentsList({ payments, onSelectPayment }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'bank_initiated', 'account_holder'

  const pendingPayments = payments.filter(p => p.status === 'pending_approval');
  const otherPayments = payments.filter(p => p.status !== 'pending_approval');

  const filteredPayments = (activeTab === 'pending' ? pendingPayments : otherPayments).filter(p => {
    if (search && !p.recipient.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && (p.instructionType || 'bank_initiated') !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-amber-500 text-amber-600 bg-amber-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Pending Approval
              {pendingPayments.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                  {pendingPayments.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              All Others
              <span className="px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                {otherPayments.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search, Filter, and Export */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'pending' ? 'pending approvals' : 'payments'}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
          {[
            { id: 'all', label: 'All' },
            { id: 'bank_initiated', label: 'Bank', icon: Building2 },
            { id: 'account_holder', label: 'Acct Holder', icon: UserCheck },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id)}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === f.id
                  ? 'bg-white shadow text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.icon && <f.icon className="w-3 h-3" />}
              {f.label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" />Export
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{pendingPayments.length} payment{pendingPayments.length !== 1 ? 's' : ''}</span> require{pendingPayments.length === 1 ? 's' : ''} your approval
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rail</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                  {activeTab === 'pending'
                    ? 'No payments pending approval'
                    : 'No payments found'}
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => (
                <tr key={payment.id} className={`hover:bg-gray-50 ${payment.status === 'pending_approval' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{payment.id}</td>
                  <td className="px-4 py-3"><InstructionTypeBadge type={payment.instructionType || 'bank_initiated'} /></td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800 font-medium">{payment.recipient}</p>
                    {payment.instructionType === 'account_holder' && payment.accountHolder && (
                      <p className="text-xs text-violet-600">via {payment.accountHolder.name}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-semibold">${payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><RailBadge rail={payment.rail} /></td>
                  <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => onSelectPayment(payment)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="View details"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Audit Log Component
function AuditLog({ logs }) {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'payment', 'approval', 'config', 'template'];
  const categoryColors = { payment: 'bg-blue-100 text-blue-700', approval: 'bg-green-100 text-green-700', config: 'bg-purple-100 text-purple-700', template: 'bg-indigo-100 text-indigo-700' };

  const filteredLogs = logs.filter(log => filter === 'all' || log.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search audit logs..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize ${filter === cat ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}>{cat}</button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600"><Download className="w-4 h-4" />Export</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.timestamp}</td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">{log.action}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-medium rounded capitalize ${categoryColors[log.category]}`}>{log.category}</span></td>
                <td className="px-4 py-3 text-sm text-gray-700">{log.user}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">{log.details}</td>
                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  const channels = [{ id: 'email', name: 'Email', icon: Mail, enabled: true }, { id: 'sms', name: 'SMS', icon: MessageSquare, enabled: true }, { id: 'inapp', name: 'In-App', icon: Bell, enabled: true }, { id: 'webhook', name: 'Webhooks', icon: Webhook, enabled: false }];
  const events = [
    { id: 'approval_required', name: 'Approval Required', email: true, sms: true, inapp: true },
    { id: 'payment_approved', name: 'Payment Approved', email: true, sms: false, inapp: true },
    { id: 'payment_rejected', name: 'Payment Rejected', email: true, sms: true, inapp: true },
    { id: 'payment_completed', name: 'Payment Completed', email: true, sms: false, inapp: true },
    { id: 'limit_warning', name: 'Limit Warning', email: true, sms: true, inapp: true },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Notification Channels</h3>
        <div className="grid grid-cols-4 gap-4">
          {channels.map(channel => (
            <div key={channel.id} className={`p-4 rounded-xl border-2 ${channel.enabled ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <channel.icon className={`w-6 h-6 ${channel.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                <button className={`w-10 h-6 rounded-full ${channel.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full ${channel.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="font-medium text-gray-800">{channel.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Event Notifications</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">SMS</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">In-App</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Webhook</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map(event => (
              <tr key={event.id}>
                <td className="px-6 py-4 font-medium text-gray-800">{event.name}</td>
                <td className="px-6 py-4 text-center"><input type="checkbox" defaultChecked={event.email} className="w-4 h-4 text-blue-600 rounded" /></td>
                <td className="px-6 py-4 text-center"><input type="checkbox" defaultChecked={event.sms} className="w-4 h-4 text-blue-600 rounded" /></td>
                <td className="px-6 py-4 text-center"><input type="checkbox" defaultChecked={event.inapp} className="w-4 h-4 text-blue-600 rounded" /></td>
                <td className="px-6 py-4 text-center"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

// New Payment Modal with FROM/TO, RTN check, autoroute, templates, and beneficiary history
function NewPaymentModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [paymentMode, setPaymentMode] = useState(null); // 'template', 'beneficiary', 'manual'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [formData, setFormData] = useState({
    fromAccount: '', fromAccountManual: '', toName: '', toRtn: '', toAccount: '', amount: '', rail: 'auto', purpose: ''
  });
  const [rtnStatus, setRtnStatus] = useState(null);
  const [rtnChecking, setRtnChecking] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [selectedRail, setSelectedRail] = useState(null);
  const [fromAccountStatus, setFromAccountStatus] = useState(null);
  const [fromAccountChecking, setFromAccountChecking] = useState(false);
  const [pennyTestStatus, setPennyTestStatus] = useState(null);
  const [pennyTestRunning, setPennyTestRunning] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

  // Payment instruction vs settlement instruction
  const [instructionType, setInstructionType] = useState(null); // 'bank_initiated' | 'account_holder'
  const [accountHolderSearch, setAccountHolderSearch] = useState('');
  const [accountHolderSearching, setAccountHolderSearching] = useState(false);
  const [accountHolderResults, setAccountHolderResults] = useState([]);
  const [selectedAccountHolder, setSelectedAccountHolder] = useState(null);
  const [selectedHolderAccount, setSelectedHolderAccount] = useState(null);
  const [authorizationMethod, setAuthorizationMethod] = useState('');
  const [authorizationRef, setAuthorizationRef] = useState('');

  // Mock account validation database
  const validateFromAccount = (accountNum) => {
    if (!accountNum || accountNum.length < 4) { setFromAccountStatus(null); return; }
    setFromAccountChecking(true);
    setTimeout(() => {
      // Mock validation - accounts starting with certain patterns are valid
      const mockAccounts = {
        '1234': { valid: true, name: 'Operating Account', balance: 2500000, type: 'account' },
        '5678': { valid: true, name: 'Payroll Account', balance: 850000, type: 'account' },
        '9012': { valid: true, name: 'Reserve Account', balance: 5000000, type: 'account' },
        'GL50100': { valid: true, name: 'GL-50100 - Accounts Payable', balance: null, type: 'gl' },
        'GL50200': { valid: true, name: 'GL-50200 - Vendor Payments', balance: null, type: 'gl' },
      };
      const match = Object.entries(mockAccounts).find(([key]) => accountNum.toUpperCase().includes(key));
      if (match) {
        setFromAccountStatus(match[1]);
      } else {
        setFromAccountStatus({ valid: false, name: 'Account not found', balance: null });
      }
      setFromAccountChecking(false);
    }, 600);
  };

  // Penny test for manual entry
  const runPennyTest = () => {
    if (!formData.toRtn || !formData.toAccount) return;
    setPennyTestRunning(true);
    setPennyTestStatus(null);
    setTimeout(() => {
      // Mock penny test - simulate sending $0.01 to validate account
      const isValid = rtnStatus?.status === 'active' && formData.toAccount.length >= 4;
      setPennyTestStatus({
        success: isValid,
        message: isValid ? 'Account verified - $0.01 test transaction successful' : 'Account verification failed - unable to reach endpoint',
        timestamp: new Date().toLocaleTimeString()
      });
      setPennyTestRunning(false);
    }, 2000);
  };

  const checkRtn = (rtn) => {
    if (rtn.length !== 9) { setRtnStatus(null); return; }
    setRtnChecking(true);
    setTimeout(() => {
      const result = rtnDatabase[rtn];
      setRtnStatus(result || { name: 'Unknown Institution', fedNow: false, rtp: false, status: 'not_found' });
      setRtnChecking(false);
    }, 800);
  };

  const handleRtnChange = (rtn) => {
    setFormData({ ...formData, toRtn: rtn });
    if (rtn.length === 9) checkRtn(rtn);
    else setRtnStatus(null);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const fromAcc = fromAccounts.find(a => a.name === template.fromAccount?.split(' - ')[0] || a.name.includes(template.fromAccount?.split(' ')[0]));
    setFormData({
      ...formData,
      fromAccount: fromAcc?.id || '',
      toName: template.recipient,
      toRtn: template.recipientRtn,
      toAccount: template.recipientAccount,
      amount: template.defaultAmount ? template.defaultAmount.toString() : '',
      rail: template.rail === 'Auto-route' ? 'auto' : template.rail,
    });
    checkRtn(template.recipientRtn);
    setPaymentMode('template');
  };

  const handleBeneficiarySelect = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setFormData({
      ...formData,
      toName: beneficiary.name,
      toRtn: beneficiary.rtn,
      toAccount: beneficiary.account,
    });
    checkRtn(beneficiary.rtn);
    setPaymentMode('beneficiary');
  };

  const determineRail = () => {
    if (formData.rail !== 'auto') return formData.rail;
    if (!rtnStatus) return null;
    if (rtnStatus.rtp && rtnStatus.fedNow) return 'RTP';
    if (rtnStatus.rtp) return 'RTP';
    if (rtnStatus.fedNow) return 'FedNow';
    return null;
  };

  const validatePayment = () => {
    const amount = parseFloat(formData.amount.replace(/,/g, '')) || 0;
    const rail = determineRail();
    setSelectedRail(rail);
    const results = { passed: [], warnings: [], blocked: [] };

    // === PAYMENT INSTRUCTION VALIDATIONS ===
    if (instructionType === 'account_holder') {
      // Account holder identity
      if (!selectedAccountHolder) {
        results.blocked.push('Account holder not identified');
      } else {
        results.passed.push(`Account holder verified: ${selectedAccountHolder.name} (${selectedAccountHolder.id})`);

        // KYC validation
        if (selectedAccountHolder.kycStatus === 'verified') {
          results.passed.push('KYC status: Verified');
        } else if (selectedAccountHolder.kycStatus === 'expired') {
          results.blocked.push('KYC status: Expired — account holder must complete KYC renewal');
        } else {
          results.warnings.push(`KYC status: ${selectedAccountHolder.kycStatus}`);
        }

        // Account standing
        if (selectedAccountHolder.accountStanding === 'good') {
          results.passed.push('Account standing: Good');
        } else if (selectedAccountHolder.accountStanding === 'review') {
          results.warnings.push('Account standing: Under Review — additional scrutiny required');
        } else {
          results.blocked.push(`Account standing: ${selectedAccountHolder.accountStanding}`);
        }
      }

      // Source account validation
      if (!selectedHolderAccount) {
        results.blocked.push('Source account not selected');
      } else {
        if (selectedHolderAccount.status === 'restricted') {
          results.blocked.push(`Account ${selectedHolderAccount.number} is restricted — debits not permitted`);
        } else if (selectedHolderAccount.status !== 'active') {
          results.blocked.push(`Account ${selectedHolderAccount.number} status: ${selectedHolderAccount.status}`);
        } else {
          results.passed.push(`Source account ${selectedHolderAccount.number} is active`);
        }

        // Balance check
        if (selectedHolderAccount.balance !== null && amount > selectedHolderAccount.balance) {
          results.blocked.push(`Insufficient funds: $${amount.toLocaleString()} requested, $${selectedHolderAccount.balance.toLocaleString()} available`);
        } else if (selectedHolderAccount.balance !== null) {
          results.passed.push(`Sufficient funds: $${selectedHolderAccount.balance.toLocaleString()} available`);
        }

        // Account daily limit
        const remaining = selectedHolderAccount.dailyLimit - selectedHolderAccount.usedToday;
        if (amount > remaining) {
          results.blocked.push(`Exceeds account daily limit: $${amount.toLocaleString()} requested, $${remaining.toLocaleString()} remaining of $${selectedHolderAccount.dailyLimit.toLocaleString()} limit`);
        } else {
          results.passed.push(`Within account daily limit ($${remaining.toLocaleString()} remaining)`);
        }
      }

      // Authorization validation
      if (!authorizationMethod) {
        results.blocked.push('Authorization method not specified');
      } else {
        results.passed.push(`Authorization: ${AUTHORIZATION_METHODS[authorizationMethod]?.label || authorizationMethod}`);
        if (authorizationRef) {
          results.passed.push(`Authorization reference: ${authorizationRef}`);
        } else {
          results.warnings.push('No authorization reference provided');
        }
      }
    }

    // === SETTLEMENT INSTRUCTION VALIDATIONS ===
    if (!rtnStatus || rtnStatus.status === 'not_found') results.blocked.push('Invalid or unknown recipient RTN');
    else if (rtnStatus.status === 'inactive') results.blocked.push('Receiving institution is inactive');
    else results.passed.push(`Recipient RTN verified: ${rtnStatus.name}`);

    if (formData.rail === 'auto' && rail) results.passed.push(`Auto-routed to ${rail} (fastest available)`);
    else if (formData.rail !== 'auto') {
      if ((formData.rail === 'FedNow' && !rtnStatus?.fedNow) || (formData.rail === 'RTP' && !rtnStatus?.rtp)) {
        results.blocked.push(`${formData.rail} not supported by receiving institution`);
      }
    }

    if (!rail && rtnStatus?.status === 'active') results.blocked.push('No payment rail available for this recipient');

    if (amount <= 500000) results.passed.push('Within single transaction limit ($500K)');
    else results.blocked.push('Exceeds single transaction limit ($500K)');

    if (amount < 10000) results.passed.push('Auto-approval eligible (under $10K)');
    else if (amount < 50000) results.warnings.push('Requires 1 approver');
    else if (amount < 250000) results.warnings.push('Requires 2 approvers');
    else results.warnings.push('Requires 3 approvers + Treasury Head');

    results.passed.push('Within hourly velocity limit');
    setValidationResult(results);
    setStep(2);
  };

  const resetForm = () => {
    setPaymentMode(null);
    setSelectedTemplate(null);
    setSelectedBeneficiary(null);
    setFormData({ fromAccount: '', fromAccountManual: '', toName: '', toRtn: '', toAccount: '', amount: '', rail: 'auto', purpose: '' });
    setRtnStatus(null);
    setFromAccountStatus(null);
    setPennyTestStatus(null);
    setTemplateSearch('');
    // Account holder reset
    setAccountHolderSearch('');
    setAccountHolderResults([]);
    setSelectedAccountHolder(null);
    setSelectedHolderAccount(null);
    setAuthorizationMethod('');
    setAuthorizationRef('');
  };

  // Account holder search
  const searchAccountHolders = (query) => {
    setAccountHolderSearch(query);
    if (!query || query.length < 2) { setAccountHolderResults([]); return; }
    setAccountHolderSearching(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      const results = mockAccountHolders.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.id.toLowerCase().includes(q) ||
        h.contactName.toLowerCase().includes(q) ||
        h.accounts.some(a => a.number.includes(q))
      );
      setAccountHolderResults(results);
      setAccountHolderSearching(false);
    }, 400);
  };

  // Select account holder
  const handleSelectAccountHolder = (holder) => {
    setSelectedAccountHolder(holder);
    setAccountHolderResults([]);
    setAccountHolderSearch('');
    setSelectedHolderAccount(null);
  };

  // Select account holder's specific account
  const handleSelectHolderAccount = (account) => {
    setSelectedHolderAccount(account);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-orange-600 bg-orange-50';
      case 'pending_approval': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">New Payment</h2>
              <p className="text-sm text-gray-500">Step {step} of 3</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map(s => (<div key={s} className={`flex-1 h-1 rounded ${s <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />))}
          </div>
        </div>

        <div className="p-6 flex-1 min-h-0 overflow-y-auto">
          {step === 1 && (
            <div className="flex gap-6">
              {/* Left Column - Form */}
              <div className="flex-1 space-y-5">

                {/* Instruction Type Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Instruction Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { if (instructionType !== 'bank_initiated') { resetForm(); setInstructionType('bank_initiated'); } }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        instructionType === 'bank_initiated' ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className={`w-5 h-5 ${instructionType === 'bank_initiated' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-semibold text-sm">Bank-Initiated</span>
                      </div>
                      <p className="text-xs text-gray-500">Internal treasury / operations payment from institution accounts</p>
                    </button>
                    <button
                      onClick={() => { if (instructionType !== 'account_holder') { resetForm(); setInstructionType('account_holder'); } }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        instructionType === 'account_holder' ? 'border-violet-500 bg-violet-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <UserCheck className={`w-5 h-5 ${instructionType === 'account_holder' ? 'text-violet-600' : 'text-gray-400'}`} />
                        <span className="font-semibold text-sm">Account Holder Request</span>
                      </div>
                      <p className="text-xs text-gray-500">Payment requested by customer on behalf of their account</p>
                    </button>
                  </div>
                </div>

                {/* ====== ACCOUNT HOLDER FLOW ====== */}
                {instructionType === 'account_holder' && (
                  <>
                    {/* Account Holder Lookup */}
                    <div className="p-4 rounded-xl border-2 border-violet-200 bg-violet-50/50">
                      <h4 className="font-semibold text-violet-800 flex items-center gap-2 mb-3">
                        <UserCheck className="w-4 h-4" /> Payment Instruction — Account Holder
                      </h4>

                      {!selectedAccountHolder ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Account Holder</label>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                value={accountHolderSearch}
                                onChange={e => searchAccountHolders(e.target.value)}
                                placeholder="Search by name, customer ID, or account number..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-violet-500"
                              />
                              {accountHolderSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-500 animate-spin" />}
                            </div>
                          </div>

                          {accountHolderResults.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white max-h-48 overflow-y-auto">
                              {accountHolderResults.map(holder => (
                                <div key={holder.id} onClick={() => handleSelectAccountHolder(holder)} className="p-3 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-gray-800">{holder.name}</p>
                                      <p className="text-xs text-gray-500">{holder.id} · {holder.type === 'commercial' ? 'Commercial' : 'Individual'} · {holder.contactName}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                                        holder.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                        holder.kycStatus === 'expired' ? 'bg-red-100 text-red-700' :
                                        'bg-amber-100 text-amber-700'
                                      }`}>KYC: {holder.kycStatus}</span>
                                      <p className="text-xs text-gray-400 mt-1">{holder.accounts.length} account{holder.accounts.length !== 1 ? 's' : ''}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {accountHolderSearch.length >= 2 && accountHolderResults.length === 0 && !accountHolderSearching && (
                            <p className="text-sm text-gray-500 text-center py-2">No account holders found</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Selected Account Holder Details */}
                          <div className="p-3 bg-white rounded-lg border border-violet-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-800">{selectedAccountHolder.name}</p>
                                  <span className="text-xs px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">{selectedAccountHolder.type === 'commercial' ? 'Commercial' : 'Individual'}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{selectedAccountHolder.id}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <span className="text-gray-600">{selectedAccountHolder.contactName}{selectedAccountHolder.contactTitle ? `, ${selectedAccountHolder.contactTitle}` : ''}</span>
                                  <span className={`px-1.5 py-0.5 rounded ${
                                    selectedAccountHolder.kycStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                    selectedAccountHolder.kycStatus === 'expired' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>KYC: {selectedAccountHolder.kycStatus}</span>
                                  <span className={`px-1.5 py-0.5 rounded ${
                                    selectedAccountHolder.accountStanding === 'good' ? 'bg-green-100 text-green-700' :
                                    selectedAccountHolder.accountStanding === 'review' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>Standing: {selectedAccountHolder.accountStanding}</span>
                                </div>
                              </div>
                              <button onClick={() => { setSelectedAccountHolder(null); setSelectedHolderAccount(null); }} className="text-xs text-violet-600 hover:text-violet-800 font-medium">Change</button>
                            </div>
                          </div>

                          {/* KYC Warning */}
                          {selectedAccountHolder.kycStatus === 'expired' && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-red-800">KYC Expired</p>
                                <p className="text-xs text-red-600">Account holder's KYC verification expired on {selectedAccountHolder.kycExpiry}. Payment may be blocked.</p>
                              </div>
                            </div>
                          )}

                          {/* Source Account Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Source Account (Debit From)</label>
                            <div className="space-y-2">
                              {selectedAccountHolder.accounts.map(acc => (
                                <button
                                  key={acc.number}
                                  onClick={() => handleSelectHolderAccount(acc)}
                                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                                    selectedHolderAccount?.number === acc.number
                                      ? 'border-violet-500 bg-violet-50'
                                      : acc.status === 'restricted'
                                        ? 'border-red-200 bg-red-50/50 opacity-75'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-gray-800 text-sm">{acc.name} <span className="font-mono text-gray-500">{acc.number}</span></p>
                                      <div className="flex items-center gap-3 mt-1 text-xs">
                                        <span className={acc.status === 'active' ? 'text-green-600' : 'text-red-600'}>{acc.status}</span>
                                        <span className="text-gray-400">Daily limit: ${acc.dailyLimit.toLocaleString()}</span>
                                        <span className="text-gray-400">Used today: ${acc.usedToday.toLocaleString()}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-gray-800">${acc.balance.toLocaleString()}</p>
                                      {acc.status === 'restricted' && <p className="text-xs text-red-600">Restricted</p>}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Authorization Method */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Authorization Method</label>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(AUTHORIZATION_METHODS).map(([key, method]) => (
                                <button
                                  key={key}
                                  onClick={() => setAuthorizationMethod(key)}
                                  className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                                    authorizationMethod === key ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {key === 'in_person' && <UserCheck className={`w-4 h-4 ${authorizationMethod === key ? 'text-violet-600' : 'text-gray-400'}`} />}
                                    {key === 'authenticated_digital' && <Fingerprint className={`w-4 h-4 ${authorizationMethod === key ? 'text-violet-600' : 'text-gray-400'}`} />}
                                    {key === 'phone_verified' && <Phone className={`w-4 h-4 ${authorizationMethod === key ? 'text-violet-600' : 'text-gray-400'}`} />}
                                    {key === 'written_request' && <PenTool className={`w-4 h-4 ${authorizationMethod === key ? 'text-violet-600' : 'text-gray-400'}`} />}
                                    <span className="font-medium text-xs">{method.label}</span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 ml-6">{method.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Authorization Reference */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Reference</label>
                            <input
                              type="text"
                              value={authorizationRef}
                              onChange={e => setAuthorizationRef(e.target.value)}
                              placeholder="e.g., AUTH-8845, session ID, document reference"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white font-mono text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Show TO / Amount / Rail only after account holder + account selected */}
                    {selectedAccountHolder && selectedHolderAccount && (
                      <>
                        {/* TO Section */}
                        <div className="p-4 rounded-xl border bg-green-50 border-green-100">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-green-800 flex items-center gap-2"><Send className="w-4 h-4" /> Settlement — TO (Beneficiary)</h4>
                            <select onChange={e => { if (e.target.value) handleBeneficiarySelect(recentBeneficiaries.find(b => b.id === e.target.value)); }} className="text-sm px-2 py-1 border border-gray-300 rounded-lg bg-white">
                              <option value="">Recent beneficiaries...</option>
                              {recentBeneficiaries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                              <input type="text" value={formData.toName} onChange={e => setFormData({ ...formData, toName: e.target.value })} placeholder="Enter recipient name" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient RTN</label>
                                <div className="relative">
                                  <input type="text" value={formData.toRtn} onChange={e => handleRtnChange(e.target.value)} maxLength={9} placeholder="9-digit RTN" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white" />
                                  {rtnChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
                                </div>
                                {rtnStatus && (
                                  <div className={`mt-2 p-2 rounded text-xs ${rtnStatus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="font-medium">{rtnStatus.name}</div>
                                    {rtnStatus.status === 'active' && (
                                      <div className="flex gap-2 mt-1">
                                        {rtnStatus.fedNow && <span className="px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded">FedNow ✓</span>}
                                        {rtnStatus.rtp && <span className="px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">RTP ✓</span>}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                <input type="text" value={formData.toAccount} onChange={e => setFormData({ ...formData, toAccount: e.target.value })} placeholder="Account number" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input type="text" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold" />
                          </div>
                          {selectedHolderAccount && (
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>Available: ${selectedHolderAccount.balance.toLocaleString()}</span>
                              <span>Daily remaining: ${(selectedHolderAccount.dailyLimit - selectedHolderAccount.usedToday).toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        {/* Payment Rail */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Rail</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { id: 'auto', label: 'Auto-Route', desc: 'Fastest available', icon: Router },
                              { id: 'FedNow', label: 'FedNow', desc: 'Federal Reserve', icon: Zap },
                              { id: 'RTP', label: 'RTP', desc: 'Real-Time Payments', icon: Activity },
                            ].map(rail => (
                              <button key={rail.id} onClick={() => setFormData({ ...formData, rail: rail.id })} className={`p-2 rounded-lg border-2 text-left transition-all ${formData.rail === rail.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-2">
                                  <rail.icon className={`w-4 h-4 ${formData.rail === rail.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                  <span className="font-medium text-sm">{rail.label}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Purpose */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Memo</label>
                          <input type="text" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="Invoice payment, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>

                        <div className="p-3 bg-violet-50 border border-violet-200 rounded-lg flex items-center gap-3">
                          <Lock className="w-5 h-5 text-violet-600" />
                          <div>
                            <p className="text-sm font-medium text-violet-800">Account Holder Payment</p>
                            <p className="text-xs text-violet-600">Debiting {selectedAccountHolder.name}'s account {selectedHolderAccount.number} per {AUTHORIZATION_METHODS[authorizationMethod]?.label || 'authorization'}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* ====== BANK-INITIATED FLOW (original) ====== */}
                {instructionType === 'bank_initiated' && (
                  <>
                {/* Quick Start Options */}
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => { resetForm(); setPaymentMode('template'); }} className={`p-3 rounded-xl border-2 text-left transition-all ${paymentMode === 'template' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <FileText className={`w-5 h-5 mb-1 ${paymentMode === 'template' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <p className="font-medium text-sm">From Template</p>
                    <p className="text-xs text-gray-500">Use saved template</p>
                  </button>
                  <button onClick={() => { resetForm(); setPaymentMode('beneficiary'); }} className={`p-3 rounded-xl border-2 text-left transition-all ${paymentMode === 'beneficiary' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Users className={`w-5 h-5 mb-1 ${paymentMode === 'beneficiary' ? 'text-green-600' : 'text-gray-400'}`} />
                    <p className="font-medium text-sm">Recent Beneficiary</p>
                    <p className="text-xs text-gray-500">Select from history</p>
                  </button>
                  <button onClick={() => { resetForm(); setPaymentMode('manual'); }} className={`p-3 rounded-xl border-2 text-left transition-all ${paymentMode === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Edit className={`w-5 h-5 mb-1 ${paymentMode === 'manual' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <p className="font-medium text-sm">Manual Entry</p>
                    <p className="text-xs text-gray-500">Enter details</p>
                  </button>
                </div>

                {/* Template Selection */}
                {paymentMode === 'template' && !selectedTemplate && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-700">Select Template</span>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={templateSearch}
                          onChange={e => setTemplateSearch(e.target.value)}
                          placeholder="Search by name, recipient, or ID..."
                          className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {mockTemplates.filter(t => {
                        if (t.status !== 'active') return false;
                        if (!templateSearch) return true;
                        const q = templateSearch.toLowerCase();
                        return t.name.toLowerCase().includes(q) || t.recipient.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
                      }).length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No templates match your search</div>
                      ) : (
                        mockTemplates.filter(t => {
                          if (t.status !== 'active') return false;
                          if (!templateSearch) return true;
                          const q = templateSearch.toLowerCase();
                          return t.name.toLowerCase().includes(q) || t.recipient.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
                        }).map(template => (
                        <div key={template.id} onClick={() => handleTemplateSelect(template)} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{template.name}</p>
                              <p className="text-sm text-gray-500">{template.recipient}{template.defaultAmount ? ` • $${template.defaultAmount.toLocaleString()} default` : ''}</p>
                            </div>
                            <RailBadge rail={template.rail} />
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Beneficiary Selection */}
                {paymentMode === 'beneficiary' && !selectedBeneficiary && (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">Recent Beneficiaries</div>
                    <div className="max-h-48 overflow-y-auto">
                      {recentBeneficiaries.map(ben => (
                        <div key={ben.id} onClick={() => handleBeneficiarySelect(ben)} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{ben.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{ben.rtn} â€¢ {ben.account}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Last: {ben.lastPayment}</p>
                              <p className="text-xs text-gray-500">{ben.transactionCount} transactions</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show form when template selected or manual mode or beneficiary selected */}
                {(selectedTemplate || paymentMode === 'manual' || selectedBeneficiary) && (
                  <>
                    {/* FROM Section */}
                    <div className={`p-4 rounded-xl border ${selectedTemplate ? 'bg-blue-50/50 border-blue-100' : 'bg-blue-50 border-blue-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-800 flex items-center gap-2"><Building2 className="w-4 h-4" /> FROM (Originator)</h4>
                        {selectedTemplate && <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">Locked by template</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800">{INSTITUTION_NAME}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">RTN</label>
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800">{INSTITUTION_RTN}</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account / GL</label>
                        {selectedTemplate ? (
                          <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-800">
                            {fromAccounts.find(a => a.id === formData.fromAccount)?.name || selectedTemplate.fromAccount}
                          </div>
                        ) : paymentMode === 'manual' ? (
                          <div className="space-y-2">
                            <select
                              value={formData.fromAccount}
                              onChange={e => {
                                setFormData({ ...formData, fromAccount: e.target.value, fromAccountManual: '' });
                                setFromAccountStatus(null);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                            >
                              <option value="">Select from list or enter manually below...</option>
                              <optgroup label="Accounts">
                                {fromAccounts.filter(a => a.type === 'account').map(acc => (
                                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.number}) - ${acc.balance?.toLocaleString()}</option>
                                ))}
                              </optgroup>
                              <optgroup label="General Ledger">
                                {fromAccounts.filter(a => a.type === 'gl').map(acc => (
                                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                              </optgroup>
                            </select>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex-1 h-px bg-gray-300"></div>
                              <span>or enter manually</span>
                              <div className="flex-1 h-px bg-gray-300"></div>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={formData.fromAccountManual}
                                onChange={e => {
                                  setFormData({ ...formData, fromAccountManual: e.target.value, fromAccount: '' });
                                  validateFromAccount(e.target.value);
                                }}
                                placeholder="Enter account number or GL code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white"
                              />
                              {fromAccountChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
                            </div>
                            {fromAccountStatus && (
                              <div className={`p-2 rounded-lg text-sm ${fromAccountStatus.valid ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {fromAccountStatus.valid ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={fromAccountStatus.valid ? 'text-green-800' : 'text-red-800'}>{fromAccountStatus.name}</span>
                                  </div>
                                  {fromAccountStatus.valid && fromAccountStatus.balance !== null && (
                                    <span className="text-green-700 font-medium">Balance: ${fromAccountStatus.balance.toLocaleString()}</span>
                                  )}
                                  {fromAccountStatus.valid && fromAccountStatus.type === 'gl' && (
                                    <span className="text-green-600 text-xs">General Ledger</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <select value={formData.fromAccount} onChange={e => setFormData({ ...formData, fromAccount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                            <option value="">Select account or GL...</option>
                            <optgroup label="Accounts">
                              {fromAccounts.filter(a => a.type === 'account').map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name} ({acc.number}) - ${acc.balance?.toLocaleString()}</option>
                              ))}
                            </optgroup>
                            <optgroup label="General Ledger">
                              {fromAccounts.filter(a => a.type === 'gl').map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.name}</option>
                              ))}
                            </optgroup>
                          </select>
                        )}
                      </div>
                    </div>

                    {/* TO Section */}
                    <div className={`p-4 rounded-xl border ${selectedTemplate ? 'bg-green-50/50 border-green-100' : 'bg-green-50 border-green-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-green-800 flex items-center gap-2"><Send className="w-4 h-4" /> TO (Beneficiary)</h4>
                        {selectedTemplate ? (
                          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">Locked by template</span>
                        ) : !selectedBeneficiary && paymentMode !== 'template' && (
                          <select onChange={e => { if (e.target.value) handleBeneficiarySelect(recentBeneficiaries.find(b => b.id === e.target.value)); }} className="text-sm px-2 py-1 border border-gray-300 rounded-lg bg-white">
                            <option value="">Recent beneficiaries...</option>
                            {recentBeneficiaries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                          {selectedTemplate ? (
                            <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-800">{formData.toName}</div>
                          ) : (
                            <input type="text" value={formData.toName} onChange={e => setFormData({ ...formData, toName: e.target.value })} placeholder="Enter recipient name" className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white" />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient RTN</label>
                            {selectedTemplate ? (
                              <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono text-gray-800">{formData.toRtn}</div>
                            ) : (
                              <div className="relative">
                                <input type="text" value={formData.toRtn} onChange={e => handleRtnChange(e.target.value)} maxLength={9} placeholder="9-digit RTN" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white" />
                                {rtnChecking && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />}
                              </div>
                            )}
                            {rtnStatus && !selectedTemplate && (
                              <div className={`mt-2 p-2 rounded text-xs ${rtnStatus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <div className="font-medium">{rtnStatus.name}</div>
                                {rtnStatus.status === 'active' && (
                                  <div className="flex gap-2 mt-1">
                                    {rtnStatus.fedNow && <span className="px-1.5 py-0.5 bg-indigo-200 text-indigo-800 rounded">FedNow âœ“</span>}
                                    {rtnStatus.rtp && <span className="px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded">RTP âœ“</span>}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            {selectedTemplate ? (
                              <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono text-gray-800">{formData.toAccount}</div>
                            ) : (
                              <input type="text" value={formData.toAccount} onChange={e => { setFormData({ ...formData, toAccount: e.target.value }); setPennyTestStatus(null); }} placeholder="Account number" className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono bg-white" />
                            )}
                          </div>
                        </div>

                        {/* Penny Test for Manual Entry */}
                        {paymentMode === 'manual' && formData.toRtn && formData.toAccount && (
                          <div className="border-t border-green-200 pt-3 mt-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Account Validation</p>
                                <p className="text-xs text-gray-500">Send $0.01 test transaction to verify account</p>
                              </div>
                              <button
                                onClick={runPennyTest}
                                disabled={pennyTestRunning || !rtnStatus?.status === 'active'}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {pennyTestRunning ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Testing...
                                  </>
                                ) : (
                                  <>
                                    <Zap className="w-4 h-4" />
                                    Run Penny Test
                                  </>
                                )}
                              </button>
                            </div>
                            {pennyTestStatus && (
                              <div className={`mt-2 p-3 rounded-lg flex items-start gap-2 ${pennyTestStatus.success ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
                                {pennyTestStatus.success ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                )}
                                <div>
                                  <p className={`text-sm font-medium ${pennyTestStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                                    {pennyTestStatus.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">Tested at {pennyTestStatus.timestamp}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input type="text" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-lg font-semibold" />
                      </div>
                    </div>

                    {/* Payment Rail */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Rail</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'auto', label: 'Auto-Route', desc: 'Fastest available', icon: Router },
                          { id: 'FedNow', label: 'FedNow', desc: 'Federal Reserve', icon: Zap },
                          { id: 'RTP', label: 'RTP', desc: 'Real-Time Payments', icon: Activity },
                        ].map(rail => (
                          <button key={rail.id} onClick={() => setFormData({ ...formData, rail: rail.id })} className={`p-2 rounded-lg border-2 text-left transition-all ${formData.rail === rail.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              <rail.icon className={`w-4 h-4 ${formData.rail === rail.id ? 'text-blue-600' : 'text-gray-400'}`} />
                              <span className="font-medium text-sm">{rail.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Purpose */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose / Memo</label>
                      <input type="text" value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })} placeholder="Invoice payment, etc." className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>

                    {/* Immediate Send Notice */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Immediate Payment</p>
                        <p className="text-xs text-blue-600">This payment will be sent immediately upon approval</p>
                      </div>
                    </div>
                  </>
                )}
                  </>
                )}
              </div>

              {/* Right Column - Beneficiary History Panel */}
              {selectedBeneficiary && (
                <div className="w-72 border-l border-gray-200 pl-6">
                  <div className="sticky top-0">
                    <h4 className="font-semibold text-gray-800 mb-3">Beneficiary History</h4>
                    <div className="p-3 bg-gray-50 rounded-xl mb-4">
                      <p className="font-medium text-gray-800">{selectedBeneficiary.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{selectedBeneficiary.bank}</p>
                      <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                        <div className="p-2 bg-white rounded-lg">
                          <p className="text-lg font-bold text-gray-800">{selectedBeneficiary.transactionCount}</p>
                          <p className="text-xs text-gray-500">Transactions</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg">
                          <p className="text-lg font-bold text-gray-800">${(selectedBeneficiary.totalSent / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-500">Total Sent</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedBeneficiary.history.map(txn => (
                        <div key={txn.id} className={`p-2 rounded-lg border ${txn.status === 'rejected' || txn.status === 'cancelled' ? 'border-red-200' : 'border-gray-200'}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-800">${txn.amount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{txn.date}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${getStatusColor(txn.status)}`}>
                                {txn.status.replace('_', ' ')}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">{txn.rail}</p>
                            </div>
                          </div>
                          {txn.reason && (
                            <p className="text-xs text-red-600 mt-1 bg-red-50 p-1 rounded">{txn.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedBeneficiary.history.some(t => t.status === 'rejected' || t.status === 'cancelled') && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-800">This beneficiary has rejected or cancelled transactions in history. Review before proceeding.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && validationResult && (
            <div className="space-y-4">

              {/* Instruction Type Banner */}
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                instructionType === 'account_holder'
                  ? 'bg-violet-50 border border-violet-200'
                  : 'bg-slate-50 border border-slate-200'
              }`}>
                {instructionType === 'account_holder'
                  ? <UserCheck className="w-5 h-5 text-violet-600" />
                  : <Building2 className="w-5 h-5 text-slate-600" />
                }
                <div>
                  <p className={`font-semibold text-sm ${instructionType === 'account_holder' ? 'text-violet-800' : 'text-slate-800'}`}>
                    {instructionType === 'account_holder' ? 'Account Holder Payment Request' : 'Bank-Initiated Payment'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {instructionType === 'account_holder'
                      ? 'Payment authorized by account holder, processed by institution'
                      : 'Payment initiated internally by treasury operations'
                    }
                  </p>
                </div>
              </div>

              {/* PAYMENT INSTRUCTION — only for account holder */}
              {instructionType === 'account_holder' && selectedAccountHolder && (
                <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-200">
                  <h4 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Payment Instruction
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-white rounded-lg border border-violet-100">
                      <p className="text-xs text-violet-600 uppercase font-medium">Requestor</p>
                      <p className="font-semibold text-gray-800">{selectedAccountHolder.name}</p>
                      <p className="text-xs text-gray-500">{selectedAccountHolder.id} · {selectedAccountHolder.type === 'commercial' ? 'Commercial' : 'Individual'}</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedAccountHolder.contactName}{selectedAccountHolder.contactTitle ? `, ${selectedAccountHolder.contactTitle}` : ''}</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-violet-100">
                      <p className="text-xs text-violet-600 uppercase font-medium">Authorization</p>
                      <p className="font-semibold text-gray-800">{AUTHORIZATION_METHODS[authorizationMethod]?.label || 'Not specified'}</p>
                      {authorizationRef && <p className="text-xs text-gray-500 font-mono mt-1">Ref: {authorizationRef}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          selectedAccountHolder.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>KYC: {selectedAccountHolder.kycStatus}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          selectedAccountHolder.accountStanding === 'good' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>Standing: {selectedAccountHolder.accountStanding}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-violet-100">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-xs text-violet-600 uppercase font-medium">Debit Account</p>
                        <p className="font-medium text-gray-800">{selectedHolderAccount?.name} <span className="font-mono text-gray-500">{selectedHolderAccount?.number}</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Available Balance</p>
                        <p className="font-semibold text-gray-800">${selectedHolderAccount?.balance?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTLEMENT INSTRUCTION */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4 text-gray-600" /> Settlement Instruction
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 uppercase font-medium">From (Originator)</p>
                    <p className="font-semibold text-gray-800">{INSTITUTION_NAME}</p>
                    <p className="text-gray-500 font-mono text-xs">{INSTITUTION_RTN}</p>
                    {instructionType === 'account_holder' && selectedHolderAccount ? (
                      <p className="text-gray-600 text-xs mt-1">{selectedAccountHolder?.name} — {selectedHolderAccount.number}</p>
                    ) : (
                      <p className="text-gray-600 text-xs mt-1">{fromAccounts.find(a => a.id === formData.fromAccount)?.name || 'Not selected'}</p>
                    )}
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 uppercase font-medium">To (Beneficiary)</p>
                    <p className="font-semibold text-gray-800">{formData.toName || 'Not specified'}</p>
                    <p className="text-gray-500 font-mono text-xs">{formData.toRtn}</p>
                    <p className="text-gray-600 text-xs mt-1">Account: {formData.toAccount}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-gray-800">${formData.amount || '0'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Rail</p>
                    {selectedRail ? <RailBadge rail={selectedRail} /> : <span className="text-red-500 text-sm">No rail available</span>}
                    {formData.rail === 'auto' && selectedRail && <p className="text-xs text-gray-400 mt-1">Auto-selected</p>}
                  </div>
                </div>
              </div>

              {/* Control Validation */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Control Validation</h4>
                {validationResult.blocked.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-red-600 mb-2">Blocked</p>
                    {validationResult.blocked.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg mb-1"><XCircle className="w-4 h-4 text-red-500" /><span className="text-sm text-red-700">{item}</span></div>
                    ))}
                  </div>
                )}
                {validationResult.warnings.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-amber-600 mb-2">Warnings</p>
                    {validationResult.warnings.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg mb-1"><AlertTriangle className="w-4 h-4 text-amber-500" /><span className="text-sm text-amber-700">{item}</span></div>
                    ))}
                  </div>
                )}
                {validationResult.passed.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Passed</p>
                    {validationResult.passed.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg mb-1"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm text-green-700">{item}</span></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Submitted</h3>
              <p className="text-gray-500 mb-4">Your payment has been submitted and is pending approval.</p>
              <div className="p-4 bg-gray-50 rounded-xl inline-block">
                <p className="text-sm text-gray-500">Payment ID</p>
                <p className="font-mono font-semibold text-gray-800">PAY-006</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between flex-shrink-0">
          <button onClick={() => step > 1 ? setStep(step - 1) : onClose()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">{step === 1 ? 'Cancel' : 'Back'}</button>
          {step < 3 ? (
            <button onClick={() => step === 1 ? validatePayment() : setStep(3)} disabled={step === 2 && validationResult?.blocked?.length > 0} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">{step === 1 ? 'Validate & Continue' : 'Submit Payment'}</button>
          ) : (
            <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Done</button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

// Payment Detail Modal with verification requirements and transaction history
function PaymentDetailModal({ payment, onClose, onOpenApproval, onOpenReject, dismissing }) {
  // Find beneficiary history
  const beneficiaryHistory = recentBeneficiaries.find(b => b.name === payment.recipient);

  // Determine verification type based on amount
  const getVerificationType = (amount) => {
    if (amount >= 250000) return 'full';
    if (amount >= 50000) return 'amount';
    return 'sight';
  };

  const verificationType = getVerificationType(payment.amount);
  const verificationLabels = {
    sight: { label: 'Sight Approval', color: 'green', desc: 'Review and approve' },
    amount: { label: 'Amount Verification', color: 'blue', desc: 'Re-enter amount to approve' },
    full: { label: 'Full Verification', color: 'amber', desc: 'Re-enter amount, account & RTN' }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-orange-600 bg-orange-50';
      case 'pending_approval': return 'text-amber-600 bg-amber-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Build timeline steps based on payment status
  const buildTimeline = () => {
    const steps = [];
    const ts = payment.timestamp;
    const approvals = payment.approvalHistory || [];
    const lastApproval = approvals.length > 0 ? approvals[approvals.length - 1] : null;

    // Step 1: Initiated — always done
    steps.push({ id: 'initiated', label: 'Initiated', timestamp: ts, status: 'done', detail: payment.initiator });

    // Step 2: Validated — always done (happens immediately after initiation)
    steps.push({ id: 'validated', label: 'Validated', timestamp: ts, status: 'done', detail: 'Controls passed' });

    // Step 3: Approval
    if (payment.status === 'rejected') {
      steps.push({ id: 'rejected', label: 'Rejected', timestamp: lastApproval?.timestamp || ts, status: 'rejected', detail: 'Payment rejected' });
      return steps;
    }

    if (payment.status === 'pending_approval') {
      steps.push({ id: 'approval', label: 'Approval', timestamp: lastApproval?.timestamp || null, status: 'current', detail: `${payment.currentApprovers}/${payment.requiredApprovers} received` });
      steps.push({ id: 'settlement', label: 'Settlement', timestamp: null, status: 'pending' });
      steps.push({ id: 'complete', label: 'Complete', timestamp: null, status: 'pending' });
    } else if (payment.status === 'approved' || payment.status === 'completed') {
      steps.push({ id: 'approval', label: 'Approved', timestamp: lastApproval?.timestamp || ts, status: 'done', detail: `${payment.requiredApprovers}/${payment.requiredApprovers}` });

      if (payment.status === 'completed') {
        steps.push({ id: 'settlement', label: 'Settled', timestamp: lastApproval ? lastApproval.timestamp.split(' ')[0] + ' ' + '16:09:30' : ts, status: 'done', detail: payment.rail });
        steps.push({ id: 'complete', label: 'Complete', timestamp: lastApproval ? lastApproval.timestamp.split(' ')[0] + ' ' + '16:10:00' : ts, status: 'done' });
      } else {
        steps.push({ id: 'settlement', label: 'Settlement', timestamp: null, status: 'current', detail: 'Processing' });
        steps.push({ id: 'complete', label: 'Complete', timestamp: null, status: 'pending' });
      }
    } else {
      steps.push({ id: 'approval', label: 'Approval', timestamp: null, status: 'pending' });
      steps.push({ id: 'settlement', label: 'Settlement', timestamp: null, status: 'pending' });
      steps.push({ id: 'complete', label: 'Complete', timestamp: null, status: 'pending' });
    }

    return steps;
  };

  const timeline = buildTimeline();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 overflow-y-auto transition-all duration-400 ${
          dismissing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ transition: 'opacity 0.4s ease-out' }}
      >
        <div className="min-h-full flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-400 ${
            dismissing ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'
          }`}
          style={{ transition: 'transform 0.4s ease-out, opacity 0.4s ease-out' }}
        >
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
                <p className="text-sm text-gray-500 font-mono">{payment.id}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>

          {/* Payment Timeline with Chevrons */}
          <div className="px-6 py-4 bg-slate-50 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              {timeline.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    step.status === 'done' ? 'bg-green-50 border border-green-200' :
                    step.status === 'current' ? 'bg-blue-50 border border-blue-300 shadow-sm' :
                    step.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                    'bg-gray-100 border border-gray-200'
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'done' ? 'bg-green-500' :
                      step.status === 'current' ? 'bg-blue-500' :
                      step.status === 'rejected' ? 'bg-red-500' :
                      'bg-gray-300'
                    }`}>
                      {step.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      {step.status === 'current' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      {step.status === 'rejected' && <XCircle className="w-3.5 h-3.5 text-white" />}
                      {step.status === 'pending' && <div className="w-2 h-2 bg-white rounded-full opacity-50" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${
                        step.status === 'done' ? 'text-green-700' :
                        step.status === 'current' ? 'text-blue-700' :
                        step.status === 'rejected' ? 'text-red-700' :
                        'text-gray-400'
                      }`}>{step.label}</p>
                      {step.timestamp && (
                        <p className="text-xs text-gray-400 leading-tight">{step.timestamp.split(' ')[1] || ''}</p>
                      )}
                      {step.detail && !step.timestamp && (
                        <p className="text-xs text-gray-400 leading-tight">{step.detail}</p>
                      )}
                    </div>
                  </div>
                  {idx < timeline.length - 1 && (
                    <ChevronRight className={`w-4 h-4 mx-1 flex-shrink-0 ${
                      timeline[idx + 1].status === 'pending' ? 'text-gray-300' : 'text-gray-400'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Left Column - Payment Details */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">

              {/* Amount + Status + Instruction Type header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <InstructionTypeBadge type={payment.instructionType || 'bank_initiated'} />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">${payment.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={payment.status} />
                  {payment.status === 'pending_approval' && (
                    <div className={`mt-2 text-xs px-2 py-1 rounded bg-${verificationLabels[verificationType].color}-100 text-${verificationLabels[verificationType].color}-700`}>
                      {verificationLabels[verificationType].label} Required
                    </div>
                  )}
                </div>
              </div>

              {/* PAYMENT INSTRUCTION — Account Holder Details */}
              {payment.instructionType === 'account_holder' && payment.accountHolder && (
                <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                  <h4 className="font-semibold text-violet-800 mb-3 flex items-center gap-2 text-sm">
                    <UserCheck className="w-4 h-4" /> Payment Instruction
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-violet-100">
                      <p className="text-xs text-violet-600 uppercase font-medium mb-1">Account Holder</p>
                      <p className="font-semibold text-gray-800 text-sm">{payment.accountHolder.name}</p>
                      <p className="text-xs text-gray-500">{payment.accountHolder.id} · {payment.accountHolder.type === 'commercial' ? 'Commercial' : 'Individual'}</p>
                      {payment.accountHolder.contactName && (
                        <p className="text-xs text-gray-600 mt-1">{payment.accountHolder.contactName}{payment.accountHolder.contactTitle ? `, ${payment.accountHolder.contactTitle}` : ''}</p>
                      )}
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-violet-100">
                      <p className="text-xs text-violet-600 uppercase font-medium mb-1">Authorization</p>
                      <p className="font-semibold text-gray-800 text-sm">{AUTHORIZATION_METHODS[payment.accountHolder.authorizationMethod]?.label || payment.accountHolder.authorizationMethod}</p>
                      {payment.accountHolder.authorizationRef && (
                        <p className="text-xs text-gray-500 font-mono mt-0.5">Ref: {payment.accountHolder.authorizationRef}</p>
                      )}
                      {payment.accountHolder.authorizationTimestamp && (
                        <p className="text-xs text-gray-400 mt-0.5">{payment.accountHolder.authorizationTimestamp}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-100 flex-1">
                      <p className="text-xs text-violet-600 font-medium">Debit Account:</p>
                      <p className="text-sm font-medium text-gray-800">{payment.accountHolder.accountName}</p>
                      <p className="text-xs text-gray-500 font-mono">{payment.accountHolder.accountNumber}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      payment.accountHolder.kycStatus === 'verified'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : payment.accountHolder.kycStatus === 'expired'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      KYC: {payment.accountHolder.kycStatus}
                    </span>
                  </div>
                </div>
              )}

              {/* SETTLEMENT INSTRUCTION */}
              <div>
                <h4 className="font-semibold text-gray-600 mb-3 flex items-center gap-2 text-sm">
                  <Send className="w-4 h-4" /> Settlement Instruction
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 uppercase font-medium">From (Originator)</p>
                    <p className="font-medium text-gray-800">{INSTITUTION_NAME}</p>
                    <p className="text-xs text-gray-500 font-mono">{INSTITUTION_RTN}</p>
                    <p className="text-sm text-gray-600 mt-1">{payment.fromAccount}</p>
                    {payment.instructionType === 'account_holder' && payment.accountHolder && (
                      <p className="text-xs text-violet-600 mt-1">On behalf of: {payment.accountHolder.name}</p>
                    )}
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 uppercase font-medium">To (Beneficiary)</p>
                    <p className="font-medium text-gray-800">{payment.recipient}</p>
                    <p className="text-xs text-gray-500 font-mono">{payment.recipientRtn}</p>
                    <p className="text-sm text-gray-600 mt-1">Account: {payment.recipientAccount}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><p className="text-gray-500">Payment Rail</p><RailBadge rail={payment.rail} /></div>
                <div><p className="text-gray-500">Initiated By</p><p className="font-medium text-gray-800">{payment.initiator}</p></div>
                <div><p className="text-gray-500">Timestamp</p><p className="font-medium text-gray-800">{payment.timestamp}</p></div>
                <div><p className="text-gray-500">Approvals</p><p className="font-medium text-gray-800">{payment.currentApprovers} of {payment.requiredApprovers}</p></div>
              </div>

              {/* Approval History/Trail */}
              {payment.approvalHistory && payment.approvalHistory.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Approval {payment.status === 'pending_approval' ? 'Progress' : 'Trail'}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.currentApprovers >= payment.requiredApprovers 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {payment.currentApprovers}/{payment.requiredApprovers} {payment.currentApprovers >= payment.requiredApprovers ? 'Complete' : 'Received'}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        payment.currentApprovers >= payment.requiredApprovers 
                          ? 'bg-green-500' 
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${(payment.currentApprovers / payment.requiredApprovers) * 100}%` }}
                    />
                  </div>

                  <div className="space-y-2">
                    {payment.approvalHistory.map((approval, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm">{approval.approver}</p>
                          <p className="text-xs text-gray-500">{approval.role}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-600">{approval.timestamp.split(' ')[1]}</p>
                          <p className="text-xs text-gray-400">{approval.timestamp.split(' ')[0]}</p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Show remaining approvals needed for pending */}
                    {payment.status === 'pending_approval' && payment.currentApprovers < payment.requiredApprovers && (
                      <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 border-dashed rounded-lg">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-amber-700 text-sm">
                            Awaiting {payment.requiredApprovers - payment.currentApprovers} more approval{payment.requiredApprovers - payment.currentApprovers > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-amber-500">Your approval may be required</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {payment.status === 'pending_approval' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-800">Approval Actions</h4>
                    <span className={`text-xs px-2 py-1 rounded bg-${verificationLabels[verificationType].color}-100 text-${verificationLabels[verificationType].color}-700`}>
                      {verificationLabels[verificationType].desc}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => onOpenApproval(payment, verificationType)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                      Approve
                    </button>
                    <button onClick={() => onOpenReject(payment)} className="flex-1 py-2.5 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2">
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Beneficiary History */}
            <div className="w-80 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
              <h4 className="font-semibold text-gray-800 mb-4">Recipient History</h4>

              {beneficiaryHistory ? (
                <>
                  <div className="p-3 bg-white rounded-xl mb-4 border border-gray-200">
                    <p className="font-medium text-gray-800">{beneficiaryHistory.name}</p>
                    <p className="text-xs text-gray-500">{beneficiaryHistory.bank}</p>
                    <div className="mt-2 px-2 py-1 bg-blue-50 rounded text-center">
                      <p className="text-xs text-blue-600 font-medium">Last 12 months</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-800">{beneficiaryHistory.transactionCount}</p>
                        <p className="text-xs text-gray-500">Total Txns</p>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-gray-800">${(beneficiaryHistory.totalSent / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">Total Sent</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-gray-700 mb-2">Prior Transactions</p>
                  <div className="space-y-2">
                    {beneficiaryHistory.history.map(txn => (
                      <div key={txn.id} className={`p-3 bg-white rounded-lg border ${txn.status === 'rejected' || txn.status === 'cancelled' ? 'border-red-200' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-800">${txn.amount.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{txn.date}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${getStatusColor(txn.status)}`}>
                              {txn.status.replace('_', ' ')}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">{txn.rail}</p>
                          </div>
                        </div>
                        {txn.reason && (
                          <p className="text-xs text-red-600 mt-2 p-1.5 bg-red-50 rounded">{txn.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {beneficiaryHistory.history.some(t => t.status === 'rejected' || t.status === 'cancelled') && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800">This recipient has prior rejected or cancelled transactions. Review carefully.</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No prior transaction history</p>
                  <p className="text-xs text-amber-600 mt-2">First-time recipient</p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

// Approval Verification Modal
function ApprovalVerificationModal({ payment, verificationType, onClose, onApprove }) {
  const [verifyAmount, setVerifyAmount] = useState('');
  const [verifyAccount, setVerifyAccount] = useState('');
  const [verifyRtn, setVerifyRtn] = useState('');
  const [errors, setErrors] = useState({});
  const [approved, setApproved] = useState(false);

  const validateAndApprove = () => {
    const newErrors = {};

    if (verificationType === 'amount' || verificationType === 'full') {
      const enteredAmount = parseFloat(verifyAmount.replace(/,/g, '')) || 0;
      if (enteredAmount !== payment.amount) {
        newErrors.amount = 'Amount does not match';
      }
    }

    if (verificationType === 'full') {
      if (verifyAccount !== payment.recipientAccount.replace(/\*/g, '')) {
        newErrors.account = 'Account number does not match';
      }
      if (verifyRtn !== payment.recipientRtn) {
        newErrors.rtn = 'RTN does not match';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setApproved(true);
    setTimeout(() => onApprove(), 1500);
  };

  if (approved) {
    return (
      <div className="fixed inset-0 bg-black/50 z-40 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Approved</h3>
          <p className="text-gray-500">Your approval has been recorded.</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Approve Payment</h2>
              <p className="text-sm text-gray-500">{payment.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto">
          {/* Payment Summary — redacts fields that require re-entry verification */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-semibold text-gray-800">{payment.recipient}</p>
              </div>
              <div className="text-right">
                {verificationType === 'sight' ? (
                  <>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-gray-800">${payment.amount.toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Amount</p>
                    <div className="flex items-center gap-2 justify-end">
                      <Eye className="w-4 h-4 text-gray-300" />
                      <span className="text-sm font-medium text-gray-400 italic">Requires verification</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Show routing details only for sight; redact for full verification */}
            {verificationType === 'full' ? (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Account: <span className="text-gray-400 italic">Requires verification</span></span>
                    <span>·</span>
                    <span>RTN: <span className="text-gray-400 italic">Requires verification</span></span>
                  </div>
                  <RailBadge rail={payment.rail} />
                </div>
              </div>
            ) : verificationType === 'amount' ? (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-mono">{payment.recipientAccount}</span>
                  <span>·</span>
                  <span className="font-mono">{payment.recipientRtn}</span>
                </div>
                <RailBadge rail={payment.rail} />
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-mono">{payment.recipientAccount}</span>
                  <span>·</span>
                  <span className="font-mono">{payment.recipientRtn}</span>
                </div>
                <RailBadge rail={payment.rail} />
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
              <InstructionTypeBadge type={payment.instructionType || 'bank_initiated'} />
              {payment.instructionType === 'account_holder' && payment.accountHolder && (
                <span className="text-xs text-violet-600">
                  {payment.accountHolder.name} · {AUTHORIZATION_METHODS[payment.accountHolder.authorizationMethod]?.label}
                </span>
              )}
            </div>
          </div>

          {/* Verification Type Indicator */}
          <div className={`p-3 rounded-lg ${
            verificationType === 'sight' ? 'bg-green-50 border border-green-200' :
            verificationType === 'amount' ? 'bg-blue-50 border border-blue-200' :
            'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${
                verificationType === 'sight' ? 'text-green-600' :
                verificationType === 'amount' ? 'text-blue-600' :
                'text-amber-600'
              }`} />
              <div>
                <p className={`font-medium ${
                  verificationType === 'sight' ? 'text-green-800' :
                  verificationType === 'amount' ? 'text-blue-800' :
                  'text-amber-800'
                }`}>
                  {verificationType === 'sight' ? 'Sight Approval' :
                   verificationType === 'amount' ? 'Amount Verification Required' :
                   'Full Verification Required'}
                </p>
                <p className="text-xs text-gray-600">
                  {verificationType === 'sight' ? 'Review the payment details above and click approve to confirm.' :
                   verificationType === 'amount' ? 'Enter the payment amount from your records to confirm this transaction.' :
                   'Enter the amount, account number, and RTN from your records to confirm this transaction.'}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Fields — no hints, no pre-filled values */}
          {verificationType !== 'sight' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    value={verifyAmount}
                    onChange={e => { setVerifyAmount(e.target.value); setErrors({ ...errors, amount: null }); }}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg ${errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
              </div>

              {verificationType === 'full' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={verifyAccount}
                      onChange={e => { setVerifyAccount(e.target.value); setErrors({ ...errors, account: null }); }}
                      placeholder="Enter full account number"
                      className={`w-full px-4 py-2 border rounded-lg font-mono ${errors.account ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors.account && <p className="text-sm text-red-600 mt-1">{errors.account}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient RTN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={verifyRtn}
                      onChange={e => { setVerifyRtn(e.target.value); setErrors({ ...errors, rtn: null }); }}
                      placeholder="Enter 9-digit routing number"
                      maxLength={9}
                      className={`w-full px-4 py-2 border rounded-lg font-mono ${errors.rtn ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    />
                    {errors.rtn && <p className="text-sm text-red-600 mt-1">{errors.rtn}</p>}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={validateAndApprove}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {verificationType === 'sight' ? 'Approve Payment' : 'Verify & Approve'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

// Reject Modal Component
function RejectModal({ payment, onClose, onReject }) {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [rejected, setRejected] = useState(false);

  const presetReasons = [
    'Incorrect amount',
    'Wrong recipient',
    'Duplicate payment',
    'Exceeds approved budget',
    'Insufficient documentation',
    'Suspected fraud',
  ];

  const handleReject = () => {
    setRejected(true);
    setTimeout(() => onReject(), 1500);
  };

  if (rejected) {
    return (
      <div className="fixed inset-0 bg-black/50 z-40 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Rejected</h3>
          <p className="text-gray-500">The rejection has been recorded.</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Reject Payment</h2>
              <p className="text-sm text-gray-500">{payment.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 min-h-0 overflow-y-auto">
          {/* Payment Summary */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-semibold text-gray-800">{payment.recipient}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-2xl font-bold text-gray-800">${payment.amount.toLocaleString()}</p>
              </div>
            </div>
            {payment.instructionType === 'account_holder' && payment.accountHolder && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                <InstructionTypeBadge type="account_holder" />
                <span className="text-xs text-violet-600">{payment.accountHolder.name}</span>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">This action cannot be undone</p>
                <p className="text-xs text-red-600">A new payment must be initiated if this rejection is in error.</p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetReasons.map(r => (
                <button
                  key={r}
                  onClick={() => { setSelectedReason(r); setReason(r); }}
                  className={`px-3 py-2 text-sm rounded-lg border text-left transition-colors ${
                    selectedReason === r ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setSelectedReason(''); }}
              placeholder="Or enter a custom reason..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={!reason.trim()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
