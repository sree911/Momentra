import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BookSlot() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    booking_date: '',
    location: '',
    additional_notes: ''
  });

  const pricingPlans = [
    { duration: '1 Hour', price: '₹1999', hours: '1hr' },
    { duration: '2 Hours', price: '₹3999', hours: '2hr', popular: true },
    { duration: 'Half Day', price: '₹5999', hours: 'halfday' },
    { duration: 'Full Day', price: '₹9999', hours: 'fullday' }
  ];

  const handleBookNow = (hours) => {
    setSelectedDuration(hours);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        ...formData,
        duration: selectedDuration
      };

      await axios.post(`${API}/bookings`, bookingData);
      toast.success('Booking successful! We will contact you soon.');
      
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        booking_date: '',
        location: '',
        additional_notes: ''
      });
      setShowForm(false);
      setSelectedDuration('');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="book-slot-title"
          >
            Book Your Slot
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Choose your preferred duration and let us capture your moments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" data-testid="pricing-cards">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              className={`relative flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent border rounded-3xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 ${
                plan.popular ? 'border-red-500/50' : 'border-white/10'
              }`}
              data-testid={`pricing-card-${plan.hours}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-red-600" />
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {plan.duration}
                </h3>
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {plan.price}
                </span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-red-600" />
                  Professional videographer
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-red-600" />
                  Edited reel delivery
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Check className="w-5 h-5 text-red-600" />
                  High-quality footage
                </li>
              </ul>
              
              <button
                onClick={() => handleBookNow(plan.hours)}
                data-testid={`book-now-${plan.hours}`}
                className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                  plan.popular
                    ? 'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-900/40'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
                }`}
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>

        {showForm && (
          <motion.div
            id="booking-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8"
            data-testid="booking-form"
          >
            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Complete Your Booking
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="full_name" className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  data-testid="booking-full-name"
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
                  data-testid="booking-email"
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
                  data-testid="booking-phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <Label htmlFor="booking_date" className="block text-sm font-medium text-gray-400 mb-2">
                  Booking Date *
                </Label>
                <Input
                  id="booking_date"
                  type="date"
                  data-testid="booking-date"
                  required
                  value={formData.booking_date}
                  onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                />
              </div>

              <div>
                <Label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">
                  Duration *
                </Label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration} required>
                  <SelectTrigger data-testid="booking-duration" className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a0505] border border-white/10">
                    <SelectItem value="1hr" className="text-white hover:bg-white/10">1 Hour</SelectItem>
                    <SelectItem value="2hr" className="text-white hover:bg-white/10">2 Hours</SelectItem>
                    <SelectItem value="halfday" className="text-white hover:bg-white/10">Half Day</SelectItem>
                    <SelectItem value="fullday" className="text-white hover:bg-white/10">Full Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-2">
                  Location *
                </Label>
                <Input
                  id="location"
                  data-testid="booking-location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                  placeholder="Event location"
                />
              </div>

              <div>
                <Label htmlFor="additional_notes" className="block text-sm font-medium text-gray-400 mb-2">
                  Additional Notes
                </Label>
                <Textarea
                  id="additional_notes"
                  data-testid="booking-notes"
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full min-h-[100px]"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <button
                type="submit"
                data-testid="booking-submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-red-900/40 hover:shadow-red-800/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Confirm Booking'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}