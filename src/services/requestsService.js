/**
 * Service for managing Food Requests.
 * Sized by NUMBER OF PEOPLE (PRD Override requirement).
 */

import { getItem, setItem, STORAGE_KEYS, initializeStorageIfEmpty } from './storage';
import { authService } from './authService';

export const requestsService = {
  /**
   * Retrieves all requests annotated with receiver info.
   */
  async listRequests() {
    initializeStorageIfEmpty();
    const requests = getItem(STORAGE_KEYS.REQUESTS, []);
    const users = await authService.listUsers();
    const userMap = new Map(users.map((u) => [u.id, u]));

    return requests.map((req) => {
      const receiver = userMap.get(req.receiverId);
      const donor = req.acceptedBy ? userMap.get(req.acceptedBy) : null;
      return {
        ...req,
        receiverName: receiver ? (receiver.institutionName || receiver.contactName) : 'Community Shelter',
        receiverContactName: receiver?.contactName || '',
        receiverPhone: receiver?.phone || '+91 94951 88220',
        donorName: donor ? (donor.institutionName || donor.contactName) : req.acceptedByName,
        donorPhone: donor?.phone || req.acceptedByPhone,
      };
    });
  },

  /**
   * Retrieves only open, unfulfilled food requests.
   */
  async listOpenRequests() {
    const all = await this.listRequests();
    return all.filter((r) => r.status === 'open');
  },

  /**
   * Retrieves requests submitted by a specific receiver.
   */
  async getRequestsByReceiver(receiverId) {
    const all = await this.listRequests();
    return all.filter((r) => r.receiverId === receiverId);
  },

  /**
   * Creates a new food request sized by NUMBER OF PEOPLE.
   */
  async addRequest({ receiverId, item, numberOfPeople, location, neededByDate, neededByTime }) {
    initializeStorageIfEmpty();
    const requests = getItem(STORAGE_KEYS.REQUESTS, []);

    const newRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      receiverId,
      item: item.trim(),
      numberOfPeople: Number(numberOfPeople),
      location: location.trim(),
      neededByDate,
      neededByTime,
      status: 'open',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    setItem(STORAGE_KEYS.REQUESTS, requests);
    return newRequest;
  },

  /**
   * Allows a donor to accept and fulfill a food request.
   */
  async acceptRequest(id, donorUser) {
    initializeStorageIfEmpty();
    const requests = getItem(STORAGE_KEYS.REQUESTS, []);
    const index = requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Request not found.');

    if (requests[index].status === 'accepted') {
      throw new Error('This request has already been accepted by another donor.');
    }

    requests[index].status = 'accepted';
    requests[index].acceptedBy = donorUser.id;
    requests[index].acceptedByName = donorUser.institutionName || donorUser.contactName;
    requests[index].acceptedByPhone = donorUser.phone;
    requests[index].acceptedAt = new Date().toISOString();

    setItem(STORAGE_KEYS.REQUESTS, requests);

    // Return the request with shelter contact info revealed
    const users = await authService.listUsers();
    const receiver = users.find((u) => u.id === requests[index].receiverId);

    return {
      ...requests[index],
      receiverName: receiver ? (receiver.institutionName || receiver.contactName) : 'Community Shelter',
      receiverContactName: receiver?.contactName || '',
      receiverPhone: receiver?.phone || '+91 94951 88220',
    };
  },

  /**
   * Deletes a request.
   */
  async deleteRequest(id) {
    initializeStorageIfEmpty();
    const requests = getItem(STORAGE_KEYS.REQUESTS, []);
    const filtered = requests.filter((r) => r.id !== id);
    setItem(STORAGE_KEYS.REQUESTS, filtered);
    return true;
  },
};

