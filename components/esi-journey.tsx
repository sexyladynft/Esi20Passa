'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import { jsPDF } from 'jspdf'
import { ArrowLeft, ArrowRight, Check, Download, Eraser, FileText, HelpCircle, LockKeyhole, Pencil, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

const logoUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-W9Dufp1xiUdmPKME6Kmia0Lg4GXltP.png'

const steps = [
  '¿Qué harías si...?',
  'Elegí una decisión',
  '¿Por qué?',
  'Semáforo personal',
  '¿Qué podría pasar?',
  'Probá otra alternativa',
  'Relacioná con los cinco ejes',
  '¿A quién pedirías ayuda?',
  'Cambiá la historia',
  'Reflexión personal',
  'Mi producción final',
]

const modules = [
  ['MV', 'Mitos y verdades', 'Actividad completada'],
  ['QH', '¿Qué harías si...?', 'Reflexiones completadas'],
  ['MV', 'Mural de los vínculos', 'Producción realizada'],
  ['ESI', 'La ESI en una palabra', 'Actividad completada'],
  ['DE', 'Desafío ESI', 'Actividad completada'],
  ['20', 'Nuestra historia / 20 años de ESI', 'Recorrido completado'],
]

const situations = [
  'En tu grupo de amistades comparten una foto privada sin permiso. ¿Qué harías?',
  'Una persona hace un comentario sobre el cuerpo de otra en el curso. ¿Cómo intervendrías?',
]

type Answers = { [key: string]: string }

export function EsiJourney() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({ name: '', course: '', institution: '', situation: situations[0] })
  const [exported, setExported] = useState(false)

  const update = (key: string, value: string) => setAnswers((current) => ({ ...current, [key]: value }))
  const isFinal = step === steps.length - 1
  const completion = Math.round((step / (steps.length - 1)) * 100)

  const summary = useMemo(() => [
    answers.decision && `Decisión: ${answers.decision}`,
    answers.reason && `Por qué: ${answers.reason}`,
    answers.semaphore && `Semáforo: ${answers.semaphore}`,
    answers.consequences && `Qué podría pasar: ${answers.consequences}`,
    answers.alternative && `Otra alternativa: ${answers.alternative}`,
    answers.axes && `Ejes: ${answers.axes}`,
    answers.support && `Ayuda: ${answers.support}`,
    answers.story && `Nueva historia: ${answers.story}`,
    answers.reflection && `Reflexión: ${answers.reflection}`,
  ].filter(Boolean).join('\n'), [answers])

  const exportPdf = () => {
    const doc = new jsPDF()
    const safeName = (answers.name || 'Estudiante').replace(/[^a-z0-9áéíóúñ ]/gi, '').trim().replace(/\s+/g, '_')
    doc.setFontSize(20)
    doc.setTextColor(24, 95, 20)
    doc.text('ESI 20 AÑOS — Producción final', 20, 24)
    doc.setFontSize(11)
    doc.setTextColor(55, 55, 55)
    doc.text(`Nombre y apellido: ${answers.name || 'Sin completar'}`, 20, 38)
    doc.text(`Curso: ${answers.course || 'Sin completar'}`, 20, 46)
    doc.text(`Institución: ${answers.institution || 'E.E.S.T. N° 6 — Banfield'}`, 20, 54)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 20, 62)
    doc.setFontSize(14)
    doc.setTextColor(24, 95, 20)
    doc.text('Actividades realizadas', 20, 78)
    doc.setFontSize(10)
    doc.setTextColor(55, 55, 55)
    let y = 88
    modules.forEach(([, title, status]) => { doc.text(`✓ ${title} — ${status}`, 24, y); y += 7 })
    doc.setFontSize(14)
    doc.setTextColor(24, 95, 20)
    doc.text('Recorrido ¿Qué harías si...?', 20, y + 10)
    doc.setFontSize(10)
    doc.setTextColor(55, 55, 55)
    const lines = doc.splitTextToSize(summary || 'Todavía no se agregaron respuestas.', 165)
    doc.text(lines, 24, y + 20)
    doc.save(`ESI20AÑOS_${safeName}_${answers.course || 'Curso'}_ProduccionFinal.pdf`)
    setExported(true)
  }

  return (
    <main className="min-h-screen bg-[#f5f8ed] text-[#1f2d1f]">
      <header className="border-b border-[#dce8c5] bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Escuela de Educación Secundaria Técnica N° 6 Banfield" className="size-14 object-contain" />
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4d8d24]">E.E.S.T. N° 6</p><p className="font-serif text-lg tracking-[0.18em] text-[#263125]">BANFIELD</p></div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#eef7df] px-4 py-2 text-sm font-semibold text-[#39721f] sm:flex"><LockKeyhole data-icon="inline-start" /> Tu recorrido se guarda</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="hidden lg:block">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#70905c]">Tu recorrido</p>
          <nav aria-label="Pasos de la experiencia" className="flex flex-col gap-2">
            {steps.map((label, index) => <button key={label} onClick={() => setStep(index)} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${index === step ? 'bg-[#dff0bd] font-bold text-[#28651e]' : index < step ? 'text-[#528644]' : 'text-[#82907d]'}`}><span className={`flex size-7 items-center justify-center rounded-full text-xs ${index < step ? 'bg-[#70ad35] text-white' : index === step ? 'bg-[#4d972a] text-white' : 'border border-[#cbdab8]'}`}>{index < step ? <Check data-icon="inline-start" /> : index + 1}</span>{label}</button>)}
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-7 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold text-[#5c8750]">Experiencia ESI · paso {step + 1} de {steps.length}</p><div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-[#dce8c5] sm:w-72"><div className="h-full rounded-full bg-[#65a832] transition-all" style={{ width: `${Math.max(completion, 5)}%` }} /></div></div><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#4d8d24] shadow-sm">{completion}%</span></div>
          {isFinal ? <FinalScreen answers={answers} exported={exported} onExport={exportPdf} /> : <><StepScreen step={step} answers={answers} update={update} /><DrawingPad /></>}
          <div className="mt-8 flex justify-between gap-3"><Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}><ArrowLeft data-icon="inline-start" /> Anterior</Button>{!isFinal && <Button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} className="bg-[#438c28] text-white hover:bg-[#34751e]">Guardar y continuar <ArrowRight data-icon="inline-end" /></Button>}</div>
        </section>
      </div>
    </main>
  )
}

function StepScreen({ step, answers, update }: { step: number; answers: Answers; update: (key: string, value: string) => void }) {
  const fields = [
    { key: 'situation', label: 'Situación para pensar', type: 'situation' },
    { key: 'decision', label: '¿Qué decisión tomarías?', type: 'textarea' },
    { key: 'reason', label: 'Contanos por qué', type: 'textarea' },
    { key: 'semaphore', label: '¿Cómo te hace sentir? Elegí un color y explicá', type: 'textarea' },
    { key: 'consequences', label: '¿Qué podría pasar?', type: 'textarea' },
    { key: 'alternative', label: 'Probá otra alternativa posible', type: 'textarea' },
    { key: 'axes', label: 'Relacioná tu respuesta con los cinco ejes de la ESI', type: 'textarea' },
    { key: 'support', label: '¿A quién pedirías ayuda?', type: 'textarea' },
    { key: 'story', label: 'Cambiá la historia: imaginá un final diferente', type: 'textarea' },
    { key: 'reflection', label: '¿Qué te llevás de este recorrido?', type: 'textarea' },
  ]
  const field = fields[step]
  return <div className="rounded-3xl border border-[#dce8c5] bg-white p-6 shadow-[0_14px_40px_rgba(57,94,34,0.08)] sm:p-10"><div className="mb-8 flex items-start gap-4"><div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5d7] text-[#438c28]"><Sparkles data-icon="inline-start" /></div><div><h1 className="font-serif text-3xl leading-tight text-[#254623] sm:text-4xl">{field.label}</h1><p className="mt-2 text-[#71806d]">Podés volver atrás y cambiar tu respuesta cuando quieras.</p></div></div>{step === 0 && <div className="mb-6 grid gap-4 sm:grid-cols-3"><label className="text-sm font-bold text-[#4d6b45]">Nombre y apellido<input value={answers.name || ''} onChange={(e) => update('name', e.target.value)} className="mt-2 w-full rounded-xl border border-[#cdddbd] bg-[#fbfdf8] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#80b957]" placeholder="Tu nombre" /></label><label className="text-sm font-bold text-[#4d6b45]">Curso<input value={answers.course || ''} onChange={(e) => update('course', e.target.value)} className="mt-2 w-full rounded-xl border border-[#cdddbd] bg-[#fbfdf8] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#80b957]" placeholder="Ej. 4° 2°" /></label><label className="text-sm font-bold text-[#4d6b45]">Institución<input value={answers.institution || ''} onChange={(e) => update('institution', e.target.value)} className="mt-2 w-full rounded-xl border border-[#cdddbd] bg-[#fbfdf8] px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#80b957]" placeholder="E.E.S.T. N° 6" /></label></div>}{field.type === 'situation' ? <div className="flex flex-col gap-5"><p className="rounded-2xl bg-[#f1f8e6] p-5 text-lg leading-relaxed text-[#365532]">{answers.situation}</p><label className="text-sm font-bold text-[#4d6b45]" htmlFor="situation-select">Elegí otra situación</label><select id="situation-select" value={answers.situation} onChange={(e) => update('situation', e.target.value)} className="rounded-xl border border-[#cdddbd] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#80b957]"><option>{situations[0]}</option><option>{situations[1]}</option></select></div> : <textarea id={field.key} aria-label={field.label} value={answers[field.key] || ''} onChange={(e) => update(field.key, e.target.value)} placeholder="Escribí tus ideas acá..." className="min-h-44 w-full resize-y rounded-2xl border border-[#cdddbd] bg-[#fbfdf8] p-5 text-base leading-relaxed outline-none transition placeholder:text-[#a0ae98] focus:border-[#6aa53d] focus:ring-4 focus:ring-[#e6f3d7]" />}</div>
}

function DrawingPad() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil')
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.fillStyle = '#fffef9'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.lineCap = 'round'
    context.lineJoin = 'round'
  }, [])

  const pointFromEvent = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const bounds = canvas.getBoundingClientRect()
    return {
      x: (event.clientX - bounds.left) * (canvas.width / bounds.width),
      y: (event.clientY - bounds.top) * (canvas.height / bounds.height),
    }
  }

  const startDrawing = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const point = pointFromEvent(event)
    if (!context || !point) return
    drawing.current = true
    canvas?.setPointerCapture(event.pointerId)
    context.beginPath()
    context.moveTo(point.x, point.y)
  }

  const draw = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const context = canvasRef.current?.getContext('2d')
    const point = pointFromEvent(event)
    if (!context || !point) return
    context.strokeStyle = tool === 'eraser' ? '#fffef9' : '#315b2d'
    context.lineWidth = tool === 'eraser' ? 24 : 3
    context.lineTo(point.x, point.y)
    context.stroke()
  }

  return <div className="mt-6 rounded-3xl border border-[#dce8c5] bg-[#fbfdf8] p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-serif text-2xl text-[#315b2d]">Tu plantilla</h2><p className="text-sm text-[#71806d]">Dibujá o escribí una idea con el lápiz.</p></div>
      <div className="flex gap-2" role="toolbar" aria-label="Herramientas de dibujo">
        <Button type="button" variant={tool === 'pencil' ? 'default' : 'outline'} onClick={() => setTool('pencil')} aria-label="Usar lápiz"><Pencil data-icon="inline-start" /> Lápiz</Button>
        <Button type="button" variant={tool === 'eraser' ? 'default' : 'outline'} onClick={() => setTool('eraser')} aria-label="Usar goma"><Eraser data-icon="inline-start" /> Goma</Button>
      </div>
    </div>
    <canvas ref={canvasRef} width={1200} height={360} onPointerDown={startDrawing} onPointerMove={draw} onPointerUp={() => { drawing.current = false }} onPointerCancel={() => { drawing.current = false }} className="h-56 w-full touch-none rounded-2xl border border-dashed border-[#cdddbd] bg-[#fffef9]" aria-label="Lienzo de la plantilla" />
  </div>
}

function FinalScreen({ answers, exported, onExport }: { answers: Answers; exported: boolean; onExport: () => void }) {
  return <div className="rounded-3xl border border-[#cbe1a9] bg-white p-6 shadow-[0_14px_40px_rgba(57,94,34,0.1)] sm:p-10"><div className="mb-8 max-w-2xl"><div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#dff0bd] text-[#39721f]"><Check data-icon="inline-start" /></div><p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#609849]">Final — Mi producción</p><h1 className="font-serif text-4xl leading-tight text-[#254623] sm:text-5xl">¡Terminaste el recorrido!</h1><p className="mt-4 text-lg text-[#667762]">Tus ideas, reflexiones y producciones forman parte de esta experiencia.</p></div><div className="mb-8 grid gap-3 sm:grid-cols-2">{modules.map(([icon, title, status]) => <div key={title} className="flex items-center gap-3 rounded-2xl border border-[#e1ead7] bg-[#fbfdf8] p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-[#e5f1d1] text-xs font-black tracking-wide text-[#4d8d24]" aria-hidden="true">{icon}</span><div><p className="font-bold text-[#365532]">{title}</p><p className="text-sm text-[#6f8869]">✓ {status}</p></div></div>)}</div><div className="rounded-2xl bg-[#f1f8e6] p-5"><div className="flex items-start gap-3"><FileText className="mt-1 text-[#4d8d24]" /><div><h2 className="text-lg font-bold text-[#315b2d]">Generar mi producción final</h2><p className="mt-1 text-sm leading-relaxed text-[#6d8068]">Reunimos tus producciones en un único PDF listo para descargar y subir a Google Classroom.</p></div></div><Button onClick={onExport} className="mt-5 w-full bg-[#438c28] text-white hover:bg-[#34751e] sm:w-auto"><Download data-icon="inline-start" /> Descargar producción completa · PDF</Button>{exported && <p className="mt-3 text-sm font-semibold text-[#438c28]">Tu producción final fue generada correctamente.</p>}</div><div className="mt-6 flex items-center gap-2 text-sm text-[#7c8e78]"><HelpCircle data-icon="inline-start" /> No hay descargas en los módulos individuales: todo se guarda en tu recorrido.</div></div>
}

export { logoUrl }

// La insignia provista muestra un escudo verde y amarillo con las iniciales de la escuela.
