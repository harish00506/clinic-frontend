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
import { ArrowLeft, CalendarPlus, Calendar, Clock, User } from 'lucide-react'
import Link from "next/link"

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  doctorName: string
  doctorSpecialization: string
  date: string
  time: string
  status: "booked" | "completed" | "cancelled" | "rescheduled"
  type: "appointment" | "follow_up"
}

interface Doctor {
  id: string
  name: string
  specialization: string
  availableSlots: string[]
}

export default function AppointmentManagement() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "Alice Brown",
      patientPhone: "+1234567893",
      doctorName: "Dr. Smith",
      doctorSpecialization: "Cardiology",
      date: "2024-01-15",
      time: "10:00 AM",
      status: "booked",
      type: "appointment"
    },
    {
      id: "2",
      patientName: "Bob Wilson",
      patientPhone: "+1234567894",
      doctorName: "Dr. Johnson",
      doctorSpecialization: "Dermatology",
      date: "2024-01-15",
      time: "11:30 AM",
      status: "completed",
      type: "follow_up"
    },
    {
      id: "3",
      patientName: "Carol Davis",
      patientPhone: "+1234567895",
      doctorName: "Dr. Williams",
      doctorSpecialization: "Pediatrics",
      date: "2024-01-15",
      time: "02:00 PM",
      status: "booked",
      type: "appointment"
    }
  ])

  const [doctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. Smith",
      specialization: "Cardiology",
      availableSlots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
    },
    {
      id: "2",
      name: "Dr. Johnson",
      specialization: "Dermatology",
      availableSlots: ["09:30 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"]
    },
    {
      id: "3",
      name: "Dr. Williams",
      specialization: "Pediatrics",
      availableSlots: ["08:00 AM", "09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"]
    }
  ])

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientPhone: "",
    doctorId: "",
    date: "",
    time: "",
    type: "appointment" as "appointment" | "follow_up"
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const bookAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.patientPhone || !newAppointment.doctorId || !newAppointment.date || !newAppointment.time) return

    const selectedDoctor = doctors.find(d => d.id === newAppointment.doctorId)
    if (!selectedDoctor) return

    const appointment: Appointment = {
      id: Date.now().toString(),
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      date: newAppointment.date,
      time: newAppointment.time,
      status: "booked",
      type: newAppointment.type
    }

    setAppointments([...appointments, appointment])
    
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      doctorId: "",
      date: "",
      time: "",
      type: "appointment"
    })
    setIsDialogOpen(false)
  }

  const updateAppointmentStatus = (id: string, status: Appointment["status"]) => {
    setAppointments(appointments.map(a => 
      a.id === id ? { ...a, status } : a
    ))
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "booked":
        return <Badge variant="default">Booked</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "rescheduled":
        return <Badge variant="secondary">Rescheduled</Badge>
    }
  }

  const getTypeBadge = (type: Appointment["type"]) => {
    return type === "follow_up" ? 
      <Badge variant="secondary">Follow-up</Badge> : 
      <Badge variant="outline">New</Badge>
  }

  const bookedCount = appointments.filter(a => a.status === "booked").length
  const completedCount = appointments.filter(a => a.status === "completed").length
  const cancelledCount = appointments.filter(a => a.status === "cancelled").length

  const selectedDoctor = doctors.find(d => d.id === newAppointment.doctorId)

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
            <h1 className="text-xl font-semibold text-gray-900 ml-4">Appointment Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Booked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{bookedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage patient appointments and schedules</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book New Appointment</DialogTitle>
                    <DialogDescription>
                      Schedule a new appointment for a patient.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input
                        id="patientName"
                        value={newAppointment.patientName}
                        onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="patientPhone">Phone Number</Label>
                      <Input
                        id="patientPhone"
                        value={newAppointment.patientPhone}
                        onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="doctor">Doctor</Label>
                      <Select value={newAppointment.doctorId} onValueChange={(value) => setNewAppointment({ ...newAppointment, doctorId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="time">Time</Label>
                      <Select value={newAppointment.time} onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedDoctor?.availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Appointment Type</Label>
                      <Select value={newAppointment.type} onValueChange={(value: "appointment" | "follow_up") => setNewAppointment({ ...newAppointment, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="appointment">New Appointment</SelectItem>
                          <SelectItem value="follow_up">Follow-up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={bookAppointment}>Book Appointment</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.patientName}</TableCell>
                    <TableCell>{appointment.patientPhone}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.doctorName}</div>
                        <div className="text-sm text-gray-500">{appointment.doctorSpecialization}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(appointment.type)}</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {appointment.status === "booked" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            >
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {appointment.status === "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "booked")}
                          >
                            Rebook
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
