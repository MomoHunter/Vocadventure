#!/usr/bin/env sh

# abort on errors
set -e

# build scss files
sass sass/darkly.bw.scss public/css/darkly.bw.min.css --style=compressed
sass sass/cerulean.bw.scss public/css/cerulean.bw.min.css --style=compressed
sass sass/slate.bw.scss public/css/slate.bw.min.css --style=compressed

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/MomoHunter/Vocadventure.git master

cd -

rm -rf tmp/*
cp -r dist tmp/Vocadventure

cd tmp

livereload