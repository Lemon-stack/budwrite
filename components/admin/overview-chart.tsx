"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Sample data - in a real app, this would come from your API
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      stories: Math.floor(Math.random() * 300) + 500,
      images: Math.floor(Math.random() * 400) + 700,
    })
  }

  return data
}

export function OverviewChart() {
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
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              borderColor: "#4B5563",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#F9FAFB",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="stories" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="images" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
