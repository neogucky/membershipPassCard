import * as functions from 'firebase-functions';


export const generate = functions.https.onCall((data, context) => {
    return "Will generate pass for id: " + data.id;
});
