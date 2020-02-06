import { Component, OnInit } from '@angular/core';
import { Database } from '@paperweight/database';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'integration';

    constructor() {

    }

    ngOnInit(): void {
        const db = new Database('test', 1);
        db.connect().then(() => {
            console.log(db);
        });
    }
}
