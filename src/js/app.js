document.addEventListener('DOMContentLoaded', () => {

  const modalElements = Array.from(document.querySelectorAll('[data-modal]'))

  modalElements.map((el) => {
    const modalId = el.dataset.modal
    const modal = document.querySelector(modalId)
    const modalClose = modal.querySelector('.js-modal-close')

    el.addEventListener('click', () => {
      showOverlay()
      modal.classList.add('modalIsShow')
      modalClose.addEventListener('click', () => {
        modal.classList.remove('modalIsShow')
        setTimeout(() => {
          hideOverlay()
        }, 300)
      })
    })
  })
})

const showOverlay = () => {
  const overlay = document.querySelector('.overlay')
  overlay.classList.add('overlayIsShow')
}

const hideOverlay = () => {
  const overlay = document.querySelector('.overlay')
  overlay.classList.remove('overlayIsShow')
}
