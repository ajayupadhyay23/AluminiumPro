"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2, Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Pass isAdmin=true to fetch all products regardless of isActive status
      const res = await axios.get("/api/products?limit=50&isAdmin=true")
      if (res.data.success) {
        setProducts(res.data.products)
      }
    } catch (error) {
      console.error("Failed to fetch admin products", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockBadge = (stock: number) => {
    if (stock <= 0) return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">Out of Stock</span>
    if (stock < 500) return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">Low ({stock}kg)</span>
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">In Stock ({stock}kg)</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-charcoal">Products</h1>
          <p className="text-gray-500">Manage your inventory, pricing, and catalogue visibility.</p>
        </div>
        <Button className="bg-gold text-charcoal hover:bg-charcoal hover:text-white shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search by name or SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="border-gray-300 rounded-md text-sm">
              <option value="all">All Categories</option>
              <option value="sheets">Sheets</option>
              <option value="material">Material</option>
              <option value="grills">Grills</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-charcoal" />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price/kg</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-charcoal">
                {filteredProducts.length > 0 ? filteredProducts.map((product) => {
                  
                  let imageUrl = "https://picsum.photos/100"
                  if (product.primaryImage) imageUrl = product.primaryImage
                  else if (product.images?.[0]?.url) imageUrl = product.images[0].url

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-12 h-12 rounded border border-gray-200 bg-white overflow-hidden shrink-0">
                          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-charcoal">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.finish?.slice(0,2).join(', ')}{product.finish?.length > 2 ? '...' : ''}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4 font-bold">₹{product.pricePerKg}</td>
                      <td className="p-4">{getStockBadge(product.stock)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-500">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
