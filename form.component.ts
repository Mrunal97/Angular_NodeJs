import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @ViewChild('f') formData: any;

  keywordData: string;
  minPrice: number;
  maxPrice: number;
  showKeywordWarning: boolean;
  showPriceWarning: boolean;
  showNoResultsWarning: boolean;

  serverPath = 'https://webtechassign8.uk.r.appspot.com/ebay?';
  //serverPath = 'http://localhost:8080/ebay?';
  items: any;

  p = 1;

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {
    this.items = [];
  }

  search() {
    this.items = [];
    let urlParams: string;
    if (this.validate()) {
      const model = this.formData.value;

      urlParams = `keyword=${encodeURIComponent(model.keyword)}&sortBy=${model['sort-order']}`;

      if (model.from) {
        urlParams += `&priceFrom=${model.from}`;
      }
      if (model.to) {
        urlParams += `&priceTo=${model.to}`;
      }

      if (model['return-accepted']) {
        urlParams += `&returnAccepted=${model['return-accepted']}`;
      }

      if (model.free) {
        urlParams += '&shipping=free';
      }
      if (model.expedited) {
        urlParams += '&shipping=expedited';
      }

      if (model.condition1000) {
        urlParams += '&condition=1000';
      }
      if (model.condition3000) {
        urlParams += '&condition=3000';
      }
      if (model.condition4000) {
        urlParams += '&condition=4000';
      }
      if (model.condition5000) {
        urlParams += '&condition=5000';
      }
      if (model.condition6000) {
        urlParams += '&condition=6000';
      }

      this.httpClient.get(this.serverPath + urlParams)
        .subscribe((result: []) => {
          if (result.length === 0) {
            this.showNoResultsWarning = true;
          } else {
            this.items = result;
          }
        });
    }
  }

  validate() {
    let valid = true;
    this.showKeywordWarning = false;
    this.showPriceWarning = false;
    if (!this.keywordData) {
      this.showKeywordWarning = true;
      valid = false;
    }
    if (this.minPrice < 0.0 || this.maxPrice < 0.0 || this.minPrice > this.maxPrice) {
      this.showPriceWarning = true;
      valid = false;
    }
    return valid;
  }

  clear() {
    this.showPriceWarning = false;
    this.showKeywordWarning = false;
    this.showNoResultsWarning = false;
    this.items = [];
  }
  funclick(i: any)
  {
    const buttonElement = document.getElementById('btn-' + i);
    const divElement = document.getElementById('collapse-' + i);
    const style =  divElement.style.display;
    if (style === 'none') {
      divElement.style.display = 'block';
      buttonElement.innerHTML = 'Hide Details';
    }
    if (style === 'block') {
      divElement.style.display = 'none';
      buttonElement.innerHTML = 'Show Details';
    }
  }

}
