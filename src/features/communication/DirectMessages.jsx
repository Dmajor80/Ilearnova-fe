import { useState } from "react";
import { MessageCircle, RefreshCw, Search, Send } from "lucide-react";
import useDirectMessages from "@/hooks/messaging/useDirectMessages";

function contactFromConversation(conversation) {
  return conversation.user ?? conversation.contact ?? conversation.other_user ?? null;
}

function displayName(contact) {
  return contact?.name || contact?.full_name || contact?.username || contact?.email || "School member";
}

function canMessage(contact, restrictRecipients) {
  if (!restrictRecipients) return true;
  const allowedRoles = new Set(["teacher", "admin", "org_admin", "organization_admin", "school_admin"]);
  return Array.isArray(contact?.roles)
    && contact.roles.some((role) =>
      allowedRoles.has(String(role).toLowerCase().replace(/[\s-]/g, "_"))
    );
}

function messageSenderId(message) {
  return message.sender?.id ?? message.sender_id ?? message.sender;
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString();
}

export default function DirectMessages({ restrictRecipients = false }) {
  const messaging = useDirectMessages();
  const [sidebarView, setSidebarView] = useState("conversations");
  const [contactSearch, setContactSearch] = useState("");
  const [draft, setDraft] = useState("");
  const messageableContacts = messaging.contacts.filter((contact) =>
    canMessage(contact, restrictRecipients)
  );
  const messageableContactIds = new Set(messageableContacts.map((contact) => String(contact.id)));

  const chooseContact = async (contact) => {
    setDraft("");
    await messaging.selectContact(contact);
    setSidebarView("conversations");
  };

  const searchContacts = (event) => {
    event.preventDefault();
    messaging.fetchContacts({ search: contactSearch.trim() });
  };

  const send = async (event) => {
    event.preventDefault();
    if (!draft.trim() || messaging.sending) return;
    try {
      await messaging.sendMessage(draft);
      setDraft("");
    } catch {
      // The hook exposes the API error in its notification and error state.
    }
  };

  return (
    <section className="mx-auto max-w-7xl space-y-4">
      <header className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-700" />
            <h2 className="text-xl font-semibold text-gray-900">Direct messages</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Message people listed as contacts for your school.
          </p>
        </div>
        <button
          type="button"
          onClick={messaging.refreshData}
          aria-label="Refresh messages"
          disabled={messaging.contactsLoading || messaging.conversationsLoading}
          className="rounded-lg border p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${messaging.contactsLoading || messaging.conversationsLoading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {messaging.notification.show && (
        <p role="status" className={`rounded-lg p-3 text-sm ${messaging.notification.type === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
          {messaging.notification.message}
        </p>
      )}
      {messaging.error && (
        <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {messaging.error.message}
        </div>
      )}

      <div className="grid min-h-[620px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex min-h-[300px] flex-col border-b lg:border-b-0 lg:border-r">
          <div className="grid grid-cols-2 border-b p-2">
            <button
              type="button"
              onClick={() => setSidebarView("conversations")}
              aria-pressed={sidebarView === "conversations"}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${sidebarView === "conversations" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Conversations
            </button>
            <button
              type="button"
              onClick={() => {
                setSidebarView("contacts");
                messaging.fetchContacts({ search: contactSearch.trim() });
              }}
              aria-pressed={sidebarView === "contacts"}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${sidebarView === "contacts" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}
            >
              New message
            </button>
          </div>

          {sidebarView === "contacts" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <form className="flex gap-2 border-b p-3" onSubmit={searchContacts}>
                <label className="sr-only" htmlFor="message-contact-search">Search school contacts</label>
                <input
                  id="message-contact-search"
                  type="search"
                  value={contactSearch}
                  onChange={(event) => setContactSearch(event.target.value)}
                  placeholder="Search contacts"
                  className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
                />
                <button type="submit" aria-label="Search contacts" className="rounded-lg border px-3 text-gray-600 hover:bg-gray-50">
                  <Search className="h-4 w-4" />
                </button>
              </form>
              <div className="flex-1 overflow-y-auto p-2">
                {messaging.contactsLoading ? (
                  <p role="status" className="p-3 text-sm text-gray-500">Loading school contacts…</p>
                ) : messageableContacts.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500">No messageable contacts found.</p>
                ) : (
                  <ul className="space-y-1">
                    {messageableContacts.map((contact) => (
                      <li key={contact.id}>
                        <button
                          type="button"
                          onClick={() => chooseContact(contact)}
                          className="w-full rounded-lg px-3 py-3 text-left hover:bg-blue-50"
                        >
                          <span className="block font-medium text-gray-900">{displayName(contact)}</span>
                          {contact.roles?.length > 0 && (
                            <span className="mt-1 block text-xs capitalize text-gray-500">{contact.roles.join(", ")}</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-2">
              {messaging.conversationsLoading ? (
                <p role="status" className="p-3 text-sm text-gray-500">Loading conversations…</p>
              ) : messaging.conversations.length === 0 ? (
                <p className="p-3 text-sm text-gray-500">No conversations yet. Choose “New message” to find a school contact.</p>
              ) : (
                <ul className="space-y-1">
                  {messaging.conversations.map((conversation) => {
                    const conversationContact = contactFromConversation(conversation);
                    const allowedContact = messageableContacts.find(
                      (contact) => String(contact.id) === String(conversationContact?.id)
                    );
                    const contact = allowedContact
                      ? { ...conversationContact, ...allowedContact }
                      : conversationContact;
                    if (!contact?.id) return null;
                    if (restrictRecipients && !messageableContactIds.has(String(contact.id))) return null;
                    const lastMessage = conversation.last_message;
                    const active = String(messaging.selectedContact?.id) === String(contact.id);
                    return (
                      <li key={contact.id}>
                        <button
                          type="button"
                          onClick={() => chooseContact(contact)}
                          className={`w-full rounded-lg px-3 py-3 text-left ${active ? "bg-blue-50" : "hover:bg-gray-50"}`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate font-medium text-gray-900">{displayName(contact)}</span>
                            {conversation.unread_count > 0 && (
                              <span className="rounded-full bg-blue-700 px-2 py-0.5 text-xs text-white">
                                {conversation.unread_count}
                              </span>
                            )}
                          </span>
                          <span className="mt-1 block truncate text-xs text-gray-500">
                            {lastMessage?.body || "Open conversation"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </aside>

        <div className="flex min-h-[400px] min-w-0 flex-col">
          {messaging.selectedContact ? (
            <>
              <header className="border-b px-5 py-4">
                <h3 className="font-semibold text-gray-900">{displayName(messaging.selectedContact)}</h3>
                {messaging.selectedContact.roles?.length > 0 && (
                  <p className="mt-1 text-xs capitalize text-gray-500">{messaging.selectedContact.roles.join(", ")}</p>
                )}
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50/70 p-4">
                {messaging.hasOlderMessages && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={messaging.loadOlderMessages}
                      disabled={messaging.olderMessagesLoading}
                      className="text-sm font-medium text-blue-700 hover:underline disabled:opacity-50"
                    >
                      {messaging.olderMessagesLoading ? "Loading…" : "Load older messages"}
                    </button>
                  </div>
                )}
                {messaging.messagesLoading && messaging.messages.length === 0 ? (
                  <p role="status" className="py-8 text-center text-sm text-gray-500">Loading conversation…</p>
                ) : messaging.messages.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">No messages yet. Send the first message.</p>
                ) : (
                  messaging.messages.map((message) => {
                    const incoming = String(messageSenderId(message)) === String(messaging.selectedContact.id);
                    return (
                      <article key={message.id} className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[70%] ${incoming ? "bg-white text-gray-900" : "bg-blue-700 text-white"}`}>
                          <p className="whitespace-pre-wrap break-words text-sm">{message.body}</p>
                          <p className={`mt-2 text-right text-[11px] ${incoming ? "text-gray-400" : "text-blue-100"}`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              <form onSubmit={send} className="border-t bg-white p-4">
                <label className="sr-only" htmlFor="direct-message-draft">Message</label>
                <div className="flex items-end gap-3">
                  <textarea
                    id="direct-message-draft"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={5000}
                    rows={2}
                    placeholder={`Message ${displayName(messaging.selectedContact)}…`}
                    className="min-h-12 flex-1 resize-y rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || messaging.sending}
                    className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {messaging.sending ? "Sending…" : "Send"}
                  </button>
                </div>
                <p className="mt-1 text-right text-xs text-gray-400">{draft.length}/5000</p>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <MessageCircle className="h-10 w-10 text-gray-300" />
              <h3 className="mt-3 font-semibold text-gray-800">Your school messages</h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Select a conversation or start a message with an available school contact.
              </p>
              <button
                type="button"
                onClick={() => setSidebarView("contacts")}
                className="mt-4 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Start a message
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
