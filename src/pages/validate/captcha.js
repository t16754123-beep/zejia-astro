import {challenge} from '../../lib/captcha.js';
export const prerender = false;
export async function GET({cookies,locals,url}) {
  const {id,code} = await challenge(locals.runtime?.env.SITE_DB);
  cookies.set('verification',id,{path:'/',sameSite:'strict',httpOnly:true,secure:url.protocol === 'https:',maxAge:300});
  const image = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="26"><rect width="80" height="26" fill="#eff2eb"/><path d="M0 16Q25 3 41 15T80 12" stroke="#a4afa7" fill="none"/><text x="7" y="21" fill="#384c69" font-family="monospace" font-size="21" letter-spacing="4">'+code+'</text></svg>';
  return new Response(image,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'no-store'}});
}
