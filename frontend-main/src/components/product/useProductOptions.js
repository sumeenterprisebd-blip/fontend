import { useMemo } from "react";
import { filterColors } from "@/components/data/shopFiltersData";

export function useProductOptions(product) {
  // Get available colors from product or fallback
  const availableColors = useMemo(() => {
    if (!product) return [];

    if (
      product.colors &&
      Array.isArray(product.colors) &&
      product.colors.length > 0
    ) {
      return product.colors.map((color) => {
        if (typeof color === "object" && color.name) {
          return {
            name: color.name,
            hex: color.hex || "#cccccc",
          };
        }

        const colorName = typeof color === "string" ? color : String(color);
        const colorObj = filterColors.find(
          (c) => c.name.toLowerCase() === colorName.toLowerCase()
        );
        return colorObj || { name: colorName, hex: "#cccccc" };
      });
    }

    return filterColors.slice(0, 3);
  }, [product]);

  // Get available sizes from product
  const availableSizes = useMemo(() => {
    if (!product) return [];

    if (
      product.sizes &&
      Array.isArray(product.sizes) &&
      product.sizes.length > 0
    ) {
      return product.sizes;
    }

    return ["S", "M", "L", "XL"];
  }, [product]);

  return { availableColors, availableSizes };
}

