// Service to manage session notifications globally
class NotificationService {
  constructor() {
    this.checkedTimes = new Set();
    this.intervalId = null;
  }

  // Start monitoring for upcoming sessions
  startMonitoring(scheduleData, onNotification) {
    // Clear any existing interval
    this.stopMonitoring();

    // Check every 60 seconds for upcoming sessions
    this.intervalId = setInterval(() => {
      this.checkForUpcomingSessions(scheduleData, onNotification);
    }, 60000);

    // Also check immediately
    this.checkForUpcomingSessions(scheduleData, onNotification);
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Check for upcoming sessions and trigger notifications
  checkForUpcomingSessions(scheduleData, onNotification) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    scheduleData.times.forEach((time, index) => {
      if (!time) return;

      // Parse the time (format: HH:MM)
      const timeParts = time.split(':');
      if (timeParts.length !== 2) return;

      const scheduleHours = parseInt(timeParts[0], 10);
      const scheduleMinutes = parseInt(timeParts[1], 10);
      
      if (isNaN(scheduleHours) || isNaN(scheduleMinutes)) return;

      const scheduleTimeInMinutes = scheduleHours * 60 + scheduleMinutes;
      const diffMinutes = scheduleTimeInMinutes - currentMinutes;

      // Create unique keys for 10-minute and 5-minute warnings
      const key10 = `${time}-${index}-10`;
      const key5 = `${time}-${index}-5`;

      // Check for 10-minute warning
      if (diffMinutes <= 10 && diffMinutes >= 9 && !this.checkedTimes.has(key10)) {
        const notification = {
          id: `${Date.now()}-${index}-10`,
          type: '10min',
          message: `⚠️ Attenzione: Mancano 10 minuti alla sessione "${scheduleData.sessions[index] || 'Senza nome'}" alle ore ${time}`,
          title: 'Avviso Sessione - 10 minuti',
          body: `Mancano 10 minuti alla sessione "${scheduleData.sessions[index] || 'Senza nome'}" alle ore ${time}`,
          time: time,
          session: scheduleData.sessions[index]
        };
        this.checkedTimes.add(key10);
        onNotification(notification);
      }

      // Check for 5-minute warning
      if (diffMinutes <= 5 && diffMinutes >= 4 && !this.checkedTimes.has(key5)) {
        const notification = {
          id: `${Date.now()}-${index}-5`,
          type: '5min',
          message: `⚠️ AVVISO URGENTE: Mancano 5 minuti alla sessione "${scheduleData.sessions[index] || 'Senza nome'}" alle ore ${time}`,
          title: 'AVVISO URGENTE - 5 minuti',
          body: `Mancano 5 minuti alla sessione "${scheduleData.sessions[index] || 'Senza nome'}" alle ore ${time}`,
          time: time,
          session: scheduleData.sessions[index]
        };
        this.checkedTimes.add(key5);
        onNotification(notification);
      }
    });
  }

  // Reset checked times for a specific time slot
  resetTimeSlot(time, index) {
    this.checkedTimes.delete(`${time}-${index}-10`);
    this.checkedTimes.delete(`${time}-${index}-5`);
  }

  // Clear all checked times
  clearCheckedTimes() {
    this.checkedTimes.clear();
  }
}

const notificationServiceInstance = new NotificationService();
export default notificationServiceInstance;
