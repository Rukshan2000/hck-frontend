"use client"

import { useState } from "react"
import { Search, Filter, Plus, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "@/lib/features/auth/authSlice"
import { mockOpportunities } from "./opportunities-dashboard"

export function OpportunitiesHeader({ 
  onCreateOpportunity, 
  filters, 
  onFilterChange, 
  viewMode = 'grid', 
  onViewModeChange,
  showStatistics = false,
  onToggleStatistics
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const isAdmin = currentUser?.roles?.some(role => role.name === 'admin' || role.name === 'staff')
  
  // Get unique locations and types for filters
  const locations = [...new Set(mockOpportunities.map(o => o.location))];
  const types = [...new Set(mockOpportunities.map(o => o.type))];

  const clearFilters = () => {
    onFilterChange?.('search', '')
    onFilterChange?.('type', 'all')
    onFilterChange?.('location', 'all')
    onFilterChange?.('status', 'all')
  }

  const activeFiltersCount = Object.values(filters || {}).filter(value => 
    value && value !== 'all' && value !== false && value !== ''
  ).length

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Job Opportunities</h2>
          <p className="text-gray-600">Find and apply for jobs and internships</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md border">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange?.('grid')}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>

          {/* Statistics Toggle */}
          {isAdmin && (
            <Button
              variant={showStatistics ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleStatistics}
            >
              Statistics
            </Button>
          )}

          {/* Create Opportunity */}
          {isAdmin && onCreateOpportunity && (
            <Button onClick={onCreateOpportunity}>
              <Plus className="h-4 w-4 mr-2" />
              Post Job
            </Button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search opportunities..."
            value={filters?.search || ''}
            onChange={(e) => onFilterChange?.('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <Select
          value={filters?.type || 'all'}
          onValueChange={(value) => onFilterChange?.('type', value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select
          value={filters?.location || 'all'}
          onValueChange={(value) => onFilterChange?.('location', value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters?.status || 'all'}
          onValueChange={(value) => onFilterChange?.('status', value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
