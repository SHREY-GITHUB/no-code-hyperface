import { useState } from 'react'
import LeftPanel from './components/LeftPanel'
import MiddlePanel from './components/MiddlePanel'
import RightPanel from './components/RightPanel'
import PreviewMode from './components/PreviewMode'
import DemoControlsPanel from './components/DemoControlsPanel'
import HomePage from './components/HomePage'
import PublishModal from './components/PublishModal'

/* ─── Initial program catalogue (source of truth) ───────────────────────── */
const INITIAL_PROGRAMS = [
  {
    id: 'hdfc', name: 'HDFC Millenia Card Program', bank: 'HDFC Bank',
    status: 'Draft', stages: 4, enabledStages: 4, lastModified: 'Today, 2:14 PM',
    color: '#2563EB', gradFrom: '#3B82F6', gradTo: '#1D4ED8', bg: '#EFF6FF', initial: 'H',
    applications: '1,247', conversion: '56.0%',
  },
  {
    id: 'slice', name: 'Slice Student Credit Card', bank: 'Slice Fintech',
    status: 'Live', stages: 4, enabledStages: 3, lastModified: 'Yesterday, 11:30 AM',
    color: '#7C3AED', gradFrom: '#8B5CF6', gradTo: '#6D28D9', bg: '#F5F3FF', initial: 'S',
    applications: '3,821', conversion: '61.2%',
  },
  {
    id: 'jupiter', name: 'Jupiter Edge Card', bank: 'Jupiter / Federal Bank',
    status: 'Live', stages: 4, enabledStages: 4, lastModified: 'Apr 10, 2026',
    color: '#059669', gradFrom: '#10B981', gradTo: '#047857', bg: '#ECFDF5', initial: 'J',
    applications: '2,156', conversion: '58.4%',
  },
]

const initialStages = [
  { id: 1, name: 'Application Form',     enabled: true },
  { id: 2, name: 'Bureau & Decisioning', enabled: true },
  { id: 3, name: 'KYC Verification',     enabled: true },
  { id: 4, name: 'Agreement & Consent',  enabled: true },
]

const initialFields = [
  { id: 1, name: 'Full Name',        type: 'Text',     show: true, required: true, hint: null,                                                            page: 1 },
  { id: 2, name: 'Date of Birth',    type: 'Date',     show: true, required: true, hint: 'Applicant must be 21 to 65 years old',                         page: 1 },
  { id: 3, name: 'Employment Type',  type: 'Dropdown', show: true, required: true, hint: 'Options: Salaried, Self-Employed, Business Owner',              page: 1 },
  { id: 4, name: 'Mobile Number',    type: 'Text',     show: true, required: true, hint: 'OTP verification triggered automatically',                      page: 2 },
  { id: 5, name: 'PAN Number',       type: 'Text',     show: true, required: true, hint: 'Format: AAAAA9999A — validated automatically',                  page: 2 },
  { id: 6, name: 'Monthly Income',   type: 'Number',   show: true, required: true, hint: 'Minimum value configurable in Validation Rules tab',            page: 2 },
]

const initialKycMethods = [
  { id: 1, name: 'Aadhaar OTP',   enabled: true,  desc: 'Instant verification via Aadhaar-linked mobile OTP.' },
  { id: 2, name: 'Video KYC',     enabled: false, desc: 'Live video call with a KYC agent.' },
  { id: 3, name: 'DigiLocker',    enabled: true,  desc: 'Fetch documents directly from government DigiLocker.' },
  { id: 4, name: 'Manual Upload', enabled: false, desc: 'Applicant uploads physical document photos.' },
]

export default function App() {
  const [homePage, setHomePage]         = useState(true)
  const [publishOpen, setPublishOpen]   = useState(false)
  const [selectedStage, setSelectedStage] = useState(null)
  const [stages, setStages]             = useState(initialStages)
  const [fields, setFields]             = useState(initialFields)
  const [kycMethods, setKycMethods]     = useState(initialKycMethods)
  const [previewOpen, setPreviewOpen]   = useState(false)
  const [analyticsOpen, setAnalyticsOpen] = useState(false)
  const [clientId, setClientId]         = useState('hdfc')
  const [menuOpen, setMenuOpen]         = useState(false)
  const [programs, setPrograms]         = useState(INITIAL_PROGRAMS)
  const [activeProgramName, setActiveProgramName] = useState(null)
  const [demoControls, setDemoControls] = useState({
    bureauFailure: false,
    manualReview: false,
    lowScoreDecline: false,
  })

  /* Open editor — clientId is the journey template ('hdfc'|'slice'|'jupiter'),
     customName overrides the breadcrumb label (used for user-created programs). */
  function openEditor(id, customName = null) {
    setClientId(id)
    setActiveProgramName(customName)
    setHomePage(false)
  }

  function addProgram(prog) {
    setPrograms(ps => [...ps, prog])
  }

  /* Close drawer when a stage is selected on mobile */
  function handleSelectStage(name) {
    setSelectedStage(name)
    setMenuOpen(false)
  }

  if (homePage) {
    return <HomePage onOpen={openEditor} programs={programs} onAddProgram={addProgram} />
  }

  return (
    <>
      {previewOpen && (
        <PreviewMode
          fields={fields}
          kycMethods={kycMethods}
          stages={stages}
          clientId={clientId}
          demoControls={demoControls}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      {publishOpen && (
        <PublishModal
          onClose={() => setPublishOpen(false)}
          stages={stages}
          fields={fields}
          kycMethods={kycMethods}
          clientId={clientId}
        />
      )}

      {/* Drawer backdrop — mobile only */}
      <div
        className={`drawer-overlay ${menuOpen ? 'menu-open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className="flex h-screen w-screen overflow-hidden font-sans">
        {/* Left panel — becomes slide-in drawer on mobile */}
        <div className={`left-panel-drawer ${menuOpen ? 'menu-open' : ''}`}>
          <LeftPanel
            stages={stages}
            setStages={setStages}
            selectedStage={selectedStage}
            onSelectStage={handleSelectStage}
            onHome={() => setHomePage(true)}
            onPublish={() => { setPublishOpen(true); setMenuOpen(false) }}
          />
        </div>

        <MiddlePanel
          selectedStage={selectedStage}
          fields={fields} setFields={setFields}
          kycMethods={kycMethods} setKycMethods={setKycMethods}
          onPreviewClick={() => setPreviewOpen(true)}
          clientId={clientId} setClientId={setClientId}
          programName={activeProgramName}
          demoControls={demoControls}
          analyticsOpen={analyticsOpen} setAnalyticsOpen={setAnalyticsOpen}
          onMenuOpen={() => setMenuOpen(true)}
        />

        {/* Right panel — hidden on mobile via CSS */}
        <div className="right-panel-desktop">
          <RightPanel
            selectedStage={selectedStage}
            fields={fields}
            kycMethods={kycMethods}
            stages={stages}
          />
        </div>
      </div>

      {!previewOpen && (
        <div className="demo-panel-wrap">
          <DemoControlsPanel controls={demoControls} onChange={setDemoControls} />
        </div>
      )}
    </>
  )
}
