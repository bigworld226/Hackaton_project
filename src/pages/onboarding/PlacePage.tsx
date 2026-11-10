import { Check, MapPin } from 'lucide-react'
import { useMemo, useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components'
import communityStory from '@/assets/community-story.jpg'
import { countries } from '@/data/countries'

export function PlacePage() {
  const navigate = useNavigate()
  const [countryCode, setCountryCode] = useState('PT')
  const [cityQuery, setCityQuery] = useState('Lis')
  const [selectedCityId, setSelectedCityId] = useState('lisbon')
  const selectedCountry = countries.find((country) => country.code === countryCode)
  const selectedCity = selectedCountry?.cities.find((city) => city.id === selectedCityId)
  const matchingCities = useMemo(() => {
    const query = cityQuery.trim().toLocaleLowerCase()
    if (!selectedCountry) return []

    return selectedCountry.cities
      .filter((city) => city.name.toLocaleLowerCase().includes(query))
      .slice(0, 4)
  }, [cityQuery, selectedCountry])

  function handleCountryChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextCode = event.currentTarget.value
    const nextCountry = countries.find((country) => country.code === nextCode)
    const firstCity = nextCountry?.cities[0]
    setCountryCode(nextCode)
    setSelectedCityId(firstCity?.id ?? '')
    setCityQuery(firstCity?.name ?? '')
  }

  function continueToSignup() {
    if (!selectedCountry || !selectedCity) return
    navigate('/signup', {
      state: { city: selectedCity.name, country: selectedCountry.name },
    })
  }

  return (
    <main className="onboarding-screen">
      <aside className="onboarding-sidebar">
        <Link aria-label="Common, accueil" className="onboarding-brand" to="/welcome">
          common<span>.</span>
        </Link>
        <div className="onboarding-sidebar-copy">
          <p>Apprends ici.</p>
          <p>Partage partout.</p>
        </div>
        <p className="onboarding-sidebar-foot">TA VILLE, TON FORUM DEV</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <Link className="onboarding-back-link" to="/welcome">← Retour</Link>
          <p>ÉTAPE 2 SUR 3</p>
          <h1>Trouve ta communauté.</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="place-title" className="onboarding-content onboarding-content--form">
            <div className="onboarding-form-intro">
              <span className="onboarding-step-label">TA SCÈNE LOCALE</span>
              <h2 id="place-title">Le code a aussi son quartier.</h2>
              <p>
                Choisis une ville pour découvrir les développeurs, événements et
                discussions près de toi.
              </p>
            </div>

            <div className="onboarding-form-fields">
              <div className="ui-field">
                <label className="ui-label" htmlFor="onboarding-country">Pays</label>
                <select
                  className="ui-input onboarding-select"
                  id="onboarding-country"
                  onChange={handleCountryChange}
                  value={countryCode}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>

              <Input
                autoComplete="address-level2"
                label="Ville"
                onChange={(event) => {
                  setCityQuery(event.currentTarget.value)
                  setSelectedCityId('')
                }}
                placeholder="Cherche ta ville"
                type="search"
                value={cityQuery}
              />

              <div
                aria-label="Villes disponibles"
                className="onboarding-city-list"
                role="listbox"
              >
                {matchingCities.length > 0 ? matchingCities.map((city) => {
                  const selected = city.id === selectedCityId
                  return (
                    <button
                      aria-selected={selected}
                      className="onboarding-city-option"
                      key={city.id}
                      onClick={() => {
                        setSelectedCityId(city.id)
                        setCityQuery(city.name)
                      }}
                      role="option"
                      type="button"
                    >
                      <MapPin aria-hidden="true" size={20} />
                      <span>
                        <strong>{city.name}</strong>
                        <small>{city.members.toLocaleString('fr-FR')} développeurs dans la communauté</small>
                      </span>
                      {selected && <Check aria-label="Sélectionnée" className="onboarding-city-check" size={20} />}
                    </button>
                  )
                }) : (
                  <p className="onboarding-no-city">Aucune ville trouvée dans ce pays.</p>
                )}
              </div>

              <p className="onboarding-privacy-note">
                Ta ville te connecte à une communauté locale. Ton adresse précise
                n’est jamais demandée.
              </p>
              <Button
                className="onboarding-submit"
                disabled={!selectedCity}
                onClick={continueToSignup}
                type="button"
              >
                Continuer avec {selectedCity?.name ?? 'ma ville'}
              </Button>
            </div>

            <p className="onboarding-progress">2 SUR 3 · RENCONTRE LES DEVS DU COIN</p>
          </section>

          <aside aria-label="La communauté Common" className="onboarding-aside">
            <article className="onboarding-photo-card">
              <img
                alt="Le tramway et les rues de Lisbonne"
                className="onboarding-photo-card-image"
                src={communityStory}
              />
              <div>
                <h2>Une ville pleine d’idées.</h2>
                <p>Et peut-être ton prochain binôme de code.</p>
              </div>
            </article>
            <article className="onboarding-promise-card">
              <h2>Ta localisation reste la tienne.</h2>
              <p>Nous utilisons seulement la ville que tu choisis.</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
