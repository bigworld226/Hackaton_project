import { ArrowRight, Code2, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import neighborhoodImage from '@/assets/welcome-neighborhood.jpg'

export function WelcomePage() {
  return (
    <main className="onboarding-screen">
      <aside className="onboarding-sidebar">
        <Link aria-label="Common, accueil" className="onboarding-brand" to="/welcome">
          common<span>.</span>
        </Link>
        <div className="onboarding-sidebar-copy">
          <p>Ton monde.</p>
          <p>Ton code.</p>
          <p>Ta communauté.</p>
        </div>
        <p className="onboarding-sidebar-foot">FAIT POUR LES GENS QUI CODENT</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <div className="onboarding-wordmark">
            common<span>.</span>
          </div>
          <p>BIENVENUE DANS COMMON</p>
          <h1>Le code est meilleur à plusieurs.</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="welcome-title" className="onboarding-content">
            <div className="onboarding-hero">
              <div className="onboarding-hero-copy">
                <span className="onboarding-step-label">01 / TA COMMUNAUTÉ DEV</span>
                <h2 id="welcome-title">Des idées locales. Du code sans frontières.</h2>
                <p>Rencontre des devs, partage ce que tu apprends et progresse ensemble.</p>
                <Code2 aria-hidden="true" className="onboarding-hero-mark" size={28} />
              </div>
              <img
                alt="Un tramway traverse une rue de Lisbonne"
                className="onboarding-hero-image"
                src={neighborhoodImage}
              />
            </div>

            <div className="onboarding-welcome-copy">
              <p>
                Regarde des vidéos de code, publie tes découvertes et retrouve les
                développeurs près de chez toi.
              </p>
              <div className="onboarding-benefits">
                <span><Sparkles aria-hidden="true" size={17} /> Des formats courts et utiles</span>
                <span><MapPin aria-hidden="true" size={17} /> Une communauté, aussi près de toi</span>
              </div>
            </div>

            <div className="onboarding-actions">
              <Link className="ui-button ui-button--primary onboarding-button" to="/place">
                Rejoindre la communauté <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="ui-button ui-button--secondary onboarding-button" to="/home/reels">
                Explorer d’abord
              </Link>
            </div>
            <p className="onboarding-progress">1 SUR 3 · COMMENCE PRÈS DE CHEZ TOI</p>
          </section>

          <aside aria-label="L’esprit Common" className="onboarding-aside">
            <article className="onboarding-photo-card">
              <img
                alt="Une rue vivante où les gens se croisent"
                className="onboarding-photo-card-image"
                src={neighborhoodImage}
              />
              <div>
                <h2>Les idées voyagent. Les rencontres commencent ici.</h2>
                <p>Du premier commit au prochain meetup, avance avec les autres.</p>
              </div>
            </article>
            <article className="onboarding-promise-card">
              <h2>Un coin d’internet pour les devs.</h2>
              <p>Curieux par défaut. Bienveillant toujours. Techniquement passionné.</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
