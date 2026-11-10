import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleHelp,
  Clock3,
  Code2,
  Lightbulb,
  ListChecks,
  Plus,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'
import type { TFunction } from 'i18next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Badge, Button, EmptyState, Input, ProgressBar, Tabs } from '@/components'
import {
  advanceQuiz,
  chooseQuizAnswer,
  createQuizDraft,
  editQuizDraft,
  getExperienceQuiz,
  getOwnedQuizzes,
  getQuizCatalog,
  getQuizDraft,
  getQuizResult,
  getQuizRun,
  publishQuizDraft,
  startQuiz,
  updateQuizDraft,
  validateQuizDraft,
  type ExperienceQuiz,
  type QuizDraft,
  type QuizQuestion,
  type QuizRun,
} from '@/data/quizExperience'
import type { Quiz } from '@/data/quizzes'
import { ResponsiveLayout } from '@/layouts'

const difficultyVariants: Record<Quiz['difficulty'], 'success' | 'warning' | 'danger'> = {
  Débutant: 'success',
  Intermédiaire: 'warning',
  Avancé: 'danger',
}

const validationMessageKeys: Record<string, string> = {
  'Le titre doit contenir au moins 4 caractères.': 'quiz.validationTitle',
  'Ajoute une description d’au moins 12 caractères.': 'quiz.validationDescription',
  'Ajoute au moins une question.': 'quiz.validationQuestion',
  'Chaque question doit contenir au moins 8 caractères.': 'quiz.validationPrompt',
  'Chaque question doit proposer au moins deux réponses.': 'quiz.validationOptions',
  'Ajoute une explication pour chaque bonne réponse.': 'quiz.validationExplanation',
}

function translateValidationMessage(error: string, t: TFunction) {
  const key = validationMessageKeys[error]
  return key ? t(key) : error
}

function QuizIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="quiz-intro">
      <span className="community-eyebrow"><Sparkles aria-hidden="true" size={16} /> {eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  )
}

function QuizCard({ quiz, compact = false }: { quiz: ExperienceQuiz; compact?: boolean }) {
  const { i18n, t } = useTranslation()
  return (
    <article className={`quiz-card${compact ? ' quiz-card--compact' : ''}`}>
      <div className="quiz-card-topline">
        <span className="quiz-topic-icon"><Code2 aria-hidden="true" size={19} /></span>
        <Badge>{quiz.topic}</Badge>
        <Badge variant={difficultyVariants[quiz.difficulty]}>{t(`quiz.difficulty.${quiz.difficulty}`, { defaultValue: quiz.difficulty })}</Badge>
      </div>
      <div className="quiz-card-copy">
        <h3>{quiz.title}</h3>
        <p>{quiz.description}</p>
      </div>
      <div className="quiz-card-meta">
        <span><ListChecks aria-hidden="true" size={15} /> {t('quiz.questionCount', { count: quiz.questions.length })}</span>
        <span><Clock3 aria-hidden="true" size={15} /> {t('quiz.minutes', { count: quiz.durationMinutes })}</span>
        {!quiz.isMine && <span>{quiz.plays.toLocaleString(i18n.resolvedLanguage ?? 'fr')} {t('quiz.games')}</span>}
      </div>
      <Link className="quiz-card-link" to={`/quiz/${quiz.id}`}>
        {quiz.isMine ? t('quiz.manage') : t('quiz.discover')} <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  )
}

export function QuizHubPage() {
  const { t } = useTranslation()
  const [topic, setTopic] = useState('all')
  const topics = [{ label: t('quiz.allTopics'), value: 'all' }, ...[...new Set(getQuizCatalog().map((quiz) => quiz.topic))].map((item) => ({ label: item, value: item }))]
  const visibleQuizzes = getQuizCatalog().filter((quiz) => topic === 'all' || quiz.topic === topic)

  function beginCreation() {
    createQuizDraft()
  }

  return (
    <ResponsiveLayout title={t('quiz.appTitle')}>
      <div className="quiz-page">
        <QuizIntro
          description={t('quiz.hubDescription')}
          eyebrow={t('quiz.hubEyebrow')}
          title={t('quiz.hubHeading')}
        />
        <div className="quiz-hub-actions">
          <Link className="quiz-secondary-link" to="/quiz/mine"><BookOpenCheck aria-hidden="true" size={18} /> {t('quiz.mine')}</Link>
          <Link className="quiz-create-link" onClick={beginCreation} to="/quiz/editor"><Plus aria-hidden="true" size={18} /> {t('quiz.create')}</Link>
        </div>
        <section aria-label={t('quiz.catalog')} className="quiz-catalog-section">
          <div className="quiz-section-heading">
            <div>
              <span className="community-eyebrow">{t('quiz.playEyebrow')}</span>
              <h2>{t('quiz.catalog')}</h2>
            </div>
            <span className="quiz-count">{t('quiz.quizCount', { count: visibleQuizzes.length })}</span>
          </div>
          <Tabs
            items={topics}
            onValueChange={setTopic}
            value={topic}
          />
          {visibleQuizzes.length ? (
            <div className="quiz-grid">
              {visibleQuizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
            </div>
          ) : (
            <EmptyState description={t('quiz.noTopicDescription')} title={t('quiz.noTopicTitle')} />
          )}
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function MyQuizzesPage() {
  const { t } = useTranslation()
  const owned = getOwnedQuizzes()

  function beginCreation() {
    createQuizDraft()
  }

  return (
    <ResponsiveLayout title={t('quiz.mine')}>
      <div className="quiz-page">
        <QuizIntro
          description={t('quiz.mineDescription')}
          eyebrow={t('quiz.workshop')}
          title={t('quiz.mine')}
        />
        {owned.length ? (
          <div className="quiz-grid">
            {owned.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
          </div>
        ) : (
          <EmptyState
            action={<Link className="quiz-create-link" onClick={beginCreation} to="/quiz/editor"><Plus aria-hidden="true" size={17} /> {t('quiz.createFirst')}</Link>}
            description={t('quiz.emptyMineDescription')}
            icon={<Lightbulb aria-hidden="true" size={25} />}
            title={t('quiz.emptyMineTitle')}
          />
        )}
      </div>
    </ResponsiveLayout>
  )
}

export function QuizDetailsPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const quiz = getExperienceQuiz(id)

  function playQuiz() {
    if (!startQuiz(id)) return
    navigate(`/quiz/play?id=${encodeURIComponent(id)}`)
  }

  return (
    <ResponsiveLayout title={quiz?.title ?? t('quiz.notFound')}>
      <div className="quiz-page">
        {quiz ? (
          <section className="quiz-detail-card">
            <Link className="quiz-back-link" to="/quiz"><ArrowLeft aria-hidden="true" size={16} /> {t('quiz.allQuizzes')}</Link>
            <span className="quiz-topic-icon quiz-topic-icon--large"><Code2 aria-hidden="true" size={25} /></span>
            <div className="quiz-detail-badges">
              <Badge>{quiz.topic}</Badge>
              <Badge variant={difficultyVariants[quiz.difficulty]}>{t(`quiz.difficulty.${quiz.difficulty}`, { defaultValue: quiz.difficulty })}</Badge>
            </div>
            <h2>{quiz.title}</h2>
            <p className="quiz-detail-description">{quiz.description}</p>
            <div className="quiz-detail-stats">
              <span><ListChecks aria-hidden="true" size={18} /><strong>{quiz.questions.length}</strong> {t('quiz.questions').toLowerCase()}</span>
              <span><Clock3 aria-hidden="true" size={18} /><strong>{quiz.durationMinutes}</strong> {t('quiz.minutes', { count: quiz.durationMinutes })}</span>
              <span><Trophy aria-hidden="true" size={18} />{t('quiz.createdBy')} <strong>{quiz.author}</strong></span>
            </div>
            <div className="quiz-detail-note">
              <CircleHelp aria-hidden="true" size={20} />
              <p>{t('quiz.instructions')}</p>
            </div>
            <div className="quiz-detail-actions">
              <Button onClick={playQuiz} type="button">{t('quiz.launch')} <ArrowRight aria-hidden="true" size={18} /></Button>
              {quiz.isMine && (
                <Button
                  onClick={() => {
                    if (editQuizDraft(quiz.id)) navigate('/quiz/editor')
                  }}
                  type="button"
                  variant="secondary"
                >
                  {t('quiz.edit')}
                </Button>
              )}
            </div>
          </section>
        ) : (
          <EmptyState action={<Link to="/quiz">{t('quiz.explore')}</Link>} description={t('quiz.missingDescription')} title={t('quiz.notFound')} />
        )}
      </div>
    </ResponsiveLayout>
  )
}

function updateQuestion(draft: QuizDraft, index: number, patch: Partial<QuizQuestion>): QuizDraft {
  return {
    ...draft,
    questions: draft.questions.map((question, currentIndex) =>
      currentIndex === index ? { ...question, ...patch } : question,
    ),
  }
}

function questionLabelId(index: number, field: string) {
  return `quiz-question-${index}-${field}`
}

export function QuizEditorPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [draft, setDraft] = useState(getQuizDraft)
  const [error, setError] = useState('')

  function update(nextDraft: QuizDraft) {
    setDraft(nextDraft)
    updateQuizDraft(nextDraft)
    setError('')
  }

  function updateText(field: 'title' | 'description' | 'topic', value: string) {
    update({ ...draft, [field]: value })
  }

  function updateQuestionField(index: number, field: keyof QuizQuestion, value: string | number | string[]) {
    const question = draft.questions[index]
    if (!question) return
    update(updateQuestion(draft, index, { [field]: value }))
  }

  function updateOption(index: number, optionIndex: number, value: string) {
    const question = draft.questions[index]
    if (!question) return
    const options = question.options.map((option, current) => current === optionIndex ? value : option)
    update(updateQuestion(draft, index, { options }))
  }

  function handlePreview() {
    const validationError = validateQuizDraft(draft)
    if (validationError) {
      setError(translateValidationMessage(validationError, t))
      return
    }
    navigate('/quiz/preview')
  }

  return (
    <ResponsiveLayout title={t('quiz.editorTitle')}>
      <div className="quiz-page quiz-editor-page">
        <QuizIntro
          description={t('quiz.editorDescription')}
          eyebrow={t('quiz.creator')}
          title={t('quiz.editorHeading')}
        />
        <section className="quiz-editor-card">
          <div className="quiz-editor-fields">
            <Input
              label={t('quiz.titleLabel')}
              maxLength={90}
              onChange={(event) => updateText('title', event.currentTarget.value)}
              placeholder={t('quiz.titlePlaceholder')}
              value={draft.title}
            />
            <div className="ui-field">
              <label className="ui-label" htmlFor="quiz-description">{t('quiz.descriptionLabel')}</label>
              <textarea
                className="community-textarea quiz-description-input"
                id="quiz-description"
                maxLength={240}
                onChange={(event) => updateText('description', event.currentTarget.value)}
                placeholder={t('quiz.descriptionPlaceholder')}
                rows={3}
                value={draft.description}
              />
            </div>
            <div className="quiz-editor-meta">
              <Input
                label={t('quiz.topic')}
                onChange={(event) => updateText('topic', event.currentTarget.value)}
                placeholder="Ex. React"
                value={draft.topic}
              />
              <div className="ui-field">
                <label className="ui-label" htmlFor="quiz-difficulty">{t('quiz.difficultyLabel')}</label>
                <select
                  className="ui-input"
                  id="quiz-difficulty"
                  onChange={(event) => update({ ...draft, difficulty: event.currentTarget.value as Quiz['difficulty'] })}
                  value={draft.difficulty}
                >
                  <option value="Débutant">{t('quiz.difficulty.Débutant')}</option>
                  <option value="Intermédiaire">{t('quiz.difficulty.Intermédiaire')}</option>
                  <option value="Avancé">{t('quiz.difficulty.Avancé')}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="quiz-question-editor-heading">
            <div><h3>{t('quiz.questions')}</h3><span>{t('quiz.questionCount', { count: draft.questions.length })}</span></div>
            <Button
              onClick={() => update({ ...draft, questions: [...draft.questions, { prompt: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }] })}
              type="button"
              variant="secondary"
            >
              <Plus aria-hidden="true" size={17} /> {t('quiz.addQuestion')}
            </Button>
          </div>
          <div className="quiz-question-editor-list">
            {draft.questions.map((question, index) => (
              <fieldset className="quiz-question-editor" key={index}>
                <legend>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {t('quiz.question', { number: index + 1 })}
                  {draft.questions.length > 1 && (
                    <button
                      aria-label={t('quiz.removeQuestion', { number: index + 1 })}
                      className="quiz-remove-question"
                      onClick={() => update({ ...draft, questions: draft.questions.filter((_, current) => current !== index) })}
                      type="button"
                    ><X aria-hidden="true" size={17} /></button>
                  )}
                </legend>
                <div className="ui-field">
                  <label className="ui-label" htmlFor={questionLabelId(index, 'prompt')}>{t('quiz.prompt')}</label>
                  <textarea
                    className="community-textarea quiz-question-prompt"
                    id={questionLabelId(index, 'prompt')}
                    onChange={(event) => updateQuestionField(index, 'prompt', event.currentTarget.value)}
                    placeholder={t('quiz.promptPlaceholder')}
                    rows={2}
                    value={question.prompt}
                  />
                </div>
                <div className="quiz-answer-options">
                  {question.options.map((option, optionIndex) => {
                    const inputId = questionLabelId(index, `option-${optionIndex}`)
                    return (
                      <div className={`quiz-answer-option${question.correctAnswer === optionIndex ? ' quiz-answer-option--correct' : ''}`} key={optionIndex}>
                        <input
                          aria-label={t('quiz.markCorrect', { number: optionIndex + 1 })}
                          checked={question.correctAnswer === optionIndex}
                          name={`correct-answer-${index}`}
                          onChange={() => updateQuestionField(index, 'correctAnswer', optionIndex)}
                          type="radio"
                        />
                        <label className="sr-only" htmlFor={inputId}>{t('quiz.option', { number: optionIndex + 1 })}</label>
                        <input
                          className="ui-input"
                          id={inputId}
                          onChange={(event) => updateOption(index, optionIndex, event.currentTarget.value)}
                          placeholder={t('quiz.option', { number: optionIndex + 1 })}
                          value={option}
                        />
                        {question.correctAnswer === optionIndex && <Check aria-label={t('quiz.correctAnswer')} size={17} />}
                      </div>
                    )
                  })}
                </div>
                <Input
                  label={t('quiz.explanation')}
                  onChange={(event) => updateQuestionField(index, 'explanation', event.currentTarget.value)}
                  placeholder={t('quiz.explanationPlaceholder')}
                  value={question.explanation}
                />
              </fieldset>
            ))}
          </div>
          {error && <p className="quiz-form-error" role="alert">{error}</p>}
          <div className="quiz-editor-actions">
            <Link className="quiz-back-link" to="/quiz"><ArrowLeft aria-hidden="true" size={16} /> {t('quiz.cancel')}</Link>
            <Button onClick={handlePreview} type="button">{t('quiz.preview')} <ArrowRight aria-hidden="true" size={17} /></Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function QuizPreviewPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const draft = getQuizDraft()
  const error = validateQuizDraft(draft)
  const [publishError, setPublishError] = useState('')

  function publish() {
    const result = publishQuizDraft()
    if (!result.quiz) {
      setPublishError(result.error ? translateValidationMessage(result.error, t) : t('quiz.draftError'))
      return
    }
    navigate('/quiz/mine')
  }

  return (
    <ResponsiveLayout title={t('quiz.previewTitle')}>
      <div className="quiz-page">
        {error ? (
          <EmptyState
            action={<Link className="quiz-create-link" to="/quiz/editor">{t('quiz.editQuiz')}</Link>}
            description={translateValidationMessage(error, t)}
            title={t('quiz.notReady')}
          />
        ) : (
          <section className="quiz-preview-card">
            <Link className="quiz-back-link" to="/quiz/editor"><ArrowLeft aria-hidden="true" size={16} /> {t('quiz.editQuiz')}</Link>
            <div className="quiz-preview-cover"><Sparkles aria-hidden="true" size={30} /><span>{draft.topic}</span></div>
            <Badge variant={difficultyVariants[draft.difficulty]}>{t(`quiz.difficulty.${draft.difficulty}`)}</Badge>
            <h2>{draft.title}</h2>
            <p>{draft.description}</p>
            <div className="quiz-detail-stats">
              <span><ListChecks aria-hidden="true" size={18} /><strong>{draft.questions.length}</strong> {t('quiz.questions')}</span>
              <span><Clock3 aria-hidden="true" size={18} /><strong>{Math.max(1, Math.ceil(draft.questions.length * 0.6))}</strong> {t('quiz.minutes', { count: Math.max(1, Math.ceil(draft.questions.length * 0.6)) })}</span>
              <span><Trophy aria-hidden="true" size={18} /><strong>Toi</strong></span>
            </div>
            <h3>{t('quiz.previewQuestions')}</h3>
            <ol className="quiz-preview-questions">
              {draft.questions.map((question, index) => (
                <li key={index}>
                  <strong>{question.prompt}</strong>
                  <span>{t('quiz.choices', { count: question.options.filter((option) => option.trim()).length })}</span>
                </li>
              ))}
            </ol>
            {publishError && <p className="quiz-form-error" role="alert">{publishError}</p>}
            <div className="quiz-detail-actions">
              <Button onClick={publish} type="button"><Check aria-hidden="true" size={17} /> {t('quiz.publish')}</Button>
              <Button onClick={() => navigate('/quiz/editor')} type="button" variant="secondary">{t('quiz.continueEditing')}</Button>
            </div>
          </section>
        )}
      </div>
    </ResponsiveLayout>
  )
}

function cloneRun(run: QuizRun | null): QuizRun | null {
  return run ? { ...run, answers: [...run.answers] } : null
}

export function QuizPlayPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const quizId = searchParams.get('id') ?? ''
  const [run, setRun] = useState<QuizRun | null>(() =>
    getQuizRun() ?? (quizId ? startQuiz(quizId) : null),
  )
  const [showError, setShowError] = useState(false)
  const question = run?.quiz.questions[run.currentQuestion]
  const selectedAnswer = run?.answers[run.currentQuestion] ?? null
  const progressValue = run ? run.currentQuestion + (selectedAnswer === null ? 0 : 1) : 0

  function selectAnswer(index: number) {
    setRun(cloneRun(chooseQuizAnswer(index)))
    setShowError(false)
  }

  function nextQuestion() {
    const result = advanceQuiz()
    if (result === 'unanswered') {
      setShowError(true)
      return
    }
    if (result === 'completed') {
      navigate('/quiz/results')
      return
    }
    setRun(getQuizRun())
    setShowError(false)
  }

  if (!run || !question) {
    return (
      <ResponsiveLayout title={t('quiz.playTitle')}>
        <div className="quiz-page"><EmptyState action={<Link to="/quiz">{t('quiz.backToQuizzes')}</Link>} description={t('quiz.noRunDescription')} title={t('quiz.noRun')} /></div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title={t('quiz.inProgress')}>
      <div className="quiz-page quiz-play-page">
        <section aria-label={t('quiz.inProgress')} className="quiz-play-card">
          <div className="quiz-play-topline">
            <Link aria-label={t('quiz.quit')} className="quiz-icon-link" to={`/quiz/${run.quiz.id}`}><X aria-hidden="true" size={20} /></Link>
            <span>{run.quiz.title}</span>
            <span>{run.currentQuestion + 1} / {run.quiz.questions.length}</span>
          </div>
          <ProgressBar label={t('quiz.progress')} max={run.quiz.questions.length} value={progressValue} />
          <div className="quiz-play-question">
            <span className="community-eyebrow">{t('quiz.questionLabel', { number: run.currentQuestion + 1 })}</span>
            <h2>{question.prompt}</h2>
          </div>
          <div aria-label={t('quiz.chooseAnswer')} className="quiz-play-options">
            {question.options.map((option, index) => (
              <button
                aria-pressed={selectedAnswer === index}
                className={`quiz-play-option${selectedAnswer === index ? ' quiz-play-option--selected' : ''}`}
                key={`${index}-${option}`}
                onClick={() => selectAnswer(index)}
                type="button"
              >
                <span>{String.fromCharCode(65 + index)}</span>{option}
                {selectedAnswer === index && <Check aria-hidden="true" size={18} />}
              </button>
            ))}
          </div>
          {showError && <p className="quiz-form-error" role="alert">{t('quiz.unanswered')}</p>}
          <div className="quiz-play-footer">
            <span>{t('quiz.remaining', { count: run.quiz.questions.length - run.currentQuestion - 1 })}</span>
            <Button onClick={nextQuestion} type="button">
              {run.currentQuestion === run.quiz.questions.length - 1 ? t('quiz.seeResult') : t('quiz.nextQuestion')} <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function QuizResultsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const result = getQuizResult()
  const percentage = result ? Math.round((result.score / result.total) * 100) : 0

  function retry() {
    if (!result || !startQuiz(result.quiz.id)) return
    navigate(`/quiz/play?id=${encodeURIComponent(result.quiz.id)}`)
  }

  return (
    <ResponsiveLayout title={t('quiz.resultsTitle')}>
      <div className="quiz-page">
        {result ? (
          <section className="quiz-result-card">
            <span className="quiz-result-icon"><Trophy aria-hidden="true" size={31} /></span>
            <span className="community-eyebrow">{t('quiz.completed')}</span>
            <h2>{percentage >= 80 ? t('quiz.excellent') : percentage >= 50 ? t('quiz.good') : t('quiz.keepGoing')}</h2>
            <p>{result.quiz.title}</p>
            <div className="quiz-result-score"><strong>{result.score}</strong><span>{t('quiz.correctAnswers', { total: result.total })}</span></div>
            <ProgressBar label={t('quiz.yourScore')} max={result.total} value={result.score} />
            <div className="quiz-result-actions">
              <Button onClick={retry} type="button"><RotateCcw aria-hidden="true" size={17} /> {t('quiz.retry')}</Button>
              <Button onClick={() => navigate('/quiz')} type="button" variant="secondary">{t('quiz.exploreMore')}</Button>
            </div>
            <div className="quiz-result-review">
              <h3>{t('quiz.takeaways')}</h3>
              {result.quiz.questions.map((item, index) => {
                const correct = result.answers[index] === item.correctAnswer
                return (
                  <article className={`quiz-review-item${correct ? ' quiz-review-item--correct' : ''}`} key={index}>
                    <span>{correct ? <Check aria-label={t('quiz.correctAnswer')} size={17} /> : <X aria-label={t('quiz.incorrect')} size={17} />}</span>
                    <div><strong>{item.prompt}</strong><p>{item.explanation}</p></div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : (
          <EmptyState action={<Link to="/quiz">{t('quiz.explore')}</Link>} description={t('quiz.noResultDescription')} title={t('quiz.noResult')} />
        )}
      </div>
    </ResponsiveLayout>
  )
}
