<template>
    <div :class="$isMobile() ? 'container is-fluid' : 'container'">
        <ContactForm />
    </div>
</template>


<script>
import ContactForm from '@/components/contact/ContactForm.vue';
export default {
    name: 'ContactView',

    components: {
        ContactForm,
    }
}
</script>