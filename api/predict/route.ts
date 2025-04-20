import { NextResponse } from "next/server"
import { parseCSV, processStockData } from "@/lib/prediction-model"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const stockSymbol = formData.get("stockSymbol") as string | null
    const predictionDays = Number.parseInt((formData.get("predictionDays") as string) || "7")

    if (!file && !stockSymbol) {
      return NextResponse.json({ error: "Either file or stock symbol is required" }, { status: 400 })
    }

    let csvData = ""

    if (file) {
      // Process the uploaded file
      csvData = await file.text()
    } else {
      // Use sample data based on stock symbol
      // In a real app, you would fetch real data from an API
      csvData = `Date,Close\n2023-01-01,150.23\n2023-01-02,152.35\n2023-01-03,151.80`
    }

    // Parse CSV data
    const { dates, prices } = parseCSV(csvData)

    // Process data and generate predictions
    const result = processStockData(dates, prices, predictionDays)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to process prediction" }, { status: 500 })
  }
}
