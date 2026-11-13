export function unwrapSuperAdminResponse(payload) {
  return payload?.data ?? payload;
}

export function getSuperAdminCollection(data, key) {
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data?.[key])
        ? data[key]
        : null;

  if (!items) {
    throw new Error(`The super-admin ${key} endpoint returned an unexpected response.`);
  }

  return {
    items,
    total: data?.count ?? data?.pagination?.total ?? items.length
  };
}
