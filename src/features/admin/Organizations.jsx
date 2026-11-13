import { useState } from "react";
import { Building2, Pencil, Plus, RefreshCw, Search, X } from "lucide-react";
import { useSuperAdminOrganizations } from "@/hooks/superadmin";

const emptyOrganization = {
  name: "",
  code: "",
  organization_type: "private",
  email: "",
  phone_number: "",
  address: "",
  description: "",
  website: "",
  established_date: "",
  is_active: true
};

const optionalFields = [
  "email",
  "phone_number",
  "address",
  "description",
  "website",
  "established_date"
];

function organizationFormData(form) {
  const data = { ...form, name: form.name.trim(), code: form.code.trim() };
  optionalFields.forEach((field) => {
    data[field] = String(data[field] ?? "").trim() || null;
  });
  return data;
}

function toDate(value) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

export default function Organizations() {
  const {
    loading,
    error,
    organizations,
    totalOrganizations,
    mutating,
    fetchOrganizations,
    fetchOrganizationDetails,
    createOrganization,
    updateOrganization,
    deactivateOrganization,
    notification
  } = useSuperAdminOrganizations();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(emptyOrganization);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const pageSize = 10;
  const totalPages = Math.ceil(totalOrganizations / pageSize);

  const loadPage = (nextPage, nextSearch = search) => {
    setPage(nextPage);
    fetchOrganizations({ search: nextSearch.trim(), page: nextPage });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyOrganization);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = async (organization) => {
    setFormLoading(true);
    setFormError("");
    try {
      const details = await fetchOrganizationDetails(organization.id);
      setEditingId(organization.id);
      setForm({
        ...emptyOrganization,
        ...details,
        established_date: details.established_date ?? "",
        is_active: details.is_active ?? true
      });
      setFormOpen(true);
    } catch (requestError) {
      setFormError(requestError.message);
    } finally {
      setFormLoading(false);
    }
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setFormError("");
    try {
      const data = organizationFormData(form);
      if (editingId) {
        await updateOrganization(editingId, data);
      } else {
        await createOrganization(data);
      }
      setFormOpen(false);
    } catch (requestError) {
      setFormError(requestError.message);
    }
  };

  const handleDeactivate = async (organization) => {
    if (!window.confirm(`Deactivate ${organization.name}?`)) return;
    try {
      await deactivateOrganization(organization.id);
    } catch {
      // The hook reports the API error through its notification.
    }
  };

  return (
    <div className="space-y-5">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-semibold text-gray-900">Organizations</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">Manage organizations across the platform.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              loadPage(1);
            }}
          >
            <label className="sr-only" htmlFor="organization-search">Search organizations</label>
            <input
              id="organization-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search organizations"
              className="min-h-10 rounded-lg border px-3 text-sm"
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg border px-3 text-sm hover:bg-gray-50">
              <Search className="h-4 w-4" /> Search
            </button>
          </form>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800"
          >
            <Plus className="h-4 w-4" /> Add organization
          </button>
        </div>
      </section>

      {notification.show && (
        <p role="status" className={`rounded-lg p-3 text-sm ${notification.type === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
          {notification.message}
        </p>
      )}

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <span>{error.message}</span>
          <button type="button" onClick={() => fetchOrganizations({ search: search.trim(), page })} className="font-medium underline">
            Retry
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="font-semibold text-gray-900">{totalOrganizations} organization{totalOrganizations === 1 ? "" : "s"}</h3>
          <button
            type="button"
            onClick={() => fetchOrganizations({ search: search.trim(), page })}
            disabled={loading}
            aria-label="Refresh organizations"
            className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        {loading && organizations.length === 0 ? (
          <p role="status" className="p-6 text-sm text-gray-600">Loading organizations…</p>
        ) : organizations.length === 0 ? (
          <p className="p-6 text-sm text-gray-600">No organizations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Organization</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Students</th>
                  <th className="px-5 py-3">Teachers</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {organizations.map((organization) => (
                  <tr key={organization.id}>
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{organization.name}</p>
                      <p className="text-xs text-gray-500">{organization.code}</p>
                    </td>
                    <td className="px-5 py-4 capitalize">{organization.organization_type || "—"}</td>
                    <td className="px-5 py-4">{organization.student_count ?? "—"}</td>
                    <td className="px-5 py-4">{organization.teacher_count ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${organization.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {organization.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">{toDate(organization.created_at)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(organization)}
                          disabled={formLoading || mutating}
                          className="inline-flex items-center gap-1 rounded border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        {organization.is_active && (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(organization)}
                            disabled={mutating}
                            className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-5 py-3 text-sm">
            <span className="text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1 || loading} onClick={() => loadPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Previous</button>
              <button type="button" disabled={page >= totalPages || loading} onClick={() => loadPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
          <form
            onSubmit={submitForm}
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            aria-labelledby="organization-form-title"
          >
            <div className="flex items-center justify-between">
              <h3 id="organization-form-title" className="text-lg font-semibold">
                {editingId ? "Edit organization" : "Create organization"}
              </h3>
              <button type="button" onClick={() => setFormOpen(false)} aria-label="Close form" className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">Name *
                <input required maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm">Code *
                <input required maxLength={20} value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm">Organization type
                <select value={form.organization_type} onChange={(event) => setForm({ ...form, organization_type: event.target.value })} className="w-full rounded-lg border px-3 py-2">
                  {["public", "private", "charter", "university", "college", "institute"].map((type) => (
                    <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1 text-sm">Email
                <input type="email" value={form.email ?? ""} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm">Phone
                <input value={form.phone_number ?? ""} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm">Website
                <input type="url" value={form.website ?? ""} onChange={(event) => setForm({ ...form, website: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm">Established date
                <input type="date" value={form.established_date ?? ""} onChange={(event) => setForm({ ...form, established_date: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm">
                <input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
                Active
              </label>
              <label className="space-y-1 text-sm sm:col-span-2">Address
                <input value={form.address ?? ""} onChange={(event) => setForm({ ...form, address: event.target.value })} className="w-full rounded-lg border px-3 py-2" />
              </label>
              <label className="space-y-1 text-sm sm:col-span-2">Description
                <textarea value={form.description ?? ""} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-lg border px-3 py-2" rows={3} />
              </label>
            </div>
            {formError && <p role="alert" className="text-sm text-red-700">{formError}</p>}
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
              <button type="submit" disabled={mutating} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50">
                {mutating ? "Saving…" : editingId ? "Save changes" : "Create organization"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
