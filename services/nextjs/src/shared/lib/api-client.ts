// API client with automatic cookie handling (credentials: 'include')

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include', // Automatically include cookies
  })
}

export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await apiFetch(url)
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  return response.json()
}

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  return response.json()
}

export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  return response.json()
}

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  return response.json()
}

export const apiPostFormData = async <T>(url: string, formData: FormData): Promise<T> => {
  const response = await apiFetch(url, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }
  return response.json()
}

