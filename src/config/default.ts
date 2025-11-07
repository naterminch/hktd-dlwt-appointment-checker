import type { AppConfig } from "../types/index.js";

export const INTERVALS = {
	THIRTY_SECONDS: 30 * 1000,
	ONE_MINUTE: 60 * 1000,
	TWO_MINUTES: 2 * 60 * 1000,
	FIVE_MINUTES: 5 * 60 * 1000,
} as const;

// Default configuration - modify these values as needed
export const defaultConfig: AppConfig = {
  appointment: {
    serviceType: "DI",
    requestChannel: "W", 
    licenseType: "P",
    licenseNumber: "INPUT HERE",
    licenseNumber2: "INPUT HERE",
    phoneNumber: "N/A",
    expiryDate: "11-11-1901",
    confirmationEmail: "INPUT HERE",
    reminderEmail: "INPUT HERE",
    officeCode: "HKLO", // Hong Kong Licensing Office

    sessionIds: ["A", "P"], // Both morning and afternoon sessions
    dayOfWeek: "8", // Any day of week
    operation: "A", // Add operation
    transferOfOwnership: "N", // No transfer
    language: "tchinese", // Traditional Chinese
    sendReminder: "Y", // Send reminder
    issuingCountry: "OTH", // Other country
  },
  checker: {
    refreshIntervalMs: INTERVALS.ONE_MINUTE,
    stopOnFound: false, // Continue checking even after finding slots
  },
  notifications: {
    availableMessage: "🎉 TIMESLOT AVAILABLE - BOOK NOW!\n📅 Click here: https://abs1.td.gov.hk/tdab2/tdabs_external/AdminServlet?cmd=cmdWelcomeAction&lang=tchinese",
    notAvailableMessage: "No available timeslots found. Will check again in {interval} seconds.",
    enableConsoleNotification: true,
    enableTelegramNotification: false,
    telegramBotToken: undefined,
    telegramChatId: undefined,
  },
};

export const API_CONFIG = {
  BASE_URL: "https://abs1.td.gov.hk/tdab2/tdabs_external/AdminServlet_tchinese",
  COMMAND: "cmdGetTimeslotListBySearchAction",
  DEFAULT_HEADERS: {
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:144.0) Gecko/20100101 Firefox/144.0",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
    "accept-encoding": "gzip, deflate, br, zstd",
    "content-type": "application/x-www-form-urlencoded",
    origin: "https://abs1.td.gov.hk",
    "sec-gpc": "1",
    connection: "keep-alive",
    referer: "https://abs1.td.gov.hk/tdab2/tdabs_external/AdminServlet_tchinese?cmd=cmdSearchTimeslotAction",
    // cookie: "",
    "upgrade-insecure-requests": "1",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    priority: "u=0, i",
    pragma: "no-cache",
    "cache-control": "no-cache",
  },
} as const;