import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const samples = {
  'qizhong2020ban-pdf': '5860385603563',
  'ty2020b-pdf': '567893056893056',
  'gxcslzq-pdf': '26131935831',
  'flljkkxzhfx-pdf': '26115853507',
};
export default defineConfig({
  adapter: node({mode: 'standalone'}),
  redirects: Object.fromEntries(Object.entries(samples).map(([slug, id]) =>
    ['/chanpinyangbenxiazai/' + slug, '/uploads/2101/' + id + '.pdf']
  )),
  devToolbar: {enabled: false},
});
