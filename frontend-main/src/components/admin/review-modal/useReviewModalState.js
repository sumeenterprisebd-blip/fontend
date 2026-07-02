import { useState, useEffect, useCallback } from "react";
import { useDataFetching } from "./useDataFetching";

export default function useReviewModalState(isOpen, step, userSelectionMode) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [autoApprove, setAutoApprove] = useState(true);
  const [error, setError] = useState("");

  const { fetchingData, fetchUsers: rawFetchUsers, fetchProducts: rawFetchProducts } = useDataFetching();

  // Wrap fetchUsers and fetchProducts in useCallback to avoid unnecessary re-renders and fix exhaustive-deps warning
  const fetchUsers = useCallback(rawFetchUsers, [rawFetchUsers]);
  const fetchProducts = useCallback(rawFetchProducts, [rawFetchProducts]);

  useEffect(() => {
    if (isOpen && step === 1 && userSelectionMode === "existing") {
      fetchUsers(setUsers, setError);
    }
  }, [isOpen, step, userSelectionMode, fetchUsers]);

  useEffect(() => {
    if (isOpen && step === 2) {
      fetchProducts(setProducts, setError);
    }
  }, [isOpen, step, fetchProducts]);

  const resetState = () => {
    setSelectedUser(null);
    setNewUserFirstName("");
    setNewUserLastName("");
    setNewUserEmail("");
    setSelectedProduct(null);
    setRating(0);
    setComment("");
    setAutoApprove(true);
    setError("");
  };

  return {
    users,
    products,
    selectedUser,
    setSelectedUser,
    newUserFirstName,
    setNewUserFirstName,
    newUserLastName,
    setNewUserLastName,
    newUserEmail,
    setNewUserEmail,
    selectedProduct,
    setSelectedProduct,
    rating,
    setRating,
    comment,
    setComment,
    autoApprove,
    setAutoApprove,
    error,
    setError,
    fetchingData,
    resetState,
  };
}
