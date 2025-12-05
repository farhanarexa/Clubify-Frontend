import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Components/Common/Footer';
import Navbar from '../Components/Common/Navbar';

const Root = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>  
        </div>
    );
};

export default Root;