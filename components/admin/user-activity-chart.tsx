"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

// Sample data - in a real app, this would come from your API
const generateData = () => {
  const data = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    data.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      activeUsers: Math.floor(Math.random() * 2000) + 3000,
      newUsers: Math.floor(Math.random() * 500) + 200,
      returningUsers: Math.floor(Math.random() * 1500) + 1000,
    })
  }

  return data
}

export function UserActivityChart() {
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
        <BarChart
          data={data}
          margin={{
            top: 20,
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
          <Bar dataKey="activeUsers" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="newUsers" fill="#ec4899" radius={[4, 4, 0, 0]} />
          <Bar dataKey="returningUsers" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
