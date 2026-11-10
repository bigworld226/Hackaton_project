import { Check, Code2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components'
import communityPortrait from '@/assets/community-portrait.jpg'

interface OnboardingLocation {
  city?: string
  country?: string
}

export function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const onboardingLocation = (location.state ?? {}) as OnboardingLocation
  const [isCreated, setIsCreated] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!event.currentTarget.reportValidity()) return
    setIsCreated(true)
  }

  if (isCreated) {
    return (
      <main className="onboarding-screen">
        <section aria-live="polite" className="onboarding-success">
          <div className="onboarding-success-icon"><Check aria-hidden="true" size={30} /></div>
          <p className="onboarding-step-label">TON PROFIL EST PRÊT</p>
          <h1>Bienvenue dans la communauté.</h1>
          <p>
            Ton compte de démonstration est prêt
            {onboardingLocation.city ? ` pour rejoindre les devs de ${onboardingLocation.city}` : ''}.
          </p>
          <Button onClick={() => navigate('/home/reels')}>Voir les vidéos de code</Button>
        </section>
      </main>
    )
  }

  return (
    <main className="onboarding-screen">
      <aside className="onboarding-sidebar">
        <Link aria-label="Common, accueil" className="onboarding-brand" to="/welcome">
          common<span>.</span>
        </Link>
        <div className="onboarding-sidebar-copy">
          <p>Ton prochain projet.</p>
          <p>Ton prochain déclic.</p>
          <p>Ton prochain crew.</p>
        </div>
        <p className="onboarding-sidebar-foot">TON PROFIL, TES RÈGLES</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <Link className="onboarding-back-link" to="/place">← Retour</Link>
          <p>ÉTAPE 3 SUR 3</p>
          <h1>Fais-toi une place.</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="signup-title" className="onboarding-content onboarding-content--form">
            <div className="onboarding-form-intro">
              <Code2 aria-hidden="true" className="onboarding-inline-mark" size={24} />
              <h2 id="signup-title">Crée ton profil dev.</h2>
              <p>Rejoins les conversations et partage ton prochain petit déclic.</p>
              {onboardingLocation.city && (
                <span className="onboarding-location-chip">
                  {onboardingLocation.city}{onboardingLocation.country ? ` · ${onboardingLocation.country}` : ''}
                </span>
              )}
            </div>

            <form className="onboarding-form-fields" onSubmit={handleSubmit}>
              <Input
                autoComplete="name"
                label="Nom affiché"
                maxLength={40}
                name="displayName"
                placeholder="Ex. Maya Santos"
                required
              />
              <Input
                autoComplete="email"
                label="Adresse e-mail"
                name="email"
                placeholder="toi@exemple.com"
                required
                type="email"
              />
              <Input
                autoComplete="new-password"
                hint="8 caractères minimum, avec au moins un chiffre."
                label="Mot de passe"
                minLength={8}
                name="password"
                pattern="(?=.*[0-9]).{8,}"
                placeholder="Choisis un mot de passe"
                required
                title="8 caractères minimum et au moins un chiffre."
                type="password"
              />
              <label className="onboarding-terms">
                <input name="terms" required type="checkbox" />
                <span>
                  J’accepte les conditions d’utilisation et les règles de la
                  communauté.
                </span>
              </label>
              <Button className="onboarding-submit" type="submit">
                Créer mon compte
              </Button>
              <p className="onboarding-login-note">
                Déjà membre ? <Link to="/home/reels">Explorer Common</Link>
              </p>
              <p className="onboarding-demo-note">
                Démo d’interface : aucun compte réel n’est créé.
              </p>
            </form>

            <p className="onboarding-progress">3 SUR 3 · TON AVENTURE COMMENCE</p>
          </section>

          <aside aria-label="Bienvenue dans la communauté" className="onboarding-aside">
            <article className="onboarding-photo-card">
              <img
                alt="Une développeuse de la communauté"
                className="onboarding-photo-card-image"
                src={communityPortrait}
              />
              <div>
                <h2>Ta prochaine collab commence par un hello.</h2>
                <p>Apprends avec les autres, partage tes idées et trouve ta tribu tech.</p>
              </div>
            </article>
            <article className="onboarding-promise-card">
              <h2>Un espace pour apprendre en public.</h2>
              <p>Pas besoin d’être expert. Juste l’envie de construire et de partager.</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
