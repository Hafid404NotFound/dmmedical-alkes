import { analyticsConfig, validateConfig } from "./analytics-config";

export async function verifyAnalyticsSetup() {
  try {
    // Check configuration
    validateConfig();

    // Test API connection
    const response = await fetch(
      `${analyticsConfig.baseUrl}/v1/web/analytics/stats`,
      {
        headers: {
          Authorization: `Bearer ${analyticsConfig.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API test failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Vercel Analytics setup verified successfully:", data);
    return true;
  } catch (error) {
    console.error("Vercel Analytics setup verification failed:", error);
    return false;
  }
}
