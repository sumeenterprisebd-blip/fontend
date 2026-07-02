import { useState } from "react";

export function useHeroActions(heroManager, setShowAlert) {
  const [showModal, setShowModal] = useState(false);
  const [editingHero, setEditingHero] = useState(null);

  const handleOpenModal = () => {
    setEditingHero(null);
    setShowModal(true);
  };

  const handleEdit = (hero) => {
    setEditingHero(hero);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHero(null);
  };

  const handleSubmit = async (formData) => {
    const result = editingHero
      ? await heroManager.updateHero(editingHero._id, formData)
      : await heroManager.createHero(formData);

    setShowAlert({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });

    if (result.success) {
      handleCloseModal();
    }

    return result.success;
  };

  const handleDelete = async (id) => {
    if (!id) {
      setShowAlert({
        show: true,
        message: "Invalid hero ID. Please refresh and try again.",
        type: "error",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this hero slide?")) return;
    const result = await heroManager.deleteHero(id);
    setShowAlert({
      show: true,
      message: result.message,
      type: result.success ? "success" : "error",
    });
    // Always refresh hero list after delete
    await heroManager.fetchHeroes();
  };

  const handleToggleStatus = async (hero) => {
    if (!hero || !hero._id) {
      setShowAlert({
        show: true,
        message: "Invalid hero. Please refresh and try again.",
        type: "error",
      });
      return;
    }
    const result = await heroManager.toggleHeroStatus(hero._id);
    setShowAlert({
      show: true,
      message:
        result.message ||
        `Hero slide ${hero.isActive ? "deactivated" : "activated"
        } successfully`,
      type: result.success ? "success" : "error",
    });
    // Always refresh hero list after toggle
    await heroManager.fetchHeroes();
  };

  const handlePriorityChange = async (hero, direction) => {
    if (!hero || !hero._id) {
      setShowAlert({
        show: true,
        message: "Invalid hero. Please refresh and try again.",
        type: "error",
      });
      return;
    }
    const newPriority =
      direction === "up" ? hero.priority + 1 : hero.priority - 1;
    if (newPriority < 0) return;

    const result = await heroManager.updateHeroPriority(hero._id, newPriority);
    if (!result.success) {
      setShowAlert({
        show: true,
        message: result.message,
        type: "error",
      });
    }
    // Always refresh hero list after priority change
    await heroManager.fetchHeroes();
  };

  return {
    showModal,
    editingHero,
    handleOpenModal,
    handleEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleToggleStatus,
    handlePriorityChange,
  };
}
