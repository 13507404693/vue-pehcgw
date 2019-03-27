'use strict'
export default {
  data (){

  },
  methods: {
    consult: (key) => {
      if (sessionStorage.token) {
        let dicts = JSON.parse(sessionStorage.dicts), desired = {}
        for (let i in dicts) {
          if (dicts[i].type == key) {
            desired[dicts[i].value] = dicts[i].label
          }
        }
        return desired
      }
    }
  }
}
