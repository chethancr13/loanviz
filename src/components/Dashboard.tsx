
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, calculateLoanSummary, LoanParams } from '@/utils/loanCalculations';
import { LineChart, BarChart, AreaChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { Calculator, Wallet, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const demoLoanData: LoanParams = {
  loanAmount: 300000,
  interestRate: 4.5,
  loanTerm: 30,
  downPayment: 60000,
  additionalPayment: 0
};

const Dashboard = () => {
  const [activeLoan] = useState<LoanParams>(demoLoanData);
  const loanSummary = calculateLoanSummary(activeLoan);
  
  const monthlyPrincipal = loanSummary.amortizationSchedule[0]?.principal || 0;
  const monthlyInterest = loanSummary.amortizationSchedule[0]?.interest || 0;
  
  // Calculations for charts
  const principalAmount = activeLoan.loanAmount - (activeLoan.downPayment || 0);
  const pieChartData = [
    { name: 'Principal', value: principalAmount, color: '#3b82f6' },
    { name: 'Total Interest', value: loanSummary.totalInterest, color: '#f97316' },
  ];
  
  const yearlyData = Array.from({ length: activeLoan.loanTerm }, (_, i) => {
    const year = i + 1;
    const yearlyPayments = loanSummary.monthlyPayment * 12;
    const remainingBalance = loanSummary.amortizationSchedule.find(
      schedule => schedule.month === year * 12
    )?.balance || 0;
    return {
      year: `Year ${year}`,
      payment: yearlyPayments,
      balance: remainingBalance
    };
  });

  const generateMonthlyPrincipalVsInterest = () => {
    // Sample every 12 months for clarity
    const data = loanSummary.amortizationSchedule
      .filter((_, index) => index % 12 === 0)
      .map(payment => ({
        month: `Month ${payment.month}`,
        principal: payment.principal,
        interest: payment.interest
      }));
    return data;
  };

  const generateAmortizationData = () => {
    // Sample every 12 months for clarity
    const data = loanSummary.amortizationSchedule
      .filter((_, index) => index % 12 === 0)
      .map(payment => ({
        month: `Month ${payment.month}`,
        balance: payment.balance
      }));
    return data;
  };

  const paymentDistribution = {
    principal: {
      percentage: (monthlyPrincipal / loanSummary.monthlyPayment) * 100,
      amount: monthlyPrincipal
    },
    interest: {
      percentage: (monthlyInterest / loanSummary.monthlyPayment) * 100,
      amount: monthlyInterest
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Monthly Payment"
          value={formatCurrency(loanSummary.monthlyPayment)}
          description="Total monthly payment"
          icon={<Calculator className="h-5 w-5 text-blue-500" />}
          trend={0}
        />
        
        <SummaryCard
          title="Loan Amount"
          value={formatCurrency(principalAmount)}
          description="Principal amount"
          icon={<Wallet className="h-5 w-5 text-green-500" />}
          trend={0}
        />
        
        <SummaryCard
          title="Total Interest"
          value={formatCurrency(loanSummary.totalInterest)}
          description="Total interest over loan term"
          icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
          trend={10}
        />
        
        <SummaryCard
          title="Total Cost"
          value={formatCurrency(loanSummary.totalCost)}
          description="Principal + interest + fees"
          icon={<PieChartIcon className="h-5 w-5 text-purple-500" />}
          trend={5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle>Payment Analysis</CardTitle>
            <CardDescription>Detailed view of your loan payments over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="amortization" className="w-full">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="amortization">Amortization</TabsTrigger>
                <TabsTrigger value="principal-interest">Principal vs Interest</TabsTrigger>
                <TabsTrigger value="yearly-payments">Yearly Payments</TabsTrigger>
              </TabsList>
              
              <TabsContent value="amortization" className="h-[400px]">
                <AreaChart 
                  data={generateAmortizationData()} 
                  xKey="month" 
                  yKey="balance" 
                  label="Remaining Balance" 
                />
              </TabsContent>
              
              <TabsContent value="principal-interest" className="h-[400px]">
                <BarChart 
                  data={generateMonthlyPrincipalVsInterest()}
                  keys={["principal", "interest"]}
                  indexBy="month"
                  colors={["#3b82f6", "#f97316"]}
                />
              </TabsContent>
              
              <TabsContent value="yearly-payments" className="h-[400px]">
                <LineChart 
                  data={yearlyData} 
                  xKey="year" 
                  yKey="payment" 
                  label="Yearly Payment" 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle>Payment Breakdown</CardTitle>
            <CardDescription>First month payment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-6">
              <PieChart data={[
                { name: 'Principal', value: monthlyPrincipal, color: '#3b82f6' },
                { name: 'Interest', value: monthlyInterest, color: '#f97316' }
              ]} />
            </div>
            
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Principal</h4>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">{formatCurrency(paymentDistribution.principal.amount)}</div>
                  <div className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {paymentDistribution.principal.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Interest</h4>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">{formatCurrency(paymentDistribution.interest.amount)}</div>
                  <div className="text-sm bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                    {paymentDistribution.interest.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Payment</h4>
                <div className="text-lg font-semibold text-primary">{formatCurrency(loanSummary.monthlyPayment)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle>Loan vs Interest</CardTitle>
            <CardDescription>Total amount paid over the loan term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart data={pieChartData} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Principal</h4>
                <div className="text-lg font-medium">{formatCurrency(principalAmount)}</div>
                <div className="text-sm text-muted-foreground">
                  {((principalAmount / (principalAmount + loanSummary.totalInterest)) * 100).toFixed(1)}% of total
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Interest</h4>
                <div className="text-lg font-medium">{formatCurrency(loanSummary.totalInterest)}</div>
                <div className="text-sm text-muted-foreground">
                  {((loanSummary.totalInterest / (principalAmount + loanSummary.totalInterest)) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glassmorphism">
          <CardHeader className="pb-2">
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>Summary of your loan terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Loan Amount" 
                  value={formatCurrency(activeLoan.loanAmount)} 
                />
                <DetailItem 
                  label="Down Payment" 
                  value={formatCurrency(activeLoan.downPayment || 0)} 
                />
                <DetailItem 
                  label="Interest Rate" 
                  value={`${activeLoan.interestRate}%`} 
                />
                <DetailItem 
                  label="Loan Term" 
                  value={`${activeLoan.loanTerm} years`} 
                />
                <DetailItem 
                  label="Monthly Payment" 
                  value={formatCurrency(loanSummary.monthlyPayment)} 
                />
                <DetailItem 
                  label="Total Payments" 
                  value={formatCurrency(loanSummary.totalPayments)} 
                />
                <DetailItem 
                  label="Total Interest" 
                  value={formatCurrency(loanSummary.totalInterest)} 
                />
                <DetailItem 
                  label="Interest-to-Principal Ratio" 
                  value={`${(loanSummary.totalInterest / principalAmount * 100).toFixed(1)}%`} 
                />
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Payment Schedule</h4>
                <p className="text-sm text-muted-foreground">
                  Your first payment is due one month after loan closing. Each payment will be applied to interest first, then to principal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SummaryCard = ({ 
  title, 
  value, 
  description, 
  icon,
  trend 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  trend: number;
}) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20 glassmorphism">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-semibold mt-1 font-display">{value}</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
        
        {trend !== 0 && (
          <div className={`flex items-center mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
            <span className="ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
};

export default Dashboard;
