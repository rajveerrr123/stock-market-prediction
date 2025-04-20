"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, LogOut, Upload, Download, RefreshCw } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { PredictionTable } from "@/components/prediction-table"
import { processFile, sampleCSVData, parseCSV } from "@/lib/file-processor"
import { generateSampleData, processStockData } from "@/lib/prediction-model"

export default function PredictionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [stockSymbol, setStockSymbol] = useState("")
  const [predictionDays, setPredictionDays] = useState("7")
  const [chartData, setChartData] = useState({ labels: [], actual: [], predicted: [], upper: [], lower: [] })
  const [tableData, setTableData] = useState([])
  const [predictionMade, setPredictionMade] = useState(false)
  const [error, setError] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handlePrediction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let dates: string[] = []
      let prices: number[] = []

      if (file) {
        // Process uploaded file
        try {
          const result = await processFile(file)
          dates = result.dates
          prices = result.prices
        } catch (err) {
          // If file processing fails, use sample data
          setError(`Error processing file: ${(err as Error).message}. Using sample data instead.`)
          const result = parseCSV(sampleCSVData)
          dates = result.dates
          prices = result.prices
        }
      } else if (stockSymbol) {
        // Generate sample data for selected stock
        const result = generateSampleData(stockSymbol)
        dates = result.dates
        prices = result.prices
      } else {
        throw new Error("Please upload a file or select a stock symbol")
      }

      // Process data and generate predictions
      const days = Number.parseInt(predictionDays)
      const result = processStockData(dates, prices, days)

      // Update chart and table data
      setChartData({
        labels: result.labels,
        actual: result.actual,
        predicted: result.predicted,
        upper: result.upper,
        lower: result.lower,
      })
      setTableData(result.tableData)
      setPredictionMade(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to handle demo data
  const loadDemoData = () => {
    setIsLoading(true)
    setError("")

    try {
      // Parse the sample CSV data
      const { dates, prices } = parseCSV(sampleCSVData)

      // Process data and generate predictions
      const days = Number.parseInt(predictionDays)
      const result = processStockData(dates, prices, days)

      // Update chart and table data
      setChartData({
        labels: result.labels,
        actual: result.actual,
        predicted: result.predicted,
        upper: result.upper,
        lower: result.lower,
      })
      setTableData(result.tableData)
      setPredictionMade(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // Load demo data on initial render
  useEffect(() => {
    loadDemoData()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">StockPredict</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Welcome, User</span>
            <Link href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Stock Market Prediction</h1>

          {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md text-red-400">{error}</div>}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1 bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Prediction Input</CardTitle>
                <CardDescription>Upload a file or select a stock symbol</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="file">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-950">
                    <TabsTrigger value="file">File Upload</TabsTrigger>
                    <TabsTrigger value="symbol">Stock Symbol</TabsTrigger>
                  </TabsList>
                  <TabsContent value="file" className="space-y-4 pt-4">
                    <form onSubmit={handlePrediction} className="space-y-4">
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="file">Upload Prediction File</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="file"
                            type="file"
                            onChange={handleFileUpload}
                            className="bg-gray-950 border-gray-800"
                            accept=".csv"
                          />
                        </div>
                        <p className="text-xs text-gray-400">Upload CSV file with date and price columns</p>
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="days-file">Prediction Days</Label>
                        <Select value={predictionDays} onValueChange={setPredictionDays}>
                          <SelectTrigger className="bg-gray-950 border-gray-800">
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={!file || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload and Predict
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="symbol" className="space-y-4 pt-4">
                    <form onSubmit={handlePrediction} className="space-y-4">
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="symbol">Stock Symbol</Label>
                        <Select onValueChange={setStockSymbol} value={stockSymbol}>
                          <SelectTrigger className="bg-gray-950 border-gray-800">
                            <SelectValue placeholder="Select stock" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            <SelectItem value="AAPL">AAPL - Apple Inc.</SelectItem>
                            <SelectItem value="MSFT">MSFT - Microsoft Corp.</SelectItem>
                            <SelectItem value="GOOGL">GOOGL - Alphabet Inc.</SelectItem>
                            <SelectItem value="AMZN">AMZN - Amazon.com Inc.</SelectItem>
                            <SelectItem value="TSLA">TSLA - Tesla Inc.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid w-full items-center gap-2">
                        <Label htmlFor="days">Prediction Days</Label>
                        <Select value={predictionDays} onValueChange={setPredictionDays}>
                          <SelectTrigger className="bg-gray-950 border-gray-800">
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-800">
                            <SelectItem value="1">1 Day</SelectItem>
                            <SelectItem value="7">7 Days</SelectItem>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={!stockSymbol || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Generate Prediction
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2 bg-gray-900 border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>Stock price prediction chart</CardDescription>
                </div>
                {predictionMade && (
                  <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <StockChart data={chartData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {predictionMade && (
            <div className="mt-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Detailed Predictions</CardTitle>
                  <CardDescription>Daily price predictions with confidence intervals</CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictionTable data={tableData} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-black py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <span className="font-semibold">StockPredict</span>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} StockPredict. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
