export function generateMasterDataCode(prefix: string, sequence: number): string {
  return `${prefix}-${sequence.toString().padStart(5, '0')}`;
}

export function extractMasterDataSequence(
  code: string | undefined,
  prefix: string,
): number {
  if (!code) {
    return 0;
  }

  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const match = code.match(pattern);

  if (!match) {
    return 0;
  }

  return Number.parseInt(match[1], 10);
}
