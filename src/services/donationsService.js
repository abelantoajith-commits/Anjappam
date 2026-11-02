/**
 * Service for managing Food Donations.
 * Reads and writes through the storage service.
 */

import { getItem, setItem, STORAGE_KEYS, initializeStorageIfEmpty } from './storage';
import { authService } from './authService';

/**
 * Checks if a donation's pickup time has passed.
 */
export function isDonationExpired(dateStr, timeStr) {
  try {
    if (!dateStr) return false;
    // Default to end of day if time is not specified
    const time = timeStr ? (timeStr.length === 5 ? `${timeStr}:00` : timeStr) : '23:59:59';
    const donationDate = new Date(`${dateStr}T${time}`);
    return !isNaN(donationDate.getTime()) && donationDate.getTime() < Date.now();
  } catch (err) {
    return false;
  }
}

export const donationsService = {
  /**
   * Retrieves all donations, dynamically annotating expiry.
   */
  async listDonations() {
    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);
    const users = await authService.listUsers();
    const userMap = new Map(users.map((u) => [u.id, u]));

    const ratings = getItem(STORAGE_KEYS.RATINGS, []);
    const ratingMap = new Map();
    ratings.forEach((r) => {
      if (!ratingMap.has(r.donorId)) ratingMap.set(r.donorId, []);
      ratingMap.get(r.donorId).push(Number(r.stars) || 0);
    });

    return donations.map((donation) => {
      const donor = userMap.get(donation.donorId);
      const isExpired = donation.status === 'available' && isDonationExpired(donation.date, donation.time);
      const donorStars = ratingMap.get(donation.donorId) || [];
      const donorRatingCount = donorStars.length;
      const donorAverageRating = donorRatingCount > 0
        ? Number((donorStars.reduce((a, b) => a + b, 0) / donorRatingCount).toFixed(1))
        : null;

      return {
        ...donation,
        status: isExpired ? 'expired' : donation.status,
        donorName: donor ? (donor.institutionName || donor.contactName) : 'Kind Donor',
        donorContactName: donor?.contactName || '',
        donorPhone: donor?.phone || '+91 98471 23456',
        donorAverageRating,
        donorRatingCount,
      };
    });
  },

  /**
   * Retrieves only currently available, non-expired donations for receivers.
   */
  async listAvailableDonations() {
    const all = await this.listDonations();
    return all.filter((d) => d.status === 'available');
  },

  /**
   * Retrieves donations posted by a specific donor.
   */
  async getDonationsByDonor(donorId) {
    const all = await this.listDonations();
    return all.filter((d) => d.donorId === donorId);
  },

  /**
   * Adds a new donation.
   */
  async addDonation({ donorId, item, quantity, unit, date, time, location }) {
    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);

    const newDonation = {
      id: `don_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      donorId,
      item: item.trim(),
      quantity: Number(quantity),
      unit: unit.trim(),
      date,
      time,
      location: location.trim(),
      status: 'available',
      acceptedBy: null,
      acceptedByName: null,
      acceptedByPhone: null,
      createdAt: new Date().toISOString(),
    };

    donations.unshift(newDonation);
    setItem(STORAGE_KEYS.DONATIONS, donations);
    return newDonation;
  },

  /**
   * Updates an existing donation (only if available).
   */
  async updateDonation(id, updates) {
    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);
    const index = donations.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Donation not found.');

    donations[index] = {
      ...donations[index],
      ...updates,
      item: updates.item ? updates.item.trim() : donations[index].item,
      quantity: updates.quantity ? Number(updates.quantity) : donations[index].quantity,
      unit: updates.unit ? updates.unit.trim() : donations[index].unit,
      location: updates.location ? updates.location.trim() : donations[index].location,
      updatedAt: new Date().toISOString(),
    };

    setItem(STORAGE_KEYS.DONATIONS, donations);
    return donations[index];
  },

  /**
   * Deletes a donation.
   */
  async deleteDonation(id) {
    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);
    const filtered = donations.filter((d) => d.id !== id);
    setItem(STORAGE_KEYS.DONATIONS, filtered);
    return true;
  },

  /**
   * Marks an accepted donation as picked up (completed).
   */
  async markAsPickedUp(id, receiverUser) {
    if (!receiverUser || receiverUser.userType !== 'receiver') {
      throw new Error('Only the receiver who accepted this donation can mark it as picked up.');
    }

    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);
    const index = donations.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Donation not found.');

    const donation = donations[index];
    if (donation.acceptedBy !== receiverUser.id) {
      throw new Error('You can only mark donations you have accepted as picked up.');
    }

    if (donation.status === 'completed') {
      return donation;
    }

    if (donation.status !== 'accepted') {
      throw new Error('Only accepted donations can be marked as picked up.');
    }

    donations[index].status = 'completed';
    donations[index].pickedUpAt = new Date().toISOString();

    setItem(STORAGE_KEYS.DONATIONS, donations);
    return donations[index];
  },

  /**
   * Accepts a donation on behalf of a receiver.
   */
  async acceptDonation(id, receiverUser) {
    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);
    const index = donations.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Donation not found.');

    if (donations[index].status === 'accepted') {
      throw new Error('This donation has already been accepted by another receiver.');
    }

    donations[index].status = 'accepted';
    donations[index].acceptedBy = receiverUser.id;
    donations[index].acceptedByName = receiverUser.institutionName || receiverUser.contactName;
    donations[index].acceptedByPhone = receiverUser.phone;
    donations[index].acceptedAt = new Date().toISOString();

    setItem(STORAGE_KEYS.DONATIONS, donations);

    // Return the updated donation with donor details
    const users = await authService.listUsers();
    const donor = users.find((u) => u.id === donations[index].donorId);

    return {
      ...donations[index],
      donorName: donor ? (donor.institutionName || donor.contactName) : 'Community Kitchen',
      donorContactName: donor?.contactName || '',
      donorPhone: donor?.phone || '+91 98471 23456',
    };
  },
};

