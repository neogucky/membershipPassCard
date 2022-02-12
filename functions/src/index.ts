import * as functions from 'firebase-functions';
import { PKPass } from "passkit-generator";
import * as fs from "fs"
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

enum Gym {
    kletterwerk = "Kletterwerk Lübeck",
    boulderquartier = "Boulderquartier Hamburg",
    boulderwerk = "Boulderwerk Norderstedt",
    other = "other",
}

export const generateFromStream = functions.https.onRequest(async (req, res) => {
    const model = './generator.pass';

    const [ signerCert, signerKey, wwdr ] = await Promise.all([
        readFile("./certs/signercert.pem"),
        readFile("./certs/signerkey.pem"),
        readFile("./certs/wwdr.pem"),
    ]);

    const applePass = await PKPass.from({
        model,
        certificates: {
            signerCert,
            signerKey,
            signerKeyPassphrase: "secret123",
            wwdr,
        }
    }, {
        serialNumber: Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7),
        maxDistance: 100
    });

    // Adding some settings to be written inside pass.json
    applePass.setBarcodes({
        message: req.query.id,
        format: "PKBarcodeFormatCode128"
    });

    switch (req.query.gym) {
        case 'kletterwerk':
            applePass.setLocations({
                longitude : 10.675696,
                latitude : 53.849518
            });

            break;
        case 'boulderquartier':
            applePass.setLocations({
                longitude: 10.080086,
                latitude: 53.577296
            });

            break;
        case 'boulderwerk':
            applePass.setLocations({
                longitude: 9.979970,
                latitude: 53.662212
            });

            break;
    }

    if (req.query.name !== '') {
        applePass.secondaryFields.push({
            "key": "member",
            "value": req.query.name
        });
    }

    if (req.query.gym !== '' && req.query.gym !== Gym.other) {
        applePass.auxiliaryFields.push({
            "key": "location",
            "value": Gym[req.query.gym as keyof typeof Gym]
        });
    }

    res.set({
        "Content-type": applePass.mimeType,
        "Content-disposition": "attachment; filename=membershippass.pkpass"
    });

    const passStream = applePass.getAsStream();
    const watchdog = passStream.pipe(res);

    watchdog.on('finish', () => {
        console.log('Finish event emitted');
        res.end();
    });
});
