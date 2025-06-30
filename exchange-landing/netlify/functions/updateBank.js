// updateBank.js - 관리자 계좌/수수료/공지 수정 Lambda 
const fs = require('fs');
const path = require('path');

exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }
  const filePath = path.join(__dirname, '../../config.json');
  if (event.httpMethod === 'GET') {
    try {
      let config = {};
      if (fs.existsSync(filePath)) {
        config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(config)
      };
    } catch (e) {
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: '서버 에러', detail: e.message })
      };
    }
  }
  if (event.httpMethod === 'POST') {
    try {
      const { bank, account, owner, fee, notice } = JSON.parse(event.body);
      if (!bank || !account || !owner || typeof fee === 'undefined') {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: '필수값 누락' })
        };
      }
      const config = { bank, account, owner, fee, notice: notice || '' };
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');
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
  }
  return {
    statusCode: 405,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Method Not Allowed' })
  };
}; 