# DESIGN SPECIFICATION: RAGA TECHNICAL IDENTITY INSTRUMENT

## 1. Design Philosophy
RAGA is designed as a **mission-critical technical identity instrument** rather than a casual consumer marketplace. The interface reflects the precision, authority, and cryptographic rigor of autonomous smart account controllers operating on NEAR Protocol.

Every element communicates deterministic execution, sub-account authority, and cryptographically enforced time-locks.

---

## 2. Color Palette & Surface Tokens

| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| **Ground** | `#090d12` | Deep obsidian background with subtle technical hairline grid (`tech-grid`). |
| **Plate** | `#141a22` | Primary surface plates for cards, headers, telemetry monitors, and modal dialogs. |
| **Plate Light** | `#1a222d` | Elevated actionable surfaces, hover states, secondary controls. |
| **Plate Border**| `#222c38` | Structural hairlines and matrix bounding borders. |
| **Cyan Accent** | `#00ec97` | Primary execution signals, verified status, active sub-account authorities. |
| **Amber Alert** | `#ffb020` | Time-locked rental status, active SLA warnings, unclaimed yield figures. |
| **Crimson Alert**| `#ff3366` | Transfer block warnings, unauthorized access prevention indicators. |
| **Muted Text**  | `#7e8b9b` | Monospace metadata labels, block timestamps, parameter descriptions. |

---

## 3. Typography & Financial Instruments

1. **Big Shoulders Display (`font-display`)**:
   - **Mandatory Usage**: All revenue figures, lifetime yield counters, and claimable yields.
   - **Styling**: `font-black text-4xl lg:text-5xl tracking-tight text-[#00ec97]`.
   - **Rationale**: Condensed, industrial, bold high-impact numbers that emphasize real financial productivity of autonomous workers.

2. **JetBrains Mono (`font-mono`)**:
   - **Usage**: Token IDs (`agent-sentinel-01`), sub-account identifiers (`<token_id>.<contract_id>`), cryptographic SHA-256 proof hashes, timestamps, and contract function names.
   - **Styling**: Sharp, high-contrast monospace rendering.

3. **Inter (`font-sans`)**:
   - **Usage**: Explanatory body text, modal instructions, capability descriptions.

---

## 4. 0-Radius Card Geometry (`rounded-none`)
- **Zero Border Radius**: Absolutely no rounded borders (`rounded-none` applied across all cards, modals, buttons, badges, and input elements).
- **Hairline Telemetry Grid**: 1px borders using `#222c38` separating telemetry sections.
- **Pulsating Status Signals**: Real-time signal indicators for `RENTED // TIME-LOCKED` (Amber pulse) and `AUTONOMOUS ACTIVE` (Cyan glow).

---

## 5. Token-Bound Sub-Account UX States

### A. Idle State (Unrented / Ready)
- Status: `IDLE // READY`
- Effective Operator: Token Owner (`owner_id`)
- Action Available: `RENT AGENT`, `TRANSFER`, `EXECUTE WORK`

### B. Active Time-Locked Rental State
- Status: `RENTED // TIME-LOCKED` (pulsating amber indicator)
- Effective Operator: Active Renter (`renter_id`)
- Rental Expiration: Real-time second-by-second countdown clock ticking down to block timestamp expiration.
- Transfer Button: **Locked & Disabled** with tooltip: *"Cannot transfer or burn token while rental is active under NEP-171 SLA."*
- Execution Authority: Exclusively granted to the renter.

### C. Revenue Claiming & Financial Routing
- Revenue is routed in real time when tasks are verified or rental deposits are paid.
- Big Shoulders Display emphasizes accumulated yield.
- Unclaimed yield is highlighted with a 1-click claim button available to the token owner.
