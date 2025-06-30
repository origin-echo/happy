const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async function(event) {
  try {
    const { name, phone, gift, amount } = JSON.parse(event.body);
    await base('exchange_history').create([
      { fields: { name, phone, gift, amount, date: new Date().toISOString() } }
    ]);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Airtable 저장 에러', detail: e.message }) };
  }
}; 