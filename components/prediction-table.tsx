"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

type PredictionTableProps = {
  data: Array<{
    date: string
    actual: number | null
    predicted: number
    lower: number
    upper: number
    confidence: number
    change: number
  }>
}

export function PredictionTable({ data = [] }: PredictionTableProps) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-gray-900">
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actual Price</TableHead>
            <TableHead className="text-right">Predicted Price</TableHead>
            <TableHead className="text-right">Lower Bound</TableHead>
            <TableHead className="text-right">Upper Bound</TableHead>
            <TableHead className="text-right">Confidence</TableHead>
            <TableHead className="text-right">Change</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((prediction) => (
            <TableRow key={prediction.date} className="hover:bg-gray-900">
              <TableCell className="font-medium">{prediction.date}</TableCell>
              <TableCell className="text-right">
                {prediction.actual ? `$${prediction.actual.toFixed(2)}` : "-"}
              </TableCell>
              <TableCell className="text-right">${prediction.predicted.toFixed(2)}</TableCell>
              <TableCell className="text-right">${prediction.lower.toFixed(2)}</TableCell>
              <TableCell className="text-right">${prediction.upper.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={prediction.confidence > 80 ? "default" : "outline"}
                  className={
                    prediction.confidence > 80
                      ? "bg-emerald-900 text-emerald-200 hover:bg-emerald-900"
                      : "border-gray-700 text-gray-400"
                  }
                >
                  {prediction.confidence}%
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  {prediction.change > 0 ? (
                    <>
                      <TrendingUp className="mr-1 h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-500">+{prediction.change.toFixed(2)}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                      <span className="text-red-500">{prediction.change.toFixed(2)}%</span>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
