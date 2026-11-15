import { Check, Code2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components'
import communityPortrait from '@/assets/community-portrait.jpg'
import { getCountryName } from '@/data/countries'
import { supabase } from '@/lib/supabase'

interface OnboardingLocation {
  city?: string
  countryCode?: string
  country?: string
}

export function SignupPage() {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const onboardingLocation = (location.state ?? {}) as OnboardingLocation
  const [isCreated, setIsCreated] = useState(false)
  const [signupEmail, setSignupEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || isSubmitting) return

    const values = new FormData(form)
    const email = String(values.get('email') ?? '').trim().toLowerCase()
    const password = String(values.get('password') ?? '')
    const displayName = String(values.get('displayName') ?? '').trim()
    setIsSubmitting(true)
    setFormError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          city: onboardingLocation.city ?? null,
          country_code: onboardingLocation.countryCode ?? null,
        },
      },
    })

    setIsSubmitting(false)
    if (error || !data.user) {
      setFormError(t('auth.signUpError'))
      return
    }

    if (data.session) {
      navigate('/coding-rooms', { replace: true })
      return
    }

    setSignupEmail(email)
    setIsCreated(true)
  }

  if (isCreated) {
    return (
      <main className="onboarding-screen">
        <section aria-live="polite" className="onboarding-success">
          <div className="onboarding-success-icon"><Check aria-hidden="true" size={30} /></div>
          <p className="onboarding-step-label">{t('onboarding.profileReady')}</p>
          <h1>{t('auth.confirmationTitle')}</h1>
          <p>{t('auth.confirmationDescription', { email: signupEmail })}</p>
          <Link className="ui-button ui-button--primary onboarding-button" to="/login">{t('auth.signIn')}</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="onboarding-screen">
      <aside className="onboarding-sidebar">
        <Link aria-label={t('onboarding.home')} className="onboarding-brand" to="/welcome">
          common<span>.</span>
        </Link>
        <div className="onboarding-sidebar-copy">
          <p>{t('onboarding.signupLine1')}</p>
          <p>{t('onboarding.signupLine2')}</p>
          <p>{t('onboarding.signupLine3')}</p>
        </div>
        <p className="onboarding-sidebar-foot">{t('onboarding.signupFoot')}</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <Link className="onboarding-back-link" to="/place">{t('onboarding.back')}</Link>
          <p>{t('onboarding.step3')}</p>
          <h1>{t('onboarding.makePlace')}</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="signup-title" className="onboarding-content onboarding-content--form">
            <div className="onboarding-form-intro">
              <Code2 aria-hidden="true" className="onboarding-inline-mark" size={24} />
              <h2 id="signup-title">{t('onboarding.createProfile')}</h2>
              <p>{t('onboarding.joinConversation')}</p>
              {onboardingLocation.city && (
                <span className="onboarding-location-chip">
                  {onboardingLocation.city}{onboardingLocation.countryCode
                    ? ` · ${getCountryName(onboardingLocation.countryCode, i18n.resolvedLanguage ?? 'fr')}`
                    : onboardingLocation.country ? ` · ${onboardingLocation.country}` : ''}
                </span>
              )}
            </div>

            <form className="onboarding-form-fields" onSubmit={handleSubmit}>
              <Input
                autoComplete="name"
                label={t('onboarding.displayName')}
                maxLength={40}
                name="displayName"
                placeholder={t('onboarding.namePlaceholder')}
                required
              />
              <Input
                autoComplete="email"
                label={t('onboarding.email')}
                name="email"
                placeholder={t('onboarding.emailPlaceholder')}
                required
                type="email"
              />
              <Input
                autoComplete="new-password"
                hint={t('onboarding.passwordHint')}
                label={t('onboarding.password')}
                minLength={8}
                name="password"
                pattern="(?=.*[0-9]).{8,}"
                placeholder={t('onboarding.passwordPlaceholder')}
                required
                title={t('onboarding.passwordTitle')}
                type="password"
              />
              <label className="onboarding-terms">
                <input name="terms" required type="checkbox" />
                <span>
                  {t('onboarding.terms')}
                </span>
              </label>
              {formError && <p className="ui-field-message ui-field-message--error" role="alert">{formError}</p>}
              <Button className="onboarding-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? t('common.loading') : t('onboarding.createAccount')}
              </Button>
              <p className="onboarding-login-note">
                {t('onboarding.alreadyMember')} <Link to="/login">{t('auth.signIn')}</Link>
              </p>
            </form>

            <p className="onboarding-progress">{t('onboarding.signupProgress')}</p>
          </section>

          <aside aria-label={t('onboarding.welcomeCommunity')} className="onboarding-aside">
            <article className="onboarding-photo-card">
              <img
                alt={t('onboarding.developerAlt')}
                className="onboarding-photo-card-image"
                src={communityPortrait}
              />
              <div>
                <h2>{t('onboarding.collab')}</h2>
                <p>{t('onboarding.collabText')}</p>
              </div>
            </article>
            <article className="onboarding-promise-card">
              <h2>{t('onboarding.learnPublic')}</h2>
              <p>{t('onboarding.noExpert')}</p>
            </article>
          </aside>
        </div>
      </div>
    </main>
  )
}
