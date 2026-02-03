<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: { type: String, default: 'primary' }, // primary, secondary, danger, ghost
    size: { type: String, default: 'md' }, // sm, md, lg
    block: { type: Boolean, default: false } // Full width
})

const classes = computed(() => {
    const base = 'btn'
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        ghost: 'btn-ghost'
    }
    const sizes = {
        sm: 'btn-sm',
        md: 'btn-md',
        lg: 'btn-lg'
    }
    return [base, variants[props.variant], sizes[props.size], props.block ? 'w-full' : ''].join(' ')
})
</script>

<template>
    <button :class="classes">
        <slot />
    </button>
</template>

<style scoped>
.btn {
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.w-full {
    width: 100%;
}

/* Variants */
.btn-primary {
    background: #0f172a;
    color: white;
}

.btn-primary:hover {
    background: #334155;
}

.btn-secondary {
    background: white;
    border: 1px solid #cbd5e1;
    color: #334155;
}

.btn-secondary:hover {
    background: #f1f5f9;
}

.btn-danger {
    background: #ef4444;
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}

.btn-ghost {
    background: transparent;
    color: #64748b;
}

.btn-ghost:hover {
    background: #f1f5f9;
    color: #0f172a;
}

/* Sizes */
.btn-sm {
    padding: 4px 10px;
    font-size: 0.75rem;
}

.btn-md {
    padding: 8px 16px;
    font-size: 0.9rem;
}

.btn-lg {
    padding: 12px 24px;
    font-size: 1.1rem;
}
</style>