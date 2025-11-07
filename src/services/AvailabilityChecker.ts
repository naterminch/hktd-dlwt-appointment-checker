import type { IAvailabilityChecker } from "../types/index.js";

export class AvailabilityChecker implements IAvailabilityChecker {
  private readonly NO_AVAILABLE_SLOTS_TEXT = "沒有可預約的時間";
  private readonly SYSTEM_BUSY_TEXT = "系統繁忙";

  hasAvailableTimeslots(responseBody: string): boolean {
    // console.log(responseBody)
    // If the response contains "沒有可預約的時間", it means no available timeslots
    if (responseBody.includes(this.NO_AVAILABLE_SLOTS_TEXT)) {
      return false;
    }
    
    // If the response contains "系統繁忙", it also means no available timeslots
    if (responseBody.includes(this.SYSTEM_BUSY_TEXT)) {
      return false;
    }
    
    // If we don't see the "no available" or "system busy" messages, assume there are timeslots
    return true;
  }
}