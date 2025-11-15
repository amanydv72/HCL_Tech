import React, {useState} from 'react'

function LoginForm({fields, onSubmit, title, submitText}){
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

export default function Login(){
  const [tab, setTab] = useState('patient')

  const handle = (role) => (data) => {
    console.log('Login', role, data)
    alert(`${role} login submitted — check console`)
  }

  return (
    <div>
      <div className="flex space-x-2">
        <button onClick={()=>setTab('patient')} className={tab==='patient' ? 'px-4 py-2 rounded bg-blue-600 text-white' : 'px-4 py-2 rounded bg-white border'}>Patient</button>
        <button onClick={()=>setTab('doctor')} className={tab==='doctor' ? 'px-4 py-2 rounded bg-blue-600 text-white' : 'px-4 py-2 rounded bg-white border'}>Doctor</button>
        <button onClick={()=>setTab('admin')} className={tab==='admin' ? 'px-4 py-2 rounded bg-blue-600 text-white' : 'px-4 py-2 rounded bg-white border'}>Admin</button>
      </div>

      {tab === 'patient' && <LoginForm title="Patient Login" submitText="Login as Patient" onSubmit={handle('patient')} fields={[{name:'email',label:'Email',type:'email',required:true},{name:'password',label:'Password',type:'password',required:true}]} />}
      {tab === 'doctor' && <LoginForm title="Doctor Login" submitText="Login as Doctor" onSubmit={handle('doctor')} fields={[{name:'email',label:'Email',type:'email',required:true},{name:'password',label:'Password',type:'password',required:true}]} />}
      {tab === 'admin' && <LoginForm title="Admin Login" submitText="Login as Admin" onSubmit={handle('admin')} fields={[{name:'username',label:'Username',required:true},{name:'password',label:'Password',type:'password',required:true}]} />}
    </div>
  )
}
