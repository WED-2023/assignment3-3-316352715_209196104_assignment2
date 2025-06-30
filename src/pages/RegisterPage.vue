<template>
  <FormWrapper title="Register">
    <form @submit.prevent="register">

      <div class="form-group">
        <input v-model="state.firstName"
               type="text"
               placeholder="שם פרטי"
               class="form-input" />
        <div v-if="v$.firstName.$error" class="text-danger">שדה חובה</div>
      </div>

      <div class="form-group">
        <input v-model="state.lastName"
               type="text"
               placeholder="שם משפחה"
               class="form-input" />
        <div v-if="v$.lastName.$error" class="text-danger">שדה חובה</div>
      </div>

      <div class="form-group">
        <input v-model="state.username"
               type="text"
               placeholder="שם משתמש"
               class="form-input" />
        <div v-if="v$.username.$error" class="text-danger">
          <span v-if="v$.username.$errors.find(e => e.$validator === 'required')">שדה חובה</span>
          <span v-else-if="v$.username.$errors.find(e => e.$validator === 'minLength')">לפחות 3 תווים</span>
          <span v-else-if="v$.username.$errors.find(e => e.$validator === 'maxLength')">מקסימום 8 תווים</span>
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
        <div v-if="v$.password.$error" class="text-danger">
          <span v-if="v$.password.$errors.find(e => e.$validator === 'required')">שדה חובה</span>
              <span v-else-if="v$.password.$errors.find(e => e.$validator === 'minLength')">לפחות 5 תווים</span>
              <span v-else-if="v$.password.$errors.find(e => e.$validator === 'maxLength')">מקסימום 10 תווים</span>
              <span v-else-if="v$.password.$errors.find(e => e.$validator === 'hasNumber')">חייבת להכיל מספר</span>
              <span v-else-if="v$.password.$errors.find(e => e.$validator === 'hasSpecialChar')">חייבת להכיל תו מיוחד</span>
        </div>
      </div>

    <div class="form-group password-wrapper">
  <input
    v-model="state.confirmPassword"
    :type="showConfirmPassword ? 'text' : 'password'"
    placeholder="הקש שוב את הסיסמה"
    class="form-input"
  />
  <div
    :class="['toggle-password-icon', showConfirmPassword ? 'eye-slash' : 'eye']"
    @click="showConfirmPassword = !showConfirmPassword"
  ></div>
</div>


    <div v-if="v$.confirmPassword.$error" class="text-danger">
  <span v-if="v$.confirmPassword.$errors.find(e => e.$validator === 'required')">שדה חובה</span>
  <span v-else-if="v$.confirmPassword.$errors.find(e => e.$validator === 'sameAsPassword')">הסיסמאות לא תואמות</span>
</div>




      <div class="form-group">
        <input v-model="state.email"
               type="email"
               placeholder="דואר אלקטרוני"
               class="form-input" />
        <div v-if="v$.email.$error" class="text-danger">
          <span v-if="v$.email.$errors.find(e => e.$validator === 'required')">שדה חובה</span>
          <span v-else-if="v$.email.$errors.find(e => e.$validator === 'email')">אימייל לא תקני</span>
        </div>
      </div>

      <div class="form-group">
        <select v-model="state.country" class="form-input">
          <option value="" disabled>בחר מדינה</option>
          <option v-for="c in state.countries" :key="c">{{ c }}</option>
        </select>
        <div v-if="v$.country.$error" class="text-danger">שדה חובה</div>
      </div>
      <div v-if="serverError" class="text-danger">
          {{ serverError }}
      </div>

        <BaseButton type="register" htmlType="submit" class="mt-2">הירשם</BaseButton>
    </form>
  </FormWrapper>
</template>

<script>
import { reactive, onMounted, nextTick, ref, computed, getCurrentInstance } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength, email, sameAs } from '@vuelidate/validators'
import FormWrapper from "@/components/FormWrapper.vue"
import countries from "@/assets/countries.json";
import { useRouter } from 'vue-router';
import BaseButton from "@/components/BaseButton.vue";



export default {
  name: 'RegisterPage',
  components: { FormWrapper, BaseButton },
  setup() {
    const { proxy } = getCurrentInstance();
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const serverError = ref('');
    const router = useRouter();


    const state = reactive({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: '',
      countries: []
    });

    const passwordValue = computed(() => state.password);

    const rules = {
      username: { required, minLength: minLength(3), maxLength: maxLength(8) },
      firstName: { required },
      lastName: { required },
      email: { required, email },
      country: { required },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        hasNumber: value => /\d/.test(value) || 'הסיסמה חייבת להכיל לפחות מספר אחד',
        hasSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'הסיסמה חייבת להכיל תו מיוחד אחד לפחות'
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs(passwordValue, 'הסיסמאות לא תואמות')
      }
    };

    const v$ = useVuelidate(rules, state);

    onMounted(() => {
      state.countries = countries.map(c => c.name);
    });

    const register = async () => {
      serverError.value = '';
      v$.value.$touch();
      await nextTick();

      if (v$.value.$invalid) return;

      try {
        const response = await proxy.axios.post('/auth/register', {
        username: state.username,
        firstname: state.firstName,
        lastname: state.lastName,
        email: state.email,
        country: state.country,
        password: state.password
      }, {
      });

        if (response.status === 201) {
          router.push('/login');
        } else {
          serverError.value = 'ההרשמה נכשלה – סטטוס לא צפוי';
        }
      } catch (err) {
        const message = (err.response?.data?.message || '').toLowerCase();
        const status = err.response?.status || '';
        console.log(message,status)
        if (status === 409 && message.includes("username")) {
          serverError.value = 'שם המשתמש כבר קיים במערכת';
        } else if (status === 409 && message.includes("email")) {
          serverError.value = 'האימייל כבר רשום במערכת';
        } else if (status === 400) {
          serverError.value = err.response?.data?.errors?.[0]?.msg || 'שגיאה בפרטי ההרשמה';
        } else {
          serverError.value = `אירעה שגיאה לא צפויה (${status}). נסה שוב`;
        }
      }
    };

    return {
      state,
      v$,
      register,
      showPassword,
      showConfirmPassword,
      serverError
    };
  }
};
</script>


<style scoped>
.form-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}



.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-align: right;
}

.form-group {
  margin-bottom: 1rem;
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

/* Eye icon - open eye (improved design) */
.eye::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 12px;
  border: 2px solid #666;
  border-radius: 18px 18px 18px 18px;
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
  border-radius: 18px 18px 18px 18px;
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
</style>