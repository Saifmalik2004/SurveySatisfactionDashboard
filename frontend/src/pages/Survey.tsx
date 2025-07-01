
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Survey = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    foodQuality: "",
    serviceSpeed: "",
    staffFriendliness: "",
    cleanliness: "",
    valueForMoney: "",
    ambiance: "",
    overallRating: "",
    comments: ""
  });

  const satisfactionLevels = [
    "Highly Satisfied",
    "Satisfied", 
    "Neutral",
    "Dissatisfied",
    "Highly Dissatisfied"
  ];

  const locations = ["Downtown", "Uptown", "Suburban"];

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:8080/api/survey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerName: formData.customerName,
        location: formData.location,
        foodQuality: formData.foodQuality,
        serviceSpeed: formData.serviceSpeed,
        staffFriendliness: formData.staffFriendliness,
        cleanliness: formData.cleanliness,
        valueForMoney: formData.valueForMoney,
        ambiance: formData.ambiance,
        overallRating: parseFloat(formData.overallRating),
        comments: formData.comments
      }),
    });

    if (!response.ok) throw new Error("Failed to submit");

    toast({
      title: "Survey Submitted Successfully!",
      description: "Thank you for your feedback. Your response has been recorded.",
    });

    setFormData({
      customerName: "",
      location: "",
      foodQuality: "",
      serviceSpeed: "",
      staffFriendliness: "",
      cleanliness: "",
      valueForMoney: "",
      ambiance: "",
      overallRating: "",
      comments: ""
    });

  } catch (error) {
    console.error("Error submitting survey:", error);
    toast({
      title: "Error",
      description: "There was an error submitting your survey. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Customer Satisfaction Survey
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Help us improve by sharing your experience with our food, service, and overall satisfaction
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📝</span>
              Share Your Experience
            </CardTitle>
            <CardDescription>
              Your feedback is valuable to us. Please take a few minutes to rate your experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => setFormData({...formData, location: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Food Quality *</Label>
                  <Select 
                    value={formData.foodQuality} 
                    onValueChange={(value) => setFormData({...formData, foodQuality: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate food quality" />
                    </SelectTrigger>
                    <SelectContent>
                      {satisfactionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Service Speed *</Label>
                  <Select 
                    value={formData.serviceSpeed} 
                    onValueChange={(value) => setFormData({...formData, serviceSpeed: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate service speed" />
                    </SelectTrigger>
                    <SelectContent>
                      {satisfactionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Staff Friendliness *</Label>
                  <Select 
                    value={formData.staffFriendliness} 
                    onValueChange={(value) => setFormData({...formData, staffFriendliness: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate staff friendliness" />
                    </SelectTrigger>
                    <SelectContent>
                      {satisfactionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cleanliness *</Label>
                  <Select 
                    value={formData.cleanliness} 
                    onValueChange={(value) => setFormData({...formData, cleanliness: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate cleanliness" />
                    </SelectTrigger>
                    <SelectContent>
                      {satisfactionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Value for Money *</Label>
                  <Select 
                    value={formData.valueForMoney} 
                    onValueChange={(value) => setFormData({...formData, valueForMoney: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate value for money" />
                    </SelectTrigger>
                    <SelectContent>
                      {satisfactionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Ambiance *</Label>
                  <Select 
                    value={formData.ambiance} 
                    onValueChange={(value) => setFormData({...formData, ambiance: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate ambiance" />
                    </SelectTrigger>
                    <SelectContent>
                      {satisfactionLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overallRating">Overall Rating (1-5) *</Label>
                <Input
                  id="overallRating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.overallRating}
                  onChange={(e) => setFormData({...formData, overallRating: e.target.value})}
                  placeholder="Rate your overall experience (1-5)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Additional Comments</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData({...formData, comments: e.target.value})}
                  placeholder="Share any additional feedback or suggestions..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Survey"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Survey;
