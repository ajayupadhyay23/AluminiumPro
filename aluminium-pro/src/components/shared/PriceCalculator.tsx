"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PriceCalculatorProps {
  pricePerKg: number
  pricePerFoot: number | null
  weightPerFoot: number | null
  category?: string
  unitName?: string
  onAddToCart: (quantity: number, unit: string) => void
}

export default function PriceCalculator({ pricePerKg, pricePerFoot, weightPerFoot, category, unitName, onAddToCart }: PriceCalculatorProps) {
  const isSheet = category === 'Sheets'
  const isAcc = category === 'Accessories'
  const isGrill = category === 'Grills'
  const defaultUnit = unitName || (isSheet || isGrill ? 'sheet' : (isAcc ? 'pc' : 'kg'))
  
  const [unit, setUnit] = useState<string>(defaultUnit)
  const [quantity, setQuantity] = useState<number>(isSheet || isGrill ? 1 : (isAcc ? 1 : 100))
  
  const [totals, setTotals] = useState({
    basePrice: 0,
    gst: 0,
    total: 0,
    approxWeight: 0,
    approxFeet: 0
  })

  useEffect(() => {
    let basePrice = 0
    let approxWeight = 0
    let approxFeet = 0

    if (unit === "kg") {
      basePrice = quantity * pricePerKg
      approxWeight = quantity
      if (weightPerFoot && weightPerFoot > 0) {
        approxFeet = quantity / weightPerFoot
      }
    } else if (unit === "foot") {
      if (pricePerFoot) {
        basePrice = quantity * pricePerFoot
      } else if (weightPerFoot) {
        basePrice = quantity * weightPerFoot * pricePerKg
      }
      approxFeet = quantity
      if (weightPerFoot) {
        approxWeight = quantity * weightPerFoot
      }
    } else if (unit === "sheet" || unit === "pc" || unit === "box" || unit === "roll" || unit === "pair") {
      basePrice = quantity * pricePerKg
    }

    const gst = basePrice * 0.18
    const total = basePrice + gst

    setTotals({
      basePrice,
      gst,
      total,
      approxWeight,
      approxFeet
    })
  }, [quantity, unit, pricePerKg, pricePerFoot, weightPerFoot])

  return (
    <div className="bg-lightbg rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4 text-charcoal">
        <Calculator className="w-5 h-5" />
        <h3 className="font-bold">Price Calculator</h3>
      </div>

      <div className="flex gap-2 mb-6">
        {isSheet || isAcc || isGrill ? (
          <button className="flex-1 py-2 text-sm font-bold rounded-md transition-colors bg-charcoal text-white capitalize">
            By {defaultUnit === 'pc' ? 'Piece' : defaultUnit} ({defaultUnit})
          </button>
        ) : (
          <>
            <button
              onClick={() => setUnit("kg")}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${
                unit === "kg" ? "bg-charcoal text-white" : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              By Weight (kg)
            </button>
            <button
              onClick={() => setUnit("foot")}
              disabled={!pricePerFoot && !weightPerFoot}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                unit === "foot" ? "bg-charcoal text-white" : "bg-white text-gray-500 border border-gray-200"
              }`}
            >
              By Length (ft)
            </button>
          </>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity ({unit})
        </label>
        <div className="flex items-center">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - (isSheet || isAcc ? 1 : 10)))}
            className="w-10 h-10 bg-white border border-gray-300 rounded-l-md font-bold text-xl flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="h-10 w-full border-y border-gray-300 text-center font-bold text-charcoal focus:outline-none focus:ring-0"
          />
          <button 
            onClick={() => setQuantity(quantity + (isSheet || isAcc ? 1 : 10))}
            className="w-10 h-10 bg-white border border-gray-300 rounded-r-md font-bold text-xl flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
        {unit === "kg" && quantity < 100 && (
          <p className="text-xs text-orange-500 mt-2 font-medium">Minimum order quantity is 100kg</p>
        )}
      </div>

      <div className="space-y-3 mb-6 p-4 bg-white rounded-lg border border-gray-100">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Base Price</span>
          <span>₹{totals.basePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>GST (18%)</span>
          <span>₹{totals.gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-charcoal text-lg">
          <span>Total</span>
          <span>₹{totals.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        {weightPerFoot && !isSheet && !isAcc && (
          <div className="pt-2 text-xs text-silver text-center">
            Approx. {unit === 'kg' ? totals.approxFeet.toFixed(2) + ' ft' : totals.approxWeight.toFixed(2) + ' kg'}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={() => onAddToCart(quantity, unit)}
          className="flex-1 h-12 bg-charcoal hover:bg-black text-white text-lg font-bold"
        >
          Add to Cart
        </Button>
        <Button 
          variant="outline"
          className="flex-1 h-12 border-gold text-gold hover:bg-gold hover:text-white text-lg font-bold"
        >
          Buy Now
        </Button>
      </div>
    </div>
  )
}

