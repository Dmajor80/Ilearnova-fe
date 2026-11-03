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

export const getStudentErrorMessage = (error) =>
  error instanceof Error ? error.message : "An unexpected error occurred.";
