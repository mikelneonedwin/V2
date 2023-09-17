import { getUser } from "~/utils/firebase/user";

export default defineEventHandler(async event => {
    const userId = getCookie(event, '_cid');
    if(!userId){
        setResponseStatus(event, 404, 'User not found!');
        return 'User not found!';
    }
    const userData = await getUser(userId);
    const upl = Object.keys(userData.uploads || {});
    return upl.map(a => a.padStart(2, 0)).sort().map(Number);
})