export default function calculatePayments(
  initial,
  years,
  rate,
  monthlyOverpayment,
  overpayments,
  recurringCredit,
  creditInterest,
  serviceFee,
  monthlyCreditPayment,
) {
  // 1200 = 12 months * 100 (conversion for percent)
  const monthlyRatePct = rate / 1200;
  const monthlyCreditRate = creditInterest / 1200;

  const monthlyPayment =
    monthlyRatePct === 0
      ? initial / years / 12
      : (initial * monthlyRatePct) /
        (1 - Math.pow(1 / (1 + monthlyRatePct), years * 12));
  let balance = initial;

  let creditBalance = 0;

  // baseline used for calculating scenario 
  // where no overpayment is done 
  let baseline = initial;

  let mortgagePayments = [];

  let interestTotal = 0;
  let loanPeriod = 0

  for (let year = 0; year < years; year++) {
    for (let month = 1; month <= 12; month++) {
      let overpayment = overpayments
        .filter(x => +x.year === year && +x.month === month)
        .reduce((acc, val) => acc + +val.amount, 0);
      overpayment = overpayment + +monthlyOverpayment

      let creditInterestMonthly = 0;
      if (balance > 0 && creditBalance === 0){
        creditBalance = recurringCredit;
        overpayment += creditBalance;
        creditInterestMonthly += creditBalance * (serviceFee/100)
      } 

      creditInterestMonthly += monthlyCreditRate * creditBalance;
      creditBalance -= monthlyCreditPayment
      creditBalance = Math.max(creditBalance, 0)

      let interestMonth = balance * monthlyRatePct;
      interestTotal += interestMonth + creditInterestMonthly

      // principal payment is monthlyPayment - interestMonth
      baseline -= monthlyPayment - baseline * monthlyRatePct;

      if (balance != 0)
      { 
        loanPeriod += 1
      }

      const balanceToBe = balance - 
        (monthlyPayment + monthlyOverpayment + overpayment - interestMonth);
      balance = Math.max(balanceToBe, 0)

      mortgagePayments.push({
        "Mortgage Baseline": baseline,
        "Mortgage Balance": balance,
        "Mortgage Interest": interestMonth,
        "Mortgage Overpayment": overpayment,
        "Credit Interest": creditInterestMonthly,
        "Credit Balance": creditBalance,
        "Credit Payment": monthlyCreditPayment,
      });

      if (balance <= 0) {
        balance = 0;
      }
    }
  }

  return { monthlyPayment, interestTotal, loanPeriod, mortgagePayments};
}