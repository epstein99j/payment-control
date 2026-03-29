import React, { useState, useEffect } from 'react';
import {
  Bell, Shield, Clock, Users, FileText, Settings, Send, CheckCircle,
  XCircle, AlertTriangle, ChevronRight, Plus, Search, Download,
  Zap, Activity, Eye, Edit, Trash2, Copy, Mail, MessageSquare,
  Webhook, ToggleLeft, ToggleRight, Calendar, DollarSign, ArrowUpRight,
  RefreshCw, Power, Router, Building2, Hash, Loader2, UserCheck, Briefcase,
  Lock, Fingerprint, Phone, PenTool, Link, Key, TestTube, Globe, Save,
  UserCog, Layers, ShieldCheck, UserPlus, UserX, Info, HelpCircle, ArrowRight
} from 'lucide-react';

// Empty data - no sample data
const mockPayments = [];
const mockTemplates = [];
const mockAuditLogs = [];
const mockNotifications = [];
const mockAccountHolders = [];
const recentBeneficiaries = [];

// Permission definitions - building blocks for roles
const PERMISSION_DEFINITIONS = {
  initiate_payments: { label: 'Initiate Payments', category: 'Payments', description: 'Create new payment requests' },
  approve_payments: { label: 'Approve Payments', category: 'Payments', description: 'Approve others\' payments (up to role limit)' },
  reject_payments: { label: 'Reject Payments', category: 'Payments', description: 'Reject payment requests' },
  cancel_payments: { label: 'Cancel Payments', category: 'Payments', description: 'Cancel pending payments' },
  view_all_payments: { label: 'View All Payments', category: 'Payments', description: 'See payments beyond own' },
  create_templates: { label: 'Create Templates', category: 'Templates', description: 'Add new payment templates' },
  edit_templates: { label: 'Edit Templates', category: 'Templates', description: 'Modify existing templates' },
  delete_templates: { label: 'Delete Templates', category: 'Templates', description: 'Remove templates' },
  use_templates: { label: 'Use Templates', category: 'Templates', description: 'Initiate payments from templates' },
  view_users: { label: 'View Users', category: 'User Management', description: 'See user list' },
  create_users: { label: 'Create Users', category: 'User Management', description: 'Add new users' },
  edit_users: { label: 'Edit Users', category: 'User Management', description: 'Modify user details/roles' },
  disable_users: { label: 'Disable Users', category: 'User Management', description: 'Deactivate accounts' },
  view_controls: { label: 'View Controls', category: 'Controls', description: 'See limits, thresholds' },
  edit_controls: { label: 'Edit Controls', category: 'Controls', description: 'Modify limits, thresholds' },
  view_roles: { label: 'View Roles', category: 'Role Management', description: 'See role definitions' },
  create_roles: { label: 'Create Roles', category: 'Role Management', description: 'Add new roles' },
  edit_roles: { label: 'Edit Roles', category: 'Role Management', description: 'Modify role permissions' },
  delete_roles: { label: 'Delete Roles', category: 'Role Management', description: 'Remove roles' },
  manage_departments: { label: 'Manage Departments', category: 'Organization', description: 'Create/edit departments' },
  view_audit_logs: { label: 'View Audit Logs', category: 'Audit', description: 'See all activity logs' },
  export_audit_logs: { label: 'Export Audit Logs', category: 'Audit', description: 'Download logs' },
};

const PERMISSION_CATEGORIES = ['Payments', 'Templates', 'User Management', 'Controls', 'Role Management', 'Organization', 'Audit'];

// Mock current user (would come from auth)
const CURRENT_USER = {
  id: 'USR-001',
  name: 'Justin Davis',
  email: 'jdavis@fnb.com',
  isSuperAdmin: true,
  roleId: 'ROLE-SA',
  roleName: 'Super Admin',
  department: 'Treasury',
};

// Institution's RTN (always the same for FROM)
const INSTITUTION_RTN = '021000021';
const INSTITUTION_NAME = 'Payfinia Bank';

// Instruction type constants
const INSTRUCTION_TYPES = {
  bank_initiated: { label: 'Bank-Initiated', desc: 'Internal treasury or operations payment', icon: 'Building2', color: 'blue' },
  account_holder: { label: 'Account Holder Request', desc: 'Payment requested by an account holder', icon: 'UserCheck', color: 'violet' },
};

// Authorization method definitions
const AUTHORIZATION_METHODS = {
  in_person: { label: 'In-Person (Branch)', desc: 'Account holder present with valid ID', icon: 'UserCheck' },
  authenticated_digital: { label: 'Authenticated Digital', desc: 'Verified via online banking or secure portal', icon: 'Fingerprint' },
  phone_verified: { label: 'Phone (Verified)', desc: 'Phone request with identity verification', icon: 'Phone' },
  written_request: { label: 'Written Request', desc: 'Signed letter or fax with authorization', icon: 'PenTool' },
};

// Mock accounts for FROM selection (keep these as they're config, not transactions)
const fromAccounts = [
  { id: 'ACC-001', type: 'account', name: 'Operating Account', number: '****1234', balance: 2500000 },
  { id: 'ACC-002', type: 'account', name: 'Payroll Account', number: '****5678', balance: 850000 },
  { id: 'ACC-003', type: 'account', name: 'Reserve Account', number: '****9012', balance: 5000000 },
  { id: 'GL-001', type: 'gl', name: 'GL-50100 - Accounts Payable', number: 'GL-50100', balance: null },
  { id: 'GL-002', type: 'gl', name: 'GL-50200 - Vendor Payments', number: 'GL-50200', balance: null },
];

// RTN database for validation (keep as reference data)
const rtnDatabase = {
  '021000021': { name: 'JPMorgan Chase', fedNow: true, rtp: true, status: 'active' },
  '021000089': { name: 'Citibank', fedNow: true, rtp: true, status: 'active' },
  '026009593': { name: 'Bank of America', fedNow: true, rtp: false, status: 'active' },
  '031101279': { name: 'Capital One', fedNow: true, rtp: true, status: 'active' },
  '071000013': { name: 'First National Bank', fedNow: false, rtp: true, status: 'active' },
  '999999999': { name: 'Test Bank', fedNow: false, rtp: false, status: 'inactive' },
};

// API Integration helper
const getApiConfig = () => {
  try {
    const config = localStorage.getItem('paycontrol_api_config');
    return config ? JSON.parse(config) : { url: '', apiKey: '', enabled: false };
  } catch {
    return { url: '', apiKey: '', enabled: false };
  }
};

const saveApiConfig = (config) => {
  localStorage.setItem('paycontrol_api_config', JSON.stringify(config));
};

const sendToApi = async (payment, action) => {
  const config = getApiConfig();
  if (!config.enabled || !config.url) {
    console.log('API not configured, skipping send');
    return { success: false, error: 'API not configured' };
  }
  
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'X-API-Key': config.apiKey,
      },
      body: JSON.stringify({
        action,
        timestamp: new Date().toISOString(),
        payment: {
          id: payment.id,
          recipient: payment.recipient,
          recipientRtn: payment.recipientRtn,
          recipientAccount: payment.recipientAccount,
          fromAccount: payment.fromAccount,
          amount: payment.amount,
          rail: payment.rail,
          status: payment.status,
          instructionType: payment.instructionType,
          accountHolder: payment.accountHolder || null,
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return { success: false, error: error.message };
  }
};

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
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {labels[status] || status}
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

// Empty State Component
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 text-center max-w-md mb-4">{description}</p>
    {action}
  </div>
);

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
  const [payments, setPayments] = useState(mockPayments);
  const [templates, setTemplates] = useState(mockTemplates);
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle opening approval modal
  const handleOpenApproval = (payment, verificationType) => {
    setApprovalPayment({ payment, verificationType });
    setDismissingDetail(true);
    setTimeout(() => { setSelectedPayment(null); setDismissingDetail(false); }, 400);
  };

  // Handle opening reject modal
  const handleOpenReject = (payment) => {
    setRejectPayment(payment);
    setDismissingDetail(true);
    setTimeout(() => { setSelectedPayment(null); setDismissingDetail(false); }, 400);
  };

  const handleCloseApproval = () => setApprovalPayment(null);
  const handleCloseReject = () => setRejectPayment(null);

  // Handle approval complete - send to API
  const handleApprovalComplete = async (payment) => {
    const result = await sendToApi(payment, 'approved');
    console.log('API result:', result);
    setApprovalPayment(null);
  };

  const handleRejectComplete = () => setRejectPayment(null);

  const cpmSubTabs = [
    { id: 'payments', label: 'Payments', icon: Send },
    { id: 'templates', label: 'Templates', icon: FileText },
    { id: 'controls', label: 'Controls', icon: Shield },
    { id: 'audit', label: 'Audit Log', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
  ];

  const adminTabs = [
    { id: 'admin', label: 'Administration', icon: UserCog },
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
        <nav className="flex-1 p-4 overflow-y-auto">
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

          {/* Admin Section - only show if user has admin permissions */}
          {CURRENT_USER.isSuperAdmin && (
            <>
              <div className="mt-6 mb-2 px-3 py-2">
                <div className="flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-purple-400" />
                  <span className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Admin</span>
                </div>
              </div>
              <ul className="space-y-1 ml-2">
                {adminTabs.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                        activeTab === item.id ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
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
                {activeTab === 'admin' ? 'Administration' : `CPM — ${cpmSubTabs.find(n => n.id === activeTab)?.label || ''}`}
              </h2>
              <p className="text-sm text-gray-500">
                {activeTab === 'admin' ? 'Manage users, roles, and organization settings' : 'FedNow & RTP Payment Control System'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {activeTab !== 'admin' && (
                <button
                  onClick={() => setShowNewPayment(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  New Payment
                </button>
              )}
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
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
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
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'payments' && <PaymentsList payments={payments} onSelectPayment={setSelectedPayment} onNewPayment={() => setShowNewPayment(true)} />}
          {activeTab === 'templates' && <TemplatesView templates={templates} setTemplates={setTemplates} />}
          {activeTab === 'controls' && <ControlsPanel />}
          {activeTab === 'audit' && <AuditLog logs={auditLogs} />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'integrations' && <IntegrationsPanel />}
          {activeTab === 'admin' && <FIAdminPanel currentUser={CURRENT_USER} />}
        </div>
      </main>

      {showNewPayment && <NewPaymentModal onClose={() => setShowNewPayment(false)} />}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
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
          onApprove={() => handleApprovalComplete(approvalPayment.payment)}
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

// Integrations Panel - API Configuration
function IntegrationsPanel() {
  const [config, setConfig] = useState(getApiConfig());
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = () => {
    saveApiConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
          'X-API-Key': config.apiKey,
        },
        body: JSON.stringify({
          action: 'test',
          timestamp: new Date().toISOString(),
          payment: {
            id: 'TEST-001',
            recipient: 'Test Recipient',
            recipientRtn: '021000021',
            recipientAccount: '****1234',
            fromAccount: 'Operating - ****1234',
            amount: 100.00,
            rail: 'FedNow',
            status: 'test',
          }
        }),
      });
      
      if (response.ok) {
        setTestResult({ success: true, message: `Success! HTTP ${response.status}` });
      } else {
        setTestResult({ success: false, message: `HTTP ${response.status}: ${response.statusText}` });
      }
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    }
    
    setTesting(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Webhook className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Payment API Integration</h3>
              <p className="text-sm text-gray-500">Configure the third-party service for approved payments</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Enable API Integration</p>
              <p className="text-sm text-gray-500">Send approved payments to your third-party service</p>
            </div>
            <button
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`w-12 h-6 rounded-full transition-colors ${config.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${config.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* API URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                API Endpoint URL
              </div>
            </label>
            <input
              type="url"
              value={config.url}
              onChange={e => setConfig({ ...config, url: e.target.value })}
              placeholder="https://api.yourservice.com/payments"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">The URL where approved payment data will be sent via POST</p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-gray-400" />
                API Key
              </div>
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={e => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="Enter your API key"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Sent as both Authorization: Bearer header and X-API-Key header</p>
          </div>

          {/* Payload Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payload Format (JSON)
            </label>
            <pre className="p-4 bg-slate-800 text-slate-100 rounded-lg text-xs overflow-x-auto">
{`{
  "action": "approved",
  "timestamp": "2024-01-18T10:30:00.000Z",
  "payment": {
    "id": "PAY-001",
    "recipient": "Acme Corp",
    "recipientRtn": "021000021",
    "recipientAccount": "****4521",
    "fromAccount": "Operating - ****1234",
    "amount": 125000,
    "rail": "FedNow",
    "status": "approved",
    "instructionType": "bank_initiated",
    "accountHolder": null
  }
}`}
            </pre>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div>
                <p className={`font-medium ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.success ? 'Connection Successful' : 'Connection Failed'}
                </p>
                <p className={`text-sm ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {testResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleTest}
            disabled={!config.url || testing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4" />
                Test Connection
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Integration Notes</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            Payments are sent to your API immediately upon final approval
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            The API key is sent in both <code className="bg-gray-100 px-1 rounded">Authorization: Bearer</code> and <code className="bg-gray-100 px-1 rounded">X-API-Key</code> headers
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            Your endpoint should return a 2xx status code to confirm receipt
          </li>
          <li className="flex items-start gap-2">
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            Failed API calls are logged but do not block payment approval
          </li>
        </ul>
      </div>
    </div>
  );
}

// Payments List Component
function PaymentsList({ payments, onSelectPayment, onNewPayment }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const pendingPayments = payments.filter(p => p.status === 'pending_approval');
  const otherPayments = payments.filter(p => p.status !== 'pending_approval');

  const filteredPayments = (activeTab === 'pending' ? pendingPayments : otherPayments).filter(p => {
    if (search && !p.recipient.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
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
        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" />Export
        </button>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={Send}
            title={activeTab === 'pending' ? 'No pending approvals' : 'No payments yet'}
            description={activeTab === 'pending' ? 'All payments have been processed. New payments requiring approval will appear here.' : 'Create your first payment to get started.'}
            action={
              <button onClick={onNewPayment} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Payment
              </button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rail</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className={`hover:bg-gray-50 ${payment.status === 'pending_approval' ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">{payment.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{payment.recipient}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-semibold">${payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><RailBadge rail={payment.rail} /></td>
                  <td className="px-4 py-3"><StatusBadge status={payment.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onSelectPayment(payment)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                      {payment.status === 'pending_approval' && (
                        <>
                          <button onClick={() => onSelectPayment(payment)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Templates View Component
function TemplatesView({ templates, setTemplates }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

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

      {templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={FileText}
            title="No templates yet"
            description="Create reusable payment templates for recurring transactions to save time and reduce errors."
            action={
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            }
          />
        </div>
      ) : (
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
                    <p className="text-sm text-gray-500 mt-1">{template.recipient} • ${template.defaultAmount?.toLocaleString()} (default) • {template.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Controls Panel
function ControlsPanel() {
  const [activeControlTab, setActiveControlTab] = useState('amount');

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1 space-y-2">
        {[
          { id: 'amount', label: 'Amount Limits', icon: DollarSign },
          { id: 'time', label: 'Time-Based', icon: Clock },
          { id: 'approval', label: 'Approval Matrix', icon: Shield },
          { id: 'velocity', label: 'Velocity Controls', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveControlTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeControlTab === tab.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <EmptyState
          icon={Shield}
          title="Controls Configuration"
          description="Configure payment limits, approval thresholds, time-based rules, and velocity controls to manage risk."
        />
      </div>
    </div>
  );
}

// Audit Log Component
function AuditLog({ logs }) {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'payment', 'approval', 'config', 'template'];

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
      
      {logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={Clock}
            title="No audit logs yet"
            description="All payment activities, approvals, and configuration changes will be recorded here."
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{log.action}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Notification Settings Component
function NotificationSettings() {
  const channels = [
    { id: 'email', name: 'Email', icon: Mail, enabled: true },
    { id: 'sms', name: 'SMS', icon: MessageSquare, enabled: false },
    { id: 'inapp', name: 'In-App', icon: Bell, enabled: true },
    { id: 'webhook', name: 'Webhooks', icon: Webhook, enabled: false }
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
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${channel.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="font-medium text-gray-800">{channel.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// New Payment Modal (simplified)
function NewPaymentModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">New Payment</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>
        <div className="p-6">
          <EmptyState
            icon={Send}
            title="Create New Payment"
            description="Payment creation form will appear here. Configure your payment details, recipient information, and approval requirements."
          />
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Payment</button>
        </div>
      </div>
    </div>
  );
}

// Payment Detail Modal (simplified)
function PaymentDetailModal({ payment, onClose, onOpenApproval, onOpenReject, dismissing }) {
  const getVerificationType = (amount) => {
    if (amount >= 250000) return 'full';
    if (amount >= 50000) return 'amount';
    return 'sight';
  };

  const verificationType = getVerificationType(payment.amount);

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${dismissing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white rounded-2xl w-full max-w-2xl shadow-2xl transition-all duration-300 ${dismissing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
              <p className="text-sm text-gray-500 font-mono">{payment.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="text-3xl font-bold text-gray-800">${payment.amount.toLocaleString()}</p>
            </div>
            <StatusBadge status={payment.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 uppercase font-medium">From</p>
              <p className="font-medium text-gray-800">{INSTITUTION_NAME}</p>
              <p className="text-sm text-gray-600 mt-1">{payment.fromAccount}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 uppercase font-medium">To</p>
              <p className="font-medium text-gray-800">{payment.recipient}</p>
              <p className="text-xs text-gray-500 font-mono">{payment.recipientRtn} • {payment.recipientAccount}</p>
            </div>
          </div>

          {payment.status === 'pending_approval' && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex gap-3">
                <button onClick={() => onOpenApproval(payment, verificationType)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button onClick={() => onOpenReject(payment)} className="flex-1 py-2.5 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Approval Verification Modal
function ApprovalVerificationModal({ payment, verificationType, onClose, onApprove }) {
  const [verifyAmount, setVerifyAmount] = useState('');
  const [verifyAccount, setVerifyAccount] = useState('');
  const [verifyRtn, setVerifyRtn] = useState('');
  const [errors, setErrors] = useState({});
  const [approved, setApproved] = useState(false);
  const [sending, setSending] = useState(false);

  const validateAndApprove = async () => {
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

    setSending(true);
    setApproved(true);
    
    // Send to API
    const config = getApiConfig();
    if (config.enabled && config.url) {
      await sendToApi(payment, 'approved');
    }
    
    setTimeout(() => onApprove(), 1500);
  };

  if (approved) {
    return (
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Approved</h3>
          <p className="text-gray-500">Your approval has been recorded and sent to the payment processor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Approve Payment</h2>
              <p className="text-sm text-gray-500">{payment.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
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
          </div>

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
                  {verificationType === 'sight' ? 'Click approve to confirm this payment' :
                   verificationType === 'amount' ? 'Enter the payment amount from your records to confirm' :
                   'Enter amount, account number, and RTN from your records to confirm'}
                </p>
              </div>
            </div>
          </div>

          {verificationType !== 'sight' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="text"
                    value={verifyAmount}
                    onChange={e => { setVerifyAmount(e.target.value); setErrors({ ...errors, amount: null }); }}
                    placeholder="Enter exact amount"
                    className={`w-full pl-8 pr-4 py-2 border rounded-lg ${errors.amount ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  />
                </div>
                {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
              </div>

              {verificationType === 'full' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Account Number</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient RTN</label>
                    <input
                      type="text"
                      value={verifyRtn}
                      onChange={e => { setVerifyRtn(e.target.value); setErrors({ ...errors, rtn: null }); }}
                      placeholder="Enter 9-digit RTN"
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

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button
            onClick={validateAndApprove}
            disabled={sending}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {verificationType === 'sight' ? 'Approve Payment' : 'Verify & Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reject Modal
function RejectModal({ payment, onClose, onReject }) {
  const [reason, setReason] = useState('');
  const [rejected, setRejected] = useState(false);

  const handleReject = () => {
    setRejected(true);
    setTimeout(() => onReject(), 1500);
  };

  if (rejected) {
    return (
      <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Rejected</h3>
          <p className="text-gray-500">The payment has been rejected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Reject Payment</h2>
              <p className="text-sm text-gray-500">{payment.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><XCircle className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-red-800">
              You are about to reject a payment of <strong>${payment.amount.toLocaleString()}</strong> to <strong>{payment.recipient}</strong>.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button
            onClick={handleReject}
            disabled={!reason.trim()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
          >
            Reject Payment
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FI ADMIN PANEL
// ============================================================================

function FIAdminPanel({ currentUser }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [showCreateDept, setShowCreateDept] = useState(false);

  const isSuperAdmin = currentUser?.isSuperAdmin;
  const pendingCount = pendingChanges.filter(c => c.status === 'pending').length;

  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'roles', label: 'Roles', icon: ShieldCheck },
    { id: 'departments', label: 'Departments', icon: Layers },
    { id: 'pending', label: 'Pending Approvals', icon: Clock, badge: pendingCount },
    { id: 'settings', label: 'FI Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <AdminUsersPanel 
          users={users}
          setUsers={setUsers}
          roles={roles}
          departments={departments}
          isSuperAdmin={isSuperAdmin}
          onCreateUser={() => setShowCreateUser(true)}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          currentUser={currentUser}
        />
      )}
      {activeTab === 'roles' && (
        <AdminRolesPanel
          roles={roles}
          setRoles={setRoles}
          isSuperAdmin={isSuperAdmin}
          onCreateRole={() => setShowCreateRole(true)}
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          currentUser={currentUser}
        />
      )}
      {activeTab === 'departments' && (
        <AdminDepartmentsPanel
          departments={departments}
          setDepartments={setDepartments}
          onCreateDept={() => setShowCreateDept(true)}
        />
      )}
      {activeTab === 'pending' && (
        <AdminPendingApprovals
          pendingChanges={pendingChanges}
          setPendingChanges={setPendingChanges}
          currentUser={currentUser}
          isSuperAdmin={isSuperAdmin}
        />
      )}
      {activeTab === 'settings' && (
        <AdminFISettings isSuperAdmin={isSuperAdmin} />
      )}

      {/* Modals */}
      {showCreateUser && (
        <AdminCreateUserModal
          roles={roles}
          departments={departments}
          onClose={() => setShowCreateUser(false)}
          onCreate={(user) => {
            if (isSuperAdmin) {
              setPendingChanges([...pendingChanges, {
                id: `CHG-${Date.now()}`,
                type: 'user_create',
                requestedBy: currentUser.id,
                requestedByName: currentUser.name,
                requestedAt: new Date().toISOString(),
                status: 'pending',
                data: user,
              }]);
            } else {
              setUsers([...users, { ...user, id: `USR-${Date.now()}`, status: 'active', createdAt: new Date().toISOString() }]);
            }
            setShowCreateUser(false);
          }}
          requiresApproval={isSuperAdmin}
        />
      )}
      {showCreateRole && (
        <AdminCreateRoleModal
          onClose={() => setShowCreateRole(false)}
          onCreate={(role) => {
            if (isSuperAdmin) {
              setPendingChanges([...pendingChanges, {
                id: `CHG-${Date.now()}`,
                type: 'role_create',
                requestedBy: currentUser.id,
                requestedByName: currentUser.name,
                requestedAt: new Date().toISOString(),
                status: 'pending',
                data: role,
              }]);
            } else {
              setRoles([...roles, { ...role, id: `ROLE-${Date.now()}` }]);
            }
            setShowCreateRole(false);
          }}
          requiresApproval={isSuperAdmin}
        />
      )}
      {showCreateDept && (
        <AdminCreateDepartmentModal
          onClose={() => setShowCreateDept(false)}
          onCreate={(dept) => {
            setDepartments([...departments, { ...dept, id: `DEPT-${Date.now()}` }]);
            setShowCreateDept(false);
          }}
        />
      )}
    </div>
  );
}

// EmptyState component for admin panels
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 text-center max-w-md mb-4">{description}</p>
      {action}
    </div>
  );
}

// Status Badge for admin
function StatusBadge({ status }) {
  const styles = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-600 border-gray-200',
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    suspended: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${styles[status] || styles.inactive}`}>
      {status}
    </span>
  );
}

// Admin Users Panel
function AdminUsersPanel({ users, setUsers, roles, departments, isSuperAdmin, onCreateUser }) {
  const [search, setSearch] = useState('');
  
  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button onClick={onCreateUser} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={Users}
            title="No users yet"
            description="Add users to your organization and assign them roles to control what they can access."
            action={
              <button onClick={onCreateUser} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <UserPlus className="w-4 h-4" />
                Add User
              </button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {user.name?.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.roleName || 'No Role'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.department || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Admin Roles Panel
function AdminRolesPanel({ roles, setRoles, isSuperAdmin, onCreateRole }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Define roles with specific permissions and approval limits</p>
        <button onClick={onCreateRole} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={ShieldCheck}
            title="No custom roles yet"
            description="Create roles to define what users can do. Each role has specific permissions and approval limits."
            action={
              <button onClick={onCreateRole} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Create Role
              </button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map(role => (
            <div key={role.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role.isSuperAdmin ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    <ShieldCheck className={`w-5 h-5 ${role.isSuperAdmin ? 'text-purple-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{role.name}</h3>
                    <p className="text-xs text-gray-500">{role.permissions?.length || 0} permissions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  {!role.isSystemRole && (
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {role.approvalLimit && (
                <p className="text-sm text-gray-600">
                  Approval limit: <span className="font-medium">${role.approvalLimit.toLocaleString()}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Admin Departments Panel
function AdminDepartmentsPanel({ departments, setDepartments, onCreateDept }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Organize users by department for approval routing</p>
        <button onClick={onCreateDept} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {departments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={Layers}
            title="No departments yet"
            description="Create departments to organize users and enable different-department approval requirements."
            action={
              <button onClick={onCreateDept} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Add Department
              </button>
            }
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.map(dept => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{dept.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{dept.userCount || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Admin Pending Approvals
function AdminPendingApprovals({ pendingChanges, setPendingChanges, currentUser, isSuperAdmin }) {
  const pending = pendingChanges.filter(c => c.status === 'pending');
  
  const handleApprove = (changeId) => {
    setPendingChanges(pendingChanges.map(c => 
      c.id === changeId ? { ...c, status: 'approved', approvedBy: currentUser.id, approvedAt: new Date().toISOString() } : c
    ));
  };

  const handleReject = (changeId) => {
    setPendingChanges(pendingChanges.map(c => 
      c.id === changeId ? { ...c, status: 'rejected', rejectedBy: currentUser.id, rejectedAt: new Date().toISOString() } : c
    ));
  };

  const getChangeTypeLabel = (type) => {
    const labels = {
      user_create: 'New User',
      user_edit: 'User Change',
      role_create: 'New Role',
      role_edit: 'Role Change',
      control_change: 'Control Change',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-4">
      {!isSuperAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">Only Super Admins can approve pending changes.</p>
        </div>
      )}

      {pending.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <EmptyState
            icon={CheckCircle}
            title="No pending approvals"
            description="All admin changes have been processed. Changes requiring dual Super Admin approval will appear here."
          />
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map(change => (
            <div key={change.id} className="bg-white rounded-xl border border-amber-200 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                        {getChangeTypeLabel(change.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Requested by {change.requestedByName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      {change.type === 'user_create' && `Create user: ${change.data?.name} (${change.data?.email})`}
                      {change.type === 'role_create' && `Create role: ${change.data?.name}`}
                      {change.type === 'control_change' && `Modify control: ${change.data?.controlName}`}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(change.requestedAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {isSuperAdmin && change.requestedBy !== currentUser.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(change.id)}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(change.id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                  </div>
                )}
                
                {change.requestedBy === currentUser.id && (
                  <span className="text-xs text-gray-400 italic">Awaiting other Super Admin</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Admin FI Settings
function AdminFISettings({ isSuperAdmin }) {
  const [makerChecker, setMakerChecker] = useState(true);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Organization Settings</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">Require Maker ≠ Checker</p>
                <p className="text-sm text-gray-500">Prevent users from approving their own payments</p>
              </div>
              <button 
                onClick={() => setMakerChecker(!makerChecker)}
                className={`w-10 h-6 rounded-full transition-colors ${makerChecker ? 'bg-purple-600' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${makerChecker ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Compensating Controls</h3>
        <p className="text-sm text-gray-500 mb-4">These are set by Payfinia and cannot be modified</p>
        
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">Max Single Transaction</span>
            <span className="text-sm font-medium text-gray-800">$1,000,000</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">Max Daily Volume</span>
            <span className="text-sm font-medium text-gray-800">$10,000,000</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-gray-700">Super Admin Change Notification</span>
            <span className="text-sm font-medium text-green-600">Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Create User Modal
function AdminCreateUserModal({ roles, departments, onClose, onCreate, requiresApproval }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: '',
    roleName: '',
    department: '',
    isSuperAdmin: false,
  });

  const handleSubmit = () => {
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Add User</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {requiresApproval && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Requires approval from another Super Admin
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.roleId}
              onChange={e => {
                const role = roles.find(r => r.id === e.target.value);
                setFormData({ ...formData, roleId: e.target.value, roleName: role?.name || '' });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          {departments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {requiresApproval ? 'Submit for Approval' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Admin Create Role Modal
function AdminCreateRoleModal({ onClose, onCreate, requiresApproval }) {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [],
    approvalLimit: '',
    isSuperAdmin: false,
  });

  const togglePermission = (permId) => {
    setFormData({
      ...formData,
      permissions: formData.permissions.includes(permId)
        ? formData.permissions.filter(p => p !== permId)
        : [...formData.permissions, permId]
    });
  };

  const handleSubmit = () => {
    onCreate({
      ...formData,
      approvalLimit: formData.approvalLimit ? parseInt(formData.approvalLimit) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Create Role</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {requiresApproval && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Requires approval from another Super Admin
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Treasury Manager"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Limit</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={formData.approvalLimit}
                onChange={e => setFormData({ ...formData, approvalLimit: e.target.value })}
                placeholder="Leave empty for no approval rights"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="space-y-4">
              {PERMISSION_CATEGORIES.map(category => {
                const categoryPerms = Object.entries(PERMISSION_DEFINITIONS).filter(([, def]) => def.category === category);
                if (categoryPerms.length === 0) return null;
                
                return (
                  <div key={category}>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">{category}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {categoryPerms.map(([permId, def]) => (
                        <label key={permId} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permId)}
                            onChange={() => togglePermission(permId)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{def.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {requiresApproval ? 'Submit for Approval' : 'Create Role'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Admin Create Department Modal
function AdminCreateDepartmentModal({ onClose, onCreate }) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Add Department</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Treasury, Operations, Finance"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => onCreate({ name })}
            disabled={!name}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Add Department
          </button>
        </div>
      </div>
    </div>
  );
}
