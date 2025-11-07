export interface AppointmentConfig {
  serviceType: string;
  requestChannel: string;
  licenseType: string;
  licenseNumber: string;
  licenseNumber2: string;
  phoneNumber: string;
  expiryDate: string;
  confirmationEmail: string;
  reminderEmail: string;
  officeCode: string;
  sessionIds: string[]; // Changed to array to support multiple sessions
  dayOfWeek: string;
  operation: string;
  transferOfOwnership: string;
  language: string;
  sendReminder: string;
  issuingCountry: string;
}

export interface NotificationConfig {
  availableMessage: string;
  notAvailableMessage: string;
  enableConsoleNotification: boolean;
  enableTelegramNotification?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
}

export interface AppConfig {
  appointment: AppointmentConfig;
  checker: {
    refreshIntervalMs: number;
    stopOnFound: boolean;
  };
  notifications: NotificationConfig;
}

export interface RequestOptions {
  method: string;
  url: string;
  qs: { cmd: string };
  headers: Record<string, string>;
  form: Record<string, string>;
}

export interface TimeslotResponse {
  [key: string]: unknown;
}

export interface ITimeslotChecker {
  start(): void;
  stop(): void;
  setRefreshInterval(intervalMs: number): void;
}

export interface ITimeslotService {
  checkAvailableTimeslots(): Promise<SessionResult[]>;
}

export interface SessionResult {
  sessionId: string;
  sessionName: string;
  responseBody: string;
  hasAvailableSlots: boolean;
}

export interface IAvailabilityChecker {
  hasAvailableTimeslots(responseBody: string): boolean;
}

export interface INotificationService {
  notifyAvailableSlots(results: SessionResult[], customMessage?: string): void;
}