interface Notification {
  message: string
  show: boolean
}

export const state: () => Notification = () => ({
  message: '',
  show: false
})

export const mutations = {
  setMessage(state: Notification, message: string) {
    state.message = message
    state.show = true
  },

  resetMessage(state: Notification) {
    state.message = ''
    state.show = false
  }
}