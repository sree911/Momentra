import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Clock, Award, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Video,
      title: 'Professional Quality',
      description: 'High-quality cinematic moments captured with professional equipment'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Professionally edited reels delivered within minutes'
    },
    {
      icon: Award,
      title: 'Expert Team',
      description: 'Experienced videographers dedicated to your vision'
    },
    {
      icon: Users,
      title: 'For Everyone',
      description: 'Perfect for events, creators, businesses, and personal memories'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
          data-testid="about-intro"
        >
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="about-title"
          >
            About Momentra
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6" data-testid="about-description">
            Momentra is a modern freelance videography service designed for instant content creation. 
            We capture high-quality cinematic moments and deliver professionally edited reels within minutes.
          </p>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Perfect for events, creators, businesses, and personal memories. Our mission is to make 
            professional videography fast, accessible, and unforgettable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/book-slot" data-testid="about-book-button">
              <button className="bg-red-700 hover:bg-red-600 text-white px-10 py-4 rounded-full transition-all duration-300 font-medium tracking-wide shadow-2xl shadow-red-900/40 hover:shadow-red-800/60 hover:scale-105">
                Book a Slot
              </button>
            </Link>
            
            <Link to="/become-member" data-testid="about-member-button">
              <button className="bg-transparent border-2 border-white/30 hover:border-white text-white px-10 py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/5 font-medium">
                Become a Member
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          data-testid="features-grid"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-red-500/30 transition-all duration-300 group"
              data-testid={`feature-card-${index}`}
            >
              <feature.icon className="w-12 h-12 text-red-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}