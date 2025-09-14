# Database Structure

## Entities & Fields

### Task
- `id`: Unique identifier for each task.
- `title`: Title of the task.
- `description`: Detailed description of the task.
- `status`: Current status (e.g., Unclaimed, In Progress, Completed).
- `reward`: Reward for completing the task.
- `createdAt`: Timestamp of task creation.
- `updatedAt`: Timestamp of last update.
- `assignedTo`: User assigned to the task.
- `createdBy`: User who created the task.
- `category`: Category of the task (e.g., Marketing, Event Prep).
- `type`: Type of task (e.g., Image Generation, Coding).
- `AIOutput`: AI-generated output for the task.
- `iterations`: Number of iterations for task completion.

### User
- `id`: Unique identifier for each user.
- `name`: User's name.
- `email`: User's email address.
- `role`: User's role (e.g., Organizer, Tasker).
- `skills`: User's skills.
- `XP`: Experience points earned by the user.
- `badges`: Badges earned by the user.
- `profileCompletion`: Profile completion status.
- `createdAt`: Timestamp of user creation.
- `updatedAt`: Timestamp of last update.
- `taskHistory`: History of tasks completed by the user.

### Organization
- `id`: Unique identifier for each organization.
- `name`: Name of the organization.
- `contactInfo`: Contact information for the organization.
- `eventsOrganized`: Number of events organized by the organization.
- `createdAt`: Timestamp of organization creation.
- `updatedAt`: Timestamp of last update.
- `sponsorLevel`: Sponsorship level of the organization.