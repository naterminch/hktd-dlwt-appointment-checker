import { INTERVALS } from "./src/config/default.js";
import type { AppConfig } from "./src/types/index.js";

export const userConfig: AppConfig = {
	appointment: {
		serviceType: "DI", // Service type (e.g., "DI" for driving license)
		requestChannel: "W", // Request channel
		licenseType: "P", // License type
		licenseNumber: "INPUT HERE", // Your encrypted license number
		licenseNumber2: "INPUT HERE", // Your second encrypted license number
		phoneNumber: "N/A", // Phone number
		expiryDate: "11-11-1901", // Expiry date
		confirmationEmail: "INPUT HERE", // Email for confirmations
		reminderEmail: "INPUT HERE", // Email for reminders
		officeCode: "HKLO", // Office code (HKLO = Hong Kong Licensing Office)

		sessionIds: ["A", "P"], // Sessions to check (A = Morning, P = Afternoon)
		// Use ["A"] for morning only, ["P"] for afternoon only, or ["A", "P"] for both
		dayOfWeek: "8", // Day of week preference (8 = Any day)
		operation: "A", // Operation type
		transferOfOwnership: "N", // Transfer of ownership (Y/N)
		language: "tchinese", // Language preference
		sendReminder: "Y", // Send reminder (Y/N)
		issuingCountry: "OTH", // Issuing country
	},

	// Checker behavior settings
	checker: {
		refreshIntervalMs: INTERVALS.TWO_MINUTES,
		stopOnFound: false, // Stop checking once timeslots are found (true/false)
	},

	// Notification settings
	notifications: {
		// Message shown when timeslots are available
		availableMessage:
			"🎉 TIMESLOT AVAILABLE - BOOK NOW!\n📅 Click here: https://abs1.td.gov.hk/tdab2/tdabs_external/AdminServlet?cmd=cmdWelcomeAction&lang=tchinese",

		// Message shown when no timeslots are found (use {interval} for seconds)
		notAvailableMessage:
			"No available timeslots found. Will check again in {interval} seconds.",

		// Enable/disable console notifications
		enableConsoleNotification: true,

		// Enable/disable Telegram notifications via Bot API
		enableTelegramNotification: true,

		// Telegram Bot Token (get from @BotFather)
		telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,

		// Telegram Chat ID (your user ID or group chat ID)
		telegramChatId: process.env.TELEGRAM_CHAT_ID,
	},
};
