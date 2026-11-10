import { useState } from 'react'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  ProgressBar,
  Skeleton,
  Tabs,
} from '@/components'
import { ResponsiveLayout } from '@/layouts'
import { useTheme } from '@/hooks/useTheme'

const feedTabs = [
  { label: 'Pour vous', value: 'for-you' },
  { label: 'Près de vous', value: 'nearby' },
]

export default function App() {
  useTheme()
  const [activeTab, setActiveTab] = useState(feedTabs[0]?.value ?? 'for-you')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <ResponsiveLayout title="Votre communauté">
      <div className="ui-showcase">
        <section className="ui-showcase-intro">
          <Badge>Communauté de Lisbonne</Badge>
          <h2>Plus proches de votre monde.</h2>
          <p>
            Retrouvez les personnes, les idées et les lieux qui font vivre votre
            communauté.
          </p>
          <div className="ui-showcase-actions">
            <Button>Découvrir ma communauté</Button>
            <Button onClick={() => setIsModalOpen(true)} variant="secondary">
              Voir la modale
            </Button>
          </div>
        </section>

        <section aria-label="Fil de la communauté" className="ui-showcase-section">
          <div className="ui-showcase-section-heading">
            <div>
              <p className="ui-eyebrow">Votre espace local</p>
              <h2>Les conversations du moment</h2>
            </div>
            <Badge variant="success">En direct</Badge>
          </div>

          <Input
            label="Rechercher"
            placeholder="Rechercher une ville, un sujet..."
            type="search"
          />

          <Tabs
            items={feedTabs}
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <div className="ui-showcase-grid">
              <Card
                description={
                  activeTab === 'for-you'
                    ? 'Rencontrez les habitants qui rendent votre ville encore plus accueillante.'
                    : 'Découvrez les idées et les rencontres à quelques rues de chez vous.'
                }
                href="/forums/city"
                title={
                  activeTab === 'for-you'
                    ? 'Les histoires du quartier'
                    : 'Tout près de vous'
                }
              />
              <Card description="Participez à une conversation avec votre communauté." href="/threads/new" title="La vie à Lisbonne">
                <div className="ui-card-footer">
                  <span className="ui-muted-text">12 nouvelles réponses</span>
                  <Badge>Forum local</Badge>
                </div>
              </Card>
            </div>
          </Tabs>
        </section>

        <section aria-label="Votre progression" className="ui-showcase-section ui-progress-card">
          <div className="ui-showcase-section-heading">
            <div>
              <p className="ui-eyebrow">Votre profil</p>
              <h2>Un bon début</h2>
            </div>
            <Badge variant="success">Explorateur</Badge>
          </div>
          <ProgressBar label="Profil complété" value={68} />
        </section>

        <section className="ui-showcase-grid ui-showcase-states">
          <EmptyState
            action={<Button variant="secondary">Trouver ma communauté</Button>}
            description="Vos conversations apparaîtront ici."
            title="Tout commence ici"
          />
          <Skeleton />
        </section>
      </div>
      <Modal
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        title="Quitter sans enregistrer ?"
      >
        Votre brouillon sera conservé sur cet appareil.
      </Modal>
    </ResponsiveLayout>
  )
}
