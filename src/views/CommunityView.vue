<template>
  <v-container is-fluid>
    <v-row v-if="display.mdAndUp">
      <v-col>

      </v-col>

      <v-col cols="8">
        <v-table class="text-body-1">

          <thead>
          <tr>
            <th class="text-left">
              No
            </th>

            <th class="text-left">
              작성자
            </th>

            <th class="text-left">
              제목
            </th>
  
            <th class="text-left">
              작성일
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="post in communityStore.posts" :key="post.id">

            <td>{{ post.id }}</td>

            <td>
              <v-chip variant="outlined">
                {{ post.writer }}
              </v-chip>
            </td>

            <td>
              <v-list-item :to="{ path: `/community/${post.id}` }">
                {{ post.title }}
                <template v-slot:append v-if="post.commentCount !== 0">
                  <v-badge
                    color="success"
                    :content="post.commentCount"
                    inline
                  ></v-badge>
                </template>
              </v-list-item>
            </td>
                
            <td>{{ communityStore.formatDateWithoutHour(post.createdDate) }}</td>
          </tr>
          </tbody>

        </v-table>
        <v-col class="text-right">
          <v-btn variant="outlined" to="/community/register">글쓰기</v-btn>
        </v-col>


        <v-pagination v-model="communityStore.nowPage" @click="communityStore.loadPostList(communityStore.nowPage)"
                      :length="communityStore.totalPage"></v-pagination>

      </v-col>

      <v-col>

      </v-col>
    </v-row>


    <v-row v-else>

      <v-col>

        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              제목
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="post in communityStore.posts" :key="post.id">
            <td>
              <v-list-item :to="{ path: `/community/${post.id}` }">
                {{ post.title }}
                <template v-slot:append v-if="post.commentCount !== 0">
                  <v-badge
                    color="success"
                    :content="post.commentCount"
                    inline
                  ></v-badge>
                </template>
              </v-list-item>
            </td>
          </tr>
          </tbody>

        </v-table>

        <v-col class="text-right">
          <v-btn variant="outlined" to="/community/register">글쓰기</v-btn>
        </v-col>


        <v-pagination v-model="communityStore.nowPage" @click="communityStore.loadPostList(communityStore.nowPage)"
                      :length="communityStore.totalPage"></v-pagination>

      </v-col>
    </v-row>
  </v-container>

</template>

<script>
import { useCommunityStore } from '@/store/community'

import { ref } from 'vue'
import { useDisplay } from 'vuetify'

export default {
  name: 'Community',
  data () {
    const display = ref(useDisplay())

    return {
      display
    }
  },

  setup () {
    const communityStore = useCommunityStore()

    return {
      communityStore,
    }
  },

  created () {
    this.communityStore.loadPostList(this.communityStore.nowPage)

  }
}

</script>
