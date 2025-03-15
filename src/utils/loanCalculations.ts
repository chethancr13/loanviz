
export interface LoanParams {
  loanAmount: number;
  interestRate: number;
  loanTerm: number; // in years
  downPayment?: number;
  additionalPayment?: number;
}

export interface PaymentDetails {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  totalCost: number;
  amortizationSchedule: PaymentDetails[];
}

/**
 * Calculate monthly payment for a loan
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  interestRate: number,
  loanTermYears: number
): number {
  // Convert annual interest rate to monthly and from percentage to decimal
  const monthlyRate = interestRate / 100 / 12;
  // Convert loan term from years to months
  const termMonths = loanTermYears * 12;

  // Check for edge cases
  if (monthlyRate === 0) return loanAmount / termMonths;
  if (loanAmount === 0 || termMonths === 0) return 0;

  // Calculate monthly payment using the loan formula
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return payment;
}

/**
 * Generate amortization schedule
 */
export function generateAmortizationSchedule(
  loanAmount: number,
  interestRate: number,
  loanTermYears: number,
  additionalPayment: number = 0
): PaymentDetails[] {
  const monthlyRate = interestRate / 100 / 12;
  const termMonths = loanTermYears * 12;
  const regularPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
  const monthlyPayment = regularPayment + additionalPayment;

  let balance = loanAmount;
  let totalInterest = 0;
  const schedule: PaymentDetails[] = [];

  for (let month = 1; month <= termMonths && balance > 0; month++) {
    const interestForMonth = balance * monthlyRate;
    let principalForMonth = monthlyPayment - interestForMonth;

    // Ensure we don't pay more than remaining balance
    if (principalForMonth > balance) {
      principalForMonth = balance;
    }

    balance -= principalForMonth;
    totalInterest += interestForMonth;

    schedule.push({
      month,
      payment: principalForMonth + interestForMonth,
      principal: principalForMonth,
      interest: interestForMonth,
      balance,
      totalInterest
    });

    // If balance is paid off, exit loop
    if (balance <= 0) break;
  }

  return schedule;
}

/**
 * Calculate full loan summary including monthly payment and amortization schedule
 */
export function calculateLoanSummary(params: LoanParams): LoanSummary {
  const { loanAmount, interestRate, loanTerm, downPayment = 0, additionalPayment = 0 } = params;
  
  const loanPrincipal = loanAmount - downPayment;
  const monthlyPayment = calculateMonthlyPayment(loanPrincipal, interestRate, loanTerm);
  const amortizationSchedule = generateAmortizationSchedule(
    loanPrincipal, 
    interestRate, 
    loanTerm,
    additionalPayment
  );
  
  const totalPayments = amortizationSchedule.reduce((sum, payment) => sum + payment.payment, 0);
  const totalInterest = amortizationSchedule.reduce((sum, payment) => sum + payment.interest, 0);
  
  return {
    monthlyPayment: monthlyPayment + additionalPayment,
    totalPayments,
    totalInterest,
    totalCost: totalPayments + downPayment,
    amortizationSchedule
  };
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
}

/**
 * Calculate how much of the monthly payment goes to principal vs interest over time
 */
export function calculatePaymentDistribution(schedule: PaymentDetails[]): {
  labels: string[];
  principal: number[];
  interest: number[];
} {
  // Sample the schedule to avoid too many data points (e.g., every 6 months)
  const samplingInterval = Math.max(1, Math.floor(schedule.length / 20));
  
  const sampledSchedule = schedule.filter((_, index) => index % samplingInterval === 0);
  
  return {
    labels: sampledSchedule.map(item => `Month ${item.month}`),
    principal: sampledSchedule.map(item => item.principal),
    interest: sampledSchedule.map(item => item.interest)
  };
}

/**
 * Calculate different loan options based on varying a single parameter
 */
export function calculateLoanOptions(
  baseParams: LoanParams,
  varyingParam: keyof LoanParams,
  values: number[]
): LoanSummary[] {
  return values.map(value => {
    const params = { ...baseParams, [varyingParam]: value };
    return calculateLoanSummary(params);
  });
}
