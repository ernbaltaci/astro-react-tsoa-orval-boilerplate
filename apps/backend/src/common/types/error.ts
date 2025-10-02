/**
 * Validation error response format
 * @example {
 *  "message": "Validation failed",
 *  "code": "VALIDATION_FAILED",
 *  "details": {
 *    "email": {
 *      "message": "Email is already registered",
 *      "value": "user@example.com"
 *    }
 *  }
 * }
 * @tsoaModel
 */
export class ValidateErrorJSON {
  /** Error message */
  message!: string;

  code!: string;
  /** Detailed error information */
  details!: {
    [name: string]: {
      /** Field-specific error message */
      message: string;
      /** Invalid value that caused the error */
      value?: any;
    };
  };
}

