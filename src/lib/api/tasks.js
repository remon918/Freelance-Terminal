const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAllTasks = async () => {
  const res = await fetch(`${baseUrl}/api/tasks`);

  return res.json();
};

export const getMyTasks = async (clientId) => {
  const res = await fetch(
    `${baseUrl}/api/my-tasks?clientId=${clientId}`
  );

  return res.json();
};