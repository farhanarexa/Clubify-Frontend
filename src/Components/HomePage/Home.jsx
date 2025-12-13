import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaHeart, FaLightbulb, FaUserPlus, FaHandshake } from 'react-icons/fa';

// Mock data for clubs (in a real app, this would come from your backend)
const mockClubs = [
  {
    id: 1,
    name: "Tech Innovators",
    category: "Technology",
    members: 1250,
    description: "Exploring the latest trends in technology and innovation",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    location: "San Francisco, CA"
  },
  {
    id: 2,
    name: "Creative Writers",
    category: "Arts",
    members: 980,
    description: "A community for passionate writers to share and grow",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    location: "New York, NY"
  },
  {
    id: 3,
    name: "Fitness Enthusiasts",
    category: "Health & Fitness",
    members: 2100,
    description: "Stay active and healthy with like-minded individuals",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    location: "Los Angeles, CA"
  },
  {
    id: 4,
    name: "Food Lovers",
    category: "Food & Drink",
    members: 1560,
    description: "Discover new cuisines and share culinary experiences",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    location: "Chicago, IL"
  },
  {
    id: 5,
    name: "Photography Masters",
    category: "Photography",
    members: 890,
    description: "Capture beautiful moments with fellow photographers",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    location: "Portland, OR"
  },
  {
    id: 6,
    name: "Book Club Society",
    category: "Literature",
    members: 1420,
    description: "Reading and discussing great books with passionate readers",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    location: "Seattle, WA"
  }
];

// Function to fetch featured clubs
const fetchFeaturedClubs = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Return clubs sorted by member count (descending) to show most popular first
  return [...mockClubs].sort((a, b) => b.members - a.members).slice(0, 6);
};

const Home = () => {
  // Using TanStack Query to fetch featured clubs
  const { data: featuredClubs, isLoading, isError, error } = useQuery({
    queryKey: ['featuredClubs'],
    queryFn: fetchFeaturedClubs,
    staleTime: 5 * 60 * 1000, 
  });

  // How it works steps
  const howItWorksSteps = [
    {
      icon: <FaUserPlus className="text-3xl" />,
      title: "Sign Up",
      description: "Create your account and complete your profile"
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "Find Clubs",
      description: "Browse through hundreds of clubs that match your interests"
    },
    {
      icon: <FaCalendarAlt className="text-3xl" />,
      title: "Join Events",
      description: "Connect with members and attend events that excite you"
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Grow Together",
      description: "Build meaningful relationships and expand your network"
    }
  ];

  // Popular categories
  const popularCategories = [
    { name: "Technology", count: 142 },
    { name: "Arts & Creativity", count: 118 },
    { name: "Health & Fitness", count: 96 },
    { name: "Food & Drink", count: 84 },
    { name: "Outdoors", count: 75 },
    { name: "Photography", count: 62 },
    { name: "Business", count: 58 },
    { name: "Music", count: 49 }
  ];

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">
                Discover Your <span className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] bg-clip-text text-transparent">Perfect Community</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                Connect with people who share your interests, passions, and goals. Join clubs that matter to you and grow together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Join a Club
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#6A0DAD] border-2 border-[#6A0DAD] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#6A0DAD] hover:text-white transition-all"
                >
                  Create a Club
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="lg:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] rounded-2xl p-1 shadow-2xl">
                  <div className="bg-white rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {mockClubs.slice(0, 4).map((club, index) => (
                        <motion.div
                          key={club.id}
                          className="bg-gray-100 rounded-lg p-4 flex flex-col items-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                          <p className="font-semibold text-sm mt-2 text-center">{club.name.split(' ')[0]}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-full p-4 shadow-lg border-4 border-white">
                  <div className="text-2xl font-bold text-[#6A0DAD]">+50k</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How ClubSphere Works Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How ClubSphere Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with your community is simple and rewarding
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-linear-to-b from-white to-gray-50 rounded-2xl p-6 text-center shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Clubs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most popular clubs in our community
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading featured clubs: {error.message}</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {featuredClubs?.map((club, index) => (
                <motion.div
                  key={club.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-100 border border-gray-100"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -3, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                >
                  <div className="h-48 overflow-hidden">
                    <div className="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center">
                      <span className="text-gray-500">Club Image</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{club.name}</h3>
                      <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {club.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{club.description}</p>
                    <div className="flex items-center text-gray-500 mb-4">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{club.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-700">
                        <FaUsers className="mr-2" />
                        <span>{club.members.toLocaleString()} members</span>
                      </div>
                      <button className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                        Join
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 ">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore clubs in categories you're passionate about
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularCategories.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <FaHeart />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} clubs</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-50 rounded-4xl py-20 bg-linear-to-r from-[#A45CFF] to-[#7ED8FF]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join a Community?</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Start connecting with like-minded people today. Find clubs that match your interests or create your own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#A45CFF] px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition-all"
              >
                Find Clubs
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#A45CFF] transition-all"
              >
                Create Club
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;