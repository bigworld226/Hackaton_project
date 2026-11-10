import { ArrowRight, Code2, MapPin, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import neighborhoodImage from '@/assets/welcome-neighborhood.jpg'

export function WelcomePage() {
  const { t } = useTranslation()
  return (
    <main className="onboarding-screen">
      <aside className="onboarding-sidebar">
        <Link aria-label={t('onboarding.home')} className="onboarding-brand" to="/welcome">
          common<span>.</span>
        </Link>
        <div className="onboarding-sidebar-copy">
          <p>{t('onboarding.welcomeLine1')}</p>
          <p>{t('onboarding.welcomeLine2')}</p>
          <p>{t('onboarding.welcomeLine3')}</p>
        </div>
        <p className="onboarding-sidebar-foot">{t('onboarding.madeFor')}</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <div className="onboarding-wordmark">
            common<span>.</span>
          </div>
          <p>{t('onboarding.welcomeEyebrow')}</p>
          <h1>{t('onboarding.welcomeTitle')}</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="welcome-title" className="onboarding-content">
            <div className="onboarding-hero">
              <div className="onboarding-hero-copy">
                <span className="onboarding-step-label">{t('onboarding.step')}</span>
                <h2 id="welcome-title">{t('onboarding.welcomeHeading')}</h2>
                <p>{t('onboarding.welcomeDescription')}</p>
                <Code2 aria-hidden="true" className="onboarding-hero-mark" size={28} />
              </div>
              <img
                alt={t('onboarding.tramAlt')}
                className="onboarding-hero-image"
                src={neighborhoodImage}
              />
            </div>

            <div className="onboarding-welcome-copy">
              <p>
                {t('onboarding.communityText')}
              </p>
              <div className="onboarding-benefits">
                <span><Sparkles aria-hidden="true" size={17} /> {t('onboarding.shortFormats')}</span>
                <span><MapPin aria-hidden="true" size={17} /> {t('onboarding.localCommunity')}</span>
              </div>
            </div>

            <div className="onboarding-actions">
              <Link className="ui-button ui-button--primary onboarding-button" to="/place">
                {t('onboarding.join')} <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="ui-button ui-button--secondary onboarding-button" to="/home/reels">
                {t('onboarding.exploreFirst')}
              </Link>
            </div>
            <p className="onboarding-progress">{t('onboarding.welcomeProgress')}</p>
          </section>

          <aside aria-label={t('onboarding.spirit')} className="onboarding-aside">
            <article className="onboarding-photo-card">
              <img
                alt={t('onboarding.tramAlt')}
                className="onboarding-photo-card-image"
                src={neighborhoodImage}
              />
              <div>
                <h2>{t('onboarding.travelIdeas')}</h2>
                <p>{t('onboarding.meetupText')}</p>
              </div>
            </article>
            <article className="onboarding-promise-card">
              <h2>{t('onboarding.internetCorner')}</h2>
              <p>{t('onboarding.promise')}</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
