module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    plugins: {
        autoprefixer: {},
        'postcss-nesting': {},
        'postcss-normalize': {},
    },
};
