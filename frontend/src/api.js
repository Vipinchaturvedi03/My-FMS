/**
 * API Client - Backend se data fetch
 * FMS - Vipin Chaturvedi
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

/**
 * Backend API ko call karein - token automatically attach
 */
export async function apiFetch(apiPath, fetchOptions = {}) {
  const authToken = localStorage.getItem('token');

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(fetchOptions.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${apiPath}`, {
    ...fetchOptions,
    headers: requestHeaders
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Request failed';
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.message) errorMessage = errJson.message;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response;
}
