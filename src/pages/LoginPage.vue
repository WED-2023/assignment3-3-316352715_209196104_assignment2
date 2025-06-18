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
        <div v-if="v$.username.$dirty && v$.username.$error" class="text-danger">
          יש להזין שם משתמש
        </div>
      </div>

      <div class="form-group password-wrapper">
        <input
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="סיסמה"
          class="form-input"
        />
        <div
          :class="['toggle-password-icon', showPassword ? 'eye-slash' : 'eye']"
          @click="showPassword = !showPassword"
        ></div>
        <div v-if="v$.password.$dirty && v$.password.$error" class="text-danger">
          
          <span v-if="v$.password.$errors.find(e => e.$validator === 'required')">שדה חובה</span>
          <span v-if="v$.password.$errors.find(e => e.$validator === 'minLength')">
            סיסמה חייבת להכיל לפחות 6 תווים
          </span>

        </div>
      </div>

      <div v-if="serverError" class="text-danger">
        {{ serverError }}
      </div>
      <div v-if="alreadyLoggedInMessage" class="text-info">
  {{ alreadyLoggedInMessage }}
</div>
      <button type="submit" class="form-button mt-2">התחבר</button>
    </form>
  </FormWrapper>
</template>
<script>
import { reactive, ref, onMounted,getCurrentInstance, watch} from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import FormWrapper from "@/components/FormWrapper.vue";
import { useRouter } from 'vue-router';


export default {
  name: "LoginPage",
  components: { FormWrapper },
  setup(_, { expose }) {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      username: '',
      password: '',
    });
    const serverError = ref('');
    const showPassword = ref(false);
    const router = useRouter();
    const alreadyLoggedInMessage = ref('');


    watch(() => state.username, () => serverError.value = '');
    watch(() => state.password, () => serverError.value = '');



    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);

  const login = async () => {
  v$.value.$touch();
  serverError.value = '';

  if (await v$.value.$validate()) {
    try {
      const response = await proxy.axios.post('/auth/login', {
        username: state.username,
        password: state.password
      });

      if (response.status === 200) {
        if (window?.store?.login) 
          window.store.login(state.username);
        router.push('/');

      } else {
        serverError.value = `התחברות נכשלה – סטטוס לא צפוי (${response.status})`;
      }

    } catch (err) {
      const status = err.response?.status;
      const backendMessage = (err.response?.data?.message || '').toLowerCase();

      if (status === 401) {
        serverError.value = 'שם המשתמש או הסיסמה שגויים';
      } else if (status === 500) {
        serverError.value = 'שגיאת שרת – נסה שוב מאוחר יותר';
      } else if (backendMessage) {
        serverError.value = backendMessage;
      } else {
        serverError.value = `שגיאה לא ידועה (${status || '??'})`;
      }
    }
  }
};

      onMounted(async () => {
  try {
    const res = await proxy.axios.get('/users/me');
    if (res.status === 200 && res.data?.username) {
      alreadyLoggedInMessage.value = `כבר התחברת בתור ${res.data.username}`;
      if (window?.store?.login) {
        window.store.login(res.data.username);
      }
      setTimeout(() => {
        router.push('/');
      }, 2000); 
    }
  } catch (err) {
    console.debug("User is not logged in yet");
  }
});



    expose({ login });


    return { state, v$, login, showPassword,serverError,alreadyLoggedInMessage };
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

.password-wrapper {
  position: relative;
}

.toggle-password-icon {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition: opacity 0.2s;
}

.toggle-password-icon:hover {
  opacity: 0.7;
}

/* Eye icon - open eye */
.eye::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 12px;
  border: 2px solid #666;
  border-radius: 18px;
  top: 4px;
  left: 1px;
}

.eye::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  top: 6px;
  left: 6px;
}

/* Eye-slash icon - closed eye */
.eye-slash::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 12px;
  border: 2px solid #999;
  border-radius: 18px;
  top: 4px;
  left: 1px;
  opacity: 0.6;
}

.eye-slash::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background-color: #666;
  top: 9px;
  left: 0px;
  transform: rotate(-45deg);
}

.text-info {
  color: #007bff;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-align: right;
}

</style>
