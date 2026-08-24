const http = require('http');

async function testWebhook(targetUrl) {
  console.log(`\n=== Testing MGCAPI Compliance on: ${targetUrl} ===\n`);

  const playerToken = Buffer.from(JSON.stringify({ player_id: 1 })).toString('base64');
  
  // 1. getPlayerInfo
  console.log('1. Testing getPlayerInfo...');
  const resInfo = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cmd: 'getPlayerInfo',
      player_token: playerToken,
      currencyId: 'TRY',
      request_time: Date.now(),
      signature: 'test_sign'
    })
  });
  const dataInfo = await resInfo.json();
  console.log('Response getPlayerInfo:', resInfo.status, dataInfo);
  const pass1 = dataInfo.result === true && dataInfo.currency === 'TRY' && typeof dataInfo.balance === 'number';
  console.log('Pass 1 (getPlayerInfo):', pass1 ? '✅ PASS' : '❌ FAIL');

  // 2. withdraw
  console.log('\n2. Testing withdraw (bet)...');
  const resWithdraw = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cmd: 'withdraw',
      player_token: playerToken,
      transactionId: 'test_wd_001',
      roundId: 'round_001',
      gameId: 90044,
      currencyId: 'TRY',
      betAmount: 50.0,
      betInfo: 'Test Bet',
      request_time: Date.now(),
      signature: 'test_sign'
    })
  });
  const dataWithdraw = await resWithdraw.json();
  console.log('Response withdraw:', resWithdraw.status, dataWithdraw);
  const pass2 = dataWithdraw.result === true && typeof dataWithdraw.balance === 'number' && typeof dataWithdraw.before_balance === 'number';
  console.log('Pass 2 (withdraw):', pass2 ? '✅ PASS' : '❌ FAIL');

  // 3. deposit
  console.log('\n3. Testing deposit (win)...');
  const resDeposit = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cmd: 'deposit',
      player_token: playerToken,
      transactionId: 'test_dep_001',
      roundId: 'round_001',
      gameId: 90044,
      currencyId: 'TRY',
      winAmount: 120.0,
      betInfo: 'Test Win',
      request_time: Date.now(),
      signature: 'test_sign'
    })
  });
  const dataDeposit = await resDeposit.json();
  console.log('Response deposit:', resDeposit.status, dataDeposit);
  const pass3 = dataDeposit.result === true && typeof dataDeposit.balance === 'number' && typeof dataDeposit.before_balance === 'number';
  console.log('Pass 3 (deposit):', pass3 ? '✅ PASS' : '❌ FAIL');

  // 4. rollback
  console.log('\n4. Testing rollback (refund)...');
  const resRollback = await fetch(targetUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cmd: 'rollback',
      player_token: playerToken,
      transactionId: 'test_dep_001',
      gameId: 90044,
      currencyId: 'TRY',
      request_time: Date.now(),
      signature: 'test_sign'
    })
  });
  const dataRollback = await resRollback.json();
  console.log('Response rollback:', resRollback.status, dataRollback);
  const pass4 = dataRollback.result === true && typeof dataRollback.balance === 'number' && typeof dataRollback.before_balance === 'number';
  console.log('Pass 4 (rollback):', pass4 ? '✅ PASS' : '❌ FAIL');

  console.log('\n=======================================');
  console.log('Overall Testcases Result:', (pass1 && pass2 && pass3 && pass4) ? '🎉 ALL PASS (100%)' : '❌ SOME FAILED');
  console.log('=======================================\n');
}

testWebhook('http://85.121.178.80:3001/api/casino/callback/api');
