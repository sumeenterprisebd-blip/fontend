import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI, ordersAPI } from '@/services/api';

export function useProfile() {
  const { user: authUser, updateUser, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [accountStats, setAccountStats] = useState({
    memberSince: null,
    totalOrders: 0,
  });
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    townCity: '',
    state: '',
    zipCode: '',
    country: '',
    avatarUrl: null,
    googleId: null,
    role: 'user',
    isEmailVerified: false,
    createdAt: null,
  });
  const [originalData, setOriginalData] = useState({});

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Get user profile from API
        const profileResponse = await usersAPI.getProfile();
        const userData = profileResponse.data.user || authUser || {};
        
        // Get default address if available
        const defaultAddress = userData.addresses?.find(addr => addr.isDefault) || userData.addresses?.[0] || {};
        
        // Fetch orders to get total count
        let totalOrders = 0;
        try {
          const ordersResponse = await ordersAPI.getOrders();
          totalOrders = ordersResponse.data.orders?.length || 0;
        } catch (err) {
          // If orders API fails, continue without it
        }

        const formattedData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          streetAddress: defaultAddress.streetAddress || '',
          townCity: defaultAddress.townCity || '',
          state: defaultAddress.state || '',
          zipCode: defaultAddress.zipCode || '',
          country: defaultAddress.country || '',
          avatarUrl: userData.avatar || null,
          googleId: userData.googleId || null,
          role: userData.role || 'user',
          isEmailVerified: userData.isEmailVerified || false,
          createdAt: userData.createdAt || null,
        };

        setProfileData(formattedData);
        setOriginalData({ ...formattedData });
        
        // Format member since date
        const memberSince = userData.createdAt 
          ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : 'N/A';
        
        setAccountStats({
          memberSince,
          totalOrders,
        });
      } catch (error) {
        
        // Fallback to auth user data if API fails
        if (authUser) {
          const fallbackData = {
            firstName: authUser.firstName || '',
            lastName: authUser.lastName || '',
            email: authUser.email || '',
            phone: authUser.phone || '',
            streetAddress: '',
            townCity: '',
            state: '',
            zipCode: '',
            country: '',
            avatarUrl: authUser.avatar || null,
            googleId: authUser.googleId || null,
            role: authUser.role || 'user',
            isEmailVerified: authUser.isEmailVerified || false,
            createdAt: authUser.createdAt || null,
          };
          setProfileData(fallbackData);
          setOriginalData({ ...fallbackData });
          
          // Format member since from auth user
          const memberSince = authUser.createdAt 
            ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            : 'N/A';
          
          setAccountStats({
            memberSince,
            totalOrders: 0,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [authUser]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!profileData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (profileData.phone && !/^[\d\s\-\+\(\)]+$/.test(profileData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAvatarChange = (newAvatarUrl) => {
    setProfileData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
  };

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setErrors({});
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.focus();
      return;
    }

    setIsSaving(true);
    
    try {
      // Update profile via API
      await usersAPI.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        avatar: profileData.avatarUrl,
      });

      // Update address if provided
      if (profileData.streetAddress || profileData.townCity) {
        const addressData = {
          streetAddress: profileData.streetAddress,
          townCity: profileData.townCity,
          state: profileData.state,
          zipCode: profileData.zipCode,
          country: profileData.country,
          isDefault: true,
        };

        // Check if user has existing addresses
        try {
          const profileResponse = await usersAPI.getProfile();
          const userData = profileResponse.data.user;
          
          if (userData.addresses && userData.addresses.length > 0) {
            // Update existing default address
            const defaultAddress = userData.addresses.find(addr => addr.isDefault);
            if (defaultAddress) {
              await usersAPI.updateAddress(defaultAddress._id, addressData);
            } else {
              await usersAPI.addAddress(addressData);
            }
          } else {
            await usersAPI.addAddress(addressData);
          }
        } catch (addrError) {
        }
      }

      // Refresh profile data from server to get updated info
      const profileResponse = await usersAPI.getProfile();
      const updatedUserData = profileResponse.data.user || {};
      
      // Get default address if available
      const defaultAddress = updatedUserData.addresses?.find(addr => addr.isDefault) || updatedUserData.addresses?.[0] || {};
      
      // Update local profile data state
      const updatedProfileData = {
        firstName: updatedUserData.firstName || '',
        lastName: updatedUserData.lastName || '',
        email: updatedUserData.email || '',
        phone: updatedUserData.phone || '',
        streetAddress: defaultAddress.streetAddress || '',
        townCity: defaultAddress.townCity || '',
        state: defaultAddress.state || '',
        zipCode: defaultAddress.zipCode || '',
        country: defaultAddress.country || '',
        avatarUrl: updatedUserData.avatar || null,
        googleId: updatedUserData.googleId || null,
        role: updatedUserData.role || 'user',
        isEmailVerified: updatedUserData.isEmailVerified || false,
        createdAt: updatedUserData.createdAt || null,
      };
      
      setProfileData(updatedProfileData);
      setOriginalData({ ...updatedProfileData });
      
      // Update AuthContext with new user data (this will update all components using AuthContext)
      updateUser({
        firstName: updatedUserData.firstName || profileData.firstName,
        lastName: updatedUserData.lastName || profileData.lastName,
        phone: updatedUserData.phone || profileData.phone,
        avatar: updatedUserData.avatar || profileData.avatarUrl,
      });
      
      setIsEditing(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to save profile. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setErrors({});
    setIsEditing(false);
  };

  return {
    profileData,
    accountStats,
    isEditing,
    isSaving,
    loading,
    showSuccessAlert,
    errors,
    handleInputChange,
    handleAvatarChange,
    handleEdit,
    handleSave,
    handleCancel,
    setShowSuccessAlert
  };
}

