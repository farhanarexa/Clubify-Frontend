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
            Connecting people with shared interests to build vibrant communities and meaningful relationships in Bangladesh.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-[#6A0DAD] to-[#9F62F2] rounded-xl w-full h-64 lg:h-80 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <h3 className="text-2xl font-bold mb-2">Dhaka Skyline</h3>
                  <p className="text-white/90">Where connections come alive</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023 in Dhaka, Bangladesh, Clubify was created with a simple mission: to bring people together through shared interests and passions. We recognized that in our increasingly digital world, people in Bangladesh were looking for meaningful ways to connect with others who share their hobbies, interests, and goals.
              </p>
              <p className="text-gray-600">
                Today, Clubify serves thousands of users across Bangladesh, from Dhaka to Chittagong to Sylhet, facilitating connections and fostering communities around diverse interests from technology and arts to fitness and traditional Bangladeshi culture.
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
              To create a platform where people in Bangladesh can easily discover, join, and create communities around their interests, fostering meaningful connections and shared experiences that enrich their lives and strengthen our cultural bonds.
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
              To be the leading platform for interest-based communities in Bangladesh, where every person can find their tribe, share their passion, and make lasting friendships rooted in our rich cultural heritage.
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Unity</h3>
              <p className="text-gray-600 text-sm">
                We believe in bringing together Bangladeshis from all walks of life around shared interests and experiences.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cultural Heritage</h3>
              <p className="text-gray-600 text-sm">
                We celebrate and preserve Bangladeshi traditions while fostering modern connections and innovation.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Growth</h3>
              <p className="text-gray-600 text-sm">
                We encourage personal and collective growth through learning and sharing our rich cultural knowledge.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="bg-[#6A0DAD]/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaGlobe className="text-[#6A0DAD] text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Authenticity</h3>
              <p className="text-gray-600 text-sm">
                We promote genuine connections and authentic interactions that honor our Bangladeshi values.
              </p>
            </div>
          </div>
        </div>

        {/* Stats for Bangladesh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-lg">Active Members in Bangladesh</div>
          </div>
          <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold mb-2">1.2K+</div>
            <div className="text-lg">Active Clubs in Bangladesh</div>
          </div>
          <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold mb-2">64</div>
            <div className="text-lg">Districts Covered</div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Our Bangladeshi Team</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6A0DAD] to-[#9F62F2] rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">SR</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Shahriar Rahman</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6A0DAD] to-[#9F62F2] rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">TN</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Tasnim Noor</h3>
              <p className="text-gray-600">CTO</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6A0DAD] to-[#9F62F2] rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">AK</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Ahmed Kabir</h3>
              <p className="text-gray-600">Head of Development</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-[#6A0DAD] to-[#9F62F2] rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">MR</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Maliha Rashid</h3>
              <p className="text-gray-600">Community Manager</p>
            </div>
          </div>
        </div>

        {/* Bangladesh Culture Highlight */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Rooted in Bangladeshi Culture</h2>
          <p className="text-gray-700 text-center mb-4">
            At Clubify, we celebrate the rich heritage of Bangladesh - from our beautiful rivers and majestic mangroves
            to our literary tradition and musical legacy. Join our communities to explore and share what makes our nation special.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow">Bengali Literature</span>
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow">Traditional Crafts</span>
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow">Music & Dance</span>
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow">Food Culture</span>
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow">Technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;