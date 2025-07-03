"use client"

import { useState } from "react"
import { Search, Filter, Plus, SortAsc, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function TasksHeader({ 
  onCreateTask, 
  filters, 
  onFilterChange, 
  viewMode = 'list', 
  onViewModeChange,
  users = [],
  showStatistics = false,
  onToggleStatistics
}) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const clearFilters = () => {
    onFilterChange?.('search', '')
    onFilterChange?.('status', 'all')
    onFilterChange?.('assigned_to', 'all')
    onFilterChange?.('priority', 'all')
    onFilterChange?.('deadline_from', '')
    onFilterChange?.('deadline_to', '')
    onFilterChange?.('overdue', false)
    onFilterChange?.('with_trashed', false)
  }

  const activeFiltersCount = Object.values(filters || {}).filter(value => 
    value && value !== 'all' && value !== false && value !== ''
  ).length

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tasks Management</h2>
          <p className="text-gray-600">Manage and track your team's tasks</p>
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
          <Button
            variant={showStatistics ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleStatistics}
          >
            Statistics
          </Button>

          {/* Create Task */}
          <Button onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={filters?.search || ''}
            onChange={(e) => onFilterChange?.('search', e.target.value)}
            className="pl-10"
          />
        </div>

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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Assigned To Filter */}
        <Select
          value={filters?.assigned_to || 'all'}
          onValueChange={(value) => onFilterChange?.('assigned_to', value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Assigned to" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users?.filter(user => user.id && user.name).map((user) => (
              <SelectItem key={user.id} value={user.id?.toString()}>
                {user.name}
              </SelectItem>
            ))}
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

        {/* Sort */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilterChange?.('sort', 'title_asc')}>
              Title A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.('sort', 'title_desc')}>
              Title Z-A
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.('sort', 'deadline_asc')}>
              Deadline (Earliest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.('sort', 'deadline_desc')}>
              Deadline (Latest)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.('sort', 'created_desc')}>
              Recently Created
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.('sort', 'status_asc')}>
              Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
          {/* Priority Filter */}
          <Select
            value={filters?.priority || 'all'}
            onValueChange={(value) => onFilterChange?.('priority', value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          {/* Deadline Range */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              placeholder="From"
              value={filters?.deadline_from || ''}
              onChange={(e) => onFilterChange?.('deadline_from', e.target.value)}
              className="w-36"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="date"
              placeholder="To"
              value={filters?.deadline_to || ''}
              onChange={(e) => onFilterChange?.('deadline_to', e.target.value)}
              className="w-36"
            />
          </div>

          {/* Checkboxes */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters?.overdue || false}
              onChange={(e) => onFilterChange?.('overdue', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Overdue Only</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters?.with_trashed || false}
              onChange={(e) => onFilterChange?.('with_trashed', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include Deleted</span>
          </label>
        </div>
      )}
    </div>
  )
}
