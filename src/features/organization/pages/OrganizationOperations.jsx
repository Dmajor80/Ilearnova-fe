import { useState } from "react";
import {
  useOrganizationCalendar,
  useOrganizationFoodMenu,
  useOrganizationFoodOrders,
  useOrganizationParents,
  useOrganizationSubjects,
  useOrganizationUnpaidTuition
} from "@/hooks/organization";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SchoolDataTable from "@/components/school-admin/SchoolDataTable";

const TABS = [
  { id: "parents", label: "Parents" },
  { id: "calendar", label: "Calendar" },
  { id: "food", label: "Food service" },
  { id: "finance", label: "Tuition & subjects" }
];

const EVENT_TYPES = [
  "academic", "sports", "cultural", "meeting", "holiday",
  "exam", "parent_meeting", "field_trip", "assembly", "other"
];
const MENU_CATEGORIES = ["breakfast", "lunch", "dinner", "snack", "beverage"];
const MENU_AVAILABILITY = ["daily", "weekdays", "weekends", "special"];

const formatDate = (value) => value ? new Date(value).toLocaleString() : "—";
const getName = (item) =>
  item.full_name ||
  [item.first_name, item.last_name].filter(Boolean).join(" ") ||
  item.name ||
  item.email ||
  "—";

function PageControls({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="min-h-[40px] rounded-lg border px-3 disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {page} of {totalPages}</span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="min-h-[40px] rounded-lg border px-3 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

function Dialog({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <section role="dialog" aria-modal="true" aria-label={title} className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg border px-3 py-2 text-sm">Close</button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ParentsPanel() {
  const parents = useOrganizationParents();
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const startForm = (parent = null) => {
    const [firstName = "", ...lastName] = String(parent?.full_name || "").split(" ");
    setEditingId(parent?.id || null);
    setForm({
      email: parent?.email || "",
      first_name: parent?.first_name || firstName,
      last_name: parent?.last_name || lastName.join(" "),
      phone_number: parent?.phone_number || "",
      date_of_birth: parent?.date_of_birth || "",
      address: parent?.address || ""
    });
  };

  const save = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      phone_number: form.phone_number || null,
      date_of_birth: form.date_of_birth || null,
      address: form.address || null
    };
    try {
      if (editingId) await parents.updateParent(editingId, payload);
      else await parents.createParent(payload);
      setForm(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const remove = async () => {
    try {
      await parents.deleteParent(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const rows = parents.parents.map((parent) => ({
    ...parent,
    displayName: getName(parent),
    created: formatDate(parent.created_at)
  }));

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold">Parent directory</h3>
          <p className="text-sm text-gray-600">{parents.totalParents} parents</p>
        </div>
        <div className="flex gap-2">
          <input
            aria-label="Search parents"
            value={parents.searchQuery}
            onChange={(event) => parents.handleSearch(event.target.value)}
            placeholder="Search parents"
            className="min-h-[42px] rounded-lg border px-3"
          />
          <button type="button" onClick={() => startForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add parent</button>
          <button type="button" onClick={() => parents.refreshData(true)} className="rounded-lg border px-3 py-2">Refresh</button>
        </div>
      </div>
      {parents.notification.show && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm">{parents.notification.message}</p>}
      <SchoolDataTable
        data={rows}
        loading={parents.loading}
        error={parents.error?.message}
        showPagination={false}
        columns={[
          { key: "displayName", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone_number", label: "Phone" },
          { key: "created", label: "Added" },
          {
            key: "id",
            label: "Actions",
            sortable: false,
            render: (_, parent) => (
              <div className="flex gap-3">
                <button type="button" className="text-blue-700 hover:underline" onClick={() => startForm(parent)}>Edit</button>
                <button type="button" className="text-red-700 hover:underline" onClick={() => setDeleteTarget(parent)}>Delete</button>
              </div>
            )
          }
        ]}
      />
      <PageControls page={parents.currentPage} totalPages={parents.totalPages} onChange={parents.handlePageChange} />
      {form && (
        <Dialog title={editingId ? "Edit parent" : "Add parent"} onClose={() => setForm(null)}>
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">First name<input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Last name<input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Phone<input value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Date of birth<input type="date" value={form.date_of_birth} onChange={(event) => setForm({ ...form, date_of_birth: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm sm:col-span-2">Address<textarea value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} rows={2} className="mt-1 w-full rounded-lg border p-3" /></label>
            <button type="submit" disabled={parents.mutating} className="rounded-lg bg-blue-600 px-4 py-3 text-white disabled:opacity-50 sm:col-span-2">
              {parents.mutating ? "Saving…" : "Save parent"}
            </button>
          </form>
        </Dialog>
      )}
      {deleteTarget && <DeleteConfirmModal item={deleteTarget} type="parent" onConfirm={remove} onCancel={() => setDeleteTarget(null)} />}
    </section>
  );
}

const toLocalDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function CalendarPanel() {
  const calendar = useOrganizationCalendar();
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const startForm = (event = null) => {
    setEditingId(event?.id || null);
    setForm({
      title: event?.title || "",
      description: event?.description || "",
      event_type: event?.event_type || "academic",
      start_datetime: toLocalDateTime(event?.start_datetime),
      end_datetime: toLocalDateTime(event?.end_datetime),
      location: event?.location || "",
      is_all_day: Boolean(event?.is_all_day),
      is_public: Boolean(event?.is_public),
      requires_approval: Boolean(event?.requires_approval)
    });
  };

  const save = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      start_datetime: new Date(form.start_datetime).toISOString(),
      end_datetime: new Date(form.end_datetime).toISOString(),
      description: form.description || null,
      location: form.location || null
    };
    try {
      if (editingId) await calendar.updateEvent(editingId, payload);
      else await calendar.createEvent(payload);
      setForm(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const remove = async () => {
    try {
      await calendar.deleteEvent(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold">Calendar events</h3>
          <p className="text-sm text-gray-600">{calendar.totalEvents} events</p>
        </div>
        <div className="flex gap-2">
          <input aria-label="Search events" value={calendar.searchQuery} onChange={(event) => calendar.handleSearch(event.target.value)} placeholder="Search events" className="min-h-[42px] rounded-lg border px-3" />
          <button type="button" onClick={() => startForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add event</button>
          <button type="button" onClick={() => calendar.refreshData(true)} className="rounded-lg border px-3 py-2">Refresh</button>
        </div>
      </div>
      {calendar.notification.show && <p role="status" className="rounded-lg bg-blue-50 p-3 text-sm">{calendar.notification.message}</p>}
      <SchoolDataTable
        data={calendar.events}
        loading={calendar.loading}
        error={calendar.error?.message}
        showPagination={false}
        columns={[
          { key: "title", label: "Event" },
          { key: "event_type", label: "Type" },
          { key: "start_datetime", label: "Starts", render: (value) => formatDate(value) },
          { key: "location", label: "Location" },
          {
            key: "id",
            label: "Actions",
            sortable: false,
            render: (_, item) => (
              <div className="flex gap-3">
                <button type="button" className="text-blue-700 hover:underline" onClick={() => startForm(item)}>Edit</button>
                <button type="button" className="text-red-700 hover:underline" onClick={() => setDeleteTarget(item)}>Delete</button>
              </div>
            )
          }
        ]}
      />
      <PageControls page={calendar.currentPage} totalPages={calendar.totalPages} onChange={calendar.handlePageChange} />
      {form && (
        <Dialog title={editingId ? "Edit event" : "Add event"} onClose={() => setForm(null)}>
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">Title<input required maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Type<select value={form.event_type} onChange={(event) => setForm({ ...form, event_type: event.target.value })} className="mt-1 w-full rounded-lg border p-3">{EVENT_TYPES.map((type) => <option key={type} value={type}>{type.replace(/_/g, " ")}</option>)}</select></label>
            <label className="text-sm">Location<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Start<input required type="datetime-local" value={form.start_datetime} onChange={(event) => setForm({ ...form, start_datetime: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">End<input required type="datetime-local" value={form.end_datetime} onChange={(event) => setForm({ ...form, end_datetime: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm sm:col-span-2">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} className="mt-1 w-full rounded-lg border p-3" /></label>
            {[
              ["is_all_day", "All day"],
              ["is_public", "Public event"],
              ["requires_approval", "Requires approval"]
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.checked })} />
                {label}
              </label>
            ))}
            <button type="submit" disabled={calendar.mutating} className="rounded-lg bg-blue-600 px-4 py-3 text-white disabled:opacity-50 sm:col-span-2">
              {calendar.mutating ? "Saving…" : "Save event"}
            </button>
          </form>
        </Dialog>
      )}
      {deleteTarget && <DeleteConfirmModal item={deleteTarget} type="event" onConfirm={remove} onCancel={() => setDeleteTarget(null)} />}
    </section>
  );
}

function MenuPanel({ menu, orders }) {
  const [activeTab, setActiveTab] = useState("menu");
  const [menuForm, setMenuForm] = useState(null);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [orderForm, setOrderForm] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderDeleteTarget, setOrderDeleteTarget] = useState(null);

  const startMenuForm = (item = null) => {
    setEditingMenuId(item?.id || null);
    setMenuForm({
      name: item?.name || "",
      description: item?.description || "",
      category: item?.category || "lunch",
      price: item?.price || "",
      availability: item?.availability || "daily",
      is_available: item?.is_available ?? true,
      ingredients: item?.ingredients || "",
      allergens: item?.allergens || ""
    });
  };

  const saveMenuItem = async (event) => {
    event.preventDefault();
    try {
      if (editingMenuId) await menu.updateMenuItem(editingMenuId, menuForm);
      else await menu.createMenuItem(menuForm);
      setMenuForm(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const removeMenuItem = async () => {
    try {
      await menu.deleteMenuItem(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const startOrderForm = (order = null) => {
    setEditingOrderId(order?.id || null);
    setOrderForm({
      menu_item_id: "",
      quantity: 1,
      special_instructions: order?.special_instructions || "",
      payment_method: order?.payment_method || ""
    });
  };

  const saveOrder = async (event) => {
    event.preventDefault();
    try {
      if (editingOrderId) {
        await orders.updateOrder(editingOrderId, {
          special_instructions: orderForm.special_instructions || null,
          payment_method: orderForm.payment_method || null
        });
      } else {
        await orders.createOrder({
          items: [{
            menu_item_id: orderForm.menu_item_id,
            quantity: Number(orderForm.quantity)
          }],
          special_instructions: orderForm.special_instructions || null,
          payment_method: orderForm.payment_method || null
        });
      }
      setOrderForm(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const removeOrder = async () => {
    try {
      await orders.deleteOrder(orderDeleteTarget.id);
      setOrderDeleteTarget(null);
    } catch {
      // The hook displays the API error notification.
    }
  };

  const menuRows = menu.menuItems.map((item) => ({
    ...item,
    displayPrice: item.price == null ? "—" : `$${item.price}`,
    displayAvailability: item.is_available === false ? "Unavailable" : "Available"
  }));

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold">Food service</h3>
          <p className="text-sm text-gray-600">Manage menu items and view school orders.</p>
        </div>
        <div className="flex rounded-lg border p-1">
          <button type="button" onClick={() => setActiveTab("menu")} className={`rounded-md px-3 py-2 text-sm ${activeTab === "menu" ? "bg-blue-600 text-white" : ""}`}>Menu</button>
          <button type="button" onClick={() => setActiveTab("orders")} className={`rounded-md px-3 py-2 text-sm ${activeTab === "orders" ? "bg-blue-600 text-white" : ""}`}>Orders ({orders.totalOrders})</button>
        </div>
      </div>
      {activeTab === "menu" ? (
        <>
          <div className="flex flex-wrap justify-between gap-3">
            <input aria-label="Search menu" value={menu.searchQuery} onChange={(event) => menu.handleSearch(event.target.value)} placeholder="Search menu" className="min-h-[42px] rounded-lg border px-3" />
            <div className="flex gap-2">
              <button type="button" onClick={() => startMenuForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Add menu item</button>
              <button type="button" onClick={() => menu.refreshData(true)} className="rounded-lg border px-3 py-2">Refresh</button>
            </div>
          </div>
          <SchoolDataTable
            data={menuRows}
            loading={menu.loading}
            error={menu.error?.message}
            showPagination={false}
            columns={[
              { key: "name", label: "Item" },
              { key: "category", label: "Category" },
              { key: "displayPrice", label: "Price" },
              { key: "availability", label: "Schedule" },
              { key: "displayAvailability", label: "Status" },
              {
                key: "id",
                label: "Actions",
                sortable: false,
                render: (_, item) => (
                  <div className="flex gap-3">
                    <button type="button" className="text-blue-700 hover:underline" onClick={() => startMenuForm(item)}>Edit</button>
                    <button type="button" className="text-red-700 hover:underline" onClick={() => setDeleteTarget(item)}>Delete</button>
                  </div>
                )
              }
            ]}
          />
          <PageControls page={menu.currentPage} totalPages={menu.totalPages} onChange={menu.handlePageChange} />
        </>
      ) : (
        <>
          <div className="flex flex-wrap justify-between gap-3">
            <input aria-label="Search food orders" value={orders.searchQuery} onChange={(event) => orders.handleSearch(event.target.value)} placeholder="Search orders" className="min-h-[42px] rounded-lg border px-3" />
            <div className="flex gap-2">
              <button type="button" onClick={() => startOrderForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Create order</button>
              <button type="button" onClick={() => orders.refreshData(true)} className="rounded-lg border px-3 py-2">Refresh</button>
            </div>
          </div>
          <SchoolDataTable
            data={orders.orders}
            loading={orders.loading}
            error={orders.error?.message}
            showPagination={false}
            columns={[
              { key: "ordered_by_name", label: "Ordered by" },
              { key: "items_count", label: "Items" },
              { key: "total_amount", label: "Total" },
              { key: "status", label: "Status" },
              { key: "payment_status", label: "Payment" },
              { key: "order_date", label: "Date", render: (value) => formatDate(value) },
              {
                key: "id",
                label: "Actions",
                sortable: false,
                render: (_, order) => (
                  <div className="flex gap-3">
                    <button type="button" className="text-blue-700 hover:underline" onClick={() => startOrderForm(order)}>Edit details</button>
                    <button type="button" className="text-red-700 hover:underline" onClick={() => setOrderDeleteTarget(order)}>Delete</button>
                  </div>
                )
              }
            ]}
          />
          <PageControls page={orders.currentPage} totalPages={orders.totalPages} onChange={orders.handlePageChange} />
        </>
      )}
      {menuForm && (
        <Dialog title={editingMenuId ? "Edit menu item" : "Add menu item"} onClose={() => setMenuForm(null)}>
          <form onSubmit={saveMenuItem} className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">Name<input required maxLength={200} value={menuForm.name} onChange={(event) => setMenuForm({ ...menuForm, name: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Category<select required value={menuForm.category} onChange={(event) => setMenuForm({ ...menuForm, category: event.target.value })} className="mt-1 w-full rounded-lg border p-3">{MENU_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="text-sm">Price<input required type="number" min="0" step="0.01" value={menuForm.price} onChange={(event) => setMenuForm({ ...menuForm, price: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Availability<select value={menuForm.availability} onChange={(event) => setMenuForm({ ...menuForm, availability: event.target.value })} className="mt-1 w-full rounded-lg border p-3">{MENU_AVAILABILITY.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={menuForm.is_available} onChange={(event) => setMenuForm({ ...menuForm, is_available: event.target.checked })} />Available for order</label>
            <label className="text-sm sm:col-span-2">Description<textarea value={menuForm.description} onChange={(event) => setMenuForm({ ...menuForm, description: event.target.value })} rows={2} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Ingredients<input value={menuForm.ingredients} onChange={(event) => setMenuForm({ ...menuForm, ingredients: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="text-sm">Allergens<input value={menuForm.allergens} onChange={(event) => setMenuForm({ ...menuForm, allergens: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <button type="submit" disabled={menu.mutating} className="rounded-lg bg-blue-600 px-4 py-3 text-white disabled:opacity-50 sm:col-span-2">{menu.mutating ? "Saving…" : "Save menu item"}</button>
          </form>
        </Dialog>
      )}
      {orderForm && (
        <Dialog title={editingOrderId ? "Edit order details" : "Create order"} onClose={() => setOrderForm(null)}>
          <form onSubmit={saveOrder} className="space-y-3">
            {!editingOrderId && (
              <>
                <label className="block text-sm">Menu item<select required value={orderForm.menu_item_id} onChange={(event) => setOrderForm({ ...orderForm, menu_item_id: event.target.value })} className="mt-1 w-full rounded-lg border p-3">
                  <option value="">Choose an available menu item</option>
                  {menu.menuItems.filter((item) => item.is_available !== false).map((item) => <option key={item.id} value={item.id}>{item.name} — {item.price}</option>)}
                </select></label>
                <label className="block text-sm">Quantity<input required type="number" min="1" step="1" value={orderForm.quantity} onChange={(event) => setOrderForm({ ...orderForm, quantity: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
              </>
            )}
            <label className="block text-sm">Special instructions<textarea value={orderForm.special_instructions} onChange={(event) => setOrderForm({ ...orderForm, special_instructions: event.target.value })} rows={2} className="mt-1 w-full rounded-lg border p-3" /></label>
            <label className="block text-sm">Payment method<input maxLength={50} value={orderForm.payment_method} onChange={(event) => setOrderForm({ ...orderForm, payment_method: event.target.value })} className="mt-1 w-full rounded-lg border p-3" /></label>
            <button type="submit" disabled={orders.mutating} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white disabled:opacity-50">{orders.mutating ? "Saving…" : editingOrderId ? "Save order details" : "Create order"}</button>
          </form>
        </Dialog>
      )}
      {deleteTarget && <DeleteConfirmModal item={deleteTarget} type="menu item" onConfirm={removeMenuItem} onCancel={() => setDeleteTarget(null)} />}
      {orderDeleteTarget && <DeleteConfirmModal item={orderDeleteTarget} type="food order" onConfirm={removeOrder} onCancel={() => setOrderDeleteTarget(null)} />}
    </section>
  );
}

function FinancePanel() {
  const tuition = useOrganizationUnpaidTuition();
  const subjects = useOrganizationSubjects();
  const feeSummary = (fees) => {
    if (!fees || typeof fees !== "object") return "—";
    return Object.entries(fees).map(([key, value]) => `${key.replace(/_/g, " ")}: ${String(value)}`).join(" · ") || "—";
  };

  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">Unpaid tuition</h3>
            <p className="text-sm text-gray-600">{tuition.totalStudents} students returned by the tuition endpoint</p>
          </div>
          <button type="button" onClick={() => tuition.refreshData(true)} className="rounded-lg border px-3 py-2">Refresh</button>
        </div>
        <SchoolDataTable
          data={tuition.students.map((student) => ({ ...student, displayName: getName(student), feeSummary: feeSummary(student.fees) }))}
          loading={tuition.loading}
          error={tuition.error?.message}
          showPagination={false}
          columns={[
            { key: "displayName", label: "Student" },
            { key: "student_id", label: "Student ID" },
            { key: "class_name", label: "Class" },
            { key: "feeSummary", label: "Fee details" }
          ]}
        />
      </div>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-semibold">Subjects</h3>
            <p className="text-sm text-gray-600">{subjects.totalSubjects} subjects available for classes and exams.</p>
          </div>
          <div className="flex gap-2">
            <input aria-label="Search subjects" value={subjects.searchQuery} onChange={(event) => subjects.handleSearch(event.target.value)} placeholder="Search subjects" className="min-h-[42px] rounded-lg border px-3" />
            <button type="button" onClick={() => subjects.refreshData(true)} className="rounded-lg border px-3 py-2">Refresh</button>
          </div>
        </div>
        <SchoolDataTable
          data={subjects.subjects}
          loading={subjects.loading}
          error={subjects.error?.message}
          showPagination={false}
          columns={[
            { key: "name", label: "Subject" },
            { key: "class_name", label: "Class" },
            { key: "teacher_name", label: "Teacher" },
            { key: "description", label: "Description" },
            { key: "is_active", label: "Status", render: (value) => value === false ? "Inactive" : value === true ? "Active" : "—" }
          ]}
        />
        <PageControls page={subjects.currentPage} totalPages={subjects.totalPages} onChange={subjects.handlePageChange} />
      </div>
    </section>
  );
}

function FoodPanel() {
  const menu = useOrganizationFoodMenu();
  const orders = useOrganizationFoodOrders();
  return <MenuPanel menu={menu} orders={orders} />;
}

export default function OrganizationOperations() {
  const [activeTab, setActiveTab] = useState("parents");
  const panels = {
    parents: ParentsPanel,
    calendar: CalendarPanel,
    food: FoodPanel,
    finance: FinancePanel
  };
  const ActivePanel = panels[activeTab];

  return (
    <div className="space-y-5 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Organization operations</h2>
        <p className="mt-1 text-sm text-gray-600">Manage parents, events, food service, tuition, and subjects.</p>
      </div>
      <div className="flex flex-wrap gap-2 border-b pb-3" role="tablist" aria-label="Organization operations">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm ${activeTab === tab.id ? "bg-blue-600 text-white" : "border text-gray-700 hover:bg-gray-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActivePanel />
    </div>
  );
}
