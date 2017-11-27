import { Component, ViewChild, OnInit } from '@angular/core';
import {Book} from './book.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import _ from 'lodash';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  books: Book[] = [];
  newBookForm: FormGroup;
  error: string;
  modal: NgbModalRef;
  id: string;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private modalService: NgbModal) {
    this.newBookForm = this.formBuilder.group({
      'title': ['', [Validators.required]],
      'isbn': ['', [Validators.required]],
      'author': ['', [Validators.required]],
      'publication_date': ['', [Validators.required]],
      'publisher': ['', [Validators.required]],
      'price': ['', [Validators.required]],
      'genre': ['', [Validators.required]],
      'format': ['', [Validators.required]]
    })
  }
  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
  renderDate(book) {
    return moment(book.publication_date, 'DD/MM/YYYY').format('DD MMM YYYY')
  }
  editItem(content, book) {
    this.newBookForm.setValue(_.omit(book, ['id']))
    this.id = book.id;
    this.modal = this.modalService.open(content);
  }
  removeItem(book) {
    this.books = this.books.filter(b => b.id != book.id)
  }
  open(content) {
    this.id = null;
    this.newBookForm.reset()
    this.modal = this.modalService.open(content)
  }
  createNewBook(newBook: Book) {
    if(this.id) {
      var idx = _.findIndex(this.books, ['id', this.id])
      newBook.id = this.id;
      this.books = _.update(this.books, idx, _.constant(newBook))
    } else {
      newBook.id = this.generateUUID()
      this.books.push(newBook)
    }
    this.modal.close()
  }
  ngOnInit() {
    this.http.get('data.json').subscribe(data => {
      this.books = data.map(d => new Book(this.generateUUID(), d.title, d.author, d.isbn, d.publisher, d.format, d.publication_date, d.price, d.genre));
    })
  }

}
