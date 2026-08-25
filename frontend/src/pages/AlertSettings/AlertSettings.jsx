import { useState, useEffect } from "react";
import {
  BellRing,
  Clock,
  Send,
  MessageSquare,
  Key,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Search,
  Check,
  XCircle,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { getAlertSettings, updateAlertSettings, triggerAlertsNow, testSendAlert, getAlertLogs } from "../../api/alertApi";
import Topbar from "../../components/Topbar";
import Card from "../../components/Card";
import Button from "../../components/Button";

function AlertSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    cutoff_time: "09:00",
    provider: "mock",
    account_sid: "",
    auth_token: "",
    from_number: "",
    api_key: "",
    message_template:
      "Dear Parent, your child {student_name} (Roll: {roll}) is marked ABSENT today ({date}). Please contact administration if unexpected.",
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Test Modal State
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testChannel, setTestChannel] = useState("whatsapp");
  const [testCustomMsg, setTestCustomMsg] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [settRes, logRes] = await Promise.all([
        getAlertSettings(),
        getAlertLogs(),
      ]);
      if (settRes.data) {
        setSettings({
          ...settRes.data,
          account_sid: settRes.data.account_sid || "",
          auth_token: settRes.data.auth_token || "",
          from_number: settRes.data.from_number || "",
          api_key: settRes.data.api_key || "",
        });
      }
      if (logRes.data) {
        setLogs(logRes.data);
      }
    } catch (err) {
      console.error("Failed to load alert settings:", err);
      setErrorMsg("Failed to load alert settings or logs");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await updateAlertSettings(settings);
      setSettings(res.data);
      setSuccessMsg("Alert settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to update alert settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerNow = async () => {
    if (!window.confirm("Check absent students and dispatch instant parent alerts now?")) return;
    setTriggering(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await triggerAlertsNow();
      setSuccessMsg(
        `Absent alert check completed! Total Absent: ${res.data.total_absent_detected || 0}, Sent: ${res.data.alerts_sent || 0}, Skipped: ${res.data.skipped_already_sent || 0}`
      );
      // Refresh logs
      const logRes = await getAlertLogs();
      setLogs(logRes.data || []);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Failed to execute manual alert check");
    } finally {
      setTriggering(false);
    }
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testPhone.trim()) return;
    setTestLoading(true);
    setTestResult(null);

    try {
      const res = await testSendAlert({
        phone: testPhone.trim(),
        channel: testChannel,
        message: testCustomMsg.trim() || undefined,
      });
      setTestResult({
        status: res.data.status,
        detail: res.data.detail,
      });
      const logRes = await getAlertLogs();
      setLogs(logRes.data || []);
    } catch (err) {
      setTestResult({
        status: "FAILED",
        detail: err.response?.data?.detail || "Test message failed to send",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.student_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (l.roll && l.roll.toLowerCase().includes(searchFilter.toLowerCase())) ||
      l.parent_phone.includes(searchFilter)
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pl-0 lg:pl-72 transition-all">
      <Topbar title="Automated Parent Alerts (SMS / WhatsApp)" />

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 p-6 md:p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-md">
                <BellRing size={14} className="animate-bounce" /> Real-time Dispatch System
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Automated Parent SMS & WhatsApp Alerts
              </h1>
              <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                Automatically notify parents via WhatsApp or SMS if a student is absent by the designated cutoff time (e.g. 09:00 AM).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTriggerNow}
                disabled={triggering}
                className="flex items-center gap-2 rounded-2xl bg-white text-blue-900 px-5 py-3 text-sm font-bold shadow-lg hover:bg-blue-50 transition active:scale-95 disabled:opacity-50"
              >
                <Play size={18} className={triggering ? "animate-spin" : "text-blue-600"} />
                <span>{triggering ? "Checking..." : "Run Absent Check Now"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowTestModal(true);
                  setTestResult(null);
                }}
                className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 text-sm font-bold backdrop-blur-md transition active:scale-95"
              >
                <Send size={18} />
                <span>Send Test Alert</span>
              </button>
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-700 dark:text-emerald-300 font-semibold text-sm animate-fade-in">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-rose-700 dark:text-rose-300 font-semibold text-sm animate-fade-in">
            <AlertTriangle size={20} className="shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* CONFIGURATION FORM */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                      <Clock size={22} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Cutoff & Channel Configuration
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Set daily cut-off time & preferred message channel
                      </p>
                    </div>
                  </div>

                  {/* Enable Switch */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {settings.enabled ? "Alerts Enabled" : "Disabled"}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="relative w-12 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Cutoff Time */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Daily Absent Cutoff Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={settings.cutoff_time}
                        onChange={(e) => setSettings({ ...settings, cutoff_time: e.target.value })}
                        className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      At this time (e.g. 09:00 AM), the background job auto-checks for absent students.
                    </p>
                  </div>

                  {/* Provider Channel */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                      Message Dispatch Channel
                    </label>
                    <select
                      value={settings.provider}
                      onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                      className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none focus:border-blue-600 transition"
                    >
                      <option value="whatsapp">📱 WhatsApp API (Twilio / Meta API)</option>
                      <option value="sms">💬 SMS API (Twilio / Fast2SMS)</option>
                      <option value="mock">⚡ Simulated Provider (Development / Demo Mode)</option>
                    </select>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Select provider protocol. Simulated mode works out-of-the-box without credentials.
                    </p>
                  </div>
                </div>

                {/* API Credentials (If Twilio/WhatsApp/SMS selected) */}
                {settings.provider !== "mock" && (
                  <div className="space-y-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 p-5 border border-slate-200 dark:border-slate-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                      <Key size={14} /> Twilio / API Provider Configuration
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Account SID
                        </label>
                        <input
                          type="text"
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={settings.account_sid}
                          onChange={(e) => setSettings({ ...settings, account_sid: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Auth Token / API Key
                        </label>
                        <input
                          type="password"
                          placeholder="Your Auth Token"
                          value={settings.auth_token}
                          onChange={(e) => setSettings({ ...settings, auth_token: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        From Phone / WhatsApp Number
                      </label>
                      <input
                        type="text"
                        placeholder="whatsapp:+14155238886 or +14155238886"
                        value={settings.from_number}
                        onChange={(e) => setSettings({ ...settings, from_number: e.target.value })}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* Message Template Editor */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Custom Message Template
                  </label>
                  <textarea
                    rows={3}
                    value={settings.message_template}
                    onChange={(e) => setSettings({ ...settings, message_template: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-sm outline-none focus:border-blue-600 transition"
                  />
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Available Tags:</span>
                    <code className="rounded bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 text-blue-600 dark:text-blue-400 font-mono">{"{student_name}"}</code>
                    <code className="rounded bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 text-blue-600 dark:text-blue-400 font-mono">{"{roll}"}</code>
                    <code className="rounded bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 text-blue-600 dark:text-blue-400 font-mono">{"{date}"}</code>
                    <code className="rounded bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 text-blue-600 dark:text-blue-400 font-mono">{"{parent_name}"}</code>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button disabled={saving}>
                    {saving ? "Saving Settings..." : "Save Alert Settings"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* SIDE PANEL: QUICK STATS & GUIDELINES */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <ShieldCheck size={20} className="text-blue-600" /> System Integration Status
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Scheduler Engine</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={14} /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Cutoff Schedule</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{settings.cutoff_time} Daily</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Active Channel</span>
                  <span className="font-bold uppercase text-purple-600 dark:text-purple-400">{settings.provider}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Sent Today</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{logs.length} Messages</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                💡 How Automated Alerts Work
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 leading-relaxed">
                <li>Every morning at <strong className="text-blue-600">{settings.cutoff_time}</strong>, the backend scans for students without attendance marked as Present.</li>
                <li>The system retrieves the student's parent phone number and formats the custom notification message.</li>
                <li>Messages are dispatched via <strong>WhatsApp or SMS</strong> according to your provider configuration.</li>
                <li>All alerts are logged into the system history below and updated in real-time.</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* ALERT LOGS TABLE */}
        <Card>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageSquare size={22} className="text-blue-600" /> Parent Alert History Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed record of all sent SMS and WhatsApp messages
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student or phone..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={fetchData}
                className="rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Refresh Logs"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Parent Phone</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Message Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No alert logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {new Date(log.sent_at).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{log.student_name}</div>
                        <div className="text-[10px] text-slate-400">Roll: {log.roll || "N/A"}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {log.parent_phone}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                          {log.channel}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            log.status === "SENT"
                              ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600"
                              : log.status === "SIMULATED"
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-600"
                              : "bg-rose-50 dark:bg-rose-950 text-rose-600"
                          }`}
                        >
                          {log.status === "SENT" || log.status === "SIMULATED" ? (
                            <Check size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 dark:text-slate-400" title={log.message}>
                        {log.message}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* TEST ALERT MODAL */}
      {showTestModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Send Test Parent Alert</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTestModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Parent Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="+919876543210"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-mono outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test Channel
                </label>
                <select
                  value={testChannel}
                  onChange={(e) => setTestChannel(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-600"
                >
                  <option value="whatsapp">WhatsApp API</option>
                  <option value="sms">SMS API</option>
                  <option value="mock">Simulated Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Custom Test Message (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Test alert message..."
                  value={testCustomMsg}
                  onChange={(e) => setTestCustomMsg(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs outline-none focus:border-blue-600"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold ${
                    testResult.status === "SENT" || testResult.status === "SIMULATED"
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                      : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  <strong>Status: {testResult.status}</strong> - {testResult.detail}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTestModal(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-medium"
                >
                  Close
                </button>
                <Button disabled={testLoading}>
                  {testLoading ? "Sending..." : "Dispatch Test Alert"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertSettings;
