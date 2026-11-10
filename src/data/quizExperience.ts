import { quizzes, type Quiz } from './quizzes'

export interface QuizQuestion {
  prompt: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface ExperienceQuiz extends Quiz {
  id: string
  questions: QuizQuestion[]
  isMine: boolean
}

export interface QuizDraft {
  id?: string
  title: string
  description: string
  topic: string
  difficulty: Quiz['difficulty']
  questions: QuizQuestion[]
}

export interface QuizRun {
  quiz: ExperienceQuiz
  answers: Array<number | null>
  currentQuestion: number
}

export interface QuizResult {
  quiz: ExperienceQuiz
  answers: Array<number | null>
  score: number
  total: number
}

const starterQuestions: Record<string, QuizQuestion[]> = {
  'javascript-fundamentals': [
    { prompt: 'Quelle déclaration crée une variable dont la valeur peut changer ?', options: ['const', 'let', 'static', 'final'], correctAnswer: 1, explanation: '`let` déclare une variable réassignable, contrairement à `const`.' },
    { prompt: 'Que renvoie `typeof null` en JavaScript ?', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correctAnswer: 2, explanation: 'C’est une particularité historique du langage : `typeof null` renvoie `"object"`.' },
    { prompt: 'Quelle méthode transforme les éléments d’un tableau ?', options: ['map()', 'find()', 'some()', 'join()'], correctAnswer: 0, explanation: '`map()` crée un nouveau tableau en transformant chaque élément.' },
    { prompt: 'Quel opérateur teste une égalité stricte ?', options: ['=', '==', '===', '=>'], correctAnswer: 2, explanation: '`===` compare la valeur et le type sans coercition.' },
    { prompt: 'Que fait `Array.isArray(value)` ?', options: ['Trie un tableau', 'Vérifie si une valeur est un tableau', 'Copie un tableau', 'Retourne sa longueur'], correctAnswer: 1, explanation: '`Array.isArray()` renvoie un booléen indiquant si la valeur est un tableau.' },
  ],
  'css-layouts': [
    { prompt: 'Quel modèle convient le mieux pour aligner des éléments sur une ligne ?', options: ['Grid', 'Flexbox', 'Float', 'Table'], correctAnswer: 1, explanation: 'Flexbox est pensé pour la disposition et l’alignement sur un axe.' },
    { prompt: 'Quelle propriété active CSS Grid ?', options: ['position: grid', 'layout: grid', 'display: grid', 'grid: on'], correctAnswer: 2, explanation: 'Un conteneur Grid utilise `display: grid`.' },
    { prompt: 'Quelle unité s’adapte à la taille de la fenêtre ?', options: ['px', 'rem', 'vw', 'pt'], correctAnswer: 2, explanation: '`vw` représente un pourcentage de la largeur du viewport.' },
    { prompt: 'Quelle propriété définit l’espace entre les pistes Grid ?', options: ['padding', 'gap', 'spacing', 'margin-inner'], correctAnswer: 1, explanation: '`gap` crée un espace entre lignes et colonnes.' },
    { prompt: 'Comment éviter qu’une colonne Grid déborde avec son contenu ?', options: ['minmax(0, 1fr)', 'width: auto', 'overflow: visible', 'flex: none'], correctAnswer: 0, explanation: '`minmax(0, 1fr)` autorise la piste à rétrécir sous la taille minimale intrinsèque.' },
  ],
  'git-advanced': [
    { prompt: 'Quelle commande crée une branche et bascule dessus ?', options: ['git branch --move', 'git switch -c nom', 'git merge nom', 'git fetch -c nom'], correctAnswer: 1, explanation: '`git switch -c` crée une branche puis la sélectionne.' },
    { prompt: 'Que fait `git rebase main` sur une branche ?', options: ['Supprime main', 'Rejoue ses commits au-dessus de main', 'Crée un tag', 'Annule tous les commits'], correctAnswer: 1, explanation: 'Le rebase rejoue les commits de la branche sur la base de `main`.' },
    { prompt: 'Quelle commande affiche les changements non indexés ?', options: ['git status', 'git tag', 'git log --all', 'git remote'], correctAnswer: 0, explanation: '`git status` décrit les modifications de l’arbre de travail et de l’index.' },
    { prompt: 'Comment retirer le dernier commit tout en gardant les fichiers modifiés ?', options: ['git reset --soft HEAD~1', 'git clean -fd', 'git checkout -- .', 'git stash drop'], correctAnswer: 0, explanation: '`git reset --soft` déplace HEAD tout en gardant les changements dans l’index.' },
    { prompt: 'Quel est le rôle de `git fetch` ?', options: ['Fusionner tout de suite', 'Récupérer les références distantes sans fusionner', 'Créer un commit', 'Pousser une branche'], correctAnswer: 1, explanation: '`git fetch` actualise les références distantes sans modifier la branche courante.' },
  ],
}

const ownedQuizzes: ExperienceQuiz[] = []
let draft: QuizDraft = emptyDraft()
let activeRun: QuizRun | null = null
let lastResult: QuizResult | null = null

function emptyQuestion(): QuizQuestion {
  return { prompt: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
}

function emptyDraft(): QuizDraft {
  return {
    title: '',
    description: '',
    topic: 'JavaScript',
    difficulty: 'Débutant',
    questions: [emptyQuestion()],
  }
}

function copyQuestion(question: QuizQuestion): QuizQuestion {
  return { ...question, options: [...question.options] }
}

function copyQuiz(quiz: ExperienceQuiz): ExperienceQuiz {
  return { ...quiz, questions: quiz.questions.map(copyQuestion) }
}

export function getQuizCatalog(): ExperienceQuiz[] {
  const builtIn = quizzes.map((quiz) => ({
    ...quiz,
    questions: (starterQuestions[quiz.id] ?? []).map(copyQuestion),
    isMine: false,
  }))
  return [...ownedQuizzes.map(copyQuiz), ...builtIn]
}

export function getExperienceQuiz(id: string): ExperienceQuiz | undefined {
  const quiz = getQuizCatalog().find((item) => item.id === id)
  return quiz
}

export function getOwnedQuizzes(): ExperienceQuiz[] {
  return ownedQuizzes.map(copyQuiz)
}

export function getQuizDraft(): QuizDraft {
  return { ...draft, questions: draft.questions.map(copyQuestion) }
}

export function updateQuizDraft(nextDraft: QuizDraft) {
  draft = { ...nextDraft, questions: nextDraft.questions.map(copyQuestion) }
}

export function createQuizDraft() {
  draft = emptyDraft()
  return getQuizDraft()
}

export function editQuizDraft(id: string) {
  const quiz = ownedQuizzes.find((item) => item.id === id)
  if (!quiz) return false
  draft = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questions: quiz.questions.map(copyQuestion),
  }
  return true
}

export function validateQuizDraft(value = draft): string | null {
  if (value.title.trim().length < 4) return 'Le titre doit contenir au moins 4 caractères.'
  if (value.description.trim().length < 12) return 'Ajoute une description d’au moins 12 caractères.'
  if (value.questions.length === 0) return 'Ajoute au moins une question.'
  if (value.questions.some((question) => question.prompt.trim().length < 8)) {
    return 'Chaque question doit contenir au moins 8 caractères.'
  }
  if (value.questions.some((question) =>
    question.options.filter((option) => option.trim()).length < 2,
  )) {
    return 'Chaque question doit proposer au moins deux réponses.'
  }
  if (value.questions.some((question) => !question.explanation.trim())) {
    return 'Ajoute une explication pour chaque bonne réponse.'
  }
  return null
}

export function publishQuizDraft(): { quiz?: ExperienceQuiz; error?: string } {
  const error = validateQuizDraft()
  if (error) return { error }

  const quiz: ExperienceQuiz = {
    id: draft.id ?? `quiz-${Date.now().toString(36)}`,
    title: draft.title.trim(),
    description: draft.description.trim(),
    topic: draft.topic.trim() || 'Développement',
    difficulty: draft.difficulty,
    questionCount: draft.questions.length,
    durationMinutes: Math.max(1, Math.ceil(draft.questions.length * 0.6)),
    plays: 0,
    author: 'Toi',
    questions: draft.questions.map(copyQuestion),
    isMine: true,
  }

  const existingIndex = ownedQuizzes.findIndex((item) => item.id === quiz.id)
  if (existingIndex < 0) ownedQuizzes.unshift(quiz)
  else ownedQuizzes[existingIndex] = quiz
  draft = { ...draft, id: quiz.id }
  return { quiz: copyQuiz(quiz) }
}

export function startQuiz(id: string): QuizRun | null {
  const quiz = getExperienceQuiz(id)
  if (!quiz) return null
  activeRun = {
    quiz,
    answers: quiz.questions.map(() => null),
    currentQuestion: 0,
  }
  return getQuizRun()
}

export function getQuizRun(): QuizRun | null {
  return activeRun
    ? { ...activeRun, quiz: copyQuiz(activeRun.quiz), answers: [...activeRun.answers] }
    : null
}

export function chooseQuizAnswer(answerIndex: number): QuizRun | null {
  if (!activeRun || answerIndex < 0 || answerIndex >= (activeRun.quiz.questions[activeRun.currentQuestion]?.options.length ?? 0)) {
    return getQuizRun()
  }
  activeRun.answers[activeRun.currentQuestion] = answerIndex
  return getQuizRun()
}

export function advanceQuiz(): 'unanswered' | 'next' | 'completed' {
  if (!activeRun || activeRun.answers[activeRun.currentQuestion] === null) return 'unanswered'
  if (activeRun.currentQuestion < activeRun.quiz.questions.length - 1) {
    activeRun.currentQuestion += 1
    return 'next'
  }

  const score = activeRun.quiz.questions.reduce(
    (total, question, index) => total + Number(activeRun?.answers[index] === question.correctAnswer),
    0,
  )
  lastResult = {
    quiz: copyQuiz(activeRun.quiz),
    answers: [...activeRun.answers],
    score,
    total: activeRun.quiz.questions.length,
  }
  activeRun = null
  return 'completed'
}

export function getQuizResult(): QuizResult | null {
  return lastResult
    ? { ...lastResult, quiz: copyQuiz(lastResult.quiz), answers: [...lastResult.answers] }
    : null
}
