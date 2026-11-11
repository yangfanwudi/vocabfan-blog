import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: 'VocabFan Lab',
    description: '一个人的数字实验室。记录用 AI 和代码开发网站、工具、游戏与数字产品的过程。',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
      categories: [post.data.category, ...post.data.tags],
    })),
    customData: '<language>zh-CN</language>',
  });
}
