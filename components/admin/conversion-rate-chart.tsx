"use client"

import { useEffect, useState } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data - in a real app, this would come from your API
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate a conversion rate between 65% and 85%
    const rate = 65 + Math.random() * 20

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: Number.parseFloat(rate.toFixed(1)),
    })
  }

  return data
}

export function ConversionRateChart() {
  const [data, setData] = useState([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setData(generateData())
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[60, 90]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              borderColor: "#4B5563",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#F9FAFB",
            }}
            formatter={(value) => [`${value}%`, "Conversion Rate"]}
          />
          <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="url(#colorRate)" strokeWidth={2} />
          <defs>
            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
