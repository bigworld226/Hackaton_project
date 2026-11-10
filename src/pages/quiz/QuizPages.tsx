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
import { useState } from 'react'
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
  return (
    <article className={`quiz-card${compact ? ' quiz-card--compact' : ''}`}>
      <div className="quiz-card-topline">
        <span className="quiz-topic-icon"><Code2 aria-hidden="true" size={19} /></span>
        <Badge>{quiz.topic}</Badge>
        <Badge variant={difficultyVariants[quiz.difficulty]}>{quiz.difficulty}</Badge>
      </div>
      <div className="quiz-card-copy">
        <h3>{quiz.title}</h3>
        <p>{quiz.description}</p>
      </div>
      <div className="quiz-card-meta">
        <span><ListChecks aria-hidden="true" size={15} /> {quiz.questions.length} questions</span>
        <span><Clock3 aria-hidden="true" size={15} /> {quiz.durationMinutes} min</span>
        {!quiz.isMine && <span>{quiz.plays.toLocaleString('fr-FR')} parties</span>}
      </div>
      <Link className="quiz-card-link" to={`/quiz/${quiz.id}`}>
        {quiz.isMine ? 'Gérer le quiz' : 'Découvrir le quiz'} <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  )
}

export function QuizHubPage() {
  const [topic, setTopic] = useState('Tout')
  const topics = ['Tout', ...new Set(getQuizCatalog().map((quiz) => quiz.topic))]
  const visibleQuizzes = getQuizCatalog().filter((quiz) => topic === 'Tout' || quiz.topic === topic)

  function beginCreation() {
    createQuizDraft()
  }

  return (
    <ResponsiveLayout title="Quiz dev">
      <div className="quiz-page">
        <QuizIntro
          description="Mets tes connaissances à l’épreuve, découvre de nouveaux concepts et progresse avec la communauté."
          eyebrow="Apprendre en jouant"
          title="Un petit défi entre deux lignes de code ?"
        />
        <div className="quiz-hub-actions">
          <Link className="quiz-secondary-link" to="/quiz/mine"><BookOpenCheck aria-hidden="true" size={18} /> Mes quiz</Link>
          <Link className="quiz-create-link" onClick={beginCreation} to="/quiz/editor"><Plus aria-hidden="true" size={18} /> Créer un quiz</Link>
        </div>
        <section aria-label="Quiz à découvrir" className="quiz-catalog-section">
          <div className="quiz-section-heading">
            <div>
              <span className="community-eyebrow">À toi de jouer</span>
              <h2>Quiz de la communauté</h2>
            </div>
            <span className="quiz-count">{visibleQuizzes.length} quiz</span>
          </div>
          <Tabs
            items={topics.map((item) => ({ label: item, value: item }))}
            onValueChange={setTopic}
            value={topic}
          />
          {visibleQuizzes.length ? (
            <div className="quiz-grid">
              {visibleQuizzes.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
            </div>
          ) : (
            <EmptyState description="Essaie un autre thème ou crée le premier quiz de cette catégorie." title="Aucun quiz dans ce thème" />
          )}
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function MyQuizzesPage() {
  const owned = getOwnedQuizzes()

  function beginCreation() {
    createQuizDraft()
  }

  return (
    <ResponsiveLayout title="Mes quiz">
      <div className="quiz-page">
        <QuizIntro
          description="Retrouve tes créations, peaufine-les ou partage-les avec les développeurs."
          eyebrow="Ton atelier"
          title="Mes quiz"
        />
        {owned.length ? (
          <div className="quiz-grid">
            {owned.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)}
          </div>
        ) : (
          <EmptyState
            action={<Link className="quiz-create-link" onClick={beginCreation} to="/quiz/editor"><Plus aria-hidden="true" size={17} /> Créer mon premier quiz</Link>}
            description="Crée un quiz pour partager tes connaissances et aider d’autres devs à progresser."
            icon={<Lightbulb aria-hidden="true" size={25} />}
            title="Tu n’as pas encore créé de quiz"
          />
        )}
      </div>
    </ResponsiveLayout>
  )
}

export function QuizDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const quiz = getExperienceQuiz(id)

  function playQuiz() {
    if (!startQuiz(id)) return
    navigate(`/quiz/play?id=${encodeURIComponent(id)}`)
  }

  return (
    <ResponsiveLayout title={quiz?.title ?? 'Quiz introuvable'}>
      <div className="quiz-page">
        {quiz ? (
          <section className="quiz-detail-card">
            <Link className="quiz-back-link" to="/quiz"><ArrowLeft aria-hidden="true" size={16} /> Tous les quiz</Link>
            <span className="quiz-topic-icon quiz-topic-icon--large"><Code2 aria-hidden="true" size={25} /></span>
            <div className="quiz-detail-badges">
              <Badge>{quiz.topic}</Badge>
              <Badge variant={difficultyVariants[quiz.difficulty]}>{quiz.difficulty}</Badge>
            </div>
            <h2>{quiz.title}</h2>
            <p className="quiz-detail-description">{quiz.description}</p>
            <div className="quiz-detail-stats">
              <span><ListChecks aria-hidden="true" size={18} /><strong>{quiz.questions.length}</strong> questions</span>
              <span><Clock3 aria-hidden="true" size={18} /><strong>{quiz.durationMinutes}</strong> min</span>
              <span><Trophy aria-hidden="true" size={18} />Créé par <strong>{quiz.author}</strong></span>
            </div>
            <div className="quiz-detail-note">
              <CircleHelp aria-hidden="true" size={20} />
              <p>Choisis une réponse à chaque question. Tu découvriras ton résultat et les explications à la fin.</p>
            </div>
            <div className="quiz-detail-actions">
              <Button onClick={playQuiz} type="button">Lancer le quiz <ArrowRight aria-hidden="true" size={18} /></Button>
              {quiz.isMine && (
                <Button
                  onClick={() => {
                    if (editQuizDraft(quiz.id)) navigate('/quiz/editor')
                  }}
                  type="button"
                  variant="secondary"
                >
                  Modifier mon quiz
                </Button>
              )}
            </div>
          </section>
        ) : (
          <EmptyState action={<Link to="/quiz">Explorer les quiz</Link>} description="Ce quiz n’existe pas ou n’est plus disponible." title="Quiz introuvable" />
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
      setError(validationError)
      return
    }
    navigate('/quiz/preview')
  }

  return (
    <ResponsiveLayout title="Éditeur de quiz">
      <div className="quiz-page quiz-editor-page">
        <QuizIntro
          description="Prépare un défi clair, donne des choix utiles et explique les bonnes réponses."
          eyebrow="Créateur de quiz"
          title="Transmets ce que tu as appris."
        />
        <section className="quiz-editor-card">
          <div className="quiz-editor-fields">
            <Input
              label="Titre du quiz"
              maxLength={90}
              onChange={(event) => updateText('title', event.currentTarget.value)}
              placeholder="Ex. Les fondamentaux de React"
              value={draft.title}
            />
            <div className="ui-field">
              <label className="ui-label" htmlFor="quiz-description">Description</label>
              <textarea
                className="community-textarea quiz-description-input"
                id="quiz-description"
                maxLength={240}
                onChange={(event) => updateText('description', event.currentTarget.value)}
                placeholder="Explique ce que les participants vont apprendre…"
                rows={3}
                value={draft.description}
              />
            </div>
            <div className="quiz-editor-meta">
              <Input
                label="Thème"
                onChange={(event) => updateText('topic', event.currentTarget.value)}
                placeholder="Ex. React"
                value={draft.topic}
              />
              <div className="ui-field">
                <label className="ui-label" htmlFor="quiz-difficulty">Difficulté</label>
                <select
                  className="ui-input"
                  id="quiz-difficulty"
                  onChange={(event) => update({ ...draft, difficulty: event.currentTarget.value as Quiz['difficulty'] })}
                  value={draft.difficulty}
                >
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </select>
              </div>
            </div>
          </div>
          <div className="quiz-question-editor-heading">
            <div><h3>Questions</h3><span>{draft.questions.length} question{draft.questions.length > 1 ? 's' : ''}</span></div>
            <Button
              onClick={() => update({ ...draft, questions: [...draft.questions, { prompt: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }] })}
              type="button"
              variant="secondary"
            >
              <Plus aria-hidden="true" size={17} /> Ajouter une question
            </Button>
          </div>
          <div className="quiz-question-editor-list">
            {draft.questions.map((question, index) => (
              <fieldset className="quiz-question-editor" key={index}>
                <legend>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  Question {index + 1}
                  {draft.questions.length > 1 && (
                    <button
                      aria-label={`Supprimer la question ${index + 1}`}
                      className="quiz-remove-question"
                      onClick={() => update({ ...draft, questions: draft.questions.filter((_, current) => current !== index) })}
                      type="button"
                    ><X aria-hidden="true" size={17} /></button>
                  )}
                </legend>
                <div className="ui-field">
                  <label className="ui-label" htmlFor={questionLabelId(index, 'prompt')}>Énoncé</label>
                  <textarea
                    className="community-textarea quiz-question-prompt"
                    id={questionLabelId(index, 'prompt')}
                    onChange={(event) => updateQuestionField(index, 'prompt', event.currentTarget.value)}
                    placeholder="Pose une question précise…"
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
                          aria-label={`Marquer la réponse ${optionIndex + 1} comme correcte`}
                          checked={question.correctAnswer === optionIndex}
                          name={`correct-answer-${index}`}
                          onChange={() => updateQuestionField(index, 'correctAnswer', optionIndex)}
                          type="radio"
                        />
                        <label className="sr-only" htmlFor={inputId}>Réponse {optionIndex + 1}</label>
                        <input
                          className="ui-input"
                          id={inputId}
                          onChange={(event) => updateOption(index, optionIndex, event.currentTarget.value)}
                          placeholder={`Réponse ${optionIndex + 1}`}
                          value={option}
                        />
                        {question.correctAnswer === optionIndex && <Check aria-label="Bonne réponse" size={17} />}
                      </div>
                    )
                  })}
                </div>
                <Input
                  label="Explication de la bonne réponse"
                  onChange={(event) => updateQuestionField(index, 'explanation', event.currentTarget.value)}
                  placeholder="Pourquoi cette réponse est-elle correcte ?"
                  value={question.explanation}
                />
              </fieldset>
            ))}
          </div>
          {error && <p className="quiz-form-error" role="alert">{error}</p>}
          <div className="quiz-editor-actions">
            <Link className="quiz-back-link" to="/quiz"><ArrowLeft aria-hidden="true" size={16} /> Annuler</Link>
            <Button onClick={handlePreview} type="button">Prévisualiser <ArrowRight aria-hidden="true" size={17} /></Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function QuizPreviewPage() {
  const navigate = useNavigate()
  const draft = getQuizDraft()
  const error = validateQuizDraft(draft)
  const [publishError, setPublishError] = useState('')

  function publish() {
    const result = publishQuizDraft()
    if (!result.quiz) {
      setPublishError(result.error ?? 'Impossible de publier ce quiz.')
      return
    }
    navigate('/quiz/mine')
  }

  return (
    <ResponsiveLayout title="Aperçu du quiz">
      <div className="quiz-page">
        {error ? (
          <EmptyState
            action={<Link className="quiz-create-link" to="/quiz/editor">Reprendre l’édition</Link>}
            description={error}
            title="Le quiz n’est pas encore prêt"
          />
        ) : (
          <section className="quiz-preview-card">
            <Link className="quiz-back-link" to="/quiz/editor"><ArrowLeft aria-hidden="true" size={16} /> Modifier le quiz</Link>
            <div className="quiz-preview-cover"><Sparkles aria-hidden="true" size={30} /><span>{draft.topic}</span></div>
            <Badge variant={difficultyVariants[draft.difficulty]}>{draft.difficulty}</Badge>
            <h2>{draft.title}</h2>
            <p>{draft.description}</p>
            <div className="quiz-detail-stats">
              <span><ListChecks aria-hidden="true" size={18} /><strong>{draft.questions.length}</strong> questions</span>
              <span><Clock3 aria-hidden="true" size={18} /><strong>{Math.max(1, Math.ceil(draft.questions.length * 0.6))}</strong> min</span>
              <span><Trophy aria-hidden="true" size={18} /><strong>Toi</strong></span>
            </div>
            <h3>Un aperçu des questions</h3>
            <ol className="quiz-preview-questions">
              {draft.questions.map((question, index) => (
                <li key={index}>
                  <strong>{question.prompt}</strong>
                  <span>{question.options.filter((option) => option.trim()).length} choix de réponse</span>
                </li>
              ))}
            </ol>
            {publishError && <p className="quiz-form-error" role="alert">{publishError}</p>}
            <div className="quiz-detail-actions">
              <Button onClick={publish} type="button"><Check aria-hidden="true" size={17} /> Publier le quiz</Button>
              <Button onClick={() => navigate('/quiz/editor')} type="button" variant="secondary">Continuer à modifier</Button>
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
      <ResponsiveLayout title="Jouer au quiz">
        <div className="quiz-page"><EmptyState action={<Link to="/quiz">Retour aux quiz</Link>} description="Choisis un quiz avant de commencer une partie." title="Aucune partie en cours" /></div>
      </ResponsiveLayout>
    )
  }

  return (
    <ResponsiveLayout title="Partie en cours">
      <div className="quiz-page quiz-play-page">
        <section aria-label="Partie de quiz" className="quiz-play-card">
          <div className="quiz-play-topline">
            <Link aria-label="Quitter le quiz" className="quiz-icon-link" to={`/quiz/${run.quiz.id}`}><X aria-hidden="true" size={20} /></Link>
            <span>{run.quiz.title}</span>
            <span>{run.currentQuestion + 1} / {run.quiz.questions.length}</span>
          </div>
          <ProgressBar label="Ta progression" max={run.quiz.questions.length} value={progressValue} />
          <div className="quiz-play-question">
            <span className="community-eyebrow">Question {run.currentQuestion + 1}</span>
            <h2>{question.prompt}</h2>
          </div>
          <div aria-label="Choisis une réponse" className="quiz-play-options">
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
          {showError && <p className="quiz-form-error" role="alert">Choisis une réponse pour continuer.</p>}
          <div className="quiz-play-footer">
            <span>{run.quiz.questions.length - run.currentQuestion - 1} question{run.quiz.questions.length - run.currentQuestion - 1 === 1 ? '' : 's'} après celle-ci</span>
            <Button onClick={nextQuestion} type="button">
              {run.currentQuestion === run.quiz.questions.length - 1 ? 'Voir mon résultat' : 'Question suivante'} <ArrowRight aria-hidden="true" size={17} />
            </Button>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  )
}

export function QuizResultsPage() {
  const navigate = useNavigate()
  const result = getQuizResult()
  const percentage = result ? Math.round((result.score / result.total) * 100) : 0

  function retry() {
    if (!result || !startQuiz(result.quiz.id)) return
    navigate(`/quiz/play?id=${encodeURIComponent(result.quiz.id)}`)
  }

  return (
    <ResponsiveLayout title="Résultats du quiz">
      <div className="quiz-page">
        {result ? (
          <section className="quiz-result-card">
            <span className="quiz-result-icon"><Trophy aria-hidden="true" size={31} /></span>
            <span className="community-eyebrow">Quiz terminé</span>
            <h2>{percentage >= 80 ? 'Excellent travail !' : percentage >= 50 ? 'Bien joué, continue !' : 'Chaque essai te fait progresser.'}</h2>
            <p>{result.quiz.title}</p>
            <div className="quiz-result-score"><strong>{result.score}</strong><span> / {result.total} bonnes réponses</span></div>
            <ProgressBar label="Ton score" max={result.total} value={result.score} />
            <div className="quiz-result-actions">
              <Button onClick={retry} type="button"><RotateCcw aria-hidden="true" size={17} /> Rejouer</Button>
              <Button onClick={() => navigate('/quiz')} type="button" variant="secondary">Explorer d’autres quiz</Button>
            </div>
            <div className="quiz-result-review">
              <h3>À retenir</h3>
              {result.quiz.questions.map((item, index) => {
                const correct = result.answers[index] === item.correctAnswer
                return (
                  <article className={`quiz-review-item${correct ? ' quiz-review-item--correct' : ''}`} key={index}>
                    <span>{correct ? <Check aria-label="Bonne réponse" size={17} /> : <X aria-label="Mauvaise réponse" size={17} />}</span>
                    <div><strong>{item.prompt}</strong><p>{item.explanation}</p></div>
                  </article>
                )
              })}
            </div>
          </section>
        ) : (
          <EmptyState action={<Link to="/quiz">Explorer les quiz</Link>} description="Lance une partie pour découvrir ton score." title="Pas encore de résultat" />
        )}
      </div>
    </ResponsiveLayout>
  )
}
