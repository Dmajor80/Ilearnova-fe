import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { useTeacherAnnouncements } from "@/hooks/teacher";

export default function Messages() {
  const announcementsApi = useTeacherAnnouncements();
  const [form, setForm] = useState({ title: "", message: "" });
  const [publishedAnnouncement, setPublishedAnnouncement] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const publish = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const response = await announcementsApi.publishAnnouncement(form);
      setPublishedAnnouncement(response || form);
      setForm({ title: "", message: "" });
    } catch (error) {
      setErrorMessage(error.message || "Unable to publish announcement.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-3">
          <span className="rounded-lg bg-blue-50 p-2 text-blue-700"><Megaphone size={20} /></span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
            <p className="mt-1 text-sm text-gray-600">Publish an announcement to your school using the teacher announcements API.</p>
          </div>
        </div>
        {(errorMessage || announcementsApi.error) && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage || announcementsApi.error.message}
          </p>
        )}
        <form onSubmit={publish} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
            <input
              required
              maxLength={255}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="mt-1 w-full rounded-lg border p-3"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Message
            <textarea
              required
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              rows={5}
              className="mt-1 w-full rounded-lg border p-3"
            />
          </label>
          <button type="submit" disabled={announcementsApi.mutating} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            <Send size={16} /> {announcementsApi.mutating ? "Publishing..." : "Publish announcement"}
          </button>
        </form>
      </section>

      {publishedAnnouncement && (
        <section role="status" className="rounded-xl border border-green-200 bg-green-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Published</p>
          <h3 className="mt-1 font-semibold text-green-900">{publishedAnnouncement.title || "Announcement"}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-green-800">{publishedAnnouncement.message || "The announcement was published."}</p>
        </section>
      )}
      <p className="text-xs text-gray-500">The API does not provide an announcement history endpoint, so only the most recent announcement is shown here.</p>
    </div>
  );
}
