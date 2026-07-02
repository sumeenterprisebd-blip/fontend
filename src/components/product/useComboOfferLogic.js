import { useState, useEffect, useCallback } from "react";
import { likesAPI } from "@/services/api";

const defaultComboStatus = (quantity, likeCount) => ({
  success: true,
  comboApplied: false,
  reason: "Combo offer temporarily unavailable",
  settings: { minQuantity: 2, minLikes: 2 },
  current: { quantity: quantity || 1, likeCount: likeCount || 0 },
  quantityQualifies: false,
  likesQualify: false,
});

export default function useComboOfferLogic(productId, quantity, onComboUpdate) {
  const [likeCount, setLikeCount] = useState(0);
  const [canLikeMore, setCanLikeMore] = useState(true);
  const [maxLikes, setMaxLikes] = useState(5);
  const [comboStatus, setComboStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const fetchLikeCount = useCallback(async () => {
    try {
      const response = await likesAPI.getLikeCount(productId);
      if (response.data.success) {
        setLikeCount(response.data.likeCount);
        setCanLikeMore(response.data.canLikeMore);
        setMaxLikes(response.data.maxLikes);
      }
    } catch (error) {
      setLikeCount(0);
      setCanLikeMore(true);
      setMaxLikes(5);
    }
  }, [productId]);

  const checkComboOffer = useCallback(async () => {
    if (!productId || typeof productId !== "string" || productId.trim() === "")
      return;

    try {
      setLoading(true);
      const response = await likesAPI.checkComboOffer({
        productId,
        quantity: quantity || 1,
      });

      if (response.data?.success) {
        setComboStatus(response.data);
        onComboUpdate?.(response.data.comboApplied);
      } else {
        setComboStatus(defaultComboStatus(quantity, likeCount));
      }
    } catch (error) {
      setComboStatus(defaultComboStatus(quantity, likeCount));
      onComboUpdate?.(false);
    } finally {
      setLoading(false);
    }
  }, [productId, quantity, likeCount, onComboUpdate]);

  const handleLike = async () => {
    if (isLiking || !canLikeMore) return;

    try {
      setIsLiking(true);
      setShowAnimation(true);

      const response = await likesAPI.likeProduct(productId);

      if (response.data.success) {
        setLikeCount(response.data.likeCount);
        setCanLikeMore(response.data.canLikeMore);
        await checkComboOffer();
        setTimeout(() => setShowAnimation(false), 600);
      }
    } catch (error) {
      setShowAnimation(false);
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    fetchLikeCount();
  }, [fetchLikeCount]);

  useEffect(() => {
    checkComboOffer();
  }, [checkComboOffer]);

  return {
    likeCount,
    maxLikes,
    canLikeMore,
    comboStatus,
    loading,
    isLiking,
    showAnimation,
    handleLike,
  };
}
