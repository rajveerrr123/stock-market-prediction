import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, LineChart, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-gray-800 bg-black">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">StockPredict</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Predict Stock Market Trends with <span className="text-emerald-500">Advanced AI</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                Get accurate stock market predictions powered by machine learning algorithms. Make informed investment
                decisions with our cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/predict">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Predict Stocks Now
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-900">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-950">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900">
                <div className="h-12 w-12 rounded-full bg-emerald-900 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Data Analysis</h3>
                <p className="text-gray-400">Our AI analyzes historical stock data to identify patterns and trends.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900">
                <div className="h-12 w-12 rounded-full bg-emerald-900 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Prediction Models</h3>
                <p className="text-gray-400">
                  Advanced machine learning models generate accurate stock price predictions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-900">
                <div className="h-12 w-12 rounded-full bg-emerald-900 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Investment Insights</h3>
                <p className="text-gray-400">Get actionable insights to make informed investment decisions.</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/predict">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Try Stock Prediction
                </Button>
              </Link>
            </div>
          </div>
        </section>
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
