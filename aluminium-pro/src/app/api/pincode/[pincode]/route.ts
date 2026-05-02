import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { pincode: string } }) {
  const { pincode } = params

  // Mocking Pincode Delivery Service
  // In a real app, this would query a logistics partner API (e.g., Delhivery, Bluedart)

  if (!pincode || pincode.length !== 6 || isNaN(Number(pincode))) {
    return NextResponse.json({ success: false, error: 'Invalid 6-digit Indian Pincode' }, { status: 400 })
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

  // Fake logic based on first digit of pincode
  let estimate = "5-7 business days"
  let isDeliverable = true

  const firstDigit = pincode.charAt(0)

  if (firstDigit === '1') {
    estimate = "2-3 business days (North India)"
  } else if (firstDigit === '4') {
    estimate = "3-4 business days (West India)"
  } else if (firstDigit === '5' || firstDigit === '6') {
    estimate = "4-6 business days (South India)"
  } else if (firstDigit === '7' || firstDigit === '8') {
    estimate = "7-10 business days (East/North-East India)"
  }

  // Randomly make some pincodes undeliverable for testing
  if (pincode === '000000' || pincode === '999999') {
    isDeliverable = false
  }

  return NextResponse.json({
    success: true,
    data: {
      pincode,
      isDeliverable,
      estimate: isDeliverable ? estimate : null,
      message: isDeliverable ? 'Delivery available' : 'Sorry, we do not deliver to this pincode.'
    }
  })
}
