import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductDetail({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/products/' + slug
  const product = await queryPostBySlug({ slug })

  if (!product) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Image */}
          <div className="md:w-1/2">
            {product.meta?.image && typeof product.meta.image === 'object' && 'url' in product.meta.image && product.meta.image.url && (
              <img
                src={product.meta.image.url}
                alt={product.title || 'Product image'}
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>

          {/* Right side - Content */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            {/* Price display */}
            <div className="mb-6">
              <p className="text-2xl font-semibold text-blue-600">
                ${product.price?.toFixed(2)}
              </p>
            </div>

            {/* Content */}
            <RichText 
              content={product.content} 
              enableGutter={false} 
            />
          </div>
        </div>

        {/* Related Products */}
        {product.relatedPosts && product.relatedPosts.length > 0 && (
          <RelatedPosts
            className="mt-12 max-w-[52rem] mx-auto"
            docs={product.relatedPosts
              .filter((post): post is Post => typeof post === 'object' && post !== null)
              .map(post => ({
                ...post,
                href: `/products/${post.slug}`
              }))}
          />
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryPostBySlug({ slug })

  const metadata = await generateMeta({ doc: product })
  
  return {
    ...metadata,
    title: typeof metadata.title === 'string' ? `${metadata.title} - Products` : 'Products'
  }
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
