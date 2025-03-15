
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, PaymentDetails } from '@/utils/loanCalculations';
import { Search } from 'lucide-react';

interface AmortizationTableProps {
  schedule: PaymentDetails[];
}

const AmortizationTable = ({ schedule }: AmortizationTableProps) => {
  const [searchMonth, setSearchMonth] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 12; // Show 1 year of payments per page
  
  const filteredSchedule = searchMonth 
    ? schedule.filter(payment => 
        payment.month.toString().includes(searchMonth))
    : schedule;
  
  const totalPages = Math.ceil(filteredSchedule.length / rowsPerPage);
  const paginatedData = filteredSchedule.slice(
    (currentPage - 1) * rowsPerPage, 
    currentPage * rowsPerPage
  );
  
  // Calculate visible page range for pagination
  const visiblePageRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  };

  return (
    <Card className="glassmorphism animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle>Amortization Schedule</CardTitle>
        <CardDescription>Monthly payment breakdown over the loan term</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by month..."
              value={searchMonth}
              onChange={(e) => {
                setSearchMonth(e.target.value);
                setCurrentPage(1); // Reset to page 1 when searching
              }}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={() => setSearchMonth('')}>
            Clear
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Month</TableHead>
                <TableHead className="font-semibold text-right">Payment</TableHead>
                <TableHead className="font-semibold text-right">Principal</TableHead>
                <TableHead className="font-semibold text-right">Interest</TableHead>
                <TableHead className="font-semibold text-right">Total Interest</TableHead>
                <TableHead className="font-semibold text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((payment) => (
                  <TableRow key={payment.month}>
                    <TableCell>{payment.month}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.payment)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.principal)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.interest)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.totalInterest)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.balance)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No results found for this search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredSchedule.length)} of {filteredSchedule.length} payments
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {visiblePageRange().map(page => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AmortizationTable;
