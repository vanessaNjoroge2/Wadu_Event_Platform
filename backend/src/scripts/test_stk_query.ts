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

async function main() {
  const token = await getMpesaAccessToken();
  console.log('Token generated.');

  const shortcode = process.env.MPESA_SHORTCODE || '174379';
  const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
  const phone = '254769505377';

  console.log('\n1. Initiating STK Push...');
  const pushRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
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
      CallBackURL: 'https://example.com/callback',
      AccountReference: 'TestQuery',
      TransactionDesc: 'Test Query',
    }),
  });

  const pushJson = await pushRes.json() as any;
  console.log('STK Push Response:', pushJson);

  if (!pushJson.CheckoutRequestID) {
    console.error('Failed to get CheckoutRequestID');
    return;
  }

  const checkoutRequestId = pushJson.CheckoutRequestID;

  console.log('\n2. Querying STK Push status immediately (0s)...');
  await queryStatus(token, shortcode, passkey, checkoutRequestId);

  console.log('\nWaiting 5 seconds...');
  await new Promise(r => setTimeout(r, 5000));

  console.log('\n3. Querying STK Push status after 5s...');
  await queryStatus(token, shortcode, passkey, checkoutRequestId);
}

async function queryStatus(token: string, shortcode: string, passkey: string, checkoutRequestId: string) {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const queryRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  console.log('Query HTTP Status:', queryRes.status);
  const queryJson = await queryRes.json();
  console.log('Query Response Body:', JSON.stringify(queryJson, null, 2));
}

main().catch(console.error);
