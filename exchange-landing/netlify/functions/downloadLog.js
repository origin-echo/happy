// downloadLog.js - 교환내역 다운로드 Lambda 
const fs = require('fs');
const path = require('path');

function toCSV(data) {
  if (!Array.isArray(data) || data.length === 0) return '';
  const header = Object.keys(data[0]);
  const rows = data.map(row => header.map(h => `"${(row[h]||'').toString().replace(/"/g,'""')}"`).join(','));
  return header.join(',') + '\n' + rows.join('\n');
}

exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  try {
    const filePath = path.join(__dirname, '../../data/exchange-history.json');
    let data = [];
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    const csv = toCSV(data);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="exchange-history.csv"'
      },
      body: csv
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: '서버 에러', detail: e.message })
    };
  }
}; 