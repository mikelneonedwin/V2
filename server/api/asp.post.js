import { getUser } from "~/utils/firebase/user";
import { db } from '~/utils/firebase/init';
import { set, ref as dbRef } from 'firebase/database';
import { uploadBase64 } from "~/utils/firebase/upload";

export default defineEventHandler(async(event) => {
    const userId = getCookie(event, '_cid');
    if(!userId){
        setResponseStatus(event, 404, 'User not found!');
        return 'User not found!';
    }
    const user = (await getUser(userId)).name;
    const form = await readMultipartFormData(event);
    const data = [], files = [];
    for(const entry of form){
        if(entry.filename) files.push(entry);
        else data.push(entry);
    }
    const dbEntry = {};
    data.forEach(origin => {
        dbEntry[origin.name] = origin.data.toString('utf-8');
    })
    const fileEntry = [];
    files.forEach(file => {
        fileEntry.push({
            name: file.filename,
            data: `data:${file.type};base64,${file.data.toString('base64')}`
        })
    })
    dbEntry.files = files.length;
    const { day } = dbEntry;
    let success = true;
    await uploadDaysWork(day, dbEntry, fileEntry, user).catch(console.error)
    .catch(err => {
        console.error(err);
        success = false;
    });
    if(success){ return true } else {
        setResponseStatus(event, 500, 'Error occured');
        return 'Error Occured';
    }
})

export function uploadDaysWork(day, data, files, user){
    day = String(day).padStart(2, 0);
    const dbPath = `users/${user}/uploads/${day}`;
    const stPath = `V2/${user}/${day}/`;
    return new Promise((res, rej) => {
        set(dbRef(db, dbPath), data)
        .then(async() => {
            for(const file of files){
                const path = stPath + file.name;
                try { await uploadBase64(path, file.data) }
                catch (err){return rej(err)};
            }
            return res(true);
        })
        .catch(rej)
    })
}