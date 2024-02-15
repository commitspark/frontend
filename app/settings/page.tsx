import PageShell from '../../components/shell/PageShell'
import TextMenuSide from '../../components/shell/TextMenuSide'
import AiSettings from '../../components/settings/AiSettings'
import PageHeading from '../../components/PageHeading'

interface SettingsPageParams {}

export default async function SettingsPage({
  params,
}: {
  params: SettingsPageParams
}) {
  return (
    <>
      <PageShell>
        <div className="max-w-5xl w-full mx-auto">
          <div className={'w-full border-b app-border-color px-4'}>
            <PageHeading title={'Settings'} />
          </div>
          <div className={'py-8 flex flex-row gap-x-16'}>
            <TextMenuSide
              menuEntries={[
                {
                  label: 'AI',
                  href: '#',
                  iconName: 'LightBulbIcon',
                  isSelected: true,
                },
              ]}
            />
            <AiSettings className={'flex-grow'} />
          </div>
        </div>
      </PageShell>
    </>
  )
}
