import type { 
  ITimeslotChecker, 
  ITimeslotService, 
  IAvailabilityChecker, 
  INotificationService 
} from "../types/index.js";

export interface TimeslotCheckerConfig {
  refreshIntervalMs: number;
  stopOnFound: boolean;
  availableMessage: string;
  notAvailableMessage: string;
}

export class TimeslotChecker implements ITimeslotChecker {
  private intervalId: NodeJS.Timeout | null = null;
  private refreshInterval: number;
  private config: TimeslotCheckerConfig;

  constructor(
    private timeslotService: ITimeslotService,
    private availabilityChecker: IAvailabilityChecker,
    private notificationService: INotificationService,
    config: TimeslotCheckerConfig
  ) {
    this.refreshInterval = config.refreshIntervalMs;
    this.config = config;
  }

  async start(): Promise<void> {
    console.log(`Starting timeslot checker with ${this.refreshInterval / 1000}s interval...`);
    
    // Check immediately
    await this.performCheck();
    
    // Set up interval for periodic checks
    this.intervalId = setInterval(async () => {
      await this.performCheck();
    }, this.refreshInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("Timeslot checker stopped.");
    }
  }

  setRefreshInterval(intervalMs: number): void {
    this.refreshInterval = intervalMs;
    this.config.refreshIntervalMs = intervalMs;
    if (this.intervalId) {
      this.stop();
      this.start();
    }
  }

  private async performCheck(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Checking for available timeslots...`);
      
      const results = await this.timeslotService.checkAvailableTimeslots();
      const availableResults = results.filter(r => r.hasAvailableSlots);
      
      if (availableResults.length > 0) {
        console.log("🎉 AVAILABLE TIMESLOTS FOUND!");
        
        // Log which sessions have availability
        availableResults.forEach(result => {
          console.log(`✅ ${result.sessionName} session: Available!`);
        });
        
        // Log which sessions don't have availability
        const unavailableResults = results.filter(r => !r.hasAvailableSlots);
        unavailableResults.forEach(result => {
          console.log(`❌ ${result.sessionName} session: No slots`);
        });
        
        this.notificationService.notifyAvailableSlots(results, this.config.availableMessage);
        
        // Optionally stop checking once found
        if (this.config.stopOnFound) {
          this.stop();
        }
      } else {
        // Show status for all sessions
        results.forEach(result => {
          console.log(`❌ ${result.sessionName} session: No slots`);
        });
        
        const message = this.config.notAvailableMessage.replace(
          '{interval}', 
          (this.refreshInterval / 1000).toString()
        );
        console.log(message);
      }
      
    } catch (error) {
      console.error("Error checking timeslots:", error);
    }
  }
}