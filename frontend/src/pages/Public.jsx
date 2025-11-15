import React, {useState} from 'react'

const ARTICLES = [
  {
    id: 'covid',
    title: 'COVID-19: Current Guidance',
    date: 'Nov 2025',
    excerpt: 'Stay up-to-date with local public health guidance: masks in crowded spaces for at-risk groups, testing when symptomatic, and vaccination boosters as recommended.',
    content: `Stay up-to-date with local public health guidance: wear masks in crowded indoor spaces if you or others are at-risk, get tested when symptomatic, and keep up with recommended vaccination and boosters. Seek official local health department sites for case numbers and travel advisories. If you are at higher risk, consider extra precautions and discuss vaccination/booster timing with your healthcare provider.`
  },
  {
    id: 'hygiene',
    title: 'Precautions & Hygiene',
    date: 'Updated',
    excerpt: 'Hand-washing, respiratory etiquette and cleaning high-touch surfaces reduce spread of infections.',
    content: `Regular hand-washing with soap for at least 20 seconds, covering coughs and sneezes, and cleaning high-touch surfaces reduce the spread of many infections. Use alcohol-based hand sanitizer when soap and water aren’t available. Keep personal items separate during illness and ventilate indoor spaces when possible.`
  },
  {
    id: 'sick',
    title: 'What to Do If You Feel Sick',
    date: 'Guidance',
    excerpt: 'If you have worrying symptoms, rest, isolate when contagious, and contact your healthcare provider.',
    content: `If you have fever, persistent cough, difficulty breathing, or other worrying symptoms: rest, stay hydrated, isolate when contagious, contact your healthcare provider, and follow testing recommendations from local health authorities. Seek urgent care for severe breathing difficulty or altered consciousness.`
  },
  {
    id: 'healthy',
    title: 'Healthy Living Tips',
    date: 'Daily',
    excerpt: 'Small daily habits — diet, exercise and sleep — improve long-term health.',
    content: `Small daily habits improve long-term health: balanced diet, regular physical activity (30 minutes most days), 7–9 hours sleep for adults, and mental health check-ins. Small, consistent changes are more sustainable than drastic ones.`
  },
  {
    id: 'vax',
    title: 'Vaccination & Screening',
    date: 'Important',
    excerpt: 'Routine vaccinations and preventive screenings catch problems early.',
    content: `Routine vaccinations and preventive screenings (blood pressure, cholesterol, age-appropriate cancer screenings) are key to catching problems early. Consult national schedules for recommended vaccines and speak to your provider about personalized screening plans.`
  },
  {
    id: 'resources',
    title: 'Reliable Resources',
    date: 'Links',
    excerpt: 'Trusted sources: health departments, WHO, CDC and peer-reviewed medical sites.',
    content: `Trusted sources: your country’s health department, WHO, CDC (for US-specific), and peer-reviewed medical sites. Avoid unverified remedies and consult professionals before starting treatments found online.`
  }
]

function NewsCard({item, onOpen}){
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={()=>onOpen(item)}
      onKeyDown={(e)=>{ if(e.key === 'Enter') onOpen(item) }}
      className="cursor-pointer group bg-gradient-to-b from-white to-gray-50 hover:from-sky-50 hover:to-white dark:from-slate-800 dark:to-slate-700 border border-gray-100 dark:border-slate-700 rounded-lg p-5 shadow-sm transform transition duration-200 hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-sky-700 group-hover:text-sky-800 dark:text-sky-300">{item.title}</h3>
        <time className="text-xs text-gray-500">{item.date}</time>
      </div>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.excerpt}</p>
      <div className="mt-3 text-sm text-sky-600 font-medium">Read more →</div>
    </div>
  )
}

function Modal({item, onClose}){
  if(!item) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative max-w-3xl w-full mx-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl overflow-hidden transform transition-all scale-100">
          <div className="flex justify-between items-start p-5 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h3 className="text-xl font-bold text-sky-700 dark:text-sky-300">{item.title}</h3>
              <time className="text-xs text-gray-500">{item.date}</time>
            </div>
            <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">✕</button>
          </div>
          <div className="p-6 text-gray-800 dark:text-gray-200 leading-7">
            <p>{item.content}</p>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-slate-700 text-right">
            <button onClick={onClose} className="px-4 py-2 bg-sky-600 text-white rounded-md">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Public(){
  const [active, setActive] = useState(null)

  return (
    <div>
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold text-blue-900 dark:text-sky-700">Public Health & News</h2>
        <p className="text-sm text-black dark:text-sky-400 mt-1">Latest public advisories, precautions and general health facts — click any item to read more.</p>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {ARTICLES.map(item => (
          <NewsCard key={item.id} item={item} onOpen={(it)=>setActive(it)} />
        ))}
      </section>

      <Modal item={active} onClose={()=>setActive(null)} />
    </div>
  )
}
