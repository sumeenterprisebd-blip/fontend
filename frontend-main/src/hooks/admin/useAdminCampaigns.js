import { useState, useEffect, useCallback } from "react";
import { campaignsAPI } from "@/services/api";
import {
  defaultCampaignFormData,
  mapCampaignToFormData,
} from "@/utils/campaignHelpers";

export default function useAdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [formData, setFormData] = useState(defaultCampaignFormData);

  const fetchCampaigns = useCallback(async () => {
    try {
      const response = await campaignsAPI.getCampaigns();
      if (response.data.success) {
        setCampaigns(response.data.data);
      }
    } catch (error) {
      setShowAlert({
        show: true,
        message: "Failed to fetch campaigns",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleImageUpdate = useCallback((field, imageUrl) => {
    setFormData((prev) => ({ ...prev, [field]: imageUrl }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (
        !formData.title ||
        !formData.bannerImage ||
        !formData.startDate ||
        !formData.endDate
      ) {
        setShowAlert({
          show: true,
          message: "Please fill in all required fields",
          type: "error",
        });
        return;
      }

      try {
        if (editingCampaign) {
          await campaignsAPI.updateCampaign(editingCampaign._id, formData);
          setShowAlert({
            show: true,
            message: "Campaign updated successfully",
            type: "success",
          });
        } else {
          await campaignsAPI.createCampaign(formData);
          setShowAlert({
            show: true,
            message: "Campaign created successfully",
            type: "success",
          });
        }
        fetchCampaigns();
        handleCloseModal();
      } catch (error) {
        setShowAlert({
          show: true,
          message: error.response?.data?.message || "Failed to save campaign",
          type: "error",
        });
      }
    },
    [formData, editingCampaign, fetchCampaigns, handleCloseModal]
  );

  const handleEdit = useCallback((campaign) => {
    setEditingCampaign(campaign);
    setFormData(mapCampaignToFormData(campaign));
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm("Are you sure you want to delete this campaign?")) return;

      try {
        await campaignsAPI.deleteCampaign(id);
        setShowAlert({
          show: true,
          message: "Campaign deleted successfully",
          type: "success",
        });
        fetchCampaigns();
      } catch (error) {
        setShowAlert({
          show: true,
          message: "Failed to delete campaign",
          type: "error",
        });
      }
    },
    [fetchCampaigns]
  );

  const handleToggleStatus = useCallback(
    async (campaign) => {
      try {
        await campaignsAPI.toggleStatus(campaign._id);
        setShowAlert({
          show: true,
          message: `Campaign ${
            campaign.isActive ? "deactivated" : "activated"
          } successfully`,
          type: "success",
        });
        fetchCampaigns();
      } catch (error) {
        setShowAlert({
          show: true,
          message: error.response?.data?.message || "Failed to toggle status",
          type: "error",
        });
      }
    },
    [fetchCampaigns]
  );

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingCampaign(null);
    setFormData(defaultCampaignFormData);
  }, []);

  const closeAlert = useCallback(() => {
    setShowAlert({ show: false, message: "", type: "success" });
  }, []);

  return {
    campaigns,
    loading,
    showModal,
    editingCampaign,
    showAlert,
    formData,
    setShowModal,
    handleInputChange,
    handleImageUpdate,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleStatus,
    handleCloseModal,
    closeAlert,
  };
}
