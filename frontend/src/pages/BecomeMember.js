import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BecomeMember() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    customer_type: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/memberships`, formData);
      toast.success('Membership registration successful! Welcome to Momentra.');
      
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        city: '',
        customer_type: '',
        message: ''
      });
    } catch (error) {
      console.error('Membership error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-4 rounded-full">
              <UserPlus className="w-12 h-12 text-red-600" data-testid="member-icon" />
            </div>
          </div>
          
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="member-title"
          >
            Become a Member
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join our community and get exclusive access to priority bookings, special discounts, and more
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8"
          data-testid="membership-form"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="full_name" className="block text-sm font-medium text-gray-400 mb-2">
                Full Name *
              </Label>
              <Input
                id="full_name"
                data-testid="member-full-name"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                data-testid="member-email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                data-testid="member-phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <Label htmlFor="city" className="block text-sm font-medium text-gray-400 mb-2">
                City *
              </Label>
              <Input
                id="city"
                data-testid="member-city"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                placeholder="Your city"
              />
            </div>

            <div>
              <Label htmlFor="customer_type" className="block text-sm font-medium text-gray-400 mb-2">
                Type of Customer *
              </Label>
              <Select value={formData.customer_type} onValueChange={(value) => setFormData({...formData, customer_type: value})} required>
                <SelectTrigger data-testid="member-type" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0505] border border-white/10">
                  <SelectItem value="Creator" className="text-white hover:bg-white/10">Creator</SelectItem>
                  <SelectItem value="Business" className="text-white hover:bg-white/10">Business</SelectItem>
                  <SelectItem value="Personal" className="text-white hover:bg-white/10">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                Message
              </Label>
              <Textarea
                id="message"
                data-testid="member-message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full min-h-[120px]"
                placeholder="Tell us about yourself and why you want to join..."
              />
            </div>

            <button
              type="submit"
              data-testid="member-submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-red-900/40 hover:shadow-red-800/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Join Momentra'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}