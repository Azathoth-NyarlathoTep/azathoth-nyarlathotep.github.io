MathJax = {
  loader: { load: ['[tex]/physics','ui/lazy',] },
  tex: {
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ],
    packages: {'[+]': ['physics']},
    tags: 'ams',
    macros: {
        'e': '\\mathrm{e}',
        'RR': '\\mathbb{R}',
        'ZZ': '\\mathbb{Z}',
        'QQ': '\\mathbb{Q}',
      },
  }
  options: {
    lazyMargin: '200px',
  },
  svg: { fontCache: 'global'},
};
