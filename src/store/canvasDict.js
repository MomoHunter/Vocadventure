import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export default {
  namespaced: true,
  state: {
    scene: null,
    camera: null,
    renderer: null,
    stats: null,
    animationActive: false,
    backgrounds: {
      'exparebrium_1': {
        glb: '/assets/objects/exparebrium_1.glb',
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        lights: [
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: 2.9,
              y: 0.3,
              z: -0.65
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 1,
              z: 0
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: 2.9,
              y: 0.25,
              z: -0.6
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 0,
              z: 1
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: 2.9,
              y: 0.2,
              z: -0.55
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 1,
              z: 0
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: 2.9,
              y: 0.15,
              z: -0.5
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 0,
              z: 1
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: -2.9,
              y: 0.3,
              z: -0.65
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 1,
              z: 0
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: -2.9,
              y: 0.25,
              z: -0.6
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 0,
              z: 1
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: -2.9,
              y: 0.2,
              z: -0.55
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 1,
              z: 0
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0x86e8de,
              intensity: 5,
              width: 1,
              height: 0.1
            },
            pos: {
              x: -2.9,
              y: 0.15,
              z: -0.5
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 0,
              z: 1
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0xc4b26b,
              intensity: 5,
              width: 1.1,
              height: 0.1
            },
            pos: {
              x: 1.15,
              y: 2.45,
              z: -0.6
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 0,
              z: 1
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0xc4b26b,
              intensity: 25,
              width: 1.1,
              height: 0.1
            },
            pos: {
              x: 1.15,
              y: 2.4,
              z: -0.65
            },
            lookAt: { // will be added to pos
              x: 0,
              y: -1,
              z: 0
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0xc4b26b,
              intensity: 5,
              width: 1.1,
              height: 0.1
            },
            pos: {
              x: -1.15,
              y: 2.45,
              z: -0.6
            },
            lookAt: { // will be added to pos
              x: 0,
              y: 0,
              z: 1
            }
          },
          {
            type: 'rect',
            constr: {
              color: 0xc4b26b,
              intensity: 25,
              width: 1.1,
              height: 0.1
            },
            pos: {
              x: -1.15,
              y: 2.4,
              z: -0.65
            },
            lookAt: { // will be added to pos
              x: 0,
              y: -1,
              z: 0
            }
          }
        ]
      }
    }
  },
  getters: {
    getBackgroundData: (state) => (id) => {
      return state.backgrounds[id]
    }
  },
  mutations: {
    initCanvas (state) {
      state.scene = new THREE.Scene()
      state.camera = new THREE.OrthographicCamera(-4, 4, 2, -2, 1, 1000)

      state.renderer = new THREE.WebGLRenderer()
      state.renderer.setSize(600, 300)
      state.renderer.outputEncoding = THREE.sRGBEncoding
      state.renderer.shadowMap.enabled = true
      state.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      document.getElementById('adventure-canvas').appendChild(state.renderer.domElement)
      state.stats = new Stats()
      document.getElementById('adventure-canvas').appendChild(state.stats.dom)
    },
    addToScene (state, obj) {
      state.scene.add(obj)
    },
    moveCamera (state, newPos) {
      state.camera.position.x += newPos.x
      state.camera.position.y += newPos.y
      state.camera.position.z += newPos.z
    }
  },
  actions: {

  }
}
