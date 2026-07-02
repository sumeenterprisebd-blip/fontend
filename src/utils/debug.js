export const checkAPIConnection = async () => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  try {
    const response = await fetch(
      `${API_BASE_URL.replace("/api", "")}/api/health`
    );
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
