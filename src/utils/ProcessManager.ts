import type { ITimeslotChecker } from "../types/index.js";

export class ProcessManager {
  constructor(private checker: ITimeslotChecker) {
    this.setupGracefulShutdown();
  }

  private setupGracefulShutdown(): void {
    const shutdown = (signal: string) => {
      console.log(`\nReceived ${signal}. Stopping timeslot checker...`);
      this.checker.stop();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  async start(): Promise<void> {
    await this.checker.start();
  }
}