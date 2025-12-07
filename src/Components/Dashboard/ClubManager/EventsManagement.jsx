import React, { useState, useEffect } from 'react';
import { eventApi } from '../../../api/clubifyApi';
import { clubApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../../../Contexts/AuthContext';

const EventsManagement = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedClub, setSelectedClub] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        eventDate: '',
        location: '',
        isPaid: false,
        eventFee: 0,
        maxAttendees: null
    });

    useEffect(() => {
        if (user) {
            fetchClubs();
        }
    }, [user]);

    const fetchClubs = async () => {
        try {
            const userClubs = await clubApi.getClubsByManager(user.email);
            setClubs(userClubs);
            
            if (userClubs.length > 0) {
                setSelectedClub(userClubs[0]._id);
            }
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs');
        }
    };

    const fetchEvents = async (clubId) => {
        try {
            const response = await eventApi.getEventsByClub(clubId);
            setEvents(response);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClub) {
            fetchEvents(selectedClub);
        }
    }, [selectedClub]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create event for the selected club
            await eventApi.createEvent({
                ...formData,
                clubId: selectedClub
            }, 'fake-token'); // Replace with actual token
            toast.success('Event created successfully!');
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                eventDate: '',
                location: '',
                isPaid: false,
                eventFee: 0,
                maxAttendees: null
            });
            fetchEvents(selectedClub); // Refresh the list
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(error.response?.data?.error || 'Failed to create event');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Events Management</h1>
                        <p className="text-gray-600">Manage events for your clubs</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            value={selectedClub}
                            onChange={(e) => setSelectedClub(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                        >
                            {clubs.map((club) => (
                                <option key={club._id} value={club._id}>
                                    {club.clubName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                            {showForm ? 'Cancel' : '+ Create Event'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Event Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Event</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                    placeholder="Event title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                    placeholder="Event location"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                placeholder="Describe your event"
                            ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                                <input
                                    type="datetime-local"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <input
                                    type="checkbox"
                                    name="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">
                                    Paid Event
                                </label>
                            </div>
                        </div>
                        {formData.isPaid && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Fee ($)</label>
                                    <input
                                        type="number"
                                        name="eventFee"
                                        value={formData.eventFee}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                                    <input
                                        type="number"
                                        name="maxAttendees"
                                        value={formData.maxAttendees || ''}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                                        placeholder="Unlimited if empty"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Events List */}
            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event._id} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                                <p className="text-gray-600 mt-1">{event.description}</p>
                                <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                                    <span>📅 {new Date(event.eventDate).toLocaleString()}</span>
                                    <span>📍 {event.location}</span>
                                    <span>💰 {event.isPaid ? `$${event.eventFee}` : 'Free'}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                    ${event.isPaid ? 'bg-purple-100 text-purple-800' : 
                                      'bg-green-100 text-green-800'}`}>
                                    {event.isPaid ? 'Paid' : 'Free'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button className="bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {events.length === 0 && !showForm && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No events found for this club</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Create Your First Event
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventsManagement;