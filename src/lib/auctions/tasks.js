"use server";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createTask = async (newTaskData) => {
  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTaskData),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
};