   import { useRouter } from "next/router";

   // Functions to handle redirection to Flask app's authentication endpoints
   const router = useRouter();

   export function signIn() {
     router.push('http://localhost:5328/login');
   }

   export function signOut() {
     router.push('http://localhost:5328/logout');
   }

   export function auth() {
     router.push('http://localhost:5328/');
   }