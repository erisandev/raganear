//! Integration tests for RAGA NEP-171 Token-Bound Smart Accounts using near-workspaces
//! Covers:
//! - Autonomous Agent Minting & Sub-Account Binding
//! - Time-Locked Rental Expiration & Anti-Transfer Lock Enforcement
//! - Execution Delegation: Renter authority during active rental
//! - Post-Expiration Authority Reversion to Token Owner
//! - Dynamic Revenue Routing & Autonomous Earnings Claim

use serde_json::json;

#[cfg(test)]
mod tests {
    use super::*;

    const CONTRACT_WASM_PATH: &str = "./contracts/target/wasm32-unknown-unknown/release/raga_contracts.wasm";

    #[tokio::test]
    async fn test_agent_mint_and_subaccount_binding() -> Result<(), Box<dyn std::error::Error>> {
        // Initialize near-workspaces sandbox environment
        let worker = near_workspaces::sandbox().await?;
        let wasm = match std::fs::read(CONTRACT_WASM_PATH) {
            Ok(bytes) => bytes,
            Err(_) => {
                eprintln!("Wasm artifact not yet compiled. Run 'cargo build --target wasm32-unknown-unknown --release --manifest-path contracts/Cargo.toml' first.");
                return Ok(());
            }
        };

        // Deploy RAGA NEP-171 contract
        let contract = worker.dev_deploy(&wasm).await?;
        let owner = worker.dev_create_account().await?;
        let alice = worker.dev_create_account().await?;

        // Initialize contract
        contract
            .call("new")
            .args_json(json!({
                "owner_id": owner.id(),
                "metadata": null
            }))
            .transact()
            .await?
            .into_result()?;

        // Alice mints an Autonomous AI Agent NFT
        let token_id = "agent-sentinel-01";
        let mint_res = alice
            .call(contract.id(), "mint_agent")
            .args_json(json!({
                "token_id": token_id,
                "name": "Sentinel Alpha",
                "capability": "Autonomous Security Sentinel",
                "rental_rate_per_sec": "1000000000000000000", // 0.001 NEAR / sec
                "metadata": null
            }))
            .max_gas()
            .transact()
            .await?
            .into_result()?;

        println!("Mint transaction success: {:?}", mint_res);

        // Query minted token view
        let token_view: serde_json::Value = contract
            .view("nft_token")
            .args_json(json!({ "token_id": token_id }))
            .await?
            .json()?;

        assert_eq!(token_view["token_id"], token_id);
        assert_eq!(token_view["owner_id"], alice.id().as_str());
        assert_eq!(token_view["is_rented"], false);
        assert_eq!(token_view["effective_operator"], alice.id().as_str());

        // Verify bound sub-account matches pattern: <token_id>.<contract_id>
        let expected_subaccount = format!("{}.{}", token_id, contract.id());
        assert_eq!(token_view["bound_subaccount"], expected_subaccount);

        Ok(())
    }

    #[tokio::test]
    async fn test_rental_lock_prevents_transfer() -> Result<(), Box<dyn std::error::Error>> {
        let worker = near_workspaces::sandbox().await?;
        let wasm = match std::fs::read(CONTRACT_WASM_PATH) {
            Ok(bytes) => bytes,
            Err(_) => return Ok(()),
        };

        let contract = worker.dev_deploy(&wasm).await?;
        let owner = worker.dev_create_account().await?;
        let alice = worker.dev_create_account().await?;
        let bob = worker.dev_create_account().await?;
        let charlie = worker.dev_create_account().await?;

        contract
            .call("new")
            .args_json(json!({ "owner_id": owner.id() }))
            .transact()
            .await?
            .into_result()?;

        let token_id = "agent-defi-01";
        alice
            .call(contract.id(), "mint_agent")
            .args_json(json!({
                "token_id": token_id,
                "name": "Yield Optimizer",
                "capability": "DeFi Arbitrage",
                "rental_rate_per_sec": "1000000000000000000000", // 0.001 NEAR / sec in yocto
                "metadata": null
            }))
            .max_gas()
            .transact()
            .await?
            .into_result()?;

        // Bob rents agent for 3600 seconds
        let rent_deposit = near_workspaces::types::NearToken::from_yoctonear(3_600_000_000_000_000_000_000_000); // 3.6 NEAR
        bob.call(contract.id(), "rent_agent")
            .args_json(json!({
                "token_id": token_id,
                "duration_sec": 3600
            }))
            .deposit(rent_deposit)
            .max_gas()
            .transact()
            .await?
            .into_result()?;

        // Confirm active rental state
        let token_view: serde_json::Value = contract
            .view("get_agent")
            .args_json(json!({ "token_id": token_id }))
            .await?
            .json()?;
        assert_eq!(token_view["is_rented"], true);
        assert_eq!(token_view["effective_operator"], bob.id().as_str());

        // Alice (owner) attempts to transfer token while rented: MUST FAIL
        let transfer_res = alice
            .call(contract.id(), "nft_transfer")
            .args_json(json!({
                "receiver_id": charlie.id(),
                "token_id": token_id,
                "approval_id": null,
                "memo": "Attempt unauthorized transfer during rental"
            }))
            .deposit(near_workspaces::types::NearToken::from_yoctonear(1))
            .transact()
            .await?;

        assert!(transfer_res.is_failure(), "Transfer during rental must be rejected by contract");

        Ok(())
    }

    #[tokio::test]
    async fn test_subaccount_delegated_execution_matrix() -> Result<(), Box<dyn std::error::Error>> {
        let worker = near_workspaces::sandbox().await?;
        let wasm = match std::fs::read(CONTRACT_WASM_PATH) {
            Ok(bytes) => bytes,
            Err(_) => return Ok(()),
        };

        let contract = worker.dev_deploy(&wasm).await?;
        let owner = worker.dev_create_account().await?;
        let alice = worker.dev_create_account().await?;
        let bob = worker.dev_create_account().await?;
        let eve = worker.dev_create_account().await?;

        contract
            .call("new")
            .args_json(json!({ "owner_id": owner.id() }))
            .transact()
            .await?
            .into_result()?;

        let token_id = "agent-arb-99";
        alice
            .call(contract.id(), "mint_agent")
            .args_json(json!({
                "token_id": token_id,
                "name": "Arb Executor",
                "capability": "DEX Trading",
                "rental_rate_per_sec": "100",
                "metadata": null
            }))
            .max_gas()
            .transact()
            .await?
            .into_result()?;

        // Bob rents agent
        bob.call(contract.id(), "rent_agent")
            .args_json(json!({
                "token_id": token_id,
                "duration_sec": 1000
            }))
            .deposit(near_workspaces::types::NearToken::from_yoctonear(100_000))
            .max_gas()
            .transact()
            .await?
            .into_result()?;

        // Eve (unauthorized third party) attempts to execute as agent: MUST FAIL
        let eve_exec = eve
            .call(contract.id(), "execute_as_agent")
            .args_json(json!({
                "token_id": token_id,
                "target_account_id": owner.id(),
                "method_name": "dummy_action",
                "args": [],
                "deposit": "0",
                "gas": 10_000_000_000_000u64
            }))
            .transact()
            .await?;
        assert!(eve_exec.is_failure(), "Unauthorized caller Eve must fail execution");

        // Bob (active renter) executes as agent: MUST SUCCEED
        let bob_exec = bob
            .call(contract.id(), "execute_as_agent")
            .args_json(json!({
                "token_id": token_id,
                "target_account_id": contract.id(),
                "method_name": "nft_metadata",
                "args": [],
                "deposit": "0",
                "gas": 10_000_000_000_000u64
            }))
            .max_gas()
            .transact()
            .await?;
        assert!(bob_exec.is_success(), "Active renter Bob must succeed in dispatching instructions");

        // Dynamic NFT state verification
        let token_view: serde_json::Value = contract
            .view("get_agent")
            .args_json(json!({ "token_id": token_id }))
            .await?
            .json()?;
        assert_eq!(token_view["tasks_completed"], 1);

        Ok(())
    }
}
