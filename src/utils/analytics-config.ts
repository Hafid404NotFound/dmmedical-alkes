interface AnalyticsConfig {
  apiToken: string;
  projectId: string;
  environment: string;
}

export const analyticsConfig: AnalyticsConfig = {
  apiToken: process.env.VERCEL_API_TOKEN || '',
  projectId: process.env.VERCEL_PROJECT_ID || '',
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'
};

export const isAnalyticsEnabled = () => {
  return Boolean(analyticsConfig.apiToken && analyticsConfig.projectId);
};

export const getApiHeaders = () => ({
  Authorization: `Bearer ${analyticsConfig.apiToken}`,
  'Content-Type': 'application/json',
});
