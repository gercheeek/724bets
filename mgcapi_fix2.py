import re

filename = 'mgcapi.cjs'
with open(filename, 'r') as f:
    content = f.read()

# Update getLaunchUrl payload
old_launch = """    const payload = {
        app_id: APP_ID,
        game_id: gameCode,
        player_id: userCode,
        currency: 'TRY', // Default currency
        language: 'tr'
    };"""

new_launch = """    const payload = {
        app_id: APP_ID,
        game_id: gameCode,
        player_id: userCode,
        player_token: Buffer.from(JSON.stringify({ player_id: userCode })).toString('base64'),
        currency: 'TRY', // Default currency
        language: 'tr',
        request_time: Date.now(),
        exit: 'https://724bets.net/',
        urls: {
            base_url: 'https://724bets.net',
            wallet_url: 'https://724bets.net/api/casino/callback/api',
            other_url: 'https://724bets.net'
        }
    };"""

if old_launch in content:
    content = content.replace(old_launch, new_launch)

# Add updateWebhook function
webhook_func = """
/**
 * Update the webhook URL on MGCAPI
 */
async function updateWebhook() {
    console.log('[MGCAPI] Updating webhook URL...');
    const endpoint = `${API_URL}/api/v1/webhook-url-update`;
    const params = {
        app_id: APP_ID,
        request_time: Date.now().toString(),
        webhook_url: 'https://724bets.net/api/casino/callback/api'
    };

    const concatenated = Object.entries(params)
        .filter(([key]) => key !== 'sign')
        .map(([, value]) => value)
        .join('');
    const encoded = encodeURIComponent(concatenated);
    params.sign = crypto.createHmac('md5', APP_KEY).update(encoded).digest('hex');

    const queryString = new URLSearchParams(params).toString();
    
    try {
        const resObj = await fetch(`${endpoint}?${queryString}`, { method: 'POST' });
        const data = await resObj.json();
        console.log('[MGCAPI] Webhook update response:', data);
        return data;
    } catch (err) {
        console.error('[MGCAPI] Error updating webhook:', err);
    }
}
"""

if "async function updateWebhook" not in content:
    content = content.replace("module.exports = {", webhook_func + "\nmodule.exports = {\n    updateWebhook,")

with open(filename, 'w') as f:
    f.write(content)
print("mgcapi.cjs updated with webhook registration and extended payload")
