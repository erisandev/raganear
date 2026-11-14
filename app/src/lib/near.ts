/**
 * RAGA PROTOCOL BACKWARD-COMPATIBILITY FACADE
 * 
 * Re-exports all domain models, configurations, utilities, infrastructure
 * repositories, and application services from their respective clean architecture layers.
 */

export * from "@/domain/models/agent.model";
export * from "@/domain/models/task.model";
export * from "@/domain/models/rental.model";
export * from "@/domain/errors/raga.errors";
export * from "@/config/near.config";
export * from "@/config/testnet-accounts";
export * from "@/utils/units";
export * from "@/utils/formatters";
export * from "@/infrastructure/rpc/near-provider";
export * from "@/infrastructure/rpc/near-signer";
export * from "@/infrastructure/repositories/agent-query.repo";
export * from "@/infrastructure/repositories/agent-tx.repo";
export * from "@/application/services/rental.service";
export * from "@/application/services/revenue.service";
