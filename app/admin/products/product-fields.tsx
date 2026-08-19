import type { CatalogProduct } from '@/lib/admin-catalog'
import { gallerySlots, quantityOf } from '@/lib/admin-catalog'
import { categoryLabel } from '@/lib/categories'
import { ProductImageFields } from '@/components/admin/product-image-fields'

export const fieldClass =
  'w-full border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-500'
export const labelClass = 'mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500'

function fulfillmentLabel(value: string) {
  if (value === 'white-label') return 'White label'
  if (value === 'room23-stock') return 'Room 23 stock'
  if (value === 'dropship') return 'Dropship'
  return value
}

function vendorLabel(value: string) {
  if (value === 'ROOM23_STOCK') return 'Room 23 stock'
  if (value === 'ELDORADO_DROPSHIP') return 'Eldorado dropship'
  if (value === 'WILLIAMS_DROPSHIP') return 'Williams dropship'
  return value
}

export function ProductEditorFields({
  product,
  categories,
  fulfillmentTypes,
  vendorTypes,
}: {
  product?: CatalogProduct | null
  categories: string[]
  fulfillmentTypes: string[]
  vendorTypes: string[]
}) {
  const quantity = product ? quantityOf(product) : null
  const slots = gallerySlots(product)
  const attributes = Array.isArray(product?.attributes) ? product.attributes.join('\n') : ''

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelClass}>Name</span>
          <input className={fieldClass} name="name" defaultValue={product?.name || ''} required />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Slug</span>
          <input className={fieldClass} name="slug" defaultValue={product?.slug || ''} placeholder="auto-from-name" />
          <span className="mt-2 block text-xs text-zinc-500">Leave blank to generate from the name.</span>
        </label>

        <label className="block">
          <span className={labelClass}>Price</span>
          <input
            className={fieldClass}
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.price ?? ''}
            required
          />
        </label>

        <label className="block">
          <span className={labelClass}>COGS</span>
          <input
            className={fieldClass}
            name="cogs"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.cogs ?? ''}
            placeholder="Unit cost"
          />
          <span className="mt-2 block text-xs text-zinc-500">Admin-only unit cost for margin reporting.</span>
        </label>

        <label className="block">
          <span className={labelClass}>Quantity</span>
          <input
            className={fieldClass}
            name="quantity"
            type="number"
            min="0"
            step="1"
            defaultValue={quantity ?? ''}
            required
          />
        </label>

        <label className="block">
          <span className={labelClass}>Category</span>
          <select className={fieldClass} name="category" defaultValue={product?.category || categories[0] || 'lubes'} required>
            {categories.map((category) => (
              <option key={category} value={category}>
                {categoryLabel(category)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Collection</span>
          <input className={fieldClass} name="collection" defaultValue={product?.collection || product?.category || ''} />
        </label>

        <label className="block sm:col-span-2">
          <span className={labelClass}>Badge</span>
          <input className={fieldClass} name="badge" defaultValue={product?.badge || ''} placeholder="NEW, TRAVEL, BEST SELLER" />
        </label>
      </div>

      <fieldset className="space-y-4">
        <legend className={labelClass}>Visibility</legend>
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="hidden"
            className="h-4 w-4 border-zinc-700 bg-zinc-950"
            defaultChecked={Boolean(product?.hidden || product?.archived || product?.active === false)}
          />
          Hidden from storefront
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="hideWhenZero"
            className="h-4 w-4 border-zinc-700 bg-zinc-950"
            defaultChecked={Boolean(product?.hideWhenZero)}
          />
          Hide when quantity is zero
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="isProductOfTheMonth"
            className="h-4 w-4 border-zinc-700 bg-zinc-950"
            defaultChecked={Boolean(product?.isProductOfTheMonth)}
          />
          Product of the Month
        </label>
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="isFeatured"
            className="h-4 w-4 border-zinc-700 bg-zinc-950"
            defaultChecked={Boolean(product?.isFeatured)}
          />
          Featured
        </label>
      </fieldset>

      <div className="space-y-6">
        <label className="block">
          <span className={labelClass}>Tagline</span>
          <input className={fieldClass} name="tagline" defaultValue={product?.tagline || ''} />
        </label>
        <label className="block">
          <span className={labelClass}>Short description</span>
          <textarea className={`${fieldClass} min-h-24`} name="shortEditorial" rows={3} defaultValue={product?.shortEditorial || ''} />
        </label>
        <label className="block">
          <span className={labelClass}>Description</span>
          <textarea className={`${fieldClass} min-h-32`} name="description" rows={5} defaultValue={product?.description || ''} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelClass}>Ingredients</span>
          <textarea className={`${fieldClass} min-h-24`} name="ingredients" rows={4} defaultValue={product?.ingredients || ''} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Directions</span>
          <textarea className={`${fieldClass} min-h-24`} name="directions" rows={4} defaultValue={product?.directions || ''} />
        </label>
        <label className="block">
          <span className={labelClass}>Compatibility</span>
          <textarea className={`${fieldClass} min-h-24`} name="compatibility" rows={4} defaultValue={product?.compatibility || ''} />
        </label>
        <label className="block">
          <span className={labelClass}>Care</span>
          <textarea className={`${fieldClass} min-h-24`} name="care" rows={4} defaultValue={product?.care || ''} />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Discretion notes</span>
          <textarea
            className={`${fieldClass} min-h-24`}
            name="discretionNotes"
            rows={3}
            defaultValue={product?.discretionNotes || ''}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Attributes</span>
          <textarea
            className={`${fieldClass} min-h-24`}
            name="attributes"
            rows={4}
            defaultValue={attributes}
            placeholder="One per line, or comma-separated"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Fulfillment type</span>
          <select className={fieldClass} name="fulfillmentType" defaultValue={product?.fulfillmentType || fulfillmentTypes[0]}>
            {fulfillmentTypes.map((value) => (
              <option key={value} value={value}>
                {fulfillmentLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Vendor type</span>
          <select className={fieldClass} name="vendorType" defaultValue={product?.vendorType || vendorTypes[0]}>
            {vendorTypes.map((value) => (
              <option key={value} value={value}>
                {vendorLabel(value)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ProductImageFields productId={product?.id} primaryImage={product?.image || ''} gallery={slots} />
    </>
  )
}
