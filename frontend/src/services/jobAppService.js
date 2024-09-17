import sendRequest from './sendRequest';

const BASE_URL = '/api/jobApps';

export function getJobApps() {
  return sendRequest(BASE_URL);
}

export function createJobApp(jobAppData) {
  return sendRequest(BASE_URL, 'POST', jobAppData);
}

export function updateJobStatus(jobAppId, status) {
  return sendRequest(`${BASE_URL}/${jobAppId}`, 'PUT', { status });
}
