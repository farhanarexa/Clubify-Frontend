import React, { useState, useContext } from 'react';
import { eventApi } from '../../../api/clubifyApi';
import { clubApi } from '../../../api/clubifyApi';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../../Contexts/AuthContext';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaUsers } from 'react-icons/fa';

const EventsManagement = () => {
  const { user } = useContext(AuthContext);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  // Categories for clubs
  const categories = [
    'Technology', 'Arts', 'Health & Fitness', 'Food & Drink',
    'Outdoors', 'Photography', 'Business', 'Music', 'Education',
    'Sports', 'Gaming', 'Travel', 'Volunteering', 'Other'
  ];

  // Fetch clubs managed by the user
  const { data: managedClubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['managedClubs', user?.email],
    queryFn: () => clubApi.getClubsByManager(user?.email),
    enabled: !!user?.email,
  });

  // Fetch all events for managed clubs
  const { data: allEvents, isLoading: eventsLoading, refetch } = useQuery({
    queryKey: ['managerEvents', user?.email],
    queryFn: async () => {
      if (!managedClubs) return [];
      const allEventsData = [];
      for (const club of managedClubs) {
        try {
          const clubEvents = await eventApi.getEventsByClub(club._id);
          allEventsData.push(...clubEvents);
        } catch (error) {
          // Continue even if one club fails to load events
          continue;
        }
      }
      return allEventsData;
    },
    enabled: !!user?.email && !!managedClubs,
  });

  // Mutation for creating an event
  const createEventMutation = useMutation({
    mutationFn: (eventData) => {
      return eventApi.createEvent(eventData);
    },
    onSuccess: () => {
      toast.success('Event created successfully!');
      queryClient.invalidateQueries({ queryKey: ['managerEvents', user?.email] });
      setShowCreateForm(false);
    },
    onError: (error) => {
      toast.error('Failed to create event');
    }
  });

  // Mutation for updating an event
  const updateEventMutation = useMutation({
    mutationFn: ({ eventId, updateData }) => {
      return eventApi.updateEvent(eventId, updateData);
    },
    onSuccess: () => {
      toast.success('Event updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['managerEvents', user?.email] });
      setEditingEvent(null);
    },
    onError: (error) => {
      toast.error('Failed to update event');
    }
  });

  // Mutation for deleting an event
  const deleteEventMutation = useMutation({
    mutationFn: (eventId) => {
      return eventApi.deleteEvent(eventId);
    },
    onSuccess: () => {
      toast.success('Event deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['managerEvents', user?.email] });
    },
    onError: (error) => {
      toast.error('Failed to delete event');
    }
  });

  const handleCreateEvent = (data) => {
    createEventMutation.mutate(data);
  };

  const handleUpdateEvent = (data) => {
    if (!editingEvent) return;
    updateEventMutation.mutate({ eventId: editingEvent._id, updateData: data });
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEventMutation.mutate(eventId);
    }
  };

  // Create Event Form
  const CreateEventForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
      // Convert date to proper format for backend
      const eventData = {
        clubId: data.clubId,
        title: data.title,
        description: data.description,
        eventDate: data.date ? new Date(data.date).toISOString() : null,
        location: data.location,
        isPaid: data.isPaid === 'true', // Convert string to boolean
        eventFee: parseFloat(data.eventFee) || 0,
        maxAttendees: parseInt(data.maxAttendees) || null
      };

      handleCreateEvent(eventData);
      reset();
    };

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Event</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
            <input
              {...register('title', { required: 'Event title is required' })}
              type="text"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Describe your event"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club *</label>
              <select
                {...register('clubId', { required: 'Please select a club' })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.clubId ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select a club</option>
                {managedClubs?.map(club => (
                  <option key={club._id} value={club._id}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              {errors.clubId && (
                <p className="mt-1 text-sm text-red-600">{errors.clubId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
              <input
                {...register('date', { required: 'Event date is required' })}
                type="datetime-local"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Event location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Is Paid Event?</label>
                <select
                  {...register('isPaid')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Fee ($)</label>
                <input
                  {...register('eventFee', {
                    valueAsNumber: true,
                    validate: (value) => value >= 0 || 'Fee cannot be negative'
                  })}
                  type="number"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.eventFee ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                />
                {errors.eventFee && (
                  <p className="mt-1 text-sm text-red-600">{errors.eventFee.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Attendees</label>
            <input
              {...register('maxAttendees', {
                valueAsNumber: true,
                validate: (value) => value > 0 || 'Must be at least 1'
              })}
              type="number"
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Maximum number of attendees"
            />
            {errors.maxAttendees && (
              <p className="mt-1 text-sm text-red-600">{errors.maxAttendees.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={createEventMutation.isPending}
              className="flex-1 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {createEventMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                reset();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Edit Event Form
  const EditEventForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
      defaultValues: {
        title: editingEvent?.title || '',
        description: editingEvent?.description || '',
        clubId: editingEvent?.clubId ? editingEvent.clubId.toString() : '',
        date: editingEvent?.eventDate ? new Date(editingEvent.eventDate).toISOString().slice(0, 16) : editingEvent?.date ? new Date(editingEvent.date).toISOString().slice(0, 16) : '',
        location: editingEvent?.location || '',
        isPaid: editingEvent?.isPaid?.toString() || 'false',
        eventFee: editingEvent?.eventFee || 0,
        maxAttendees: editingEvent?.maxAttendees || 1
      }
    });

    const onSubmit = (data) => {
      // Prepare data for backend API with proper field mapping
      const updateData = {
        title: data.title,
        description: data.description,
        eventDate: data.date ? new Date(data.date).toISOString() : editingEvent.eventDate,
        location: data.location,
        isPaid: data.isPaid === 'true', // Convert string to boolean
        eventFee: parseFloat(data.eventFee) || 0,
        maxAttendees: parseInt(data.maxAttendees) || null,
        updatedAt: new Date()
      };

      handleUpdateEvent(updateData);
    };

    if (!editingEvent) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Edit Event: {editingEvent.title}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
            <input
              {...register('title', { required: 'Event title is required' })}
              type="text"
              className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={2}
              className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Describe your event"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Club *</label>
              <select
                {...register('clubId', { required: 'Please select a club' })}
                className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.clubId ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled // Club should not be changed after creation
              >
                <option value="">Select a club</option>
                {managedClubs?.map(club => (
                  <option key={club._id} value={club._id}>
                    {club.clubName}
                  </option>
                ))}
              </select>
              {errors.clubId && (
                <p className="mt-1 text-sm text-red-600">{errors.clubId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
              <input
                {...register('date', { required: 'Event date is required' })}
                type="datetime-local"
                className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                {...register('location', { required: 'Location is required' })}
                type="text"
                className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Event location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Is Paid Event?</label>
                <select
                  {...register('isPaid')}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD]"
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Fee ($)</label>
                <input
                  {...register('eventFee', {
                    valueAsNumber: true,
                    validate: (value) => value >= 0 || 'Fee cannot be negative'
                  })}
                  type="number"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.eventFee ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                />
                {errors.eventFee && (
                  <p className="mt-1 text-sm text-red-600">{errors.eventFee.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Attendees</label>
            <input
              {...register('maxAttendees', {
                valueAsNumber: true,
                validate: (value) => value > 0 || 'Must be at least 1'
              })}
              type="number"
              min="1"
              className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-[#6A0DAD] focus:border-[#6A0DAD] ${errors.maxAttendees ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="Maximum number of attendees"
            />
            {errors.maxAttendees && (
              <p className="mt-1 text-sm text-red-600">{errors.maxAttendees.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={updateEventMutation.isPending}
              className="flex-1 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {updateEventMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingEvent(null);
                reset();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <FaTimes className="mr-1" /> Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (clubsLoading || eventsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6A0DAD]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Events Management</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center"
          >
            <FaPlus className="mr-2" /> {showCreateForm ? 'Cancel' : 'Create Event'}
          </button>
        </div>
        <p className="text-gray-600">Manage events for your clubs</p>
      </div>

      {showCreateForm && <CreateEventForm />}

      {editingEvent && <EditEventForm />}

      {/* Events List */}
      <div className="space-y-4">
        {allEvents && allEvents.length > 0 ? (
          allEvents.map((event) => {
            // Find the club name for this event
            const club = managedClubs?.find(c => c._id === event.clubId);
            return (
              <div key={event._id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                    <p className="text-gray-600 mt-1">{event.description}</p>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-gray-500" />
                        <span>{new Date(event.date).toLocaleString()}</span>
                      </div>

                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-gray-500" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center">
                        <FaDollarSign className="mr-1 text-gray-500" />
                        <span>{event.isPaid ? `$${event.eventFee || 0}` : 'Free'}</span>
                      </div>

                      <div className="flex items-center">
                        <FaUsers className="mr-1 text-gray-500" />
                        <span>{event.maxAttendees || 'Unlimited'} attendees</span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="bg-[#6A0DAD]/10 text-[#6A0DAD] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Club: {club?.clubName || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit event"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete event"
                      disabled={deleteEventMutation.isPending}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-500">
                  Created: {new Date(event.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700">No events found</h3>
            <p className="text-gray-500 mt-2">You haven't created any events yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="mt-4 bg-linear-to-r from-[#6A0DAD] to-[#9F62F2] text-white py-2 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create Your First Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsManagement;