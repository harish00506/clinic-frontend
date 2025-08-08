"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, UserPlus, Search, Stethoscope, MapPin, Clock } from 'lucide-react'
import Link from "next/link"

interface Doctor {
  id: string
  name: string
  specialization: string
  gender: "male" | "female"
  location: string
  phone: string
  email: string
  availability: "available" | "busy" | "off_duty"
  experience: string
  workingHours: string
}

export default function DoctorManagement() {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. John Smith",
      specialization: "Cardiology",
      gender: "male",
      location: "Building A, Floor 2",
      phone: "+1234567890",
      email: "john.smith@clinic.com",
      availability: "available",
      experience: "15 years",
      workingHours: "9:00 AM - 5:00 PM"
    },
    {
      id: "2",
      name: "Dr. Sarah Johnson",
      specialization: "Dermatology",
      gender: "female",
      location: "Building B, Floor 1",
      phone: "+1234567891",
      email: "sarah.johnson@clinic.com",
      availability: "busy",
      experience: "12 years",
      workingHours: "8:00 AM - 4:00 PM"
    },
    {
      id: "3",
      name: "Dr. Michael Williams",
      specialization: "Pediatrics",
      gender: "male",
      location: "Building A, Floor 3",
      phone: "+1234567892",
      email: "michael.williams@clinic.com",
      availability: "available",
      experience: "8 years",
      workingHours: "10:00 AM - 6:00 PM"
    },
    {
      id: "4",
      name: "Dr. Emily Davis",
      specialization: "Orthopedics",
      gender: "female",
      location: "Building C, Floor 2",
      phone: "+1234567893",
      email: "emily.davis@clinic.com",
      availability: "off_duty",
      experience: "20 years",
      workingHours: "9:00 AM - 3:00 PM"
    }
  ])

  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(doctors)
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    gender: "male" as "male" | "female",
    location: "",
    phone: "",
    email: "",
    experience: "",
    workingHours: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (specializationFilter !== "all") {
      filtered = filtered.filter(doctor => doctor.specialization === specializationFilter)
    }

    if (availabilityFilter !== "all") {
      filtered = filtered.filter(doctor => doctor.availability === availabilityFilter)
    }

    setFilteredDoctors(filtered)
  }, [doctors, searchTerm, specializationFilter, availabilityFilter])

  const addDoctor = () => {
    if (!newDoctor.name || !newDoctor.specialization || !newDoctor.location || !newDoctor.phone || !newDoctor.email) return

    const doctor: Doctor = {
      id: Date.now().toString(),
      ...newDoctor,
      availability: "available"
    }

    setDoctors([...doctors, doctor])
    setNewDoctor({
      name: "",
      specialization: "",
      gender: "male",
      location: "",
      phone: "",
      email: "",
      experience: "",
      workingHours: ""
    })
    setIsDialogOpen(false)
  }

  const updateDoctorAvailability = (id: string, availability: Doctor["availability"]) => {
    setDoctors(doctors.map(d => 
      d.id === id ? { ...d, availability } : d
    ))
  }

  const getAvailabilityBadge = (availability: Doctor["availability"]) => {
    switch (availability) {
      case "available":
        return <Badge variant="default">Available</Badge>
      case "busy":
        return <Badge variant="secondary">Busy</Badge>
      case "off_duty":
        return <Badge variant="outline">Off Duty</Badge>
    }
  }

  const specializations = [...new Set(doctors.map(d => d.specialization))]
  const availableCount = doctors.filter(d => d.availability === "available").length
  const busyCount = doctors.filter(d => d.availability === "busy").length
  const offDutyCount = doctors.filter(d => d.availability === "off_duty").length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 ml-4">Doctor Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Busy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{busyCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Off Duty</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{offDutyCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search and Filter Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="off_duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Doctor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Doctor</DialogTitle>
                    <DialogDescription>
                      Add a new doctor to the clinic system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Doctor Name</Label>
                      <Input
                        id="name"
                        value={newDoctor.name}
                        onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        placeholder="Enter doctor name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={newDoctor.specialization}
                        onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                        placeholder="Enter specialization"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={newDoctor.gender} onValueChange={(value: "male" | "female") => setNewDoctor({ ...newDoctor, gender: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newDoctor.location}
                        onChange={(e) => setNewDoctor({ ...newDoctor, location: e.target.value })}
                        placeholder="Enter location"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newDoctor.phone}
                        onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newDoctor.email}
                        onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        value={newDoctor.experience}
                        onChange={(e) => setNewDoctor({ ...newDoctor, experience: e.target.value })}
                        placeholder="e.g., 10 years"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="workingHours">Working Hours</Label>
                      <Input
                        id="workingHours"
                        value={newDoctor.workingHours}
                        onChange={(e) => setNewDoctor({ ...newDoctor, workingHours: e.target.value })}
                        placeholder="e.g., 9:00 AM - 5:00 PM"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addDoctor}>Add Doctor</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Profiles</CardTitle>
            <CardDescription>Manage doctor information and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.experience} experience</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Stethoscope className="h-4 w-4 mr-2 text-blue-600" />
                        {doctor.specialization}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {doctor.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{doctor.phone}</div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {doctor.workingHours}
                      </div>
                    </TableCell>
                    <TableCell>{getAvailabilityBadge(doctor.availability)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {doctor.availability === "available" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDoctorAvailability(doctor.id, "busy")}
                          >
                            Set Busy
                          </Button>
                        )}
                        {doctor.availability === "busy" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDoctorAvailability(doctor.id, "available")}
                          >
                            Set Available
                          </Button>
                        )}
                        {doctor.availability !== "off_duty" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDoctorAvailability(doctor.id, "off_duty")}
                          >
                            Off Duty
                          </Button>
                        )}
                        {doctor.availability === "off_duty" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDoctorAvailability(doctor.id, "available")}
                          >
                            On Duty
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
