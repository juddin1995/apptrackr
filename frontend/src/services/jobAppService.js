import sendRequest from './sendRequest';

const BASE_URL = '/api/jobApps';

export function createJobApp(jobAppData) {
  return sendRequest(BASE_URL, 'POST', jobAppData);
}

export function getJobApps() {
  return sendRequest(BASE_URL);
}