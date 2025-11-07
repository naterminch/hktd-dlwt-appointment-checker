import type { AppConfig } from "../types/index.js";
import { TimeslotService } from "../services/TimeslotService.js";
import { AvailabilityChecker } from "../services/AvailabilityChecker.js";
import { 
  ConsoleNotificationService, 
  TelegramBotService,
  CompositeNotificationService 
} from "../services/NotificationService.js";
import { TimeslotChecker, type TimeslotCheckerConfig } from "../services/TimeslotChecker.js";

export function createTimeslotChecker(config: AppConfig) {
  const timeslotService = new TimeslotService(config.appointment);
  const availabilityChecker = new AvailabilityChecker();
  
  // Create notification services based on configuration
  const notificationServices = [];
  
  // Console notifications
  if (config.notifications.enableConsoleNotification) {
    notificationServices.push(new ConsoleNotificationService({
      message: config.notifications.availableMessage,
      enabled: true,
    }));
  }
  
  // Telegram notifications via Bot API
  if (config.notifications.enableTelegramNotification && 
      config.notifications.telegramBotToken && 
      config.notifications.telegramChatId) {
    notificationServices.push(new TelegramBotService({
      botToken: config.notifications.telegramBotToken,
      chatId: config.notifications.telegramChatId,
      enabled: true,
    }));
  }
  
  // Use composite service to handle multiple notification types
  const notificationService = notificationServices.length > 1 
    ? new CompositeNotificationService(notificationServices)
    : notificationServices[0] || new ConsoleNotificationService({ enabled: true });
  
  const checkerConfig: TimeslotCheckerConfig = {
    refreshIntervalMs: config.checker.refreshIntervalMs,
    stopOnFound: config.checker.stopOnFound,
    availableMessage: config.notifications.availableMessage,
    notAvailableMessage: config.notifications.notAvailableMessage,
  };
  
  return new TimeslotChecker(
    timeslotService,
    availabilityChecker,
    notificationService,
    checkerConfig
  );
}