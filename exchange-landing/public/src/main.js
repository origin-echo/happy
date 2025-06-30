// main.js - 메인 페이지 로직 

document.addEventListener('DOMContentLoaded', () => {
  // 1. 상품권 카드 선택
  const giftCards = document.querySelectorAll('.gift-card');
  let selectedGift = null;
  giftCards.forEach(card => {
    card.addEventListener('click', () => {
      giftCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedGift = card.querySelector('span').textContent;
    });
  });

  // 2. 실수령액 계산기
  const amountInput = document.getElementById('gift-amount');
  const feeInput = document.getElementById('fee-rate');
  const transferInput = document.getElementById('transfer-fee');
  const resultAmount = document.getElementById('result-amount');

  function calcNetAmount() {
    const amount = parseInt(amountInput.value) || 0;
    const fee = parseFloat(feeInput.value) || 0;
    const transfer = parseInt(transferInput.value) || 0;
    const net = Math.max(0, Math.floor(amount * (1 - fee/100) - transfer));
    resultAmount.textContent = net.toLocaleString();
  }
  [amountInput, feeInput, transferInput].forEach(input => {
    input.addEventListener('input', calcNetAmount);
  });
  calcNetAmount();

  // 3. 신청폼: 인증번호 발송/입력/신청
  const applyForm = document.getElementById('apply-form');
  const nameInput = document.getElementById('user-name');
  const phoneInput = document.getElementById('user-phone');
  const sendCodeBtn = document.getElementById('send-code');
  const codeInput = document.getElementById('verify-code');
  const accountInfo = document.getElementById('account-info');

  // 인증번호 발송 버튼 활성화
  function checkSendCodeEnable() {
    sendCodeBtn.disabled = !(nameInput.value && phoneInput.value);
  }
  nameInput.addEventListener('input', checkSendCodeEnable);
  phoneInput.addEventListener('input', checkSendCodeEnable);
  checkSendCodeEnable();

  // 인증번호 발송(백엔드 연동은 추후)
  sendCodeBtn.addEventListener('click', () => {
    if (!nameInput.value || !phoneInput.value) return;
    sendCodeBtn.disabled = true;
    sendCodeBtn.textContent = '발송됨';
    setTimeout(() => {
      sendCodeBtn.disabled = false;
      sendCodeBtn.textContent = '인증번호 발송';
    }, 60000); // 60초 후 재활성화
    // TODO: 백엔드 연동(sendCode API)
    alert('인증번호가 발송되었습니다.');
  });

  // 신청폼 제출(기본 submit 막기)
  applyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedGift) {
      alert('상품권을 선택해주세요.');
      return;
    }
    if (!nameInput.value || !phoneInput.value) {
      alert('이름과 연락처를 입력해주세요.');
      return;
    }
    // 예시 계좌정보 (농협 1231232131 김창수)
    const bank = '농협';
    const account = '1231232131';
    const owner = '김창수';
    const amount = amountInput.value;
    // Lambda로 교환내역 저장
    try {
      const res = await fetch('/.netlify/functions/addHistory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameInput.value,
          phone: phoneInput.value,
          gift: selectedGift,
          amount: amount,
          account: `${bank} ${account} (${owner})`
        })
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || '저장 실패');
    } catch (err) {
      alert('신청 저장에 실패했습니다. 다시 시도해주세요.');
      return;
    }
    accountInfo.innerHTML = `<div style=\"background:#f8fafc;border-radius:1rem;padding:1.2rem 1rem 1.2rem 1rem;text-align:center;font-size:1.1rem;font-weight:600;color:#2b6cb0;box-shadow:0 2px 8px rgba(0,0,0,0.04);\">
      <div>은행명: <b>${bank}</b></div>
      <div>계좌번호: <b>${account}</b></div>
      <div>예금주: <b>${owner}</b></div>
      <div style=\"margin-top:0.7rem;color:#1a7f37;font-size:1rem;font-weight:500;\">신청이 정상적으로 접수되었습니다.</div>
    </div>`;
    accountInfo.style.display = '';
    applyForm.reset();
    giftCards.forEach(c => c.classList.remove('selected'));
    selectedGift = null;
    calcNetAmount();
  });

  // 구매신청 모달 관련
  const buyCta = document.getElementById('buy-cta');
  const buyModal = document.getElementById('buy-modal');
  const buyModalClose = document.getElementById('buy-modal-close');
  const buyForm = document.getElementById('buy-form');
  const buyUserName = document.getElementById('buy-user-name');
  const buyUserPhone = document.getElementById('buy-user-phone');
  const buyAccountInfo = document.getElementById('buy-account-info');

  // 모달 열기
  buyCta.addEventListener('click', () => {
    buyModal.classList.add('show');
    buyAccountInfo.style.display = 'none';
    buyForm.reset();
  });
  // 모달 닫기 (X 버튼)
  buyModalClose.addEventListener('click', () => {
    buyModal.classList.remove('show');
  });
  // 모달 닫기 (바깥 영역 클릭)
  buyModal.addEventListener('click', (e) => {
    if (e.target === buyModal) buyModal.classList.remove('show');
  });
  // 폼 제출 시 계좌정보 출력
  buyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = buyUserName.value.trim();
    const phone = buyUserPhone.value.trim();
    if (!name || !phone) {
      alert('이름과 연락처를 입력해주세요.');
      return;
    }
    // 예시 계좌정보
    const bank = '농협';
    const account = '1231232131';
    const owner = '김창수';
    buyAccountInfo.innerHTML = `<div style=\"background:#f8fafc;border-radius:1rem;padding:1.2rem 1rem 1.2rem 1rem;text-align:center;font-size:1.1rem;font-weight:600;color:#2b6cb0;box-shadow:0 2px 8px rgba(0,0,0,0.04);\">
      <div>은행명: <b>${bank}</b></div>
      <div>계좌번호: <b>${account}</b></div>
      <div>예금주: <b>${owner}</b></div>
      <div style=\"margin-top:0.7rem;color:#1a7f37;font-size:1rem;font-weight:500;\">신청이 정상적으로 접수되었습니다.</div>
    </div>`;
    buyAccountInfo.style.display = 'block';
    buyForm.reset();
  });
}); 
