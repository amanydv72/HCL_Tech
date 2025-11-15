import React, {useState} from 'react'

function FormSection({title, fields, onSubmit, submitText}){
  return (
    <div className="bg-white rounded shadow p-6 mt-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <form onSubmit={(e)=>{e.preventDefault(); const data = Object.fromEntries(new FormData(e.target).entries()); onSubmit(data)}}>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input name={f.name} type={f.type || 'text'} required={!!f.required} className="w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2" />
            </div>
          ))}

          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{submitText}</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function Register(){
  const [tab, setTab] = useState('patient')

  const handleSubmit = (role) => (data) => {
    console.log('Register', role, data)
    alert(`${role} registration submitted — check console`)
  }

  return (
    <div>
      <div className="flex space-x-2">
        <button onClick={()=>setTab('patient')} className={tab==='patient' ? 'px-4 py-2 rounded bg-blue-600 text-white' : 'px-4 py-2 rounded bg-white border'}>Patient</button>
        <button onClick={()=>setTab('doctor')} className={tab==='doctor' ? 'px-4 py-2 rounded bg-blue-600 text-white' : 'px-4 py-2 rounded bg-white border'}>Doctor</button>
      </div>

      {tab === 'patient' && (
        <FormSection
          title="Patient Registration"
          submitText="Register Patient"
          onSubmit={handleSubmit('patient')}
          fields={[{name:'name',label:'Name',required:true},{name:'email',label:'Email',type:'email',required:true},{name:'password',label:'Password',type:'password',required:true},{name:'dob',label:'Date of Birth',type:'date'}]}
        />
      )}

      {tab === 'doctor' && (
        <FormSection
          title="Doctor Registration"
          submitText="Register Doctor"
          onSubmit={handleSubmit('doctor')}
          fields={[{name:'name',label:'Name',required:true},{name:'email',label:'Email',type:'email',required:true},{name:'password',label:'Password',type:'password',required:true},{name:'specialization',label:'Specialization'},{name:'license',label:'License No.'}]}
        />
      )}
    </div>
  )
}
