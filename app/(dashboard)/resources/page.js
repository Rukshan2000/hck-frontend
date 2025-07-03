"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Video, Download, Link as LinkIcon, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SimulateStudentUser } from "@/components/opportunities/simulate-student-user"

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Mock resources data
  const resources = [
    {
      id: 1,
      title: "Web Development Basics",
      type: "document",
      description: "Introduction to HTML, CSS, and JavaScript fundamentals",
      category: "Programming",
      link: "#",
      icon: FileText
    },
    {
      id: 2,
      title: "Database Design Tutorial",
      type: "video",
      description: "Learn how to design efficient database schemas for your applications",
      category: "Database",
      link: "#",
      icon: Video
    },
    {
      id: 3,
      title: "UX Design Principles",
      type: "document",
      description: "Essential principles for creating user-friendly interfaces",
      category: "Design",
      link: "#",
      icon: FileText
    },
    {
      id: 4,
      title: "React Framework Documentation",
      type: "link",
      description: "Official documentation for the React JavaScript framework",
      category: "Programming",
      link: "https://reactjs.org",
      icon: LinkIcon
    },
    {
      id: 5,
      title: "Technical Interview Preparation Guide",
      type: "document",
      description: "Comprehensive guide for preparing for technical interviews",
      category: "Career",
      link: "#",
      icon: FileText
    },
    {
      id: 6,
      title: "Building RESTful APIs",
      type: "video",
      description: "Step-by-step guide to creating RESTful APIs",
      category: "Programming",
      link: "#",
      icon: Video
    }
  ]
  
  // Filter resources based on search term
  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Group resources by category
  const categorizedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {})
  
  return (
    <>
      <SimulateStudentUser />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Learning Resources</h2>
            <p className="text-muted-foreground">
              Access educational materials to support your studies
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search resources by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Button variant="secondary" onClick={() => setSearchTerm("")}>
            Clear
          </Button>
        </div>
        
        {Object.keys(categorizedResources).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-40">
              <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No resources found matching your search criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(categorizedResources).map(([category, resources]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
                <CardDescription>
                  {category === "Programming" && "Coding tutorials and documentation"}
                  {category === "Design" && "UI/UX design guides and principles"}
                  {category === "Career" && "Career development resources"}
                  {category === "Database" && "Database design and management materials"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <div 
                      key={resource.id} 
                      className="flex flex-col space-y-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-primary/10 p-2">
                            <resource.icon className="h-4 w-4 text-primary" />
                          </div>
                          <h4 className="font-semibold">{resource.title}</h4>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {resource.type === "document" && <Download className="h-4 w-4" />}
                          {resource.type === "link" && <ExternalLink className="h-4 w-4" />}
                          {resource.type === "video" && <Video className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground mt-auto">
                        <span>{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}
