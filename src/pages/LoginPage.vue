<template>
  <FormWrapper title="Login">
    <form @submit.prevent="login">
      <div class="form-group">
        <input
          v-model="state.username"
          type="text"
          placeholder="שם משתמש"
          class="form-input"
        />
        <div v-if="v$.username.$error" class="text-danger">
          יש להזין שם משתמש
        </div>
      </div>

      <div class="form-group">
        <input
          v-model="state.password"
          type="password"
          placeholder="סיסמה"
          class="form-input"
        />
        <div v-if="v$.password.$error" class="text-danger">
          יש להזין סיסמה
                </div>
      </div>

      <button type="submit" class="form-button mt-2">התחבר</button>
    </form>
  </FormWrapper>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import FormWrapper from "@/components/FormWrapper.vue";

export default {
  name: "LoginPage",
  components: { FormWrapper },
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/login', {
            username: state.username,
            password: state.password
          });
          window.store.login(state.username);
          window.router.push('/main');
        } catch (err) {
          window.toast("התחברות נכשלה", err.response.data.message, "danger");
        }
      }
    };

    expose({ login });

    return { state, v$, login };
  }
};
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-button {
  width: 100%;
  background-color: #e76f51;
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-button:hover {
  background-color: #d3583c;
}

.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
  text-align: right;
}
</style>
