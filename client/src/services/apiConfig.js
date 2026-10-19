/**
 * Dynamically resolves the backend API Base URL based on current host.
 * If user accesses via mobile IP (e.g., http://172.18.103.14:3000),
 * requests resolve to http://172.18.103.14:5000 so that phone connectivity works seamlessly.
 */
export const getApiBaseUrl = () => {
  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:5000`;
};
