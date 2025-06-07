export interface AnalyticsConfig {
  baseUrl: string;
  token: string;
  projectId: string;
  environment: string;
}

export const analyticsConfig: AnalyticsConfig = {
  baseUrl: "https://api.vercel.com",
  token: process.env.VERCEL_API_TOKEN || "",
  projectId: process.env.VERCEL_PROJECT_ID || "",
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
};

export const getApiHeaders = () => ({
  Authorization: `Bearer ${analyticsConfig.token}`,
  "Content-Type": "application/json",
});

export const validateConfig = () => {
  if (!analyticsConfig.token) {
    throw new Error("VERCEL_API_TOKEN is not configured");
  }
  if (!analyticsConfig.projectId) {
    throw new Error("VERCEL_PROJECT_ID is not configured");
  }
  return true;
};

export const isAnalyticsEnabled = () => {
  try {
    return validateConfig();
  } catch {
    return false;
  }
};
