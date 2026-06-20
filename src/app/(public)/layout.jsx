import Footer from '@/components/mejor/Footer';
import Navbar from '@/components/mejor/Navbar';
import React from 'react';

const PublicRouteLayout = ({children}) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default PublicRouteLayout;