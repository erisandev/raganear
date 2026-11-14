const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CHROME_PATH = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const FFMPEG_PATH = "C:\\Users\\Caussel\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe";
const BASE_URL = "https://raganear.vercel.app";
const OUTPUT_DIR = path.join(__dirname, "..", "demo-videos");
const AUDIO_DIR = path.join(__dirname, "audio-temp");
const FULL_AUDIO_PATH = path.join(AUDIO_DIR, "full-narration.wav");

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

async function recordSyncedWalkthrough() {
  console.log("================================================================================");
  console.log("  RECORDING SYNCED FULL-FEATURE DEMO WITH VOICE NARRATION");
  console.log(`  Target: ${BASE_URL} | Output: ${OUTPUT_DIR}`);
  console.log("================================================================================\n");

  const tempDir = path.join(OUTPUT_DIR, `temp-synced-${Date.now()}`);
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
    // SEGMENT 01: HOOK & PARADIGM SHIFT (Duration ~33.0s)
    // =========================================================================
    console.log("[1/10] Recording 01-hook: Landing Hero & Protocol Thesis (33s)...");
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "01",
      tag: "THE PARADIGM SHIFT",
      title: "AUTONOMOUS AI WORKERS AS TOKEN-BOUND SMART ACCOUNTS",
      body: "Static NFTs are claims of value with zero execution ability. RAGA binds every NEP-171 NFT to a native NEAR hierarchical sub-account (<token_id>.<contract_id>) where the smart contract is the sole parent authority—zero private keys exist.",
      invariant: "Sole Authority Parent: Sub-account cannot be drained because no human holds a FullAccess private key."
    });
    // Hover over nav links showing "WHY RAGA" and "HOW IT WORKS"
    await page.waitForTimeout(14000);

    // Subtle scroll down to view token bound visual cards
    await smoothScroll(page, 280, 2500);
    await page.waitForTimeout(14500); // Total ~33s

    // =========================================================================
    // SEGMENT 02: LIVE TESTNET TELEMETRY (Duration ~16.3s)
    // =========================================================================
    console.log("[2/10] Recording 02-telemetry: Testnet Cryptographic Receipts (16.3s)...");
    await smoothScroll(page, 580, 2500);
    await addDetailedBanner(page, {
      stage: "02",
      tag: "ON-CHAIN TELEMETRY PROOF",
      title: "RECORDED ON NEAR TESTNET (raga-protocol-mw93m309.testnet)",
      body: "Live cryptographic receipts: Contract Deploy Tx (4t1mhziP...), Init Tx (FxDs3ufv...), NEP-178 Transfer Lock, and streaming revenue claims verifiable on Nearblocks explorer.",
      invariant: "Zero Mocks Invariant: 100% of telemetry queries real NEAR Testnet validator state."
    });
    await page.waitForTimeout(13800); // Total ~16.3s

    // =========================================================================
    // SEGMENT 03: WHY RAGA & HOW IT WORKS (Duration ~19.6s)
    // =========================================================================
    console.log("[3/10] Recording 03-why-and-how: WHY RAGA & HOW IT WORKS (19.6s)...");
    await smoothScroll(page, 1150, 2500);
    await addDetailedBanner(page, {
      stage: "03",
      tag: "WHY RAGA // THE PARADIGM SHIFT",
      title: "WHY RAGA: TURNING PASSIVE ART INTO PRODUCTIVE SOVEREIGN CAPITAL",
      body: "Comparison Matrix: Static NFTs (0 cashflow, manual signing, key-theft risk) vs RAGA Token-Bound Workers (micro-leasing yield, autonomous sub-accounts, NEP-178 anti-theft transfer freeze).",
    });
    await page.waitForTimeout(8000);

    // Scroll to HOW IT WORKS
    await smoothScroll(page, 1950, 2500);
    await addDetailedBanner(page, {
      stage: "03",
      tag: "HOW IT WORKS // 4 STAGES",
      title: "HOW IT WORKS: 4 STAGES OF AUTONOMOUS OPERATION",
      body: "Stage 1: Mint Sovereign Identity | Stage 2: Commit Time-Locked Lease | Stage 3: NEP-178 Anti-Theft Transfer Freeze | Stage 4: Autonomous Non-Custodial Yield Streaming.",
      invariant: "Honest State Machine: Micro-leasing SLA enforced at nanosecond block-timestamp precision."
    });
    await page.waitForTimeout(6600); // Total ~19.6s

    // =========================================================================
    // SEGMENT 04: FOUNDRY WORKSPACE & AGENTS (Duration ~20.7s)
    // =========================================================================
    console.log("[4/10] Recording 04-workspace: Foundry Workspace & Role Switcher (20.7s)...");
    await page.goto(`${BASE_URL}/app`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);

    await addDetailedBanner(page, {
      stage: "04",
      tag: "FOUNDRY WORKSPACE",
      title: "LIVE ON-CHAIN AI AGENT CARTRIDGES & IDENTITY SWITCHER",
      body: "4 active autonomous worker units on testnet. The top navbar features a zero-trust Role Switcher: Tenant/Renter, Owner (Foundry Vault), Operator Daemon, and Hackathon Judge.",
    });
    await page.waitForTimeout(3000);

    // Demonstrate role switching in UI
    await page.selectOption("select", "raga-protocol-mw93m309.testnet"); // Owner
    await page.waitForTimeout(3000);
    await page.selectOption("select", "raga-renter-mw94dqty.testnet"); // Tenant
    await page.waitForTimeout(2500);

    // Scroll down to showcase Chronos Oracle-03
    await smoothScroll(page, 320, 2000);
    await addDetailedBanner(page, {
      stage: "04",
      tag: "DYNAMIC NFTS",
      title: "CHRONOS ORACLE-03 & BOUND SUB-ACCOUNT MAPPING",
      body: "Deterministic sub-account: agent-oracle-03.raga-protocol-mw93m309.testnet. Displays live lease rate, operator status, accumulated tasks, and dynamic reputation score (100–1000).",
    });
    await page.waitForTimeout(8200); // Total ~20.7s

    // =========================================================================
    // SEGMENT 05: MINT STUDIO (4 STEPS) (Duration ~15.2s)
    // =========================================================================
    console.log("[5/10] Recording 05-mint-studio: 4-Step Interactive Wizard (15.2s)...");
    const mintTab = await page.$("button:has-text('MINT STUDIO')");
    if (mintTab) await mintTab.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "05",
      tag: "MINT STUDIO",
      title: "STEP 1 & 2: AGENT IDENTITY & SPECIALIZED CAPABILITIES",
      body: "Forge new NEP-171 worker token. Configure token ID, capability archetype (Autonomous Oracle, Yield Arbitrageur, Security Sentry), and real-time cartridge preview.",
    });
    await page.waitForTimeout(3000);

    // Click Next Step in wizard
    const nextBtn1 = await page.$("button:has-text('NEXT: SPECIFY CAPABILITIES'), button:has-text('NEXT')");
    if (nextBtn1) await nextBtn1.click();
    await page.waitForTimeout(2500);

    const nextBtn2 = await page.$("button:has-text('NEXT: SUB-ACCOUNT DERIVATION'), button:has-text('NEXT')");
    if (nextBtn2) await nextBtn2.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "05",
      tag: "MINT STUDIO",
      title: "STEP 3 & 4: SUB-ACCOUNT BINDING & STORAGE STAKING",
      body: "Derives <token_id>.raga-protocol-mw93m309.testnet under contract parent authority. Attaches ~0.05 NEAR storage deposit and sets per-second rental lease rate.",
      invariant: "Zero Human Key: Contract constructs and controls sub-account via native NEAR L1 hierarchy."
    });

    const nextBtn3 = await page.$("button:has-text('NEXT: STAKING & RATES'), button:has-text('NEXT')");
    if (nextBtn3) await nextBtn3.click();
    await page.waitForTimeout(5700); // Total ~15.2s

    // =========================================================================
    // SEGMENT 06: TIME-LOCKED MICRO-LEASING (Duration ~12.0s)
    // =========================================================================
    console.log("[6/10] Recording 06-leasing: Time-Locked Micro-Leasing (12.0s)...");
    const marketTab = await page.$("button:has-text('MARKETPLACE')");
    if (marketTab) await marketTab.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "06",
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
    await page.waitForTimeout(6500);

    // Close rent modal
    const closeRentBtn = await page.$("div.fixed button:has(svg)");
    if (closeRentBtn) await closeRentBtn.click();
    await page.waitForTimeout(2000); // Total ~12.0s

    // =========================================================================
    // SEGMENT 07: NEP-178 TRANSFER FREEZE INVARIANT (Duration ~18.2s)
    // =========================================================================
    console.log("[7/10] Recording 07-transfer-freeze: Anti-Rugpull Protection (18.2s)...");
    // Switch to Owner identity
    await page.selectOption("select", "raga-protocol-mw93m309.testnet");
    await page.waitForTimeout(1200);

    await addDetailedBanner(page, {
      stage: "07",
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
    await page.waitForTimeout(10000);

    // Close transfer modal cleanly
    const closeTransBtn = await page.$("div.fixed button:has(svg)");
    if (closeTransBtn) await closeTransBtn.click();
    await page.waitForTimeout(3000); // Total ~18.2s

    // =========================================================================
    // SEGMENT 08: DISPATCH CONSOLE & PROXY CALL (Duration ~15.1s)
    // =========================================================================
    console.log("[8/10] Recording 08-dispatch: Proxy Execution & Dynamic Rep (15.1s)...");
    // Switch back to Tenant
    await page.selectOption("select", "raga-renter-mw94dqty.testnet");
    await page.waitForTimeout(1000);

    // Click DISPATCH tab in navbar
    const dispatchTab = await page.$("button:has-text('DISPATCH')");
    if (dispatchTab) await dispatchTab.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "08",
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
      stage: "08",
      tag: "DYNAMIC PROGRESSION",
      title: "DYNAMIC NFT REPUTATION & TASK SCORE ACCRUAL",
      body: "Every verified task execution increments tasks_completed on-chain and updates reputation_score (100–1000). RAGA tokens are living assets that appreciate with proven labor.",
      invariant: "Dynamic Progression: Workload completion verifiable on NEAR Testnet explorer."
    });
    await page.waitForTimeout(5100); // Total ~15.1s

    // =========================================================================
    // SEGMENT 09: FLEET VAULT & STREAMING REVENUE (Duration ~11.8s)
    // =========================================================================
    console.log("[9/10] Recording 09-vault: Non-Custodial Yield Streaming (11.8s)...");
    // Switch to Owner identity
    await page.selectOption("select", "raga-protocol-mw93m309.testnet");
    await page.waitForTimeout(1000);

    const fleetTab = await page.$("button:has-text('MY FLEET')");
    if (fleetTab) await fleetTab.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "09",
      tag: "ECONOMIC ENGINE",
      title: "FLEET VAULT // 100% NON-CUSTODIAL STREAMING REVENUE",
      body: "Rental fees route directly to the token owner's unclaimed_revenue pool. The owner withdraws accumulated streaming yield on-demand using claim_agent_revenue with zero intermediary fees.",
    });
    await page.waitForTimeout(3500);

    await smoothScroll(page, 280, 1500);
    await addDetailedBanner(page, {
      stage: "09",
      tag: "YIELD SETTLEMENT",
      title: "CLAIM REVENUE & PROTOCOL WITHDRAWAL RECEIPT",
      body: "Executing claim_agent_revenue transfers pending yoctoNEAR balance to owner's wallet and resets unclaimed_revenue to 0 with verifiable on-chain event receipts.",
    });
    await page.waitForTimeout(4800); // Total ~11.8s

    // =========================================================================
    // SEGMENT 10: AUDITOR LAB & CLOSING (Duration ~15.1s)
    // =========================================================================
    console.log("[10/10] Recording 10-auditor-closing: Auditor Lab & Final Summary (15.1s)...");
    const auditorTab = await page.$("button:has-text('AUDITOR')");
    if (auditorTab) await auditorTab.click();
    await page.waitForTimeout(1500);

    await addDetailedBanner(page, {
      stage: "10",
      tag: "AUDITOR LAB",
      title: "FORMAL KEY SANDBOXING & SUB-ACCOUNT AUTHORITY MATRIX",
      body: "Proves keyless isolation: RAGA parent contract holds sole FullAccess key over the sub-account. Neither human owners nor malicious actors can execute rogue transactions.",
      invariant: "Security Invariant: Zero FullAccess human keys exposed on any agent sub-account."
    });
    await page.waitForTimeout(3500);

    // Scroll to JSON-RPC inspector
    await smoothScroll(page, 450, 1800);
    await page.waitForTimeout(3000);

    // Return to Landing page for final outro
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    await addDetailedBanner(page, {
      stage: "SUMMARY",
      tag: "NEAR HACKATHON 2026",
      title: "RAGA PROTOCOL // 100% OPERATIONAL ON NEAR TESTNET",
      body: "Live dApp: raganear.vercel.app | Root Contract: raga-protocol-mw93m309.testnet | GitHub: github.com/erisandev/raganear | 18/18 Tests Passed | Zero Mocks.",
    });
    await page.waitForTimeout(4800); // Total ~15.1s

    console.log("\n[SUCCESS] Raw video recording finished cleanly!");

  } catch (err) {
    console.error("Error during recording:", err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    const files = fs.readdirSync(tempDir);
    const videoFile = files.find(f => f.endsWith(".webm"));
    if (videoFile) {
      const srcWebm = path.join(tempDir, videoFile);
      const rawWebmDest = path.join(OUTPUT_DIR, "raga-raw-synced-video.webm");
      fs.copyFileSync(srcWebm, rawWebmDest);
      console.log(`Saved raw video: ${rawWebmDest}`);

      // Mux with audio using FFmpeg
      const finalMp4 = path.join(OUTPUT_DIR, "raga-full-demo-with-voice.mp4");
      console.log(`\nMuxing video + audio with FFmpeg into ${finalMp4}...`);
      try {
        const cmd = `"${FFMPEG_PATH}" -y -i "${rawWebmDest}" -i "${FULL_AUDIO_PATH}" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 -c:a aac -b:a 192k -shortest "${finalMp4}"`;
        execSync(cmd, { stdio: "inherit" });
        const stat = fs.statSync(finalMp4);
        console.log(`\n================================================================================`);
        console.log(`  🎉 FINAL MASTER DEMO VIDEO GENERATED SUCCESSFULLY!`);
        console.log(`  Path: ${finalMp4}`);
        console.log(`  Size: ${(stat.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`================================================================================\n`);
      } catch (muxErr) {
        console.error("FFmpeg muxing failed:", muxErr);
      }
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

recordSyncedWalkthrough().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
