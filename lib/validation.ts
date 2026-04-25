export function normalizeCode(code: string): string {
  return code.replace(/\D/g, "").slice(0, 6);
}

export function sanitizeNickname(input: string): string {
  return input
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 30);
}

export function isValidNickname(nickname: string): boolean {
  return nickname.length > 0 && nickname.length <= 30;
}

export function normalizeJoinPassword(input: string | undefined): string | undefined {
  const value = input?.trim();
  return value ? value.slice(0, 40) : undefined;
}
