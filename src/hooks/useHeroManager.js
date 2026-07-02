import { useState, useEffect } from "react";
import { heroesAPI } from "@/services/api";
import { getErrorMessage } from "@/utils/validation";

/**
 * Custom hook for managing hero slides
 * Handles all hero CRUD operations and state management
 */
export const useHeroManager = () => {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [networkError, setNetworkError] = useState(false);

  // Fetch all heroes
  const fetchHeroes = async () => {
    try {
      setLoading(true);
      setError(null);
      setNetworkError(false);

      const response = await heroesAPI.getHeroes();

      if (response.data.success) {
        setHeroes(response.data.data);
      }
    } catch (err) {
      const errorMsg = getErrorMessage(err);

      if (!err.response) {
        setNetworkError(true);
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create new hero
  const createHero = async (heroData) => {
    try {
      await heroesAPI.createHero(heroData);
      await fetchHeroes();
      return { success: true, message: "Hero slide created successfully" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to create hero slide",
      };
    }
  };

  // Update existing hero
  const updateHero = async (id, heroData) => {
    try {
      await heroesAPI.updateHero(id, heroData);
      await fetchHeroes();
      return { success: true, message: "Hero slide updated successfully" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update hero slide",
      };
    }
  };

  // Delete hero
  const deleteHero = async (id) => {
    try {
      await heroesAPI.deleteHero(id);
      await fetchHeroes();
      return { success: true, message: "Hero slide deleted successfully" };
    } catch (err) {
      return {
        success: false,
        message: "Failed to delete hero slide",
      };
    }
  };

  // Toggle hero status
  const toggleHeroStatus = async (id) => {
    try {
      await heroesAPI.toggleStatus(id);
      await fetchHeroes();
      return { success: true, message: "Hero status updated successfully" };
    } catch (err) {
      return {
        success: false,
        message: "Failed to toggle status",
      };
    }
  };

  // Update hero priority
  const updateHeroPriority = async (id, newPriority) => {
    try {
      await heroesAPI.updatePriority(id, newPriority);
      await fetchHeroes();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: "Failed to update priority",
      };
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchHeroes();
  }, []);

  return {
    heroes,
    loading,
    error,
    networkError,
    fetchHeroes,
    createHero,
    updateHero,
    deleteHero,
    toggleHeroStatus,
    updateHeroPriority,
  };
};
