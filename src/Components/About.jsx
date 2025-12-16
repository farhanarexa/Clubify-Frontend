import React from 'react';
import { FaUsers, FaLightbulb, FaHandshake, FaGlobe } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#FAF8F0] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About <span className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] bg-clip-text text-transparent">Clubify</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting people with shared interests to build vibrant communities and meaningful relationships.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 lg:h-80 flex items-center justify-center">
                <span className="text-gray-500">Our Story Image</span>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, Clubify was created with a simple mission: to bring people together through shared interests and passions. We recognized that in our increasingly digital world, people were looking for meaningful ways to connect with others who share their hobbies, interests, and goals.
              </p>
              <p className="text-gray-600">
                Today, Clubify serves thousands of users across the globe, facilitating connections and fostering communities around diverse interests from technology and arts to fitness and food.
              </p>
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="bg-[#6A0DAD]/10 p-3 rounded-full mr-4">
                <FaLightbulb className="text-[#6A0DAD] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600">
              To create a platform where people can easily discover, join, and create communities around their interests, fostering meaningful connections and shared experiences that enrich their lives.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="bg-[#6A0DAD]/10 p-3 rounded-full mr-4">
                <FaGlobe className="text-[#6A0DAD] text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-600">
              To be the leading global platform for interest-based communities, where every person can find their tribe, share their passion, and make lasting friendships.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                We believe in the power of bringing people together around shared interests and experiences.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Inclusivity</h3>
              <p className="text-gray-600 text-sm">
                We welcome people of all backgrounds, ages, and experiences to join our communities.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Growth</h3>
              <p className="text-gray-600 text-sm">
                We encourage personal and collective growth through learning and sharing.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Authenticity</h3>
              <p className="text-gray-600 text-sm">
                We promote genuine connections and authentic interactions in our communities.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-lg">Active Members</div>
          </div>
          <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-lg">Active Clubs</div>
          </div>
          <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-lg">Countries</div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Team Member {item}</h3>
                <p className="text-gray-600">Role Title</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;