"use client"

import { OpportunityCard } from "./opportunity-card"

export function OpportunitiesGrid({ opportunities, filters, onEdit }) {
  // Apply filters
  const filteredOpportunities = opportunities.filter(opportunity => {
    // Search filter
    if (filters.search && !opportunity.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !opportunity.company.toLowerCase().includes(filters.search.toLowerCase()) &&
        !opportunity.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type !== 'all' && opportunity.type !== filters.type) {
      return false;
    }
    
    // Location filter
    if (filters.location !== 'all' && opportunity.location !== filters.location) {
      return false;
    }
    
    // Status filter
    if (filters.status !== 'all' && opportunity.status !== filters.status) {
      return false;
    }
    
    return true;
  });

  if (filteredOpportunities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          No opportunities found. {filters.search || filters.type !== 'all' || filters.location !== 'all' || filters.status !== 'all' ? 
            'Try adjusting your filters.' : 'Check back later for new opportunities!'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredOpportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          onEdit={onEdit}
        />
      ))}
    </div>
  )
}
