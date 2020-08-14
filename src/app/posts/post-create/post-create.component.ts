import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    enteredContent = '';
    enteredTitle = '';
    // @Output() postCreated = new EventEmitter<Post>();
    // Output so the event is able to be listened on others compoentents
    constructor(private postsService: PostsService) { }

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return
        }
        //    this.postCreated.emit(post);
        this.postsService.addPost(form.value.titleInput, form.value.contentInput);
    }
}