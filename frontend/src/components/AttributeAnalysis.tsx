import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useSurveyData } from "@/hooks/useSurveyData";
import { useMemo } from "react";

interface AttributeAnalysisProps {
  selectedPeriod: string;
  selectedLocation: string;
}

const AttributeAnalysis = ({ selectedPeriod, selectedLocation }: AttributeAnalysisProps) => {
  const { data: surveyData, isLoading, error } = useSurveyData();

  const processedData = useMemo(() => {
    if (!surveyData) return null;

    // Filter data based on selected filters
    let filteredData = surveyData;
    if (selectedLocation !== "all") {
      filteredData = surveyData.filter(item => item.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    const attributes = [
      { key: 'foodQuality', name: 'Food Quality' },
      { key: 'serviceSpeed', name: 'Service Speed' },
      { key: 'staffFriendliness', name: 'Staff Friendliness' },
      { key: 'cleanliness', name: 'Cleanliness' },
      { key: 'valueForMoney', name: 'Value for Money' },
      { key: 'ambiance', name: 'Ambiance' }
    ];

    const attributeRatings = attributes.map(attr => {
      const responses = filteredData.length;
      let totalScore = 0;

      filteredData.forEach(response => {
        const value = response[attr.key as keyof typeof response] as string;
        const score = {
          'Highly Satisfied': 5,
          'Satisfied': 4,
          'Neutral': 3,
          'Dissatisfied': 2,
          'Highly Dissatisfied': 1
        }[value] || 0;
        totalScore += score;
      });

      const rating = responses > 0 ? (totalScore / responses).toFixed(1) : "0";
      return {
        attribute: attr.name,
        rating: parseFloat(rating),
        responses
      };
    });

    const detailedBreakdown = attributes.map(attr => {
      const counts = {
        'Highly Satisfied': 0,
        'Satisfied': 0,
        'Neutral': 0,
        'Dissatisfied': 0,
        'Highly Dissatisfied': 0
      };

      filteredData.forEach(response => {
        const value = response[attr.key as keyof typeof response] as string;
        if (counts.hasOwnProperty(value)) {
          counts[value as keyof typeof counts]++;
        }
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0);

      return {
        attribute: attr.name,
        'Highly Satisfied': total > 0 ? Math.round((counts['Highly Satisfied'] / total) * 100) : 0,
        'Satisfied': total > 0 ? Math.round((counts['Satisfied'] / total) * 100) : 0,
        'Neutral': total > 0 ? Math.round((counts['Neutral'] / total) * 100) : 0,
        'Dissatisfied': total > 0 ? Math.round((counts['Dissatisfied'] / total) * 100) : 0,
        'Highly Dissatisfied': total > 0 ? Math.round((counts['Highly Dissatisfied'] / total) * 100) : 0
      };
    });

    const radarData = attributeRatings.map(item => ({
      attribute: item.attribute,
      score: item.rating * 20 // Convert to 100 scale for radar
    }));

    return {
      attributeRatings,
      detailedBreakdown,
      radarData
    };
  }, [surveyData, selectedLocation]);

  if (isLoading) {
    return <div className="text-center">Loading attribute analysis...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error loading attribute data</div>;
  }

  if (!processedData) {
    return <div className="text-center">No attribute data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Attribute Ratings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedData.attributeRatings.map((attr, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{attr.attribute}</CardTitle>
              <CardDescription>{attr.responses.toLocaleString()} responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-blue-600">{attr.rating}/5</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= Math.round(attr.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(attr.rating / 5) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Radar Chart */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🎯</span>
            Attribute Performance Radar
          </CardTitle>
          <CardDescription>
            Comparative view of all attribute ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData.radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="attribute" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Satisfaction Score"
                dataKey="score"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            Detailed Attribute Breakdown
          </CardTitle>
          <CardDescription>
            Satisfaction levels for each attribute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={processedData.detailedBreakdown}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="attribute"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Highly Satisfied" stackId="a" fill="#10B981" />
              <Bar dataKey="Satisfied" stackId="a" fill="#3B82F6" />
              <Bar dataKey="Neutral" stackId="a" fill="#F59E0B" />
              <Bar dataKey="Dissatisfied" stackId="a" fill="#EF4444" />
              <Bar dataKey="Highly Dissatisfied" stackId="a" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttributeAnalysis;