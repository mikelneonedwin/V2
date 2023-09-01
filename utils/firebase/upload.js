import { storage } from './init.js';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';


export function uploadBase64(path, dataurl){
    return new Promise((res, rej) => {
        uploadString(ref(storage, path), dataurl, 'data_url')
            .then(async snapshot => res(await getDownloadURL(snapshot.ref)))
            .catch(rej);
            
    })
}