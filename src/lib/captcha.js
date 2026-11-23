import { randomBytes, randomInt } from 'node:crypto';
const challenges = new Map();
export async function challenge(db) {
  const now = Date.now();
  for (const [id, item] of challenges) if (item.expires < now) challenges.delete(id);
  const id = randomBytes(20).toString('hex');
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const code = Array.from({length: 4}, () => alphabet[randomInt(alphabet.length)]).join('');
  const expires = now + 300000;
  if (db) {
    await db.batch([
      db.prepare('DELETE FROM challenges WHERE expires < ?').bind(now),
      db.prepare('INSERT INTO challenges (id, code, expires) VALUES (?, ?, ?)').bind(id, code, expires)
    ]);
  } else {
    challenges.set(id, {code,expires});
  }
  return {id,code};
}
export function verify(id, code) {
  const item = challenges.get(id);
  challenges.delete(id);
  return Boolean(item && item.expires >= Date.now() && item.code === code.toUpperCase());
}

