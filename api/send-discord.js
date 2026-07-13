export default async function handler(req, res) {
  // Set CORS headers for security and preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { webhookUrl, payload } = req.body;

    if (!webhookUrl || !payload) {
      return res.status(400).json({ error: 'Missing webhookUrl or payload' });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: `Discord webhook failed: ${errorText}` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in discord proxy:', error);
    return res.status(500).json({ error: error.message });
  }
}
