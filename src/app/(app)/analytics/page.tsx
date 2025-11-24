'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, ShieldAlert, Zap } from "lucide-react";

const chartDataReplies = [
  { date: "2024-07-01", replies: 120 }, { date: "2024-07-02", replies: 150 }, { date: "2024-07-03", replies: 130 },
  { date: "2024-07-04", replies: 180 }, { date: "2024-07-05", replies: 210 }, { date: "2024-07-06", replies: 190 },
  { date: "2024-07-07", replies: 250 },
]

const chartConfigReplies: ChartConfig = {
  replies: {
    label: "Replies",
    color: "hsl(var(--primary))",
  },
}

const chartDataEngagement = [
  { name: "Template A", engagement: 2.5 }, { name: "Template B", engagement: 3.1 }, { name: "Template C", engagement: 2.2 },
  { name: "Template D", engagement: 4.5 }, { name: "Template E", engagement: 3.8 },
]

const chartConfigEngagement: ChartConfig = {
  engagement: {
    label: "Engagement %",
    color: "hsl(var(--accent))",
  },
}


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Analytics</h1>
        <p className="text-muted-foreground">Track performance and gain insights into your automated interactions.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5"/> Replies per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigReplies} className="h-64 w-full">
              <LineChart data={chartDataReplies} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric' })} />
                <YAxis />
                <RechartsTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="replies" stroke={chartConfigReplies.replies.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/> Engagement per Template</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigEngagement} className="h-64 w-full">
              <BarChart data={chartDataEngagement} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis unit="%" />
                <RechartsTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="engagement" fill={chartConfigEngagement.engagement.color} radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-5 h-5"/> Safety Flags by Type</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-center text-muted-foreground h-64">
            <p>Chart coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
