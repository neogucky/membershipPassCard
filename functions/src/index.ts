import * as functions from 'firebase-functions';
const { Pass } = require("passkit-generator");

enum Gym {
    kletterwerk = "Kletterwerk Lübeck",
    boulderquartier = "Boulderquartier Hamburg",
    boulderwerk = "Boulderwerk Norderstedt"
}

export const generateFromStream = functions.https.onRequest((req, res) => {

    let model = './generator.pass';

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
        overrides: {
            serialNumber: Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7)
        },
        shouldOverwrite: true
    });

    // Adding some settings to be written inside pass.json
    applePass.barcode([{
        message: req.query.id,
        format: "PKBarcodeFormatCode128"
    }]);

    switch (req.query.gym) {
        case 'kletterwerk':
            applePass.relevance("locations", [{
                longitude : 10.675696,
                latitude : 53.849518
            }]);
            break;
        case 'boulderquartier':
            applePass.relevance("locations", [{
                longitude: 10.080086,
                latitude: 53.577296
            }]);
            break;
    }

    applePass.relevance("maxDistance", 100);

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
