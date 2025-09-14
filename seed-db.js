import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

// Create database connection
const sqlite = new Database('./dev.db');
const db = drizzle(sqlite);

async function seedDatabase() {
  console.log('🌱 Seeding database with mock data...');

  // Create mock users
  const mockUsers = [
    {
      id: 'user-1',
      email: 'organizer@htw.com',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'organizer',
      xp: 0,
      skills: JSON.stringify(['Leadership', 'Event Planning']),
      badges: JSON.stringify(['Organizer']),
      profile_completion: 100,
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'user-2',
      email: 'tasker@htw.com',
      first_name: 'Mike',
      last_name: 'Chen',
      role: 'tasker',
      xp: 250,
      skills: JSON.stringify(['Design', 'Marketing', 'Development']),
      badges: JSON.stringify(['Rising Star', 'Designer']),
      profile_completion: 85,
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'user-3',
      email: 'alex@htw.com',
      first_name: 'Alex',
      last_name: 'Rodriguez',
      role: 'tasker',
      xp: 180,
      skills: JSON.stringify(['Video Production', 'Content Creation']),
      badges: JSON.stringify(['Content Creator']),
      profile_completion: 90,
      created_at: Date.now(),
      updated_at: Date.now()
    }
  ];

  // Insert users
  for (const user of mockUsers) {
    try {
      sqlite.prepare(`
        INSERT OR IGNORE INTO users (id, email, first_name, last_name, role, xp, skills, badges, profile_completion, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(user.id, user.email, user.first_name, user.last_name, user.role, user.xp, user.skills, user.badges, user.profile_completion, user.created_at, user.updated_at);
      console.log(`✅ Created user: ${user.first_name} ${user.last_name}`);
    } catch (error) {
      console.log(`⚠️  User ${user.email} might already exist`);
    }
  }

  // Create mock organization
  const mockOrg = {
    id: 'org-1',
    name: 'Honolulu Tech Week 2025',
    description: 'The premier technology conference in Hawaii, bringing together innovators, entrepreneurs, and tech enthusiasts from across the Pacific.',
    website: 'https://honolulutechweek.com',
    location: 'Honolulu, HI',
    industry: 'technology',
    size: 'large',
    contact_info: 'info@honolulutechweek.com\nPhone: (808) 555-0123',
    mission: 'To foster innovation and collaboration in Hawaii\'s tech community while showcasing the islands as a hub for technology and entrepreneurship.',
    goals: 'Create engaging content for HTW 2025, increase community participation, and showcase local tech talent through various tasks and challenges.',
    events_organized: 5,
    sponsor_level: 'platinum',
    created_by: 'user-1',
    created_at: Date.now(),
    updated_at: Date.now()
  };

  try {
    sqlite.prepare(`
      INSERT OR IGNORE INTO organizations (id, name, description, website, location, industry, size, contact_info, mission, goals, events_organized, sponsor_level, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(mockOrg.id, mockOrg.name, mockOrg.description, mockOrg.website, mockOrg.location, mockOrg.industry, mockOrg.size, mockOrg.contact_info, mockOrg.mission, mockOrg.goals, mockOrg.events_organized, mockOrg.sponsor_level, mockOrg.created_by, mockOrg.created_at, mockOrg.updated_at);
    console.log(`✅ Created organization: ${mockOrg.name}`);
  } catch (error) {
    console.log(`⚠️  Organization might already exist`);
  }

  // Create mock tasks
  const mockTasks = [
    {
      id: 'task-1',
      title: 'Create HTW 2025 Promotional Graphics',
      description: 'Design eye-catching promotional graphics for Honolulu Tech Week 2025. Include the official logo, event dates (March 15-20, 2025), and key themes. Graphics should be suitable for social media, website banners, and print materials.',
      status: 'unclaimed',
      reward: 75,
      category: 'design',
      type: 'image_generation',
      ai_output: null,
      iterations: 0,
      assigned_to: null,
      created_by: 'user-1',
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'task-2',
      title: 'Develop Workshop Marketing Campaign',
      description: 'Create and execute a comprehensive marketing strategy for HTW 2025 workshops. This includes social media content, email campaigns, and partnership outreach to increase workshop attendance by 40%.',
      status: 'unclaimed',
      reward: 100,
      category: 'marketing',
      type: 'social_media',
      ai_output: null,
      iterations: 0,
      assigned_to: null,
      created_by: 'user-1',
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'task-3',
      title: 'Record Event Highlight Videos',
      description: 'Film and edit short highlight videos showcasing the best moments from HTW 2025. Videos should be 30-60 seconds each, optimized for social media sharing, and capture the energy and innovation of the event.',
      status: 'in_progress',
      reward: 150,
      category: 'content_creation',
      type: 'video_creation',
      ai_output: null,
      iterations: 0,
      assigned_to: 'user-3',
      created_by: 'user-1',
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'task-4',
      title: 'Build Community Engagement Platform',
      description: 'Develop a web application that allows HTW attendees to connect, share ideas, and collaborate on projects. Features should include user profiles, project matching, and real-time chat functionality.',
      status: 'unclaimed',
      reward: 200,
      category: 'development',
      type: 'coding',
      ai_output: null,
      iterations: 0,
      assigned_to: null,
      created_by: 'user-1',
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'task-5',
      title: 'Write Technical Documentation',
      description: 'Create comprehensive documentation for HTW 2025 APIs and developer tools. Documentation should include setup guides, API references, code examples, and troubleshooting sections.',
      status: 'completed',
      reward: 80,
      category: 'content_creation',
      type: 'writing',
      ai_output: null,
      iterations: 0,
      assigned_to: 'user-2',
      created_by: 'user-1',
      created_at: Date.now(),
      updated_at: Date.now()
    },
    {
      id: 'task-6',
      title: 'Organize Networking Event',
      description: 'Plan and coordinate a networking mixer for HTW 2025 attendees. This includes venue selection, catering coordination, entertainment booking, and creating networking activities to facilitate meaningful connections.',
      status: 'unclaimed',
      reward: 120,
      category: 'event_prep',
      type: 'event_planning',
      ai_output: null,
      iterations: 0,
      assigned_to: null,
      created_by: 'user-1',
      created_at: Date.now(),
      updated_at: Date.now()
    }
  ];

  // Insert tasks
  for (const task of mockTasks) {
    try {
      sqlite.prepare(`
        INSERT OR IGNORE INTO tasks (id, title, description, status, reward, category, type, ai_output, iterations, assigned_to, created_by, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(task.id, task.title, task.description, task.status, task.reward, task.category, task.type, task.ai_output, task.iterations, task.assigned_to, task.created_by, task.created_at, task.updated_at);
      console.log(`✅ Created task: ${task.title}`);
    } catch (error) {
      console.log(`⚠️  Task ${task.title} might already exist`);
    }
  }

  console.log('🎉 Database seeding complete!');
  sqlite.close();
}

seedDatabase().catch(console.error);
