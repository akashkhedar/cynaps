/**
 * Returns the base URL for documentation depending on deployment type.
 * - Enterprise: https://docs.Cynaps.com/
 * - Open Source: https://cynaps.io/
 */
export function getDocsBaseUrl(): string {
  if (typeof window !== "undefined" && window.APP_SETTINGS?.billing?.enterprise) {
    return "https://docs.Cynaps.com/";
  }
  return "https://cynaps.io/";
}

/**
 * Returns a full documentation URL for the current deployment type.
 *
 * Usage:
 *   getDocsUrl('guide/labeling') // same path for both domains
 *   getDocsUrl('guide/labeling', 'guide/label-guide') // first param for cynaps.io, second for docs.Cynaps.com
 *
 * @param pathOSS - Path for cynaps.io (and default for both if only one param)
 * @param pathEnterprise - Optional path for docs.Cynaps.com
 * @returns {string} Full documentation URL
 */
export function getDocsUrl(pathOSS: string, pathEnterprise?: string): string {
  const base = getDocsBaseUrl();
  const isEnterprise = typeof window !== "undefined" && window.APP_SETTINGS?.billing?.enterprise;
  const path = isEnterprise && pathEnterprise ? pathEnterprise : pathOSS;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

