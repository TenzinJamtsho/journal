const ADMIN_EMAILS = new Set(["tnznjamtsho@gmail.com"]);

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.has(email.toLowerCase());
}
