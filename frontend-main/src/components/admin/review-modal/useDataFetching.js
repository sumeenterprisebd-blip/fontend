import { useState } from "react";
import { usersAPI, productsAPI } from "@/services/api";

export function useDataFetching() {
  const [fetchingData, setFetchingData] = useState(false);

  const fetchUsers = async (setUsers, setError) => {
    setFetchingData(true);
    try {
      const response = await usersAPI.getAllUsers();
      setUsers(response.data.users || response.data || []);
    } catch (error) {
      setError("Failed to load users. Please try again.");
      setUsers([]);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchProducts = async (setProducts, setError) => {
    setFetchingData(true);
    try {
      const response = await productsAPI.getProducts();
      setProducts(response.data.products || response.data || []);
    } catch (error) {
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setFetchingData(false);
    }
  };

  return { fetchingData, fetchUsers, fetchProducts };
}
