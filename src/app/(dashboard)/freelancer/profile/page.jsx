"use client"
import { authClient } from '@/lib/auth-client';
import React from 'react';

const ProfilePage = () => {
    const {data: session} = authClient.useSession();
    console.log(session);
    return (
        <div>
            Profile
            {session?.length}
        </div>
    );
};

export default ProfilePage;