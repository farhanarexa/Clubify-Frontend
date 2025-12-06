import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { FaSearch, FaPencilAlt, FaTrash, FaPlus, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

// Mock data for events
const mockEvents = [
  { id: 1, title: 'Tech Talk: AI Trends', description: 'Exploring the latest trends in artificial intelligence', date: '2024-01-15', location: 'San Francisco, CA', isPaid: true, eventFee: 25, maxAttendees: 50, clubId: 1 },
  { id: 2, title: 'Monthly Fitness Meetup', description: 'Group workout and health discussion', date: '2024-01-20', location: 'Golden Gate Park, SF', isPaid: false, eventFee: 0, maxAttendees: 100, clubId: 2 },
  { id: 3, title: 'Gaming Tournament', description: 'Competitive gaming tournament with prizes', date: '2024-01-25', location: 'Online', isPaid: true, eventFee: 15, maxAttendees: 32, clubId: 3 },
  { id: 4, title: 'Webinar: Cloud Computing', description: 'Deep dive into cloud technologies', date: '2024-02-05', location: 'Online', isPaid: true, eventFee: 30, maxAttendees: 200, clubId: 1 },
  { id: 5, title: 'Yoga in the Park', description: 'Relaxing yoga session in the park', date: '2024-02-10', location: 'Central Park, NYC', isPaid: false, eventFee: 0, maxAttendees: 75, clubId: 2 },
];

// Mock functions
const fetchEvents = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockEvents;
};

const createEvent = async (eventData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return { id: Date.now(), ...eventData };
};

const updateEvent = async (eventData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return eventData;
};

const deleteEvent = async (id) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  return id;
};

const EventsManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  
  const queryClient = useQueryClient();
  
  const { data: events, isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Form setup
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  // Watch the isPaid field to conditionally show/hide event fee
  const isPaid = watch('isPaid');

  // Create event mutation
  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
      reset();
    },
  });

  // Update event mutation
  const updateMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setIsModalOpen(false);
      setEditingEvent(null);
      reset();
    },
  });

  // Delete event mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    if (editingEvent) {
      updateMutation.mutate({ ...data, id: editingEvent.id });
    } else {
      createMutation.mutate(data);
    }
  };

  // Handle edit
  const handleEdit = (event) => {
    setEditingEvent(event);
    // Set form values
    Object.keys(event).forEach(key => {
      if (key !== 'id') {
        setValue(key, event[key]);
      }
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id);
    }
  };

  // Handle add new event
  const handleAddNew = () => {
    setEditingEvent(null);
    reset();
    // Set default values
    setValue('isPaid', false);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-red-500">Error loading events: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Events Management</h1>
        <p className="text-gray-600">Create, manage, and track your club events.</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
            />
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            <FaPlus />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  event.isPaid ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.isPaid ? 'Paid' : 'Free'}
                </span>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
              
              <div className="flex items-center text-gray-500 mb-2">
                <FaCalendarAlt className="mr-2" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center text-gray-500 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                <span className="text-sm">{event.location}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Max: {event.maxAttendees} attendees</span>
                {event.isPaid && (
                  <span className="font-medium text-[#6A0DAD]">${event.eventFee}</span>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
              <button 
                onClick={() => handleEdit(event)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <FaPencilAlt />
              </button>
              <button 
                onClick={() => handleDelete(event.id)}
                className="text-red-600 hover:text-red-900"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add/Edit Event */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    {...register('title', { required: 'Event title is required' })}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your event"
                  ></textarea>
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      {...register('date', { required: 'Date is required' })}
                      type="date"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter location"
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paid Event</label>
                    <div className="flex items-center">
                      <input
                        {...register('isPaid')}
                        type="checkbox"
                        className="h-4 w-4 text-[#6A0DAD] focus:ring-[#6A0DAD] border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Charge for this event</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                    <input
                      {...register('maxAttendees', { 
                        required: 'Max attendees is required',
                        min: { value: 1, message: 'Must have at least 1 attendee' },
                        valueAsNumber: true
                      })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Max attendees"
                    />
                    {errors.maxAttendees && <p className="mt-1 text-sm text-red-600">{errors.maxAttendees.message}</p>}
                  </div>
                </div>
                
                {isPaid && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Fee ($)</label>
                    <input
                      {...register('eventFee', { 
                        required: isPaid ? 'Event fee is required for paid events' : false,
                        min: { value: 0, message: 'Fee must be at least $0' },
                        valueAsNumber: true
                      })}
                      type="number"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${
                        errors.eventFee ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter event fee"
                      disabled={!isPaid}
                    />
                    {errors.eventFee && <p className="mt-1 text-sm text-red-600">{errors.eventFee.message}</p>}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingEvent(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-gradient-to-r from-[#6A0DAD] to-[#9F62F2] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;