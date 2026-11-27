import { useCallback, useEffect, useRef, useState } from "react";
import { http } from "@/api/baseClient";
import { apiErrorDetails } from "@/lib/apiHelpers";

export const MEMBER_KINDS = {
  student: { path: "/api/admin/school/students/", key: "students", noun: "student" },
  teacher: { path: "/api/admin/school/teachers/", key: "teachers", noun: "teacher" },
  parent: { path: "/api/admin/school/parents/", key: "parents", noun: "parent" },
};

export const MEMBER_STATUSES = ["all", "active", "pending", "suspended"];

const PAGE_SIZE = 20;
const EMPTY_COUNTS = { all: 0, active: 0, pending: 0, suspended: 0 };

/**
 * One page of a school's students, teachers or parents for a status pill
 * ("all", "active", "pending", "suspended") and search, plus the count for
 * every pill. Actions reload the page when done.
 *
 * Taking someone out: `suspend` blocks them for now (they stay under
 * Suspended); `remove` ends their place in the school (account and records
 * kept, gone from every list; adding them again brings them back);
 * `deletePermanently` deletes a mistaken account with no records, after
 * `deleteCheck` says whether it may.
 */
export default function useSchoolMembers(kind, { status = "all", search = "", page = 1 } = {}) {
  const { path, key } = MEMBER_KINDS[kind];
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState(EMPTY_COUNTS);
  const [pagination, setPagination] = useState({ page: 1, pages: 0, total: 0, has_next: false, has_prev: false });
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const params = { status, page, page_size: PAGE_SIZE };
      if (search.trim()) params.search = search.trim();
      const payload = await http.get(path, { auth: true, params });
      const data = payload?.data ?? payload;
      if (request !== requestId.current) return;
      setRows(Array.isArray(data?.[key]) ? data[key] : []);
      setCounts({ ...EMPTY_COUNTS, ...(data?.counts || {}) });
      setPagination({ page, pages: 0, total: 0, has_next: false, has_prev: false, ...(data?.pagination || {}) });
    } catch (err) {
      if (request !== requestId.current) return;
      setRows([]);
      setError(apiErrorDetails(err).messages.join(" "));
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [path, key, status, search, page]);

  useEffect(() => {
    // Wait for typing to pause before searching.
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  /**
   * Run a change, then reload. Throws the friendly message on failure, or
   * the API error itself with `raw` (callers that read its status, e.g. 409).
   */
  const run = useCallback(async (request, { raw = false } = {}) => {
    setMutating(true);
    try {
      const result = await request();
      await load();
      return result;
    } catch (err) {
      if (raw) throw err;
      throw new Error(apiErrorDetails(err).messages.join(" "));
    } finally {
      setMutating(false);
    }
  }, [load]);

  const memberPath = (member) => `${path}${member.id}/`;
  const pendingPath = (member) => `/api/admin/school/pending-staff/${member.membership_id}/`;

  return {
    rows,
    counts,
    pagination,
    loading,
    mutating,
    error,
    reload: load,
    create: (data) => run(() => http.post(path, data, { auth: true })),
    update: (member, data) => run(() => http.patch(memberPath(member), data, { auth: true })),
    suspend: (member) => run(() => http.post(`${memberPath(member)}suspend/`, {}, { auth: true })),
    reinstate: (member) => run(() => http.post(`${memberPath(member)}reinstate/`, {}, { auth: true })),
    remove: (member) => run(() => http.del(memberPath(member), { auth: true })),
    deleteCheck: (member) => http.get(`${memberPath(member)}delete-check/`, { auth: true }),
    deletePermanently: (member) =>
      run(() => http.del(memberPath(member), { auth: true, params: { permanent: true } }), { raw: true }),
    verify: (member) => run(() => http.post(`${pendingPath(member)}verify/`, {}, { auth: true })),
    reject: (member) => run(() => http.post(`${pendingPath(member)}reject/`, {}, { auth: true })),
    verifyMany: (members) =>
      run(() =>
        http.post(
          "/api/admin/school/pending-staff/bulk-verify/",
          { ids: members.map((m) => m.membership_id) },
          { auth: true }
        )
      ),
  };
}
