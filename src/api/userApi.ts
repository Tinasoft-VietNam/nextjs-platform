// api/userApi.ts
async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data?.error && typeof data.error === 'string') return data.error;
  } catch {
    // ignore json parse errors
  }

  return response.statusText || 'Request failed';
}

export const fetchUsers = async (queryString: string) => {
  const response = await fetch(`/api/data?${queryString}`);
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  return response.json();
};

export const createUser = async (newUser: any) => {
  const response = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const updateUser = async (user: any) => {
  const response = await fetch('/api/data', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};

export const deleteUser = async (id: string | number) => {
  const response = await fetch(`/api/data?id=${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.json();
};