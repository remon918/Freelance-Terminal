

import { authClient } from "../auth-client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createTask = async (newTaskData) => {
  try {
    // Better Auth থেকে টোকেন নেওয়া হচ্ছে
    const { data: tokenData } = await authClient.token();

    const res = await fetch(`${baseUrl}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization হেডারে Bearer টোকেন পাস করা হলো
        authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify(newTaskData),
    });

    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    return await res.json();
  } catch (error) {
    console.error("Error in createTask API call:", error);
    throw error;
  }
};

export const getProposalDetails = async (proposalId) => {
  const res = await fetch(`${baseUrl}/api/proposals/details/${proposalId}`, { cache: 'no-store' });
  return res.json();
};