const crypto = require('crypto-js');

async function signAgreement(agreementDocument, privateKey) {
  const hash = crypto.SHA256(agreementDocument).toString();
  const signature = crypto.enc.Base64.stringify(crypto.sign(hash, privateKey));
  return signature;
}


async function verifyAgreementSignatures(agreementDocument, signatures, publicKeys) {
    const hash = crypto.SHA256(agreementDocument).toString();
    for (let i = 0; i < signatures.length; i++) {
      const signature = crypto.enc.Base64.decode(signatures[i]);
      if (!crypto.verify(hash, signature, publicKeys[i])) {
        return false; //signature verification failed
      }
    }
    return true;
  }