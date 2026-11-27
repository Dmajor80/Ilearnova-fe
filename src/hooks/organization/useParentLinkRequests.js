import { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";

const parentLinksPath = "/api/admin/school/parent-links/";

/** Accepts `{ data: { parent_links } }`, `{ parent_links }`, `{ results }` or a plain array. */
export const extractParentLinks = (payload) => {
  const body = payload?.data ?? payload;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.parent_links)) return body.parent_links;
  if (Array.isArray(body?.results)) return body.results;
  if (Array.isArray(payload?.parent_links)) return payload.parent_links;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

/**
 * Parent-to-student link requests waiting for the school admin. Approving one
 * links the parent to the child and verifies the parent's account.
 */
export default function useParentLinkRequests({ status = "pending", enabled = true } = {}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await http.get(parentLinksPath, { auth: true, params: { status } });
      if (mountedRef.current) setRequests(extractParentLinks(payload));
    } catch (requestError) {
      if (mountedRef.current) setError(requestError);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  const act = useCallback(async (id, action) => {
    setBusyId(id);
    try {
      const payload = await http.post(`${parentLinksPath}${id}/${action}/`, {}, { auth: true });
      if (mountedRef.current) {
        setRequests((current) => current.filter((request) => String(request.id) !== String(id)));
      }
      return payload?.data ?? payload;
    } finally {
      if (mountedRef.current) setBusyId(null);
    }
  }, []);

  const approve = useCallback((id) => act(id, "approve"), [act]);
  const reject = useCallback((id) => act(id, "reject"), [act]);

  return { requests, loading, error, busyId, refresh: load, approve, reject };
}
