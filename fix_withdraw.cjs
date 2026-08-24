const fs = require('fs');
let content = fs.readFileSync('socket_server.cjs', 'utf8');

const startMarker = '        const request = await prisma.paymentRequest.create({';
const endMarker = '        // --------------------------------------';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker) + endMarker.length;

if (startIndex === -1 || endIndex === -1) {
  console.log("Could not find markers!");
  process.exit(1);
}

const replacement = `        const trxCode = \\\`TRX_\\${Date.now()}_\\${Math.floor(Math.random() * 8999 + 1000)}\\\`;

        const request = await prisma.paymentRequest.create({
            data: {
                userId: user.id,
                type: 'withdraw',
                method,
                amount: withdrawAmount,
                txHash: \\\`\\${trxCode} - \\${req.body.txHash || req.body.iban || req.body.walletAddress || ''}\\\`,
                status: 'pending',
                updatedAt: new Date()
            }
        });

        // --- NEOPAYS WITHDRAWAL INTEGRATION ---
        const isNeoPaysActive = neopaysConfig && neopaysConfig.active && neopaysConfig.sid && neopaysConfig.sid !== '1001';
        let neoPaysDebug = null;

        if (isNeoPaysActive) {
            const isCrypto = method.toLowerCase().includes('kripto') || method.toLowerCase().includes('crypto');
            const neoMethod = isCrypto ? 'crypto' : 'banktransfer';
            const neoEndpoint = \\\`https://api.neopays.net/api/v1/withdrawals/\\${neoMethod}\\\`;

            const neoPayload = isCrypto ? {
                sid: neopaysConfig.sid,
                key: neopaysConfig.secretKey,
                username: user.username,
                userid: user.id,
                trx: trxCode,
                amount: withdrawAmount,
                fullname: req.body.fullname || user.username,
                wallet_address: req.body.walletAddress || req.body.txHash,
                coin_id: req.body.coinId || "01a7e83c-17cd-4039-9f03-92f4e5d256dd",
                destination_tag_memo: req.body.memo || ""
            } : {
                sid: neopaysConfig.sid,
                key: neopaysConfig.secretKey,
                username: user.username,
                userid: user.id,
                trx: trxCode,
                amount: withdrawAmount,
                fullname: req.body.fullname || user.username,
                iban: req.body.iban || req.body.txHash,
                bankid: req.body.bankId || "48889430-844c-4149-bca0-1745e64319ed"
            };

            try {
                const neoRes = await fetch(neoEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(neoPayload)
                });
                const neoData = await neoRes.json();
                neoPaysDebug = { status: neoRes.status, response: neoData };

                if (neoRes.ok && (neoData.code === 200 || neoData.code === '200')) {
                    return res.json({
                        success: true,
                        request,
                        newBalance: user.balance - withdrawAmount,
                        debug: {
                            status: "200 OK",
                            message: "NeoPays Çekim Talebi Sağlayıcıya İletildi (200 OK)",
                            neoPaysResponse: neoData,
                            deductedAmount: withdrawAmount,
                            trxCode
                        }
                    });
                } else {
                    // NeoPays provider rejected withdrawal -> Refund user balance
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { balance: { increment: withdrawAmount } }
                    });
                    await prisma.paymentRequest.update({
                        where: { id: request.id },
                        data: { status: 'rejected' }
                    });

                    return res.status(400).json({
                        success: false,
                        error: \\\`[NeoPays Sağlayıcı Reddi - Code \\${neoData.code || neoRes.status}] \\${neoData.message || 'Çekim oluşturulamadı'}. Bakiyeniz hesabınıza iade edildi.\\\`,
                        debug: {
                            status: neoRes.status,
                            neoPaysResponse: neoData,
                            revertedBalance: true,
                            refundedAmount: withdrawAmount
                        }
                    });
                }
            } catch (neoErr) {
                console.error('NeoPays Withdrawal Call Failed:', neoErr);
                neoPaysDebug = { error: neoErr.message };
            }
        }
        // --------------------------------------`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync('socket_server.cjs', content, 'utf8');
console.log("Updated socket_server.cjs successfully!");
