import React, {useState} from 'react'

const DOCTORS = [
  {
    id: 'd1',
    name: 'Dr. Asha Mehra',
    qualification: 'MBBS, MD (Internal Medicine)',
    specialization: 'General Physician',
    field: 'Internal Medicine',
    college: 'AIIMS',
    experience: 12,
    contact: '+91-9876543210',
    email: 'asha.m@hospital.example',
    bio: 'Experienced internal medicine specialist focusing on adult care, chronic disease management and preventive health.',
    availability: 'Mon, Wed, Fri — 10:00 AM - 2:00 PM',
    languages: ['English','Hindi']
  },
  {
    id: 'd2',
    name: 'Dr. Rohit Kapoor',
    qualification: 'MBBS, MS (Orthopedics)',
    specialization: 'Orthopedic',
    field: 'Orthopedics & Joint Replacement',
    college: 'PGIMER',
    experience: 8,
    contact: '+91-9123456780',
    email: 'rohit.k@hospital.example',
    bio: 'Orthopedic surgeon with interest in sports injuries and minimally invasive joint surgeries.',
    availability: 'Tue, Thu — 3:00 PM - 7:00 PM',
    languages: ['English','Hindi']
  },
  {
    id: 'd3',
    name: 'Dr. Nisha Verma',
    qualification: 'MBBS, DNB (Pediatrics)',
    specialization: 'Pediatrician',
    field: 'Child Health',
    college: 'SGPGI',
    experience: 6,
    contact: '+91-9988776655',
    email: 'nisha.v@hospital.example',
    bio: 'Pediatrician providing preventive, acute and developmental care for infants and children.',
    availability: 'Mon-Fri — 9:00 AM - 12:00 PM',
    languages: ['English','Hindi']
  }
]

function DocCard({d, onOpen}){
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4 border border-gray-100">
      <div className="w-14 h-14 bg-sky-100 text-sky-700 flex items-center justify-center rounded-full font-semibold">{d.name.split(' ').slice(1,2)[0]?.[0] || d.name[0]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 truncate">{d.name}</h3>
          <div className="text-sm text-slate-500">{d.experience} yrs</div>
        </div>
        <p className="text-sm text-slate-600">{d.qualification} • {d.specialization}</p>
        <p className="text-sm text-gray-500 mt-1 truncate">{d.field} · {d.college}</p>
      </div>
      <div className="flex-shrink-0">
        <button onClick={()=>onOpen(d)} className="px-3 py-2 bg-sky-600 text-white rounded-md">View</button>
      </div>
    </div>
  )
}

function Modal({d, onClose}){
  if(!d) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-w-3xl w-full mx-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{d.name}</h2>
                <p className="text-sm text-slate-600 mt-1">{d.qualification} • {d.specialization}</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-slate-600 font-medium">About</h4>
              <p className="mt-2 text-slate-700">{d.bio}</p>

              <h4 className="text-sm text-slate-600 font-medium mt-4">Education</h4>
              <p className="mt-1 text-slate-700">{d.college}</p>

              <h4 className="text-sm text-slate-600 font-medium mt-4">Languages</h4>
              <p className="mt-1 text-slate-700">{d.languages.join(', ')}</p>
            </div>

            <div>
              <h4 className="text-sm text-slate-600 font-medium">Contact</h4>
              <p className="mt-2 text-slate-700">Phone: <a href={`tel:${d.contact}`} className="text-sky-600">{d.contact}</a></p>
              <p className="mt-1 text-slate-700">Email: <a href={`mailto:${d.email}`} className="text-sky-600">{d.email}</a></p>

              <h4 className="text-sm text-slate-600 font-medium mt-4">Experience</h4>
              <p className="mt-1 text-slate-700">{d.experience} years</p>

              <h4 className="text-sm text-slate-600 font-medium mt-4">Availability</h4>
              <p className="mt-1 text-slate-700">{d.availability}</p>

              <div className="mt-6">
                <button className="px-4 py-2 bg-sky-600 text-white rounded-md mr-2">Book Appointment</button>
                <button onClick={()=>window.open(`mailto:${d.email}`)} className="px-4 py-2 border border-slate-200 rounded-md">Message</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function Doctors(){
  const [active, setActive] = useState(null)
  const [query, setQuery] = useState('')

  const filtered = DOCTORS.filter(d => (
    d.name.toLowerCase().includes(query.toLowerCase()) ||
    d.specialization.toLowerCase().includes(query.toLowerCase()) ||
    d.qualification.toLowerCase().includes(query.toLowerCase())
  ))

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Doctors Directory</h2>
        <p className="text-sm text-slate-600">Browse doctors and view full profiles.</p>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by name, specialization or qualification" className="flex-1 px-4 py-2 rounded border border-gray-200" />
      </div>

      <div className="space-y-3">
        {filtered.map(d => (
          <DocCard key={d.id} d={d} onOpen={(doc)=>setActive(doc)} />
        ))}
        {filtered.length === 0 && <div className="text-sm text-gray-500">No doctors found.</div>}
      </div>

      <Modal d={active} onClose={()=>setActive(null)} />
    </div>
  )
}