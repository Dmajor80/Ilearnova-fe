import { useCallback, useEffect, useRef, useState } from "react";
import {
  getConversations as getDirectConversations,
  getMessages as getDirectMessages,
  getMessageContacts,
  sendMessage as sendDirectMessage
} from "@/api/communicationApi";
import useNotification from "@/hooks/useNotification";
import {
  getNotificationType,
  getUserFriendlyMessage,
  parseError
} from "@/lib/errorHandler";

function unwrapResponse(payload) {
  return payload?.data ?? payload;
}

function readList(payload, key) {
  const data = unwrapResponse(payload);
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.[key])
      ? data[key]
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.data)
          ? data.data
          : null;

  if (!list) {
    throw new Error(`The messaging ${key} endpoint returned an unexpected response.`);
  }
  return list;
}

function readMessages(payload) {
  const data = unwrapResponse(payload);
  const messages = Array.isArray(data)
    ? data
    : Array.isArray(data?.messages)
      ? data.messages
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.data)
          ? data.data
          : null;
  if (!messages) {
    throw new Error("The conversation endpoint returned an unexpected response.");
  }
  return messages.sort((left, right) => (
    new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
  ));
}

export default function useDirectMessages() {
  const { notify, ...notification } = useNotification("info", 5000);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [olderMessagesLoading, setOlderMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const contactsParams = useRef({});
  const selectedContactId = useRef(null);
  const messageRequestId = useRef(0);

  const reportError = useCallback((err, action, label) => {
    const appError = parseError(err, { action });
    setError(appError);
    notify(`${label}: ${getUserFriendlyMessage(appError)}`, getNotificationType(appError));
    console.warn(`Failed to ${action}:`, err);
    return appError;
  }, [notify]);

  const fetchContacts = useCallback(async (params) => {
    const requestParams = params ?? contactsParams.current;
    contactsParams.current = requestParams;
    setContactsLoading(true);
    try {
      const payload = await getMessageContacts(requestParams);
      const items = readList(payload, "contacts");
      setContacts(items);
      setError(null);
      return items;
    } catch (err) {
      reportError(err, "fetch_message_contacts", "Contacts unavailable");
      setContacts([]);
      return [];
    } finally {
      setContactsLoading(false);
    }
  }, [reportError]);

  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    try {
      const payload = await getDirectConversations();
      const items = readList(payload, "conversations");
      setConversations(items);
      setError(null);
      return items;
    } catch (err) {
      reportError(err, "fetch_direct_conversations", "Conversations unavailable");
      setConversations([]);
      return [];
    } finally {
      setConversationsLoading(false);
    }
  }, [reportError]);

  const fetchConversation = useCallback(async (userId, params = {}) => {
    const requestId = ++messageRequestId.current;
    setMessagesLoading(true);
    setError(null);
    try {
      const payload = await getDirectMessages(userId, { limit: 50, ...params });
      const items = readMessages(payload);
      if (requestId === messageRequestId.current && selectedContactId.current === userId) {
        setMessages(items);
        setHasOlderMessages(items.length >= 50);
      }
      return items;
    } catch (err) {
      if (requestId === messageRequestId.current) {
        reportError(err, "fetch_direct_conversation", "Messages unavailable");
        setMessages([]);
      }
      throw parseError(err, { action: "fetch_direct_conversation" });
    } finally {
      if (requestId === messageRequestId.current) setMessagesLoading(false);
    }
  }, [reportError]);

  const selectContact = useCallback(async (contact) => {
    selectedContactId.current = contact.id;
    setSelectedContact(contact);
    setMessages([]);
    setHasOlderMessages(false);
    try {
      await fetchConversation(contact.id);
      await fetchConversations();
    } catch {
      // The hook has already reported the conversation load error.
    }
  }, [fetchConversation, fetchConversations]);

  const sendMessage = useCallback(async (body) => {
    const recipientId = selectedContactId.current;
    const messageBody = body.trim();
    if (!recipientId) throw new Error("Select an approved school contact first.");
    if (!messageBody) throw new Error("Enter a message before sending.");

    setSending(true);
    setError(null);
    try {
      const payload = await sendDirectMessage(recipientId, messageBody);
      const data = unwrapResponse(payload);
      await Promise.allSettled([
        fetchConversation(recipientId),
        fetchConversations()
      ]);
      return data;
    } catch (err) {
      const appError = reportError(err, "send_direct_message", "Message could not be sent");
      throw appError;
    } finally {
      setSending(false);
    }
  }, [fetchConversation, fetchConversations, reportError]);

  const loadOlderMessages = useCallback(async () => {
    const recipientId = selectedContactId.current;
    const oldestMessage = messages[0];
    if (!recipientId || !oldestMessage?.created_at || messagesLoading || olderMessagesLoading) return;

    const requestId = messageRequestId.current;
    setOlderMessagesLoading(true);
    try {
      const payload = await getDirectMessages(recipientId, {
        limit: 50,
        before: oldestMessage.created_at
      });
      const older = readMessages(payload);
      if (requestId === messageRequestId.current && selectedContactId.current === recipientId) {
        setMessages((current) => {
          const knownIds = new Set(current.map((message) => message.id));
          return [...older.filter((message) => !knownIds.has(message.id)), ...current];
        });
        setHasOlderMessages(older.length >= 50);
      }
    } catch (err) {
      reportError(err, "load_older_messages", "Older messages unavailable");
    } finally {
      setOlderMessagesLoading(false);
    }
  }, [messages, messagesLoading, olderMessagesLoading, reportError]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchContacts(), fetchConversations()]);
    if (selectedContactId.current) {
      try {
        await fetchConversation(selectedContactId.current);
      } catch {
        // The hook has already reported the conversation load error.
      }
    }
  }, [fetchContacts, fetchConversations, fetchConversation]);

  useEffect(() => {
    fetchContacts();
    fetchConversations();
  }, [fetchContacts, fetchConversations]);

  return {
    contacts,
    conversations,
    messages,
    hasOlderMessages,
    selectedContact,
    contactsLoading,
    conversationsLoading,
    messagesLoading,
    olderMessagesLoading,
    sending,
    error,
    notification: { ...notification, notify },
    fetchContacts,
    fetchConversations,
    fetchConversation,
    selectContact,
    sendMessage,
    loadOlderMessages,
    refreshData
  };
}
