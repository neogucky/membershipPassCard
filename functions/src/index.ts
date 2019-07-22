import * as functions from 'firebase-functions';
const { Pass } = require("passkit-generator");

enum Gym {
    kletterwerk = "Kletterwerk Lübeck",
    boulderquartier = "Boulderquartier Hamburg",
    boulderwerk = "Boulderwerk Norderstedt"
}

export const generateFromStream = functions.https.onRequest((req, res) => {

    let model;
    switch (req.params.gym) {
        case 'kletterwerk':
            model = './generator-hl.pass';
            break;
        case 'boulderquartier':
            model = './generator-hh.pass';
            break;
        default:
            model = './generator.pass';
    }

    const applePass = new Pass({
        model: model,
        certificates: {
            wwdr: "./certs/wwdr.pem",
            signerCert: "./certs/signercert.pem",
            signerKey: {
                keyFile: "./certs/signerkey.pem",
                passphrase: "secret123"
            }
        },
        // if true, existing keys added through methods get overwritten
        // pushed in queue otherwise.
        shouldOverwrite: true
    });

    // Adding some settings to be written inside pass.json
    applePass.barcode([{
        message: req.query.id,
        format: "PKBarcodeFormatCode128"
    }]);

    if (req.query.name !== '') {
        applePass.secondaryFields.push({
            "key": "member",
            "value": req.query.name
        });
    }

    if (req.query.gym !== '' && req.query.gym !== 'other') {
        applePass.auxiliaryFields.push({
            "key": "location",
            "value": Gym[req.query.gym]
        });
    }

    res.set({
        "Content-type": "application/vnd.apple.pkpass",
        "Content-disposition": "attachment; filename=membershippass.pkpass"
    });

    applePass.generate()
        .then((stream : any) => {
            const watchdog = stream.pipe(res);

            watchdog.on('finish', () => {
                console.log('Finish event emitted');
                res.end();
            });
        })
        .catch((err : any) => {
            console.error(err);
        });
});
