export class CustomException extends Error {
  code: string;
  statusCode: number;
  constructor(statusCode: number, code: string, errorMessage: string) {
    super(errorMessage);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class MissingEntity extends CustomException {
  constructor() {
    super(404, "MISSING_ENTITY", "Missing Entity");
  }
}

export class PageNotFound extends CustomException {
  constructor() {
    super(404, "PAGE_NOT_FOUND", "Page not found! Entity");
  }
}

export class InvalidFormat extends CustomException {
  constructor(message: string | undefined) {
    super(400, "PAGE_NOT_FOUND", message ?? "Invalid format!");
  }
}

export class DuplicatedOperation extends CustomException {
  constructor() {
    super(202, "DUPLICATED_OPERATION", "This operation was duplicated!");
  }
}

export class DeniedOperation extends CustomException {
  constructor(message: string | null) {
    super(400, "DENIED_OPERATION", message ?? "This operation was duplicated!");
  }
}
