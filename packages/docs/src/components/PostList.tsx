export const PostList = (props: { posts: any[]; prefix: string }) => {
	return (
		<ul class="grid grid-cols-24 p-4">
			{props.posts.map((post) => (
				<li class="col-span-12 font-bold">
					<a
						href={`${props.prefix}/${post.slug}/`}
						class="block hover:bg-gray-200 transition-transform rounded-md p-2 "
					>
						<h4 class="text-xl py-1">{post.data.title}</h4>
						<p class="font-light text-sm text-design-h2">
							{post.data.description}
						</p>
						<p class="font-light text-sm text-design-h2">{post.data.pubDate}</p>
					</a>
				</li>
			))}
		</ul>
	);
};
