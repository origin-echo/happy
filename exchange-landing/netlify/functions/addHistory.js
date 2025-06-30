// addHistory.js - 교환내역 추가 Lambda
const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  try {
    const { name, phone, gift, amount, account } = JSON.parse(event.body);
    if (!name || !phone || !gift || !amount || !account) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: '필수값 누락' })
      };
    }
    const filePath = path.join(__dirname, '../../data/exchange-history.json');
    let data = [];
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    const now = new Date();
    const date = now.toISOString().replace('T', ' ').substring(0, 19);
    data.push({ date, name, phone, gift, amount, account });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: '서버 에러', detail: e.message })
    };
  }
}; 