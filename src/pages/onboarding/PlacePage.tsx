import { useState, type ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components'
import communityStory from '@/assets/community-story.jpg'
import { countries, otherCountries, westAfricanCountries } from '@/data/countries'

export function PlacePage() {
  const navigate = useNavigate()
  const [countryCode, setCountryCode] = useState('')
  const [locality, setLocality] = useState('')
  const selectedCountry = countries.find((country) => country.code === countryCode)

  function handleCountryChange(event: ChangeEvent<HTMLSelectElement>) {
    setCountryCode(event.currentTarget.value)
  }

  function continueToSignup() {
    const city = locality.trim()
    if (!selectedCountry || !city) return
    navigate('/signup', {
      state: { city, country: selectedCountry.name },
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
                Choisis ton pays et indique ta ville ou ta localité pour découvrir
                les développeurs, événements et discussions près de toi.
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
                  required
                >
                  <option disabled value="">Sélectionne ton pays</option>
                  <optgroup label="Afrique de l’Ouest">
                    {westAfricanCountries.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Autres pays et territoires">
                    {otherCountries.map((country) => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <Input
                autoComplete="address-level2"
                label="Ville ou localité"
                maxLength={100}
                onChange={(event) => setLocality(event.currentTarget.value)}
                placeholder="Saisis le nom de ta ville ou localité"
                required
                type="text"
                value={locality}
              />

              <p className="onboarding-privacy-note">
                Ta localité te connecte à une communauté proche. Ton adresse précise
                n’est jamais demandée.
              </p>
              <Button
                className="onboarding-submit"
                disabled={!selectedCountry || !locality.trim()}
                onClick={continueToSignup}
                type="button"
              >
                Continuer
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
              <p>Nous utilisons seulement la localité que tu choisis.</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
