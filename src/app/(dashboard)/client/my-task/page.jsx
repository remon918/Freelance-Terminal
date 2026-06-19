"use client";

import { getMyTasks } from "@/lib/api/tasks";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

const MyTaskPage = () => {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      if (!session?.user?.id) return;

      const data = await getMyTasks(session.user.id);
      setTasks(data);
    };

    loadTasks();
  }, [session]);

  return (
    <div>
      <h1>My Tasks</h1>

      {tasks.map((task) => (
        <div key={task._id}>
          {task.title}
        </div>
      ))}
    </div>
  );
};

export default MyTaskPage;