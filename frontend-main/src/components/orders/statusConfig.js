import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { HiCheckCircle } from "react-icons/hi";

export const statusConfig = {
  placed: {
    label: "Order Placed",
    icon: FiPackage,
    color: "blue",
    description: "Your order has been received",
  },
  confirmed: {
    label: "Confirmed",
    icon: HiCheckCircle,
    color: "green",
    description: "Order confirmed by seller",
  },
  picked_up: {
    label: "Picked Up",
    icon: FiTruck,
    color: "purple",
    description: "Picked up by delivery partner",
  },
  in_transit: {
    label: "In Transit",
    icon: FiTruck,
    color: "indigo",
    description: "Package is on the way",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: FiTruck,
    color: "orange",
    description: "Out for delivery to your address",
  },
  delivered: {
    label: "Delivered",
    icon: FiCheckCircle,
    color: "green",
    description: "Successfully delivered",
  },
  cancelled: {
    label: "Cancelled",
    icon: FiXCircle,
    color: "red",
    description: "Order has been cancelled",
  },
  failed: {
    label: "Delivery Failed",
    icon: FiXCircle,
    color: "red",
    description: "Delivery attempt failed",
  },
};

export const orderSteps = [
  "placed",
  "confirmed",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export const getColorClasses = (color, status) => {
  if (status === "cancelled") {
    return {
      bg: "bg-gray-100",
      text: "text-gray-400",
      border: "border-gray-300",
      line: "bg-gray-300",
    };
  }

  const colors = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-500",
      line: "bg-blue-500",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-500",
      line: "bg-green-500",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-500",
      line: "bg-purple-500",
    },
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      border: "border-indigo-500",
      line: "bg-indigo-500",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      border: "border-orange-500",
      line: "bg-orange-500",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
      border: "border-red-500",
      line: "bg-red-500",
    },
  };

  return colors[color] || colors.blue;
};
