import { auth, db, getCurrentUser } from './firebase';

// state management
import { createStore } from 'vuex';

export const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      participantInfo: {
        docId: null,
        email: null,
        name: null,
        hasClaimed: false
      },
      isPageLoading: true,
    }
  },
  mutations: {
    setAuth(state, newState) {
      state.isAuthenticated = newState;
    },
    setParticipantInfo(state, newInfo) {
      state.participantInfo = {
        ...state.participantInfo,
        ...newInfo
      };
    },
    togglePageLoading(state, newState) {
      state.isPageLoading = newState;
    }
  },
  actions: {
    async logout({ commit, state }) {
      if (!state.isAuthenticated) {
        return;
      }

      commit('togglePageLoading', true);
      await auth.signOut();

      commit('setAuth', false);
      commit('setParticipantInfo', {
        email: null,
        name: null
      });
      
      commit('togglePageLoading', false);
    },
    async setAsClaimed({ state }) {
      if (!state.participantInfo.docId || state.hasClaimed) {
        return;
      }

      await db.collection('participants')
          .doc(state.participantInfo.docId)
          .update({ hasClaimed: true });
    },
    async getCurrentUser({ commit, state }) {
      try {
        if (state.isAuthenticated) {
          commit('togglePageLoading', false);
          return true;
        }

        const user = await getCurrentUser();
        if (user && user.emailVerified) {
          // get user details
          const query = db.collection('participants').where('email', '==', user.email).limit(1);
          const querySnapshot = await query.get();
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];

            commit('setAuth', true);
            commit('setParticipantInfo', {
              docId: doc.id ?? null,
              email: user.email,
              name: doc.get('name'),
              hasClaimed: doc.get('hasClaimed') ?? false
            });
          }
        } else {
          throw Error('Not logged in!');
        }
      } catch (e) {
        commit('setAuth', false);
      } finally {
        commit('togglePageLoading', false);
        return state.isAuthenticated;
      }
    }
  }
});