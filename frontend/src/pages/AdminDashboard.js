import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Search, Calendar, Users, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({ bookings: 0, memberships: 0, contacts: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [bookingsRes, membershipsRes, contactsRes, statsRes] = await Promise.all([
        axios.get(`${API}/bookings`, config),
        axios.get(`${API}/memberships`, config),
        axios.get(`${API}/contacts`, config),
        axios.get(`${API}/admin/stats`, config)
      ]);

      setBookings(bookingsRes.data);
      setMemberships(membershipsRes.data);
      setContacts(contactsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_email');
        navigate('/admin/login');
        toast.error('Session expired. Please login again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchData();
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const searchData = { query: searchQuery };

      if (activeTab === 'bookings') {
        const res = await axios.post(`${API}/admin/bookings/search`, searchData, config);
        setBookings(res.data);
      } else if (activeTab === 'memberships') {
        const res = await axios.post(`${API}/admin/memberships/search`, searchData, config);
        setMemberships(res.data);
      } else if (activeTab === 'contacts') {
        const res = await axios.post(`${API}/admin/contacts/search`, searchData, config);
        setContacts(res.data);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: 'Playfair Display, serif' }}
              data-testid="dashboard-title"
            >
              Admin Dashboard
            </h1>
            <p className="text-gray-300">Welcome back, {localStorage.getItem('admin_email')}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchData}
              className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-white/10 flex items-center gap-2"
              data-testid="refresh-button"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-600/20 to-red-900/20 backdrop-blur-md border border-red-500/30 rounded-xl p-6"
            data-testid="stat-bookings"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-600/30 p-3 rounded-lg">
                <Calendar className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-white">{stats.bookings}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-6"
            data-testid="stat-members"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-600/30 p-3 rounded-lg">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Total Members</p>
                <p className="text-3xl font-bold text-white">{stats.memberships}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-600/20 to-green-900/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
            data-testid="stat-contacts"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-600/30 p-3 rounded-lg">
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-gray-300 text-sm">Contact Messages</p>
                <p className="text-3xl font-bold text-white">{stats.contacts}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500 transition-colors w-full"
                data-testid="search-input"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 rounded-lg p-1 mb-6">
              <TabsTrigger 
                value="bookings" 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md transition-all"
                data-testid="tab-bookings"
              >
                Bookings ({bookings.length})
              </TabsTrigger>
              <TabsTrigger 
                value="memberships" 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md transition-all"
                data-testid="tab-memberships"
              >
                Members ({memberships.length})
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 rounded-md transition-all"
                data-testid="tab-contacts"
              >
                Contacts ({contacts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="bookings-table">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Name</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Email</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Phone</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Date</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Duration</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Location</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="text-white py-4 px-4">{booking.full_name}</td>
                        <td className="text-gray-300 py-4 px-4">{booking.email}</td>
                        <td className="text-gray-300 py-4 px-4">{booking.phone}</td>
                        <td className="text-gray-300 py-4 px-4">{booking.booking_date}</td>
                        <td className="text-gray-300 py-4 px-4">
                          <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                            {booking.duration}
                          </span>
                        </td>
                        <td className="text-gray-300 py-4 px-4">{booking.location}</td>
                        <td className="text-gray-400 py-4 px-4 text-sm">{formatDate(booking.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bookings.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No bookings yet</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="memberships">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="memberships-table">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Name</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Email</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Phone</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">City</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Type</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberships.map((member, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="text-white py-4 px-4">{member.full_name}</td>
                        <td className="text-gray-300 py-4 px-4">{member.email}</td>
                        <td className="text-gray-300 py-4 px-4">{member.phone}</td>
                        <td className="text-gray-300 py-4 px-4">{member.city}</td>
                        <td className="text-gray-300 py-4 px-4">
                          <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            {member.customer_type}
                          </span>
                        </td>
                        <td className="text-gray-400 py-4 px-4 text-sm">{formatDate(member.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {memberships.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No members yet</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="contacts">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="contacts-table">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Name</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Email</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Message</th>
                      <th className="text-left text-gray-300 font-medium py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="text-white py-4 px-4">{contact.name}</td>
                        <td className="text-gray-300 py-4 px-4">{contact.email}</td>
                        <td className="text-gray-300 py-4 px-4 max-w-md truncate">{contact.message}</td>
                        <td className="text-gray-400 py-4 px-4 text-sm">{formatDate(contact.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {contacts.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No contact messages yet</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}