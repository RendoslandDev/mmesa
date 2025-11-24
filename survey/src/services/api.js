const API_BASE = 'https://mmesa-server.vercel.app/api';

export async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');

    // Final headers (options.headers can override defaults)
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const method = (options.method || 'GET').toUpperCase();

    // Prepare body: stringify plain objects for JSON, allow FormData as-is
    let body;
    if (method !== 'GET' && options.body !== undefined) {
        if (typeof FormData !== 'undefined' && options.body instanceof FormData) {
            // Let the browser set the Content-Type boundary for FormData
            delete headers['Content-Type'];
            body = options.body;
        } else if (typeof options.body === 'object' && !(options.body instanceof ArrayBuffer)) {
            body = JSON.stringify(options.body);
        } else {
            body = options.body;
        }
    }

    console.log("📤 API Call:", {
        method,
        url: `${API_BASE}${endpoint}`,
        headers,
        body: typeof body === 'string' ? JSON.parseSafe?.(body) ?? body : body
    });

    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        // only include body if defined
        ...(body !== undefined ? { body } : {})
    });

    console.log("📥 Response Status:", response.status);

    if (!response.ok) {
        // try to parse error body if JSON
        let errText = `HTTP error! status: ${response.status}`;
        try {
            const json = await response.json();
            errText += ` - ${JSON.stringify(json)}`;
        } catch (e) {
            // ignore parse errors
        }
        throw new Error(errText);
    }

    // No content
    if (response.status === 204) {
        return null;
    }

    // Safely parse JSON if content-type indicates JSON, otherwise return text
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const data = await response.json();
        console.log("✅ Response Data:", data);
        return data;
    } else {
        const text = await response.text();
        console.log("✅ Response Text:", text);
        return text;
    }
}
