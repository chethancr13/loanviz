
import { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoanCalculator from '@/components/LoanCalculator';
import Dashboard from '@/components/Dashboard';
import AmortizationTable from '@/components/AmortizationTable';
import LoanComparison from '@/components/LoanComparison';
import { Button } from '@/components/ui/button';
import { calculateLoanSummary, LoanParams } from '@/utils/loanCalculations';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Refs for scrolling
  const calculatorRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  // Demo loan data for amortization table
  const demoLoanData: LoanParams = {
    loanAmount: 300000,
    interestRate: 4.5,
    loanTerm: 30,
    downPayment: 60000,
    additionalPayment: 0
  };
  
  const loanSummary = calculateLoanSummary(demoLoanData);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll handling
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center relative">
        <div className={`max-w-4xl mx-auto text-center transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
            Simple, Powerful Loan Calculator
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold mb-6 text-foreground leading-tight animate-fade-in" style={{ animationDelay: '200ms' }}>
            Make smarter financial decisions with <span className="text-primary">LoanViz</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
            Visualize your loan payments, compare scenarios, and find the perfect financing option with our intuitive tools.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
            <Button size="lg" className="px-8" onClick={() => scrollToSection(calculatorRef)}>
              Try Calculator
            </Button>
            <Button size="lg" variant="outline" className="px-8" onClick={() => scrollToSection(comparisonRef)}>
              Compare Loans
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => scrollToSection(calculatorRef)}
          >
            Scroll Down
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Calculator Section */}
      <section 
        ref={calculatorRef} 
        id="calculator"
        className="py-16 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Loan Calculator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Adjust the parameters to calculate your monthly payments and see the impact on your total cost.
            </p>
          </div>
          
          <LoanCalculator />
        </div>
      </section>
      
      {/* Dashboard Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Financial Dashboard</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visualize your loan details with intuitive charts and get a complete overview of your financing.
            </p>
          </div>
          
          <Dashboard />
        </div>
      </section>
      
      {/* Amortization Table Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Amortization Schedule</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See your payment breakdown month by month over the entire loan term.
            </p>
          </div>
          
          <AmortizationTable schedule={loanSummary.amortizationSchedule} />
        </div>
      </section>
      
      {/* Comparison Section */}
      <section 
        ref={comparisonRef}
        id="comparison" 
        className="py-16 px-4 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Loan Comparison</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Compare different loan scenarios side by side to find the best option for your needs.
            </p>
          </div>
          
          <LoanComparison />
        </div>
      </section>
      
      {/* About Section */}
      <section 
        ref={aboutRef}
        id="about" 
        className="py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">About LoanViz</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Making financial decisions simpler and more transparent.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg glassmorphism animate-fade-in">
            <p className="mb-4 text-lg">
              LoanViz was designed to help individuals and businesses make smarter financial decisions when it comes to loans and financing. 
            </p>
            <p className="mb-4">
              Our platform provides powerful visualization tools and intuitive interfaces to help you understand complex financial concepts without needing a background in finance.
            </p>
            <p className="mb-4">
              With LoanViz, you can:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Calculate loan payments with precision</li>
              <li>Visualize payment breakdowns with interactive charts</li>
              <li>Compare different loan scenarios side by side</li>
              <li>View detailed amortization schedules</li>
              <li>Make data-driven financial decisions</li>
            </ul>
            <p>
              We believe in transparency and simplicity, which is why our tools are designed to be both powerful and easy to use, helping you take control of your financial future.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-display font-semibold mb-4">LoanViz</h3>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                Powerful loan calculation and visualization tools to help you make better financial decisions.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Loan Guides</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Financial Terms</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/80 text-sm">
              © {new Date().getFullYear()} LoanViz. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Twitter
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
