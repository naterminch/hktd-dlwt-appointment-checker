import { createTimeslotChecker } from "./src/factories/ServiceFactory.js";
import { ProcessManager } from "./src/utils/ProcessManager.js";
import { userConfig } from "./user-config.js";


function printConfig(config: typeof userConfig) {
  console.log('='.repeat(60));
  console.log('🚀 HK Government Timeslot Checker - Configuration');
  console.log('='.repeat(60));
  
  console.log('\n📋 Appointment Details:');
  console.log(`  Service Type: ${config.appointment.serviceType}`);
  console.log(`  License Type: ${config.appointment.licenseType}`);
  console.log(`  Office Code: ${config.appointment.officeCode}`);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  console.log(`  Target Date: ${currentYear}-${currentMonth.toString().padStart(2, '0')} (Auto-detected)`);
  console.log(`  Sessions: ${config.appointment.sessionIds.map(id => id === 'A' ? 'Morning' : 'Afternoon').join(', ')}`);
  console.log(`  Language: ${config.appointment.language}`);
  console.log(`  Send Reminder: ${config.appointment.sendReminder === 'Y' ? 'Yes' : 'No'}`);
  
  console.log('\n⚙️  Checker Settings:');
  console.log(`  Check Interval: ${config.checker.refreshIntervalMs / 1000}s`);
  console.log(`  Stop on Found: ${config.checker.stopOnFound ? 'Yes' : 'No'}`);
  
  console.log('\n🔔 Notification Settings:');
  console.log(`  Console Notifications: ${config.notifications.enableConsoleNotification ? 'Enabled' : 'Disabled'}`);
  console.log(`  Telegram Notifications: ${config.notifications.enableTelegramNotification ? 'Enabled' : 'Disabled'}`);
  if (config.notifications.enableTelegramNotification) {
    console.log(`  Telegram Bot Token: ${config.notifications.telegramBotToken ? 'Configured' : 'Not configured'}`);
    console.log(`  Telegram Chat ID: ${config.notifications.telegramChatId ? 'Configured' : 'Not configured'}`);
  }
  console.log(`  Available Message: "${config.notifications.availableMessage}"`);
  
  console.log('\n📧 Contact Information:');
  console.log(`  Confirmation Email: ${config.appointment.confirmationEmail}`);
  console.log(`  Reminder Email: ${config.appointment.reminderEmail}`);
  
  console.log('\n🌐 Booking Website:');
  console.log('  https://abs1.td.gov.hk/tdab2/tdabs_external/AdminServlet?cmd=cmdWelcomeAction&lang=tchinese');
  console.log('  👆 Go to this URL when slots are available to make your booking!');
  
  console.log('\n' + '='.repeat(60));
  console.log('Starting checker...\n');
}

async function sendStartupTestNotification(config: typeof userConfig) {
  if (config.notifications.enableTelegramNotification && 
      config.notifications.telegramBotToken && 
      config.notifications.telegramChatId) {
    console.log('📱 Sending test notification to Telegram...');
    
    const sessions = config.appointment.sessionIds.map(id => id === 'A' ? 'Morning' : 'Afternoon').join(' & ');
    const interval = config.checker.refreshIntervalMs / 1000;
    
    const testMessage = `🚀 Timeslot Checker Started!

Monitoring ${sessions} sessions every ${interval} seconds.

You'll receive notifications here when timeslots become available.

Time: ${new Date().toLocaleString()}`;

    try {
      const telegramApiUrl = `https://api.telegram.org/bot${config.notifications.telegramBotToken}/sendMessage`;
      
      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: config.notifications.telegramChatId,
          text: testMessage,
          parse_mode: 'HTML'
        })
      });
      
      if (response.ok) {
        console.log("✅ Test notification sent to Telegram successfully");
      } else {
        const errorData = await response.json();
        console.error("❌ Test notification failed:", response.status, errorData);
      }
    } catch (error) {
      console.error("❌ Failed to send test notification:", error);
    }
  }
}

async function main() {
  printConfig(userConfig);
  
  // Send test notification to verify Telegram integration
  await sendStartupTestNotification(userConfig);
  
  // Create the timeslot checker using dependency injection
  const checker = createTimeslotChecker(userConfig);
  
  // Set up process management with graceful shutdown
  const processManager = new ProcessManager(checker);
  
  // Start the application
  await processManager.start();
}

// Run the application
if (import.meta.main) {
  main().catch(console.error);
}