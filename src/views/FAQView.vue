<template>
    <v-container fluid>

        <div v-if="display.mdAndUp">
            <v-row>
                <v-col></v-col>
                <v-col cols="8">

                    <v-tabs v-model="tab" color="success" align-tabs="center">
                        <v-tab v-for="(item, i) in faqs" :key="i" :value="i">
                            {{ item.title }}
                        </v-tab>
                    </v-tabs>
                    <v-window v-model="tab">
                        <v-window-item v-for="(item, i) in faqs" :key="i">
                            <v-container fluid>

                                <component v-bind:is="item.page">

                                </component>

                            </v-container>
                        </v-window-item>
                    </v-window>

                </v-col>
                <v-col></v-col>
            </v-row>

        </div>



        <div v-else>
            <v-card v-for="(item, i) in faqs" :key="i" elevation="0">
                <v-lazy>
                    <component :is="item.page" class="mb-10"></component>
                </v-lazy>
            </v-card>

        </div>
    </v-container>
</template>


<script>

import GreyTile from '@/components/faq/GreyTile.vue'
import ServerError from '@/components/faq/ServerError.vue'

import { markRaw, ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
    name: 'FAQView',

    data() {
        const display = ref(useDisplay());

        return {
            faqs: [
                { page: markRaw(GreyTile), title: "회색 타일 섞임 현상", },
                { page: markRaw(ServerError), title: "서버 에러 문구 출력", },
            ],

            nowPage: markRaw(GreyTile),
            display,
            tab : "회색 타일 섞임 현상",
        }
    },


    methods: {

    }

}
</script>
