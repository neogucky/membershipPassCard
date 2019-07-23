# Membership Pass Card

## Mission
This PWA (Progressive Web App) was developed as a case study for digitizing the membership cards of a local climbing gym as Apple Wallet Passes

## Architecture
As a PWA framework Ionic 4 was chosen. Since existing Apple Wallet Pass generators are available as NodeJS modules a backend was needed. Both PWA and NodeBackend are hosted on firebase (Firebase Hosting + Firebase Functions) which integrated quite nicely.

- NodeJS files are located in the functions folder
- relevant PWA logic can be found in src/app

## How does it work?
The QuaggaJS barcode scanner library (https://serratus.github.io/quaggaJS/) is used to scan the barcodes on existing physical membership cards. The barcode is transmitted alongside optional data to the NodeJS-Functions where the NodeJS Module passkit-generator (https://www.npmjs.com/package/passkit-generator) generates a signed pass.

## How to fork this
I hope people with similar needs will find this helpful, may it be as an example or by forking it. The following steps are needed to get it to work:

1. initialize this as a firebase app, you will need to follow the steps here: https://firebase.google.com/docs/hosting/quickstart and here https://firebase.google.com/docs/functions/get-started
2. add firebase config to src/environments (at least in environments.prod.ts it is needed)
3. install all modules (npm install)
4. Configure the signing certificates for Apple Wallet Passes - this is a bit tricky, I recommend to read both the manual of passkit-generator and the official apple manual (https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/PassKit_PG/YourFirst.html#//apple_ref/doc/uid/TP40012195-CH2-SW1)
4.1 Due to security reasons there is a folder /functions/certs/ missing in the repository

If you get stuck feel free to ask!
