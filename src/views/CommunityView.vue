<template>
    <v-container is-fluid>

        <v-lazy transition="fade-transition" v-model="communityStore.ready" :options="{threshold: .5}">
            <v-row>
                <v-col>

                </v-col>

                <v-col cols="8">
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    No
                                </th>
                                <th class="text-left">
                                    제목
                                </th>

                              <th class="text-left">
                                작성자
                              </th>

                                <th class="text-left" v-if="display.mdAndUp">
                                    작성일
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="post in communityStore.posts" :key="post.id">

                                <td>{{ post.id }}</td>
                                <td><v-list-item :to="{ path: `/community/${post.id}` }">
                                  {{ post.title }}
                                </v-list-item>
                                </td>
                                <td>{{ post.writer }}</td>
                                <td v-if="display.mdAndUp">{{ communityStore.formatDate(post.createdDate) }}</td>
                            </tr>
                        </tbody>


                    </v-table>

                  <v-col class="text-right">
                    <v-btn variant="outlined" to="/community/register">글쓰기</v-btn>
                  </v-col>


                  <v-pagination :length="4"></v-pagination>
                </v-col>

                <v-col>

                </v-col>
            </v-row>
        </v-lazy>
    </v-container>

</template>

<script>
import { useCommunityStore } from '@/store/community';

import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
    name: 'Community',
    data() {
        const display = ref(useDisplay());

        return {
            display
        }
    },


    setup() {
        const communityStore = useCommunityStore();

        communityStore.loadPostList(communityStore.lastLoadedId);

        return {
          communityStore,
        }
    },
}

</script>
