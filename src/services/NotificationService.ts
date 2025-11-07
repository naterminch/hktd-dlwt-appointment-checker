import type { INotificationService, SessionResult } from "../types/index.js";

export class ConsoleNotificationService implements INotificationService {
  constructor(private config?: { message?: string; enabled?: boolean }) {}

  notifyAvailableSlots(results: SessionResult[], customMessage?: string): void {
    if (this.config?.enabled === false) return;
    
    const availableResults = results.filter(r => r.hasAvailableSlots);
    if (availableResults.length === 0) return;
    
    const message = customMessage || this.config?.message || "🎉 TIMESLOT AVAILABLE - CHECK THE WEBSITE NOW!";
    
    console.log("=".repeat(50));
    console.log(message);
    
    availableResults.forEach(result => {
      console.log(`📅 ${result.sessionName} session has available slots!`);
    });
    
    console.log("=".repeat(50));
  }
}

export class TelegramBotService implements INotificationService {
  constructor(private config: { 
    botToken: string;
    chatId: string;
    enabled?: boolean;
  }) {}

  async notifyAvailableSlots(results: SessionResult[], customMessage?: string): Promise<void> {
    if (this.config?.enabled === false) return;
    
    const availableResults = results.filter(r => r.hasAvailableSlots);
    if (availableResults.length === 0) return;
    
    const sessions = availableResults.map(r => r.sessionName).join(', ');
    const message = customMessage || `🎉 Timeslot Available!

Available in ${sessions} session(s).

📅 Book now: https://abs1.td.gov.hk/tdab2/tdabs_external/AdminServlet?cmd=cmdWelcomeAction&lang=tchinese

⚠️ Act fast - these slots fill up quickly!

Time: ${new Date().toLocaleString()}`;
    
    try {
      const telegramApiUrl = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;
      
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.config.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      if (response.ok) {
        console.log("✅ Telegram notification sent successfully");
      } else {
        const errorData = await response.json();
        console.error("❌ Telegram notification failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("❌ Failed to send Telegram notification:", error);
    }
  }
}

// Composite pattern for multiple notifications
export class CompositeNotificationService implements INotificationService {
  constructor(private services: INotificationService[]) {}

  notifyAvailableSlots(results: SessionResult[], customMessage?: string): void {
    this.services.forEach(service => service.notifyAvailableSlots(results, customMessage));
  }
}