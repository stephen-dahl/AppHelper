# AppHelper

Helper functions shared by React and NextJS Apps

## To Test

1. In the AppHelper folder run `npm link ../../Chums/ChumsApp/node_modules/react ../../Chums/ChumsApp/node_modules/react-dom ../../Chums/ChumsApp/node_modules/react-router-dom` plugging, in the path to the app you plan to test with.
2. Run `npm build` and `npm link` in AppHelper folder
3. Switch to the test project folder and run `npm link @churchapps/apphelper` to point to your local copy
4. Run `npm start` or `npm run dev` within your test project

### Alternatively

1. Run `npm build` and `npm pack` in AppHelper folder
2. In your project folder point to the .tgz file like so `"@churchapps/apphelper": "file:../../packages/AppHelper/churchapps-apphelper-0.0.24.tgz"`. Your path may be different.
3. Run `npm i` on your test project.

## To Publish

1. Update version number in package.json
2. Run `npm run build`
3. Run `npm publish --access=public`
