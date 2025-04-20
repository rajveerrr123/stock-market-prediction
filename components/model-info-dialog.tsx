"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ModelInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ModelInfoDialog({ open, onOpenChange }: ModelInfoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle>Stock Prediction Models</DialogTitle>
          <DialogDescription>Learn about the prediction models used in our application</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="lstm" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-950">
            <TabsTrigger value="lstm">LSTM Neural Network</TabsTrigger>
            <TabsTrigger value="linear">Linear Regression</TabsTrigger>
          </TabsList>
          <TabsContent value="lstm" className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">LSTM Neural Network</h3>
              <p className="text-sm text-gray-400">
                Long Short-Term Memory (LSTM) networks are a type of recurrent neural network capable of learning order
                dependence in sequence prediction problems. This makes them ideal for time series forecasting like stock
                price prediction.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">How it works:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Data is split into training (80%) and testing (20%) sets</li>
                <li>Stock prices are normalized to values between 0 and 1</li>
                <li>Sequences of 60 days are used to predict the next day's price</li>
                <li>The model contains multiple LSTM layers with dropout to prevent overfitting</li>
                <li>After training, the model can predict future prices based on recent data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Advantages:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Can capture complex patterns and non-linear relationships</li>
                <li>Better at handling long-term dependencies in time series data</li>
                <li>More accurate for volatile stocks with complex price movements</li>
                <li>Can adapt to changing market conditions</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="linear" className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Linear Regression</h3>
              <p className="text-sm text-gray-400">
                Linear regression is a simple statistical method that attempts to model the relationship between
                variables by fitting a linear equation to observed data. For stock prediction, it analyzes the trend in
                historical prices to forecast future values.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">How it works:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Historical price data is used to calculate a trend line</li>
                <li>The slope and intercept of this line are determined</li>
                <li>Future prices are predicted by extending this line</li>
                <li>Confidence intervals are calculated to show prediction uncertainty</li>
                <li>The model assumes a linear relationship between time and price</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Advantages:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                <li>Simple and computationally efficient</li>
                <li>Easy to interpret and understand</li>
                <li>Works well for stocks with clear trends</li>
                <li>Provides confidence intervals for predictions</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
