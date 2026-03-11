import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, formData);
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_email', response.data.email);
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md px-4"
      >
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-4 rounded-full">
              <Lock className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h1 
            className="text-4xl font-bold text-white mb-2 text-center"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="admin-login-title"
          >
            Admin Login
          </h1>
          <p className="text-gray-300 text-center mb-8">Access your dashboard</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  data-testid="admin-email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                  placeholder="admin@momentra.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  data-testid="admin-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="admin-login-submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-red-900/40 hover:shadow-red-800/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-gray-400 text-center">
              Default credentials:<br/>
              Email: admin@momentra.com<br/>
              Password: Momentra@2024
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}