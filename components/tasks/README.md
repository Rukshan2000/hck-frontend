# Tasks Components

This folder contains all task-related UI components for the task management system.

## Components Overview

### Core Components

- **`TasksDashboard`** - Main dashboard component that combines all task components
- **`ImprovedTasksTable`** - Enhanced table view with filters, pagination, and actions
- **`TasksGrid`** - Card-based grid view for tasks
- **`TaskFormModal`** - Modal form for creating and editing tasks

### Supporting Components

- **`TaskCard`** - Individual task card component with status, priority, and actions
- **`TaskStatistics`** - Dashboard statistics showing task metrics
- **`TasksHeader`** - Header component with search, filters, and view controls
- **`TasksTable`** - Basic table component (legacy)

## Usage

### Quick Start
```jsx
import { TasksDashboard } from '@/components/tasks'

export default function TasksPage() {
  return <TasksDashboard />
}
```

### Individual Components
```jsx
import { 
  TasksHeader, 
  TaskStatistics, 
  ImprovedTasksTable,
  TasksGrid,
  TaskFormModal 
} from '@/components/tasks'
```

## Features

### TasksDashboard
- Complete task management interface
- Statistics overview
- Switchable views (table/grid)
- Advanced filtering and search
- Role-based permissions

### ImprovedTasksTable
- Sortable columns
- Inline actions (edit, delete, complete, restore)
- Pagination
- Status badges
- User assignment display
- Soft delete support

### TasksGrid
- Card-based layout
- Visual priority indicators
- Progress tracking
- Deadline warnings
- Responsive design

### TaskFormModal
- Create/edit tasks
- Form validation
- User assignment
- Status management
- Date picker for deadlines

### TaskCard
- Priority color coding
- Status icons
- Progress bars
- Deadline indicators
- Action buttons

### TaskStatistics
- Total tasks count
- Completion metrics
- Overdue tracking
- Progress visualization

### TasksHeader
- Search functionality
- Advanced filters
- Sort options
- View mode toggle
- Bulk actions

## Props & Configuration

### TasksDashboard
No props required - uses Redux store for state management.

### TaskCard
```jsx
<TaskCard
  task={taskObject}
  onEdit={(task) => {}}
  onDelete={(taskId) => {}}
  onMarkComplete={(taskId) => {}}
  onRestore={(taskId) => {}}
/>
```

### TaskFormModal
```jsx
<TaskFormModal
  open={boolean}
  onOpenChange={(open) => {}}
/>
```

## State Management

Components use Redux with RTK Query for:
- Task data fetching
- Filter state
- Pagination
- View mode
- Selected task

## Styling

Components use:
- Tailwind CSS for styling
- shadcn/ui components
- Lucide icons
- Custom color schemes for status/priority

## Dependencies

- React 18+
- Redux Toolkit
- RTK Query
- shadcn/ui components
- Tailwind CSS
- Lucide React icons
