import http from "http";
import {
  INITIAL_AI_KPIS,
  INITIAL_AI_FACTORY_HEALTH,
  INITIAL_PRIORITY_RECOMMENDATIONS,
  INITIAL_PREDICTIVE_MAINTENANCE,
  INITIAL_QUALITY_SUMMARY,
  QUALITY_REJECTION_TREND,
  INITIAL_QUALITY_ANOMALIES,
  INITIAL_PRODUCTION_FORECAST_SUMMARY,
  PRODUCTION_FORECAST_SERIES,
  INITIAL_INVENTORY_FORECAST,
  INITIAL_COST_INTELLIGENCE,
  INITIAL_BUSINESS_INSIGHTS,
  AI_CAPABILITIES_LIST,
  AI_DATA_FLOW_STEPS,
  HOW_AI_WORKS_STEPS,
} from "../src/lib/mock-data/ai-insights.js";

async function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const sessionCookie = encodeURIComponent(
      JSON.stringify({
        token: "auth-test-tok",
        userId: "user-admin",
        role: "admin",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      })
    );

    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: "GET",
      headers: {
        Cookie: `mfg_erp_session=${sessionCookie}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  console.log("==========================================================");
  console.log("🚀 STARTING AUTOMATED VALIDATION SUITE: AI INSIGHTS & ERP");
  console.log("==========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // 1. Check /ai-insights endpoint status
  console.log("--- 1. HTTP Endpoint & Route Status ---");
  try {
    const pageRes = await fetchPage("/ai-insights");
    assert(pageRes.statusCode === 200, "GET /ai-insights returns HTTP 200 OK", `Got ${pageRes.statusCode}`);
    assert(pageRes.body.includes("AI Insights &amp; Intelligence") || pageRes.body.includes("AI Insights & Intelligence"), "Page title rendered in HTML payload");
    assert(pageRes.body.includes("AI PROTOTYPE"), "AI Prototype badge present");
    assert(pageRes.body.includes("AI-generated insights are based on prototype/demo data"), "Prototype disclaimer text present");
  } catch (err) {
    assert(false, "GET /ai-insights reachable", err.message);
  }

  // 2. Test KPI Summary Metrics
  console.log("\n--- 2. Top KPI Metrics Verification ---");
  assert(INITIAL_AI_KPIS.aiInsightsCount === 24, "AI Insights count is 24");
  assert(INITIAL_AI_KPIS.criticalAlertsCount === 3, "Critical Alerts count is 3");
  assert(INITIAL_AI_KPIS.predictedFailuresCount === 2, "Predicted Failures count is 2");
  assert(INITIAL_AI_KPIS.qualityAnomaliesCount === 8, "Quality Anomalies count is 8");
  assert(INITIAL_AI_KPIS.costOpportunities === "₹1.8L", "Cost Opportunities is ₹1.8L");
  assert(INITIAL_AI_KPIS.forecastAccuracy === "91.4%", "Forecast Accuracy is 91.4%");

  // 3. Test Factory Health Score & Breakdown
  console.log("\n--- 3. Factory Health Score Verification ---");
  assert(INITIAL_AI_FACTORY_HEALTH.overallScore === 87, "Overall Factory Health Score is 87");
  assert(INITIAL_AI_FACTORY_HEALTH.status === "Healthy", "Health status is Healthy");
  assert(INITIAL_AI_FACTORY_HEALTH.breakdown.production === 91, "Production pillar score is 91%");
  assert(INITIAL_AI_FACTORY_HEALTH.breakdown.inventory === 86, "Inventory pillar score is 86%");
  assert(INITIAL_AI_FACTORY_HEALTH.breakdown.machines === 82, "Machines pillar score is 82%");
  assert(INITIAL_AI_FACTORY_HEALTH.breakdown.quality === 94, "Quality pillar score is 94%");
  assert(INITIAL_AI_FACTORY_HEALTH.breakdown.workforce === 88, "Workforce pillar score is 88%");
  assert(INITIAL_AI_FACTORY_HEALTH.breakdown.finance === 79, "Finance pillar score is 79%");

  // 4. Test Priority AI Recommendations
  console.log("\n--- 4. Priority AI Recommendations Verification ---");
  assert(INITIAL_PRIORITY_RECOMMENDATIONS.length === 3, "Exactly 3 priority recommendations defined");
  const rec1 = INITIAL_PRIORITY_RECOMMENDATIONS[0];
  assert(rec1.title === "Schedule maintenance for Packaging Machine 2", "Rec 1 title matches specification");
  assert(rec1.priority === "High", "Rec 1 priority is HIGH");
  assert(rec1.aiFinding.includes("Temperature increased 15% over the last 5 days"), "Rec 1 AI finding matches specification");
  assert(rec1.recommendedAction === "Schedule preventive maintenance during the next planned downtime.", "Rec 1 action matches specification");
  assert(rec1.primaryButtonLabel === "Schedule Maintenance" && rec1.secondaryButtonLabel === "View Machine", "Rec 1 action buttons correct");

  const rec2 = INITIAL_PRIORITY_RECOMMENDATIONS[1];
  assert(rec2.title === "Packaging material consumption is increasing", "Rec 2 title matches specification");
  assert(rec2.priority === "Medium", "Rec 2 priority is MEDIUM");
  assert(rec2.aiFinding.includes("8% above the expected"), "Rec 2 AI finding matches specification");

  const rec3 = INITIAL_PRIORITY_RECOMMENDATIONS[2];
  assert(rec3.title === "Chocolate Biscuit rejection rate increased", "Rec 3 title matches specification");
  assert(rec3.priority === "Medium", "Rec 3 priority is MEDIUM");

  // 5. Test Predictive Maintenance Machines
  console.log("\n--- 5. Predictive Maintenance Table Verification ---");
  assert(INITIAL_PREDICTIVE_MAINTENANCE.length === 5, "5 machines in predictive maintenance table");
  const m1 = INITIAL_PREDICTIVE_MAINTENANCE.find(m => m.machine === "Baking Oven 1");
  assert(m1 && m1.riskScore === 18 && m1.prediction === "Low Risk" && m1.mainSignal === "Normal temperature", "Baking Oven 1: 18%, Low Risk, Normal temperature");
  const m2 = INITIAL_PREDICTIVE_MAINTENANCE.find(m => m.machine === "Baking Oven 2");
  assert(m2 && m2.riskScore === 42 && m2.prediction === "Medium Risk" && m2.mainSignal === "Temperature variation", "Baking Oven 2: 42%, Medium Risk, Temperature variation");
  const m3 = INITIAL_PREDICTIVE_MAINTENANCE.find(m => m.machine === "Packaging Machine 1");
  assert(m3 && m3.riskScore === 31 && m3.prediction === "Medium Risk" && m3.mainSignal === "Increased vibration", "Packaging Machine 1: 31%, Medium Risk, Increased vibration");
  const m4 = INITIAL_PREDICTIVE_MAINTENANCE.find(m => m.machine === "Packaging Machine 2");
  assert(m4 && m4.riskScore === 78 && m4.prediction === "High Risk" && m4.mainSignal === "High temperature + vibration", "Packaging Machine 2: 78%, High Risk, High temperature + vibration");
  const m5 = INITIAL_PREDICTIVE_MAINTENANCE.find(m => m.machine === "Mixer 1");
  assert(m5 && m5.riskScore === 12 && m5.prediction === "Low Risk" && m5.mainSignal === "Normal", "Mixer 1: 12%, Low Risk, Normal");

  // 6. Test Quality Anomaly Detection
  console.log("\n--- 6. Quality Anomaly Detection Verification ---");
  assert(INITIAL_QUALITY_SUMMARY.overallQualityScore === 96.2, "Overall quality score is 96.2%");
  assert(INITIAL_QUALITY_SUMMARY.detectedAnomalies === 8, "Detected anomalies count is 8");
  assert(QUALITY_REJECTION_TREND.length >= 7, "Quality rejection trend contains time-series entries");
  assert(INITIAL_QUALITY_ANOMALIES.length === 3, "3 quality anomaly cards defined");
  assert(INITIAL_QUALITY_ANOMALIES[0].title.includes("Chocolate Biscuit"), "Quality anomaly 1: Chocolate Biscuit");
  assert(INITIAL_QUALITY_ANOMALIES[1].title.includes("Packaging Defects"), "Quality anomaly 2: Packaging Defects");
  assert(INITIAL_QUALITY_ANOMALIES[2].title.includes("Incorrect Weight"), "Quality anomaly 3: Incorrect Weight");

  // 7. Test Production Forecast
  console.log("\n--- 7. Production Forecast Verification ---");
  assert(INITIAL_PRODUCTION_FORECAST_SUMMARY.next7DaysForecast === "42,500 units", "Next 7 Days Forecast is 42,500 units");
  assert(INITIAL_PRODUCTION_FORECAST_SUMMARY.expectedDemand === "40,800 units", "Expected Demand is 40,800 units");
  assert(INITIAL_PRODUCTION_FORECAST_SUMMARY.forecastStatus === "Capacity Available", "Forecast status is Capacity Available");
  assert(PRODUCTION_FORECAST_SERIES.some(p => p.forecast !== undefined), "Forecast time-series has neural projected data");

  // 8. Test Inventory Forecast Table
  console.log("\n--- 8. Inventory Forecast Table Verification ---");
  assert(INITIAL_INVENTORY_FORECAST.length === 5, "5 inventory forecast materials");
  const invFlour = INITIAL_INVENTORY_FORECAST.find(i => i.material === "Flour");
  assert(invFlour && invFlour.daysRemaining === 6 && invFlour.aiRecommendation === "Reorder soon", "Flour: 6 days, Reorder soon");
  const invSugar = INITIAL_INVENTORY_FORECAST.find(i => i.material === "Sugar");
  assert(invSugar && invSugar.daysRemaining === 6 && invSugar.aiRecommendation === "Reorder soon", "Sugar: 6 days, Reorder soon");
  const invCocoa = INITIAL_INVENTORY_FORECAST.find(i => i.material === "Cocoa");
  assert(invCocoa && invCocoa.daysRemaining === 19 && invCocoa.aiRecommendation === "Healthy", "Cocoa: 19 days, Healthy");
  const invWrapper = INITIAL_INVENTORY_FORECAST.find(i => i.material === "Packaging Wrapper");
  assert(invWrapper && invWrapper.daysRemaining === 6 && invWrapper.aiRecommendation === "High consumption", "Packaging Wrapper: 6 days, High consumption");
  const invBox = INITIAL_INVENTORY_FORECAST.find(i => i.material === "Packaging Box");
  assert(invBox && invBox.daysRemaining === 5 && invBox.aiRecommendation === "Urgent reorder", "Packaging Box: 5 days, Urgent reorder");

  // 9. Test Cost Intelligence
  console.log("\n--- 9. Cost Intelligence Verification ---");
  assert(INITIAL_COST_INTELLIGENCE.materialCostIncrease === "+8%", "Material cost increase is +8%");
  assert(INITIAL_COST_INTELLIGENCE.machineDowntimeCost === 42500, "Machine downtime cost is ₹42,500");
  assert(INITIAL_COST_INTELLIGENCE.productionWasteCost === 28600, "Production waste cost is ₹28,600");
  assert(INITIAL_COST_INTELLIGENCE.potentialSavings === 180000, "Potential savings is ₹1,80,000");

  // 10. Test AI Business Insights
  console.log("\n--- 10. AI Business Insights Verification ---");
  assert(INITIAL_BUSINESS_INSIGHTS.length === 4, "4 business insight cards");
  assert(INITIAL_BUSINESS_INSIGHTS[0].title.includes("Production efficiency improved by 3.2%"), "Insight 1: Production efficiency improved by 3.2%");
  assert(INITIAL_BUSINESS_INSIGHTS[1].title.includes("Machine downtime is concentrated around packaging"), "Insight 2: Machine downtime concentrated around packaging");
  assert(INITIAL_BUSINESS_INSIGHTS[2].title.includes("Quality performance remains strong"), "Insight 3: Quality performance remains strong");
  assert(INITIAL_BUSINESS_INSIGHTS[3].title.includes("Inventory consumption indicates upcoming packaging material"), "Insight 4: Inventory consumption upcoming replenishment");

  // 11. Test Capabilities & Architecture Flow
  console.log("\n--- 11. AI Capabilities & Data Flow Verification ---");
  assert(AI_CAPABILITIES_LIST.length === 6, "6 AI capabilities defined");
  assert(AI_DATA_FLOW_STEPS.length === 7, "7 steps in AI data flow");
  assert(HOW_AI_WORKS_STEPS.length === 6, "6 steps in How AI Makes Recommendations");

  // 12. Check other protected routes status
  console.log("\n--- 12. All ERP Routes Regression Check ---");
  const routesToCheck = [
    "/dashboard",
    "/production",
    "/inventory",
    "/machines",
    "/quality",
    "/procurement",
    "/workforce",
    "/finance",
    "/reports",
  ];

  for (const r of routesToCheck) {
    try {
      const res = await fetchPage(r);
      assert(res.statusCode === 200, `Route ${r} returns HTTP 200 OK`);
    } catch (err) {
      assert(false, `Route ${r} reachable`, err.message);
    }
  }

  console.log("\n==========================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
