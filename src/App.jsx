import { useState } from 'react'
import LeftPanel from './components/LeftPanel'
import MiddlePanel from './components/MiddlePanel'
import RightPanel from './components/RightPanel'
import PreviewMode from './components/PreviewMode'
import DemoControlsPanel from './components/DemoControlsPanel'
import HomePage from './components/HomePage'
import PublishModal from './components/PublishModal'

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
  const [demoControls, setDemoControls] = useState({
    bureauFailure: false,
    manualReview: false,
    lowScoreDecline: false,
  })

  /* Open editor for a specific client */
  function openEditor(id) {
    setClientId(id)
    setHomePage(false)
  }

  if (homePage) {
    return <HomePage onOpen={openEditor} />
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
      <div className="flex h-screen w-screen overflow-hidden font-sans">
        <LeftPanel
          stages={stages}
          setStages={setStages}
          selectedStage={selectedStage}
          onSelectStage={setSelectedStage}
          onHome={() => setHomePage(true)}
          onPublish={() => setPublishOpen(true)}
        />
        <MiddlePanel
          selectedStage={selectedStage}
          fields={fields} setFields={setFields}
          kycMethods={kycMethods} setKycMethods={setKycMethods}
          onPreviewClick={() => setPreviewOpen(true)}
          clientId={clientId} setClientId={setClientId}
          demoControls={demoControls}
          analyticsOpen={analyticsOpen} setAnalyticsOpen={setAnalyticsOpen}
        />
        <RightPanel
          selectedStage={selectedStage}
          fields={fields}
          kycMethods={kycMethods}
          stages={stages}
        />
      </div>
      {!previewOpen && (
        <DemoControlsPanel controls={demoControls} onChange={setDemoControls} />
      )}
    </>
  )
}
