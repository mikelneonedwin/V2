export default defineNuxtRouteMiddleware((to) => {
    if(to.path != "/" && to.path != "/lib") return;
    if(process.client) return;
    const signed = useCookie('_cid');
    if(!signed.value) return navigateTo('/signup');
    return;
})