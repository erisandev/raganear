const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const CHROME_PATH = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "https://raganear.vercel.app";
const OUTPUT_DIR = path.join(__dirname, "..", "demo-videos");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function addDetailedBanner(page, { stage, tag, title, body, invariant }) {
  await page.evaluate(({ stage, tag, title, body, invariant }) => {
    let banner = document.getElementById("raga-detailed-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "raga-detailed-banner";
      banner.style.position = "fixed";
      banner.style.bottom = "18px";
      banner.style.left = "50%";
      banner.style.transform = "translateX(-50%)";
      banner.style.zIndex = "999999";
      banner.style.backgroundColor = "rgba(7, 11, 22, 0.96)";
      banner.style.border = "2px solid #00E5FF";
      banner.style.boxShadow = "0 10px 40px rgba(0, 229, 255, 0.45), 0 0 15px rgba(0,0,0,0.8)";
      banner.style.padding = "14px 24px";
      banner.style.maxWidth = "960px";
      banner.style.width = "92%";
      banner.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
      banner.style.transition = "all 0.3s ease";
      document.body.appendChild(banner);
    }
    banner.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(0, 229, 255, 0.35); padding-bottom:6px; margin-bottom:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="background:#00E5FF; color:#050914; font-weight:900; font-size:11px; padding:2px 8px; letter-spacing:1px;">FEATURE ${stage}</span>
          <span style="color:#00E5FF; font-weight:bold; font-size:11px; letter-spacing:0.8px;">// ${tag}</span>
        </div>
        <span style="color:#10B981; font-size:11px; font-weight:bold; letter-spacing:1px; display:flex; align-items:center; gap:5px;">
          <span style="width:7px; height:7px; background:#10B981; border-radius:50%; display:inline-block;"></span>
          NEAR TESTNET VERIFIED
        </span>
      </div>
      <div style="color:#FFFFFF; font-size:15px; font-weight:800; letter-spacing:0.5px; margin-bottom:4px;">${title}</div>
      <div style="color:#94A3B8; font-size:12px; line-height:1.45; margin-bottom:6px;">${body}</div>
      ${invariant ? `<div style="background:rgba(239, 68, 68, 0.15); border-left:3px solid #EF4444; padding:3px 8px; color:#FCA5A5; font-size:11px; font-weight:600;">INVARIANT: ${invariant}</div>` : ""}
    `;
  }, { stage, tag, title, body, invariant });
}

async function smoothScroll(page, targetY, durationMs = 2500) {
  await page.evaluate(async ({ targetY, durationMs }) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
    await new Promise((resolve) => {
      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        window.scrollTo(0, startY + diff * ease);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }, { targetY, durationMs });
}

async function recordDetailedWalkthrough() {
  console.log("================================================================================");
  console.log("  RECORDING COMPREHENSIVE FULL-FEATURE RAGA PROTOCOL DEMONSTRATION");
  console.log(`  Target: ${BASE_URL} | Output: ${OUTPUT_DIR}`);
  console.log("================================================================================\n");

  const tempDir = path.join(OUTPUT_DIR, `temp-detailed-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const width = 1280;
  const height = 720;

  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: {
      dir: tempDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();

  try {
    // =========================================================================
    // FEATURE 1: PROTOCOL THESIS & PARADIGM SHIFT (LANDING PAGE)
    // =========================================================================
    console.log("[1/10] Recording Landing Page & Protocol Thesis...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "01",
      tag: "THE PARADIGM SHIFT",
      title: "AUTONOMOUS AI WORKERS AS TOKEN-BOUND SMART ACCOUNTS",
      body: "Static NFTs are claims of value with zero execution ability. RAGA binds every NEP-171 NFT to a native NEAR hierarchical sub-account (<token_id>.<contract_id>) where the smart contract is the sole parent authority—zero private keys exist.",
      invariant: "Sole Authority Parent: Sub-account cannot be drained because no human holds a FullAccess private key."
    });
    await page.waitForTimeout(4500);

    // Scroll to Live Testnet Proof Telemetry
    await smoothScroll(page, 480, 2500);
    await addDetailedBanner(page, {
      stage: "01",
      tag: "ON-CHAIN TELEMETRY PROOF",
      title: "RECORDED ON NEAR TESTNET (raga-protocol-mw93m309.testnet)",
      body: "Live cryptographic receipts: Contract Deploy Tx (4t1mhziP...), Init Tx (FxDs3ufv...), NEP-178 Transfer Lock, and streaming revenue claims verifiable on Nearblocks explorer.",
      invariant: "Zero Mocks Invariant: 100% of telemetry queries real NEAR Testnet validator state."
    });
    await page.waitForTimeout(4500);

    // Scroll to Comparison Matrix & 4 Stages
    await smoothScroll(page, 1250, 2500);
    await addDetailedBanner(page, {
      stage: "01",
      tag: "CORE LIFECYCLE",
      title: "FOUR STAGES: MINT -> TIME-LOCK LEASE -> TRANSFER FREEZE -> YIELD",
      body: "1. Mint sovereign identity | 2. Commit duration & delegate execution | 3. NEP-178 transfer freeze panic locks against rugpulls | 4. Stream non-custodial yield directly to owner vault.",
    });
    await page.waitForTimeout(4500);

    // Scroll to Honest Boundaries
    await smoothScroll(page, 2450, 2500);
    await addDetailedBanner(page, {
      stage: "01",
      tag: "DESIGN BOUNDARIES",
      title: "HONEST ENGINEERING BOUNDARIES // ZERO WASM LLM ILLUSION",
      body: "RAGA does not pretend heavy neural networks run inside WASM smart contracts. Heavy inference runs off-chain; the Rust contract verifies SHA-256 cryptographic attestation proofs and delegates proxy calls.",
      invariant: "Honesty Invariant: State machine enforces cryptographic proofs, not multi-gigabyte neural weights."
    });
    await page.waitForTimeout(4500);

    // =========================================================================
    // FEATURE 2: FOUNDRY WORKSPACE & IDENTITY ROLE SWITCHER
    // =========================================================================
    console.log("[2/10] Recording Foundry Workspace & Identity Switcher...");
    await page.goto(`${BASE_URL}/app`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    await addDetailedBanner(page, {
      stage: "02",
      tag: "FOUNDRY WORKSPACE",
      title: "LIVE ON-CHAIN AI AGENT CARTRIDGES & IDENTITY SWITCHER",
      body: "4 active autonomous worker units on testnet. The top navbar features a zero-trust Role Switcher: Tenant/Renter (raga-renter-mw94dqty.testnet), Owner (raga-protocol-mw93m309.testnet), Operator Daemon, and Hackathon Judge.",
    });
    await page.waitForTimeout(3500);

    // Demonstrate role switching in UI
    const roleSelect = await page.$("select");
    if (roleSelect) {
      await roleSelect.selectOption({ index: 0 }); // Tenant
      await page.waitForTimeout(1500);
      await roleSelect.selectOption({ index: 2 }); // Owner
      await page.waitForTimeout(1500);
      await roleSelect.selectOption({ index: 0 }); // Back to Tenant
      await page.waitForTimeout(1500);
    }

    // Scroll through the agent cartridges
    await smoothScroll(page, 320, 2000);
    await addDetailedBanner(page, {
      stage: "02",
      tag: "DYNAMIC NFTS",
      title: "CHRONOS ORACLE-03 & BOUND SUB-ACCOUNT MAPPING",
      body: "Every agent displays its deterministic bound sub-account, current operator, per-second micro-lease rate, accumulated lifetime tasks, and on-chain dynamic reputation score (100–1000).",
    });
    await page.waitForTimeout(4500);

    // =========================================================================
    // FEATURE 3: MINT STUDIO (4-STEP INTERACTIVE WIZARD)
    // =========================================================================
    console.log("[3/10] Recording Mint Studio 4-Step Interactive Wizard...");
    await page.goto(`${BASE_URL}/app?tab=mint`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    await addDetailedBanner(page, {
      stage: "03",
      tag: "MINT STUDIO",
      title: "STEP 1: AGENT IDENTITY & METADATA FORGING",
      body: "Forge new NEP-171 worker token. Configures token ID, agent name, and autonomous capability profile with real-time cartridge preview.",
    });
    await page.waitForTimeout(3500);

    // Click Next Step in wizard
    const nextBtn1 = await page.$("button:has-text('NEXT: SPECIFY CAPABILITIES'), button:has-text('NEXT')");
    if (nextBtn1) await nextBtn1.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "03",
      tag: "MINT STUDIO",
      title: "STEP 2: CAPABILITY SELECTION & MODEL PROMPTING",
      body: "Select specialized operational archetype: Autonomous Oracle, Yield Arbitrageur, Security Sentry, or Cross-Contract Dispatcher.",
    });
    await page.waitForTimeout(3000);

    const nextBtn2 = await page.$("button:has-text('NEXT: SUB-ACCOUNT DERIVATION'), button:has-text('NEXT')");
    if (nextBtn2) await nextBtn2.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "03",
      tag: "MINT STUDIO",
      title: "STEP 3: PROTOCOL SUB-ACCOUNT BINDING DERIVATION",
      body: "Smart contract acts as sole parent authority. Programmatically derives <token_id>.raga-protocol-mw93m309.testnet with zero human FullAccess key vulnerability.",
      invariant: "Zero Human Key: Contract constructs and controls sub-account via native NEAR L1 hierarchy."
    });
    await page.waitForTimeout(4000);

    const nextBtn3 = await page.$("button:has-text('NEXT: STAKING & RATES'), button:has-text('NEXT')");
    if (nextBtn3) await nextBtn3.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "03",
      tag: "MINT STUDIO",
      title: "STEP 4: STORAGE STAKING & STREAMING RENTAL RATE",
      body: "Attaches ~0.05 NEAR storage deposit required by NEAR L1 state-staking economics and sets per-second rental lease rate in yoctoNEAR.",
    });
    await page.waitForTimeout(4000);

    // =========================================================================
    // FEATURE 4: TIME-LOCKED MICRO-LEASING SLA (RENT MODAL)
    // =========================================================================
    console.log("[4/10] Recording Time-Locked Micro-Leasing SLA...");
    await page.goto(`${BASE_URL}/app?tab=marketplace`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);

    await addDetailedBanner(page, {
      stage: "04",
      tag: "TIME-LOCKED LEASING",
      title: "NANOSECOND-PRECISION RENTAL SLA (rent_agent)",
      body: "Tenants lease agent capacity by attaching NEAR. Contract calculates: expires_at = env::block_timestamp() + duration_nanos, granting exclusive operational delegation to the renter.",
    });

    // Open Rent Modal
    const rentBtns = await page.$$("button");
    for (const btn of rentBtns) {
      const text = await btn.textContent();
      if (text && text.includes("RENT AGENT")) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(3500);

    // Close rent modal
    const closeBtns = await page.$$("button");
    for (const btn of closeBtns) {
      const text = await btn.textContent();
      if (text && (text.includes("CANCEL") || text.includes("CLOSE") || text === "✕")) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(1500);

    // =========================================================================
    // FEATURE 5: NEP-178 ANTI-THEFT TRANSFER FREEZE (ANTI-RUGPULL INVARIANT)
    // =========================================================================
    console.log("[5/10] Recording NEP-178 Anti-Theft Transfer Freeze...");
    // Switch to Owner identity
    await page.selectOption("select", "raga-protocol-mw93m309.testnet");
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "05",
      tag: "CORE SECURITY INVARIANT",
      title: "NEP-178 TRANSFER FREEZE INVARIANT (ANTI-RUGPULL PROTECTION)",
      body: "Owner attempts to sell or transfer agent-oracle-03 while an active lease is running. Notice: the form and submit button are completely locked with the warning 'TRANSACTION TIME-LOCKED'.",
      invariant: "NEP-178 Invariant: Renter cannot be evicted or front-run; lease SLA is cryptographically guaranteed."
    });
    await page.waitForTimeout(2000);

    // Click Transfer button on rented token
    const transferBtn = await page.$("button:has-text('TRANSFER')");
    if (transferBtn) {
      await transferBtn.click({ force: true });
    }
    // Let the viewer clearly see the TRANSACTION TIME-LOCKED warning and disabled state
    await page.waitForTimeout(4500);

    // Close transfer modal cleanly via close button
    const closeBtn = await page.$("div.fixed button:has(svg)");
    if (closeBtn) {
      await closeBtn.click();
    }
    await page.waitForTimeout(1500);

    // =========================================================================
    // FEATURE 6: DISPATCH CONSOLE & PROXY CALL (execute_as_agent)
    // =========================================================================
    console.log("[6/10] Recording Dispatch Console & Proxy Action...");
    // Switch back to Tenant
    await page.selectOption("select", "raga-renter-mw94dqty.testnet");
    await page.waitForTimeout(1000);

    // Click DISPATCH tab in navbar
    const dispatchTab = await page.$("button:has-text('DISPATCH')");
    if (dispatchTab) await dispatchTab.click();
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "06",
      tag: "CROSS-CONTRACT DISPATCH",
      title: "DELEGATED SUB-ACCOUNT EXECUTION (execute_as_agent)",
      body: "Active tenant commands the agent's sub-account to call arbitrary smart contracts (Ref Finance, wrap.testnet). Contract validates caller == effective_operator and executes as parent authority.",
    });
    await page.waitForTimeout(3500);

    // Open execute action modal
    const execBtn = await page.$("button:has-text('EXECUTE WORKLOAD'), button:has-text('EXECUTE')");
    if (execBtn) {
      await execBtn.click();
      await page.waitForTimeout(3000);
      const closeExecBtn = await page.$("div.fixed button:has(svg)");
      if (closeExecBtn) await closeExecBtn.click();
    }

    await addDetailedBanner(page, {
      stage: "06",
      tag: "DYNAMIC PROGRESSION",
      title: "DYNAMIC NFT REPUTATION & TASK SCORE ACCRUAL",
      body: "Every verified task execution increments tasks_completed on-chain and updates reputation_score (100–1000). RAGA tokens are living assets that appreciate with proven labor.",
      invariant: "Dynamic Progression: Workload completion verifiable on NEAR Testnet explorer."
    });
    await page.waitForTimeout(4000);

    // =========================================================================
    // FEATURE 7: FLEET VAULT & STREAMING REVENUE CLAIMS
    // =========================================================================
    console.log("[7/10] Recording Fleet Vault & Streaming Revenue Claims...");
    // Switch to Owner identity
    await page.selectOption("select", "raga-protocol-mw93m309.testnet");
    await page.waitForTimeout(1000);

    const fleetTab = await page.$("button:has-text('MY FLEET')");
    if (fleetTab) await fleetTab.click();
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "07",
      tag: "ECONOMIC ENGINE",
      title: "FLEET VAULT // 100% NON-CUSTODIAL STREAMING REVENUE",
      body: "Rental fees route directly to the token owner's unclaimed_revenue pool. The owner withdraws accumulated streaming yield on-demand using claim_agent_revenue with zero intermediary fees.",
    });
    await page.waitForTimeout(3500);

    await smoothScroll(page, 300, 1500);
    await addDetailedBanner(page, {
      stage: "07",
      tag: "YIELD SETTLEMENT",
      title: "CLAIM REVENUE & PROTOCOL WITHDRAWAL RECEIPT",
      body: "Executing claim_agent_revenue transfers pending yoctoNEAR balance to owner's wallet and resets unclaimed_revenue to 0 with verifiable on-chain event receipts.",
    });
    await page.waitForTimeout(4000);

    // =========================================================================
    // FEATURE 8: ZERO-TRUST CRYPTOGRAPHIC AUDITOR LAB
    // =========================================================================
    console.log("[8/10] Recording Zero-Trust Cryptographic Auditor Lab...");
    const auditorTab = await page.$("button:has-text('AUDITOR')");
    if (auditorTab) await auditorTab.click();
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "08",
      tag: "AUDITOR LAB",
      title: "FORMAL KEY SANDBOXING & SUB-ACCOUNT AUTHORITY MATRIX",
      body: "Proves keyless isolation: RAGA parent contract holds sole FullAccess key over the sub-account. Neither human owners nor malicious actors can execute rogue transactions.",
      invariant: "Security Invariant: Zero FullAccess human keys exposed on any agent sub-account."
    });
    await page.waitForTimeout(3500);

    // Scroll to Raw JSON-RPC inspector
    await smoothScroll(page, 450, 2000);
    await addDetailedBanner(page, {
      stage: "08",
      tag: "RPC INSPECTOR",
      title: "RAW NEAR JSON-RPC INSPECTOR & BORSH STATE TELEMETRY",
      body: "Judges can inspect raw on-chain state responses directly from validator nodes: nft_tokens, get_agent, and nft_total_supply.",
    });
    await page.waitForTimeout(4000);

    // =========================================================================
    // FEATURE 9: IN-APP AGENT DOCS (1-CLICK EVALUATION SUITE)
    // =========================================================================
    console.log("[9/10] Recording In-App Agent Docs Evaluation Suite...");
    const docsTab = await page.$("button:has-text('AGENT DOCS')");
    if (docsTab) await docsTab.click();
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "09",
      tag: "EVALUATOR SUITE",
      title: "MACHINE-READABLE 1-CLICK CLI EVALUATION ROUTINES",
      body: "Pre-configured near call commands for hackathon judges and AI screening agents (Claude Code / Codex): 1. Mint Agent | 2. Rent Agent | 3. Proxy Action | 4. Transfer Panic Test | 5. Claim Yield.",
    });
    await page.waitForTimeout(4000);

    await smoothScroll(page, 380, 2000);
    await page.waitForTimeout(3000);

    // =========================================================================
    // FEATURE 10: FORMAL SPECIFICATIONS PORTAL & CLOSING
    // =========================================================================
    console.log("[10/10] Recording Technical Documentation Hub & Closing...");
    await page.goto(`${BASE_URL}/docs/overview`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "10",
      tag: "ENGINEERING DOCS",
      title: "TECHNICAL DOCUMENTATION HUB & REPRODUCIBILITY SUITE",
      body: "Zero-dependency AST Markdown viewer rendering master technical specs: Architecture, Implementation Invariants, Testnet Integrations, and Deployment Runbooks.",
    });
    await smoothScroll(page, 400, 2000);
    await page.waitForTimeout(4000);

    // Final closing screen
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await addDetailedBanner(page, {
      stage: "SUMMARY",
      tag: "NEAR HACKATHON 2026",
      title: "RAGA PROTOCOL // 100% OPERATIONAL ON NEAR TESTNET",
      body: "Live dApp: raganear.vercel.app | Root Contract: raga-protocol-mw93m309.testnet | GitHub: github.com/erisandev/raganear | 18/18 Tests Passed | Zero Mocks.",
    });
    await page.waitForTimeout(5000);

    console.log("Walkthrough recording complete!");

  } catch (err) {
    console.error("Error during recording:", err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    const files = fs.readdirSync(tempDir);
    const videoFile = files.find(f => f.endsWith(".webm"));
    if (videoFile) {
      const srcPath = path.join(tempDir, videoFile);
      const destPath = path.join(OUTPUT_DIR, "raga-comprehensive-demo-all-features.webm");
      fs.copyFileSync(srcPath, destPath);
      console.log(`\n[SUCCESS] Master Video Saved: ${destPath} (${(fs.statSync(destPath).size / 1024 / 1024).toFixed(2)} MB)`);
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

recordDetailedWalkthrough().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
