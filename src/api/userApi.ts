// api/userApi.ts
export const fetchUsers = async (queryString: string) => {
  const response = await fetch(`/api/data?${queryString}`);
  return response.json();
};

export const createUser = async (newUser: any) => {
  const response = await fetch('/api/data', {
    method: 'POST',
    body: JSON.stringify(newUser),
  });
  return response.json();
};

export const updateUser = async (user: any) => {
  const response = await fetch(`/api/data/${user._id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
  return response.json();
};

export const deleteUser = async (id: string) => {
  await fetch(`/api/data/${id}`, { method: 'DELETE' });
};