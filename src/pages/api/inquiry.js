import {mkdir,appendFile} from 'node:fs/promises';
import path from 'node:path';
import {verify} from '../../lib/captcha.js';
export const prerender = false;
export async function POST({request,cookies}) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return new Response('需要 JSON 请求。', {status: 415});
  const form = await request.json().catch(() => null);
  if (!form || typeof form !== 'object') return new Response('留言格式无效。', {status: 400});
  const field = name => typeof form[name] === 'string' ? form[name].trim() : '';
  const [name,email,phone,company,message] = ['Customer','Email','Phone','Company','Content'].map(field);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return new Response('请填写姓名、有效邮箱和留言内容。',{status:400});
  if (!verify(cookies.get('verification')?.value,field('Captcha')))
    return new Response('验证码不正确或已过期，请重新输入。',{status:400});
  const directory = path.resolve(process.env.INQUIRY_DIR || 'var');
  await mkdir(directory,{recursive:true});
  await appendFile(path.join(directory,'inquiries.ndjson'),JSON.stringify({time:new Date().toISOString(),name,email,phone,company,message})+'\n','utf8');
  return new Response('留言已保存。');
}

