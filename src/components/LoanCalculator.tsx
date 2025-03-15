
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateLoanSummary, formatCurrency, LoanParams } from '@/utils/loanCalculations';
import { Slider } from '@/components/ui/slider';
import { toast } from "@/components/ui/use-toast";

const LoanCalculator = () => {
  const [loanParams, setLoanParams] = useState<LoanParams>({
    loanAmount: 300000,
    interestRate: 4.5,
    loanTerm: 30,
    downPayment: 60000,
    additionalPayment: 0
  });

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [savedCalculations, setSavedCalculations] = useState<Array<{name: string, params: LoanParams}>>([]);

  useEffect(() => {
    const summary = calculateLoanSummary(loanParams);
    setMonthlyPayment(summary.monthlyPayment);
    setTotalInterest(summary.totalInterest);
    setTotalCost(summary.totalCost);
  }, [loanParams]);

  useEffect(() => {
    // Load saved calculations from localStorage
    const saved = localStorage.getItem('savedCalculations');
    if (saved) {
      setSavedCalculations(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoanParams(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleSliderChange = (name: keyof LoanParams, value: number[]) => {
    setLoanParams(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const saveCalculation = () => {
    // Ask for a name for this calculation
    const calculationName = prompt("Enter a name for this calculation:");
    if (calculationName) {
      const newCalculation = { name: calculationName, params: loanParams };
      const updatedSavedCalculations = [...savedCalculations, newCalculation];
      setSavedCalculations(updatedSavedCalculations);
      localStorage.setItem('savedCalculations', JSON.stringify(updatedSavedCalculations));
      
      toast({
        title: "Calculation saved",
        description: `Your "${calculationName}" calculation has been saved.`,
      });
    }
  };

  const loadCalculation = (index: number) => {
    const calculationToLoad = savedCalculations[index];
    setLoanParams(calculationToLoad.params);
    
    toast({
      title: "Calculation loaded",
      description: `Loaded "${calculationToLoad.name}" calculation.`,
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-0 overflow-hidden glassmorphism animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl md:text-3xl font-display font-medium">Loan Calculator</CardTitle>
        <CardDescription>Calculate your monthly payments and total interest costs</CardDescription>
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-8 md:col-span-2">
          {/* Loan Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="loanAmount" className="text-sm font-medium">
                Loan Amount
              </Label>
              <div className="text-sm font-medium text-primary">
                {formatCurrency(loanParams.loanAmount)}
              </div>
            </div>
            <Slider
              id="loanAmount"
              value={[loanParams.loanAmount]}
              min={50000}
              max={1000000}
              step={5000}
              onValueChange={(value) => handleSliderChange("loanAmount", value)}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(50000)}</span>
              <span>{formatCurrency(1000000)}</span>
            </div>
          </div>
          
          {/* Down Payment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="downPayment" className="text-sm font-medium">
                Down Payment
              </Label>
              <div className="text-sm font-medium text-primary">
                {formatCurrency(loanParams.downPayment || 0)}
              </div>
            </div>
            <Slider
              id="downPayment"
              value={[loanParams.downPayment || 0]}
              min={0}
              max={loanParams.loanAmount * 0.5}
              step={5000}
              onValueChange={(value) => handleSliderChange("downPayment", value)}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(loanParams.loanAmount * 0.5)}</span>
            </div>
          </div>
          
          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="interestRate" className="text-sm font-medium">
                Interest Rate (%)
              </Label>
              <div className="text-sm font-medium text-primary">
                {loanParams.interestRate.toFixed(2)}%
              </div>
            </div>
            <Slider
              id="interestRate"
              value={[loanParams.interestRate]}
              min={1}
              max={10}
              step={0.1}
              onValueChange={(value) => handleSliderChange("interestRate", value)}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1.00%</span>
              <span>10.00%</span>
            </div>
          </div>
          
          {/* Loan Term */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="loanTerm" className="text-sm font-medium">
                Loan Term (Years)
              </Label>
              <div className="text-sm font-medium text-primary">
                {loanParams.loanTerm} years
              </div>
            </div>
            <Slider
              id="loanTerm"
              value={[loanParams.loanTerm]}
              min={5}
              max={30}
              step={5}
              onValueChange={(value) => handleSliderChange("loanTerm", value)}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 years</span>
              <span>30 years</span>
            </div>
          </div>
          
          {/* Additional Monthly Payment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="additionalPayment" className="text-sm font-medium">
                Additional Monthly Payment
              </Label>
              <div className="text-sm font-medium text-primary">
                {formatCurrency(loanParams.additionalPayment || 0)}
              </div>
            </div>
            <Slider
              id="additionalPayment"
              value={[loanParams.additionalPayment || 0]}
              min={0}
              max={1000}
              step={50}
              onValueChange={(value) => handleSliderChange("additionalPayment", value)}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(1000)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6 md:border-l md:pl-6">
          <div className="p-4 bg-primary/5 rounded-lg">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Monthly Payment</h3>
            <p className="text-3xl font-semibold font-display text-primary">{formatCurrency(monthlyPayment)}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1 text-muted-foreground">Loan Amount</h3>
              <p className="text-lg font-medium">{formatCurrency(loanParams.loanAmount - (loanParams.downPayment || 0))}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-muted-foreground">Total Interest</h3>
              <p className="text-lg font-medium">{formatCurrency(totalInterest)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-muted-foreground">Total Cost</h3>
              <p className="text-lg font-medium">{formatCurrency(totalCost)}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button className="w-full" onClick={saveCalculation}>
              Save Calculation
            </Button>
            
            {savedCalculations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Saved Calculations</h4>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                  {savedCalculations.map((calc, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => loadCalculation(index)}
                    >
                      {calc.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanCalculator;
