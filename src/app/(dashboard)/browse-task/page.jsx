import TaskCard from '@/components/mejor/TaskCard';
import Link from 'next/link';
import React from 'react';

const TasksPage = async () => {
    const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
);

const tasks = await res.json();
    return (
        <div className="mt-9 md:mt-0">
            <h2 className="text-2xl font-bold mb-6">Browse All Tasks</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                <Link key={task._id} href={`/browse-task/${task._id}`}>
                    <TaskCard key={task._id} task={task} />
                </Link>
            ))}
            </div>
        </div>
    );
};

export default TasksPage;