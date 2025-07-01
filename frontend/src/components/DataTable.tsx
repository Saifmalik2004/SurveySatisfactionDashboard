import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSurveyData } from "@/hooks/useSurveyData";

interface DataTableProps {
  selectedPeriod: string;
  selectedLocation: string;
}

const DataTable = ({ selectedPeriod, selectedLocation }: DataTableProps) => {
  const { data: surveyData, isLoading, error } = useSurveyData();
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on selected filters and search term
  const filteredData = surveyData?.filter(item => {
    const matchesLocation = selectedLocation === "all" || item.customers?.location.toLowerCase() === selectedLocation.toLowerCase();
    const matchesSearch = !searchTerm || (
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comments?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Optional: Add period filtering if needed (e.g., based on created_at)
    return matchesLocation && matchesSearch;
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Export to CSV
  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        'Customer Name', 'Location', 'Visit Date', 'Food Quality', 'Service Speed',
        'Staff Friendliness', 'Cleanliness', 'Value for Money', 'Ambiance',
        'Overall Rating', 'Comments', 'Submission Date'
      ];

      const csvData = filteredData.map(response => [
        response.customerName || '',
        response.location || '',
        response.visitDate || '',
        response.foodQuality || '',
        response.serviceSpeed || '',
        response.staffFriendliness || '',
        response.cleanliness || '',
        response.valueForMoney || '',
        response.ambiance || '',
        response.overallRating || '',
        response.comments || '',
        new Date(response.created_at).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(cell => 
            typeof cell === 'string' && cell.includes(',') 
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell
          ).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `survey-responses-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const headers = [
        'Customer Name', 'Location', 'Visit Date', 'Food Quality', 'Service Speed',
        'Staff Friendliness', 'Cleanliness', 'Value for Money', 'Ambiance',
        'Overall Rating', 'Comments', 'Submission Date'
      ];

      const excelData = filteredData.map(response => [
        response.customerName || '',
        response.location || '',
        response.visitDate || '',
        response.foodQuality || '',
        response.serviceSpeed || '',
        response.staffFriendliness || '',
        response.cleanliness || '',
        response.valueForMoney || '',
        response.ambiance || '',
        response.overallRating || '',
        response.comments || '',
        new Date(response.created_at).toLocaleDateString()
      ]);

      const tsvContent = [
        headers.join('\t'),
        ...excelData.map(row => row.join('\t'))
      ].join('\n');

      const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `survey-responses-${new Date().toISOString().split('T')[0]}.xls`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting Excel:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Satisfaction color mapping
  const getSatisfactionColor = (level: string) => {
    switch (level) {
      case "Highly Satisfied": return "bg-green-100 text-green-800";
      case "Satisfied": return "bg-blue-100 text-blue-800";
      case "Neutral": return "bg-yellow-100 text-yellow-800";
      case "Dissatisfied": return "bg-orange-100 text-orange-800";
      case "Highly Dissatisfied": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>📋</span>
              Raw Survey Data
            </span>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isExporting}>
                    📊 Export Excel
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Export Survey Data to Excel</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will download all survey responses ({filteredData.length} records) as an Excel file (.xls). 
                      Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={exportToExcel} disabled={isExporting}>
                      {isExporting ? 'Exporting...' : 'Yes, Export'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isExporting}>
                    📄 Export CSV
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Export Survey Data to CSV</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will download all survey responses ({filteredData.length} records) as a CSV file. 
                      Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={exportToCSV} disabled={isExporting}>
                      {isExporting ? 'Exporting...' : 'Yes, Export'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
          <CardDescription>
            Complete survey responses with customer details and ratings ({filteredData.length} records)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 flex gap-4">
            <Input
              placeholder="Search by customer name, location, or comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Food Quality</TableHead>
                  <TableHead>Service Speed</TableHead>
                  <TableHead>Staff Friendliness</TableHead>
                  <TableHead>Cleanliness</TableHead>
                  <TableHead>Value for Money</TableHead>
                  <TableHead>Ambiance</TableHead>
                  <TableHead>Overall Rating</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.customerName || 'Unknown'}
                    </TableCell>
                    <TableCell>{response.customers?.location || 'N/A'}</TableCell>
                    <TableCell>
                      {response.visitDate 
                        ? new Date(response.visitDate).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getSatisfactionColor(response.food_quality || '')}`}>
                        {response.foodQuality || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getSatisfactionColor(response.service_speed || '')}`}>
                        {response.serviceSpeed || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getSatisfactionColor(response.staff_friendliness || '')}`}>
                        {response.staffFriendliness || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getSatisfactionColor(response.cleanliness || '')}`}>
                        {response.cleanliness || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getSatisfactionColor(response.valueForMoney || '')}`}>
                        {response.value_for_money || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${getSatisfactionColor(response.ambiance || '')}`}>
                        {response.ambiance || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="font-semibold text-lg">{response.overallRating || 'N/A'}</span>
                        {response.overallRating && <span className="text-yellow-500 ml-1">⭐</span>}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={response.comments || ''}>
                        {response.comments || 'No comments'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(response.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No survey responses found for the selected filters.
            </div>
          )}
          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTable;