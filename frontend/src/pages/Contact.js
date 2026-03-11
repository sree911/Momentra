import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 89103 61800',
      link: 'tel:+918910361800'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'momentrashoot@gmail.com',
      link: 'mailto:momentrashoot@gmail.com'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@momentrashoot',
      link: 'https://instagram.com/momentrashoot'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Hyderabad, India',
      link: null
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contacts`, formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact error:', error);
      toast.error('Failed to send message. Please try again.');
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
            data-testid="contact-title"
          >
            Get in Touch
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            data-testid="contact-info"
          >
            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Contact Information
            </h2>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.6 }}
                  className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-red-500/30 transition-all duration-300"
                  data-testid={`contact-info-${info.label.toLowerCase()}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-600/20 p-3 rounded-lg">
                      <info.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-red-500 transition-colors font-medium"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8"
            data-testid="contact-form"
          >
            <h2 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                  Name *
                </Label>
                <Input
                  id="name"
                  data-testid="contact-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  data-testid="contact-email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  data-testid="contact-message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full min-h-[150px]"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                data-testid="contact-submit"
                disabled={loading}
                className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-red-900/40 hover:shadow-red-800/60 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}