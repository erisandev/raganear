const { chromium } = require("playwright-core");
const fs = require("fs");
const path = require("path");

const CHROME_PATH = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "https://raganear.vercel.app";
const OUTPUT_DIR = path.join(__dirname, "recordings");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function addSubtitleBanner(page, stepNumber, title, subtitle) {
  await page.evaluate(({ stepNumber, title, subtitle }) => {
    let banner = document.getElementById("raga-demo-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "raga-demo-banner";
      banner.style.position = "fixed";
      banner.style.bottom = "24px";
      banner.style.left = "50%";
      banner.style.transform = "translateX(-50%)";
      banner.style.zIndex = "999999";
      banner.style.backgroundColor = "rgba(10, 15, 30, 0.95)";
      banner.style.border = "2px solid #00E5FF";
      banner.style.boxShadow = "0 8px 32px rgba(0, 229, 255, 0.4)";
      banner.style.padding = "14px 28px";
      banner.style.borderRadius = "0px";
      banner.style.fontFamily = "monospace";
      banner.style.maxWidth = "880px";
      banner.style.width = "90%";
      banner.style.textAlign = "center";
      banner.style.transition = "all 0.3s ease";
      document.body.appendChild(banner);
    }
    banner.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(0, 229, 255, 0.3); padding-bottom: 6px; margin-bottom: 6px;">
        <span style="background: #00E5FF; color: #000; font-weight: bold; font-size: 11px; padding: 2px 8px; letter-spacing: 1px;">STAGE ${stepNumber} // RAGA PROTOCOL</span>
        <span style="color: #00FF88; font-size: 11px; font-weight: bold; letter-spacing: 1px;">● LIVE NEAR TESTNET</span>
      </div>
      <div style="color: #FFFFFF; font-size: 15px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 3px;">${title}</div>
      <div style="color: #94A3B8; font-size: 12px; line-height: 1.4;">${subtitle}</div>
    `;
  }, { stepNumber, title, subtitle });
}

async function smoothScroll(page, targetY, durationMs = 2000) {
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

async function recordClip({ name, width = 1280, height = 720, task }) {
  console.log(`\n========================================================`);
  console.log(`[RECORDING] Starting clip: ${name}...`);
  console.log(`========================================================`);

  const tempDir = path.join(OUTPUT_DIR, `temp-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width, height },
    recordVideo: {
      dir: tempDir,
      size: { width, height },
    },
  });

  const page = await context.newPage();

  try {
    await task(page);
  } catch (err) {
    console.error(`Error during recording ${name}:`, err);
  } finally {
    await page.close();
    await context.close();
    await browser.close();

    const files = fs.readdirSync(tempDir);
    const videoFile = files.find(f => f.endsWith(".webm"));
    if (videoFile) {
      const srcPath = path.join(tempDir, videoFile);
      const destPath = path.join(OUTPUT_DIR, `${name}.webm`);
      fs.copyFileSync(srcPath, destPath);
      console.log(`[SUCCESS] Saved video: ${destPath} (${(fs.statSync(destPath).size / 1024 / 1024).toFixed(2)} MB)`);
    }
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  console.log("=== RAGA PROTOCOL AUTOMATED VIDEO RECORDING SUITE ===");
  console.log(`Target dApp URL: ${BASE_URL}`);
  console.log(`Output Directory: ${OUTPUT_DIR}\n`);

  // (Clips 1, 2, 3 already recorded successfully)

  // -------------------------------------------------------------------------
  // CLIP 4: Dispatch Console & Delegated Proxy Execution (01:45 - 02:15)
  // -------------------------------------------------------------------------
  await recordClip({
    name: "clip-4-dispatch-proxy-action",
    task: async (page) => {
      await page.goto(`${BASE_URL}/app?tab=dispatch`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);

      await addSubtitleBanner(
        page,
        "04",
        "DISPATCH CONSOLE // DELEGATED PROXY EXECUTION",
        "Authorized operator dispatches cross-contract action via sub-account proxy (execute_as_agent)."
      );
      await page.waitForTimeout(3000);

      // Open Execute Proxy Modal
      const execBtns = await page.$$("button");
      for (const btn of execBtns) {
        const text = await btn.textContent();
        if (text && (text.includes("EXECUTE") || text.includes("DISPATCH ACTION"))) {
          await btn.click();
          break;
        }
      }
      await page.waitForTimeout(3000);

      await addSubtitleBanner(
        page,
        "04",
        "DYNAMIC PROGRESSION ENGINE",
        "Every successful workload increments tasks_completed and boosts reputation_score on-chain."
      );
      await page.waitForTimeout(3500);
    },
  });

  // -------------------------------------------------------------------------
  // CLIP 5: Zero-Trust Auditor & Full Architecture (02:15 - 03:00)
  // -------------------------------------------------------------------------
  await recordClip({
    name: "clip-5-auditor-and-docs",
    task: async (page) => {
      // 1. Auditor Tab
      await page.goto(`${BASE_URL}/app?tab=auditor`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);

      await addSubtitleBanner(
        page,
        "05",
        "ZERO-TRUST CRYPTOGRAPHIC AUDITOR LAB",
        "Formal key sandboxing matrix, raw JSON-RPC inspector, and live cryptographic verification."
      );
      await smoothScroll(page, 400, 2000);
      await page.waitForTimeout(3500);

      // 2. Agent Docs Tab
      await page.goto(`${BASE_URL}/app?tab=docs`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      await addSubtitleBanner(
        page,
        "05",
        "IN-APP CLI EVALUATION SUITE",
        "1-click deterministic 'Do X — See Y' near call routines for hackathon judges."
      );
      await smoothScroll(page, 350, 2000);
      await page.waitForTimeout(3500);

      // 3. Technical Docs Portal
      await page.goto(`${BASE_URL}/docs/overview`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);

      await addSubtitleBanner(
        page,
        "05",
        "FULL SPECIFICATION & BENCHMARK DOCUMENTATION",
        "100% open-source, reproducible, and ready for evaluation at raganear.vercel.app."
      );
      await smoothScroll(page, 500, 2000);
      await page.waitForTimeout(4000);
    },
  });

  // -------------------------------------------------------------------------
  // CLIP 6: FULL 3-MINUTE CONTINUOUS WALKTHROUGH (ALL-IN-ONE)
  // -------------------------------------------------------------------------
  await recordClip({
    name: "raga-full-demo-walkthrough-3min",
    width: 1280,
    height: 720,
    task: async (page) => {
      console.log("Recording master 3-minute continuous walkthrough...");

      // 0:00 - 0:30 Landing & Hook
      await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
      await addSubtitleBanner(
        page,
        "01",
        "RAGA PROTOCOL // TOKEN-BOUND AUTONOMOUS WORKERS",
        "Transforming static NFTs into sovereign AI workers on NEAR Protocol (Track: NFTs That Do Something)."
      );
      await page.waitForTimeout(3000);
      await smoothScroll(page, 450, 2000);
      await addSubtitleBanner(
        page,
        "01",
        "VERIFIED ON NEAR TESTNET // ZERO PRIVATE KEYS",
        "Parent contract raga-protocol-mw93m309.testnet is the sole authority over agent sub-accounts."
      );
      await page.waitForTimeout(4000);
      await smoothScroll(page, 1300, 2000);
      await addSubtitleBanner(
        page,
        "01",
        "4-STAGE LIFECYCLE: MINT, LEASE, FREEZE & YIELD",
        "Autonomous cashflow, time-locked SLAs, and transfer freeze protection."
      );
      await page.waitForTimeout(4000);

      // 0:30 - 1:00 App Workspace & Agents
      await page.goto(`${BASE_URL}/app`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      await addSubtitleBanner(
        page,
        "02",
        "FOUNDRY WORKSPACE // 4 TESTNET WORKERS",
        "Live on-chain agents querying NEAR Testnet RPC directly (raga-protocol-mw93m309.testnet)."
      );
      await page.waitForTimeout(3000);

      // Role switcher demo
      const roleSelect = await page.$("select");
      if (roleSelect) {
        await roleSelect.selectOption({ index: 0 }); // Tenant
        await page.waitForTimeout(1500);
        await roleSelect.selectOption({ index: 2 }); // Owner
        await page.waitForTimeout(1500);
      }
      await smoothScroll(page, 320, 1500);
      await page.waitForTimeout(3000);

      // 1:00 - 1:40 Rent & NEP-178 Transfer Freeze
      await addSubtitleBanner(
        page,
        "03",
        "NEP-178 TRANSFER FREEZE INVARIANT (ANTI-RUGPULL)",
        "Owner attempts to transfer token while active lease is running. Watch the contract panic!"
      );
      const transferBtns = await page.$$("button");
      for (const btn of transferBtns) {
        const text = await btn.textContent();
        if (text && text.includes("TRANSFER")) {
          await btn.click();
          break;
        }
      }
      await page.waitForTimeout(2500);
      const confirmTransfer = await page.$("button[type='submit'], .bg-alertCrimson");
      if (confirmTransfer) {
        await confirmTransfer.click();
      }
      await page.waitForTimeout(4500);

      // Close modal
      const closeBtns = await page.$$("button");
      for (const btn of closeBtns) {
        const text = await btn.textContent();
        if (text && (text.includes("CANCEL") || text.includes("CLOSE") || text === "✕")) {
          await btn.click();
          break;
        }
      }

      // 1:40 - 2:15 Dispatch & Proxy Call
      if (roleSelect) {
        await roleSelect.selectOption({ index: 0 }); // Back to Tenant
      }
      await page.goto(`${BASE_URL}/app?tab=dispatch`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      await addSubtitleBanner(
        page,
        "04",
        "DISPATCH CONSOLE // CROSS-CONTRACT PROXY EXECUTION",
        "Tenant dispatches execute_as_agent with gas and deposit parameters. Dynamic reputation increments."
      );
      await page.waitForTimeout(4500);

      // 2:15 - 2:45 Auditor Lab
      await page.goto(`${BASE_URL}/app?tab=auditor`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      await addSubtitleBanner(
        page,
        "05",
        "ZERO-TRUST AUDITOR // FORMAL STATE MATRIX",
        "Verifying sole parent authority, zero human private keys, and on-chain RPC telemetry."
      );
      await smoothScroll(page, 400, 2000);
      await page.waitForTimeout(4000);

      // 2:45 - 3:00 Fleet Vault & Closing
      await page.goto(`${BASE_URL}/app?tab=vault`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
      await addSubtitleBanner(
        page,
        "06",
        "FLEET VAULT // STREAMING YIELD WITHDRAWAL",
        "100% lease revenue withdrawable by token owner via claim_agent_revenue. Live at raganear.vercel.app!"
      );
      await page.waitForTimeout(4500);
    },
  });

  console.log("\n========================================================");
  console.log("   ALL VIDEO RECORDINGS COMPLETED SUCCESSFULLY!");
  console.log("   Files saved in: " + OUTPUT_DIR);
  console.log("========================================================\n");
}

main().catch(err => {
  console.error("FATAL RECORDING ERROR:", err);
  process.exit(1);
});
