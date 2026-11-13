import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RefreshCw, Send, Trash2 } from "lucide-react";

const OrganizationAlerts = () => {
  const { alertsApi } = useOutletContext();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientType, setRecipientType] = useState("all");

  const sendBroadcast = async (event) => {
    event.preventDefault();
    try {
      const broadcastData = { title, message };
      if (recipientType !== "all") broadcastData.role_codes = [recipientType];
      await alertsApi.broadcastNotification({
        ...broadcastData
      });
      setTitle("");
      setMessage("");
    } catch (error) {
      console.warn("Unable to send organization broadcast:", error);
    }
  };

  const removeAlert = async (id) => {
    try {
      await alertsApi.deleteNotification(id);
    } catch (error) {
      console.warn("Unable to delete organization alert:", error);
    }
  };

  return (
    <div className="space-y-6 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-3 border-b pb-4">
        <div>
          <h3 className="text-xl font-semibold">System Alerts</h3>
          <p className="mt-1 text-sm text-gray-600">Organization notifications and broadcasts.</p>
        </div>
        <button onClick={() => alertsApi.refreshData(true)} aria-label="Refresh alerts" className="rounded-lg border p-3 text-gray-700 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={sendBroadcast} className="space-y-3 rounded-xl border bg-gray-50 p-4">
        <h4 className="font-semibold">Send a broadcast</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded-lg border bg-white px-3 py-2" placeholder="Notification title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <select className="rounded-lg border bg-white px-3 py-2" value={recipientType} onChange={(event) => setRecipientType(event.target.value)}>
            <option value="all">Everyone</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="parent">Parents</option>
          </select>
        </div>
        <textarea className="w-full rounded-lg border bg-white px-3 py-2" placeholder="Write a message" value={message} onChange={(event) => setMessage(event.target.value)} required rows={3} />
        <button disabled={alertsApi.mutating} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
          <Send className="h-4 w-4" />{alertsApi.mutating ? "Sending…" : "Send broadcast"}
        </button>
      </form>

      <div>
        <h4 className="mb-3 font-semibold">Notifications ({alertsApi.totalNotifications})</h4>
        {alertsApi.error && <p role="alert" className="mb-3 text-sm text-red-700">{alertsApi.error.message}</p>}
        {alertsApi.loading ? <p className="py-8 text-center text-gray-500">Loading notifications…</p> : alertsApi.notifications.length ? (
          <div className="space-y-3">
            {alertsApi.notifications.map((alert, index) => (
              <article key={alert.id || index} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                <div>
                  <h5 className="font-medium text-gray-900">{alert.title || alert.subject || "Notification"}</h5>
                  <p className="mt-1 text-sm text-gray-700">{alert.message || alert.body || alert.description || "No message content."}</p>
                  <p className="mt-2 text-xs text-gray-500">{alert.created_at || alert.timestamp || ""}</p>
                </div>
                {alert.id && <button onClick={() => removeAlert(alert.id)} disabled={alertsApi.mutating} aria-label="Delete notification" className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>}
              </article>
            ))}
          </div>
        ) : <p className="py-8 text-center text-gray-500">No notifications found.</p>}
      </div>

      {alertsApi.totalPages > 1 && (
        <div className="flex items-center justify-end gap-3">
          <button disabled={alertsApi.currentPage <= 1} onClick={() => alertsApi.handlePageChange(alertsApi.currentPage - 1)} className="rounded border px-3 py-2 disabled:opacity-50">Previous</button>
          <span className="text-sm">Page {alertsApi.currentPage} of {alertsApi.totalPages}</span>
          <button disabled={alertsApi.currentPage >= alertsApi.totalPages} onClick={() => alertsApi.handlePageChange(alertsApi.currentPage + 1)} className="rounded border px-3 py-2 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
};

export default OrganizationAlerts;
