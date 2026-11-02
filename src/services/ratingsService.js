/**
 * Service for managing Donor Ratings & Reviews.
 * UI components must never touch localStorage directly.
 */

import { getItem, setItem, STORAGE_KEYS, initializeStorageIfEmpty } from './storage';
import { authService } from './authService';

export const ratingsService = {
  /**
   * Retrieves all ratings from storage.
   */
  async listAllRatings() {
    initializeStorageIfEmpty();
    return getItem(STORAGE_KEYS.RATINGS, []);
  },

  /**
   * Retrieves a single rating by donation ID.
   */
  async getRatingByDonation(donationId) {
    const ratings = await this.listAllRatings();
    return ratings.find((r) => r.donationId === donationId) || null;
  },

  /**
   * Retrieves all ratings for a specific donor, sorted newest first.
   */
  async listRatingsForDonor(donorId) {
    const ratings = await this.listAllRatings();
    return ratings
      .filter((r) => r.donorId === donorId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Computes derived summary metrics for a donor:
   * - averageRating (1 decimal place)
   * - ratingCount
   * - distribution (counts for 5, 4, 3, 2, 1 stars)
   * - completedDonationsCount
   */
  async getDonorSummary(donorId) {
    const ratings = await this.listRatingsForDonor(donorId);
    const count = ratings.length;
    const allDonations = getItem(STORAGE_KEYS.DONATIONS, []);
    const completedDonationsCount = allDonations.filter(
      (d) => d.donorId === donorId && d.status === 'completed'
    ).length;

    if (count === 0) {
      return {
        donorId,
        averageRating: null,
        ratingCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        completedDonationsCount,
      };
    }

    const sum = ratings.reduce((acc, r) => acc + (Number(r.stars) || 0), 0);
    const avg = Number((sum / count).toFixed(1));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach((r) => {
      const s = Math.round(Number(r.stars));
      if (distribution[s] !== undefined) {
        distribution[s] += 1;
      }
    });

    return {
      donorId,
      averageRating: avg,
      ratingCount: count,
      distribution,
      completedDonationsCount,
    };
  },

  /**
   * Lists top donors with at least minRatings (default 3), sorted by averageRating descending.
   */
  async listTopDonors(minRatings = 3, limit = 4) {
    initializeStorageIfEmpty();
    const users = await authService.listUsers();
    const donors = users.filter((u) => u.userType === 'donor');
    const allDonations = getItem(STORAGE_KEYS.DONATIONS, []);

    const summaries = await Promise.all(
      donors.map(async (donor) => {
        const summary = await this.getDonorSummary(donor.id);
        const mealsShared = allDonations
          .filter((d) => d.donorId === donor.id && (d.status === 'completed' || d.status === 'accepted'))
          .reduce((sum, d) => sum + (Number(d.quantity) || 0), 0);
        return {
          ...donor,
          ...summary,
          mealsShared,
        };
      })
    );

    const qualified = summaries
      .filter((s) => s.ratingCount >= minRatings && s.averageRating !== null)
      .sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount);

    return qualified.slice(0, limit);
  },

  /**
   * Adds a new rating for a completed donation.
   * Only logged-in receivers can rate donations they accepted.
   */
  async addRating({ donationId, donorId, receiverUser, stars, comment }) {
    if (!receiverUser || receiverUser.userType !== 'receiver') {
      throw new Error('Only logged-in receivers can rate donations.');
    }

    const starNum = parseInt(stars, 10);
    if (isNaN(starNum) || starNum < 1 || starNum > 5) {
      throw new Error('Rating must be between 1 and 5 stars.');
    }

    const cleanComment = (comment || '').trim().slice(0, 200);

    initializeStorageIfEmpty();
    const donations = getItem(STORAGE_KEYS.DONATIONS, []);
    const donationIndex = donations.findIndex((d) => d.id === donationId);
    if (donationIndex === -1) {
      throw new Error('Donation not found.');
    }

    const donation = donations[donationIndex];
    if (donation.acceptedBy !== receiverUser.id) {
      throw new Error('You can only rate donations that you accepted.');
    }
    if (donation.status !== 'completed') {
      throw new Error('Donation must be marked as picked up before rating.');
    }

    const ratings = getItem(STORAGE_KEYS.RATINGS, []);
    const existing = ratings.find((r) => r.donationId === donationId);
    if (existing) {
      throw new Error('A rating for this donation already exists. Please update it instead.');
    }

    const newRating = {
      id: `rat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      donationId,
      donorId: donorId || donation.donorId,
      receiverId: receiverUser.id,
      receiverName: receiverUser.institutionName || receiverUser.contactName || 'Kind Receiver',
      stars: starNum,
      comment: cleanComment,
      createdAt: new Date().toISOString(),
    };

    ratings.unshift(newRating);
    setItem(STORAGE_KEYS.RATINGS, ratings);

    // Link ratingId to donation
    donations[donationIndex].ratingId = newRating.id;
    setItem(STORAGE_KEYS.DONATIONS, donations);

    return newRating;
  },

  /**
   * Updates an existing rating.
   */
  async updateRating(ratingId, { stars, comment }, receiverUser) {
    if (!receiverUser || receiverUser.userType !== 'receiver') {
      throw new Error('Only logged-in receivers can update ratings.');
    }

    initializeStorageIfEmpty();
    const ratings = getItem(STORAGE_KEYS.RATINGS, []);
    const index = ratings.findIndex((r) => r.id === ratingId);
    if (index === -1) {
      throw new Error('Rating not found.');
    }

    if (ratings[index].receiverId !== receiverUser.id) {
      throw new Error('You can only edit your own ratings.');
    }

    const starNum = parseInt(stars, 10);
    if (isNaN(starNum) || starNum < 1 || starNum > 5) {
      throw new Error('Rating must be between 1 and 5 stars.');
    }

    const cleanComment = (comment || '').trim().slice(0, 200);

    ratings[index] = {
      ...ratings[index],
      stars: starNum,
      comment: cleanComment,
      updatedAt: new Date().toISOString(),
    };

    setItem(STORAGE_KEYS.RATINGS, ratings);
    return ratings[index];
  },
};
