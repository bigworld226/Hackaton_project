import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components'
import communityStory from '@/assets/community-story.jpg'
import { countries, getCountryName, otherCountries, westAfricanCountries } from '@/data/countries'

export function PlacePage() {
  const { i18n, t } = useTranslation()
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
      state: { city, countryCode: selectedCountry.code },
    })
  }

  return (
    <main className="onboarding-screen">
      <aside className="onboarding-sidebar">
        <Link aria-label={t('onboarding.home')} className="onboarding-brand" to="/welcome">
          common<span>.</span>
        </Link>
        <div className="onboarding-sidebar-copy">
          <p>{t('onboarding.placeLine1')}</p>
          <p>{t('onboarding.placeLine2')}</p>
        </div>
        <p className="onboarding-sidebar-foot">{t('onboarding.placeFoot')}</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <Link className="onboarding-back-link" to="/welcome">{t('onboarding.back')}</Link>
          <p>{t('onboarding.step2')}</p>
          <h1>{t('onboarding.findCommunity')}</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="place-title" className="onboarding-content onboarding-content--form">
            <div className="onboarding-form-intro">
              <span className="onboarding-step-label">{t('onboarding.localScene')}</span>
              <h2 id="place-title">{t('onboarding.neighborhoodCode')}</h2>
              <p>{t('onboarding.chooseLocality')}</p>
            </div>

            <div className="onboarding-form-fields">
              <div className="ui-field">
                <label className="ui-label" htmlFor="onboarding-country">{t('onboarding.country')}</label>
                <select
                  className="ui-input onboarding-select"
                  id="onboarding-country"
                  onChange={handleCountryChange}
                  value={countryCode}
                  required
                >
                  <option disabled value="">{t('onboarding.chooseCountry')}</option>
                  <optgroup label={t('onboarding.westAfrica')}>
                    {westAfricanCountries.map((country) => (
                      <option key={country.code} value={country.code}>{getCountryName(country.code, i18n.resolvedLanguage ?? 'fr')}</option>
                    ))}
                  </optgroup>
                  <optgroup label={t('onboarding.otherCountries')}>
                    {otherCountries.map((country) => (
                      <option key={country.code} value={country.code}>{getCountryName(country.code, i18n.resolvedLanguage ?? 'fr')}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <Input
                autoComplete="address-level2"
                label={t('onboarding.locality')}
                maxLength={100}
                onChange={(event) => setLocality(event.currentTarget.value)}
                placeholder={t('onboarding.localityPlaceholder')}
                required
                type="text"
                value={locality}
              />

              <p className="onboarding-privacy-note">
                {t('onboarding.privacyNote')}
              </p>
              <Button
                className="onboarding-submit"
                disabled={!selectedCountry || !locality.trim()}
                onClick={continueToSignup}
                type="button"
              >
                {t('onboarding.continue')}
              </Button>
            </div>

            <p className="onboarding-progress">{t('onboarding.placeProgress')}</p>
          </section>

          <aside aria-label={t('onboarding.community')} className="onboarding-aside">
            <article className="onboarding-photo-card">
              <img
                alt={t('onboarding.tramStreet')}
                className="onboarding-photo-card-image"
                src={communityStory}
              />
              <div>
                <h2>{t('onboarding.cityIdeas')}</h2>
                <p>{t('onboarding.codePartner')}</p>
              </div>
            </article>
            <article className="onboarding-promise-card">
              <h2>{t('onboarding.locationPromise')}</h2>
              <p>{t('onboarding.locationUse')}</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
