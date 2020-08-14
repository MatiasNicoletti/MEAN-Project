import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    enteredContent = '';
    enteredTitle = '';
    @Output() postCreated = new EventEmitter<Post>();
    // Output so the event is able to be listened on others compoentents

    onAddPost(form: NgForm){
        if(form.invalid){
            return
        }
       const post: Post = {title: form.value.titleInput, content: form.value.contentInput};
       this.postCreated.emit(post);
    }
}