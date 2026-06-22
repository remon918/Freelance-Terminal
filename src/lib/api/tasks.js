const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getAllTasks = async (filters = {}) => {
  const { search = "", category = "", minBudget = "", maxBudget = "", page = 1, limit = 6, status = "open" } = filters;

  // কুয়েরি প্যারামিটার তৈরি
  const queryParams = new URLSearchParams({
    status,
    search,
    category,
    minBudget,
    maxBudget,
    page,
    limit
  }).toString();

  const res = await fetch(`${baseUrl}/api/tasks?${queryParams}`, { cache: 'no-store' });
  return res.json();
};

export const getMyTasks = async (clientId) => {
  const res = await fetch(`${baseUrl}/api/my-tasks?clientId=${clientId}`, { cache: 'no-store' }); // 🔥 নো-স্টোর যোগ হলো
  return res.json();
};


export const getTaskDetails = async (taskId) => {
  const res = await fetch(`${baseUrl}/api/tasks/${taskId}`, { cache: 'no-store' }); // 🔥 নো-স্টোর যোগ হলো
  return res.json();
};
export const getAllFreelancers = async (filters = {}) => {
  const { search = "", minRate = "", maxRate = "", page = 1, limit = 12 } = filters;

  const queryParams = new URLSearchParams({
    search,
    minRate,
    maxRate,
    page,
    limit
  }).toString();

  const res = await fetch(`${baseUrl}/api/freelancers?${queryParams}`, { cache: 'no-store' });
  return res.json();
};

export const getFreelancerDetails = async (id) => {
  const res = await fetch(`${baseUrl}/api/freelancers/${id}`, {
    cache: 'no-store'
  });
  return res.json();
};



export const getMyProfile = async (id) => {
  const res = await fetch(`${baseUrl}/api/freelancers/${id}`, {
    cache: "no-store",
  });

  return res.json();
};

export const updateMyProfile = async (id, data) => {
  const res = await fetch(`${baseUrl}/api/freelancers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};

export const updateProfile = async (id, profileData) => {
  const res = await fetch(`${baseUrl}/api/freelancers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  return res.json();
};