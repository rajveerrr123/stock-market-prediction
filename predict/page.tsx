"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, ArrowLeft, ArrowRight, FileText, Download, RefreshCw, Brain, LineChart, Info } from "lucide-react"
import { AdvancedStockChart } from "@/components/advanced-stock-chart"
import { PredictionTable } from "@/components/prediction-table"
import { processFile, sampleCSVData, parseCSV } from "@/lib/file-processor"
import { generateSampleData } from "@/lib/prediction-model"
import { predictWithLSTM } from "@/lib/lstm-model"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ModelInfoDialog } from "@/components/model-info-dialog"

export default function PredictPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [stockSymbol, setStockSymbol] = useState("")
  const [predictionDays, setPredictionDays] = useState("7")
  const [inputMethod, setInputMethod] = useState<"file" | "symbol">("file")
  const [chartData, setChartData] = useState({
    labels: [],
    actual: [],
    predicted: [],
    upper: [],
    lower: [],
    trainingData: [],
    testingData: [],
  })
  const [tableData, setTableData] = useState([])
  const [error, setError] = useState("")
  const [predictionComplete, setPredictionComplete] = useState(false)
  const [modelInfoOpen, setModelInfoOpen] = useState(false)
  const [modelType, setModelType] = useState<"lstm" | "linear">("lstm")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handleInputMethodChange = (value: string) => {
    setInputMethod(value as "file" | "symbol")
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

      // Use LSTM model for prediction
      if (modelType === "lstm") {
        const result = await predictWithLSTM(dates, prices, days)

        setChartData({
          labels: result.labels,
          actual: result.actual,
          predicted: result.predicted,
          upper: result.upper,
          lower: result.lower,
          trainingData: result.trainingData,
          testingData: result.testingData,
        })
        setTableData(result.tableData)
      } else {
        // Fallback to linear model
        const { processStockData } = await import("@/lib/prediction-model")
        const result = processStockData(dates, prices, days)

        setChartData({
          labels: result.labels,
          actual: result.actual,
          predicted: result.predicted,
          upper: result.upper,
          lower: result.lower,
          trainingData: [],
          testingData: [],
        })
        setTableData(result.tableData)
      }

      setPredictionComplete(true)
      setStep(3)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseDemoData = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Parse the sample CSV data
      const { dates, prices } = parseCSV(sampleCSVData)

      // Process data and generate predictions
      const days = Number.parseInt(predictionDays)

      // Use LSTM model for prediction
      if (modelType === "lstm") {
        const result = await predictWithLSTM(dates, prices, days)

        setChartData({
          labels: result.labels,
          actual: result.actual,
          predicted: result.predicted,
          upper: result.upper,
          lower: result.lower,
          trainingData: result.trainingData,
          testingData: result.testingData,
        })
        setTableData(result.tableData)
      } else {
        // Fallback to linear model
        const { processStockData } = await import("@/lib/prediction-model")
        const result = processStockData(dates, prices, days)

        setChartData({
          labels: result.labels,
          actual: result.actual,
          predicted: result.predicted,
          upper: result.upper,
          lower: result.lower,
          trainingData: [],
          testingData: [],
        })
        setTableData(result.tableData)
      }

      setPredictionComplete(true)
      setStep(3)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">StockPredict</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/prediction">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Advanced Stock Prediction</h1>
              <p className="text-gray-400">Using LSTM Neural Networks for accurate forecasting</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700"
                    onClick={() => setModelInfoOpen(true)}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn about our prediction model</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <ModelInfoDialog open={modelInfoOpen} onOpenChange={setModelInfoOpen} />
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
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
                  <Brain className="h-5 w-5" />
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
                  <LineChart className="h-5 w-5" />
                </div>
                <span className="text-sm mt-2">Results</span>
              </div>
            </div>
          </div>

          {error && <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-md text-red-400">{error}</div>}

          {/* Step 1: Input Data */}
          {step === 1 && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Step 1: Choose Your Data Source</CardTitle>
                <CardDescription>Upload a file or select a stock symbol to begin</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="file" onValueChange={handleInputMethodChange}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-950">
                    <TabsTrigger value="file">Upload File</TabsTrigger>
                    <TabsTrigger value="symbol">Select Stock</TabsTrigger>
                  </TabsList>
                  <TabsContent value="file" className="space-y-4 pt-4">
                    <div className="grid w-full items-center gap-2">
                      <Label htmlFor="file">Upload Stock Data File</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="file"
                          type="file"
                          onChange={handleFileUpload}
                          className="bg-gray-950 border-gray-800"
                          accept=".csv"
                        />
                      </div>
                      <p className="text-xs text-gray-400">
                        Upload CSV file with date and price columns.
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs text-emerald-500"
                          onClick={handleUseDemoData}
                        >
                          Or use demo data
                        </Button>
                      </p>
                    </div>
                    {file && (
                      <div className="p-3 bg-gray-800 rounded-md">
                        <p className="text-sm font-medium">Selected file: {file.name}</p>
                        <p className="text-xs text-gray-400">Size: {(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="symbol" className="space-y-4 pt-4">
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
                      <p className="text-xs text-gray-400">Select from our list of popular stocks</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-gray-700" onClick={() => router.push("/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
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
                  <Label htmlFor="model">Prediction Model</Label>
                  <Select value={modelType} onValueChange={(value) => setModelType(value as "lstm" | "linear")}>
                    <SelectTrigger className="bg-gray-950 border-gray-800">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="lstm">LSTM Neural Network (Advanced)</SelectItem>
                      <SelectItem value="linear">Linear Regression (Simple)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400">
                    LSTM models are better for capturing complex patterns in time series data
                  </p>
                </div>

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
                      <span>{modelType === "lstm" ? "LSTM Neural Network" : "Linear Regression"}</span>
                    </div>
                    {modelType === "lstm" && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Training Split:</span>
                        <span>80% training, 20% testing</span>
                      </div>
                    )}
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
          {step === 3 && predictionComplete && (
            <>
              <Card className="bg-gray-900 border-gray-800 mb-8">
                <CardHeader>
                  <CardTitle>Step 3: Prediction Results</CardTitle>
                  <CardDescription>
                    {modelType === "lstm"
                      ? "LSTM Neural Network prediction results"
                      : "Linear regression prediction results"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] mb-6">
                    <AdvancedStockChart data={chartData} modelType={modelType} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Model Performance</h3>
                      <p className="text-sm text-gray-400">
                        {modelType === "lstm"
                          ? "The LSTM model was trained on 80% of historical data and tested on 20% before making predictions."
                          : "The linear regression model analyzes trends in historical data to make future predictions."}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Prediction Accuracy</h3>
                      <p className="text-sm text-gray-400">
                        {modelType === "lstm"
                          ? "LSTM models can capture complex patterns and non-linear relationships in time series data."
                          : "Linear models work best when stock prices follow clear trends without significant volatility."}
                      </p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-md">
                      <h3 className="text-lg font-medium mb-2">Interpretation</h3>
                      <p className="text-sm text-gray-400">
                        {modelType === "lstm"
                          ? "Wider confidence intervals indicate higher uncertainty in the prediction."
                          : "The shaded area represents the 95% confidence interval for predictions."}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="border-gray-700" onClick={() => setStep(2)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Adjust Parameters
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
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
