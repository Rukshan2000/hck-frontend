# Opportunities Components

This folder contains components for the job opportunities section, allowing students to browse and apply for job listings.

## Components Overview

### Core Components

- **`OpportunitiesDashboard`** - Main dashboard component that combines all opportunity components
- **`OpportunitiesTable`** - Table view of job listings with filters and actions
- **`OpportunitiesGrid`** - Card-based grid view for job listings
- **`OpportunityFormModal`** - Modal form for creating and editing job opportunities (admin only)
- **`ApplyFormModal`** - Modal for students to submit job applications with CV upload

### Supporting Components

- **`OpportunityCard`** - Individual job card component with application status and actions
- **`OpportunitiesHeader`** - Header component with search, filters, and view controls

## Usage

### Quick Start
```jsx
import { OpportunitiesDashboard } from '@/components/opportunities'

export default function OpportunitiesPage() {
  return <OpportunitiesDashboard />
}
```

### Individual Components
```jsx
import { 
  OpportunitiesHeader, 
  OpportunitiesTable,
  OpportunitiesGrid,
  OpportunityCard,
  OpportunityFormModal,
  ApplyFormModal
} from '@/components/opportunities'
```

## Features

### OpportunitiesDashboard
- Complete job listings management
- Switchable views (table/grid)
- Filtering and search
- Role-based permissions (admin can post jobs, students can apply)

### OpportunitiesTable
- Sortable columns
- Application deadline highlighting
- Status badges
- Location and job type display
- Action menu for applications

### OpportunitiesGrid
- Card-based layout
- Visual indicators for deadlines
- Company and location information
- Application buttons

### OpportunityFormModal
- Create/edit job listings (admin only)
- Form validation
- Job type selection
- Deadline setting

### ApplyFormModal
- Student application form
- CV upload (PDF only with validation)
- Cover letter option
- Application submission

### OpportunityCard
- Job type color coding
- Deadline indicators
- Company information
- Apply button for students

### OpportunitiesHeader
- Search functionality
- Job type filters
- Location filters
- View mode toggle

## Props & Configuration

### OpportunityCard
```jsx
<OpportunityCard
  opportunity={opportunityObject}
  onEdit={(opportunity) => {}}
/>
```

### ApplyFormModal
```jsx
<ApplyFormModal
  open={boolean}
  onOpenChange={(open) => {}}
  opportunity={opportunityObject}
/>
```

## Styling

Components use:
- Tailwind CSS for styling
- shadcn/ui components
- Lucide icons
- Custom color schemes for job types and status

## Dependencies

- React 18+
- Redux for user role management
- shadcn/ui components
- Tailwind CSS
- Lucide React icons
