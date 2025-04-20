"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, FileText, BarChart3, TrendingUp, RefreshCw } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { PredictionTable } from "@/components/prediction-table"
import { processFile, sampleCSVData, parseCSV } from "@/lib/file-processor"
import { generateSampleData, processStockData } from "@/lib/prediction-model"

export function PredictionWizard() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [stockSymbol, setStockSymbol] = useState("")
  const [predictionDays, setPredictionDays] = useState("7")
  const [inputMethod, setInputMethod] = useState<"file" | "symbol">("file")
  const [chartData, setChartData] = useState({ labels: [], actual: [], predicted: [], upper: [], lower: [] })
  const [tableData, setTableData] = useState([])
  const [error, setError] = useState("")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handleNextStep = async () => {
    if (step === 1) {
      // Validate input method selection
      if (inputMethod === "file" && !file) {
        setError("Please upload a file")
        return
      }
      if (inputMethod === "symbol" && !stockSymbol) {
        setError("Please select a stock symbol")
        return
      }
      setStep(2)
      setError("")
    } else if (step === 2) {
      // Process prediction
      await handlePrediction()
    }
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    setError("")
  }

  const handlePrediction = async () => {
    setIsLoading(true)
    setError("")

    try {
      let dates: string[] = []
      let prices: number[] = []

      if (inputMethod === "file" && file) {
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
      } else if (inputMethod === "symbol" && stockSymbol) {
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
      setStep(3)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-emerald-600" : "bg-gray-700"}`}
          >
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-sm mt-2">Input Data</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-gray-700">
          <div
            className={`h-full ${step >= 2 ? "bg-emerald-600" : "bg-gray-700"}`}
            style={{ width: step >= 2 ? "100%" : "0%" }}
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-emerald-600" : "bg-gray-700"}`}
          >
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="text-sm mt-2">Configure</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-gray-700">
          <div
            className={`h-full ${step >= 3 ? "bg-emerald-600" : "bg-gray-700"}`}
            style={{ width: step >= 3 ? "100%" : "0%" }}
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-emerald-600" : "bg-gray-700"}`}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <span className="text-sm mt-2">Results</span>
        </div>
      </div>

      {error && <div className="p-4 bg-red-900/20 border border-red-800 rounded-md text-red-400">{error}</div>}

      {/* Step 1: Input Data */}
      {step === 1 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Step 1: Choose Your Data Source</CardTitle>
            <CardDescription>Upload a file or select a stock symbol to begin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-md border-2 cursor-pointer ${
                  inputMethod === "file" ? "border-emerald-500 bg-gray-800" : "border-gray-700 bg-gray-900"
                }`}
                onClick={() => setInputMethod("file")}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <FileText className={`h-8 w-8 ${inputMethod === "file" ? "text-emerald-500" : "text-gray-400"}`} />
                  <h3 className="font-medium">Upload CSV File</h3>
                  <p className="text-xs text-gray-400">Use your own historical stock data</p>
                </div>
              </div>
              <div
                className={`p-4 rounded-md border-2 cursor-pointer ${
                  inputMethod === "symbol" ? "border-emerald-500 bg-gray-800" : "border-gray-700 bg-gray-900"
                }`}
                onClick={() => setInputMethod("symbol")}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <TrendingUp
                    className={`h-8 w-8 ${inputMethod === "symbol" ? "text-emerald-500" : "text-gray-400"}`}
                  />
                  <h3 className="font-medium">Select Stock Symbol</h3>
                  <p className="text-xs text-gray-400">Choose from our list of stocks</p>
                </div>
              </div>
            </div>

            {inputMethod === "file" && (
              <div className="space-y-2">
                <Label htmlFor="file">Upload Stock Data File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  className="bg-gray-950 border-gray-800"
                  accept=".csv"
                />
                <p className="text-xs text-gray-400">Upload CSV file with date and price columns</p>

                {file && (
                  <div className="p-3 bg-gray-800 rounded-md">
                    <p className="text-sm font-medium">Selected file: {file.name}</p>
                    <p className="text-xs text-gray-400">Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </div>
            )}

            {inputMethod === "symbol" && (
              <div className="space-y-2">
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
                <p className="text-xs text-gray-400">Select from our list of popular stocks</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleNextStep}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Configure Prediction */}
      {step === 2 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Step 2: Configure Prediction Settings</CardTitle>
            <CardDescription>Set parameters for your stock prediction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="days">Prediction Timeframe</Label>
              <Select value={predictionDays} onValueChange={setPredictionDays}>
                <SelectTrigger className="bg-gray-950 border-gray-800">
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800">
                  <SelectItem value="1">1 Day (Short-term)</SelectItem>
                  <SelectItem value="7">7 Days (Weekly forecast)</SelectItem>
                  <SelectItem value="30">30 Days (Monthly forecast)</SelectItem>
                  <SelectItem value="90">90 Days (Quarterly forecast)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">How far into the future you want to predict</p>
            </div>

            <div className="p-4 bg-gray-800 rounded-md">
              <h3 className="font-medium mb-2">Prediction Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Data Source:</span>
                  <span>
                    {inputMethod === "file" ? (file ? file.name : "Demo data") : `Stock Symbol: ${stockSymbol}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prediction Period:</span>
                  <span>{predictionDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Algorithm:</span>
                  <span>Linear Regression with Confidence Intervals</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="border-gray-700" onClick={handlePrevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Step
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleNextStep} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Generate Prediction
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <>
          <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle>Step 3: Prediction Results</CardTitle>
              <CardDescription>Your stock price prediction is ready</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mb-6">
                <StockChart data={chartData} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Prediction Summary</h3>
                  <p className="text-sm text-gray-400">
                    Based on historical data, we've predicted stock prices for the next {predictionDays} days with
                    confidence intervals.
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Confidence Levels</h3>
                  <p className="text-sm text-gray-400">
                    The shaded area represents the range where prices are likely to fall with 95% confidence.
                  </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-2">Interpretation</h3>
                  <p className="text-sm text-gray-400">
                    Wider confidence intervals indicate higher uncertainty in the prediction.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="border-gray-700" onClick={handlePrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Adjust Parameters
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">Download Results</Button>
            </CardFooter>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Detailed Predictions</CardTitle>
              <CardDescription>Daily price predictions with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <PredictionTable data={tableData} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
