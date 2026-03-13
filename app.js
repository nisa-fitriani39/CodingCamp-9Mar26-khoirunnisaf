// Productivity Dashboard - Main Application Logic

// Storage Module - Abstracts Local Storage operations
const StorageModule = (function() {
  // Storage key constants
  const STORAGE_KEYS = {
    TASKS: 'tasks',
    LINKS: 'links',
    POMODORO_CUSTOM_DURATION: 'pomodoroCustomDuration',
    THEME: 'theme',
    USER_NAME: 'userName'
  };

  /**
   * Get a value from Local Storage
   * @param {string} key - The storage key
   * @returns {any} The parsed value or null if not found or error occurs
   */
  function get(key) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from storage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Set a value in Local Storage
   * @param {string} key - The storage key
   * @param {any} value - The value to store (will be JSON serialized)
   */
  function set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to storage (key: ${key}):`, error);
      // Handle quota exceeded or other storage errors
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Consider clearing old data.');
      }
    }
  }

  /**
   * Remove a value from Local Storage
   * @param {string} key - The storage key to remove
   */
  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage (key: ${key}):`, error);
    }
  }

  /**
   * Clear all values from Local Storage
   */
  function clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Public API
  return {
    KEYS: STORAGE_KEYS,
    get,
    set,
    remove,
    clear
  };
})();

console.log('Productivity Dashboard initialized');

// Greeting Module - Manages date/time display and greeting messages
const GreetingModule = (function() {
  // DOM element references
  let dateElement;
  let timeElement;
  let greetingElement;
  let intervalId;

  /**
   * Initialize the greeting module
   */
  function init() {
    // Get DOM element references
    dateElement = document.getElementById('current-date');
    timeElement = document.getElementById('current-time');
    greetingElement = document.getElementById('greeting-message');

    // Initial update
    updateDateTime();

    // Set up automatic updates every second
    intervalId = setInterval(updateDateTime, 1000);
  }

  /**
   * Update the date, time, and greeting display
   */
  function updateDateTime() {
    const now = new Date();

    // Format and display date
    const dateOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = now.toLocaleDateString('en-US', dateOptions);
    if (dateElement) {
      dateElement.textContent = formattedDate;
    }

    // Format and display time
    const timeOptions = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    };
    const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
    if (timeElement) {
      timeElement.textContent = formattedTime;
    }

    // Update greeting based on current hour
    const hour = now.getHours();
    const greeting = getGreeting(hour);
    if (greetingElement) {
      greetingElement.textContent = greeting;
    }
  }

  /**
   * Get greeting message based on the hour of the day
   * @param {number} hour - The current hour (0-23)
   * @returns {string} The appropriate greeting message
   */
  function getGreeting(hour) {
    // Good Morning: 5:00 AM - 11:59 AM (5-11)
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    }
    // Good Afternoon: 12:00 PM - 4:59 PM (12-16)
    else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    }
    // Good Evening: 5:00 PM - 4:59 AM (17-23, 0-4)
    else {
      return 'Good Evening';
    }
  }

  /**
   * Set custom user name for greeting (optional feature)
   * @param {string} name - The user's name
   */
  function setUserName(name) {
    if (name && name.trim()) {
      StorageModule.set(StorageModule.KEYS.USER_NAME, name.trim());
      updateDateTime(); // Refresh display with new name
    }
  }

  /**
   * Clean up resources (stop interval)
   */
  function destroy() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Public API
  return {
    init,
    updateDateTime,
    getGreeting,
    setUserName,
    destroy
  };
})();

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  GreetingModule.init();
  console.log('Greeting Module initialized');
});
