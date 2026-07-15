const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export function isCloudConfigured() {
  return Boolean(API_URL && !API_URL.includes('YOUR_DEPLOYMENT_ID'))
}

async function request(payload) {
  if (!isCloudConfigured()) return { success: false, offline: true }
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Cloud API error: ${response.status}`)
  return response.json()
}

export async function registerPlayer(player) {
  return request({ action: 'registerPlayer', ...player })
}

export async function syncProgress(progress) {
  return request({ action: 'syncProgress', progress })
}

export async function fetchDashboard() {
  if (!isCloudConfigured()) return { success: false, offline: true, records: [] }
  const response = await fetch(`${API_URL}?action=getDashboard&t=${Date.now()}`)
  if (!response.ok) throw new Error(`Cloud API error: ${response.status}`)
  return response.json()
}
