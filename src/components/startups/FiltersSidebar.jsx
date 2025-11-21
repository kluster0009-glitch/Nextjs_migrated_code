import FilterSection from "./FilterSection";

export default function FiltersSidebar({
  riskLevel,
  setRiskLevel,
  subscriptionType,
  setSubscriptionType,
  subscriptionFee,
  setSubscriptionFee,
  investmentAmount,
  setInvestmentAmount,
  rebalancingFrequency,
  setRebalancingFrequency,
  includeNew,
  setIncludeNew,
  collapsedSections,
  toggleSection,
}) {
  return (
    <div className="space-y-6">
      {/* Risk Level */}
      <FilterSection
        title="Risk"
        isCollapsed={collapsedSections.risk}
        onToggle={() => toggleSection("risk")}
      >
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setRiskLevel("low")}
            className={`p-3 rounded-lg border text-center transition-all ${
              riskLevel === "low"
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-cyber-border bg-cyber-card/50 text-muted-foreground hover:border-green-500/50"
            }`}
          >
            <div className="text-2xl mb-1">🟢</div>
            <div className="text-xs font-medium">Low</div>
          </button>
          <button
            onClick={() => setRiskLevel("medium")}
            className={`p-3 rounded-lg border text-center transition-all ${
              riskLevel === "medium"
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-500"
                : "border-cyber-border bg-cyber-card/50 text-muted-foreground hover:border-yellow-500/50"
            }`}
          >
            <div className="text-2xl mb-1">🟡</div>
            <div className="text-xs font-medium">Medium</div>
          </button>
          <button
            onClick={() => setRiskLevel("high")}
            className={`p-3 rounded-lg border text-center transition-all ${
              riskLevel === "high"
                ? "border-red-500 bg-red-500/10 text-red-500"
                : "border-cyber-border bg-cyber-card/50 text-muted-foreground hover:border-red-500/50"
            }`}
          >
            <div className="text-2xl mb-1">🔴</div>
            <div className="text-xs font-medium">High</div>
          </button>
        </div>
      </FilterSection>

      {/* Subscription Type */}
      <FilterSection
        title="Subscription Type"
        isCollapsed={collapsedSections.subscription}
        onToggle={() => toggleSection("subscription")}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Select a subscription plan
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setSubscriptionType("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subscriptionType === "all"
                ? "bg-neon-cyan text-black"
                : "bg-cyber-card/50 border border-cyber-border text-muted-foreground hover:border-neon-cyan/50"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSubscriptionType("Free access")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subscriptionType === "Free access"
                ? "bg-neon-cyan text-black"
                : "bg-cyber-card/50 border border-cyber-border text-muted-foreground hover:border-neon-cyan/50"
            }`}
          >
            Free access
          </button>
          <button
            onClick={() => setSubscriptionType("Fee-based")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              subscriptionType === "Fee-based"
                ? "bg-neon-cyan text-black"
                : "bg-cyber-card/50 border border-cyber-border text-muted-foreground hover:border-neon-cyan/50"
            }`}
          >
            Fee based
          </button>
        </div>
      </FilterSection>

      {/* Subscription Fee */}
      <FilterSection
        title="Subscription Fee"
        isCollapsed={collapsedSections.fee}
        onToggle={() => toggleSection("fee")}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Charged by the smallcase manager
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="subscriptionFee"
              checked={subscriptionFee === "all"}
              onChange={() => setSubscriptionFee("all")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="subscriptionFee"
              checked={subscriptionFee === "under500"}
              onChange={() => setSubscriptionFee("under500")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Under ₹ 500 / mo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="subscriptionFee"
              checked={subscriptionFee === "under1500"}
              onChange={() => setSubscriptionFee("under1500")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Under ₹ 1500 / mo</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="subscriptionFee"
              checked={subscriptionFee === "above1500"}
              onChange={() => setSubscriptionFee("above1500")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Above ₹ 1500 / mo</span>
          </label>
        </div>
      </FilterSection>

      {/* Investment Amount */}
      <FilterSection
        title="Investment Amount"
        isCollapsed={collapsedSections.investment}
        onToggle={() => toggleSection("investment")}
      >
        <p className="text-xs text-muted-foreground mb-3">
          Select the range you would like to invest
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="investmentAmount"
              checked={investmentAmount === "any"}
              onChange={() => setInvestmentAmount("any")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Any</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="investmentAmount"
              checked={investmentAmount === "under5000"}
              onChange={() => setInvestmentAmount("under5000")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Under ₹ 5,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="investmentAmount"
              checked={investmentAmount === "under25000"}
              onChange={() => setInvestmentAmount("under25000")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Under ₹ 25,000</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="investmentAmount"
              checked={investmentAmount === "under50000"}
              onChange={() => setInvestmentAmount("under50000")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Under ₹ 50,000</span>
          </label>
        </div>
      </FilterSection>

      {/* Rebalancing Frequency */}
      <FilterSection
        title="Rebalancing Frequency"
        isCollapsed={collapsedSections.rebalancing}
        onToggle={() => toggleSection("rebalancing")}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rebalancing"
              checked={rebalancingFrequency === "all"}
              onChange={() => setRebalancingFrequency("all")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rebalancing"
              checked={rebalancingFrequency === "Weekly"}
              onChange={() => setRebalancingFrequency("Weekly")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Weekly</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rebalancing"
              checked={rebalancingFrequency === "Monthly"}
              onChange={() => setRebalancingFrequency("Monthly")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Monthly</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rebalancing"
              checked={rebalancingFrequency === "Quarterly"}
              onChange={() => setRebalancingFrequency("Quarterly")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Quarterly</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rebalancing"
              checked={rebalancingFrequency === "Annual"}
              onChange={() => setRebalancingFrequency("Annual")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">Annual</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rebalancing"
              checked={rebalancingFrequency === "On Need Basis"}
              onChange={() => setRebalancingFrequency("On Need Basis")}
              className="w-4 h-4 text-neon-cyan"
            />
            <span className="text-sm">On Need Basis</span>
          </label>
        </div>
      </FilterSection>

      {/* Other */}
      <FilterSection
        title="Other"
        isCollapsed={collapsedSections.other}
        onToggle={() => toggleSection("other")}
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNew}
            onChange={(e) => setIncludeNew(e.target.checked)}
            className="w-4 h-4 text-neon-cyan rounded"
          />
          <span className="text-sm">Include new smallcases</span>
          <div className="ml-auto w-5 h-5 rounded-full bg-neon-cyan/20 flex items-center justify-center">
            <span className="text-xs text-neon-cyan">?</span>
          </div>
        </label>
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          smallcases launched in last 1 year
        </p>
      </FilterSection>
    </div>
  );
}
