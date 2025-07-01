import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useSurveyData } from "@/hooks/useSurveyData";
import { useMemo } from "react";

interface SurveyOverviewProps {
  selectedPeriod: string;
  selectedLocation: string;
}

const SurveyOverview = ({ selectedPeriod, selectedLocation }: SurveyOverviewProps) => {
  const { data: surveyData, isLoading, error } = useSurveyData();

  const processedData = useMemo(() => {
    if (!surveyData) return null;

    // Filter data based on selected filters
    let filteredData = surveyData;
    if (selectedLocation !== "all") {
      filteredData = surveyData.filter(item => item.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    // Calculate satisfaction distribution
    const satisfactionCounts = {
      "Highly Satisfied": 0,
      "Satisfied": 0,
      "Neutral": 0,
      "Dissatisfied": 0,
      "Highly Dissatisfied": 0
    };

    let totalRating = 0;
    let ratingCount = 0;

    filteredData.forEach(response => {
      // Count overall satisfaction based on average of all attributes
      const attributes = [
        response.foodQuality,
        response.serviceSpeed,
        response.staffFriendliness,
        response.cleanliness,
        response.valueForMoney,
        response.ambiance
      ];

      const satisfiedCount = attributes.filter(attr => 
        attr === "Highly Satisfied" || attr === "Satisfied"
      ).length;

      if (satisfiedCount >= 4) {
        satisfactionCounts["Highly Satisfied"]++;
      } else if (satisfiedCount >= 3) {
        satisfactionCounts["Satisfied"]++;
      } else if (satisfiedCount >= 2) {
        satisfactionCounts["Neutral"]++;
      } else if (satisfiedCount >= 1) {
        satisfactionCounts["Dissatisfied"]++;
      } else {
        satisfactionCounts["Highly Dissatisfied"]++;
      }

      if (response.overallRating) {
        totalRating += response.overallRating;
        ratingCount++;
      }
    });

    const total = Object.values(satisfactionCounts).reduce((a, b) => a + b, 0);
    const satisfactionRate = total > 0 ? 
      ((satisfactionCounts["Highly Satisfied"] + satisfactionCounts["Satisfied"]) / total * 100).toFixed(1) : "0";
    
    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0";

    const overallSatisfactionData = Object.entries(satisfactionCounts).map(([name, value]) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: {
        "Highly Satisfied": "#10B981",
        "Satisfied": "#3B82F6", 
        "Neutral": "#F59E0B",
        "Dissatisfied": "#EF4444",
        "Highly Dissatisfied": "#DC2626"
      }[name]
    }));

    return {
      overallSatisfactionData,
      satisfactionRate,
      averageRating,
      totalResponses: total,
      responseRate: "94.1" // Hardcoded as per original code; consider making this dynamic
    };
  }, [surveyData, selectedLocation]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading survey data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">Error loading survey data</div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="space-y-6">
        <div className="text-center">No survey data available</div>
      </div>
    );
  }

  const kpiData = [
    { title: "Total Responses", value: processedData.totalResponses.toString(), change: "+12%", trend: "up" },
    { title: "Satisfaction Rate", value: `${processedData.satisfactionRate}%`, change: "+3.4%", trend: "up" },
    { title: "Average Rating", value: `${processedData.averageRating}/5`, change: "+0.2", trend: "up" },
    { title: "Response Rate", value: `${processedData.responseRate}%`, change: "-1.2%", trend: "down" }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
                <div className={`flex items-center text-sm ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="mr-1">
                    {kpi.trend === 'up' ? '↗️' : '↘️'}
                  </span>
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        {/* Overall Satisfaction Pie Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span>
              Overall Satisfaction Distribution
            </CardTitle>
            <CardDescription>
              Customer satisfaction levels across all surveys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={processedData.overallSatisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {processedData.overallSatisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Survey Summary Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{processedData.satisfactionRate}%</div>
              <div className="text-sm text-gray-600 mt-1">Overall Satisfaction Rate</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{processedData.averageRating}/5</div>
              <div className="text-sm text-gray-600 mt-1">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{processedData.totalResponses}</div>
              <div className="text-sm text-gray-600 mt-1">Total Survey Responses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyOverview;