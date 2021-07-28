/* eslint-disable class-methods-use-this */
export default class Requests {
  constructor(host) {
    this.host = host;
  }

  getRequest(method) {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve) => {
      xhr.open('GET', `${this.host}?method=${method}`);
      xhr.send();
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      });
    });
  }

  postRequest(method, ticket) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    // eslint-disable-next-line guard-for-in
    for (const prop in ticket) {
      formData.append(prop, ticket[prop]);
    }
    return new Promise((resolve) => {
      xhr.open('POST', `${this.host}?method=${method}`);
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          resolve(xhr.response);
        }
      });
      xhr.send(formData);
    });
  }

  allTickets() {
    const method = 'allTickets';
    return this.getRequest(method);
  }

  ticketById(id) {
    const method = `ticketById&id=${id}`;
    return this.getRequest(method, id);
  }

  editTicket(id, data) {
    const method = `editTicket&id=${id}`;
    return this.postRequest(method, data);
  }

  statusChange(id) {
    const method = `statusChange&id=${id}`;
    return this.getRequest(method, id);
  }

  deleteTicket(id) {
    const method = `deleteTicket&id=${id}`;
    return this.getRequest(method, id);
  }

  addTicket(ticket) {
    const method = 'createTicket';
    return this.postRequest(method, ticket);
  }
}
