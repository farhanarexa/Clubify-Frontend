// Navbar.jsx
import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AuthContext } from '../../Contexts/AuthContext';

const Navbar = () => {
    const { user, signOutUser, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOutUser();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const links = [
        <li key="home" className="mx-2">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive
                        ? "text-white font-semibold border-b-2 border-white pb-1"
                        : "text-white hover:text-gray-200 font-medium"
                }
            >
                Home
            </NavLink>
        </li>,
        <li key="about" className="mx-2">
            <NavLink
                to="/about"
                className={({ isActive }) =>
                    isActive
                        ? "text-white font-semibold border-b-2 border-white pb-1"
                        : "text-white hover:text-gray-200 font-medium"
                }
            >
                About
            </NavLink>
        </li>,
        <li key="contact" className="mx-2">
            <NavLink
                to="/contact"
                className={({ isActive }) =>
                    isActive
                        ? "text-white font-semibold border-b-2 border-white pb-1"
                        : "text-white hover:text-gray-200 font-medium"
                }
            >
                Contact
            </NavLink>
        </li>,
        <li key="clubs" className="mx-2">
            <NavLink
                to="/availableclubs"
                className={({ isActive }) =>
                    isActive
                        ? "text-white font-semibold border-b-2 border-white pb-1"
                        : "text-white hover:text-gray-200 font-medium"
                }
            >
                Clubs
            </NavLink>
        </li>,
        <li key="events" className="mx-2">
            <NavLink
                to="/events"
                className={({ isActive }) =>
                    isActive
                        ? "text-white font-semibold border-b-2 border-white pb-1"
                        : "text-white hover:text-gray-200 font-medium"
                }
            >
                Events
            </NavLink>
        </li>
    ];

    return (
        <div>
            <div className="navbar bg-linear-to-r from-[#A45CFF] to-[#7ED8FF] text-white shadow-lg px-20">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-white rounded-box z-1 mt-3 w-52 p-2 shadow-lg text-base font-semibold text-gray-800 lg:hidden block"
                        >
                            {links}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-3xl font-bold text-white">
                        Clubify
                    </a>
                </div>

                <div className="navbar-center hidden lg:flex text-base font-semibold">
                    <ul className="menu menu-horizontal px-1">
                        {links}
                    </ul>
                </div>


                <div className="navbar-end flex gap-3">
                    {loading ? (
                        <span className="loading loading-spinner loading-sm text-white"></span>
                    ) : user ? (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring-2 ring-white">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-white rounded-lg z-100 mt-3 w-56 p-2 shadow-lg text-gray-800">
                                <li>
                                    <Link to="/profile" className="justify-between rounded-lg hover:bg-gray-100 text-gray-800 py-2 px-4 block">
                                        Profile
                                    </Link>
                                </li>
                                {(user.role === 'admin' || user.role === 'clubManager') && (
                                    <li>
                                        <Link to="/addclubs" className="justify-between rounded-lg hover:bg-gray-100 text-gray-800 py-2 px-4 block">
                                            Add Club
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link to={`/dashboard/${user.role === 'admin' ? 'admin' : user.role === 'clubManager' ? 'clubManager' : 'member'}`} className="justify-between rounded-lg hover:bg-gray-100 text-gray-800 py-2 px-4 block">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" onClick={handleLogout} className="justify-between rounded-lg hover:bg-red-50 text-red-600 py-2 px-4 block">
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="btn bg-white text-[#6A0DAD] border-2 border-white hover:text-white hover:bg-[#6A0DAD] px-6 transition-all font-medium"
                            >
                                Login
                            </Link>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;