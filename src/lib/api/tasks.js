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


export const getTaskDetails = async (taskId) => {
  const res = await fetch(`${baseUrl}/api/tasks/${taskId}`);
  return res.json();
};

export const getAllFreelancers = async () => {
  const res = await fetch(`${baseUrl}/api/freelancers`, {
    cache: 'no-store'
  });
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