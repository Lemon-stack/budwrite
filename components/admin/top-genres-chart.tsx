"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Sample data - in a real app, this would come from your API
const generateData = () => {
  return [
    { name: "Adventure", value: 35 },
    { name: "Fantasy", value: 25 },
    { name: "Romance", value: 18 },
    { name: "Mystery", value: 12 },
    { name: "Sci-Fi", value: 10 },
  ]
}

const COLORS = ["#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"]

export function TopGenresChart() {
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
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              borderColor: "#4B5563",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#F9FAFB",
            }}
            formatter={(value) => [`${value}%`, "Percentage"]}
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value, entry, index) => {
              return <span style={{ color: "#6B7280" }}>{value}</span>
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
