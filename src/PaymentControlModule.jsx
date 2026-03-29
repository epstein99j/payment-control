import React, { useState, useEffect } from 'react';
import {
  Bell, Shield, Clock, Users, FileText, Settings, Send, CheckCircle,
  XCircle, AlertTriangle, ChevronRight, Plus, Search, Download,
  Zap, Activity, Eye, Edit, Trash2, Copy, Mail, MessageSquare,
  Webhook, ToggleLeft, ToggleRight, Calendar, DollarSign, ArrowUpRight,
  RefreshCw, Power, Router, Building2, Hash, Loader2, UserCheck, Briefcase,
  Lock, Fingerprint, Phone, PenTool, Link, Key, TestTube, Globe, Save
} from 'lucide-react';

// Empty data - no sample data
const mockPayments = [];
const mockTemplates = [];
const mockAuditLogs = [];
const mockNotifications = [];
const mockAccountHolders = [];
const recentBeneficiaries = [];

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
