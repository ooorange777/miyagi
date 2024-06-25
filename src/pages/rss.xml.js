import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export function GET(context) {
  const postImportResult = import.meta.glob("./posts/*.{md,mdx}", {
    eager: true,
  });
  const posts = Object.values(postImportResult);
  return rss({
    // 输出的 xml 中的`<title>`字段
    title: "NoTomorrow Club",
    // 输出的 xml 中的`<description>`字段
    description: "个人博客，记录感想",
    // 从端点上下文获取项目“site”
    // https://docs.astro.build/zh-cn/reference/api-reference/#contextsite
    site: context.site,
    // 输出的 xml 中的`<item>`数组
    // 有关使用内容集合和 glob 导入的示例，请参阅“生成`items`”部分
    items: posts.map((post) => ({
      title: post.frontmatter.title,
      link: post.url,
      pubDate: post.frontmatter.date,
      tags: post.frontmatter.tags,
      descriptioin: post.frontmatter.description,
    })),
    // (可选) 注入自定义 xml
    customData: `<language>zh-cn</language>`,
  });
}
