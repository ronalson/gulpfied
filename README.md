# Gulp Build Configuration

This is a gulp configuration process that I learned from [CSS Tricks - Gulp For Beginners](https://css-tricks.com/gulp-for-beginners/) Tutorial. The original repo can be found [here](https://github.com/zellwk/gulp-starter-csstricks);

## Tools

### Local Development
- sass
- autoprefixer
- browser-sync

### Optimization and Distribution
- JS -> concatenation (useref) and minification (uglify)
- CSS -> concatenation (useref) and minification (cssnano)
- Image optimization (imagemin)

### Responsive images
This build also includes a pre-configuration (commented out) for using gulp-responsive to generate responsive images. However for each project a proper output must be written.

## Default Tasks

1. `gulp` => compiles sass, add autoprefixers and starts a server with browser-sync.
1. `build` => runs all optimization tasks and create a folder structure inside the _dist_ directory
