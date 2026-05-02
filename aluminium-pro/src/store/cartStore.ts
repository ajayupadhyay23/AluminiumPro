import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // generate a unique id for cart item (e.g. productId-finish-unit)
  productId: string
  name: string
  slug: string
  finish: string
  quantity: number
  unit: string // 'kg' or 'foot'
  price: number // base price per unit
  image: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id)
        if (existingItem) {
          // If item exists, just add the quantity
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),
      
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        // Returns total distinct products OR total quantity. We'll do total distinct items in cart.
        return get().items.length
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'aluminiumpro-cart',
    }
  )
)
