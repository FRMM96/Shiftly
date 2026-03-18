


<script setup>
import { computed, onMounted, ref } from 'vue'
import ManagerLayout from '../../components/layouts/ManagerLayout.vue'
import BaseButton from '../../components/shared/BaseButton.vue'
import { useUserStore } from '../../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const copied = ref(false)

onMounted(() => {
  userStore.fetchMe().catch(() => {})
})

const user = computed(() => userStore.user || {})
const company = computed(() => user.value.company || {})
const initials = computed(() => {
  const source = String(user.value.username || 'M').trim().split(/\s+/).slice(0, 2)
  return source.map(s => s[0]?.toUpperCase()).join('') || 'M'
})

async function copyInviteCode() {
  const code = company.value.inviteCode
  if (!code) return
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => (copied.value = false), 1800)
}

function logout() {
  userStore.logout()
  router.push('/home')
}
</script>

<template>
  <ManagerLayout>
    <div class="page-wrap">
      <div class="profile-card">
        <div class="hero">
          <div class="avatar">{{ initials }}</div>
          <div>
            <h1>{{ user.username || 'Manager' }}</h1>
            <p>{{ user.email || '—' }}</p>
            <span class="role-pill">{{ user.role || 'BOSS' }}</span>
          </div>
        </div>

        <div class="grid">
          <section class="card-section">
            <h2>Account Details</h2>
            <div class="row"><span>Username</span><strong>{{ user.username || '—' }}</strong></div>
            <div class="row"><span>Email</span><strong>{{ user.email || '—' }}</strong></div>
            <div class="row"><span>Role</span><strong>{{ user.role || '—' }}</strong></div>
            <div class="row"><span>Created</span><strong>{{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' }}</strong></div>
          </section>

          <section class="card-section">
            <h2>Company</h2>
            <div class="row"><span>Name</span><strong>{{ company.name || '—' }}</strong></div>
            <div class="row"><span>Total Users</span><strong>{{ company.totalUsers ?? '—' }}</strong></div>
            <div class="row"><span>Total Shifts</span><strong>{{ company.totalShifts ?? '—' }}</strong></div>
            <div class="row"><span>Created</span><strong>{{ company.createdAt ? new Date(company.createdAt).toLocaleDateString() : '—' }}</strong></div>
          </section>
        </div>

        <section class="invite-box">
          <div>
            <h2>Company Invite Code</h2>
            <p>Share this code with employees or additional managers so they join the correct company.</p>
          </div>
          <div class="invite-row">
            <div class="invite-code">{{ company.inviteCode || 'No invite code found' }}</div>
            <BaseButton variant="primary" size="sm" @click="copyInviteCode" :disabled="!company.inviteCode">
              {{ copied ? 'Copied!' : 'Copy code' }}
            </BaseButton>
          </div>
        </section>

        <div class="actions">
          <BaseButton variant="secondary" outline @click="router.push('/manager/shift')">Create Shift</BaseButton>
          <BaseButton variant="ghost" @click="logout">Log out</BaseButton>
        </div>
      </div>
    </div>
  </ManagerLayout>
</template>

<style scoped>
.page-wrap{max-width:980px;margin:0 auto}.profile-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:2rem;box-shadow:0 10px 24px rgba(15,23,42,.06)}
.hero{display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem}.avatar{width:84px;height:84px;border-radius:999px;background:#0f172a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:800}.hero h1{margin:0 0 .25rem;font-size:1.8rem}.hero p{margin:0 0 .5rem;color:#64748b}.role-pill{display:inline-block;background:#e0f2fe;color:#075985;border-radius:999px;padding:.3rem .7rem;font-size:.85rem;font-weight:700}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}.card-section{border:1px solid #e2e8f0;border-radius:14px;padding:1rem}.card-section h2,.invite-box h2{margin:0 0 1rem}.row{display:flex;justify-content:space-between;gap:1rem;padding:.7rem 0;border-bottom:1px solid #f1f5f9}.row:last-child{border-bottom:none}
.row span{color:#64748b}.invite-box{border:1px solid #e2e8f0;border-radius:14px;padding:1rem;margin-top:1rem}.invite-box p{color:#64748b;margin:.35rem 0 1rem}.invite-row{display:flex;gap:.75rem;align-items:center}.invite-code{flex:1;background:#0f172a;color:#fff;border-radius:12px;padding:.9rem 1rem;font-weight:800;letter-spacing:.08em}.actions{display:flex;gap:.75rem;justify-content:flex-end;margin-top:1.25rem}
@media (max-width:700px){.grid{grid-template-columns:1fr}.invite-row,.actions,.hero{flex-direction:column;align-items:flex-start}.invite-code{width:100%}}
</style>
