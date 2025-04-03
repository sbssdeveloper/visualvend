echo -e $PWD

scp -rf package.json config/web/package.json

yarn start