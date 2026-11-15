import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '@/components'
import { supabase } from '@/lib/supabase'

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state ?? {}) as LoginLocationState
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity() || isSubmitting) return

    const values = new FormData(form)
    const email = String(values.get('email') ?? '').trim().toLowerCase()
    const password = String(values.get('password') ?? '')
    setIsSubmitting(true)
    setFormError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setIsSubmitting(false)

    if (error) {
      setFormError(t('auth.signInError'))
      return
    }

    navigate(state.from ?? '/coding-rooms', { replace: true })
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
        <p className="onboarding-sidebar-foot">{t('auth.loginSidebar')}</p>
      </aside>

      <div className="onboarding-workspace">
        <header className="onboarding-header">
          <Link className="onboarding-back-link" to="/welcome">{t('common.back')}</Link>
          <p>{t('auth.loginEyebrow')}</p>
          <h1>{t('auth.loginTitle')}</h1>
        </header>

        <div className="onboarding-columns">
          <section aria-labelledby="login-title" className="onboarding-content onboarding-content--form">
            <div className="onboarding-form-intro">
              <h2 id="login-title">{t('auth.loginHeading')}</h2>
              <p>{t('auth.loginDescription')}</p>
            </div>
            <form className="onboarding-form-fields" onSubmit={handleSubmit}>
              <Input
                autoComplete="email"
                label={t('onboarding.email')}
                name="email"
                placeholder={t('onboarding.emailPlaceholder')}
                required
                type="email"
              />
              <Input
                autoComplete="current-password"
                label={t('onboarding.password')}
                name="password"
                placeholder={t('onboarding.passwordPlaceholder')}
                required
                type="password"
              />
              {formError && <p className="ui-field-message ui-field-message--error" role="alert">{formError}</p>}
              <Button className="onboarding-submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? t('common.loading') : t('auth.signIn')}
              </Button>
              <p className="onboarding-login-note">
                {t('auth.noAccount')} <Link to="/place">{t('auth.createAccount')}</Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
