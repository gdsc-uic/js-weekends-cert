<template>
  <div class="container">
    <img src="../assets/js_weekends_logo.svg" class="logo">
    <section class="card">
      <div v-show="isProcessing" class="card-loading-spinner">
        <LoadingSpinner />
      </div>
      <h2>Claim your certificate</h2>

      <section v-if="isEmailSent" class="section">
        <p>Authentication link has been sent to:<br/><b>{{ email }}</b><br/><br/> Please close this tab and check your inbox.</p>

        <button class="button is-danger" @click="clearForm">Go back</button>
      </section>

      <form v-else-if="!$store.state.isAuthenticated" class="sign-in-form" @submit="login">
        <label for="email">Enter your e-mail</label>
        <input 
          v-model="email"
          type="email" 
          name="email" 
          id="email" 
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" 
          title="Please enter a valid e-mail address."
          placeholder="johndoe@example.com" 
          required 
          :disabled="isProcessing" />
        <span v-if="hasMsg" class="input-warning">{{ msg }}</span>
        <span v-else class="input-hint">Hint! Use the e-mail address you have used when signing up for the event.</span>
        <button class="button is-primary" :disabled="isProcessing">Sign in</button>
      </form>

      <section v-else class="section">
        <p>You are currently signed in as <b>{{ $store.state.participantInfo.email }}</b>.</p>

        <router-link class="button is-secondary" to="/cert">Claim certificate</router-link>
        <button class="button is-danger" @click="logout" :disabled="isProcessing">Sign out</button>
      </section>
    </section>

    <img src="../assets/presentor_logos.png" class="presenter-logos" alt="Davao JS, DSC UIC, UIC SITES">
  </div>
</template>

<script>
import { db, auth } from '../firebase';
import LoadingSpinner from '../components/LoadingSpinner.vue';

export default {
  components: {
    LoadingSpinner
  },
  data() {
    return {
      email: null,
      isProcessing: false,
      hasMsg: false,
      isEmailSent: false,
      msg: ''
    }
  },
  methods: {
    clearForm() {
      this.isEmailSent = false;
      this.email = null;
      this.msg = '';
    },

    async participantExists() {
      if (!this.email) return false;
      const query = db.collection('participants').where('email', '==', this.email);

      try {
        const doc = await query.get();

        // false if empty, true if not
        return !doc.empty;
      } catch (e) {

        console.error(e);
        return false;
      }
    },

    async login(e) {
      e.preventDefault();

      this.isProcessing = true;
      this.hasMsg = false;
      const participantInDB = await this.participantExists();

      if (participantInDB) {
        try {
          await auth.sendSignInLinkToEmail(this.email, {
            url: `${window.location.origin}/confirm`,
            handleCodeInApp: true
          });

          // separate view
          this.isEmailSent = true;
          window.localStorage.setItem('emailForSignIn', this.email);
        } catch(e) {
          console.error(e);
        } finally {
          this.isProcessing = false;
        }
      } else {
        this.isProcessing = false;
        this.hasMsg = true;
        this.msg = `E-mail ${this.email} was not found in our records! Please double check your e-mail.`;
      }
    },

    async logout() {
      await this.$store.dispatch('logout');
    }
  }
}
</script>

<style scoped>
.container {
  height: 83vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 0;
}

.logo {
  width: 20rem;
  filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, 1));
}

.card {
  position: relative;
  background: #fff;
  width: 75%;
  color: #000;
  border-radius: 10px;
  padding: 2rem 1.8rem;
  display: flex;
  flex-direction: column;
}

.card .card-loading-spinner {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: inherit;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.23), 0 3px 12px rgba(0, 0, 0, 0.16);
}
.card h2 {
  text-align: center;
  margin-top: 0;
}

.section {
  display: flex;
  flex-direction: column;
  text-align: center;
  word-break: break-word;
}

.section .button:not(:last-child) {
  margin-bottom: 0.5rem;
}

.sign-in-form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.sign-in-form label[for="email"] {
  text-align: left;
  margin-bottom: 0.5rem;
  color: rgb(50, 50, 50);
}

.sign-in-form input {
  padding: 0.8rem 1rem;
  border-radius: 4px;
  border: rgba(0, 0, 0, 0.5) 1px solid;
  margin-bottom: 0.5rem;
}

.sign-in-form .input-warning,
.sign-in-form .input-hint {
  margin-bottom: 1rem;
  text-align: left;
  font-size: 0.9rem;
  font-weight: 600;
}

.sign-in-form .input-warning {
  color: #ff5555;
}

.sign-in-form .input-hint {
  color: rgb(117, 117, 117);
}

.presenter-logos {
  width: 75%;
  margin-top: auto;
}

@media screen and (min-width: 640px) {
  .logo {
    width: 25rem;
  }

  .card {
    width: 20rem;
  }

  .presenter-logos {
    width: 50%;
  }
}

@media screen and (min-width: 1024px) {
  .logo {
    width: 30rem;
  }

  .card {
    width: 30%;
  }

  .presenter-logos {
    width: 35%;
  }
}

@media screen and (min-width: 1280px) {
  .card {
    width: 23rem;
  }

  .presenter-logos {
    width: 25%; 
  }
}
</style>