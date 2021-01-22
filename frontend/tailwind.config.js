module.exports = {
  purge: [
      './public/**/*.html',
      './src/**/*.vue',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary': '#0D1D3E',
        'accent': '#E69B59',
        'icon': '#6992BB'
      }
    },
  },
  variants: {
    extend: {},
  },
}
