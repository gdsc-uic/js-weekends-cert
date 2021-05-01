<template>
  <p>{{ msg }}</p>
</template>

<script>
import { auth } from '../firebase';
import firebase from 'firebase';

export default {
  mounted() {
    this.verifyConfirmationLink()
      .then(() => {});
  },
  data() {
    return {
      msg: ''
    }
  },
  methods: {
    async verifyConfirmationLink() {
      try {
        if (auth.isSignInWithEmailLink(window.location.href)) {
          await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

          this.$store.commit('togglePageLoading', true);
          let email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            email = window.prompt('Please provide your email for confirmation');
          }

          await auth.signInWithEmailLink(email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');

          await this.$store.dispatch('getCurrentUser');
          this.$router.replace('/');
        } else {
          throw new Error('Whoops!');
        }
      } catch(e) {
        this.$store.commit('togglePageLoading', false);
        console.error(e);
        this.msg = 'Invalid confirmation code. Redirecting back...';

        setTimeout(() => {
          this.$router.replace('/');
        }, 1000);
      }
    }
  }
}
</script>