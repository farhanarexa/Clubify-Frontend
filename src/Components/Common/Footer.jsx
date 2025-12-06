import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#6A0DAD] to-[#9B5DE5] text-white py-10 mx-20 rounded-4xl mt-16">
            <div className="container mx-auto px-4 md:px-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <h3 className="text-2xl font-bold">Clubify</h3>
                        </div>
                        <p className="text-gray-200 leading-relaxed max-w-xs">
                            Connecting people with shared interests. Discover amazing communities and build lasting relationships.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white hover:bg-[#A45CFF] hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
                                aria-label="Facebook"
                            >
                                <FaFacebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white hover:bg-[#A45CFF] hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white hover:bg-[#A45CFF] hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white hover:bg-[#A45CFF] hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin size={18} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-300 hover:text-white hover:bg-[#A45CFF] hover:bg-opacity-30 p-2 rounded-full transition-all duration-300"
                                aria-label="GitHub"
                            >
                                <FaGithub size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-[#A45CFF] after:to-[#7ED8FF]">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/availableclubs" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Explore Clubs
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Club Categories */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-[#A45CFF] after:to-[#7ED8FF]">
                            Popular Categories
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/availableclubs?category=photography" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Photography
                                </Link>
                            </li>
                            <li>
                                <Link to="/availableclubs?category=hiking" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Hiking Groups
                                </Link>
                            </li>
                            <li>
                                <Link to="/availableclubs?category=books" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Book Clubs
                                </Link>
                            </li>
                            <li>
                                <Link to="/availableclubs?category=tech" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Tech Enthusiasts
                                </Link>
                            </li>
                            <li>
                                <Link to="/availableclubs?category=art" className="text-gray-300 hover:text-white hover:text-[#A45CFF] transition-colors duration-300 block py-1">
                                    Art Communities
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-gradient-to-r after:from-[#A45CFF] after:to-[#7ED8FF]">
                            Stay Connected
                        </h4>
                        <p className="text-gray-200 mb-4">
                            Subscribe to our newsletter for the latest updates and exclusive offers.
                        </p>
                        <div className="space-y-4">
                            <form className="flex flex-col space-y-3">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A45CFF] focus:border-transparent transition-all text-white placeholder-gray-300"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#A45CFF] to-[#7ED8FF] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5"
                                >
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-gray-400 text-sm mt-2">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/20 my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300 text-center md:text-left mb-4 md:mb-0">
                        © {new Date().getFullYear()} Clubify. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center space-x-6 md:space-x-8">
                        <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors py-1">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-gray-300 hover:text-white transition-colors py-1">
                            Terms of Service
                        </Link>
                        <Link to="/support" className="text-gray-300 hover:text-white transition-colors py-1">
                            Support
                        </Link>
                        <Link to="/about" className="text-gray-300 hover:text-white transition-colors py-1">
                            About
                        </Link>
                    </div>
                </div>

                {/* Heart Divider */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 flex items-center justify-center gap-2 text-sm">
                        Made with <FaHeart className="text-red-400" /> for community connections
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

