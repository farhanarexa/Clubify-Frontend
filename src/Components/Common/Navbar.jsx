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

    const links = (
        <>
            <li>
                <NavLink to="/">Home</NavLink>
            </li>
            <li>
                <NavLink to="/availableclubs">Clubs</NavLink>
            </li>
        </>
    );

    return (
        <div>
            <div className="navbar bg-base-100 shadow-sm px-10">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow text-base font-semibold"
                        >
                            {links}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-3xl font-bold">
                        Clubify
                    </a>
                </div>

                <div className="navbar-center hidden lg:flex text-base font-semibold">
                    <ul className="menu menu-horizontal px-1">{links}</ul>
                </div>


                <div className="navbar-end flex gap-2">
                    {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : user ? (

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                </div>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-100 mt-3 w-52 p-2 shadow">
                                {(user.role === 'admin' || user.role === 'clubManager') && (
                                    <li>
                                        <Link to="/addclubs" className="justify-between">
                                            Add Club
                                        </Link>
                                    </li>
                                )}
                                
                                <li>
                                    <Link to={`/dashboard/${user.role === 'admin' ? 'admin' : user.role === 'clubManager' ? 'manager' : 'member'}`} className="justify-between">
                                        Dashboard
                                    </Link>
                                </li>
                                <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
                            </ul>
                        </div>


                    ) :
                        (<>
                            <Link
                                to="/login"
                                className="btn bg-transparent text-[#632EE3] border-2 border-[#9F62F2] hover:text-white hover:bg-linear-to-r hover:from-[#632EE3] hover:to-[#9F62F2] px-7 transition-all"
                            >
                                Login
                            </Link>
                        </>)}
                </div>
            </div>
        </div>
    );
};

export default Navbar;