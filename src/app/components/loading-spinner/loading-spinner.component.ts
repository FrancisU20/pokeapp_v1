import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  showLoader: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.hideLoader();
    }, 3000);
  }

  ngOnDestroy(): void {
    this.hideLoader();
  }

  hideLoader(): void {
    this.showLoader = false;
  }
}
