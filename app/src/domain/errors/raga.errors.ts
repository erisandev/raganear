export class RagaDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RagaDomainError";
  }
}

export class RentalExpiredError extends RagaDomainError {
  constructor(tokenId: string) {
    super(`Rental lease has expired for agent: ${tokenId}`);
    this.name = "RentalExpiredError";
  }
}

export class TransferLockedError extends RagaDomainError {
  constructor(tokenId: string, renterId: string, expiresAt: number) {
    super(
      `Transfer forbidden: token ${tokenId} is locked under active rental to ${renterId} until timestamp ${expiresAt} ns`
    );
    this.name = "TransferLockedError";
  }
}

export class UnauthorizedOperatorError extends RagaDomainError {
  constructor(callerId: string, authorizedOperator: string) {
    super(
      `Unauthorized call by ${callerId}: caller must be authorized operator ${authorizedOperator}`
    );
    this.name = "UnauthorizedOperatorError";
  }
}

export class InvalidDurationError extends RagaDomainError {
  constructor(hours: number) {
    super(`Invalid rental duration: ${hours} hours. Duration must be at least 1 hour.`);
    this.name = "InvalidDurationError";
  }
}
