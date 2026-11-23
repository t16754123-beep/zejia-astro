import {mkdir,appendFile} from 'node:fs/promises';
import path from 'node:path';
import {verify} from '../../lib/captcha.js';
export const prerender = false;
export async function POST({request,cookies,locals}) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response('需要 JSON 请求。', {status: 415});
  const form = await request.json().catch(() => null);
  if (!form || typeof form !== 'object') return new Response('留言格式无效。', {status: 400});
  const field = name => typeof form[name] === 'string' ? form[name].trim() : '';
  const [name,email,phone,company,message] = ['Customer','Email','Phone','Company','Content'].map(field);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return new Response('请填写姓名、有效邮箱和留言内容。',{status:400});
  const id = cookies.get('verification')?.value || '';
  const code = field('Captcha').toUpperCase();
  const db = locals.runtime?.env.SITE_DB;
  const time = new Date().toISOString();
  if (db) {
    const [saved] = await db.batch([
      db.prepare(`INSERT INTO inquiries (time, name, email, phone, company, message)
        SELECT ?, ?, ?, ?, ?, ? FROM challenges WHERE id = ? AND code = ? AND expires >= ?`)
        .bind(time,name,email,phone,company,message,id,code,Date.now()),
      db.prepare('DELETE FROM challenges WHERE id = ?').bind(id)
    ]);
    return saved.meta.changes === 1 ? new Response('留言已保存。') :
      new Response('验证码不正确或已过期，请重新输入。',{status:400});
  }
  if (!verify(id,code))
    return new Response('验证码不正确或已过期，请重新输入。',{status:400});
  const directory = path.resolve(process.env.INQUIRY_DIR || 'var');
  await mkdir(directory,{recursive:true});
  await appendFile(path.join(directory,'inquiries.ndjson'),JSON.stringify({time,name,email,phone,company,message})+'\n','utf8');
  return new Response('留言已保存。');
}

