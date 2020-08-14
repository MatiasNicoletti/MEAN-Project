import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    enteredContent = '';
    enteredTitle = '';
    @Output() postCreated = new EventEmitter();
    // Output so the event is able to be listened on others compoentents

    onAddPost(){
       const post = {title: this.enteredTitle, content: this.enteredContent};
       this.postCreated.emit(post);
    }
}