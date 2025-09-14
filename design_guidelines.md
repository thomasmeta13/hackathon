# HTW Earn Hub Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from **Linear** and **Notion** for clean productivity aesthetics, with gamification elements inspired by **Discord** and **GitHub**. This combines professional task management with engaging community features.

## Core Design Elements

### Color Palette
**Dark Mode Primary**:
- Background: 15 8% 8%
- Surface: 15 8% 12% 
- Primary Brand: 200 95% 55%
- Success/Completion: 142 76% 36%
- Warning/In Progress: 38 92% 50%

**Light Mode Primary**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary Brand: 200 95% 45%
- Success/Completion: 142 71% 45%
- Warning/In Progress: 38 92% 40%

### Typography
- Primary: Inter (headings, UI elements)
- Secondary: JetBrains Mono (code, task IDs, technical details)
- Sizes: text-xs to text-4xl with generous line heights

### Layout System
**Tailwind Spacing**: Primary units of 2, 4, 8, 12, 16
- Component padding: p-4, p-6
- Section margins: m-8, m-12
- Grid gaps: gap-4, gap-6

### Component Library

**Navigation**: 
- Fixed sidebar with collapsible sections
- Role-based navigation (Organizer vs Tasker views)
- Breadcrumb navigation for task hierarchy

**Task Cards**:
- Compact cards with XP indicators, difficulty badges
- Status color coding (unclaimed: neutral, in-progress: warning, completed: success)
- Hover states revealing quick actions

**Gamification Elements**:
- XP progress bars with animated fills
- Badge collection grid with unlock animations
- Leaderboard tables with rank indicators
- Skill tree visualization with connected nodes

**Forms**:
- AI-assisted task creation with smart suggestions
- Multi-step wizards for complex workflows
- Real-time validation with helpful error states

**Data Displays**:
- Network Health Dashboard with metric cards
- Task completion charts and analytics
- Community engagement heatmaps

**Overlays**:
- Task detail modals with tabbed content
- AI assistant chat interface
- Profile management sheets

### Visual Hierarchy
- Clear distinction between organizer (management-focused) and tasker (discovery-focused) interfaces
- Consistent iconography using Heroicons
- Strategic use of shadows and borders for depth
- Generous whitespace for scan-ability

### Interactive Elements
- Subtle hover transitions (150ms ease-in-out)
- Loading states with skeleton screens
- Success animations for task completion
- Progress indicators for multi-step processes

This design creates a professional yet engaging platform that balances productivity tools with community gamification elements.