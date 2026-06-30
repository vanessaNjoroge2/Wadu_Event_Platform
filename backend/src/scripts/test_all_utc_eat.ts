import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';

async function getMpesaAccessToken() {
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
    },
  });
  if (!response.ok) {
    throw new Error(`OAuth failed`);
  }
  const json = await response.json() as any;
  return json.access_token;
}

async function testPush(shortcode: string, passkey: string, timestamp: string, label: string, token: string) {
  console.log(`\n--- Testing: ${label} ---`);
  console.log(`Timestamp: ${timestamp}`);
  
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  const phone = '254769505377';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: 1,
        PartyA: phone,
        PartyB: shortcode,
        PhoneNumber: phone,
        CallBackURL: 'https://every-tables-cut.loca.lt/api/payments/mpesa/callback',
        AccountReference: 'TestCombo',
        TransactionDesc: 'Test Combo',
      }),
    });

    console.log('Status:', response.status);
    const body = await response.json();
    console.log('Body:', body);
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

async function main() {
  const token = await getMpesaAccessToken();
  console.log('Token generated.');

  const globalPasskey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2cbe9';
  const customPasskey = process.env.MPESA_PASSKEY || '';

  const utcNow = new Date();
  const utcTimestamp = utcNow.toISOString().replace(/[-:T]/g, '').slice(0, 14);

  const localNow = new Date();
  const localTimestamp = `${localNow.getFullYear()}${String(localNow.getMonth() + 1).padStart(2, '0')}${String(localNow.getDate()).padStart(2, '0')}${String(localNow.getHours()).padStart(2, '0')}${String(localNow.getMinutes()).padStart(2, '0')}${String(localNow.getSeconds()).padStart(2, '0')}`;

  // Combo 1: Global Passkey + UTC Time
  await testPush('174379', globalPasskey, utcTimestamp, 'Global Passkey + UTC Time', token);

  // Combo 2: Global Passkey + EAT (Local) Time
  await testPush('174379', globalPasskey, localTimestamp, 'Global Passkey + EAT Time', token);

  if (customPasskey) {
    // Combo 3: Custom Passkey + UTC Time
    await testPush('174379', customPasskey, utcTimestamp, 'Custom Passkey + UTC Time', token);

    // Combo 4: Custom Passkey + EAT (Local) Time
    await testPush('174379', customPasskey, localTimestamp, 'Custom Passkey + EAT Time', token);
  }
}

main().catch(console.error);
