import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  name: string
  slug: string
  price: number
  image: string
  category: string
}

interface WishlistState {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const exists = state.items.some(i => i.id === item.id)
        if (exists) return state
        return { items: [...state.items, item] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id)
      },
      
      clearWishlist: () => set({ items: [] }),
      
      getTotalItems: () => get().items.length
    }),
    {
      name: 'aluminiumpro-wishlist',
    }
  )
)
