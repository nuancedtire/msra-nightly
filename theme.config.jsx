export default {
  logo: <span>Medical Notes</span>,
  project: {
    link: 'https://github.com/yourusername/yourrepo'
  },
  docsRepositoryBase: 'https://github.com/yourusername/yourrepo',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Medical Notes'
    }
  }
}
