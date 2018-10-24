// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCR949QzZsf9_aWgdvIEewlEkeCVuVgZMI',
  authDomain: 'vuefire-a796e.firebaseapp.com',
  databaseURL: 'https://vuefire-a796e.firebaseio.com',
  projectId: 'vuefire-a796e',
  storageBucket: 'vuefire-a796e.appspot.com',
  messagingSenderId: '715238049530'
}
firebase.initializeApp(config)

var db = firebase.database(),
  auth = firebase.auth(),
  provider = new firebase.auth.GoogleAuthProvider()

Vue.component('todo-list', {
  template: '#todo-tpl',
  data () {
    return {
      nuevaTarea: null,
      editandoTarea: null
    }
  },

  methods: {
    agregarTarea (tarea) {
      db.ref('tareas/').push({
        titulo: tarea,
        completado: false,
        nombre: vm.usuarioActivo.displayName,
        avatar: vm.usuarioActivo.photoURL,
        uid: vm.usuarioActivo.uid
      })
      this.nuevaTarea = ''
    },
    editarTarea (tarea) {
      db.ref('tareas/' + tarea['.key']).update({
        titulo: tarea.titulo
      })
    },
    actualizarEstadoTarea (estado, tarea) {
      db.ref('tareas/' + tarea['.key']).update({
        completado: !!estado
      })
    },
    eliminarTarea (tarea) {
      //  this.tareas.splice(indice, 1)
      db.ref('tareas/' + tarea['.key']).remove()
    }
  },
  props: ['tareas','autentificado','usuarioActivo']
})

var vm = new Vue({
  el: '#app',
  created () {
    // RT database
    db.ref('tareas/').on('value', function (snapshot) {
      vm.tareas = []
      var objeto = snapshot.val()
      for (var propiedad in objeto) {
        vm.tareas.unshift({
          '.key': propiedad,
          completado: objeto[propiedad].completado,
          titulo: objeto[propiedad].titulo,
          avatar: objeto[propiedad].avatar, 
          nombre: objeto[propiedad].nombre, 
          uid: objeto[propiedad].uid ,
        })
      }
    })
    auth.onAuthStateChanged(function (user) {
      if (user) {
        console.info('Conectado:', user)
        vm.autentificado = true ;
        vm.usuarioActivo = user ;
      } else {
        console.warn('No conectado')
        vm.autentificado = false ;
        vm.usuarioActivo = null ;
      }
    })
  },
  data: {
    autentificado: false,
    usuarioActivo: null,
    tareas: []
    
  },
  methods: {
    conectar () {
      auth.signInWithPopup(provider).catch(function (error) {
        console.info('Error haciendo login', error) 
      })
    },
    desconectar () {
      auth.signOut().catch(function (error){
        console.error('Erro haciendo el logout',error)
       
      })
    }
  }

})
