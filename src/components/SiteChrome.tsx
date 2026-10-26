import { ArrowDownRight, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, WalletCards, Moon, Sun } from "lucide-react";

interface SiteHeaderProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  return <header className="topbar"><a className="brand" href="#top" aria-label="LoanWise home"><span className="brand-mark"><WalletCards size={21} strokeWidth={2.3} /></span><span>loanwise<span className="brand-period">.</span></span></a><nav className="top-nav" aria-label="Main navigation"><a className="nav-active" href="#simulator">Simulator</a><a href="#how-it-works">How it works</a></nav><div className="header-actions"><div className="secure-note"><ShieldCheck size={15} /> Secure & private demo</div><button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}<span>{theme === "light" ? "Dark mode" : "Light mode"}</span></button></div></header>;
}

export function HeroSection() {
  return <section className="hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> SMARTER BORROWING STARTS HERE</div><h1>Make your next move<br />with <span>confidence.</span></h1><p>Explore your estimated loan eligibility in minutes. Adjust your details, compare the numbers, and see what could work for you.</p><div className="hero-benefits"><span><CheckCircle2 size={16} /> Quick estimate</span><span><CheckCircle2 size={16} /> No credit check</span><span><CheckCircle2 size={16} /> No commitment</span></div></div><div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-card art-card-back"><span className="art-dot" /><span className="art-line" /><span className="art-line short" /></div><div className="art-card art-card-front"><div className="art-card-header"><span>YOUR FINANCIAL SNAPSHOT</span><span className="mini-check"><CheckCircle2 size={14} /></span></div><div className="art-card-value">R 28,000<span>/mo</span></div><div className="art-card-caption">Monthly income</div><div className="art-progress"><span /></div><div className="art-card-bottom"><span>Income health</span><strong>Looking good</strong></div></div><div className="floating-badge"><span className="badge-icon"><ArrowDownRight size={18} /></span><span><strong>More clarity</strong><small>Better decisions</small></span></div><div className="art-sparkle sparkle-a">✳</div><div className="art-sparkle sparkle-b">✦</div></div></section>;
}

export function HowItWorksSection() {
  return <section className="how-section" id="how-it-works"><div className="how-heading"><span className="section-kicker">SIMPLE BY DESIGN</span><h2>A clearer way to explore your options.</h2><p>No complicated jargon. Just a starting point to help you plan.</p></div><div className="how-grid"><article><span className="how-number">01</span><div className="how-icon"><WalletCards size={22} /></div><h3>Share the basics</h3><p>Enter your income, expenses and the loan amount you have in mind.</p></article><article><span className="how-number">02</span><div className="how-icon"><Sparkles size={22} /></div><h3>Get your estimate</h3><p>See a demo estimate of affordability, repayment and eligibility.</p></article><article><span className="how-number">03</span><div className="how-icon"><ArrowRight size={22} /></div><h3>Explore scenarios</h3><p>Adjust the numbers to understand how different choices may affect you.</p></article></div></section>;
}

export function SiteFooter() {
  return <footer className="footer"><a className="brand footer-brand" href="#top"><span className="brand-mark"><WalletCards size={18} /></span><span>loanwise<span className="brand-period">.</span></span></a><p>Made for clarity, not commitments.</p><span className="footer-copyright">© 2026 LoanWise demo</span></footer>;
}
