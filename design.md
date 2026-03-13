# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application built with vanilla JavaScript that provides users with time management and task organization tools. The application consists of four main components: a time-based greeting display, a 25-minute focus timer, a task management system, and quick links for favorite websites. All data is persisted locally using the browser's Local Storage API, eliminating the need for a backend server.

The design emphasizes simplicity and maintainability by using a single HTML file, one CSS file, and one JavaScript file without any build process or external dependencies. The application follows a component-based architecture where each feature is encapsulated in its own module with clear responsibilities and interfaces.

## Architecture

### System Architecture

The application follows a modular, component-based architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     index.html                          │
│                  (Entry Point)                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │            App Initialization                     │  │
│  │  - Component initialization                       │  │
│  │  - Event listener setup                           │  │
│  │  - State restoration from Local Storage          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Greeting   │  │ Focus Timer  │  │  Task List   │
│  Component   │  │  Component   │  │  Component   │
└──────────────┘  └──────────────┘  └──────────────┘
                                            │
                                            ▼
                                    ┌──────────────┐
                                    │ Quick Links  │
                                    │  Component   │
                                    └──────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Storage Layer (Local Storage)               │
│  - tasks: Array<Task>                                   │
│  - quickLinks: Array<Link>                              │
└─────────────────────────────────────────────────────────┘
```

### Component Architecture

Each component follows a consistent pattern:

1. **State Management**: Components maintain their own internal state
2. **Rendering**: Components are responsible for their own DOM updates
3. **Event Handling**: Components handle user interactions within their scope
4. **Persistence**: Components that need persistence interact with the Storage Layer

### Key Design Decisions

1. **No Framework Approach**: Using vanilla JavaScript ensures zero dependencies, fast load times, and full control over the codebase
2. **Single File Structure**: One CSS file and one JavaScript file simplify deployment and eliminate build complexity
3. **Local Storage Only**: Client-side persistence removes server dependencies and simplifies architecture
4. **Component Isolation**: Each feature is self-contained, making the code easier to test and maintain
5. **Immediate Persistence**: All data changes are saved immediately to prevent data loss

## Components and Interfaces

### 1. Greeting Component

**Responsibility**: Display current time, date, and time-based greeting

**Public Interface**:
```javascript
GreetingComponent {
  init(containerElement): void
  updateTime(): void
  destroy(): void
}
```

**Internal State**:
- Current time interval ID
- DOM references to time, date, and greeting elements

**Behavior**:
- Updates time display every second
- Calculates appropriate greeting based on current hour
- Formats date in human-readable format (e.g., "Monday, March 10, 2025")

### 2. Focus Timer Component

**Responsibility**: Provide a 25-minute countdown timer with start, stop, and reset controls

**Public Interface**:
```javascript
FocusTimerComponent {
  init(containerElement): void
  start(): void
  stop(): void
  reset(): void
  destroy(): void
}
```

**Internal State**:
- Remaining time in seconds (default: 1500)
- Timer interval ID
- Running status (boolean)

**Behavior**:
- Counts down from 25 minutes (1500 seconds)
- Updates display every second when running
- Shows notification when timer reaches zero
- Maintains state through start/stop/reset operations

### 3. Task List Component

**Responsibility**: Manage tasks with create, read, update, delete operations

**Public Interface**:
```javascript
TaskListComponent {
  init(containerElement): void
  addTask(text: string): void
  toggleTask(taskId: string): void
  deleteTask(taskId: string): void
  editTask(taskId: string, newText: string): void
  loadTasks(): void
  destroy(): void
}
```

**Internal State**:
- Array of Task objects
- DOM references to task list and input elements

**Behavior**:
- Creates unique IDs for each task
- Persists changes immediately to Local Storage
- Renders tasks with visual distinction for completed items
- Validates task text (non-empty)

### 4. Quick Links Component

**Responsibility**: Manage quick access links to favorite websites

**Public Interface**:
```javascript
QuickLinksComponent {
  init(containerElement): void
  addLink(name: string, url: string): void
  deleteLink(linkId: string): void
  loadLinks(): void
  destroy(): void
}
```

**Internal State**:
- Array of Link objects
- DOM references to links list and input elements

**Behavior**:
- Creates unique IDs for each link
- Validates URLs (must start with http:// or https://)
- Opens links in new tabs
- Persists changes immediately to Local Storage

### 5. Storage Service

**Responsibility**: Abstract Local Storage operations

**Public Interface**:
```javascript
StorageService {
  saveTasks(tasks: Array<Task>): void
  loadTasks(): Array<Task>
  saveLinks(links: Array<Link>): void
  loadLinks(): Array<Link>
}
```

**Behavior**:
- Serializes data to JSON for storage
- Deserializes data from JSON when loading
- Handles storage errors gracefully
- Returns empty arrays if no data exists

## Data Models

### Task Model

```javascript
{
  id: string,          // Unique identifier (UUID or timestamp-based)
  text: string,        // Task description
  completed: boolean,  // Completion status
  createdAt: number    // Timestamp (milliseconds since epoch)
}
```

**Constraints**:
- `id` must be unique across all tasks
- `text` must be non-empty string
- `completed` defaults to false
- `createdAt` is set on creation and immutable

### Link Model

```javascript
{
  id: string,    // Unique identifier (UUID or timestamp-based)
  name: string,  // Display name for the link
  url: string    // Full URL including protocol
}
```

**Constraints**:
- `id` must be unique across all links
- `name` must be non-empty string
- `url` must start with "http://" or "https://"

### Storage Schema

**Local Storage Keys**:
- `productivity-dashboard-tasks`: JSON array of Task objects
- `productivity-dashboard-links`: JSON array of Link objects

**Example Storage Content**:
```javascript
// localStorage['productivity-dashboard-tasks']
[
  {
    "id": "task-1710086400000",
    "text": "Complete project documentation",
    "completed": false,
    "createdAt": 1710086400000
  },
  {
    "id": "task-1710086500000",
    "text": "Review pull requests",
    "completed": true,
    "createdAt": 1710086500000
  }
]

// localStorage['productivity-dashboard-links']
[
  {
    "id": "link-1710086400000",
    "name": "GitHub",
    "url": "https://github.com"
  },
  {
    "id": "link-1710086500000",
    "name": "Documentation",
    "url": "https://developer.mozilla.org"
  }
]
```

### Local Storage Strategy

**Persistence Timing**:
- Immediate persistence on every data mutation (create, update, delete)
- No debouncing or batching to prevent data loss

**Error Handling**:
- Catch and log quota exceeded errors
- Gracefully degrade if Local Storage is unavailable
- Provide user feedback if save operations fail

**Data Integrity**:
- Validate data structure when loading from storage
- Filter out invalid entries
- Maintain backward compatibility with schema changes

## UI Layout

### Overall Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                      Header Area                         │
│  ┌────────────────────────────────────────────────┐    │
│  │         Greeting Component                      │    │
│  │  Good Morning                                   │    │
│  │  Monday, March 10, 2025                        │    │
│  │  10:30:45 AM                                   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                    Main Content Area                     │
│  ┌──────────────────┐  ┌──────────────────────────┐   │
│  │  Focus Timer     │  │    Task List             │   │
│  │                  │  │                          │   │
│  │     25:00        │  │  ☐ Task 1               │   │
│  │                  │  │  ☑ Task 2               │   │
│  │  [Start] [Reset] │  │  ☐ Task 3               │   │
│  │                  │  │                          │   │
│  │                  │  │  [Add Task Input]        │   │
│  └──────────────────┘  └──────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Quick Links                            │  │
│  │  [GitHub] [Docs] [Email]                        │  │
│  │  [Add Link Form]                                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Layout Specifications

**Grid System**:
- Use CSS Grid for main layout
- Two-column layout for timer and task list
- Full-width sections for greeting and quick links

**Spacing**:
- Container padding: 20px
- Component margin: 20px between components
- Internal padding: 15px within components

**Responsive Behavior**:
- Desktop (>768px): Two-column layout for timer and tasks
- Tablet/Mobile (<768px): Single column, stacked layout

**Visual Hierarchy**:
1. Greeting (largest, top)
2. Timer and Tasks (equal prominence, middle)
3. Quick Links (bottom)

### Component Styling Guidelines

**Colors**:
- Background: Light neutral (#f5f5f5 or similar)
- Component backgrounds: White (#ffffff)
- Primary text: Dark gray (#333333)
- Secondary text: Medium gray (#666666)
- Accent: Blue for interactive elements (#4a90e2)
- Success: Green for completed tasks (#5cb85c)

**Typography**:
- Base font size: 16px
- Greeting: 32px, bold
- Time: 24px
- Component headers: 20px, semi-bold
- Body text: 16px
- Minimum contrast ratio: 4.5:1 (WCAG AA)

**Interactive Elements**:
- Buttons: Rounded corners (4px), padding (10px 20px)
- Hover state: Slight background color change
- Active state: Slightly darker background
- Focus state: Visible outline for keyboard navigation

**Task List Styling**:
- Completed tasks: Strike-through text, lighter color
- Incomplete tasks: Normal text
- Hover: Light background highlight
- Checkbox: Custom styled for consistency

