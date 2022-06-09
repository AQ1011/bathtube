import { Component, Input, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
  @Input() roomId!: string;
  url = 'http://localhost:4200/player/' + this.roomId;
  constructor(private _clipboardService: ClipboardService,private notification: NzNotificationService) { }

  ngOnInit(): void {
  }
  copy() {
    this._clipboardService.copy(this.url);
    this.notification.create('success',
          'Thông báo',
          'Copy to clipboard',
          { nzDuration: 1000  }
        );
  }

}
