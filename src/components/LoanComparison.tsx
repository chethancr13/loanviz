
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  calculateLoanOptions, 
  formatCurrency, 
  LoanParams, 
  LoanSummary,
  formatPercentage
} from '@/utils/loanCalculations';
import { BarChart, LineChart } from '@/components/charts/LineChart';

const baseParams: LoanParams = {
  loanAmount: 300000,
  interestRate: 4.5,
  loanTerm: 30,
  downPayment: 60000,
  additionalPayment: 0
};

const LoanComparison = () => {
  const [comparisonType, setComparisonType] = useState<'term' | 'rate' | 'amount'>('term');

  // Generate comparison data
  const termOptions = [10, 15, 20, 25, 30];
  const rateOptions = [3.0, 3.5, 4.0, 4.5, 5.0, 5.5];
  const amountOptions = [200000, 250000, 300000, 350000, 400000];

  const termComparisons = calculateLoanOptions(baseParams, 'loanTerm', termOptions);
  const rateComparisons = calculateLoanOptions(baseParams, 'interestRate', rateOptions);
  const amountComparisons = calculateLoanOptions(baseParams, 'loanAmount', amountOptions);

  // Prepare data for charts
  const prepareBarChartData = (summaries: LoanSummary[], labels: string[] | number[]) => {
    return summaries.map((summary, index) => ({
      label: typeof labels[index] === 'number' 
        ? comparisonType === 'term' 
          ? `${labels[index]} years` 
          : comparisonType === 'rate' 
            ? `${labels[index]}%` 
            : formatCurrency(labels[index] as number)
        : labels[index],
      monthlyPayment: summary.monthlyPayment,
      totalInterest: summary.totalInterest,
      totalCost: summary.totalCost
    }));
  };
  
  const prepareBreakdownData = (summaries: LoanSummary[], labels: string[] | number[]) => {
    return summaries.map((summary, index) => {
      const principal = summary.totalCost - summary.totalInterest;
      return {
        label: typeof labels[index] === 'number' 
          ? comparisonType === 'term' 
            ? `${labels[index]} years` 
            : comparisonType === 'rate' 
              ? `${labels[index]}%` 
              : formatCurrency(labels[index] as number)
          : labels[index],
        principal,
        interest: summary.totalInterest
      };
    });
  };

  const termBarData = prepareBarChartData(termComparisons, termOptions);
  const rateBarData = prepareBarChartData(rateComparisons, rateOptions);
  const amountBarData = prepareBarChartData(amountComparisons, amountOptions);
  
  const termBreakdownData = prepareBreakdownData(termComparisons, termOptions);
  const rateBreakdownData = prepareBreakdownData(rateComparisons, rateOptions);
  const amountBreakdownData = prepareBreakdownData(amountComparisons, amountOptions);

  const getActiveComparison = () => {
    switch (comparisonType) {
      case 'term':
        return { 
          summaries: termComparisons, 
          options: termOptions, 
          barData: termBarData,
          breakdownData: termBreakdownData,
          label: 'Loan Term (Years)',
          description: 'Compare how different loan terms affect your payments'
        };
      case 'rate':
        return { 
          summaries: rateComparisons, 
          options: rateOptions, 
          barData: rateBarData,
          breakdownData: rateBreakdownData,
          label: 'Interest Rate (%)',
          description: 'See the impact of different interest rates'
        };
      case 'amount':
        return { 
          summaries: amountComparisons, 
          options: amountOptions, 
          barData: amountBarData,
          breakdownData: amountBreakdownData,
          label: 'Loan Amount',
          description: 'Compare payments for different loan amounts'
        };
      default:
        return { 
          summaries: termComparisons, 
          options: termOptions, 
          barData: termBarData,
          breakdownData: termBreakdownData,
          label: 'Loan Term (Years)',
          description: 'Compare how different loan terms affect your payments'
        };
    }
  };

  const activeComparison = getActiveComparison();

  return (
    <Card className="glassmorphism animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle>Loan Comparison</CardTitle>
        <CardDescription>Compare different loan scenarios to find the best option</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={comparisonType === 'term' ? 'default' : 'outline'} 
            onClick={() => setComparisonType('term')}
          >
            Compare Terms
          </Button>
          <Button 
            variant={comparisonType === 'rate' ? 'default' : 'outline'} 
            onClick={() => setComparisonType('rate')}
          >
            Compare Rates
          </Button>
          <Button 
            variant={comparisonType === 'amount' ? 'default' : 'outline'} 
            onClick={() => setComparisonType('amount')}
          >
            Compare Amounts
          </Button>
        </div>
        
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="mb-6 w-full max-w-md">
            <TabsTrigger value="monthly" className="flex-1">Monthly Payment</TabsTrigger>
            <TabsTrigger value="total" className="flex-1">Total Cost</TabsTrigger>
            <TabsTrigger value="breakdown" className="flex-1">Cost Breakdown</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="h-[400px]">
            <BarChart 
              data={activeComparison.barData}
              keys={["monthlyPayment"]}
              indexBy="label"
              colors={["#3b82f6"]}
            />
          </TabsContent>
          
          <TabsContent value="total" className="h-[400px]">
            <BarChart 
              data={activeComparison.barData}
              keys={["totalCost"]}
              indexBy="label"
              colors={["#10b981"]}
            />
          </TabsContent>
          
          <TabsContent value="breakdown" className="h-[400px]">
            <BarChart 
              data={activeComparison.breakdownData}
              keys={["principal", "interest"]}
              indexBy="label"
              colors={["#3b82f6", "#f97316"]}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">{activeComparison.label} Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/30 text-muted-foreground text-sm">
                  <th className="p-2 text-left font-medium">{activeComparison.label}</th>
                  <th className="p-2 text-right font-medium">Monthly Payment</th>
                  <th className="p-2 text-right font-medium">Total Interest</th>
                  <th className="p-2 text-right font-medium">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {activeComparison.summaries.map((summary, index) => (
                  <tr key={index} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      {comparisonType === 'term'
                        ? `${activeComparison.options[index]} years`
                        : comparisonType === 'rate'
                        ? formatPercentage(activeComparison.options[index] as number)
                        : formatCurrency(activeComparison.options[index] as number)}
                    </td>
                    <td className="p-3 text-right">{formatCurrency(summary.monthlyPayment)}</td>
                    <td className="p-3 text-right">{formatCurrency(summary.totalInterest)}</td>
                    <td className="p-3 text-right">{formatCurrency(summary.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            * Calculations based on a {comparisonType !== 'amount' ? formatCurrency(baseParams.loanAmount) : ''} 
            {comparisonType !== 'rate' ? ` loan at ${baseParams.interestRate}% interest` : ''}
            {comparisonType !== 'term' ? ` with a ${baseParams.loanTerm}-year term` : ''}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanComparison;
