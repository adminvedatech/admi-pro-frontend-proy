import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  getDate(date) {
    var parts = date.split("/")
    return new Date(parts[2], parts[1] - 1, parts[0]).toISOString().substring(0,10);
  }

}
