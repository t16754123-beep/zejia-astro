import { randomBytes, randomInt } from 'node:crypto';
const challenges = new Map();
export function challenge() {
  const now = Date.now();
  for (const [id, item] of challenges) if (item.expires < now) challenges.delete(id);
  const id = randomBytes(20).toString('hex');
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const code = Array.from({length: 4}, () => alphabet[randomInt(alphabet.length)]).join('');
  challenges.set(id, {code,expires: now + 300000});
  return {id,code};
}
export function verify(id, code) {
  const item = challenges.get(id);
  challenges.delete(id);
  return Boolean(item && item.expires >= Date.now() && item.code === code.toUpperCase());
}

