import { useState, useEffect, useCallback } from 'react'
import { TimelineProvider } from './context/TimelineContext'
import { SiteProvider, useSites } from './context/SiteContext'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Header from './components/Header'
import SiteList from './components/SiteList'
import MapContainer from './components/MapContainer'
import TimelineSlider from './components/TimelineSlider'
import SitePanel from './components/SitePanel'
import { Site } from './types'

function AppContent() {
  const {
    sites,
    setSites,
    selectedSite,
    setSelectedSite,
    selectedSiteId,
    setSelectedSiteId,
    loading,
    setLoading
  } = useSites()

  const { isDark } = useTheme()

  const [error, setError] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [allSitesData, setAllSitesData] = useState<Site[]>([])

  // Load sites from static JSON on mount
  useEffect(() => {
    async function loadSites() {
      try {
        setLoading(true)
        const res = await fetch('/data/sites.json')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        const sitesData: Site[] = data.sites || []
        setAllSitesData(sitesData)

        // Build summary list for sidebar
        const summaries = sitesData.map(s => ({
          id: s.id,
          name: s.name,
          company: s.company,
          location: s.location,
          status: s.status,
          cadence: s.cadence,
          snapshot_count: s.snapshots?.length || 0,
          latest_mw: s.snapshots?.length
            ? s.snapshots[s.snapshots.length - 1].metrics?.estimated_mw || 0
            : 0,
          percent_complete: s.snapshots?.length
            ? s.snapshots[s.snapshots.length - 1].metrics?.percent_complete || 0
            : 0,
        }))
        setSites(summaries as any)
        setError(null)
      } catch (err) {
        console.error('Failed to load sites:', err)
        setError('Failed to load site data.')
        setSites([])
      } finally {
        setLoading(false)
      }
    }
    loadSites()
  }, [setSites, setLoading])

  // Select site from local data (no API call needed)
  const handleSelectSite = useCallback((siteId: string) => {
    setSelectedSiteId(siteId)
    setShowPanel(true)

    const site = allSitesData.find(s => s.id === siteId)
    if (site) {
      setSelectedSite(site)
    }
  }, [allSitesData, setSelectedSiteId, setSelectedSite])

  const handleClosePanel = useCallback(() => {
    setShowPanel(false)
    setSelectedSite(null)
    setSelectedSiteId(null)
  }, [setSelectedSite, setSelectedSiteId])

  return (
    <div className={`h-screen flex flex-col overflow-hidden theme-transition ${
      isDark ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Site List */}
        <SiteList
          sites={sites}
          loading={loading}
          selectedSiteId={selectedSiteId}
          onSelectSite={handleSelectSite}
        />

        {/* Main Map Area */}
        <main className="flex-1 flex flex-col">
          {/* Error State */}
          {error && (
            <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-50 glass-card-solid px-6 py-4`}>
              <p className="text-red-500 mb-2">{error}</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Check that data files exist in <code className={`px-2 py-1 rounded ${
                  isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}>public/data/</code>
              </p>
            </div>
          )}

          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              sites={sites}
              selectedSiteId={selectedSiteId}
              onSelectSite={handleSelectSite}
            />
          </div>

          {/* Timeline */}
          <TimelineSlider />
        </main>

        {/* Right Panel - Site Details */}
        {showPanel && selectedSite && (
          <SitePanel
            site={selectedSite}
            onClose={handleClosePanel}
          />
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <TimelineProvider>
        <SiteProvider>
          <AppContent />
        </SiteProvider>
      </TimelineProvider>
    </ThemeProvider>
  )
}

export default App
