import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useSurveyData } from "@/hooks/useSurveyData";
import { useMemo } from "react";

interface CustomerInsightsProps {
  selectedPeriod: string;
  selectedLocation: string;
}

const CustomerInsights = ({ selectedPeriod, selectedLocation }: CustomerInsightsProps) => {
  const { data: surveyData, isLoading, error } = useSurveyData();

  const processedData = useMemo(() => {
    if (!surveyData) return null;

    // Filter data based on selected filters
    let filteredData = surveyData;
    if (selectedLocation !== "all") {
      filteredData = surveyData.filter(item => item.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    // Location analysis
    const locationStats: { [key: string]: { total: number, count: number, ratings: number[] } } = {};

    // Attribute scores for radar chart
    const attributeScores = {
      foodQuality: { total: 0, count: 0 },
      serviceSpeed: { total: 0, count: 0 },
      staffFriendliness: { total: 0, count: 0 },
      cleanliness: { total: 0, count: 0 },
      valueForMoney: { total: 0, count: 0 },
      ambiance: { total: 0, count: 0 }
    };

    // Customer feedback insights
    const feedbackInsights = {
      positive: [],
      negative: [],
      neutral: []
    };

    filteredData.forEach(response => {
      const location = response.location || 'Unknown';

      // Location analysis
      if (!locationStats[location]) {
        locationStats[location] = { total: 0, count: 0, ratings: [] };
      }

      if (response.overallRating) {
        locationStats[location].total += response.overallRating;
        locationStats[location].count++;
        locationStats[location].ratings.push(response.overallRating);
      }

      // Attribute scoring
      const attributeMapping = {
        'Highly Satisfied': 5,
        'Satisfied': 4,
        'Neutral': 3,
        'Dissatisfied': 2,
        'Highly Dissatisfied': 1
      };

      Object.keys(attributeScores).forEach(attr => {
        const value = response[attr as keyof typeof response];
        if (value && typeof value === 'string' && attributeMapping[value as keyof typeof attributeMapping]) {
          attributeScores[attr as keyof typeof attributeScores].total += attributeMapping[value as keyof typeof attributeMapping];
          attributeScores[attr as keyof typeof attributeScores].count++;
        }
      });

      // Feedback categorization
      if (response.comments) {
        const rating = response.overallRating || 3;
        if (rating >= 4) {
          feedbackInsights.positive.push(response.comments);
        } else if (rating <= 2) {
          feedbackInsights.negative.push(response.comments);
        } else {
          feedbackInsights.neutral.push(response.comments);
        }
      }
    });

    // Convert location stats to chart data
    const locationData = Object.entries(locationStats).map(([location, stats]) => ({
      location,
      averageRating: Number((stats.total / stats.count).toFixed(2)),
      responseCount: stats.count,
      satisfaction: stats.count > 0 ? Math.round((stats.ratings.filter(r => r >= 4).length / stats.count) * 100) : 0
    }));

    // Convert attribute scores to radar data
    const radarData = Object.entries(attributeScores).map(([attribute, data]) => ({
      attribute: attribute.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Convert camelCase to Title Case
      score: data.count > 0 ? Number(((data.total / data.count) * 20).toFixed(1)) : 0
    }));

    return {
      locationData,
      radarData,
      feedbackInsights,
      totalCustomers: filteredData.length,
      averageOverallRating: filteredData.reduce((sum, item) => sum + (item.overallRating || 0), 0) / filteredData.length
    };
  }, [surveyData, selectedLocation]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">Loading customer insights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center text-red-600">Error loading customer insights</div>
      </div>
    );
  }

  if (!processedData) {
    return (
      <div className="space-y-6">
        <div className="text-center">No customer data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium text-gray-600">
              Total Customers Surveyed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{processedData.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium text-gray-600">
              Average Overall Rating
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {processedData.averageOverallRating.toFixed(1)}/5
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium text-gray-600">
              Most Popular Location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">
              {processedData.locationData.sort((a, b) => b.responseCount - a.responseCount)[0]?.location || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🏢</span>
              Location Performance
            </CardTitle>
            <CardDescription>
              Average ratings and satisfaction by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageRating" fill="#3B82F6" name="Avg Rating" />
                <Bar dataKey="satisfaction" fill="#10B981" name="Satisfaction %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attribute Performance Radar */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⭐</span>
              Service Attribute Scores
            </CardTitle>
            <CardDescription>
              Performance across different service attributes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={processedData.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="attribute" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Customer Feedback Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-600 flex items-center gap-2">
              <span>😊</span>
              Positive Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {processedData.feedbackInsights.positive.slice(0, 3).map((comment, index) => (
                <div key={index} className="text-sm bg-green-50 p-2 rounded">
                  "{comment}"
                </div>
              ))}
              {processedData.feedbackInsights.positive.length === 0 && (
                <p className="text-gray-500 text-sm">No positive feedback yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-yellow-200 flex items-center gap-2">
              <span>😐</span>
              Neutral Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {processedData.feedbackInsights.neutral.slice(0, 3).map((comment, index) => (
                <div key={index} className="text-sm bg-yellow-50 p-2 rounded">
                  "{comment}"
                </div>
              ))}
              {processedData.feedbackInsights.neutral.length === 0 && (
                <p className="text-gray-500 text-sm">No neutral feedback yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <span>😞</span>
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {processedData.feedbackInsights.negative.slice(0, 3).map((comment, index) => (
                <div key={index} className="text-sm bg-red-50 p-2 rounded">
                  "{comment}"
                </div>
              ))}
              {processedData.feedbackInsights.negative.length === 0 && (
                <p className="text-gray-500 text-sm">No negative feedback yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerInsights;