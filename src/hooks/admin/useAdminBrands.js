import { useState, useEffect, useCallback } from "react";
import { brandsAPI } from "@/services/api";

export default function useAdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
  });

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await brandsAPI.getAllBrands();
      setBrands(response.data.brands || []);
    } catch (error) {
      setShowAlert({
        show: true,
        message: "Error fetching brands",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleAddBrand = useCallback(() => {
    setEditingBrand(null);
    setFormData({ name: "", logo: "" });
    setShowModal(true);
  }, []);

  const handleEditBrand = useCallback((brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || "",
      logo: brand.logo || "",
    });
    setShowModal(true);
  }, []);

  const handleDeleteBrand = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this brand?"))
        return;

      try {
        await brandsAPI.deleteBrand(id);
        setShowAlert({
          show: true,
          message: "Brand deleted successfully",
          type: "success",
        });
        fetchBrands();
      } catch (error) {
        setShowAlert({
          show: true,
          message: error.response?.data?.message || "Error deleting brand",
          type: "error",
        });
      }
    },
    [fetchBrands]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLogoUpdate = useCallback((imageUrl) => {
    setFormData((prev) => ({ ...prev, logo: imageUrl }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const brandData = {
          name: formData.name,
          logo: formData.logo,
          isActive: true,
          displayOrder: 0,
        };

        if (editingBrand) {
          await brandsAPI.updateBrand(editingBrand._id, brandData);
          setShowAlert({
            show: true,
            message: "Brand updated successfully",
            type: "success",
          });
        } else {
          await brandsAPI.createBrand(brandData);
          setShowAlert({
            show: true,
            message: "Brand created successfully",
            type: "success",
          });
        }

        setShowModal(false);
        fetchBrands();
      } catch (error) {
        setShowAlert({
          show: true,
          message: error.response?.data?.message || "Error saving brand",
          type: "error",
        });
      }
    },
    [formData, editingBrand, fetchBrands]
  );

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const closeAlert = useCallback(() => {
    setShowAlert({ show: false, message: "", type: "success" });
  }, []);

  return {
    brands,
    loading,
    showModal,
    editingBrand,
    showAlert,
    formData,
    handleAddBrand,
    handleEditBrand,
    handleDeleteBrand,
    handleInputChange,
    handleLogoUpdate,
    handleSubmit,
    closeModal,
    closeAlert,
  };
}
