export function generateOTP(): string {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OTP = '';
  const len = characters.length;
  for (let i = 0; i < 6; i++) {
    OTP += characters[Math.floor(Math.random() * len)];
  }
  return OTP;
}
