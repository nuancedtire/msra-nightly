export default {
  logo: <span>MSRA.uk</span>,
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MSRA Study Notes'
    }
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
