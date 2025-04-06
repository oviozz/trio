import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const apiKey = "67f1df956b79bec13e27b30a" // This would normally be an environment variable
    const url = `https://api.scrapingdog.com/google_shopping?api_key=${apiKey}&query=${encodeURIComponent(query)}&country=us&language=`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

