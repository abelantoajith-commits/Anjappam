import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { donationsService } from '../services/donationsService';
import { requestsService } from '../services/requestsService';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshDonations = useCallback(async () => {
    try {
      const data = await donationsService.listDonations();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  }, []);

  const refreshRequests = useCallback(async () => {
    try {
      const data = await requestsService.listRequests();
      setRequests(data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([refreshDonations(), refreshRequests()]);
    setLoading(false);
  }, [refreshDonations, refreshRequests]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const addDonation = async (data) => {
    const created = await donationsService.addDonation(data);
    await refreshDonations();
    return created;
  };

  const updateDonation = async (id, updates) => {
    const updated = await donationsService.updateDonation(id, updates);
    await refreshDonations();
    return updated;
  };

  const deleteDonation = async (id) => {
    const res = await donationsService.deleteDonation(id);
    await refreshDonations();
    return res;
  };

  const acceptDonation = async (id, receiverUser) => {
    const updated = await donationsService.acceptDonation(id, receiverUser);
    await refreshDonations();
    return updated;
  };

  const addRequest = async (data) => {
    const created = await requestsService.addRequest(data);
    await refreshRequests();
    return created;
  };

  const acceptRequest = async (id, donorUser) => {
    const updated = await requestsService.acceptRequest(id, donorUser);
    await refreshRequests();
    return updated;
  };

  const deleteRequest = async (id) => {
    const res = await requestsService.deleteRequest(id);
    await refreshRequests();
    return res;
  };

  // Dynamically compute impact stats based on PRD §8.1
  const impactStats = useMemo(() => {
    const baseMeals = 5420;
    const acceptedDonationMeals = donations
      .filter((d) => d.status === 'accepted')
      .reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    const acceptedRequestMeals = requests
      .filter((r) => r.status === 'accepted')
      .reduce((acc, curr) => acc + (Number(curr.numberOfPeople) || 0), 0);
    
    const totalMealsShared = baseMeals + acceptedDonationMeals + acceptedRequestMeals;

    return {
      mealsShared: totalMealsShared,
      activeDonors: 128 + donations.length,
      receivingInstitutions: 45 + requests.length,
      districtsServed: 14,
    };
  }, [donations, requests]);

  return (
    <DataContext.Provider
      value={{
        donations,
        requests,
        loading,
        refreshDonations,
        refreshRequests,
        refreshAll,
        addDonation,
        updateDonation,
        deleteDonation,
        acceptDonation,
        addRequest,
        acceptRequest,
        deleteRequest,
        impactStats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

