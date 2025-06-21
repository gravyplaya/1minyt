import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { anyone } from '../access/anyone'
import { slugField } from '@/fields/slug'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'stripeProductId'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'select',
      defaultValue: 'usd',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'EUR', value: 'eur' },
        { label: 'GBP', value: 'gbp' },
      ],
    },
    {
      name: 'stripeProductId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc }) => {
        try {
          let stripeProduct: Stripe.Product
          let stripePrice: Stripe.Price

          if (operation === 'create') {
            // Create new product in Stripe
            stripeProduct = await stripe.products.create({
              name: data.name,
              description: data.description,
            })

            // Create initial price
            stripePrice = await stripe.prices.create({
              product: stripeProduct.id,
              unit_amount: Math.round(data.price * 100), // Convert to cents
              currency: data.currency,
              recurring: {
                interval: 'month',
                interval_count: 1,
              },
            })

            // Set the default price for the product
            await stripe.products.update(stripeProduct.id, {
              default_price: stripePrice.id,
            })
          } else {
            // For updates, check if price has changed
            const priceChanged =
              data.price !== originalDoc.price || data.currency !== originalDoc.currency

            // Update product details
            stripeProduct = await stripe.products.update(data.stripeProductId, {
              name: data.name,
              description: data.description,
            })

            if (priceChanged) {
              // Create new price if price or currency changed
              stripePrice = await stripe.prices.create({
                product: data.stripeProductId,
                unit_amount: Math.round(data.price * 100),
                currency: data.currency,
                recurring: {
                  interval: 'month',
                  interval_count: 1,
                },
              })

              // Update product's default price
              await stripe.products.update(data.stripeProductId, {
                default_price: stripePrice.id,
              })
            } else {
              // Use existing price if no change
              stripePrice = await stripe.prices.retrieve(data.stripePriceId)
            }
          }

          // Return the data with Stripe IDs
          return {
            ...data,
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
          }
        } catch (error) {
          console.error('Error syncing with Stripe:', error)
          throw error
        }
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        try {
          const product = await req.payload.findByID({
            collection: 'products',
            id,
          })

          if (product?.stripeProductId) {
            // Archive the product in Stripe instead of deleting
            await stripe.products.update(product.stripeProductId, {
              active: false,
            })
          }
        } catch (error) {
          console.error('Error archiving Stripe product:', error)
          throw error
        }
      },
    ],
  },
  timestamps: true,
}
