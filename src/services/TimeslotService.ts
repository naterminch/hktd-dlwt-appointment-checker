import type { AppointmentConfig, ITimeslotService, RequestOptions, SessionResult } from "../types/index.js";
import { API_CONFIG } from "../config/default.js";
import { AvailabilityChecker } from "./AvailabilityChecker.js";

export class TimeslotService implements ITimeslotService {
  private availabilityChecker = new AvailabilityChecker();

  constructor(private config: AppointmentConfig) {}

  async checkAvailableTimeslots(): Promise<SessionResult[]> {
    // Create promises for all sessions
    const sessionPromises = this.config.sessionIds.map(sessionId => 
      this.checkSingleSession(sessionId)
    );

    // Execute all requests in parallel
    const results = await Promise.allSettled(sessionPromises);
    
    // Process results and handle any failures
    return results.map((result, index) => {
      const sessionId = this.config.sessionIds[index];
      const sessionName = this.getSessionName(sessionId);
      
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        console.error(`Error checking ${sessionName} session:`, result.reason);
        return {
          sessionId,
          sessionName,
          responseBody: '',
          hasAvailableSlots: false,
        };
      }
    });
  }

  private async checkSingleSession(sessionId: string): Promise<SessionResult> {
    const options = this.buildRequestOptions(sessionId);
    
    const response = await fetch(`${options.url}?${new URLSearchParams(options.qs)}`, {
      method: options.method,
      headers: options.headers,
      body: new URLSearchParams(options.form),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseBody = await response.text();
    const hasAvailableSlots = this.availabilityChecker.hasAvailableTimeslots(responseBody);
    
    return {
      sessionId,
      sessionName: this.getSessionName(sessionId),
      responseBody,
      hasAvailableSlots,
    };
  }

  private getSessionName(sessionId: string): string {
    switch (sessionId) {
      case 'A': return 'Morning';
      case 'P': return 'Afternoon';
      default: return `Session ${sessionId}`;
    }
  }

  private buildRequestOptions(sessionId: string): RequestOptions {
    return {
      method: "POST",
      url: API_CONFIG.BASE_URL,
      qs: { cmd: API_CONFIG.COMMAND },
      headers: API_CONFIG.DEFAULT_HEADERS,
      form: this.buildFormData(sessionId),
    };
  }

  private buildFormData(sessionId: string): Record<string, string> {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString(); // getMonth() returns 0-11, so add 1
    
    return {
      storedAppointmentId: "",
      storedAppointmentServiceType: this.config.serviceType,
      storedAppointmentRequestChannel: this.config.requestChannel,
      storedAppointmentLicenseType: this.config.licenseType,
      storedAppointmentLicenseNumber: this.config.licenseNumber,
      storedAppointmentLicenseNumber2: this.config.licenseNumber2,
      storedAppointmentPhoneNumber: this.config.phoneNumber,
      storedAppointmentExpiryDate: this.config.expiryDate,
      storedAppointmentCertExpiryDate: "",
      storedAppointmentRegMarkNumber2: "",
      storedAppointmentRegMarkNumber: "",
      storedAppointmentShortRegMarkNumber: "",
      storedAppointmentTimeslotId: "",
      sendReminder: this.config.sendReminder,
      storedAppointmentConfirmationFaxNumber: "",
      storedAppointmentConfirmationPhoneNumber: "",
      storedAppointmentConfirmationEmail: this.config.confirmationEmail,
      storedAppointmentReminderFaxNumber: "",
      storedAppointmentReminderPhoneNumber: "",
      storedAppointmentReminderEmail: this.config.reminderEmail,
      storedAppointmentTimeslotDate: "",
      storedAppointmentTimeslotFromTime: "",
      storedAppointmentTimeslotToTime: "",
      storedAppointmentOfficeCode: this.config.officeCode,
      storedAppointmentCalendarYear: currentYear,
      storedAppointmentCalendarMonth: currentMonth,
      storedAppointmentSessionId: sessionId,
      storedAppointmentDayOfWeek: this.config.dayOfWeek,
      storedAppointmentOperation: this.config.operation,
      transferOfOwnership: this.config.transferOfOwnership,
      lang: this.config.language,
      timestamp: Date.now().toString(),
      storedAppointmentTimestamp: "",
      inputtedPhoneNoBefore: "",
      storedAppointmentReferenceNo: "",
      inputType: "N",
      fromIAMSmart: "",
      storedAppointmentDLNewIssue: "N",
      storedAppointmentLicenseOwnerName: "",
      storedAppointmentIssuingCountry: this.config.issuingCountry,
      storedAppointmentIssuingAuthority: "",
      storedAppointmentIAMSmartHelperJwt: "",
    };
  }
}