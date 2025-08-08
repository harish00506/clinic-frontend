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
import { ArrowLeft, UserPlus, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from "next/link"

interface QueuePatient {
  id: string
  queueNumber: number
  name: string
  phone: string
  status: "waiting" | "with_doctor" | "completed"
  timeAdded: string
  priority: "normal" | "urgent"
}

export default function QueueManagement() {
  const router = useRouter()
  const [patients, setPatients] = useState<QueuePatient[]>([
    {
      id: "1",
      queueNumber: 1,
      name: "John Smith",
      phone: "+1234567890",
      status: "with_doctor",
      timeAdded: "09:30 AM",
      priority: "normal"
    },
    {
      id: "2",
      queueNumber: 2,
      name: "Sarah Johnson",
      phone: "+1234567891",
      status: "waiting",
      timeAdded: "09:45 AM",
      priority: "urgent"
    },
    {
      id: "3",
      queueNumber: 3,
      name: "Mike Davis",
      phone: "+1234567892",
      status: "waiting",
      timeAdded: "10:15 AM",
      priority: "normal"
    }
  ])

  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    priority: "normal" as "normal" | "urgent"
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const addPatient = () => {
    if (!newPatient.name || !newPatient.phone) return

    const nextQueueNumber = Math.max(...patients.map(p => p.queueNumber)) + 1
    const patient: QueuePatient = {
      id: Date.now().toString(),
      queueNumber: nextQueueNumber,
      name: newPatient.name,
      phone: newPatient.phone,
      status: "waiting",
      timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: newPatient.priority
    }

    setPatients([...patients, patient])
    setNewPatient({ name: "", phone: "", priority: "normal" })
    setIsDialogOpen(false)
  }

  const updatePatientStatus = (id: string, status: QueuePatient["status"]) => {
    setPatients(patients.map(p => 
      p.id === id ? { ...p, status } : p
    ))
  }

  const getStatusBadge = (status: QueuePatient["status"]) => {
    switch (status) {
      case "waiting":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Waiting</Badge>
      case "with_doctor":
        return <Badge variant="default"><AlertCircle className="h-3 w-3 mr-1" />With Doctor</Badge>
      case "completed":
        return <Badge variant="outline"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
    }
  }

  const getPriorityBadge = (priority: QueuePatient["priority"]) => {
    return priority === "urgent" ? 
      <Badge variant="destructive">Urgent</Badge> : 
      <Badge variant="outline">Normal</Badge>
  }

  const waitingCount = patients.filter(p => p.status === "waiting").length
  const withDoctorCount = patients.filter(p => p.status === "with_doctor").length
  const completedCount = patients.filter(p => p.status === "completed").length

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
            <h1 className="text-xl font-semibold text-gray-900 ml-4">Queue Management</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{waitingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">With Doctor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{withDoctorCount}</div>
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
        </div>

        {/* Queue Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Patient Queue</CardTitle>
                <CardDescription>Manage walk-in patients and their queue status</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Patient to Queue</DialogTitle>
                    <DialogDescription>
                      Enter patient details to add them to the waiting queue.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Patient Name</Label>
                      <Input
                        id="name"
                        value={newPatient.name}
                        onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newPatient.phone}
                        onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newPatient.priority} onValueChange={(value: "normal" | "urgent") => setNewPatient({ ...newPatient, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addPatient}>Add to Queue</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue #</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Time Added</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">#{patient.queueNumber}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{getPriorityBadge(patient.priority)}</TableCell>
                    <TableCell>{patient.timeAdded}</TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {patient.status === "waiting" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePatientStatus(patient.id, "with_doctor")}
                          >
                            Call In
                          </Button>
                        )}
                        {patient.status === "with_doctor" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePatientStatus(patient.id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                        {patient.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePatientStatus(patient.id, "waiting")}
                          >
                            Requeue
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
