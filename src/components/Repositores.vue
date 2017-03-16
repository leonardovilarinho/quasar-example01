<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        {{owner.name}}
      </q-toolbar-title>
      <button @click="$refs.modalOwner.open()">
        <i>build</i>
      </button>
    </div>

    <div class="layout-view">
      <ul class="breadcrumb">
        <li><a><i>list</i> Lista de repositórios</a></li>
      </ul>

      <div v-if="owner.repositores.length > 0" class="list item-delimiter">
        <div class="item" v-for="rep in owner.repositores" @click="details(rep)">
          <div class="item-content">
            <p>
              {{rep.name}}
              <span style="float: right"><i>star</i> {{rep.stars}}</span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="owner.repositores.length <= 0">
        <p>Sem repositórios</p>
      </div>
    </div>


    <q-modal ref="modalOwner" position="right" :content-css="{padding: '30px'}">
      <strong>Trocar de organização</strong>
      <hr>
      <div class="floating-label">
        <input required v-model="owner.link" class="full-width">
        <label>Nome no link do GitHub</label>
        <button class="primary small full-width" @click="register()">
          Pesquisar repositórios
        </button>
      </div>
    </q-modal>
  </q-layout>
</template>

<script>
import { Loading, Toast } from 'quasar'
import { repositores } from '../resources/github'

export default {
  data () {
    return {
      owner: {
        name: 'Sem organização selecionada',
        link: '',
        repositores: []
      }
    }
  },
  created () {
    if ('owner' in this.$route.params) {
      this.owner.link = this.$route.params.owner
      setTimeout(() => {
        this.register()
      }, 500)
    }
  },
  methods: {
    register () {
      if (this.owner.link !== '') {
        this.owner.repositores = []
        this.$refs.modalOwner.close()
        Loading.show({ message: 'Procurando repositórios' })

        repositores(this.owner.link).then((result) => {
          result = result.data
          if (result.length > 0) {
            this.owner.name = result[0].owner.login
            for (var i = 0; i < result.length; i++) {
              this.owner.repositores.push({
                name: result[i].name,
                stars: result[i].stargazers_count,
                full: result[i].full_name
              })
            }
            Loading.hide()
          }
        }).catch(() => {
          Loading.hide()
          this.$refs.modalOwner.open()
          Toast.create({ html: 'Organização não foi encontrada ou o tempo limite expirou' })
        })
      }
    },
    details (r) {
      this.$router.push({name: 'details', params: {repository: r, owner: this.owner.link}})
    }
  }
}
</script>
