export default class HelpDeskMarkups {
  constructor(container, modals) {
    this.container = container;
    this.modals = modals;
  }

  static get mainMarkup() {
    return `
      <span class="add-ticket-button button">Добавить тикет</span>
      <ul class="ticketlist"></ul>
    `;
  }

  static ticketMarkup(ticket, date, status = '') {
    return `
    <li data-id="${ticket.id}" class="ticketlist__item ticket">
      <div class="ticket-body">
        <span class="ticket__done-flag ${status}">\u2714</span>
        <span class="ticket__desk">${ticket.name}</span>
        <span class="ticket__creation-date">${date}</span>
        <span class="ticket__edit-button button">\u270E</span>
        <span class="ticket__delete-button button">\u274C</span>
      </div>
    </li>
  `;
  }

  render() {
    this.container.insertAdjacentHTML('beforeend', this.constructor.mainMarkup);
  }
}
