/* eslint-disable no-case-declarations */
/* eslint-disable class-methods-use-this */
/* eslint-disable default-case */
import HelpDeskMarkups from './HelpDeskMarkups';
import Modals from './Modals';
import Requests from './Requests';

export default class HelpDesk {
  constructor(markups) {
    this.markups = markups;
    this.ticketlist = null;
    this.requests = new Requests('https://ahj-hp-back.herokuapp.com/');
    this.activeTicket = null;

    this.onClick = this.onClick.bind(this);
  }

  init() {
    this.markups.render();
    document.addEventListener('click', this.onClick);
    this.ticketlist = document.querySelector('.ticketlist');
    this.renderTickets();
  }

  renderTickets() {
    [...document.querySelectorAll('.ticketlist__item')].forEach((item) => item.remove());
    this.requests.allTickets().then((tickets) => tickets
      .forEach((item) => this.requests.ticketById(item.id)
        .then((ticket) => this.addTicketFromServer(ticket))));
  }

  onClick(event) {
    const addModal = event.target.closest('.add-ticket-modal');
    const editModal = event.target.closest('.edit-ticket-modal');
    const deleteModal = event.target.closest('.delete-ticket-modal');
    const modal = document.querySelector('.modal');
    const targetClassList = event.target.classList;
    if (modal) {
      switch (true) {
        case targetClassList.contains('modal__cancel-button'):
          this.closeModal(modal);
          break;
        case targetClassList.contains('modal__ok-button'):
          if (addModal) {
            const name = addModal.querySelector('.ticket-short-desc-input').value;
            const description = addModal.querySelector('.ticket-full-desc-input').value;
            this.saveNewTicket(name, description);
          } else if (editModal) {
            const name = editModal.querySelector('.ticket-short-desc-input').value;
            const description = editModal.querySelector('.ticket-full-desc-input').value;
            this.editTicket(this.activeTicket, name, description);
          } else if (deleteModal) {
            this.deleteTicket(this.activeTicket.dataset.id, modal);
          }
          break;
      }
    } else {
      // const ticket = event.target.closest('.ticketlist__item');
      this.activeTicket = event.target.closest('.ticketlist__item');
      let fullDesk;
      if (this.activeTicket) {
        fullDesk = this.activeTicket.querySelector('.ticket__full-desk');
      }
      switch (true) {
        case targetClassList.contains('add-ticket-button'):
          this.showAddEditTicketModal(event);
          break;
        case targetClassList.contains('ticket__done-flag'):
          this.doneTicket(event);
          break;
        case targetClassList.contains('ticket__edit-button'):
          this.showAddEditTicketModal(event);
          break;
        case targetClassList.contains('ticket__delete-button'):
          this.showDeleteTicketModal();
          break;
        case !!this.activeTicket:
          if (fullDesk) {
            fullDesk.remove();
          } else {
            this.ticketFullDescriptionToggle(event);
          }
          break;
      }
    }
  }

  async showAddEditTicketModal(event) {
    if (event.target.classList.contains('add-ticket-button')) {
      this.markups.container.insertAdjacentHTML('beforeend', Modals.addEditTicketModal('add'));
    } else if (event.target.classList.contains('ticket__edit-button')) {
      this.markups.container.insertAdjacentHTML('beforeend', Modals.addEditTicketModal('edit'));
      const modal = document.querySelector('.modal');
      const ticketName = this.activeTicket.querySelector('.ticket__desk').textContent;
      const ticketDesk = await this.requests
        .ticketById(this.activeTicket.dataset.id)
        .then((resolve) => resolve.description);
      modal.querySelector('.ticket-short-desc-input').value = ticketName;
      modal.querySelector('.ticket-full-desc-input').value = ticketDesk;
    }
  }

  showDeleteTicketModal() {
    this.markups.container.insertAdjacentHTML('beforeend', Modals.deleteTicketModal());
  }

  doneTicket() {
    this.requests.statusChange(this.activeTicket.dataset.id).then(() => this.renderTickets());
  }

  deleteTicket(id, modal) {
    this.requests.deleteTicket(id).then(() => {
      this.activeTicket.remove();
      this.closeModal(modal);
      this.renderTickets();
    });
  }

  ticketFullDescriptionToggle(event) {
    const ticket = event.target.closest('.ticket');
    const { id } = ticket.dataset;
    this.requests.ticketById(id).then((resolve) => {
      const desc = document.createElement('span');
      desc.textContent = resolve.description;
      desc.classList.add('ticket__full-desk');
      ticket.appendChild(desc);
    });
  }

  closeModal(modal) {
    modal.remove();
    this.activeTicket = null;
  }

  addTicketFromServer(ticket) {
    const date = new Date(ticket.created).toLocaleString();
    let ticketMarkup;
    // eslint-disable-next-line no-unused-expressions
    ticket.status
      ? (ticketMarkup = HelpDeskMarkups.ticketMarkup(ticket, date, 'done'))
      : (ticketMarkup = HelpDeskMarkups.ticketMarkup(ticket, date));
    this.ticketlist.insertAdjacentHTML('beforeend', ticketMarkup);
  }

  saveNewTicket(name, description) {
    const ticket = {
      name,
      description,
      status: false,
    };

    const modal = document.querySelector('.modal');
    if (modal) {
      this.closeModal(modal);
    }
    this.requests.addTicket(ticket).then(() => this.renderTickets());
  }

  editTicket(ticket, name, description) {
    const modal = document.querySelector('.modal');
    this.requests.ticketById(ticket.dataset.id).then((ticketFromServer) => {
      if (ticketFromServer.name === name && ticketFromServer.description === description) {
        this.closeModal(modal);
      } else {
        this.requests.editTicket(ticket.dataset.id, { name, description }).then(() => {
          this.closeModal(modal);
          this.renderTickets();
        });
      }
    });
  }
}
