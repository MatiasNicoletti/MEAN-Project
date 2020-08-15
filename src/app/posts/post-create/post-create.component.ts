import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
    enteredContent = '';
    enteredTitle = '';
    private mode = 'create';
    private postId:string;
    private post:Post;
    // @Output() postCreated = new EventEmitter<Post>();
    // Output so the event is able to be listened on others compoentents
    constructor(private postsService: PostsService, private route: ActivatedRoute) { }

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('id')){
                this.mode = 'edit';
                this.postId = paramMap.get('id');
                this.post = this.postsService.getPost(this.postId);
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return
        }
        //    this.postCreated.emit(post);
        this.postsService.addPost(form.value.titleInput, form.value.contentInput);
        form.resetForm();
    }
}