export default {
  logo: <span>MSRA Notes</span>,
  project: {
    link: 'https://github.com/yourusername/yourrepo'
  },
  docsRepositoryBase: 'https://github.com/yourusername/yourrepo',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – MSRA Study Notes'
    }
  },
  footer: {
    component: null
  }
}
