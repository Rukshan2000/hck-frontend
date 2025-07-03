"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { OpportunitiesTable } from "./opportunities-table"
import { OpportunitiesGrid } from "./opportunities-grid"
import { OpportunitiesHeader } from "./opportunities-header"
import { OpportunityFormModal } from "./opportunity-form-modal"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"

// Mock data for opportunities
export const mockOpportunities = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechSolutions Inc.",
    description: "We are looking for a passionate Frontend Developer intern to join our team for a 3-month period.",
    requirements: "HTML, CSS, JavaScript, React.js",
    location: "Remote",
    type: "Internship",
    deadline: "2025-08-15",
    posted_at: "2025-07-01",
    status: "Open",
    applicationCount: 12
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "DataCorp",
    description: "Join our backend team to build scalable APIs and microservices for our growing platform.",
    requirements: "Node.js, Express, MongoDB, AWS",
    location: "New York, NY",
    type: "Full-time",
    deadline: "2025-07-30",
    posted_at: "2025-06-25",
    status: "Open",
    applicationCount: 8
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "CreativeTech",
    description: "Design beautiful and intuitive user interfaces for web and mobile applications.",
    requirements: "Figma, Adobe XD, UI/UX principles",
    location: "San Francisco, CA",
    type: "Part-time",
    deadline: "2025-08-05",
    posted_at: "2025-07-02",
    status: "Open",
    applicationCount: 5
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "AnalyticsPro",
    description: "Work on challenging data problems and develop machine learning models for prediction and analysis.",
    requirements: "Python, TensorFlow, SQL, Statistics",
    location: "Boston, MA",
    type: "Full-time",
    deadline: "2025-07-25",
    posted_at: "2025-06-20",
    status: "Open",
    applicationCount: 15
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines.",
    requirements: "Docker, Kubernetes, AWS/Azure, Jenkins",
    location: "Remote",
    type: "Contract",
    deadline: "2025-08-10",
    posted_at: "2025-06-28",
    status: "Open",
    applicationCount: 7
  },
  {
    id: 6,
    title: "Mobile App Developer",
    company: "AppWorks Inc.",
    description: "Develop cross-platform mobile applications using React Native.",
    requirements: "React Native, JavaScript, Mobile development experience",
    location: "Chicago, IL",
    type: "Full-time",
    deadline: "2025-07-20",
    posted_at: "2025-06-15",
    status: "Open",
    applicationCount: 10
  }
];

export function OpportunitiesDashboard() {
  const [viewMode, setViewMode] = useState('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    location: 'all',
    status: 'all'
  })
  const [showStatistics, setShowStatistics] = useState(false)
  
  const currentUser = useSelector(selectCurrentUser)
  const isAdmin = currentUser?.roles?.some(role => role.name === 'admin' || role.name === 'staff')
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleCreateOpportunity = () => {
    setSelectedOpportunity(null)
    setIsModalOpen(true)
  }

  const handleEditOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedOpportunity(null)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const toggleStatistics = () => {
    setShowStatistics(prev => !prev)
  }

  return (
    <div className="space-y-6">
      <OpportunitiesHeader 
        onCreateOpportunity={isAdmin ? handleCreateOpportunity : undefined}
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        showStatistics={showStatistics}
        onToggleStatistics={toggleStatistics}
      />

      {viewMode === 'list' ? (
        <OpportunitiesTable 
          opportunities={mockOpportunities} 
          filters={filters}
          onEdit={isAdmin ? handleEditOpportunity : undefined}
        />
      ) : (
        <OpportunitiesGrid 
          opportunities={mockOpportunities}
          filters={filters}
          onEdit={isAdmin ? handleEditOpportunity : undefined}
        />
      )}

      {isAdmin && (
        <OpportunityFormModal 
          open={isModalOpen} 
          onOpenChange={handleModalClose} 
          opportunity={selectedOpportunity}
        />
      )}
    </div>
  )
}
