import { useEffect, useState } from "react";
import { useEligibilitySimulator } from "./hooks/useEligibilitySimulator";
import EligibilityResults from "./components/EligibilityResults";
import LoanApplicationForm from "./components/LoanApplicationForm";
import { HeroSection, HowItWorksSection, SiteFooter, SiteHeader } from "./components/SiteChrome";

function getInitialTheme(): "light" | "dark" {
  try {
    return window.localStorage.getItem("loanwise-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function App() {
  const simulator = useEligibilitySimulator();
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("loanwise-theme", theme);
    } catch {
      // The app still works when browser storage is unavailable.
    }
  }, [theme]);

  return (
    <div className="app-shell" id="top">
      <SiteHeader theme={theme} onToggleTheme={() => setTheme((current) => current === "light" ? "dark" : "light")} />
      <main>
        <HeroSection />
        <section className="simulator-layout" id="simulator">
          <LoanApplicationForm
            values={simulator.values}
            errors={simulator.validationErrors}
            error={simulator.error}
            loading={simulator.loading}
            disposableIncome={simulator.disposableIncome}
            onChange={simulator.updateField}
            onSubmit={simulator.submit}
            onReset={simulator.reset}
          />
          <EligibilityResults result={simulator.result} loanTerm={simulator.values.loanTerm} />
        </section>
        <HowItWorksSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
