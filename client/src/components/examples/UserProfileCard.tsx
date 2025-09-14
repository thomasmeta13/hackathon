import { UserProfileCard } from '../UserProfileCard'

export default function UserProfileCardExample() {
  // todo: remove mock functionality
  const mockUser = {
    id: "user-1",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@htwearning.com",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    role: "tasker",
    xp: 275,
    skills: ["JavaScript", "UI Design", "Content Writing", "Social Media"],
    badges: ["First Task", "Video Creator", "Team Player"],
    profileCompletion: 85
  }

  const handleEditProfile = () => {
    console.log('Edit profile triggered')
  }

  return (
    <div className="max-w-sm">
      <UserProfileCard 
        user={mockUser}
        onEditProfile={handleEditProfile}
      />
    </div>
  )
}