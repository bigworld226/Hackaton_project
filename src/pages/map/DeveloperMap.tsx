import { divIcon } from 'leaflet'
import { ArrowUpRight, MapPin, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components'
import { getNearbyProfiles, type NearbyProfile } from '@/services/map'

const DAKAR_CENTER: [number, number] = [14.7167, -17.4677]
const NEARBY_RADIUS_KM = 5

function developerInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase()
}

function createDeveloperIcon(name: string, selected: boolean) {
  const initials = developerInitials(name)
  return divIcon({
    className: 'nearby-map-marker-wrap',
    html: `<span class="nearby-map-marker${selected ? ' nearby-map-marker--selected' : ''}"><span>${initials}</span></span>`,
    iconAnchor: [21, 42],
    iconSize: [42, 42],
  })
}

function RefreshMapSize({ active }: { active: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (!active) return
    const timer = window.setTimeout(() => map.invalidateSize(), 120)
    return () => window.clearTimeout(timer)
  }, [active, map])

  return null
}

function DeveloperProfileCard({ developer, onClose }: { developer: NearbyProfile; onClose?: () => void }) {
  const { t, i18n } = useTranslation()
  const points = new Intl.NumberFormat(i18n.resolvedLanguage ?? 'fr').format(developer.points)
  const name = developer.display_name

  return (
    <article aria-label={t('map.selectedDeveloper', { name })} className="nearby-map-profile-card">
      <div aria-hidden="true" className="nearby-map-profile-avatar">{developerInitials(name)}</div>
      <div className="nearby-map-profile-copy">
        <div className="nearby-map-profile-heading">
          <div>
            <h2>{name}</h2>
            <span>{developer.handle}{developer.city ? ` · ${developer.city}` : ''}</span>
          </div>
          <Badge>{t('map.points', { count: points })}</Badge>
        </div>
        <div aria-label={t('map.languages')} className="nearby-map-languages">
          {developer.languages.map((language) => <span key={language}>{language}</span>)}
        </div>
        <Link
          className="nearby-map-profile-link"
          onClick={onClose}
          to={`/profile/${developer.profile_id}`}
        >
          {t('map.viewProfile')} <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </div>
    </article>
  )
}

export function NearbyDevelopersMap({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation()
  const [developers, setDevelopers] = useState<NearbyProfile[]>([])
  const [selectedDeveloper, setSelectedDeveloper] = useState<NearbyProfile | null>(null)
  const [center, setCenter] = useState<[number, number]>(DAKAR_CENTER)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [visibility, setVisibility] = useState<'visible' | 'ghost'>(() =>
    window.localStorage.getItem('common-map-visibility') === 'ghost' ? 'ghost' : 'visible',
  )

  useEffect(() => {
    let active = true
    let requestId = 0

    async function loadNearbyProfiles(location: [number, number]) {
      const currentRequest = ++requestId
      setCenter(location)
      setLoading(true)
      setLoadError(false)
      setSelectedDeveloper(null)
      try {
        const results = await getNearbyProfiles(location[0], location[1], NEARBY_RADIUS_KM)
        if (active && currentRequest === requestId) setDevelopers(results)
      } catch (error) {
        console.error('Unable to load nearby profiles.', error)
        if (active && currentRequest === requestId) setLoadError(true)
      } finally {
        if (active && currentRequest === requestId) setLoading(false)
      }
    }

    void loadNearbyProfiles(DAKAR_CENTER)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => void loadNearbyProfiles([position.coords.latitude, position.coords.longitude]),
        () => undefined,
        { enableHighAccuracy: false, maximumAge: 300_000, timeout: 5000 },
      )
    }

    return () => { active = false }
  }, [])

  function toggleVisibility() {
    const nextVisibility = visibility === 'visible' ? 'ghost' : 'visible'
    window.localStorage.setItem('common-map-visibility', nextVisibility)
    setVisibility(nextVisibility)
  }

  return (
    <div className={`nearby-map-view${onClose ? ' nearby-map-view--modal' : ''}`}>
      {onClose && (
        <header className="nearby-map-toolbar">
          <div>
            <span className="nearby-map-toolbar-icon"><MapPin aria-hidden="true" size={20} /></span>
            <div>
              <h1>{t('map.title')}</h1>
              <p>{t('map.subtitle')}</p>
            </div>
          </div>
          <button
            aria-label={t('map.exit')}
            className="ui-button ui-button--secondary nearby-map-exit"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
            <span>{t('map.exit')}</span>
          </button>
        </header>
      )}
      <div className="nearby-map-canvas">
        <MapContainer
            center={center}
          className="nearby-leaflet-map"
            key={center.join(',')}
          scrollWheelZoom
          zoom={13}
          zoomControl
        >
          <RefreshMapSize active />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {developers.map((developer) => (
            <Marker
              eventHandlers={{ click: () => setSelectedDeveloper(developer) }}
              icon={createDeveloperIcon(developer.display_name, selectedDeveloper?.profile_id === developer.profile_id)}
              key={developer.profile_id}
              position={[developer.latitude, developer.longitude]}
              title={developer.display_name}
            />
          ))}
        </MapContainer>
        <div className="nearby-map-bottom-panel">
          <p className="nearby-map-count">
            <MapPin aria-hidden="true" size={17} />
            {t('map.developersNearby', { count: developers.length, radius: NEARBY_RADIUS_KM })}
          </p>
          {loading ? (
            <p className="nearby-map-hint">{t('common.loading')}</p>
          ) : loadError ? (
            <p className="nearby-map-hint">{t('map.loadError')}</p>
          ) : selectedDeveloper ? (
            <DeveloperProfileCard developer={selectedDeveloper} onClose={onClose} />
          ) : developers.length === 0 ? (
            <p className="nearby-map-hint">{t('map.noDevelopers')}</p>
          ) : (
            <p className="nearby-map-hint">{t('map.selectPin')}</p>
          )}
          <div className="nearby-map-visibility-row">
            <div className="nearby-map-visibility-copy">
              <strong>{t('map.visibility')}</strong>
              <span>{t(visibility === 'visible' ? 'map.visibilityVisible' : 'map.visibilityGhost')}</span>
            </div>
            <div aria-label={t('map.visibility')} className="nearby-map-visibility-control">
              <span className={visibility === 'visible' ? 'is-selected' : ''}>{t('map.visible')}</span>
              <button
                aria-checked={visibility === 'visible'}
                aria-label={t('map.visibilityToggle')}
                className={`nearby-map-switch${visibility === 'visible' ? ' nearby-map-switch--visible' : ''}`}
                onClick={toggleVisibility}
                role="switch"
                type="button"
              >
                <span />
              </button>
              <span className={visibility === 'ghost' ? 'is-selected' : ''}>{t('map.ghost')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DeveloperMapModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      aria-label={t('map.title')}
      className="nearby-map-dialog"
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
      onClose={() => {
        if (open) onClose()
      }}
      ref={dialogRef}
    >
      <NearbyDevelopersMap onClose={onClose} />
    </dialog>
  )
}
