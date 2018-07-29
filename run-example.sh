#!/bin/bash
# we have to do this outside the repo root otherwise rn packager breaks
cd ../
exp init react-native-htmlview-example --template blank
cd react-native-htmlview-example
mkdir htmlview
cp -a ../react-native-htmlview/ ./react-native-htmlview/

cat <<- EOF > ./App.js
import Example from './react-native-htmlview/example/Example';
export default Example;
EOF

yarn start