import Image from 'next/image'

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
    <Image 
      src="/logo.png"
      alt="MSRA.uk"
      width={40}
      height={40}
    />
    <h1 style={{ marginLeft: '10px' }}>MSRA.uk</h1>
  </div>
)

export default {
  logo: Logo,
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MSRA Study Notes'
    }
  },
  search: {
    placeholder: 'Search notes...'
  },
  sidebar: {
    titleComponent: ({ title, type }) => <>{title}</>,
    defaultMenuCollapseLevel: 1,
    toggleButton: true
  },
  toc: {
    float: true,
    title: "Jump to"
  },
  navigation: {
    prev: true,
    next: true
  },
  darkMode: true,
  footer: {
    component: null
  },
  feedback: {
    content: null
  },
  editLink: {
    component: null
  }
}
