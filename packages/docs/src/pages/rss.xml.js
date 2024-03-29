import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'

export async function GET(context) {
    const posts = await getCollection('blog')
    const components = await getCollection('components')
    const guide = await getCollection('guide')
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: [
            ...posts.map((post) => ({
                ...post.data,
                link: `/blog/${post.slug}/`
            })),
            ...components.map((post) => ({
                ...post.data,
                link: `/components/${post.slug}/`
            })),
            ...guide.map((post) => ({
                ...post.data,
                link: `/guide/${post.slug}/`
            }))
        ]
    })
}
