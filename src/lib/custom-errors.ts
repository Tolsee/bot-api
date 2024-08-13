export class ApiError extends Error {
  public response: unknown;

  constructor(message: string, response: unknown) {
    super(message);
    this.response = response;
  }
}

export class SensandApiError extends ApiError {}
export class SensandApiServerError extends SensandApiError {}

export class EosApiError extends ApiError {}
export class EosRateLimitError extends EosApiError {}
