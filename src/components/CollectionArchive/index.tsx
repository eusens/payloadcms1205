import { cn } from 'src/utilities/cn'
import React from 'react'
import type { Post } from '@/payload-types'
import { Card } from '@/components/Card'

type MinimalPost = Pick<Post, 'id' | 'title' | 'slug' | 'meta' | 'categories'> & {
  price?: number
}

type Props = {
  posts: MinimalPost[]
  urlPrefix?: string
}

export const CollectionArchive: React.FC<Props> = ({ posts, urlPrefix = 'posts' }) => {
  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id}>
            <Card 
              className="h-full" 
              doc={post}
              relationTo="posts" 
              showCategories 
              urlPrefix={urlPrefix}
            />
          </div>
        ))}
      </div>
    </div>
  )
}