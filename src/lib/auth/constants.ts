export const AUTH_COOKIE_NAME = "trade_journal_session";
export const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export const AUTH_ROUTES = ["/login", "/register"] as const;
export const PROTECTED_PREFIXES = ["/dashboard"] as const;
