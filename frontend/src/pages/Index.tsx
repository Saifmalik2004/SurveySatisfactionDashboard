
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SurveyOverview from "@/components/SurveyOverview";
import AttributeAnalysis from "@/components/AttributeAnalysis";
import CustomerInsights from "@/components/CustomerInsights";
import DataTable from "@/components/DataTable";

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Customer Satisfaction Survey Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive analysis of customer satisfaction data including food quality, hygiene, 
            service ratings, and overall satisfaction metrics
          </p>
          <Button 
            onClick={() => navigate('/survey')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            📝 Submit New Survey
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              Filters & Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="last180">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="downtown">Downtown Branch</SelectItem>
                  <SelectItem value="uptown">Uptown Branch</SelectItem>
                  <SelectItem value="suburban">Suburban Branch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-md rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              📈 Overview
            </TabsTrigger>
            <TabsTrigger value="attributes" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              🔍 Attribute Analysis
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              💡 Customer Insights
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              📋 Raw Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SurveyOverview selectedPeriod={selectedPeriod} selectedLocation={selectedLocation} />
          </TabsContent>

          <TabsContent value="attributes" className="space-y-6">
            <AttributeAnalysis selectedPeriod={selectedPeriod} selectedLocation={selectedLocation} />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <CustomerInsights selectedPeriod={selectedPeriod} selectedLocation={selectedLocation} />
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataTable selectedPeriod={selectedPeriod} selectedLocation={selectedLocation} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
