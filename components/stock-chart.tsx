"use client"

import { useEffect, useRef } from "react"

type StockChartProps = {
  data: {
    labels: string[]
    actual: (number | null)[]
    predicted: (number | null)[]
    upper: (number | null)[]
    lower: (number | null)[]
  }
}

export function StockChart({
  data = { labels: [], actual: [], predicted: [], upper: [], lower: [] },
}: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.labels.length) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min and max values for scaling
    const allValues = [
      ...data.actual.filter((v): v is number => v !== null),
      ...data.predicted.filter((v): v is number => v !== null),
      ...data.upper.filter((v): v is number => v !== null),
      ...data.lower.filter((v): v is number => v !== null),
    ]
    const minValue = Math.min(...allValues) * 0.99
    const maxValue = Math.max(...allValues) * 1.01
    const valueRange = maxValue - minValue

    // Draw background grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      const value = maxValue - (valueRange / 4) * i
      ctx.fillStyle = "#999"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(value.toFixed(2), padding - 5, y + 3)
    }

    // Vertical grid lines
    const step = chartWidth / (data.labels.length - 1)
    for (let i = 0; i < data.labels.length; i++) {
      const x = padding + step * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()

      // X-axis labels (show every 5th label to avoid crowding)
      if (i % 5 === 0 || i === data.labels.length - 1) {
        ctx.fillStyle = "#999"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(data.labels[i], x, height - padding + 15)
      }
    }

    // Function to convert data point to canvas coordinates
    const getX = (index: number) => padding + step * index
    const getY = (value: number | null) => {
      if (value === null) return null
      return padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    }

    // Draw confidence interval area
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)" // emerald-500 with low opacity
    ctx.beginPath()
    let started = false

    for (let i = 0; i < data.labels.length; i++) {
      const upperY = getY(data.upper[i])
      const lowerY = getY(data.lower[i])

      if (upperY !== null && lowerY !== null) {
        const x = getX(i)

        if (!started) {
          ctx.moveTo(x, lowerY)
          started = true
        } else {
          ctx.lineTo(x, lowerY)
        }
      }
    }

    // Complete the confidence interval area
    for (let i = data.labels.length - 1; i >= 0; i--) {
      const upperY = getY(data.upper[i])

      if (upperY !== null) {
        const x = getX(i)
        ctx.lineTo(x, upperY)
      }
    }

    ctx.closePath()
    ctx.fill()

    // Draw actual line
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.beginPath()

    let actualStarted = false
    for (let i = 0; i < data.labels.length; i++) {
      const y = getY(data.actual[i])

      if (y !== null) {
        const x = getX(i)

        if (!actualStarted) {
          ctx.moveTo(x, y)
          actualStarted = true
        } else {
          ctx.lineTo(x, y)
        }
      }
    }

    ctx.stroke()

    // Draw predicted line
    ctx.strokeStyle = "#10b981" // emerald-500
    ctx.lineWidth = 2
    ctx.beginPath()

    let predictedStarted = false
    for (let i = 0; i < data.labels.length; i++) {
      const y = getY(data.predicted[i])

      if (y !== null) {
        const x = getX(i)

        if (!predictedStarted) {
          ctx.moveTo(x, y)
          predictedStarted = true
        } else {
          ctx.lineTo(x, y)
        }
      }
    }

    ctx.stroke()

    // Draw legend
    const legendX = width - padding - 120
    const legendY = padding + 20

    // Actual line
    ctx.strokeStyle = "#fff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(legendX, legendY)
    ctx.lineTo(legendX + 20, legendY)
    ctx.stroke()

    ctx.fillStyle = "#fff"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Actual", legendX + 25, legendY + 4)

    // Predicted line
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(legendX, legendY + 20)
    ctx.lineTo(legendX + 20, legendY + 20)
    ctx.stroke()

    ctx.fillStyle = "#fff"
    ctx.fillText("Predicted", legendX + 25, legendY + 24)

    // Confidence interval
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)"
    ctx.fillRect(legendX, legendY + 40, 20, 10)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1
    ctx.strokeRect(legendX, legendY + 40, 20, 10)

    ctx.fillStyle = "#fff"
    ctx.fillText("Confidence", legendX + 25, legendY + 44)
  }, [data])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  )
}
