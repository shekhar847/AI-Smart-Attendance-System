"use client";

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
  Smartphone,
  ShieldCheck,
  X,
} from "lucide-react";

import ProtectedRoute from "../../components/ProtectedRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import Button from "../../components/Button";

import {
  getAlertSettings,
  updateAlertSettings,
  triggerAlertsNow,
  testSendAlert,
  getAlertLogs,
} from "../../api/alertApi";
import { AlertSettingsData, AlertLog } from "../../types";

export default function AlertSettingsPage() {
  const [settings, setSettings] = useState<AlertSettingsData>({
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

  const [logs, setLogs] = useState<AlertLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Test Modal
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testChannel, setTestChannel] = useState("whatsapp");
  const [testCustomMsg, setTestCustomMsg] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [settingsRes, logsRes] = await Promise.all([
        getAlertSettings(),
        getAlertLogs(),
      ]);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (logsRes.data) setLogs(logsRes.data || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to load alert system parameters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await updateAlertSettings(settings);
      setSuccessMsg("Alert dispatch configuration saved successfully!");
    } catch (err: any) {
      setErrorMsg("Failed to update settings: " + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerNow = async () => {
    if (!confirm("Trigger real-time absence verification check and send alerts to parents?"))
      return;
    setTriggering(true);
    try {
      const res = await triggerAlertsNow();
      alert(res.data?.message || "Trigger completed!");
      fetchData();
    } catch (err: any) {
      alert("Trigger failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setTriggering(false);
    }
  };

  const handleSendTest = async () => {
    if (!testPhone.trim()) {
      alert("Please provide a destination phone number");
      return;
    }
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await testSendAlert({
        phone: testPhone,
        channel: testChannel,
        message: testCustomMsg || undefined,
      });
      setTestResult(res.data?.message || "Test dispatched successfully!");
    } catch (err: any) {
      setTestResult("Test failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setTestLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.student_name?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      l.recipient_phone?.includes(searchFilter)
  );

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <DashboardLayout>
        <PageTitle
          title="Parent Alert Dispatch Center"
          subtitle="Configure automated SMS & WhatsApp notification triggers for absent students"
        >
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowTestModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Smartphone size={16} className="text-cyan-500" />
              Test Dispatch
            </button>
            <button
              onClick={handleTriggerNow}
              disabled={triggering}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c8f135] px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-[#c8f135]/25 hover:bg-[#b5e028] transition active:scale-95"
            >
              <Play size={16} />
              {triggering ? "Checking Absent..." : "Trigger Alerts Now"}
            </button>
          </div>
        </PageTitle>

        {successMsg && (
          <div className="mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-3 mb-10">
          <div className="lg:col-span-2 rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BellRing size={20} className="text-blue-500" /> Automation Parameters
            </h3>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Automatic Daily Absence Trigger
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically check attendance status at cutoff time and dispatch notifications
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Daily Cutoff Time
                </label>
                <input
                  type="time"
                  value={settings.cutoff_time}
                  onChange={(e) => setSettings({ ...settings, cutoff_time: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Gateway Provider
                </label>
                <select
                  value={settings.provider}
                  onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600"
                >
                  <option value="mock">Local Simulator (Mock Logger)</option>
                  <option value="twilio">Twilio Cloud (SMS / WhatsApp)</option>
                  <option value="fast2sms">Fast2SMS Gateway</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message Template
              </label>
              <textarea
                rows={3}
                value={settings.message_template}
                onChange={(e) =>
                  setSettings({ ...settings, message_template: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 leading-relaxed font-sans"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Available tags: <code className="text-blue-500">&#123;student_name&#125;</code>, <code className="text-blue-500">&#123;roll&#125;</code>, <code className="text-blue-500">&#123;date&#125;</code>
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={saving} className="w-auto px-8">
                {saving ? "Saving Changes..." : "Save Configuration"}
              </Button>
            </div>
          </div>

          <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key size={18} className="text-amber-500" /> Gateway Credentials
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              API tokens required when using active cloud providers. If using simulator, mock tokens are auto-generated.
            </p>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Account SID / Client ID
              </label>
              <input
                type="text"
                placeholder="ACXXXXXXXXXXXXXXXXX"
                value={settings.account_sid || ""}
                onChange={(e) => setSettings({ ...settings, account_sid: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Auth Token / Secret
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={settings.auth_token || ""}
                onChange={(e) => setSettings({ ...settings, auth_token: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sender Number / Header
              </label>
              <input
                type="text"
                placeholder="+14155238886 or SMARTATT"
                value={settings.from_number || ""}
                onChange={(e) => setSettings({ ...settings, from_number: e.target.value })}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
          </div>
        </form>

        {/* Logs Table */}
        <div className="rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Dispatch History & Audit Trail
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Logs of every SMS and WhatsApp message sent to guardians
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Filter logs by student or phone..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3.5 pl-6">Student</th>
                  <th className="p-3.5">Guardian Phone</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Message Content</th>
                  <th className="p-3.5 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 pl-6 font-bold text-slate-900 dark:text-white">
                        {log.student_name || `Student #${log.student_id}`}
                      </td>
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                        {log.recipient_phone}
                      </td>
                      <td className="p-3.5 uppercase font-bold text-[10px] text-blue-500">
                        {log.channel}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {log.message}
                      </td>
                      <td className="p-3.5 pr-6 text-right">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                            log.status === "Sent"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No dispatch logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Test Modal */}
        {showTestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl glass-card border border-white/40 dark:border-slate-800 p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Send Test Notification
                </h3>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Recipient Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Channel
                  </label>
                  <select
                    value={testChannel}
                    onChange={(e) => setTestChannel(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="whatsapp">WhatsApp Message</option>
                    <option value="sms">SMS Text</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Test message..."
                    value={testCustomMsg}
                    onChange={(e) => setTestCustomMsg(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                {testResult && (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-cyan-400">
                    {testResult}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTestModal(false)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={testLoading}
                    className="rounded-xl bg-[#c8f135] px-5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-[#c8f135]/25 hover:bg-[#b5e028] transition"
                  >
                    {testLoading ? "Dispatching..." : "Send Test Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
