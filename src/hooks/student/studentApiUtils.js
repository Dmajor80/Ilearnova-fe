export const unwrapStudentResponse = (response) => response?.data ?? response;

export const getStudentList = (response, keys = []) => {
  const data = unwrapStudentResponse(response);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (data && typeof data === "object" && data.id) return [data];

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

export const getStudentListAcrossPages = async (fetchPage, keys = []) => {
  const records = [];
  const requestedPages = new Set();
  let page = 1;

  while (page && !requestedPages.has(page)) {
    requestedPages.add(page);
    const response = await fetchPage(page);
    const data = unwrapStudentResponse(response);
    records.push(...getStudentList(response, keys));

    const next = data && typeof data === "object" ? data.next : null;
    if (!next) return records;

    const nextPageMatch = String(next).match(/[?&]page=(\d+)(?:&|$)/);
    page = nextPageMatch ? Number(nextPageMatch[1]) : page + 1;
  }

  throw new Error("The student API returned a repeated pagination page.");
};

export const getStudentErrorMessage = (error) =>
  error instanceof Error ? error.message : "An unexpected error occurred.";
