export default class Modals {
  static addEditTicketModal(type) {
    return `
    <div class="${type}-ticket-modal modal">
      <h3 class="${type}-ticket-modal__title modal-title">Добавить тикет</h3>
      <label class="${type}-ticket-modal__short-desc">
        <span class="ticket-short-desc">Краткое описание</span>
        <input type="text" class="ticket-short-desc-input">
      </label>
      <label class="${type}-ticket-modal__full-desc">
      <span class="ticket-full-desc">Подробное описание</span>
        <textarea class="ticket-full-desc-input"></textarea>
      </label>
      <div class="modal__footer">
        <span class="modal__cancel-button button">Отмена</span>
        <span class="modal__ok-button button">Ок</span>
      </div>
    </div>
    `;
  }

  static deleteTicketModal() {
    return `
    <div class="delete-ticket-modal modal">
      <span class="modal__delete-ticket">Вы уверены?</span>
      <div class="modal__footer">
        <span class="modal__cancel-button button">Отмена</span>
        <span class="modal__ok-button button">Ок</span>
      </div>
    </div>
    `;
  }
}
