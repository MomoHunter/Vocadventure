#!/usr/bin/env sh

# abort on errors
set -e

if [ "$1" == "sass" ]
then
# build scss files
#  sass sass/darkly.bw.scss public/css/darkly.bw.min.css --style=compressed
#  sass sass/cerulean.bw.scss public/css/cerulean.bw.min.css --style=compressed
#  sass sass/slate.bw.scss public/css/slate.bw.min.css --style=compressed
#  sass sass/cosmo.bw.scss public/css/cosmo.bw.min.css --style=compressed
#  sass sass/cyborg.bw.scss public/css/cyborg.bw.min.css --style=compressed
#  sass sass/flatly.bw.scss public/css/flatly.bw.min.css --style=compressed
#  sass sass/lumen.bw.scss public/css/lumen.bw.min.css --style=compressed
#  sass sass/darkLumen.scss public/css/darkLumen.min.css --style=compressed
#  sass sass/lux.bw.scss public/css/lux.bw.min.css --style=compressed
#  sass sass/materia.bw.scss public/css/materia.bw.min.css --style=compressed
#  sass sass/nuclear.bw.scss public/css/nuclear.bw.min.css --style=compressed
#  sass sass/solar.bw.scss public/css/solar.bw.min.css --style=compressed
#  sass sass/spacelab.bw.scss public/css/spacelab.bw.min.css --style=compressed
#  sass sass/superhero.bw.scss public/css/superhero.bw.min.css --style=compressed
  sass sass/garium.scss public/css/garium.min.css --style=compressed
fi

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

if [ "$1" == "livereload" ]
then
  livereload
else
  exit
fi