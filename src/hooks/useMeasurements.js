import { useState, useEffect, useCallback } from "react";
import { measurementsAPI } from "@/services/api";

export function useMeasurements(options = {}) {
    const { initialMeasurements = [], enabled = true, refreshOnMount = false } = options;
    const initialList = Array.isArray(initialMeasurements) ? initialMeasurements : [];
    const [measurements, setMeasurements] = useState(initialList);
    const [loading, setLoading] = useState(initialList.length === 0);
    const [error, setError] = useState(null);

    const fetchMeasurements = useCallback(async () => {
        try {
            if (initialList.length === 0) setLoading(true);
            setError(null);
            const response = await measurementsAPI.getMeasurements();
            const apiMeasurements = response.data.measurements || [];

            setMeasurements(
                apiMeasurements.map((measurement) => ({
                    id: measurement._id || measurement.id,
                    name: measurement.name,
                    fields: Array.isArray(measurement.fields) ? measurement.fields : [],
                }))
            );
        } catch (err) {
            setError(err.message || "Failed to fetch measurements");
            setMeasurements([]);
        } finally {
            setLoading(false);
        }
    }, [initialList.length]);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return undefined;
        }

        if (initialList.length > 0 && !refreshOnMount) {
            setLoading(false);
            return undefined;
        }

        fetchMeasurements();
    }, [fetchMeasurements, enabled, initialList.length, refreshOnMount]);

    return { measurements, loading, error, refresh: fetchMeasurements };
}
