"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Plus, Users, Briefcase } from "lucide-react";
import { ProjectCard } from "@/components/collaborator-hub/ProjectCard";
import { ProjectDetailsModal } from "@/components/collaborator-hub/ProjectDetailsModal";

/**
 * Collaborator Hub Page
 * 
 * Main page for browsing and viewing collaborative projects.
 * Features a responsive grid layout with project cards and filtering.
 * 
 * TODO: Replace mock data with actual database integration
 * TODO: Add project creation functionality
 * TODO: Add filtering and search logic
 * TODO: Add pagination for large project lists
 * TODO: Add user authentication checks
 */
export default function CollaboratorHubPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // TODO: Replace with actual data from Supabase database
  // This is mock data for UI template demonstration
  const mockProjects = [
    {
      id: 1,
      title: "AI-Powered Campus Navigation System",
      description:
        "Developing an intelligent navigation system for campus that uses computer vision and machine learning to help students find their way around.",
      image: null, // TODO: Add actual project images from database
      status: "Active",
      category: "Computer Science",
      startDate: "Jan 2024",
      students: [
        {
          name: "Sarah Johnson",
          avatar: null,
          department: "Computer Science",
        },
        {
          name: "Alex Chen",
          avatar: null,
          department: "Computer Science",
        },
      ],
      professors: [
        {
          name: "Dr. Emily Roberts",
          avatar: null,
          department: "CS Department",
        },
      ],
      papers: [
        {
          title: "Deep Learning for Indoor Navigation",
          authors: "Johnson S., Chen A., Roberts E.",
          abstract:
            "This paper explores the application of deep learning techniques for indoor navigation in large campus environments...",
          url: "#", // TODO: Add actual paper URLs
        },
      ],
      media: [], // TODO: Add actual media from database
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions for Urban Areas",
      description:
        "Research project focused on developing renewable energy systems optimized for urban environments and high-density living.",
      image: null,
      status: "Active",
      category: "Environmental Science",
      startDate: "Mar 2024",
      students: [
        {
          name: "Michael Zhang",
          avatar: null,
          department: "Environmental Engineering",
        },
        {
          name: "Priya Sharma",
          avatar: null,
          department: "Environmental Engineering",
        },
        {
          name: "Lucas Brown",
          avatar: null,
          department: "Physics",
        },
      ],
      professors: [
        {
          name: "Dr. James Wilson",
          avatar: null,
          department: "Environmental Sciences",
        },
        {
          name: "Dr. Maria Garcia",
          avatar: null,
          department: "Engineering",
        },
      ],
      papers: [],
      media: [],
    },
    {
      id: 3,
      title: "Blockchain-Based Academic Credential System",
      description:
        "Creating a decentralized system for storing and verifying academic credentials using blockchain technology to prevent fraud.",
      image: null,
      status: "Planning",
      category: "Computer Science",
      startDate: "Feb 2024",
      students: [
        {
          name: "David Kim",
          avatar: null,
          department: "Computer Science",
        },
      ],
      professors: [
        {
          name: "Dr. Robert Taylor",
          avatar: null,
          department: "CS Department",
        },
      ],
      papers: [
        {
          title: "Blockchain in Education: A Survey",
          authors: "Kim D., Taylor R.",
          abstract:
            "A comprehensive survey of blockchain applications in educational systems with focus on credential verification...",
          url: "#",
        },
        {
          title: "Decentralized Identity Management",
          authors: "Taylor R., Kim D.",
          abstract:
            "Exploring decentralized identity management systems for academic institutions...",
          url: "#",
        },
      ],
      media: [],
    },
    {
      id: 4,
      title: "Quantum Computing Applications in Chemistry",
      description:
        "Exploring how quantum computing can accelerate molecular simulations and drug discovery processes.",
      image: null,
      status: "Active",
      category: "Physics",
      startDate: "Dec 2023",
      students: [
        {
          name: "Emma Watson",
          avatar: null,
          department: "Physics",
        },
        {
          name: "Oliver Martinez",
          avatar: null,
          department: "Chemistry",
        },
      ],
      professors: [
        {
          name: "Dr. Alan Turing",
          avatar: null,
          department: "Physics",
        },
      ],
      papers: [],
      media: [],
    },
    {
      id: 5,
      title: "Neural Networks for Medical Diagnosis",
      description:
        "Developing advanced neural network models to assist in early detection and diagnosis of various medical conditions.",
      image: null,
      status: "Active",
      category: "Biomedical Engineering",
      startDate: "Jan 2024",
      students: [
        {
          name: "Sophia Lee",
          avatar: null,
          department: "Biomedical Engineering",
        },
        {
          name: "James Anderson",
          avatar: null,
          department: "Computer Science",
        },
      ],
      professors: [
        {
          name: "Dr. Helen Park",
          avatar: null,
          department: "Medicine",
        },
        {
          name: "Dr. Richard Moore",
          avatar: null,
          department: "CS Department",
        },
      ],
      papers: [
        {
          title: "Deep Learning in Medical Imaging",
          authors: "Lee S., Anderson J., Park H.",
          abstract:
            "Application of convolutional neural networks for medical image analysis and disease detection...",
          url: "#",
        },
      ],
      media: [],
    },
    {
      id: 6,
      title: "Smart Agriculture IoT Platform",
      description:
        "Building an IoT-based platform for precision agriculture that monitors soil conditions, weather patterns, and crop health.",
      image: null,
      status: "Completed",
      category: "Agricultural Engineering",
      startDate: "Sep 2023",
      students: [
        {
          name: "Carlos Rodriguez",
          avatar: null,
          department: "Agricultural Engineering",
        },
        {
          name: "Nina Patel",
          avatar: null,
          department: "Computer Engineering",
        },
      ],
      professors: [
        {
          name: "Dr. Thomas Green",
          avatar: null,
          department: "Agriculture",
        },
      ],
      papers: [],
      media: [],
    },
  ];

  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  // TODO: Implement actual filtering logic with database queries
  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || project.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter dropdown
  // TODO: Fetch categories from database
  const categories = ["all", ...new Set(mockProjects.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="w-full py-6 px-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 text-neon-cyan" />
                Collaborator Hub
              </h1>
              <p className="text-muted-foreground">
                Discover and collaborate on research projects with students and professors
              </p>
            </div>
            {/* TODO: Add project creation functionality */}
            <Button className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold hover:shadow-lg hover:shadow-neon-cyan/20 transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search projects by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-cyber-darker/50 border-cyber-border focus:border-neon-cyan"
                  />
                </div>

                {/* Category Filter */}
                <div className="w-full md:w-64">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-cyber-darker/50 border-cyber-border">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent className="bg-cyber-card border-cyber-border">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {/* Responsive grid: 1 column on mobile, 2 columns on normal screens, 3 on large screens */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onViewProject={handleViewProject}
              />
            ))}
          </div>
        ) : (
          <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to create a collaborative project!"}
              </p>
              {/* TODO: Wire up create project button */}
              <Button className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="mt-8 border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Hub Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-cyan">
                  {mockProjects.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-purple">
                  {mockProjects.filter((p) => p.status === "Active").length}
                </p>
                <p className="text-sm text-muted-foreground">Active Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-cyan">
                  {new Set(mockProjects.flatMap((p) => p.students.map((s) => s.name)))
                    .size}
                </p>
                <p className="text-sm text-muted-foreground">Student Collaborators</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neon-purple">
                  {
                    new Set(mockProjects.flatMap((p) => p.professors.map((pr) => pr.name)))
                      .size
                  }
                </p>
                <p className="text-sm text-muted-foreground">Professor Mentors</p>
              </div>
            </div>
            {/* TODO: Add real-time stats from database */}
          </CardContent>
        </Card>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        project={selectedProject}
      />
    </div>
  );
}
