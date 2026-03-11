import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1497914809399-6a2d7486bf8a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxjaW5lbWF0aWMlMjB2aWRlb2dyYXBoeSUyMGNhbWVyYSUyMGRhcmslMjByZWR8ZW58MHx8fHwxNzcyODE1OTY2fDA&ixlib=rb-4.1.0&q=85)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
            data-testid="hero-section"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Camera className="w-12 h-12 text-red-600 absolute -top-8 left-1/2 transform -translate-x-1/2" data-testid="hero-camera-icon" />
                <h1 
                  className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  data-testid="hero-title"
                >
                  Momentra
                </h1>
              </div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
              data-testid="hero-subtitle"
            >
              Capture your moments instantly. Professional freelance videography with reels delivered within minutes.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/book-slot" data-testid="hero-book-button">
                <button className="bg-red-700 hover:bg-red-600 text-white px-10 py-4 rounded-full transition-all duration-300 font-medium tracking-wide shadow-2xl shadow-red-900/40 hover:shadow-red-800/60 hover:scale-105 flex items-center gap-2 text-lg">
                  Book a Slot
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              
              <Link to="/become-member" data-testid="hero-member-button">
                <button className="bg-transparent border-2 border-white/30 hover:border-white text-white px-10 py-4 rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/5 text-lg font-medium">
                  Become a Member
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0202] to-transparent" />
      </div>
    </div>
  );
}