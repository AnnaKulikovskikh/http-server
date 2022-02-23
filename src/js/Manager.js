import Ticket from './Ticket';
import createRequest from './createRequest';

export default class Manager {
    constructor() {
        this.container = document.querySelector('.container');
        this.modal = document.querySelector('.modal');
        this.form = document.querySelector('.form');
    }

    init() {
        this.container.addEventListener('click', (event) => this.onClick(event));
        this.container.addEventListener('change', (event) => this.onChange(event));
        this.onLoading();
      }

      onLoading() {
        this.container.querySelector('ul').innerHTML = '';
        createRequest('GET', 'allTickets', null, {})
          .then((data) => {
            data.forEach((el) => {
              const {
                id, name, status, time,
              } = el;
              const ticket = new Ticket(id, name, status, time);
              this.container.querySelector('ul').append(ticket.createTicket());
            });
          })
          .catch((err) => { throw new Error(err); });
      }

      onClick(e) {
        if (e.target.classList.contains('add__ticket')) {
          this.openModal('Добавить тикет');
        }
    
        if (e.target.classList.contains('item__edit')) {
          const id = e.target.closest('.item').dataset.id;
          this.editTicket(id);
        }
    
        if (e.target.classList.contains('item__delete')) {
          const id = e.target.closest('.item').dataset.id;
          this.deleteTicket(id);
        }
    
        if (e.target.classList.contains('cansel')) {
          this.modal.classList.remove('active');
          this.form.reset();
        }
    
        if (e.target.classList.contains('ok')) {
          e.preventDefault();
          if (this.form.name.value !== '' && this.form.description.value !== '') {
            const body = Object.assign(this.getData(), { status: false, time: this.getTime() });
            if (this.form.dataset.id) {
              const id = this.form.dataset.id;
              this.addTicket(body, id);
            } else {
              this.addTicket(body, null);
            }
          } else {
            throw new Error('Empty field');
          }
        }
    
        if (e.target.classList.contains('item__name')) {
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.remove();
          } else {
            const id = e.target.closest('.item').dataset.id;
            this.getDescription(id, e.target);
          }
        }
      }


      onChange(e) {
        if (e.target.classList.contains('item__checkbox')) {
          const body = { status: e.target.checked };
          const id = e.target.closest('.item').dataset.id;
          this.addTicket(body, id);
        }
      }

      onChange(e) {
        if (e.target.classList.contains('item__checkbox')) {
          const body = { status: e.target.checked };
          const id = e.target.closest('.item').dataset.id;
          this.addTicket(body, id);
        }
      }

      addTicket(body, id) {
        if (id) {
          createRequest('POST', 'createTicket', id, body)
            .then((data) => {
              if (data) {
                this.form.reset();
                this.form.removeAttribute('data-id');
                this.modal.classList.remove('active');
                this.onLoading();
              }
            })
            .catch((err) => { throw new Error(err); });
        } else {
          createRequest('POST', 'createTicket', null, body)
            .then((data) => {
              if (data) {
                this.form.reset();
                this.modal.classList.remove('active');
                this.onLoading();
              }
            })
            .catch((err) => { throw new Error(err); });
        }
      }
    
      editTicket(id) {
        createRequest('GET', 'ticketById', id, {})
          .then((data) => {
            const { name, description } = data;
            this.openModal('Редактировать тикет');
            this.form.dataset.id = id;
            this.form.name.value = name;
            this.form.description.value = description;
          })
          .catch((err) => { throw new Error(err); });
      }
    
      getDescription(id, elem) {
        createRequest('GET', 'ticketById', id, {})
          .then((data) => {
            const { description } = data;
            this.addDescription(id, elem, description);
          })
          .catch((err) => { throw new Error(err); });
      }
    
      addDescription(id, elem, description) {
        const div = document.createElement('div');
        div.classList.add('item__description');
        div.textContent = description;
        elem.closest('.item__content').append(div);
      }
    
      openModal(title) {
        this.modal.classList.add('active');
        this.form.querySelector('.form-title').textContent = title;
      }
    
      getTime() {
        const date = new Date();
        const time = `${date.getDate()}.${date.getMonth() +1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        return time;
      }
    
      getData() {
        const formData = new FormData(this.form);
        const entries = formData.entries();
        const formDataobj = {};
    
        for (const key of entries) {
          formDataobj[key[0]] = key[1];
        }
    
        return formDataobj;
      }
    
      deleteTicket(id) {
        createRequest('DELETE', 'delTicketById', id, {})
          .then((data) => {
            if (data) {
              this.onLoading();
            }
          })
          .catch((err) => { throw new Error(err); });
      }
}